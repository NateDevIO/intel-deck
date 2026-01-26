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
        // Update existing - also track price history
        const existing = prev[existingIndex];
        const existingHistory = existing.priceHistory || [];

        // Add previous pricing to history if it exists
        const newHistoryEntry = existing.pricing?.tiers ? {
          date: existing.analyzedAt,
          tiers: existing.pricing.tiers.map(t => ({
            name: t.name,
            price: t.price,
            priceModel: t.priceModel
          }))
        } : null;

        // Build updated history (avoid duplicates by date)
        const updatedHistory = newHistoryEntry && !existingHistory.some(h => h.date === newHistoryEntry.date)
          ? [...existingHistory, newHistoryEntry]
          : existingHistory;

        const updated = [...prev];
        updated[existingIndex] = {
          ...analysis,
          id: existing.id, // Keep original ID
          previousAnalysis: existing, // Store previous for comparison
          priceHistory: updatedHistory,
          outcomes: existing.outcomes // Preserve win/loss outcomes
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
