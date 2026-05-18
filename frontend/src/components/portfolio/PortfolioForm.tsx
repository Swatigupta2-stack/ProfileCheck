import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X } from "lucide-react";
import { PortfolioData } from "@/types/portfolio";
import { useState } from "react";

interface PortfolioFormProps {
  data: PortfolioData;
  onChange: (data: PortfolioData) => void;
}

export const PortfolioForm = ({ data, onChange }: PortfolioFormProps) => {
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim()) {
      onChange({ ...data, skills: [...data.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    onChange({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const addProject = () => {
    onChange({
      ...data,
      projects: [...data.projects, {
        id: Date.now().toString(),
        title: '',
        description: '',
        technologies: '',
        link: '',
      }]
    });
  };

  const removeProject = (id: string) => {
    onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="grid gap-4">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={data.personalInfo.fullName}
              onChange={(e) => onChange({
                ...data,
                personalInfo: { ...data.personalInfo, fullName: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="e.g., Full-Stack Developer | UI/UX Enthusiast"
              value={data.personalInfo.tagline}
              onChange={(e) => onChange({
                ...data,
                personalInfo: { ...data.personalInfo, tagline: e.target.value }
              })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.personalInfo.email}
                onChange={(e) => onChange({
                  ...data,
                  personalInfo: { ...data.personalInfo, email: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={data.personalInfo.phone}
                onChange={(e) => onChange({
                  ...data,
                  personalInfo: { ...data.personalInfo, phone: e.target.value }
                })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={data.personalInfo.linkedin}
                onChange={(e) => onChange({
                  ...data,
                  personalInfo: { ...data.personalInfo, linkedin: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={data.personalInfo.github}
                onChange={(e) => onChange({
                  ...data,
                  personalInfo: { ...data.personalInfo, github: e.target.value }
                })}
              />
            </div>
            <div>
              <Label htmlFor="portfolio">Portfolio URL</Label>
              <Input
                id="portfolio"
                value={data.personalInfo.portfolio}
                onChange={(e) => onChange({
                  ...data,
                  personalInfo: { ...data.personalInfo, portfolio: e.target.value }
                })}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">About Me</h3>
        <Textarea
          value={data.about}
          onChange={(e) => onChange({ ...data, about: e.target.value })}
          placeholder="Write a brief introduction about yourself..."
          className="min-h-[120px]"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Skills</h3>
        <div className="flex gap-2 mb-4">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && addSkill()}
            placeholder="Add a skill"
          />
          <Button onClick={addSkill} type="button">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="gap-1">
              {skill}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeSkill(index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Projects</h3>
          <Button onClick={addProject} type="button">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
        {data.projects.map((project) => (
          <Card key={project.id} className="p-4 mb-4">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium">Project</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(project.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={project.title}
                  onChange={(e) => onChange({
                    ...data,
                    projects: data.projects.map(p =>
                      p.id === project.id ? { ...p, title: e.target.value } : p
                    )
                  })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => onChange({
                    ...data,
                    projects: data.projects.map(p =>
                      p.id === project.id ? { ...p, description: e.target.value } : p
                    )
                  })}
                />
              </div>
              <div>
                <Label>Technologies</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => onChange({
                    ...data,
                    projects: data.projects.map(p =>
                      p.id === project.id ? { ...p, technologies: e.target.value } : p
                    )
                  })}
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </div>
              <div>
                <Label>Link</Label>
                <Input
                  value={project.link}
                  onChange={(e) => onChange({
                    ...data,
                    projects: data.projects.map(p =>
                      p.id === project.id ? { ...p, link: e.target.value } : p
                    )
                  })}
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
