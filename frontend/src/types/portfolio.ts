export interface PortfolioData {
  personalInfo: {
    fullName: string;
    tagline: string;
    email: string;
    phone: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  about: string;
  skills: string[];
  projects: Array<{
    id: string;
    title: string;
    description: string;
    technologies: string;
    link?: string;
    image?: string;
  }>;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    year: string;
  }>;
}

export const getEmptyPortfolio = (): PortfolioData => ({
  personalInfo: {
    fullName: '',
    tagline: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
  },
  about: '',
  skills: [],
  projects: [],
  experience: [],
  education: [],
});
