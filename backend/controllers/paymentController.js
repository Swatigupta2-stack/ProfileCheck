import { createRazorpayOrder, verifyRazorpayPayment } from '../services/razorpayService.js';

export async function createRazorpayOrderController(req, res) {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({
        success: false,
        error: 'userId and email are required',
      });
    }

    const orderData = await createRazorpayOrder(userId, email);

    res.json(orderData);
  } catch (error) {
    console.error('Razorpay Create Order Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create Razorpay order',
      details: error.message,
    });
  }
}

export async function verifyRazorpayPaymentController(req, res) {
  try {
    const { orderId, paymentId, signature } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        error: 'orderId, paymentId, and signature are required',
      });
    }

    const result = await verifyRazorpayPayment(orderId, paymentId, signature);

    res.json(result);
  } catch (error) {
    console.error('Razorpay Verify Payment Controller Error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment',
      details: error.message,
    });
  }
}

export default {
  createRazorpayOrderController,
  verifyRazorpayPaymentController,
};
