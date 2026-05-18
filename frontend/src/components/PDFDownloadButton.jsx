import React from 'react';

const PDFDownloadButton = ({ resumeData }) => {
  const handleDownload = async () => {
    const response = await fetch('https://profilecheck-backend.onrender.com/api/pdf/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeData })
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.pdf';
    link.click();
  };

  return (
    <button onClick={handleDownload} className="px-4 py-2 bg-gold-primary rounded-lg">
      Download PDF
    </button>
  );
};

export default PDFDownloadButton;