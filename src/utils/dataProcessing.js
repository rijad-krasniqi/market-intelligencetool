import adsData from '../data/ads.json';
import { parseImpressionPercentage } from './helpers';

// Stop words for text analysis
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'can', 'shall', 'it', 'its', 'this', 'that',
  'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they', 'me', 'him',
  'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'what',
  'which', 'who', 'whom', 'where', 'when', 'how', 'all', 'each', 'every',
  'both', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'not',
  'only', 'own', 'same', 'so', 'than', 'too', 'very', 'just', 'because',
  'as', 'about', 'up', 'out', 'if', 'from', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'between', 'under', 'again',
  'further', 'then', 'once', 'here', 'there', 'any', 'see', 'more',
  'also', 'over', 'get', 'new', 'one', 'two', 'like', 'make', 'know',
  'take', 'come', 'think', 'look', 'want', 'give', 'use', 'find',
  'tell', 'ask', 'work', 'seem', 'feel', 'try', 'leave', 'call',
  'need', 'become', 'keep', 'let', 'begin', 'show', 'hear', 'play',
  'run', 'move', 'live', 'believe', 'bring', 'happen', 'write',
  'provide', 'sit', 'stand', 'lose', 'pay', 'meet', 'include',
  'continue', 'set', 'learn', 'change', 'lead', 'understand',
  'watch', 'follow', 'stop', 'create', 'speak', 'read', 'add',
  'spend', 'grow', 'open', 'walk', 'win', 'offer', 'remember',
  'love', 'consider', 'appear', 'buy', 'wait', 'serve', 'die',
  'send', 'expect', 'build', 'stay', 'fall', 'oh', 'yeah',
  'well', 'back', 'going', 'now', 'still', 'even', 'way',
  'us', 'our', 're', 've', 'don', 't', 's', 'amp'
]);

// ============ Core Accessors ============

// Get all ads
export function getAllAds() {
  return adsData;
}

// Get single ad by ID
export function getAdById(adId) {
  return adsData.find(ad => ad.adId === adId) || null;
}

// Get ads by advertiser name
export function getAdsByAdvertiser(name) {
  return adsData.filter(ad => ad.advertiserName === name);
}

// ============ Aggregations ============

// Get unique advertisers with stats
export function getUniqueAdvertisers() {
  const advertiserMap = new Map();

  adsData.forEach(ad => {
    const name = ad.advertiserName;
    if (!advertiserMap.has(name)) {
      advertiserMap.set(name, {
        name,
        logo: ad.advertiserLogo,
        paidBy: ad.paidBy,
        advertiserUrl: ad.advertiserUrl,
        adCount: 0,
        formats: new Set(),
        ctas: new Set(),
        hasImpressionData: false,
      });
    }
    const advertiser = advertiserMap.get(name);
    advertiser.adCount++;
    advertiser.formats.add(ad.format);
    (ad.ctas || []).forEach(cta => advertiser.ctas.add(cta));
    if (ad.impressions) advertiser.hasImpressionData = true;
  });

  return Array.from(advertiserMap.values()).map(adv => ({
    ...adv,
    formats: Array.from(adv.formats),
    ctas: Array.from(adv.ctas),
    formatCount: adv.formats.size,
    ctaCount: adv.ctas.size,
  })).sort((a, b) => b.adCount - a.adCount);
}

// Get format distribution
export function getFormatDistribution() {
  const distribution = {};
  adsData.forEach(ad => {
    distribution[ad.format] = (distribution[ad.format] || 0) + 1;
  });
  return distribution;
}

// Get CTA distribution
export function getCTADistribution() {
  const distribution = {};
  adsData.forEach(ad => {
    (ad.ctas || []).forEach(cta => {
      distribution[cta] = (distribution[cta] || 0) + 1;
    });
  });
  return distribution;
}

// Get impression distribution
export function getImpressionDistribution() {
  const distribution = {};
  adsData.forEach(ad => {
    if (ad.impressions) {
      distribution[ad.impressions] = (distribution[ad.impressions] || 0) + 1;
    }
  });
  return distribution;
}

// Get ads with impression data count
export function getAdsWithImpressionData() {
  return adsData.filter(ad => ad.impressions).length;
}

// ============ Per-Competitor Analytics ============

