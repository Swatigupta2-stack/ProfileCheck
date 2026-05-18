// backend/controllers/payment.controller.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User.model');

class PaymentController {
  async createCheckoutSession(req, res) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'CareerForge Pro Subscription',
                description: 'Unlimited resumes, cover letters, and premium templates'
              },
              unit_amount: 999, // $9.99
              recurring: {
                interval: 'month'
              }
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/pricing`,
        customer_email: req.user.email,
        metadata: {
          userId: req.user.id
        }
      });
      
      res.json({
        success: true,
        sessionId: session.id,
        url: session.url
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async handleWebhook(req, res) {
    const sig = req.headers['stripe-signature'];
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await User.findByIdAndUpdate(session.metadata.userId, {
          subscriptionTier: 'pro',
          subscriptionId: session.subscription
        });
        break;
        
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        await User.findOneAndUpdate(
          { subscriptionId: subscription.id },
          { subscriptionTier: 'free', subscriptionId: null }
        );
        break;
    }
    
    res.json({ received: true });
  }

  async getSubscriptionStatus(req, res) {
    try {
      const user = await User.findById(req.user.id);
      res.json({
        success: true,
        tier: user.subscriptionTier,
        isPro: user.subscriptionTier === 'pro'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new PaymentController();