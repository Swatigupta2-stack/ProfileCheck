import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X, Plus } from 'lucide-react';
import { updateSkills } from '@/store/resumeSlice';

export default function SkillsSection() {
  const dispatch = useDispatch();
  const skills = useSelector((state) => state.resume.skills);
  const [inputs, setInputs] = useState({
    technical: '',
    soft: '',
    tools: '',
    languages: '',
  });

  const handleAddSkill = (category, value) => {
    if (!value.trim()) return;
    const currentTags = skills[category] || [];
    if (!currentTags.includes(value.trim())) {
      dispatch(updateSkills({ category, tags: [...currentTags, value.trim()] }));
    }
    setInputs({ ...inputs, [category]: '' });
  };

  const handleRemoveSkill = (category, tag) => {
    const currentTags = skills[category] || [];
    dispatch(updateSkills({ category, tags: currentTags.filter((t) => t !== tag) }));
  };

  const categories = [
    { id: 'technical', label: 'Technical Skills', placeholder: 'e.g. React, Node.js, Python' },
    { id: 'tools', label: 'Tools & Technologies', placeholder: 'e.g. Docker, AWS, Git' },
    { id: 'soft', label: 'Soft Skills', placeholder: 'e.g. Leadership, Communication' },
    { id: 'languages', label: 'Languages', placeholder: 'e.g. English (Native), French' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {categories.map(({ id, label, placeholder }) => (
        <div key={id} className="space-y-3">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">{label}</label>
          <div className="flex gap-2">
            <input
              type="text"
              className="form-input !py-2 !text-sm"
              placeholder={placeholder}
              value={inputs[id]}
              onChange={(e) => setInputs({ ...inputs, [id]: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(id, inputs[id])}
            />
            <button 
              onClick={() => handleAddSkill(id, inputs[id])}
              className="p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills[id]?.map((tag) => (
              <span 
                key={tag} 
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                {tag}
                <button onClick={() => handleRemoveSkill(id, tag)}>
                  <X className="w-3 h-3 hover:text-rose-500" />
                </button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
