import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react';
import {
  addEducation,
  removeEducation,
  updateEducation,
} from '@/store/resumeSlice';

export default function EducationSection() {
  const dispatch = useDispatch();
  const education = useSelector((state) => state.resume.education);

  const handleAdd = () => {
    dispatch(addEducation());
  };

  const handleRemove = (id) => {
    dispatch(removeEducation(id));
  };

  const handleChange = (id, field, value) => {
    dispatch(updateEducation({ id, field, value }));
  };

  return (
    <div className="space-y-6">
      {education.map((edu) => (
        <div key={edu.id} className="group relative p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4 transition-all hover:shadow-md">
          <button 
            onClick={() => handleRemove(edu.id)}
            className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 text-rose-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Institution</label>
              <input
                type="text"
                placeholder="e.g. Stanford University"
                className="form-input"
                value={edu.institution}
                onChange={(e) => handleChange(edu.id, 'institution', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Degree</label>
              <input
                type="text"
                placeholder="e.g. Bachelor of Science"
                className="form-input"
                value={edu.degree}
                onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Field of Study</label>
              <input
                type="text"
                placeholder="e.g. Computer Science"
                className="form-input"
                value={edu.field}
                onChange={(e) => handleChange(edu.id, 'field', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">End Date</label>
              <input
                type="month"
                className="form-input"
                value={edu.endDate}
                onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">GPA (Optional)</label>
              <input
                type="text"
                placeholder="e.g. 3.8/4.0"
                className="form-input"
                value={edu.gpa}
                onChange={(e) => handleChange(edu.id, 'gpa', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}

      <button 
        onClick={handleAdd} 
        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all font-bold flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Education
      </button>
    </div>
  );
}