// Get full stats for one competitor
export function getCompetitorStats(name) {
  const ads = getAdsByAdvertiser(name);
  if (ads.length === 0) return null;

  const formats = {};
  const ctas = {};
  const domains = new Set();
  let totalBodyLength = 0;
  let totalHeadlineLength = 0;
  let bodyCount = 0;
  let headlineCount = 0;
  let adsWithImpressions = 0;
  let dateRange = { start: null, end: null };

  ads.forEach(ad => {
    // Format count
    formats[ad.format] = (formats[ad.format] || 0) + 1;

    // CTA count
    (ad.ctas || []).forEach(cta => {
      ctas[cta] = (ctas[cta] || 0) + 1;
    });

    // Domain extraction
    if (ad.clickUrl) {
      try {
        domains.add(new URL(ad.clickUrl).hostname.replace('www.', ''));
      } catch {}
    }

    // Body length
    if (ad.body) {
      totalBodyLength += ad.body.length;
      bodyCount++;
    }

    // Headline length
    if (ad.headline) {
      totalHeadlineLength += ad.headline.length;
      headlineCount++;
    }

    // Impressions
    if (ad.impressions) adsWithImpressions++;

    // Date range
    if (ad.availability) {
      if (!dateRange.start || ad.availability.start < dateRange.start) {
        dateRange.start = ad.availability.start;
      }
      if (!dateRange.end || ad.availability.end > dateRange.end) {
        dateRange.end = ad.availability.end;
      }
    }
  });

  return {
    name,
    logo: ads[0].advertiserLogo,
    paidBy: ads[0].paidBy,
    advertiserUrl: ads[0].advertiserUrl,
    totalAds: ads.length,
    formats,
    ctas,
    domains: Array.from(domains),
    avgBodyLength: bodyCount > 0 ? Math.round(totalBodyLength / bodyCount) : 0,
    avgHeadlineLength: headlineCount > 0 ? Math.round(totalHeadlineLength / headlineCount) : 0,
    adsWithImpressions,
    dateRange: dateRange.start ? dateRange : null,
    topFormat: Object.entries(formats).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
    topCTA: Object.entries(ctas).sort((a, b) => b[1] - a[1])[0]?.[0] || null,
  };
}

// Get comparison data for all competitors
export function getCompetitorComparison() {
  const advertisers = getUniqueAdvertisers();
  return advertisers.map(adv => getCompetitorStats(adv.name));
}

// Get format breakdown for one competitor
export function getCompetitorFormatBreakdown(name) {
  const ads = getAdsByAdvertiser(name);
  const breakdown = {};
  ads.forEach(ad => {
    breakdown[ad.format] = (breakdown[ad.format] || 0) + 1;
  });
  return breakdown;
}

// Get CTA breakdown for one competitor
export function getCompetitorCTABreakdown(name) {
  const ads = getAdsByAdvertiser(name);
  const breakdown = {};
  ads.forEach(ad => {
    (ad.ctas || []).forEach(cta => {
      breakdown[cta] = (breakdown[cta] || 0) + 1;
    });
  });
  return breakdown;
}

// ============ Text Analysis ============

// Get average body text length
export function getAverageBodyLength(ads = adsData) {
  const withBody = ads.filter(ad => ad.body);
  if (withBody.length === 0) return 0;
  const total = withBody.reduce((sum, ad) => sum + ad.body.length, 0);
  return Math.round(total / withBody.length);
}

// Get average headline length
export function getAverageHeadlineLength(ads = adsData) {
  const withHeadline = ads.filter(ad => ad.headline);
  if (withHeadline.length === 0) return 0;
  const total = withHeadline.reduce((sum, ad) => sum + ad.headline.length, 0);
  return Math.round(total / withHeadline.length);
}

// Get top keywords from ad copy
export function getTopKeywords(ads = adsData, n = 15) {
  const wordFreq = {};

  ads.forEach(ad => {
    const text = `${ad.body || ''} ${ad.headline || ''}`.toLowerCase();
    const words = text.match(/\b[a-z]{3,}\b/g) || [];

    words.forEach(word => {
      if (!STOP_WORDS.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });
  });

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([word, count]) => ({ word, count }));
}

// Get body length distribution for charting
export function getBodyLengthDistribution(ads = adsData) {
  return ads
    .filter(ad => ad.body)
    .map(ad => ({
      adId: ad.adId,
      advertiser: ad.advertiserName,
      length: ad.body.length,
    }));
}

// ============ Geographic ============

// Get aggregate country distribution
export function getCountryDistribution() {
  const countries = {};
  let totalAdsWithGeo = 0;

  adsData.forEach(ad => {
    if (ad.impressionsPerCountry && ad.impressionsPerCountry.length > 0) {
      totalAdsWithGeo++;
      ad.impressionsPerCountry.forEach(({ country, impressions }) => {
        if (!countries[country]) {
          countries[country] = { totalPercentage: 0, adCount: 0 };
        }
        countries[country].totalPercentage += parseImpressionPercentage(impressions);
        countries[country].adCount++;
      });
    }
  });

  return Object.entries(countries)
    .map(([country, data]) => ({
      country,
      avgPercentage: data.adCount > 0 ? Math.round((data.totalPercentage / data.adCount) * 10) / 10 : 0,
      totalPercentage: Math.round(data.totalPercentage * 10) / 10,
      adCount: data.adCount,
    }))
    .sort((a, b) => b.totalPercentage - a.totalPercentage);
}

