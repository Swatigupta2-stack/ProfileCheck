import { Disclosure, Transition } from '@headlessui/react';
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FileText, 
  ChevronDown,
  Layout
} from 'lucide-react';
import PersonalInfo from '@/components/sections/PersonalInfo';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import SkillsSection from '@/components/sections/SkillsSection';
import SummarySection from '@/components/sections/SummarySection';
import ProjectsSection from '@/components/sections/ProjectsSection';

export default function FormPanel() {
  const sections = [
    { id: 'personal', label: 'Personal Details', icon: User, component: PersonalInfo, color: 'text-blue-500' },
    { id: 'summary', label: 'Professional Summary', icon: FileText, component: SummarySection, color: 'text-emerald-500' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, component: ExperienceSection, color: 'text-amber-500' },
    { id: 'education', label: 'Education', icon: GraduationCap, component: EducationSection, color: 'text-indigo-500' },
    { id: 'projects', label: 'Projects', icon: Layout, component: ProjectsSection, color: 'text-rose-500' },
    { id: 'skills', label: 'Skills & Tools', icon: Wrench, component: SkillsSection, color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-4 pb-20">
      {sections.map(({ id, label, icon: Icon, component: Component, color }) => (
        <Disclosure key={id} defaultOpen={id === 'personal'}>
          {({ open }) => (
            <div className={`glass dark:bg-slate-800/50 rounded-2xl overflow-hidden transition-all duration-300 ${open ? 'ring-2 ring-primary-500/20' : ''}`}>
              <Disclosure.Button className="w-full flex justify-between items-center px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-900 ${color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{label}</h3>
                </div>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
              </Disclosure.Button>
              
              <Transition
                enter="transition duration-200 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-100 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Disclosure.Panel className="px-6 pb-6 pt-2">
                  <div className="border-t border-slate-100 dark:border-slate-700/50 pt-6">
                    <Component />
                  </div>
                </Disclosure.Panel>
              </Transition>
            </div>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
