// Truncate text with ellipsis
export function truncate(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

// Format date to readable string
export function formatDate(dateStr) {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Calculate days between two dates
export function daysBetween(start, end) {
  if (!start || !end) return null;
  const diff = new Date(end) - new Date(start);
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Extract domain from URL
export function extractDomain(url) {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch {
    return url;
  }
}

// Format large numbers with commas
export function formatNumber(num) {
  if (num === null || num === undefined) return 'N/A';
  return num.toLocaleString();
}

// Calculate percentage
export function calculatePercentage(value, total) {
  if (!total || total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Parse impression percentage string to number
export function parseImpressionPercentage(str) {
  if (!str) return 0;
  if (str === '<1%') return 0.5;
  return parseFloat(str.replace('%', '')) || 0;
}

// Generate CSV from array of objects
export function generateCSV(data, filename = 'export') {
  if (!data || data.length === 0) return;

  // Get all unique keys from all objects
  const allKeys = [...new Set(data.flatMap(obj => Object.keys(obj)))];

  // Flatten nested objects and arrays
  const flattenValue = (value) => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) {
      return value.map(v => {
        if (typeof v === 'object') {
          return Object.values(v).join(':');
        }
        return v;
      }).join(';');
    }
    if (typeof value === 'object') {
      return Object.entries(value).map(([k, v]) => `${k}:${v}`).join(';');
    }
    return String(value).replace(/"/g, '""');
  };

  // Create CSV content
  const headers = allKeys.join(',');
  const rows = data.map(obj =>
    allKeys.map(key => {
      const value = flattenValue(obj[key]);
      // Wrap in quotes if contains comma, newline, or quote
      if (value.includes(',') || value.includes('\n') || value.includes('"')) {
        return `"${value}"`;
      }
      return value;
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');

  // Trigger download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
}

// Get country flag emoji from country name
export function getCountryFlag(countryName) {
  const countryFlags = {
    'United States': '🇺🇸',
    'United Kingdom': '🇬🇧',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Switzerland': '🇨🇭',
    'Austria': '🇦🇹',
    'Portugal': '🇵🇹',
    'Ireland': '🇮🇪',
    'Poland': '🇵🇱',
    'Sweden': '🇸🇪',
    'Denmark': '🇩🇰',
    'Norway': '🇳🇴',
    'Finland': '🇫🇮',
    'Greece': '🇬🇷',
    'Czechia': '🇨🇿',
    'Romania': '🇷🇴',
    'Hungary': '🇭🇺',
    'Bulgaria': '🇧🇬',
    'Croatia': '🇭🇷',
    'Slovakia': '🇸🇰',
    'Slovenia': '🇸🇮',
    'Latvia': '🇱🇻',
    'Lithuania': '🇱🇹',
    'Estonia': '🇪🇪',
    'Luxembourg': '🇱🇺',
    'Malta': '🇲🇹',
    'Cyprus': '🇨🇾',
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'New Zealand': '🇳🇿',
    'Japan': '🇯🇵',
    'South Korea': '🇰🇷',
    'China': '🇨🇳',
    'India': '🇮🇳',
    'Brazil': '🇧🇷',
    'Mexico': '🇲🇽',
    'Argentina': '🇦🇷',
    'South Africa': '🇿🇦',
    'United Arab Emirates': '🇦🇪',
    'Saudi Arabia': '🇸🇦',
    'Israel': '🇮🇱',
    'Singapore': '🇸🇬',
    'Malaysia': '🇲🇾',
    'Thailand': '🇹🇭',
    'Indonesia': '🇮🇩',
    'Philippines': '🇵🇭',
    'Vietnam': '🇻🇳',
    'Turkey': '🇹🇷',
    'Russia': '🇷🇺',
    'Ukraine': '🇺🇦',
    'Egypt': '🇪🇬',
    'Nigeria': '🇳🇬',
    'Kenya': '🇰🇪',
    'European Union': '🇪🇺'
  };
  return countryFlags[countryName] || '🌍';
}

// Chart colors array
export const CHART_COLORS = [
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#F59E0B', // amber
  '#EF4444', // red
  '#10B981', // emerald
  '#EC4899', // pink
  '#3B82F6', // blue
];

// Format badge colors
export const FORMAT_BADGE_COLORS = {
  SINGLE_IMAGE: { bg: 'bg-violet-500/20', text: 'text-violet-300' },
  VIDEO: { bg: 'bg-cyan-500/20', text: 'text-cyan-300' },
  CAROUSEL: { bg: 'bg-amber-500/20', text: 'text-amber-300' },
  DOCUMENT: { bg: 'bg-emerald-500/20', text: 'text-emerald-300' },
  JOB: { bg: 'bg-blue-500/20', text: 'text-blue-300' },
  FOLLOW_COMPANY: { bg: 'bg-pink-500/20', text: 'text-pink-300' },
};
