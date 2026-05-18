import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Download, Loader2 } from 'lucide-react';

/**
 * PDFDownloadButton Component
 * @param {Object} resumeData - The resume data to generate the PDF from
 * @param {string} className - Optional CSS classes to override default button styles
 */
const PDFDownloadButton = ({ resumeData, className }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!resumeData) {
      toast.error('No resume data provided');
      return;
    }

    setLoading(true);
    const downloadToast = toast.loading('Preparing your PDF...');

    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resumeData),
      });

      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `${resumeData.personal?.firstName || 'resume'}_${resumeData.personal?.lastName || ''}.pdf`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully!', { id: downloadToast });
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate PDF. Please try again.', { id: downloadToast });
    } finally {
      setLoading(false);
    }
  };

  // Use custom className if provided, otherwise fallback to default btn-primary
  const buttonClass = className || "btn-primary";

  return (
    <button 
      onClick={handleDownload} 
      disabled={loading}
      className={buttonClass}
    >
      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
      <span className={className?.includes('!p-3') ? 'hidden' : 'inline-block'}>
        {loading ? 'Generating...' : 'Download PDF'}
      </span>
    </button>
  );
};

export default PDFDownloadButton;
