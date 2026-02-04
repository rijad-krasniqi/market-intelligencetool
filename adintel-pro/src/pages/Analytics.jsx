import { useMemo } from 'react';
import Header from '../components/layout/Header';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import DonutChart from '../components/charts/DonutChart';
import RadarChart from '../components/charts/RadarChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import TimelineChart from '../components/charts/TimelineChart';
import {
  getUniqueAdvertisers,
  getCompetitorComparison,
  getCompetitorFormatBreakdown,
  getCompetitorCTABreakdown,
  getAllFormats,
  getAllCTAs,
  getTopKeywords,
  getAdsByAdvertiser,
  getAdTimeline,
  getMonthlyVolume,
  getCountryDistribution,
} from '../utils/dataProcessing';
import { CHART_COLORS, getCountryFlag } from '../utils/helpers';

export default function Analytics() {
  const advertisers = useMemo(() => getUniqueAdvertisers(), []);
  const comparison = useMemo(() => getCompetitorComparison(), []);
  const allFormats = useMemo(() => getAllFormats(), []);
  const allCTAs = useMemo(() => getAllCTAs(), []);
  const timeline = useMemo(() => getAdTimeline(), []);
  const countryDistribution = useMemo(() => getCountryDistribution(), []);

  // Competitor names
  const competitorNames = useMemo(() => advertisers.map((a) => a.name), [advertisers]);

  // Ad volume comparison data
  const volumeChartData = useMemo(() => {
    return advertisers.map((adv) => ({
      name: adv.name.length > 15 ? adv.name.substring(0, 15) + '...' : adv.name,
      fullName: adv.name,
      value: adv.adCount,
    }));
  }, [advertisers]);

  // Radar chart data - format strategy
  const radarData = useMemo(() => {
    const data = allFormats.map((format) => {
      const point = { format };
      advertisers.forEach((adv) => {
        const breakdown = getCompetitorFormatBreakdown(adv.name);
        point[adv.name] = breakdown[format] || 0;
      });
      return point;
    });
    return data;
  }, [allFormats, advertisers]);

  // CTA heatmap data
  const ctaHeatmapData = useMemo(() => {
    const data = [];
    advertisers.forEach((adv) => {
      const breakdown = getCompetitorCTABreakdown(adv.name);
      allCTAs.forEach((cta) => {
        if (breakdown[cta]) {
          data.push({
            row: adv.name,
            col: cta,
            value: breakdown[cta],
          });
        }
      });
    });
    return data;
  }, [advertisers, allCTAs]);

  // Body copy length data
  const bodyLengthData = useMemo(() => {
    return comparison
      .filter((c) => c)
      .map((c) => ({
        name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
        value: c.avgBodyLength,
      }))
      .sort((a, b) => b.value - a.value);
  }, [comparison]);

  // Headline length data
  const headlineLengthData = useMemo(() => {
    return comparison
      .filter((c) => c)
      .map((c) => ({
        name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
        value: c.avgHeadlineLength,
      }))
      .sort((a, b) => b.value - a.value);
  }, [comparison]);

  // CTA diversity data
  const ctaDiversityData = useMemo(() => {
    return comparison
      .filter((c) => c)
      .map((c) => ({
        name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
        value: Object.keys(c.ctas || {}).length,
      }))
      .sort((a, b) => b.value - a.value);
  }, [comparison]);

  // Top keywords per competitor
  const keywordsByCompetitor = useMemo(() => {
    return advertisers.slice(0, 5).map((adv) => {
      const ads = getAdsByAdvertiser(adv.name);
      const keywords = getTopKeywords(ads, 10);
      return { name: adv.name, keywords };
    });
  }, [advertisers]);

  // Impression data by competitor
  const impressionData = useMemo(() => {
    return comparison
      .filter((c) => c && c.adsWithImpressions > 0)
      .map((c) => ({
        name: c.name.length > 15 ? c.name.substring(0, 15) + '...' : c.name,
        value: c.adsWithImpressions,
      }))
      .sort((a, b) => b.value - a.value);
  }, [comparison]);

  // Top countries
  const topCountries = useMemo(() => {
    return countryDistribution.slice(0, 20).map((c) => ({
      name: `${getCountryFlag(c.country)} ${c.country}`,
      value: c.totalPercentage,
    }));
  }, [countryDistribution]);

  return (
    <div className="min-h-screen">
      <Header title="Analytics & Insights" />

      <div className="p-6 space-y-8">
        {/* Section 1: Competitive Landscape */}
        <section>
          <h2 className="text-xl font-bold text-[#F5F3FF] mb-4">Competitive Landscape Overview</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ad Volume */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">Ad Volume Comparison</h3>
              <HorizontalBarChart
                data={volumeChartData}
                dataKey="value"
                nameKey="name"
                height={280}
              />
            </div>

            {/* Format Strategy Radar */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">Format Strategy Radar</h3>
              <RadarChart data={radarData} competitors={competitorNames.slice(0, 5)} />
            </div>
          </div>
        </section>

        {/* Section 2: Creative Strategy */}
        <section>
          <h2 className="text-xl font-bold text-[#F5F3FF] mb-4">Creative Strategy Analysis</h2>

          {/* CTA Heatmap */}
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 mb-6">
            <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">CTA Usage Heatmap</h3>
            <p className="text-sm text-[#8B7FB5] mb-4">
              Shows CTA frequency across competitors. Darker colors indicate higher usage.
            </p>
            <HeatmapChart
              data={ctaHeatmapData}
              rows={competitorNames}
              columns={allCTAs.slice(0, 10)}
              valueKey="value"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Body Length */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">
                Body Copy Length (Avg Chars)
              </h3>
              <HorizontalBarChart
                data={bodyLengthData}
                dataKey="value"
                nameKey="name"
                height={250}
              />
            </div>

            {/* Headline Length */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">
                Headline Length (Avg Chars)
              </h3>
              <HorizontalBarChart
                data={headlineLengthData}
                dataKey="value"
                nameKey="name"
                height={250}
              />
            </div>
          </div>
        </section>

        {/* Section 3: Content Intelligence */}
        <section>
          <h2 className="text-xl font-bold text-[#F5F3FF] mb-4">Content Intelligence</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Top Keywords by Competitor */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">Top Messaging Themes</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {keywordsByCompetitor.map(({ name, keywords }) => (
                  <div key={name}>
                    <p className="text-sm font-medium text-[#C4B5FD] mb-2">
                      {name.length > 25 ? name.substring(0, 25) + '...' : name}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {keywords.slice(0, 8).map(({ word, count }) => (
                        <span
                          key={word}
                          className="px-2 py-0.5 rounded-full bg-[#241E35] text-xs text-[#8B7FB5]"
                        >
                          {word} ({count})
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Diversity */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">CTA Diversity Score</h3>
              <p className="text-sm text-[#8B7FB5] mb-4">
                Number of unique CTAs used by each competitor
              </p>
              <HorizontalBarChart
                data={ctaDiversityData}
                dataKey="value"
                nameKey="name"
                height={250}
              />
            </div>
          </div>
        </section>

        {/* Section 4: Impression Intelligence */}
        <section>
          <h2 className="text-xl font-bold text-[#F5F3FF] mb-4">Impression Intelligence</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impression Data by Competitor */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">
                Ads with Impression Data
              </h3>
              {impressionData.length > 0 ? (
                <HorizontalBarChart
                  data={impressionData}
                  dataKey="value"
                  nameKey="name"
                  height={200}
                />
              ) : (
                <p className="text-[#8B7FB5] text-center py-8">No impression data available</p>
              )}
            </div>

            {/* Top Countries */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">
                Top Countries by Impression Share
              </h3>
              {topCountries.length > 0 ? (
                <HorizontalBarChart
                  data={topCountries.slice(0, 10)}
                  dataKey="value"
                  nameKey="name"
                  height={300}
                />
              ) : (
                <p className="text-[#8B7FB5] text-center py-8">No geographic data available</p>
              )}
            </div>
          </div>

          {/* Targeting Strategy Table */}
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 mt-6">
            <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">Targeting Strategy Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2D2545]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Competitor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Languages
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Regions
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-[#C4B5FD] uppercase">
                      Ads w/ Targeting
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3255]">
                  {advertisers.map((adv, index) => {
                    const ads = getAdsByAdvertiser(adv.name);
                    const adsWithTargeting = ads.filter((ad) => ad.targeting);
                    const languages = new Set();
                    const locations = new Set();

                    adsWithTargeting.forEach((ad) => {
                      if (ad.targeting?.language) languages.add(ad.targeting.language);
                      if (ad.targeting?.location) {
                        ad.targeting.location.split(',').forEach((loc) => locations.add(loc.trim()));
                      }
                    });

                    return (
                      <tr key={adv.name} className={index % 2 === 0 ? 'bg-[#1A1425]' : 'bg-[#241E35]'}>
                        <td className="px-4 py-3 text-sm text-[#F5F3FF]">
                          {adv.name.length > 20 ? adv.name.substring(0, 20) + '...' : adv.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#C4B5FD]">
                          {Array.from(languages).join(', ') || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-[#C4B5FD]">
                          {Array.from(locations).slice(0, 3).join(', ')}
                          {locations.size > 3 && ` +${locations.size - 3} more`}
                          {locations.size === 0 && 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm text-center text-[#F5F3FF]">
                          {adsWithTargeting.length}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 5: Temporal Analysis */}
        {timeline.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-[#F5F3FF] mb-4">Temporal Analysis</h2>

            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <h3 className="text-lg font-semibold text-[#F5F3FF] mb-4">Ad Activity Timeline</h3>
              <p className="text-sm text-[#8B7FB5] mb-4">
                Based on {timeline.length} ads with availability data
              </p>
              <TimelineChart data={timeline} competitors={competitorNames} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
