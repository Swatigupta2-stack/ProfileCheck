import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

interface ProjectsFormProps {
  data: Project[];
  onChange: (data: Project[]) => void;
}

export const ProjectsForm = ({ data, onChange }: ProjectsFormProps) => {
  const addProject = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        name: '',
        description: '',
        technologies: '',
        link: '',
      },
    ]);
  };

  const removeProject = (id: string) => {
    onChange(data.filter((proj) => proj.id !== id));
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onChange(
      data.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Projects</h3>
        <Button onClick={addProject} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {data.map((proj) => (
        <div key={proj.id} className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProject(proj.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <div>
              <Label>Project Name *</Label>
              <Input
                value={proj.name}
                onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                placeholder="AI Resume Builder"
              />
            </div>
            <div>
              <Label>Description *</Label>
              <Textarea
                value={proj.description}
                onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                placeholder="Describe the project and your role..."
                rows={3}
              />
            </div>
            <div>
              <Label>Technologies *</Label>
              <Input
                value={proj.technologies}
                onChange={(e) => updateProject(proj.id, 'technologies', e.target.value)}
                placeholder="React, TypeScript, Tailwind CSS"
              />
            </div>
            <div>
              <Label>Link</Label>
              <Input
                value={proj.link}
                onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No projects added yet. Click "Add Project" to showcase your work.
        </p>
      )}
    </div>
  );
};
