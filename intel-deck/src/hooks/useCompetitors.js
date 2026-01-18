import { useLocalStorage } from './useLocalStorage';

const STORAGE_KEY = 'battlecard_competitors';

export function useCompetitors() {
  const [competitors, setCompetitors] = useLocalStorage(STORAGE_KEY, []);

  const addCompetitor = (analysis) => {
    setCompetitors(prev => {
      // Check if already exists (by company name), update if so
      const existingIndex = prev.findIndex(
        c => c.companyName.toLowerCase() === analysis.companyName.toLowerCase()
      );

      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = {
          ...analysis,
          id: prev[existingIndex].id, // Keep original ID
          previousAnalysis: prev[existingIndex] // Store previous for comparison
        };
        return updated;
      }

      // Add new
      return [analysis, ...prev];
    });
  };

  const removeCompetitor = (id) => {
    setCompetitors(prev => prev.filter(c => c.id !== id));
  };

  const getCompetitor = (id) => {
    return competitors.find(c => c.id === id);
  };

  const updateCompetitor = (id, updates) => {
    setCompetitors(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const clearAll = () => {
    setCompetitors([]);
  };

  return {
    competitors,
    addCompetitor,
    removeCompetitor,
    getCompetitor,
    updateCompetitor,
    clearAll
  };
}
