// Utility for comparing analyses and detecting changes

export function compareAnalyses(oldAnalysis, newAnalysis) {
  const changes = [];

  // Compare pricing tiers
  const oldTiers = oldAnalysis?.pricing?.tiers || [];
  const newTiers = newAnalysis?.pricing?.tiers || [];

  // Check for price changes
  newTiers.forEach((newTier) => {
    const oldTier = oldTiers.find(t => t.name?.toLowerCase() === newTier.name?.toLowerCase());
    if (oldTier) {
      if (oldTier.price !== newTier.price) {
        changes.push({
          type: 'price_change',
          category: 'pricing',
          tier: newTier.name,
          oldValue: oldTier.price,
          newValue: newTier.price,
          impact: determinePriceImpact(oldTier.price, newTier.price)
        });
      }
    } else {
      changes.push({
        type: 'tier_added',
        category: 'pricing',
        tier: newTier.name,
        newValue: newTier.price,
        impact: 'neutral'
      });
    }
  });

  // Check for removed tiers
  oldTiers.forEach((oldTier) => {
    const stillExists = newTiers.find(t => t.name?.toLowerCase() === oldTier.name?.toLowerCase());
    if (!stillExists) {
      changes.push({
        type: 'tier_removed',
        category: 'pricing',
        tier: oldTier.name,
        oldValue: oldTier.price,
        impact: 'significant'
      });
    }
  });

  // Compare features
  const oldFeatures = oldAnalysis?.features?.highlighted || [];
  const newFeatures = newAnalysis?.features?.highlighted || [];

  const addedFeatures = newFeatures.filter(f => !oldFeatures.includes(f));
  const removedFeatures = oldFeatures.filter(f => !newFeatures.includes(f));

  addedFeatures.forEach(feature => {
    changes.push({
      type: 'feature_added',
      category: 'features',
      newValue: feature,
      impact: 'positive'
    });
  });

  removedFeatures.forEach(feature => {
    changes.push({
      type: 'feature_removed',
      category: 'features',
      oldValue: feature,
      impact: 'negative'
    });
  });

  // Compare positioning
  if (oldAnalysis?.positioning?.tagline !== newAnalysis?.positioning?.tagline) {
    if (newAnalysis?.positioning?.tagline) {
      changes.push({
        type: 'tagline_changed',
        category: 'positioning',
        oldValue: oldAnalysis?.positioning?.tagline,
        newValue: newAnalysis?.positioning?.tagline,
        impact: 'neutral'
      });
    }
  }

  // Compare differentiators
  const oldDiffs = oldAnalysis?.positioning?.differentiators || [];
  const newDiffs = newAnalysis?.positioning?.differentiators || [];

  const addedDiffs = newDiffs.filter(d => !oldDiffs.includes(d));
  const removedDiffs = oldDiffs.filter(d => !newDiffs.includes(d));

  addedDiffs.forEach(diff => {
    changes.push({
      type: 'differentiator_added',
      category: 'positioning',
      newValue: diff,
      impact: 'neutral'
    });
  });

  removedDiffs.forEach(diff => {
    changes.push({
      type: 'differentiator_removed',
      category: 'positioning',
      oldValue: diff,
      impact: 'neutral'
    });
  });

  return {
    hasChanges: changes.length > 0,
    changes,
    summary: generateChangeSummary(changes)
  };
}

function determinePriceImpact(oldPrice, newPrice) {
  const oldNum = parsePrice(oldPrice);
  const newNum = parsePrice(newPrice);

  if (oldNum === null || newNum === null) return 'neutral';
  if (newNum > oldNum) return 'price_increase';
  if (newNum < oldNum) return 'price_decrease';
  return 'neutral';
}

function parsePrice(priceStr) {
  if (!priceStr) return null;
  const match = priceStr.match(/[\d,.]+/);
  if (!match) return null;
  return parseFloat(match[0].replace(/,/g, ''));
}

function generateChangeSummary(changes) {
  const priceChanges = changes.filter(c => c.type === 'price_change');
  const featureChanges = changes.filter(c => c.category === 'features');
  const positioningChanges = changes.filter(c => c.category === 'positioning');

  const parts = [];

  if (priceChanges.length > 0) {
    const increases = priceChanges.filter(c => c.impact === 'price_increase').length;
    const decreases = priceChanges.filter(c => c.impact === 'price_decrease').length;
    if (increases > 0) parts.push(`${increases} price increase${increases > 1 ? 's' : ''}`);
    if (decreases > 0) parts.push(`${decreases} price decrease${decreases > 1 ? 's' : ''}`);
  }

  if (featureChanges.length > 0) {
    parts.push(`${featureChanges.length} feature change${featureChanges.length > 1 ? 's' : ''}`);
  }

  if (positioningChanges.length > 0) {
    parts.push(`${positioningChanges.length} positioning update${positioningChanges.length > 1 ? 's' : ''}`);
  }

  return parts.length > 0 ? parts.join(', ') : 'No significant changes';
}

export function calculateConfidenceScore(analysis) {
  let score = 0;
  let maxScore = 0;

  // Pricing completeness (40 points)
  maxScore += 40;
  if (analysis?.pricing?.tiers?.length > 0) {
    score += 20;
    const tiersWithPrice = analysis.pricing.tiers.filter(t => t.price && t.price !== 'null');
    score += Math.min(20, (tiersWithPrice.length / analysis.pricing.tiers.length) * 20);
  }

  // Positioning completeness (25 points)
  maxScore += 25;
  if (analysis?.positioning?.tagline) score += 5;
  if (analysis?.positioning?.targetCustomers?.length > 0) score += 5;
  if (analysis?.positioning?.differentiators?.length > 0) score += 10;
  if (analysis?.positioning?.valuePropositions?.length > 0) score += 5;

  // Features completeness (15 points)
  maxScore += 15;
  if (analysis?.features?.highlighted?.length > 0) score += 10;
  if (analysis?.features?.byTier && Object.keys(analysis.features.byTier).length > 0) score += 5;

  // Social proof completeness (15 points)
  maxScore += 15;
  if (analysis?.socialProof?.customerLogos?.length > 0) score += 5;
  if (analysis?.socialProof?.metricsClaimed?.length > 0) score += 5;
  if (analysis?.socialProof?.partnerships?.length > 0) score += 5;

  // CTAs (5 points)
  maxScore += 5;
  if (analysis?.callsToAction?.primary) score += 5;

  const percentage = Math.round((score / maxScore) * 100);

  return {
    score: percentage,
    level: percentage >= 80 ? 'high' : percentage >= 50 ? 'medium' : 'low',
    label: percentage >= 80 ? 'High Confidence' : percentage >= 50 ? 'Medium Confidence' : 'Low Confidence'
  };
}
