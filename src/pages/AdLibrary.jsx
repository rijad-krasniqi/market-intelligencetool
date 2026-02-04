import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, List, ExternalLink, Eye } from 'lucide-react';
import Header from '../components/layout/Header';
import AdCard from '../components/common/AdCard';
import FilterBar from '../components/common/FilterBar';
import Pagination from '../components/common/Pagination';
import EmptyState from '../components/common/EmptyState';
import ExportButton from '../components/common/ExportButton';
import FormatBadge from '../components/common/FormatBadge';
import AdImage from '../components/common/AdImage';
import { getAllAds, filterAds } from '../utils/dataProcessing';
import { truncate } from '../utils/helpers';

const GRID_PAGE_SIZE = 12;
const TABLE_PAGE_SIZE = 20;

export default function AdLibrary() {
  const navigate = useNavigate();
  const allAds = useMemo(() => getAllAds(), []);

  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
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

  // Filter ads
  const filteredAds = useMemo(() => {
    return filterAds(filters);
  }, [filters]);

  // Pagination
  const pageSize = viewMode === 'grid' ? GRID_PAGE_SIZE : TABLE_PAGE_SIZE;
  const totalPages = Math.ceil(filteredAds.length / pageSize);
  const paginatedAds = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAds.slice(start, start + pageSize);
  }, [filteredAds, currentPage, pageSize]);

  // Reset to page 1 when filters change
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen">
      <Header title="Ad Library" />

      <div className="p-6 space-y-6">
        {/* Filter Bar */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-4">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            totalCount={allAds.length}
            filteredCount={filteredAds.length}
          />
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-violet-600 text-white'
                  : 'bg-[#241E35] text-[#C4B5FD] hover:bg-[#2D2545]'
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-violet-600 text-white'
                  : 'bg-[#241E35] text-[#C4B5FD] hover:bg-[#2D2545]'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          <ExportButton data={filteredAds} filename="adintel-ads" />
        </div>

        {/* Content */}
        {filteredAds.length === 0 ? (
          <EmptyState
            title="No ads found"
            description="Try adjusting your filters or search query"
            action={() => handleFilterChange({
              search: '',
              competitors: [],
              formats: [],
              ctas: [],
              hasImage: 'all',
              hasVideo: 'all',
              hasImpressions: 'all',
              dateStart: null,
              dateEnd: null,
            })}
            actionLabel="Clear Filters"
          />
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAds.map((ad) => (
              <AdCard key={ad.adId} ad={ad} />
            ))}
          </div>
        ) : (
          /* Table View */
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2D2545]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      Ad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      Advertiser
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      Headline
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      Format
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      CTAs
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      Impressions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3255]">
                  {paginatedAds.map((ad, index) => (
                    <tr
                      key={ad.adId}
                      className={`${
                        index % 2 === 0 ? 'bg-[#1A1425]' : 'bg-[#241E35]'
                      } hover:bg-[#2D2545] cursor-pointer transition-colors`}
                      onClick={() => navigate(`/ads/${ad.adId}`)}
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <AdImage
                            src={ad.imageUrl || ad.advertiserLogo}
                            alt={ad.advertiserName}
                            format={ad.format}
                            className="w-full h-full"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {ad.advertiserLogo && (
                            <img
                              src={ad.advertiserLogo}
                              alt=""
                              className="w-6 h-6 rounded-full"
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          )}
                          <span className="text-sm text-[#F5F3FF]">
                            {truncate(ad.advertiserName, 20)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-[#C4B5FD]">
                          {truncate(ad.headline || ad.body || 'N/A', 40)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <FormatBadge format={ad.format} small />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(ad.ctas || []).slice(0, 2).map((cta, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-full bg-[#241E35] text-xs text-[#C4B5FD]"
                            >
                              {cta}
                            </span>
                          ))}
                          {(ad.ctas || []).length > 2 && (
                            <span className="text-xs text-[#8B7FB5]">
                              +{ad.ctas.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {ad.impressions ? (
                          <span className="flex items-center gap-1 text-sm text-emerald-400">
                            <Eye className="w-4 h-4" />
                            {ad.impressions}
                          </span>
                        ) : (
                          <span className="text-sm text-[#8B7FB5]">N/A</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/ads/${ad.adId}`);
                            }}
                            className="p-1.5 rounded-md bg-violet-600/20 text-violet-300 hover:bg-violet-600/30"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <a
                            href={ad.adLibraryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-md bg-[#241E35] text-[#8B7FB5] hover:text-[#F5F3FF] hover:bg-[#2D2545]"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {filteredAds.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