// Get country by competitor matrix
export function getCountryByCompetitor() {
  const matrix = {};

  adsData.forEach(ad => {
    if (ad.impressionsPerCountry) {
      const advertiser = ad.advertiserName;
      if (!matrix[advertiser]) matrix[advertiser] = {};

      ad.impressionsPerCountry.forEach(({ country, impressions }) => {
        if (!matrix[advertiser][country]) {
          matrix[advertiser][country] = 0;
        }
        matrix[advertiser][country] += parseImpressionPercentage(impressions);
      });
    }
  });

  return matrix;
}

// ============ Temporal ============

// Get ad timeline data
export function getAdTimeline() {
  return adsData
    .filter(ad => ad.availability?.start && ad.availability?.end)
    .map(ad => ({
      adId: ad.adId,
      advertiser: ad.advertiserName,
      start: ad.availability.start,
      end: ad.availability.end,
      format: ad.format,
    }))
    .sort((a, b) => new Date(a.start) - new Date(b.start));
}

// Get monthly ad volume
export function getMonthlyVolume() {
  const volume = {};

  adsData.forEach(ad => {
    if (ad.availability?.start) {
      const date = new Date(ad.availability.start);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const advertiser = ad.advertiserName;

      if (!volume[month]) volume[month] = {};
      if (!volume[month][advertiser]) volume[month][advertiser] = 0;
      volume[month][advertiser]++;
    }
  });

  return Object.entries(volume)
    .map(([month, advertisers]) => ({ month, ...advertisers }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

// ============ Filtering ============

// Master filter function
export function filterAds(filters = {}) {
  const {
    search = '',
    competitors = [],
    formats = [],
    ctas = [],
    hasImage = 'all',
    hasVideo = 'all',
    hasImpressions = 'all',
    dateStart = null,
    dateEnd = null,
  } = filters;

  return adsData.filter(ad => {
    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      const searchable = `${ad.body || ''} ${ad.headline || ''} ${ad.advertiserName || ''} ${ad.paidBy || ''} ${ad.adId || ''}`.toLowerCase();
      if (!searchable.includes(searchLower)) return false;
    }

    // Competitor filter
    if (competitors.length > 0 && !competitors.includes(ad.advertiserName)) {
      return false;
    }

    // Format filter
    if (formats.length > 0 && !formats.includes(ad.format)) {
      return false;
    }

    // CTA filter
    if (ctas.length > 0 && !(ad.ctas || []).some(cta => ctas.includes(cta))) {
      return false;
    }

    // Has image filter
    if (hasImage === 'yes' && !ad.imageUrl) return false;
    if (hasImage === 'no' && ad.imageUrl) return false;

    // Has video filter
    if (hasVideo === 'yes' && !ad.videoUrl) return false;
    if (hasVideo === 'no' && ad.videoUrl) return false;

    // Has impressions filter
    if (hasImpressions === 'yes' && !ad.impressions) return false;
    if (hasImpressions === 'no' && ad.impressions) return false;

    // Date range filter
    if (dateStart && ad.availability?.start && ad.availability.start < dateStart) {
      return false;
    }
    if (dateEnd && ad.availability?.end && ad.availability.end > dateEnd) {
      return false;
    }

    return true;
  });
}

// ============ Search ============

// Full-text search across ads
export function searchAds(query) {
  if (!query || query.trim() === '') return adsData;

  const queryLower = query.toLowerCase().trim();

  return adsData.filter(ad => {
    const searchable = `${ad.body || ''} ${ad.headline || ''} ${ad.advertiserName || ''} ${ad.paidBy || ''} ${ad.adId || ''}`.toLowerCase();
    return searchable.includes(queryLower);
  });
}

// Get all unique CTAs
export function getAllCTAs() {
  const ctas = new Set();
  adsData.forEach(ad => {
    (ad.ctas || []).forEach(cta => ctas.add(cta));
  });
  return Array.from(ctas).sort();
}

// Get all unique formats
export function getAllFormats() {
  const formats = new Set();
  adsData.forEach(ad => formats.add(ad.format));
  return Array.from(formats);
}

// Get recent ads (sorted by availability.start or dataset position)
export function getRecentAds(limit = 8) {
  const adsWithDates = adsData.filter(ad => ad.availability?.start);
  const sorted = [...adsWithDates].sort((a, b) =>
    new Date(b.availability.start) - new Date(a.availability.start)
  );

  // If we have enough dated ads, return those
  if (sorted.length >= limit) {
    return sorted.slice(0, limit);
  }

  // Otherwise, fill with other ads from the beginning of the dataset
  const idsUsed = new Set(sorted.map(ad => ad.adId));
  const remaining = adsData.filter(ad => !idsUsed.has(ad.adId));
  return [...sorted, ...remaining].slice(0, limit);
}

// Get dataset stats
export function getDatasetStats() {
  const advertisers = getUniqueAdvertisers();
  const formats = getAllFormats();
  const adsWithImpressions = getAdsWithImpressionData();

  return {
    totalAds: adsData.length,
    totalCompetitors: advertisers.length,
    totalFormats: formats.length,
    adsWithImpressions,
    impressionPercentage: Math.round((adsWithImpressions / adsData.length) * 100),
  };
}
