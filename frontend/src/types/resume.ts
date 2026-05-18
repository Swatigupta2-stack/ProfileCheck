export interface PersonalInfo {
  fullName: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  photo?: string | null;
}

export interface Education {
  id: string;
  institution: string;
  school?: string; // Compatibility with example data
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  startYear?: string; // Compatibility
  endYear?: string; // Compatibility
  gpa?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  title?: string; // Compatibility
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements?: string[]; // Structured achievements
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link?: string;
}

export interface ResumeSkills {
  technical: string[];
  soft: string[];
  tools: string[];
  languages: string[];
}

export type LayoutType = 'single-column' | 'two-column' | 'sidebar';

export interface ResumeData {
  templateId: string;
  personalInfo: PersonalInfo;
  summary?: string;
  education: Education[];
  experience: Experience[];
  skills: string[] | ResumeSkills;
  projects: Project[];
  customPrimaryColor?: string;
  customFontFamily?: string;
  customLayoutType?: LayoutType | 'json-resume';
}

export const getEmptyResume = (): ResumeData => ({
  templateId: 'modern-1',
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
});
