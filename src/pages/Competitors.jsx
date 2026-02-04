import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ArrowRight, Users } from 'lucide-react';
import Header from '../components/layout/Header';
import FormatBadge from '../components/common/FormatBadge';
import { getUniqueAdvertisers, getCompetitorComparison } from '../utils/dataProcessing';
import { CHART_COLORS } from '../utils/helpers';

export default function Competitors() {
  const advertisers = useMemo(() => getUniqueAdvertisers(), []);
  const comparison = useMemo(() => getCompetitorComparison(), []);

  return (
    <div className="min-h-screen">
      <Header title="Competitor Profiles" />

      <div className="p-6 space-y-8">
        {/* Competitor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {advertisers.map((adv, index) => {
            const stats = comparison.find((c) => c?.name === adv.name);
            const totalFormats = Object.values(stats?.formats || {}).reduce((a, b) => a + b, 0);

            return (
              <div
                key={adv.name}
                className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 hover:border-violet-500/30 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  {adv.logo ? (
                    <img
                      src={adv.logo}
                      alt={adv.name}
                      className="w-20 h-20 rounded-xl object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-violet-600 to-violet-400 flex items-center justify-center">
                      <Users className="w-8 h-8 text-white/70" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-[#F5F3FF] truncate">{adv.name}</h3>
                    {stats?.paidBy && stats.paidBy !== adv.name && (
                      <p className="text-sm text-[#8B7FB5] truncate">
                        Paid by: {stats.paidBy}
                      </p>
                    )}
                    {adv.advertiserUrl && (
                      <a
                        href={adv.advertiserUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300 mt-1"
                      >
                        LinkedIn
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center gap-4 text-sm text-[#8B7FB5] mb-4">
                  <span>
                    <span className="text-[#F5F3FF] font-semibold">{adv.adCount}</span> ads
                  </span>
                  <span>
                    <span className="text-[#F5F3FF] font-semibold">{adv.formatCount}</span> formats
                  </span>
                  <span>
                    <span className="text-[#F5F3FF] font-semibold">{adv.ctaCount}</span> CTAs
                  </span>
                </div>

                {/* Format Distribution Bar */}
                <div className="mb-4">
                  <p className="text-xs text-[#8B7FB5] mb-2">Format Distribution</p>
                  <div className="h-2 rounded-full overflow-hidden flex bg-[#241E35]">
                    {Object.entries(stats?.formats || {}).map(([format, count], i) => (
                      <div
                        key={format}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                          width: `${(count / totalFormats) * 100}%`,
                          backgroundColor: CHART_COLORS[i % CHART_COLORS.length],
                        }}
                        title={`${format}: ${count} ads`}
                      />
                    ))}
                  </div>
                </div>

                {/* Top CTAs */}
                {adv.ctas.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-[#8B7FB5] mb-2">Top CTAs</p>
                    <div className="flex flex-wrap gap-1">
                      {adv.ctas.slice(0, 3).map((cta) => (
                        <span
                          key={cta}
                          className="px-2 py-0.5 rounded-full bg-[#241E35] text-xs text-[#C4B5FD]"
                        >
                          {cta}
                        </span>
                      ))}
                      {adv.ctas.length > 3 && (
                        <span className="text-xs text-[#8B7FB5]">
                          +{adv.ctas.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Top Format */}
                {stats?.topFormat && (
                  <div className="mb-4">
                    <p className="text-xs text-[#8B7FB5] mb-2">Most Used Format</p>
                    <FormatBadge format={stats.topFormat} small />
                  </div>
                )}

                {/* Impression Data Badge */}
                {adv.hasImpressionData && (
                  <p className="text-xs text-emerald-400 mb-4">
                    {stats?.adsWithImpressions || 0} ads with impression data
                  </p>
                )}

                {/* View Profile Button */}
                <Link
                  to={`/competitors/${encodeURIComponent(adv.name)}`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 transition-colors"
                >
                  View Full Profile
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#3B3255]">
            <h2 className="text-lg font-semibold text-[#F5F3FF]">Competitor Comparison</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#2D2545]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider sticky left-0 bg-[#2D2545]">
                    Metric
                  </th>
                  {comparison.map((comp) => (
                    <th
                      key={comp?.name}
                      className="px-4 py-3 text-center text-xs font-semibold text-[#C4B5FD] uppercase tracking-wider min-w-32"
                    >
                      {comp?.name?.length > 15 ? comp.name.substring(0, 15) + '...' : comp?.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3B3255]">
                <tr className="bg-[#1A1425]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#1A1425]">
                    Total Ads
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF] font-semibold">
                      {comp?.totalAds || 0}
                    </td>
                  ))}
                </tr>
                {['SINGLE_IMAGE', 'VIDEO', 'CAROUSEL', 'DOCUMENT', 'JOB'].map((format) => (
                  <tr key={format} className="bg-[#241E35]">
                    <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#241E35]">
                      <FormatBadge format={format} small showIcon={false} />
                    </td>
                    {comparison.map((comp) => (
                      <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF]">
                        {comp?.formats?.[format] || 0}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-[#1A1425]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#1A1425]">
                    Unique CTAs
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF]">
                      {Object.keys(comp?.ctas || {}).length}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#241E35]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#241E35]">
                    Top CTA
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF]">
                      {comp?.topCTA || 'N/A'}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#1A1425]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#1A1425]">
                    Avg Body Length
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF]">
                      {comp?.avgBodyLength || 0} chars
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#241E35]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#241E35]">
                    Avg Headline Length
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF]">
                      {comp?.avgHeadlineLength || 0} chars
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#1A1425]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#1A1425]">
                    Has Impression Data
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center">
                      {comp?.adsWithImpressions > 0 ? (
                        <span className="text-emerald-400">Yes ({comp.adsWithImpressions})</span>
                      ) : (
                        <span className="text-[#8B7FB5]">No</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-[#241E35]">
                  <td className="px-4 py-3 text-sm text-[#8B7FB5] sticky left-0 bg-[#241E35]">
                    Destination Domains
                  </td>
                  {comparison.map((comp) => (
                    <td key={comp?.name} className="px-4 py-3 text-center text-sm text-[#F5F3FF]">
                      {comp?.domains?.length || 0} unique
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
