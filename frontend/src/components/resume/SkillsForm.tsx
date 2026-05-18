import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useState } from "react";

interface SkillsFormProps {
  data: string[];
  onChange: (data: string[]) => void;
}

export const SkillsForm = ({ data, onChange }: SkillsFormProps) => {
  const [skillInput, setSkillInput] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !data.includes(skillInput.trim())) {
      onChange([...data, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    onChange(data.filter((s) => s !== skill));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Skills</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="skill-input">Add Skill</Label>
          <Input
            id="skill-input"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="e.g., React, Python, Project Management"
          />
        </div>
        <Button onClick={addSkill} className="mt-6">
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {data.map((skill) => (
          <Badge key={skill} variant="secondary" className="px-3 py-1">
            {skill}
            <button
              onClick={() => removeSkill(skill)}
              className="ml-2 hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>

      {data.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No skills added yet. Add your technical and soft skills.
        </p>
      )}
    </div>
  );
};
