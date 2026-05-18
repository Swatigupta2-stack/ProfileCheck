import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Save, 
  Layout as LayoutIcon, 
  Eye, 
  Download, 
  ChevronLeft, 
  ChevronRight,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import FormPanel from '@/components/FormPanel';
import LivePreview from '@/components/LivePreview';
import ATSScore from '@/components/common/ATSScore';
import PDFDownloadButton from '@/components/PDFDownloadButton';
import { markSaved, setTemplate } from '@/store/resumeSlice';
import { Toaster, toast } from 'react-hot-toast';

export default function ResumeBuilder() {
  const dispatch = useDispatch();
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const resume = useSelector((state) => state.resume);
  const { isDirty, templateId, atsScore } = resume;

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleSave = async () => {
    setIsSaving(true);
    const saveToast = toast.loading('Saving your progress...');
    try {
      const response = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (response.ok) {
        dispatch(markSaved());
        toast.success('Resume saved successfully!', { id: saveToast });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Could not save resume. Please try again.', { id: saveToast });
    } finally {
      setIsSaving(false);
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern' },
    { id: 'classic', name: 'Classic' },
    { id: 'creative', name: 'Creative' },
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-forge-ink transition-colors duration-300">
      <Toaster position="top-right" />
      
      {/* Top Navigation Bar */}
      <header className="glass h-16 flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
            <LayoutIcon className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold leading-none">CareerForge</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 font-bold">Pro Resume Builder</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Template Selector */}
          <div className="hidden md:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl gap-1">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => dispatch(setTemplate(t.id))}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  templateId === t.id 
                    ? 'bg-white dark:bg-slate-700 shadow-sm text-primary-600 dark:text-primary-400' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-700 hidden md:block" />

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className={`btn-primary !py-2 !px-4 ${!isDirty && 'opacity-50 grayscale cursor-not-allowed'}`}
            >
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save'}</span>
            </button>

            <PDFDownloadButton resumeData={resume} className="!py-2 !px-4" />
          </div>
        </div>
      </header>

      {/* Main Builder Area */}
      <main className="flex flex-1 overflow-hidden relative">
        {/* Left Panel: Form (40%) */}
        <div className="w-full lg:w-[40%] flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-xl z-10">
          <div className="flex-1 overflow-y-auto p-4 sm:p-8">
            <div className="max-w-2xl mx-auto">
              <header className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">Build your future</h2>
                  <p className="text-slate-500 dark:text-slate-400">Fill in your details to generate an ATS-optimized resume.</p>
                </div>
                <div className="hidden sm:block">
                  <ATSScore score={atsScore} size={80} />
                </div>
              </header>
              <FormPanel />
            </div>
          </div>
        </div>

        {/* Right Panel: Preview (60%) */}
        <div className="hidden lg:flex w-[60%] h-full bg-slate-100 dark:bg-forge-ink flex-col items-center justify-start p-12 overflow-y-auto relative">
          {/* Preview Background Decoration */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none overflow-hidden">
             <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-500 rounded-full blur-[120px]" />
             <div className="absolute top-1/2 -left-24 w-64 h-64 bg-amber-500 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 w-full flex justify-center">
            <LivePreview />
          </div>
        </div>

        {/* Mobile Preview Toggle */}
        <button 
          onClick={() => setShowPreview(!showPreview)}
          className="lg:hidden fixed bottom-6 right-6 z-50 bg-primary-600 text-white p-4 rounded-full shadow-2xl active:scale-95"
        >
          {showPreview ? <ChevronLeft className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
        </button>

        {/* Mobile Preview Overlay */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="lg:hidden fixed inset-0 z-40 bg-slate-100 dark:bg-forge-ink p-4 overflow-y-auto"
            >
               <div className="pt-20 pb-24">
                <LivePreview />
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
