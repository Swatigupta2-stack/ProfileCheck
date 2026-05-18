import { PortfolioData } from "@/types/portfolio";
import { Mail, Phone, Linkedin, Github, Globe } from "lucide-react";

interface PortfolioPreviewProps {
  data: PortfolioData;
}

export const PortfolioPreview = ({ data }: PortfolioPreviewProps) => {
  return (
    <div id="portfolio-preview" className="bg-white text-gray-900 shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-12 text-center">
        <h1 className="text-4xl font-bold mb-2">
          {data.personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-xl opacity-90">
          {data.personalInfo.tagline || 'Your Professional Tagline'}
        </p>
        <div className="flex justify-center gap-6 mt-6">
          {data.personalInfo.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{data.personalInfo.email}</span>
            </div>
          )}
          {data.personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{data.personalInfo.phone}</span>
            </div>
          )}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} className="hover:opacity-80">
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} className="hover:opacity-80">
              <Github className="w-5 h-5" />
            </a>
          )}
          {data.personalInfo.portfolio && (
            <a href={data.personalInfo.portfolio} className="hover:opacity-80">
              <Globe className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      <div className="p-8">
        {/* About */}
        {data.about && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-purple-600 pb-2">
              About Me
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {data.about}
            </p>
          </section>
        )}

        {/* Skills */}
        {data.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-purple-600 pb-2">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-purple-600 pb-2">
              Projects
            </h2>
            <div className="space-y-6">
              {data.projects.map((project) => (
                <div key={project.id} className="border-l-4 border-purple-600 pl-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Technologies:</span> {project.technologies}
                  </p>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-purple-600 pb-2">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {exp.position}
                      </h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <p className="text-sm text-gray-600">{exp.duration}</p>
                  </div>
                  <p className="text-gray-700 whitespace-pre-line">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 border-b-2 border-purple-600 pb-2">
              Education
            </h2>
            <div className="space-y-4">
              {data.education.map((edu) => (
                <div key={edu.id}>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {edu.degree}
                  </h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
