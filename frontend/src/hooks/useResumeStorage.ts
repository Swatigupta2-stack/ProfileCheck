import { useState, useEffect, useCallback, useRef } from 'react';
import { ResumeData, getEmptyResume } from '@/types/resume';

const STORAGE_KEY = 'resume_data';
const MAX_HISTORY = 50;
const HISTORY_DEBOUNCE = 1000; // 1 second

export const useResumeStorage = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(getEmptyResume());
  const [history, setHistory] = useState<ResumeData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const historyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setResumeData(parsed);
        setHistory([parsed]);
        setCurrentIndex(0);
      } catch (error) {
        console.error('Failed to load resume data:', error);
        const empty = getEmptyResume();
        setResumeData(empty);
        setHistory([empty]);
        setCurrentIndex(0);
      }
    } else {
      const empty = getEmptyResume();
      setResumeData(empty);
      setHistory([empty]);
      setCurrentIndex(0);
    }
  }, []);

  const updateResume = useCallback((data: ResumeData | ((prev: ResumeData) => ResumeData)) => {
    setResumeData(prev => {
      const newData = typeof data === 'function' ? data(prev) : data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));

      // Debounce history updates to avoid saving every keystroke
      if (historyTimeoutRef.current) {
        clearTimeout(historyTimeoutRef.current);
      }

      historyTimeoutRef.current = setTimeout(() => {
        setHistory(hPrev => {
          // If the new data is same as current head of history, don't add
          if (hPrev[currentIndex] && JSON.stringify(hPrev[currentIndex]) === JSON.stringify(newData)) {
            return hPrev;
          }

          const newHistory = hPrev.slice(0, currentIndex + 1);
          newHistory.push(newData);
          
          if (newHistory.length > MAX_HISTORY) {
            newHistory.shift();
            setCurrentIndex(newHistory.length - 1);
          } else {
            setCurrentIndex(newHistory.length - 1);
          }
          return newHistory;
        });
      }, HISTORY_DEBOUNCE);

      return newData;
    });
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
      
      const prevIndex = currentIndex - 1;
      const prevData = history[prevIndex];
      setResumeData(prevData);
      setCurrentIndex(prevIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prevData));
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);

      const nextIndex = currentIndex + 1;
      const nextData = history[nextIndex];
      setResumeData(nextData);
      setCurrentIndex(nextIndex);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
    }
  }, [currentIndex, history]);

  const clearResume = () => {
    if (historyTimeoutRef.current) clearTimeout(historyTimeoutRef.current);
    
    const empty = getEmptyResume();
    setResumeData(empty);
    setHistory([empty]);
    setCurrentIndex(0);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { 
    resumeData, 
    updateResume, 
    clearResume, 
    undo, 
    redo, 
    canUndo: currentIndex > 0, 
    canRedo: currentIndex < history.length - 1 
  };
};
