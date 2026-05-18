import { useState, useEffect } from 'react';
import { PortfolioData, getEmptyPortfolio } from '@/types/portfolio';

const STORAGE_KEY = 'portfolio_data';

export const usePortfolioStorage = () => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(getEmptyPortfolio());

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setPortfolioData(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load portfolio data:', error);
      }
    }
  }, []);

  const updatePortfolio = (data: PortfolioData) => {
    setPortfolioData(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const clearPortfolio = () => {
    setPortfolioData(getEmptyPortfolio());
    localStorage.removeItem(STORAGE_KEY);
  };

  return { portfolioData, updatePortfolio, clearPortfolio };
};
