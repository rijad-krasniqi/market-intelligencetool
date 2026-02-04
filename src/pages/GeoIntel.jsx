import { useMemo } from 'react';
import { Globe, Target, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import StatCard from '../components/common/StatCard';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import HeatmapChart from '../components/charts/HeatmapChart';
import {
  getCountryDistribution,
  getCountryByCompetitor,
  getUniqueAdvertisers,
  getAdsByAdvertiser,
} from '../utils/dataProcessing';
import { getCountryFlag, CHART_COLORS } from '../utils/helpers';

export default function GeoIntel() {
  const countryDistribution = useMemo(() => getCountryDistribution(), []);
  const countryByCompetitor = useMemo(() => getCountryByCompetitor(), []);
  const advertisers = useMemo(() => getUniqueAdvertisers(), []);

  // Top countries chart data
  const topCountriesData = useMemo(() => {
    return countryDistribution.slice(0, 25).map((c) => ({
      name: `${getCountryFlag(c.country)} ${c.country}`,
      value: Math.round(c.totalPercentage * 10) / 10,
      adCount: c.adCount,
    }));
  }, [countryDistribution]);

  // Get unique countries and competitors for heatmap
  const heatmapData = useMemo(() => {
    const data = [];
    const competitors = Object.keys(countryByCompetitor);
    const countries = new Set();

    competitors.forEach((comp) => {
      Object.keys(countryByCompetitor[comp]).forEach((country) => {
        countries.add(country);
      });
    });

    const topCountries = Array.from(countries)
      .map((country) => {
        let total = 0;
        competitors.forEach((comp) => {
          total += countryByCompetitor[comp][country] || 0;
        });
        return { country, total };
      })
      .sort((a, b) => b.total - a.total)
      .slice(0, 15)
      .map((c) => c.country);

    competitors.forEach((comp) => {
      topCountries.forEach((country) => {
        const value = Math.round(countryByCompetitor[comp][country] || 0);
        if (value > 0) {
          data.push({
            row: comp,
            col: country,
            value,
          });
        }
      });
    });

    return { data, countries: topCountries, competitors };
  }, [countryByCompetitor]);

  // Targeting strategy cards data
  const targetingData = useMemo(() => {
    return advertisers.map((adv) => {
      const ads = getAdsByAdvertiser(adv.name);
      const adsWithTargeting = ads.filter((ad) => ad.targeting);

      const languages = new Set();
      const locations = new Set();

      adsWithTargeting.forEach((ad) => {
        if (ad.targeting?.language) languages.add(ad.targeting.language);
        if (ad.targeting?.location) {
          ad.targeting.location.split(',').forEach((loc) => {
            const trimmed = loc.trim();
            if (trimmed) locations.add(trimmed);
          });
        }
      });

      return {
        name: adv.name,
        logo: adv.logo,
        languages: Array.from(languages),
        locations: Array.from(locations),
        adsWithTargeting: adsWithTargeting.length,
        totalAds: ads.length,
      };
    });
  }, [advertisers]);

  // Calculate which competitor dominates each country
  const countryLeaders = useMemo(() => {
    return countryDistribution.slice(0, 25).map((c) => {
      let leader = null;
      let maxValue = 0;

      Object.entries(countryByCompetitor).forEach(([comp, countries]) => {
        if (countries[c.country] > maxValue) {
          maxValue = countries[c.country];
          leader = comp;
        }
      });

      return {
        ...c,
        leader,
        leaderValue: maxValue,
      };
    });
  }, [countryDistribution, countryByCompetitor]);

  // Stats
  const stats = useMemo(() => {
    const totalCountries = countryDistribution.length;
    const adsWithGeo = countryDistribution.reduce((sum, c) => sum + c.adCount, 0);
    const competitorsWithGeo = Object.keys(countryByCompetitor).length;

    return {
      totalCountries,
      adsWithGeo,
      competitorsWithGeo,
    };
  }, [countryDistribution, countryByCompetitor]);

  return (
    <div className="min-h-screen">
      <Header title="Geographic Intelligence" />

      <div className="p-6 space-y-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Countries Targeted"
            value={stats.totalCountries}
            icon={Globe}
            subtext="unique countries in dataset"
          />
          <StatCard
            title="Ads with Geo Data"
            value={stats.adsWithGeo}
            icon={Target}
            subtext="ads have impression by country"
          />
          <StatCard
            title="Competitors with Geo"
            value={stats.competitorsWithGeo}
            icon={Users}
            subtext="have geographic impression data"
          />
        </div>

        {/* Top Countries Chart */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
          <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">
            Top 25 Countries by Impression Share
          </h2>
          <p className="text-sm text-[#8B7FB5] mb-4">
            Aggregate impression percentage across all ads with geographic data
          </p>
          {topCountriesData.length > 0 ? (
            <HorizontalBarChart
              data={topCountriesData}
              dataKey="value"
              nameKey="name"
              height={600}
            />
          ) : (
            <p className="text-[#8B7FB5] text-center py-8">No geographic data available</p>
          )}
        </div>

        {/* Country × Competitor Heatmap */}
        {heatmapData.data.length > 0 && (
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">
              Country × Competitor Matrix
            </h2>
            <p className="text-sm text-[#8B7FB5] mb-4">
              Shows which competitors target which countries (darker = higher impression %)
            </p>
            <HeatmapChart
              data={heatmapData.data}
              rows={heatmapData.competitors}
              columns={heatmapData.countries}
              valueKey="value"
            />
          </div>
        )}

        {/* Country Leaders Table */}
        {countryLeaders.length > 0 && (
          <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
            <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">
              Market Leaders by Country
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#2D2545]">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Country
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Total Share
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Ads
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase">
                      Top Advertiser
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#3B3255]">
                  {countryLeaders.map((item, index) => (
                    <tr
                      key={item.country}
                      className={index % 2 === 0 ? 'bg-[#1A1425]' : 'bg-[#241E35]'}
                    >
                      <td className="px-4 py-3 text-sm text-[#F5F3FF]">
                        {getCountryFlag(item.country)} {item.country}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#F5F3FF]">
                        {Math.round(item.totalPercentage * 10) / 10}%
                      </td>
                      <td className="px-4 py-3 text-sm text-[#8B7FB5]">{item.adCount}</td>
                      <td className="px-4 py-3 text-sm text-[#C4B5FD]">
                        {item.leader
                          ? item.leader.length > 25
                            ? item.leader.substring(0, 25) + '...'
                            : item.leader
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Targeting Strategy Cards */}
        <div>
          <h2 className="text-lg font-semibold text-[#F5F3FF] mb-4">Targeting Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetingData.map((comp, index) => (
              <div
                key={comp.name}
                className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5"
              >
                <div className="flex items-center gap-3 mb-4">
                  {comp.logo ? (
                    <img
                      src={comp.logo}
                      alt={comp.name}
                      className="w-10 h-10 rounded-lg object-cover"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] + '30' }}
                    >
                      <Users
                        className="w-5 h-5"
                        style={{ color: CHART_COLORS[index % CHART_COLORS.length] }}
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F3FF]">
                      {comp.name.length > 20 ? comp.name.substring(0, 20) + '...' : comp.name}
                    </h3>
                    <p className="text-xs text-[#8B7FB5]">
                      {comp.adsWithTargeting} of {comp.totalAds} ads with targeting
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {comp.languages.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-[#8B7FB5] mb-1">Languages</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.languages.map((lang) => (
                          <span
                            key={lang}
                            className="px-2 py-0.5 rounded-full bg-violet-600/20 text-xs text-violet-300"
                          >
                            {lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {comp.locations.length > 0 && (
                    <div>
                      <p className="text-xs uppercase text-[#8B7FB5] mb-1">Locations</p>
                      <div className="flex flex-wrap gap-1">
                        {comp.locations.slice(0, 6).map((loc) => (
                          <span
                            key={loc}
                            className="px-2 py-0.5 rounded-full bg-cyan-600/20 text-xs text-cyan-300"
                          >
                            {loc.length > 15 ? loc.substring(0, 15) + '...' : loc}
                          </span>
                        ))}
                        {comp.locations.length > 6 && (
                          <span className="text-xs text-[#8B7FB5]">
                            +{comp.locations.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {comp.languages.length === 0 && comp.locations.length === 0 && (
                    <p className="text-sm text-[#8B7FB5]">No targeting data available</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
