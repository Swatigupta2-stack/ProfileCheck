import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import {
  addExperience,
  removeExperience,
  updateExperience,
} from '@/store/resumeSlice';
import MagicButton from '@/components/common/MagicButton';
import { useState } from 'react';

export default function ExperienceSection() {
  const dispatch = useDispatch();
  const experience = useSelector((state) => state.resume.experience);
  const [loadingId, setLoadingId] = useState(null);

  const handleAdd = () => {
    dispatch(addExperience());
  };

  const handleRemove = (id) => {
    dispatch(removeExperience(id));
  };

  const handleChange = (id, field, value) => {
    dispatch(updateExperience({ id, field, value }));
  };

  const handleMagicEnhance = async (expId, currentText) => {
    setLoadingId(expId);
    try {
      const response = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: currentText }),
      });
      const data = await response.json();
      if (data.success) {
        handleChange(expId, 'achievements', data.rewrittenText.split('\n'));
      }
    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {experience.map((exp) => (
        <div key={exp.id} className="group relative p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4 transition-all hover:shadow-md">
          <button 
            onClick={() => handleRemove(exp.id)}
            className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 text-rose-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Company</label>
              <input
                type="text"
                placeholder="e.g. Google"
                className="form-input"
                value={exp.company}
                onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Position</label>
              <input
                type="text"
                placeholder="e.g. Senior Developer"
                className="form-input"
                value={exp.position}
                onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Start Date</label>
              <input
                type="month"
                className="form-input"
                value={exp.startDate}
                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">End Date</label>
              <input
                type="month"
                className="form-input"
                value={exp.endDate}
                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                disabled={exp.current}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 py-1">
            <input
              type="checkbox"
              id={`current-${exp.id}`}
              checked={exp.current}
              onChange={(e) => handleChange(exp.id, 'current', e.target.checked)}
              className="w-5 h-5 rounded-lg border-slate-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor={`current-${exp.id}`} className="text-sm font-medium text-slate-600 dark:text-slate-400">
              I currently work here
            </label>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Achievements</label>
              <MagicButton 
                onClick={() => handleMagicEnhance(exp.id, exp.achievements.join('\n'))}
                loading={loadingId === exp.id}
                className="scale-75 origin-right !py-1.5"
              >
                Optimize Bullet Points
              </MagicButton>
            </div>
            <textarea
              placeholder="Describe your key contributions and impact..."
              value={exp.achievements.join('\n')}
              onChange={(e) =>
                handleChange(
                  exp.id,
                  'achievements',
                  e.target.value.split('\n')
                )
              }
              className="form-input h-32 resize-none leading-relaxed"
            />
          </div>
        </div>
      ))}

      <button 
        onClick={handleAdd} 
        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all font-bold flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Experience
      </button>
    </div>
  );
}
