import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';
import {
  addProject,
  removeProject,
  updateProject,
} from '@/store/resumeSlice';

export default function ProjectsSection() {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.resume.projects);

  const handleAdd = () => {
    dispatch(addProject());
  };

  const handleRemove = (id) => {
    dispatch(removeProject(id));
  };

  const handleChange = (id, field, value) => {
    dispatch(updateProject({ id, field, value }));
  };

  return (
    <div className="space-y-6">
      {projects.map((proj) => (
        <div key={proj.id} className="group relative p-6 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 space-y-4 transition-all hover:shadow-md">
          <button 
            onClick={() => handleRemove(proj.id)}
            className="absolute -top-3 -right-3 p-2 bg-white dark:bg-slate-800 text-rose-500 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-slate-700"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1">Project Name</label>
              <input
                type="text"
                placeholder="e.g. E-commerce Platform"
                className="form-input"
                value={proj.name}
                onChange={(e) => handleChange(proj.id, 'name', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase ml-1 flex items-center gap-1.5">
                <LinkIcon className="w-3 h-3" />
                Project Link
              </label>
              <input
                type="text"
                placeholder="e.g. github.com/user/project"
                className="form-input"
                value={proj.link}
                onChange={(e) => handleChange(proj.id, 'link', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
            <textarea
              placeholder="Built a scalable microservices architecture using..."
              className="form-input h-24 resize-none leading-relaxed"
              value={proj.description}
              onChange={(e) => handleChange(proj.id, 'description', e.target.value)}
            />
          </div>
        </div>
      ))}

      <button 
        onClick={handleAdd} 
        className="w-full py-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-primary-600 hover:border-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-950/20 transition-all font-bold flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Project
      </button>
    </div>
  );
}
