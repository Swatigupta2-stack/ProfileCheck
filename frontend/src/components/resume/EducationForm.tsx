import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Education } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";
import { Autocomplete } from "@/components/Autocomplete";
import { searchUniversities } from "@/utils/autocompleteApis";
import { useState } from "react";

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
  onUniversitySelect?: (location: string) => void;
}

export const EducationForm = ({ data, onChange, onUniversitySelect }: EducationFormProps) => {
  const [error, setError] = useState<string | null>(null);

  const addEducation = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
      },
    ]);
  };

  const removeEducation = (id: string) => {
    onChange(data.filter((edu) => edu.id !== id));
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onChange(
      data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu))
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Education</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.map((edu) => (
        <div key={edu.id} className="p-4 border border-border rounded-lg space-y-3">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label>Institution *</Label>
              <Autocomplete
                value={edu.institution}
                onChange={(v) => updateEducation(edu.id, 'institution', v)}
                fetcher={searchUniversities}
                minChars={2}
                placeholder="University Name"
                error={error}
                onError={setError}
                onSelect={(item) => {
                  updateEducation(edu.id, 'institution', item.label);
                  // Auto-fill location with city/state/country from the AI response
                  if (item.sublabel) {
                    onUniversitySelect?.(item.sublabel);
                  }
                }}
              />
            </div>
            <div>
              <Label>Degree *</Label>
              <Input
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                placeholder="Bachelor of Science"
              />
            </div>
            <div>
              <Label>Field of Study *</Label>
              <Input
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                placeholder="Computer Science"
              />
            </div>
            <div>
              <Label>GPA</Label>
              <Input
                value={edu.gpa}
                onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                placeholder="3.8/4.0"
              />
            </div>
            <div>
              <Label>Start Date *</Label>
              <Input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
              />
            </div>
            <div>
              <Label>End Date *</Label>
              <Input
                type="month"
                value={edu.endDate}
                onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      {data.length === 0 && (
        <p className="text-muted-foreground text-center py-4">
          No education added yet. Click "Add Education" to get started.
        </p>
      )}
    </div>
  );
};
