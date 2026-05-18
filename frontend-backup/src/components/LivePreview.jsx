import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

export default function LivePreview() {
  const resume = useSelector((state) => state.resume);
  const { 
    templateId = 'modern', 
    personal = {}, 
    summary = '', 
    experience = [], 
    education = [], 
    skills = { technical: [], soft: [], tools: [] }, 
    projects = [] 
  } = resume || {};

  const renderModern = () => (
    <div className="flex flex-col h-full text-slate-800 p-8">
      <header className="border-b-4 border-primary-600 pb-6 mb-8">
        <h1 className="text-4xl font-display font-bold uppercase tracking-tighter text-slate-900">
          {personal.firstName} <span className="text-primary-600">{personal.lastName}</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium mt-1">{personal.title}</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 text-sm font-semibold text-slate-600">
          <span>{personal.email}</span>
          <span>{personal.phone}</span>
          <span>{personal.location}</span>
          {personal.linkedin && <span>LinkedIn</span>}
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <section>
            <h3 className="text-sm uppercase tracking-widest font-bold text-primary-600 mb-3">Profile</h3>
            <p className="text-slate-700 leading-relaxed">{summary}</p>
          </section>

          <section>
            <h3 className="text-sm uppercase tracking-widest font-bold text-primary-600 mb-4">Experience</h3>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-slate-900">{exp.position}</h4>
                    <span className="text-xs font-bold text-slate-500">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                  </div>
                  <p className="text-sm font-bold text-primary-600 mb-2">{exp.company}</p>
                  <ul className="list-disc list-outside ml-4 text-sm text-slate-600 space-y-1">
                    {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <h3 className="text-sm uppercase tracking-widest font-bold text-primary-600 mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {[...(skills?.technical || []), ...(skills?.soft || []), ...(skills?.tools || [])].map((s, i) => (
                <span key={i} className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{s}</span>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-sm uppercase tracking-widest font-bold text-primary-600 mb-4">Education</h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h4 className="text-sm font-bold text-slate-900">{edu.degree}</h4>
                  <p className="text-xs font-bold text-slate-500">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderClassic = () => (
    <div className="flex flex-col h-full text-gray-800 text-center font-serif p-10">
      <header className="border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl uppercase tracking-widest mb-1">
          {personal.firstName} {personal.lastName}
        </h1>
        <div className="flex justify-center gap-4 text-xs italic text-gray-600">
          <span>{personal.email}</span>
          <span>{personal.phone}</span>
          <span>{personal.location}</span>
        </div>
      </header>

      <section className="mb-6">
        <h3 className="text-sm uppercase font-bold border-b border-gray-200 mb-2 py-1">Summary</h3>
        <p className="text-sm italic">{summary}</p>
      </section>

      <section className="mb-6 text-left">
        <h3 className="text-sm uppercase font-bold border-b border-gray-200 mb-3 py-1">Experience</h3>
        {experience.map((exp) => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between font-bold text-sm">
              <span>{exp.company}</span>
              <span>{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            <p className="text-sm italic mb-1">{exp.position}</p>
            <ul className="list-disc ml-5 text-sm space-y-1 text-gray-700">
              {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section className="text-left">
        <h3 className="text-sm uppercase font-bold border-b border-gray-200 mb-2 py-1">Education</h3>
        {education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between text-sm">
              <span className="font-bold">{edu.institution}</span>
              <span>{edu.endDate}</span>
            </div>
            <p className="text-sm italic">{edu.degree} in {edu.field}</p>
          </div>
        ))}
      </section>
    </div>
  );

  const renderCreative = () => (
    <div className="flex flex-col h-full text-slate-900">
       <div className="flex h-full">
         <aside className="w-1/3 bg-slate-900 text-white p-8 space-y-8">
            <div>
              <h1 className="text-3xl font-display font-black leading-tight">
                {personal.firstName}<br/>
                <span className="text-primary-400">{personal.lastName}</span>
              </h1>
              <p className="text-sm text-slate-400 mt-2 uppercase font-bold tracking-widest">{personal.title}</p>
            </div>

            <section>
               <h3 className="text-xs uppercase tracking-widest font-bold text-primary-400 mb-4">Contact</h3>
               <div className="space-y-2 text-xs text-slate-300">
                 <p>{personal.email}</p>
                 <p>{personal.phone}</p>
                 <p>{personal.location}</p>
               </div>
            </section>

            <section>
               <h3 className="text-xs uppercase tracking-widest font-bold text-primary-400 mb-4">Skills</h3>
               <div className="flex flex-wrap gap-2">
                 {[...(skills?.technical || [])].map((s, i) => (
                   <span key={i} className="border border-slate-700 px-2 py-1 rounded text-[10px] uppercase font-bold">{s}</span>
                 ))}
               </div>
            </section>
         </aside>

         <main className="w-2/3 p-8 bg-white">
            <section className="mb-8">
              <h3 className="text-lg font-display font-black text-slate-900 uppercase tracking-tight border-b-2 border-slate-900 mb-4">About Me</h3>
              <p className="text-sm leading-relaxed text-slate-600">{summary}</p>
            </section>

            <section className="mb-8">
              <h3 className="text-lg font-display font-black text-slate-900 uppercase tracking-tight border-b-2 border-slate-900 mb-4">Experience</h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200">
                    <div className="absolute -left-[5px] top-1 w-2 h-2 bg-slate-900 rounded-full" />
                    <h4 className="font-black text-sm uppercase">{exp.position}</h4>
                    <p className="text-xs font-bold text-primary-600">{exp.company} | {exp.startDate} — {exp.endDate}</p>
                    <p className="text-xs text-slate-500 mt-2">{exp.achievements[0]}</p>
                  </div>
                ))}
              </div>
            </section>
         </main>
       </div>
    </div>
  );

  const getTemplate = () => {
    switch (templateId) {
      case 'modern': return renderModern();
      case 'classic': return renderClassic();
      case 'creative': return renderCreative();
      default: return renderModern();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[800px] aspect-[1/1.414] bg-white shadow-2xl overflow-hidden ring-1 ring-slate-200 origin-top"
      style={{ minHeight: '1120px' }}
    >
      <div className="h-full transform transition-transform duration-500">
        {getTemplate()}
      </div>
    </motion.div>
  );
}
