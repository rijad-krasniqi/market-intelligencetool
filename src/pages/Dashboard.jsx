import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, Users, LayoutGrid, Eye, ExternalLink } from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import FormatBadge from '../components/common/FormatBadge';
import AdImage from '../components/common/AdImage';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import DonutChart from '../components/charts/DonutChart';
import {
  getAllAds,
  getUniqueAdvertisers,
  getFormatDistribution,
  getCTADistribution,
  getImpressionDistribution,
  getAdsWithImpressionData,
  getRecentAds,
} from '../utils/dataProcessing';
import { truncate, CHART_COLORS } from '../utils/helpers';

export default function Dashboard() {
  const navigate = useNavigate();

  // Compute all dashboard data
  const stats = useMemo(() => {
    const allAds = getAllAds();
    const advertisers = getUniqueAdvertisers();
    const formats = getFormatDistribution();
    const ctas = getCTADistribution();
    const impressions = getImpressionDistribution();
    const adsWithImpressions = getAdsWithImpressionData();
    const recentAds = getRecentAds(8);

    return {
      totalAds: allAds.length,
      totalCompetitors: advertisers.length,
      totalFormats: Object.keys(formats).length,
      adsWithImpressions,
      impressionPercentage: Math.round((adsWithImpressions / allAds.length) * 100),
      advertisers,
      formats,
      ctas,
      impressions,
      recentAds,
    };
  }, []);

  // Transform data for charts
  const competitorChartData = useMemo(() => {
    return stats.advertisers.map((adv) => ({
      name: truncate(adv.name, 20),
      fullName: adv.name,
      value: adv.adCount,
    }));
  }, [stats.advertisers]);

  const formatChartData = useMemo(() => {
    return Object.entries(stats.formats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats.formats]);

  const ctaChartData = useMemo(() => {
    return Object.entries(stats.ctas)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats.ctas]);

  const impressionChartData = useMemo(() => {
    const order = ['< 1k', '1k-5k', '5k-10k', '10k-20k', '200k-300k'];
    return order
      .filter((range) => stats.impressions[range])
      .map((name) => ({ name, value: stats.impressions[name] || 0 }));
  }, [stats.impressions]);

  return (
    <div className="min-h-screen">
      <Header title="Dashboard" />

      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Ads Tracked"
            value={stats.totalAds}
            icon={BarChart3}
            subtext={`across ${stats.totalCompetitors} competitors`}
          />
          <StatCard
            title="Active Competitors"
            value={stats.totalCompetitors}
            icon={Users}
            subtext="monitored advertisers"
          />
          <StatCard
            title="Ad Formats Detected"
            value={stats.totalFormats}
            icon={LayoutGrid}
            subtext="unique creative types"
          />
          <StatCard
            title="Ads with Impression Data"
            value={stats.adsWithImpressions}
            icon={Eye}
            subtext={`${stats.impressionPercentage}% of total`}
          />
        </div>

        {/* Row 2: Two Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ads per Competitor */}
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Ads per Competitor</h2>
            <HorizontalBarChart
              data={competitorChartData}
              dataKey="value"
              nameKey="name"
              height={280}
            />
          </div>

          {/* Format Distribution */}
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Ad Format Distribution</h2>
            <DonutChart data={formatChartData} dataKey="value" nameKey="name" height={280} />
          </div>
        </div>

        {/* Row 3: CTA and Recent Ads */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CTA Strategy */}
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">CTA Strategy Overview</h2>
            <HorizontalBarChart
              data={ctaChartData}
              dataKey="value"
              nameKey="name"
              height={300}
            />
          </div>

          {/* Recent Ads */}
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Recent Ads</h2>
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-2">
              {stats.recentAds.map((ad) => (
                <button
                  key={ad.adId}
                  onClick={() => navigate(`/ads/${ad.adId}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#241E35] hover:bg-[#2D2545] transition-colors text-left"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <AdImage
                      src={ad.imageUrl || ad.advertiserLogo}
                      alt={ad.advertiserName}
                      format={ad.format}
                      className="w-full h-full"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {ad.advertiserLogo && (
                        <img
                          src={ad.advertiserLogo}
                          alt=""
                          className="w-4 h-4 rounded-full"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                      )}
                      <span className="text-sm font-medium text-[#F5F3FF] truncate">
                        {ad.advertiserName}
                      </span>
                      <FormatBadge format={ad.format} small showIcon={false} />
                    </div>
                    <p className="text-xs text-[#8B7FB5] line-clamp-1">
                      {truncate(ad.headline || ad.body || 'No content', 50)}
                    </p>
                  </div>

                  <ExternalLink className="w-4 h-4 text-[#8B7FB5] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Impression Distribution */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#F5F3FF]">Impression Distribution</h2>
            <span className="text-sm text-[#8B7FB5]">
              Based on {stats.adsWithImpressions} ads with transparency data
            </span>
          </div>
          {impressionChartData.length > 0 ? (
            <HorizontalBarChart
              data={impressionChartData}
              dataKey="value"
              nameKey="name"
              height={200}
            />
          ) : (
            <div className="text-center py-8 text-[#8B7FB5]">
              No impression data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
