import { ResumeData } from "@/types/resume";

export const softwareEngineerTemplate: ResumeData = {
  personalInfo: {
    fullName: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexjohnson",
    github: "github.com/alexjohnson",
  },
  education: [
    {
      id: "1",
      institution: "Stanford University",
      degree: "Bachelor of Science",
      field: "Computer Science",
      startDate: "2018-09",
      endDate: "2022-05",
      gpa: "3.8/4.0",
    },
  ],
  experience: [
    {
      id: "1",
      company: "Tech Corp",
      position: "Senior Software Engineer",
      startDate: "2022-06",
      endDate: "",
      current: true,
      description:
        "• Led development of microservices architecture serving 1M+ users\n• Reduced API response time by 40% through optimization\n• Mentored 5 junior developers and conducted code reviews",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "AWS",
    "Docker",
    "Git",
  ],
  projects: [
    {
      id: "1",
      name: "E-Commerce Platform",
      description:
        "Built a full-stack e-commerce platform with real-time inventory management",
      technologies: "React, Node.js, MongoDB, Stripe",
      link: "github.com/alexjohnson/ecommerce",
    },
  ],
};

export const designerTemplate: ResumeData = {
  personalInfo: {
    fullName: "Sarah Chen",
    email: "sarah.chen@email.com",
    phone: "+1 (555) 987-6543",
    location: "New York, NY",
    linkedin: "linkedin.com/in/sarahchen",
    portfolio: "sarahchen.design",
  },
  education: [
    {
      id: "1",
      institution: "Rhode Island School of Design",
      degree: "Bachelor of Fine Arts",
      field: "Graphic Design",
      startDate: "2017-09",
      endDate: "2021-05",
      gpa: "3.9/4.0",
    },
  ],
  experience: [
    {
      id: "1",
      company: "Design Studio Inc",
      position: "Senior UI/UX Designer",
      startDate: "2021-07",
      endDate: "",
      current: true,
      description:
        "• Redesigned mobile app increasing user engagement by 60%\n• Created design system used across 15+ products\n• Conducted user research with 200+ participants",
    },
  ],
  skills: [
    "Figma",
    "Adobe Creative Suite",
    "UI Design",
    "UX Research",
    "Prototyping",
    "User Testing",
  ],
  projects: [
    {
      id: "1",
      name: "Banking App Redesign",
      description:
        "Complete redesign of mobile banking app with focus on accessibility",
      technologies: "Figma, Adobe XD, Principle",
    },
  ],
};

export const businessTemplate: ResumeData = {
  personalInfo: {
    fullName: "Michael Rodriguez",
    email: "m.rodriguez@email.com",
    phone: "+1 (555) 246-8135",
    location: "Chicago, IL",
    linkedin: "linkedin.com/in/michaelrodriguez",
  },
  education: [
    {
      id: "1",
      institution: "Harvard Business School",
      degree: "Master of Business Administration",
      field: "Strategy & Operations",
      startDate: "2019-09",
      endDate: "2021-05",
    },
  ],
  experience: [
    {
      id: "1",
      company: "Global Consulting Group",
      position: "Senior Business Analyst",
      startDate: "2021-06",
      endDate: "",
      current: true,
      description:
        "• Led strategic initiatives resulting in $5M cost savings\n• Managed cross-functional teams of 10+ members\n• Developed financial models for Fortune 500 clients",
    },
  ],
  skills: [
    "Strategic Planning",
    "Financial Analysis",
    "Project Management",
    "Data Analytics",
    "Excel",
    "SQL",
  ],
  projects: [
    {
      id: "1",
      name: "Market Entry Strategy",
      description:
        "Developed go-to-market strategy for client entering Asian markets",
      technologies: "Market Research, Financial Modeling, Stakeholder Management",
    },
  ],
};
