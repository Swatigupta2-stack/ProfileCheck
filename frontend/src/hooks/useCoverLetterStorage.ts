import { useState, useEffect } from 'react';
import { CoverLetterData, getEmptyCoverLetter } from '@/types/coverLetter';

const STORAGE_KEY = 'cover_letter_data';

export const useCoverLetterStorage = () => {
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>(getEmptyCoverLetter());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCoverLetterData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load cover letter data:', error);
      }
    }
  }, []);

  const updateCoverLetter = (data: CoverLetterData) => {
    setCoverLetterData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearCoverLetter = () => {
    setCoverLetterData(getEmptyCoverLetter());
    localStorage.removeItem(STORAGE_KEY);
  };

  return { coverLetterData, updateCoverLetter, clearCoverLetter };
};
