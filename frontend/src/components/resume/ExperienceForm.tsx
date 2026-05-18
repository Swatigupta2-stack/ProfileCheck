import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Experience } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { MagicButton } from "@/components/MagicButton";
import { Autocomplete } from "@/components/Autocomplete";
import { searchCompanies } from "@/utils/autocompleteApis";
import { useState } from "react";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export const ExperienceForm = ({ data, onChange }: ExperienceFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const addExperience = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onChange(
      data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Experience</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {data.map((exp) => (
        <div key={exp.id} className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Company *</Label>
              <Autocomplete
                value={exp.company}
                onChange={(v) => updateExperience(exp.id, 'company', v)}
                fetcher={searchCompanies}
                minChars={2}
                placeholder="Company Name"
                error={error}
                onError={setError}
                onSelect={(item) => updateExperience(exp.id, 'company', item.label)}
              />
            </div>
            <div>
              <Label>Position *</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <Label>Start Date *</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <Label>End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
              />
              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onCheckedChange={(checked) =>
                    updateExperience(exp.id, 'current', checked as boolean)
                  }
                />
                <label htmlFor={`current-${exp.id}`} className="text-sm">
                  Currently working here
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label>Description *</Label>
              <MagicButton
                text={exp.description}
                context={`${exp.position} at ${exp.company}`}
                onResult={(improved) => updateExperience(exp.id, 'description', improved)}
              />
            </div>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
              placeholder="Describe your responsibilities and achievements... then click Magic AI ✨"
              rows={5}
            />
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No experience added yet. Click "Add Experience" to get started.
        </p>
      )}
    </div>
  );
};
