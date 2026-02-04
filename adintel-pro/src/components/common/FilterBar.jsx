import { useState } from 'react';
import { Search, X, ChevronDown } from 'lucide-react';
import FormatBadge from './FormatBadge';
import { getUniqueAdvertisers, getAllCTAs, getAllFormats } from '../../utils/dataProcessing';

export default function FilterBar({ filters, onFilterChange, totalCount, filteredCount }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const advertisers = getUniqueAdvertisers();
  const allCTAs = getAllCTAs();
  const allFormats = getAllFormats();

  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key, value) => {
    const current = filters[key] || [];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    updateFilter(key, updated);
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      competitors: [],
      formats: [],
      ctas: [],
      hasImage: 'all',
      hasVideo: 'all',
      hasImpressions: 'all',
      dateStart: null,
      dateEnd: null,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.competitors?.length > 0 ||
    filters.formats?.length > 0 ||
    filters.ctas?.length > 0 ||
    filters.hasImage !== 'all' ||
    filters.hasVideo !== 'all' ||
    filters.hasImpressions !== 'all' ||
    filters.dateStart ||
    filters.dateEnd;

  const MultiSelectDropdown = ({ label, options, selected, onToggle, renderOption }) => {
    const isOpen = openDropdown === label;

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : label)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:border-violet-500/50 transition-all duration-200"
        >
          <span>{label}</span>
          {selected.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-violet-600 text-white text-xs">
              {selected.length}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-[#1A1425] border border-[#3B3255] rounded-lg shadow-xl z-50">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => onToggle(option)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#2D2545] transition-colors ${
                  selected.includes(option) ? 'bg-violet-600/20' : ''
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border ${
                    selected.includes(option)
                      ? 'bg-violet-600 border-violet-600'
                      : 'border-[#3B3255]'
                  }`}
                >
                  {selected.includes(option) && (
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                {renderOption ? renderOption(option) : <span className="text-sm text-[#F5F3FF]">{option}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ToggleFilter = ({ label, value, onChange }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#8B7FB5]">{label}:</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] text-sm focus:border-violet-500 focus:ring-0"
      >
        <option value="all">All</option>
        <option value="yes">Yes</option>
        <option value="no">No</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7FB5]" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Search ads..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#F5F3FF] placeholder-[#8B7FB5] focus:border-violet-500 focus:ring-0"
          />
        </div>

        {/* Competitor filter */}
        <MultiSelectDropdown
          label="Competitors"
          options={advertisers.map((a) => a.name)}
          selected={filters.competitors || []}
          onToggle={(value) => toggleArrayFilter('competitors', value)}
        />

        {/* Format filter */}
        <MultiSelectDropdown
          label="Formats"
          options={allFormats}
          selected={filters.formats || []}
          onToggle={(value) => toggleArrayFilter('formats', value)}
          renderOption={(format) => <FormatBadge format={format} small />}
        />

        {/* CTA filter */}
        <MultiSelectDropdown
          label="CTAs"
          options={allCTAs}
          selected={filters.ctas || []}
          onToggle={(value) => toggleArrayFilter('ctas', value)}
        />

        {/* Toggle filters */}
        <ToggleFilter
          label="Has Image"
          value={filters.hasImage || 'all'}
          onChange={(value) => updateFilter('hasImage', value)}
        />

        <ToggleFilter
          label="Has Video"
          value={filters.hasVideo || 'all'}
          onChange={(value) => updateFilter('hasVideo', value)}
        />

        <ToggleFilter
          label="Has Impressions"
          value={filters.hasImpressions || 'all'}
          onChange={(value) => updateFilter('hasImpressions', value)}
        />

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateStart || ''}
            onChange={(e) => updateFilter('dateStart', e.target.value || null)}
            className="px-2 py-1 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] text-sm focus:border-violet-500 focus:ring-0"
          />
          <span className="text-[#8B7FB5]">to</span>
          <input
            type="date"
            value={filters.dateEnd || ''}
            onChange={(e) => updateFilter('dateEnd', e.target.value || null)}
            className="px-2 py-1 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] text-sm focus:border-violet-500 focus:ring-0"
          />
        </div>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear All
          </button>
        )}
      </div>

      {/* Results count and active filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-[#8B7FB5]">
          Showing <span className="text-[#F5F3FF] font-semibold">{filteredCount}</span> of{' '}
          <span className="text-[#F5F3FF] font-semibold">{totalCount}</span> ads
        </span>

        {/* Active filter chips */}
        {filters.competitors?.map((comp) => (
          <span
            key={comp}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-600/20 text-violet-300 text-xs"
          >
            {comp}
            <button onClick={() => toggleArrayFilter('competitors', comp)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {filters.formats?.map((format) => (
          <span key={format} className="flex items-center gap-1">
            <FormatBadge format={format} small />
            <button
              onClick={() => toggleArrayFilter('formats', format)}
              className="text-[#8B7FB5] hover:text-[#F5F3FF]"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}

        {filters.ctas?.map((cta) => (
          <span
            key={cta}
            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#241E35] text-[#C4B5FD] text-xs"
          >
            {cta}
            <button onClick={() => toggleArrayFilter('ctas', cta)}>
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
