import mongoose from 'mongoose';

const coverLetterSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: false,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('CoverLetter', coverLetterSchema);
