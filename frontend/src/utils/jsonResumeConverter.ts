import { ResumeData } from "@/types/resume";

export const convertToJsonResumeSchema = (appData: ResumeData) => {
  return {
    basics: {
      name: appData.personalInfo.fullName,
      label: appData.personalInfo.title || "",
      email: appData.personalInfo.email,
      phone: appData.personalInfo.phone,
      location: {
        address: appData.personalInfo.location,
        city: appData.personalInfo.location.split(',')[0]?.trim() || "",
        countryCode: "US"
      },
      profiles: [
        {
          network: "LinkedIn",
          url: appData.personalInfo.linkedin || ""
        },
        {
          network: "GitHub",
          url: appData.personalInfo.github || ""
        }
      ],
      summary: appData.summary || ""
    },
    work: appData.experience.map(exp => ({
      name: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || "Present",
      summary: exp.description,
      highlights: exp.description.split('\n').filter(l => l.trim().startsWith('-')).map(l => l.replace('-', '').trim())
    })),
    education: appData.education.map(edu => ({
      institution: edu.institution,
      area: edu.field,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate
    })),
    skills: Array.isArray(appData.skills) 
      ? [{ name: "Skills", keywords: appData.skills }]
      : Object.entries(appData.skills).map(([category, keywords]) => ({
          name: category,
          keywords: keywords as string[]
        })),
    projects: appData.projects.map(proj => ({
      name: proj.name,
      description: proj.description,
      url: proj.link,
      keywords: proj.technologies ? proj.technologies.split(',').map(s => s.trim()) : []
    }))
  };
};
