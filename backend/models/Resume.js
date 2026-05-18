import mongoose from 'mongoose';

const experienceSchema = new mongoose.Schema({
  id: String,
  company: String,
  position: String,
  location: String,
  startDate: String,
  endDate: String,
  current: Boolean,
  achievements: [String],
});

const educationSchema = new mongoose.Schema({
  id: String,
  institution: String,
  degree: String,
  field: String,
  startDate: String,
  endDate: String,
  gpa: String,
});

const projectSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  technologies: [String],
  link: String,
});

const skillsSchema = new mongoose.Schema({
  technical: [String],
  soft: [String],
  tools: [String],
  languages: [String],
});

const personalSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  location: String,
  linkedin: String,
  portfolio: String,
  title: String,
});

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    personal: personalSchema,
    summary: {
      type: String,
      maxlength: 500,
    },
    experience: [experienceSchema],
    education: [educationSchema],
    skills: skillsSchema,
    projects: [projectSchema],
    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Resume', resumeSchema);
