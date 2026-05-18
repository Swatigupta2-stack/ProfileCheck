import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Payment from '../models/Payment.js';

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const RAZORPAY_AMOUNT = 10000;
const RAZORPAY_CURRENCY = 'INR';

export async function createRazorpayOrder(userId, email) {
  try {
    const options = {
      amount: RAZORPAY_AMOUNT,
      currency: RAZORPAY_CURRENCY,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: userId,
        email: email,
      },
    };

    const order = await razorpay.orders.create(options);

    // Upsert the user so a MongoDB record exists for this userId
    await User.findOneAndUpdate(
      { userId: userId },
      { email: email },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await Payment.create({
      userId: userId,
      paymentProvider: 'razorpay',
      orderId: order.id,
      amount: RAZORPAY_AMOUNT / 100,
      currency: RAZORPAY_CURRENCY,
      status: 'pending',
    });

    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    console.error('[Razorpay Service] Create Order Error:', error);
    throw error;
  }
}

export async function verifyRazorpayPayment(orderId, paymentId, signature) {
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === signature) {
      const payment = await Payment.findOne({ orderId: orderId });
      if (!payment) {
        throw new Error('Payment not found');
      }

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Fetch payment details to store the payment method used
      let paymentMethod = 'unknown';
      try {
        const paymentDetails = await razorpay.payments.fetch(paymentId);
        if (paymentDetails && paymentDetails.method) {
          paymentMethod = paymentDetails.method;
        }
      } catch (err) {
        console.error('Error fetching Razorpay payment details:', err);
      }

      await User.findOneAndUpdate(
        { userId: payment.userId },
        {
          subscriptionTier: 'pro',
          subscriptionExpiryDate: expiryDate,
        },
        { new: true }
      );

      await Payment.findOneAndUpdate(
        { orderId: orderId },
        {
          paymentId: paymentId,
          status: 'complete',
          paymentMethod: paymentMethod,
          paymentDate: new Date(),
        }
      );

      return { success: true, message: 'Payment verified successfully' };
    } else {
      await Payment.findOneAndUpdate(
        { orderId: orderId },
        { status: 'failed' }
      );
      throw new Error('Invalid payment signature');
    }
  } catch (error) {
    console.error('[Razorpay Service] Verify Payment Error:', error);
    throw error;
  }
}

export default {
  createRazorpayOrder,
  verifyRazorpayPayment,
};
