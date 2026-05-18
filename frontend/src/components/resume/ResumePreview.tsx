import { ResumeData } from "@/types/resume";
import { TEMPLATES } from "@/data/templates";
import { motion } from "framer-motion";
import { renderResumeWithTemplate, jsonResumeTemplates } from "@/services/jsonResumeAdapter";
import { useState, useEffect } from "react";

interface ResumePreviewProps {
  data: ResumeData;
}

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const [html, setHtml] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Ensure data exists with fallbacks to avoid "blank" screens
  const { 
    personalInfo = { fullName: '', email: '', phone: '', location: '' }, 
    summary = '', 
    education = [], 
    experience = [], 
    skills = [], 
    projects = [], 
    templateId = '' 
  } = data || {};

  // Check if it's a JSON Resume template
  const isJsonResumeTemplate = !!jsonResumeTemplates[templateId as keyof typeof jsonResumeTemplates];

  useEffect(() => {
    if (isJsonResumeTemplate) {
      const render = async () => {
        setIsLoading(true);
        try {
          const renderedHtml = await renderResumeWithTemplate(templateId, data);
          setHtml(renderedHtml);
        } catch (error) {
          console.error("Error rendering JSON Resume template:", error);
          setHtml('<div class="p-8 text-red-500">Failed to render template.</div>');
        } finally {
          setIsLoading(false);
        }
      };
      render();
    }
  }, [templateId, data, isJsonResumeTemplate]);

  if (isJsonResumeTemplate) {
    return (
      <div 
        id="resume-preview" 
        className={`bg-white mx-auto border border-gray-100 overflow-hidden print:shadow-none print:border-none w-[210mm] min-h-[297mm] transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];

  const primaryColor = data.customPrimaryColor || template.styles.primaryColor;
  const fontFamily = data.customFontFamily || template.styles.fontFamily;
  const layoutType = data.customLayoutType || template.layoutType;

  const sectionHeaderStyle = {
    color: primaryColor,
    fontFamily: fontFamily,
    letterSpacing: template.styles.headingStyle === 'uppercase' ? '0.15em' : 'normal',
    textTransform: template.styles.headingStyle === 'uppercase' ? 'uppercase' : 'none' as any,
  };

  const bodyStyle = {
    fontFamily: fontFamily,
    fontSize: template.styles.fontSize === 'small' ? '11px' : template.styles.fontSize === 'large' ? '15px' : '13px',
  };

  const spacingClass = template.styles.spacing === 'compact' ? 'space-y-3' : template.styles.spacing === 'relaxed' ? 'space-y-8' : 'space-y-6';

  const renderHeader = () => (
    <div className="border-b-4 pb-8 mb-8" style={{ borderColor: primaryColor }}>
      <h1 className="text-4xl font-black mb-3 tracking-tighter leading-tight" style={{ color: primaryColor }}>
        {personalInfo.fullName || "Your Full Name"}
      </h1>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-gray-500 font-bold uppercase tracking-widest">
        {personalInfo.email && <span className="flex items-center gap-1">{personalInfo.email}</span>}
        {personalInfo.phone && <span className="flex items-center gap-1">{personalInfo.phone}</span>}
        {personalInfo.location && <span className="flex items-center gap-1">{personalInfo.location}</span>}
        {personalInfo.linkedin && <span className="text-primary/80">{personalInfo.linkedin}</span>}
      </div>
    </div>
  );

  const renderContent = () => (
    <div className={spacingClass}>
      {/* Summary */}
      {summary && (
        <div className="space-y-3">
          <h2 style={sectionHeaderStyle} className="font-black text-[10px] uppercase tracking-[0.25em] border-b-2 pb-2 mb-4">Professional Profile</h2>
          <p className="text-gray-700 leading-relaxed text-sm font-medium whitespace-pre-line">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="space-y-6">
          <h2 style={sectionHeaderStyle} className="font-black text-[10px] uppercase tracking-[0.25em] border-b-2 pb-2 mb-4">Work Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-2 relative pl-5 border-l-2 border-gray-100">
              <div className="flex justify-between items-baseline">
                <h3 className="font-black text-base text-gray-900 leading-tight">{exp.position}</h3>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded border border-gray-100">
                  {exp.startDate} — {exp.endDate || 'Present'}
                </span>
              </div>
              <p className="text-xs font-black text-primary uppercase tracking-wider">{exp.company}</p>
              <p className="text-[12px] text-gray-600 leading-relaxed font-medium whitespace-pre-line">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="space-y-6">
          <h2 style={sectionHeaderStyle} className="font-black text-[10px] uppercase tracking-[0.25em] border-b-2 pb-2 mb-4">Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="space-y-1 relative pl-5 border-l-2 border-gray-100">
              <div className="flex justify-between items-baseline">
                <h3 className="font-black text-[14px] text-gray-900">{edu.degree} in {edu.field}</h3>
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{edu.startDate} — {edu.endDate}</span>
              </div>
              <p className="text-xs font-bold text-gray-600">{edu.institution}</p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills && (Array.isArray(skills) ? skills.length > 0 : Object.keys(skills).length > 0) && (
        <div className="space-y-4">
          <h2 style={sectionHeaderStyle} className="font-black text-[10px] uppercase tracking-[0.25em] border-b-2 pb-2 mb-4">Core Expertise</h2>
          <div className="flex flex-wrap gap-2">
            {(Array.isArray(skills) ? skills : Object.values(skills).flat()).map((skill, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.1em]">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="space-y-6">
          <h2 style={sectionHeaderStyle} className="font-black text-[10px] uppercase tracking-[0.25em] border-b-2 pb-2 mb-4">Selected Projects</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="space-y-2 relative pl-5 border-l-2 border-gray-100">
              <div className="flex justify-between items-baseline">
                <h3 className="font-black text-[14px] text-gray-900">{proj.name}</h3>
                {proj.link && <span className="text-[10px] font-black text-primary underline tracking-widest uppercase">{proj.link}</span>}
              </div>
              <p className="text-[12px] text-gray-600 leading-relaxed font-medium">{proj.description}</p>
              {proj.technologies && (
                <div className="flex gap-2 mt-2">
                  {proj.technologies.split(',').map((tech, i) => (
                    <span key={i} className="text-[8px] font-black text-gray-400 uppercase tracking-tighter bg-gray-50 px-2 py-0.5 rounded border border-gray-100">{tech.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div 
      id="resume-preview" 
      className="bg-white mx-auto border border-gray-100 overflow-hidden print:shadow-none print:border-none" 
      style={{
        ...bodyStyle,
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        boxSizing: 'border-box',
        color: '#1a1a1a'
      }}
    >
      {layoutType === 'sidebar' ? (
        <div className="flex gap-12 h-full -m-[20mm]">
          <div className="w-[32%] bg-gray-50 p-[20mm] border-r border-gray-200 flex flex-col gap-10">
            <div>
              <h1 className="text-3xl font-black mb-8 tracking-tighter leading-none" style={{ color: primaryColor }}>
                {personalInfo.fullName || "Your Name"}
              </h1>
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b pb-1">Contact</h2>
                  <div className="space-y-3 text-[11px] text-gray-600 font-bold break-words leading-relaxed">
                    {personalInfo.email && <p>{personalInfo.email}</p>}
                    {personalInfo.phone && <p>{personalInfo.phone}</p>}
                    {personalInfo.location && <p>{personalInfo.location}</p>}
                    {personalInfo.linkedin && <p className="text-primary/70">{personalInfo.linkedin}</p>}
                  </div>
                </div>
                {skills && (Array.isArray(skills) ? skills.length > 0 : Object.keys(skills).length > 0) && (
                  <div className="space-y-5">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 border-b pb-1">Expertise</h2>
                    <div className="flex flex-col gap-2.5">
                      {(Array.isArray(skills) ? skills : Object.values(skills).flat()).map((s, i) => (
                        <span key={i} className="text-[11px] font-black text-gray-900 uppercase tracking-widest leading-tight">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 p-[20mm] pl-0">
            {renderContent()}
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {renderHeader()}
          {renderContent()}
        </div>
      )}
    </div>
  );
};
