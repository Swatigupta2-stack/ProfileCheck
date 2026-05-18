import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  userId: 'user_demo_001',
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: {
    technical: [],
    soft: [],
    tools: [],
    languages: [],
  },
  projects: [],
  templateId: 'modern',
  atsScore: 75,
  isDraft: true,
  isDirty: false,
  lastSaved: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    updatePersonal: (state, action) => {
      state.personal = { ...state.personal, ...action.payload };
      state.isDirty = true;
    },
    updateSummary: (state, action) => {
      state.summary = action.payload.slice(0, 500);
      state.isDirty = true;
    },
    addExperience: (state) => {
      state.experience.push({
        id: nanoid(),
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        achievements: [],
      });
      state.isDirty = true;
    },
    removeExperience: (state, action) => {
      state.experience = state.experience.filter((exp) => exp.id !== action.payload);
      state.isDirty = true;
    },
    updateExperience: (state, action) => {
      const { id, field, value } = action.payload;
      const exp = state.experience.find((e) => e.id === id);
      if (exp) {
        exp[field] = value;
        state.isDirty = true;
      }
    },
    addEducation: (state) => {
      state.education.push({
        id: nanoid(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      });
      state.isDirty = true;
    },
    removeEducation: (state, action) => {
      state.education = state.education.filter((edu) => edu.id !== action.payload);
      state.isDirty = true;
    },
    updateEducation: (state, action) => {
      const { id, field, value } = action.payload;
      const edu = state.education.find((e) => e.id === id);
      if (edu) {
        edu[field] = value;
        state.isDirty = true;
      }
    },
    updateSkills: (state, action) => {
      const { category, tags } = action.payload;
      state.skills[category] = tags;
      state.isDirty = true;
    },
    addProject: (state) => {
      state.projects.push({
        id: nanoid(),
        name: '',
        description: '',
        technologies: [],
        link: '',
      });
      state.isDirty = true;
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter((proj) => proj.id !== action.payload);
      state.isDirty = true;
    },
    updateProject: (state, action) => {
      const { id, field, value } = action.payload;
      const proj = state.projects.find((p) => p.id === id);
      if (proj) {
        proj[field] = value;
        state.isDirty = true;
      }
    },
    loadResume: (state, action) => {
      return { ...action.payload, isDirty: false };
    },
    markSaved: (state) => {
      state.isDirty = false;
      state.lastSaved = new Date().toISOString();
    },
    setTemplate: (state, action) => {
      state.templateId = action.payload;
    },
    setATSScore: (state, action) => {
      state.atsScore = action.payload;
    },
  },
});

export const {
  updatePersonal,
  updateSummary,
  addExperience,
  removeExperience,
  updateExperience,
  addEducation,
  removeEducation,
  updateEducation,
  updateSkills,
  addProject,
  removeProject,
  updateProject,
  loadResume,
  markSaved,
  setTemplate,
  setATSScore,
} = resumeSlice.actions;

export default resumeSlice.reducer;
