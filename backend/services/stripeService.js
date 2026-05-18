import Stripe from 'stripe';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const STRIPE_AMOUNT = 120;
const STRIPE_CURRENCY = 'usd';

export async function createCheckoutSession(userId, email) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: STRIPE_CURRENCY,
            product_data: {
              name: 'Zaalima Pro',
              description: '30 days of unlimited resumes and all templates',
            },
            unit_amount: STRIPE_AMOUNT,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
      metadata: {
        userId: userId,
      },
    });
    
    await Payment.create({
      userId: userId,
      paymentProvider: 'stripe',
      sessionId: session.id,
      amount: session.amount_total / 100,
      currency: session.currency,
      status: 'pending',
    });

    return session;
  } catch (error) {
    console.error('[Stripe Service] Create Session Error:', error);
    throw error;
  }
}

export async function handleWebhook(rawBody, signature) {
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`[Stripe Webhook] Signature verification failed:`, err.message);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;

    default:
      console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
  }

  return event;
}

async function handleCheckoutSessionCompleted(session) {
  const userId = session.metadata.userId;

  console.log(`[Stripe Webhook] Upgrading user ${userId} to Pro...`);

  try {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    await User.findOneAndUpdate(
      { userId: userId },
      { 
        subscriptionTier: 'pro', 
        subscriptionExpiryDate: expiryDate,
        stripeCustomerId: session.customer,
      },
      { new: true }
    );
    console.log(`✓ User ${userId} successfully upgraded to Pro`);
    
    await Payment.findOneAndUpdate(
      { sessionId: session.id },
      { 
        status: 'complete', 
        paymentDate: new Date(),
        paymentMethod: 'card',
      }
    );
  } catch (error) {
    console.error(`✗ Failed to upgrade user ${userId}:`, error);
  }
}

export async function getSession(sessionId) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('[Stripe Service] Get Session Error:', error);
    throw error;
  }
}

export default {
  createCheckoutSession,
  handleWebhook,
  getSession,
};
