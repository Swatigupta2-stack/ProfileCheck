import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Mail, Sparkles, Copy, X, Loader2, Check } from 'lucide-react';
import axios from 'axios';
import MagicButton from './common/MagicButton';
import { toast } from 'react-hot-toast';

export default function CoverLetterGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const resume = useSelector((state) => state.resume);

  const handleGenerate = async () => {
    if (!companyName || !jobDescription) {
      toast.error('Please provide company name and job description');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/ai/cover-letter', {
        resumeData: resume,
        jobDescription,
        companyName,
      });
      setGeneratedLetter(response.data.data.letter);
      setIsOpen(true);
    } catch (err) {
      toast.error('Failed to generate cover letter');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Company Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. Microsoft"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-500 uppercase ml-1">Job Description</label>
          <textarea
            className="form-input h-48 resize-none"
            placeholder="Paste the job description here to tailor your letter..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>

        <MagicButton 
          onClick={handleGenerate} 
          loading={loading}
          className="w-full !py-4"
        >
          Generate Tailored Cover Letter
        </MagicButton>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white dark:bg-slate-900 p-8 text-left align-middle shadow-2xl transition-all border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                    <Dialog.Title as="h3" className="text-2xl font-display font-bold flex items-center gap-3">
                      <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      Generated Cover Letter
                    </Dialog.Title>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 mb-6">
                    <pre className="whitespace-pre-wrap font-sans text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                      {generatedLetter}
                    </pre>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 btn-primary"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="btn-secondary"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
