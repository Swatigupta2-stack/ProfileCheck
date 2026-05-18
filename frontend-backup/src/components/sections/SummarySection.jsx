import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSummary } from '@/store/resumeSlice';

export default function SummarySection() {
  const dispatch = useDispatch();
  const summary = useSelector((state) => state.resume.summary);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase ml-1">
        Professional Summary
      </label>
      <textarea
        placeholder="Briefly describe your career goals and key achievements..."
        className="form-input h-40 resize-none leading-relaxed"
        value={summary}
        onChange={(e) => dispatch(updateSummary(e.target.value))}
      />
      <div className="flex justify-between items-center px-1">
        <p className="text-[10px] text-slate-400 font-medium">Recommended: 200-500 characters</p>
        <p className={`text-[10px] font-bold ${summary.length > 500 ? 'text-rose-500' : 'text-slate-400'}`}>
          {summary.length}/500
        </p>
      </div>
    </div>
  );
}
