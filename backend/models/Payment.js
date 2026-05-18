import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    paymentProvider: {
      type: String,
      enum: ['stripe', 'razorpay'],
      required: true,
    },
    sessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    orderId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'complete', 'failed'],
      default: 'pending',
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Payment', paymentSchema);
