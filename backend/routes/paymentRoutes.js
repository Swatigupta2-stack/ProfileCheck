import express from 'express';
import { 
  createRazorpayOrderController, 
  verifyRazorpayPaymentController 
} from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-razorpay-order', createRazorpayOrderController);
router.post('/verify-razorpay', verifyRazorpayPaymentController);

export default router;
