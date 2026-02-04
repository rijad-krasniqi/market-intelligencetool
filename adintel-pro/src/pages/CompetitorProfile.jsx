import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Calendar, Link2, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import FormatBadge from '../components/common/FormatBadge';
import AdCard from '../components/common/AdCard';
import Pagination from '../components/common/Pagination';
import ExportButton from '../components/common/ExportButton';
import DonutChart from '../components/charts/DonutChart';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import {
  getCompetitorStats,
  getAdsByAdvertiser,
  getTopKeywords,
  getAverageBodyLength,
  getAverageHeadlineLength,
  getCountryDistribution,
  getAdTimeline,
} from '../utils/dataProcessing';
import { formatDate, extractDomain, getCountryFlag, CHART_COLORS, truncate } from '../utils/helpers';

const PAGE_SIZE = 6;

export default function CompetitorProfile() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);

  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => getCompetitorStats(decodedName), [decodedName]);
  const ads = useMemo(() => getAdsByAdvertiser(decodedName), [decodedName]);
  const keywords = useMemo(() => getTopKeywords(ads, 15), [ads]);
  const overallAvgBodyLength = useMemo(() => getAverageBodyLength(), []);
  const overallAvgHeadlineLength = useMemo(() => getAverageHeadlineLength(), []);

  // Pagination
  const totalPages = Math.ceil(ads.length / PAGE_SIZE);
  const paginatedAds = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return ads.slice(start, start + PAGE_SIZE);
  }, [ads, currentPage]);

  // Format chart data
  const formatChartData = useMemo(() => {
    return Object.entries(stats?.formats || {})
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  // CTA chart data
  const ctaChartData = useMemo(() => {
    return Object.entries(stats?.ctas || {})
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats]);

  // Domain data
  const domainData = useMemo(() => {
    const domainCounts = {};
    ads.forEach((ad) => {
      if (ad.clickUrl) {
        const domain = extractDomain(ad.clickUrl);
        domainCounts[domain] = (domainCounts[domain] || 0) + 1;
      }
    });
    return Object.entries(domainCounts)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count);
  }, [ads]);

  // Get longest and shortest body
  const bodyAnalysis = useMemo(() => {
    const adsWithBody = ads.filter((ad) => ad.body);
    if (adsWithBody.length === 0) return { longest: null, shortest: null };

    const sorted = [...adsWithBody].sort((a, b) => b.body.length - a.body.length);
    return {
      longest: sorted[0],
      shortest: sorted[sorted.length - 1],
    };
  }, [ads]);

  // Timeline data
  const timelineData = useMemo(() => {
    return ads
      .filter((ad) => ad.availability?.start)
      .map((ad) => ({
        adId: ad.adId,
        start: ad.availability.start,
        end: ad.availability.end,
        format: ad.format,
      }))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }, [ads]);

  // Country distribution for this competitor
  const countryData = useMemo(() => {
    const countries = {};
    ads.forEach((ad) => {
      if (ad.impressionsPerCountry) {
        ad.impressionsPerCountry.forEach(({ country, impressions }) => {
          if (!countries[country]) countries[country] = 0;
          const pct = impressions === '<1%' ? 0.5 : parseFloat(impressions.replace('%', ''));
          countries[country] += pct;
        });
      }
    });
    return Object.entries(countries)
      .map(([country, value]) => ({
        name: `${getCountryFlag(country)} ${country}`,
        value: Math.round(value * 10) / 10,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
  }, [ads]);

  if (!stats) {
    return (
      <div className="min-h-screen">
        <Header title="Competitor Not Found" />
        <div className="p-6 text-center">
          <p className="text-[#8B7FB5] mb-4">The competitor you're looking for doesn't exist.</p>
          <Link
            to="/competitors"
            className="text-violet-400 hover:text-violet-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Competitors
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header title={stats.name} />

      <div className="p-6 space-y-8">
        {/* Back Link */}
        <Link
          to="/competitors"
          className="inline-flex items-center gap-2 text-[#C4B5FD] hover:text-[#F5F3FF] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Competitors
        </Link>

        {/* Header Section */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {stats.logo ? (
              <img
                src={stats.logo}
                alt={stats.name}
                className="w-24 h-24 rounded-xl object-cover"
                onError={(e) => (e.target.style.display = 'none')}
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
                <Users className="w-12 h-12 text-white/70" />
              </div>
            )}

            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#F5F3FF] mb-1">{stats.name}</h1>
              {stats.paidBy && stats.paidBy !== stats.name && (
                <p className="text-[#8B7FB5] mb-2">Paid by: {stats.paidBy}</p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-violet-600/20 text-violet-300 text-sm">
                  {stats.totalAds} ads
                </span>
                <span className="px-3 py-1 rounded-full bg-cyan-600/20 text-cyan-300 text-sm">
                  {Object.keys(stats.formats).length} formats
                </span>
                {stats.dateRange && (
                  <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/20 text-emerald-300 text-sm">
                    <Calendar className="w-4 h-4" />
                    {formatDate(stats.dateRange.start)} - {formatDate(stats.dateRange.end)}
                  </span>
                )}
              </div>
            </div>

            {stats.advertiserUrl && (
              <a
                href={stats.advertiserUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] hover:text-[#F5F3FF] transition-colors"
              >
                View LinkedIn Page
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Section 1: Format Strategy */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Ad Format Strategy</h2>
            <DonutChart data={formatChartData} dataKey="value" nameKey="name" height={280} />
          </div>

          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Format Breakdown</h2>
            <div className="space-y-3">
              {formatChartData.map(({ name, value }, index) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                    />
                    <FormatBadge format={name} small />
                  </div>
                  <div className="text-right">
                    <span className="text-[#F5F3FF] font-semibold">{value}</span>
                    <span className="text-[#8B7FB5] ml-2">
                      ({Math.round((value / stats.totalAds) * 100)}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: CTA Analysis */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">CTA Analysis</h2>
          {ctaChartData.length > 0 ? (
            <HorizontalBarChart
              data={ctaChartData}
              dataKey="value"
              nameKey="name"
              height={Math.max(200, ctaChartData.length * 40)}
            />
          ) : (
            <p className="text-[#8B7FB5] text-center py-8">No CTA data available</p>
          )}
        </div>

        {/* Section 3: Copy Analysis */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Copy Analysis</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Average Body Length */}
            <div>
              <p className="text-sm text-[#8B7FB5] mb-2">Average Body Length</p>
              <div className="flex items-end gap-4">
                <span className="text-3xl font-bold text-[#F5F3FF]">
                  {stats.avgBodyLength}
                </span>
                <span className="text-[#8B7FB5] pb-1">
                  vs {overallAvgBodyLength} overall ({stats.avgBodyLength > overallAvgBodyLength ? '+' : ''}
                  {stats.avgBodyLength - overallAvgBodyLength} chars)
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#241E35] overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.avgBodyLength / (overallAvgBodyLength * 2)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Average Headline Length */}
            <div>
              <p className="text-sm text-[#8B7FB5] mb-2">Average Headline Length</p>
              <div className="flex items-end gap-4">
                <span className="text-3xl font-bold text-[#F5F3FF]">
                  {stats.avgHeadlineLength}
                </span>
                <span className="text-[#8B7FB5] pb-1">
                  vs {overallAvgHeadlineLength} overall ({stats.avgHeadlineLength > overallAvgHeadlineLength ? '+' : ''}
                  {stats.avgHeadlineLength - overallAvgHeadlineLength} chars)
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#241E35] overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{
                    width: `${Math.min(100, (stats.avgHeadlineLength / (overallAvgHeadlineLength * 2)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Longest/Shortest Copy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {bodyAnalysis.longest && (
              <div className="bg-[#241E35] rounded-lg p-4">
                <p className="text-xs uppercase text-[#8B7FB5] mb-2">
                  Longest Body ({bodyAnalysis.longest.body.length} chars)
                </p>
                <p className="text-sm text-[#C4B5FD] line-clamp-4">
                  {bodyAnalysis.longest.body}
                </p>
              </div>
            )}
            {bodyAnalysis.shortest && (
              <div className="bg-[#241E35] rounded-lg p-4">
                <p className="text-xs uppercase text-[#8B7FB5] mb-2">
                  Shortest Body ({bodyAnalysis.shortest.body.length} chars)
                </p>
                <p className="text-sm text-[#C4B5FD]">{bodyAnalysis.shortest.body}</p>
              </div>
            )}
          </div>

          {/* Top Keywords */}
          <div>
            <p className="text-sm text-[#8B7FB5] mb-3">Common Words/Phrases (Top 15)</p>
            <div className="flex flex-wrap gap-2">
              {keywords.map(({ word, count }, index) => (
                <span
                  key={word}
                  className="px-3 py-1 rounded-full text-sm transition-all"
                  style={{
                    backgroundColor: `rgba(139, 92, 246, ${0.1 + (1 - index / keywords.length) * 0.3})`,
                    color: '#C4B5FD',
                    fontSize: `${Math.max(12, 16 - index * 0.5)}px`,
                  }}
                >
                  {word} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Destination URLs */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4 flex items-center gap-2">
            <Link2 className="w-5 h-5 text-violet-400" />
            Destination URL Analysis
          </h2>

          {domainData.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2D2545]">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Domain
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-[#C4B5FD] uppercase">
                      Ads
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-semibold text-[#C4B5FD] uppercase">
                      % of Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3255]">
                  {domainData.map(({ domain, count }) => (
                    <tr key={domain} className="hover:bg-[#2D2545]">
                      <td className="px-4 py-2 text-sm text-[#F5F3FF] font-mono">{domain}</td>
                      <td className="px-4 py-2 text-sm text-[#F5F3FF] text-right">{count}</td>
                      <td className="px-4 py-2 text-sm text-[#8B7FB5] text-right">
                        {Math.round((count / stats.totalAds) * 100)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[#8B7FB5] text-center py-8">No destination URL data available</p>
          )}
        </div>

        {/* Section 5: Geographic Reach */}
        {countryData.length > 0 && (
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Geographic Reach</h2>
            <HorizontalBarChart
              data={countryData}
              dataKey="value"
              nameKey="name"
              height={Math.max(200, countryData.length * 30)}
            />
          </div>
        )}

        {/* Section 6: Timeline */}
        {timelineData.length > 0 && (
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Campaign Timeline</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {timelineData.map((item) => (
                <div
                  key={item.adId}
                  className="flex items-center gap-3 p-2 rounded-lg bg-[#241E35]"
                >
                  <FormatBadge format={item.format} small showIcon={false} />
                  <span className="text-sm text-[#F5F3FF]">
                    {formatDate(item.start)} - {formatDate(item.end)}
                  </span>
                  <Link
                    to={`/ads/${item.adId}`}
                    className="text-sm text-violet-400 hover:text-violet-300 ml-auto"
                  >
                    View Ad
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 7: Ad Gallery */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F5F3FF]">
              All Ads ({ads.length})
            </h2>
            <ExportButton data={ads} filename={`adintel-${stats.name.replace(/\s+/g, '-')}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAds.map((ad) => (
              <AdCard key={ad.adId} ad={ad} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
