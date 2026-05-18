import { ResumeData } from '@/types/resume';

export const jsonResumeTemplates = {
  classy: {
    id: 'classy',
    name: 'Classy',
    category: 'Executive',
    description: 'Elegant design for senior professionals'
  },
  eloquent: {
    id: 'eloquent',
    name: 'Eloquent',
    category: 'Modern',
    description: 'Persuasive theme for developers'
  },
  compact: {
    id: 'compact',
    name: 'Compact',
    category: 'Technical',
    description: 'Space-efficient for experienced professionals'
  },
  paper: {
    id: 'paper',
    name: 'Paper',
    category: 'Academic',
    description: 'Simple paper-like theme'
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket',
    category: 'Creative',
    description: 'Bold and modern design'
  }
};

// Convert my app's resume data to JSON Resume format
export function convertToJSONResume(myResumeData: ResumeData) {
  const { personalInfo, summary, experience, education, skills, projects } = myResumeData;
  
  return {
    basics: {
      name: personalInfo.fullName || '',
      label: personalInfo.title || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      location: { 
        address: personalInfo.location || '',
        city: personalInfo.location?.split(',')[0]?.trim() || '',
        countryCode: 'US' 
      },
      summary: summary || '',
      profiles: [
        { network: 'LinkedIn', url: personalInfo.linkedin || '' },
        { network: 'GitHub', url: personalInfo.github || '' }
      ].filter(p => p.url)
    },
    work: experience?.map((exp: any) => ({
      name: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      summary: exp.description || '',
      highlights: exp.achievements || []
    })) || [],
    education: education?.map((edu: any) => ({
      institution: edu.institution,
      area: edu.field,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate
    })) || [],
    skills: Array.isArray(skills) 
      ? [{ name: 'Skills', keywords: skills }]
      : Object.entries(skills).map(([category, keywords]) => ({
          name: category,
          keywords: keywords as string[]
        })),
    projects: projects?.map((proj: any) => ({
      name: proj.name,
      description: proj.description,
      url: proj.link,
      keywords: proj.technologies ? proj.technologies.split(',').map((s: string) => s.trim()) : []
    })) || []
  };
}

// Render resume with selected template via backend API
export async function renderResumeWithTemplate(templateId: string, myResumeData: ResumeData): Promise<string> {
  const jsonResume = convertToJSONResume(myResumeData);
  
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:9000'}/api/render/render`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ templateId, jsonResume }),
    });

    if (!response.ok) {
      throw new Error(`Failed to render: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error(`Error rendering template ${templateId}:`, error);
    return `<div class="p-8 text-red-500">Error rendering theme. Please ensure the backend is running.</div>`;
  }
}
