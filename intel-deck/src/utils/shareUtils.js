// Utilities for sharing analyses via encoded URLs

export function encodeAnalysisForShare(analysis) {
  // Create a minimal shareable version
  const shareData = {
    n: analysis.companyName,
    d: analysis.analyzedAt,
    p: analysis.pricing ? {
      t: analysis.pricing.tiers?.map(t => ({
        n: t.name,
        p: t.price,
        b: t.billingPeriod,
        f: t.keyFeatures?.slice(0, 5)
      })),
      f: analysis.pricing.hasFreeTier,
      e: analysis.pricing.hasEnterpriseTier,
      tr: analysis.pricing.trialAvailable
    } : null,
    o: analysis.positioning ? {
      tg: analysis.positioning.tagline,
      tc: analysis.positioning.targetCustomers?.slice(0, 3),
      df: analysis.positioning.differentiators?.slice(0, 3),
      vp: analysis.positioning.valuePropositions?.slice(0, 3)
    } : null,
    f: analysis.features?.highlighted?.slice(0, 10),
    s: analysis.socialProof ? {
      cl: analysis.socialProof.customerLogos?.slice(0, 5),
      mc: analysis.socialProof.metricsClaimed?.slice(0, 3)
    } : null
  };

  const jsonStr = JSON.stringify(shareData);
  // Use base64 encoding for URL safety
  const encoded = btoa(encodeURIComponent(jsonStr));
  return encoded;
}

export function decodeSharedAnalysis(encoded) {
  try {
    const jsonStr = decodeURIComponent(atob(encoded));
    const shareData = JSON.parse(jsonStr);

    // Reconstruct full analysis structure
    return {
      companyName: shareData.n,
      analyzedAt: shareData.d,
      sourceType: 'shared',
      pricing: shareData.p ? {
        tiers: shareData.p.t?.map(t => ({
          name: t.n,
          price: t.p,
          billingPeriod: t.b,
          keyFeatures: t.f || [],
          limitations: [],
          confidence: 'medium'
        })),
        hasFreeTier: shareData.p.f,
        hasEnterpriseTier: shareData.p.e,
        trialAvailable: shareData.p.tr
      } : null,
      positioning: shareData.o ? {
        tagline: shareData.o.tg,
        targetCustomers: shareData.o.tc || [],
        differentiators: shareData.o.df || [],
        valuePropositions: shareData.o.vp || []
      } : null,
      features: {
        highlighted: shareData.f || [],
        byTier: {}
      },
      socialProof: shareData.s ? {
        customerLogos: shareData.s.cl || [],
        metricsClaimed: shareData.s.mc || [],
        caseStudies: [],
        awards: [],
        partnerships: []
      } : null,
      callsToAction: null
    };
  } catch (e) {
    console.error('Failed to decode shared analysis:', e);
    return null;
  }
}

export function generateShareUrl(analysis) {
  const encoded = encodeAnalysisForShare(analysis);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${encoded}`;
}

export function copyShareUrl(analysis) {
  const url = generateShareUrl(analysis);
  return navigator.clipboard.writeText(url).then(() => url);
}

export function getSharedAnalysisFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const shareParam = params.get('share');
  if (shareParam) {
    return decodeSharedAnalysis(shareParam);
  }
  return null;
}
