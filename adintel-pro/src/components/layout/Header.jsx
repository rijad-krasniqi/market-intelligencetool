import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Command, X } from 'lucide-react';
import { searchAds } from '../../utils/dataProcessing';
import { truncate } from '../../utils/helpers';
import FormatBadge from '../common/FormatBadge';

export default function Header({ title }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [searchOpen]);

  // Search as user types
  useEffect(() => {
    if (query.trim()) {
      const filtered = searchAds(query).slice(0, 8);
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (adId) => {
    navigate(`/ads/${adId}`);
    setSearchOpen(false);
    setQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0F0B1A]/80 backdrop-blur-sm border-b border-[#3B3255] px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#F5F3FF]">{title}</h1>

        {/* Search */}
        <div ref={searchRef} className="relative">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#8B7FB5] hover:border-violet-500/50 hover:text-[#C4B5FD] transition-all duration-200"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Search ads...</span>
            <kbd className="hidden sm:flex items-center gap-0.5 px-2 py-0.5 rounded bg-[#1A1425] text-xs text-[#8B7FB5]">
              <Command className="w-3 h-3" />K
            </kbd>
          </button>

          {/* Search Modal */}
          {searchOpen && (
            <div className="absolute right-0 top-12 w-96 bg-[#1A1425] border border-[#3B3255] rounded-xl shadow-2xl overflow-hidden animate-slideUp">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#3B3255]">
                <Search className="w-5 h-5 text-[#8B7FB5]" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by headline, body, advertiser, ID..."
                  className="flex-1 bg-transparent border-0 text-[#F5F3FF] placeholder-[#8B7FB5] focus:outline-none focus:ring-0"
                />
                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="text-[#8B7FB5] hover:text-[#F5F3FF]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((ad) => (
                    <button
                      key={ad.adId}
                      onClick={() => handleResultClick(ad.adId)}
                      className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#2D2545] transition-colors text-left"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-[#F5F3FF]">
                            {ad.advertiserName}
                          </span>
                          <FormatBadge format={ad.format} small />
                        </div>
                        <p className="text-sm text-[#8B7FB5] line-clamp-1">
                          {truncate(ad.headline || ad.body || 'No content', 60)}
                        </p>
                        <span className="text-xs text-[#8B7FB5] font-mono">
                          ID: {ad.adId}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {query && results.length === 0 && (
                <div className="px-4 py-8 text-center text-[#8B7FB5]">
                  No ads found matching "{query}"
                </div>
              )}

              {!query && (
                <div className="px-4 py-8 text-center text-[#8B7FB5]">
                  <p>Start typing to search...</p>
                  <p className="text-xs mt-2">Search across headlines, body text, advertisers, and IDs</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
