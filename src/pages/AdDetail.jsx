import { useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  Eye,
  Globe,
  Target,
  Briefcase,
  UserPlus,
} from 'lucide-react';
import Header from '../components/layout/Header';
import FormatBadge from '../components/common/FormatBadge';
import AdImage from '../components/common/AdImage';
import CopyButton from '../components/common/CopyButton';
import VideoPlayer from '../components/media/VideoPlayer';
import CarouselViewer from '../components/media/CarouselViewer';
import DocumentViewer from '../components/media/DocumentViewer';
import HorizontalBarChart from '../components/charts/HorizontalBarChart';
import { getAdById, getAllAds } from '../utils/dataProcessing';
import { formatDate, daysBetween, extractDomain, getCountryFlag, parseImpressionPercentage } from '../utils/helpers';

export default function AdDetail() {
  const { adId } = useParams();
  const navigate = useNavigate();

  const ad = useMemo(() => getAdById(adId), [adId]);
  const allAds = useMemo(() => getAllAds(), []);

  // Get previous/next ad IDs for navigation
  const navigation = useMemo(() => {
    const currentIndex = allAds.findIndex((a) => a.adId === adId);
    return {
      prev: currentIndex > 0 ? allAds[currentIndex - 1].adId : null,
      next: currentIndex < allAds.length - 1 ? allAds[currentIndex + 1].adId : null,
    };
  }, [allAds, adId]);

  if (!ad) {
    return (
      <div className="min-h-screen">
        <Header title="Ad Not Found" />
        <div className="p-6 text-center">
          <p className="text-[#8B7FB5] mb-4">The ad you're looking for doesn't exist.</p>
          <Link
            to="/ads"
            className="text-violet-400 hover:text-violet-300 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ad Library
          </Link>
        </div>
      </div>
    );
  }

  // Render media based on format
  const renderMedia = () => {
    switch (ad.format) {
      case 'VIDEO':
        return <VideoPlayer src={ad.videoUrl} poster={ad.imageUrl} />;
      case 'CAROUSEL':
        return <CarouselViewer slides={ad.slides || []} />;
      case 'DOCUMENT':
        return <DocumentViewer pages={ad.imageUrls || []} documentUrl={ad.documentUrl} />;
      case 'JOB':
        return (
          <div className="w-full aspect-video bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] rounded-xl flex flex-col items-center justify-center gap-4">
            <Briefcase className="w-16 h-16 text-white/50" />
            <span className="text-white/70 text-lg">Job Posting</span>
          </div>
        );
      case 'FOLLOW_COMPANY':
        return (
          <div className="w-full aspect-video bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] rounded-xl flex flex-col items-center justify-center gap-4">
            {ad.advertiserLogo ? (
              <img
                src={ad.advertiserLogo}
                alt={ad.advertiserName}
                className="w-32 h-32 rounded-full"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <UserPlus className="w-16 h-16 text-white/50" />
            )}
            <span className="text-white/70 text-lg">Follow Company</span>
          </div>
        );
      default:
        return (
          <AdImage
            src={ad.imageUrl}
            alt={ad.headline || ad.advertiserName}
            format={ad.format}
            className="w-full rounded-xl"
          />
        );
    }
  };

  // Calculate campaign duration
  const duration = ad.availability
    ? daysBetween(ad.availability.start, ad.availability.end)
    : null;

  // Check if ad is active
  const isActive = ad.availability?.end
    ? new Date(ad.availability.end) > new Date()
    : false;

  // Country data for chart
  const countryChartData = useMemo(() => {
    if (!ad.impressionsPerCountry) return [];
    return ad.impressionsPerCountry
      .slice(0, 10)
      .map((item) => ({
        name: `${getCountryFlag(item.country)} ${item.country}`,
        value: parseImpressionPercentage(item.impressions),
        percentage: item.impressions,
      }));
  }, [ad.impressionsPerCountry]);

  return (
    <div className="min-h-screen">
      <Header title="Ad Details" />

      <div className="p-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/ads"
            className="flex items-center gap-2 text-[#C4B5FD] hover:text-[#F5F3FF] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Ad Library
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigation.prev && navigate(`/ads/${navigation.prev}`)}
              disabled={!navigation.prev}
              className="p-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigation.next && navigate(`/ads/${navigation.next}`)}
              disabled={!navigation.next}
              className="p-2 rounded-lg bg-[#241E35] border border-[#3B3255] text-[#C4B5FD] hover:bg-[#2D2545] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - Media & Content (60%) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Media */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-4">
              {renderMedia()}
            </div>

            {/* Ad Copy */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 space-y-4">
              {ad.headline && (
                <div>
                  <h3 className="text-xs uppercase text-[#8B7FB5] mb-2">Headline</h3>
                  <h2 className="text-xl font-semibold text-[#F5F3FF] whitespace-pre-wrap">
                    {ad.headline.replace(/…see more/g, '')}
                  </h2>
                </div>
              )}

              {ad.body && (
                <div>
                  <h3 className="text-xs uppercase text-[#8B7FB5] mb-2">Body Text</h3>
                  <p className="text-[#C4B5FD] whitespace-pre-wrap">{ad.body}</p>
                </div>
              )}

              {/* CTAs */}
              {ad.ctas && ad.ctas.length > 0 && (
                <div>
                  <h3 className="text-xs uppercase text-[#8B7FB5] mb-2">Call to Action</h3>
                  <div className="flex flex-wrap gap-2">
                    {ad.ctas.map((cta, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 rounded-lg bg-violet-600 text-white font-medium"
                      >
                        {cta}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Destination URL */}
            {ad.clickUrl && (
              <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
                <h3 className="text-xs uppercase text-[#8B7FB5] mb-2">Destination URL</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-semibold text-[#F5F3FF]">
                    {extractDomain(ad.clickUrl)}
                  </span>
                  <CopyButton text={ad.clickUrl} />
                </div>
                <a
                  href={ad.clickUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-[#8B7FB5] hover:text-violet-400 break-all"
                >
                  {ad.clickUrl}
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column - Metadata (40%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Advertiser Card */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5">
              <div className="flex items-start gap-4 mb-4">
                {ad.advertiserLogo && (
                  <img
                    src={ad.advertiserLogo}
                    alt={ad.advertiserName}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="text-lg font-bold text-[#F5F3FF]">{ad.advertiserName}</h3>
                  {ad.paidBy && ad.paidBy !== ad.advertiserName && (
                    <p className="text-sm text-[#8B7FB5]">Paid by: {ad.paidBy}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                {ad.advertiserUrl && (
                  <a
                    href={ad.advertiserUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-[#C4B5FD] hover:text-violet-400"
                  >
                    View LinkedIn Page
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <Link
                  to={`/competitors/${encodeURIComponent(ad.advertiserName)}`}
                  className="block w-full px-4 py-2 rounded-lg bg-violet-600/20 text-violet-300 text-center hover:bg-violet-600/30 transition-colors"
                >
                  View All {ad.advertiserName}'s Ads
                </Link>
              </div>
            </div>

            {/* Ad Metadata Card */}
            <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-[#F5F3FF]">Ad Metadata</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8B7FB5]">Ad ID</span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-[#F5F3FF] font-mono">{ad.adId}</span>
                    <CopyButton text={ad.adId} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8B7FB5]">Format</span>
                  <FormatBadge format={ad.format} small />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8B7FB5]">LinkedIn Ad Library</span>
                  <a
                    href={ad.adLibraryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                  >
                    View
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* Availability Card */}
            {ad.availability && (
              <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-semibold text-[#F5F3FF]">Campaign Period</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7FB5]">Start Date</span>
                    <span className="text-sm text-[#F5F3FF]">
                      {formatDate(ad.availability.start)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7FB5]">End Date</span>
                    <span className="text-sm text-[#F5F3FF]">
                      {formatDate(ad.availability.end)}
                    </span>
                  </div>
                  {duration && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8B7FB5]">Duration</span>
                      <span className="text-sm text-[#F5F3FF]">{duration} days</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[#8B7FB5]">Status</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {isActive ? 'Active' : 'Ended'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Impressions Card */}
            {ad.impressions && (
              <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-semibold text-[#F5F3FF]">Impressions</h3>
                </div>

                <div className="text-3xl font-bold text-[#F5F3FF]">{ad.impressions}</div>
                <div className="h-2 bg-[#241E35] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-violet-400 rounded-full"
                    style={{
                      width: ad.impressions === '< 1k' ? '10%' :
                             ad.impressions === '1k-5k' ? '30%' :
                             ad.impressions === '5k-10k' ? '50%' :
                             ad.impressions === '10k-20k' ? '70%' : '100%'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Geographic Distribution Card */}
            {ad.impressionsPerCountry && ad.impressionsPerCountry.length > 0 && (
              <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-semibold text-[#F5F3FF]">Geographic Distribution</h3>
                </div>

                <HorizontalBarChart
                  data={countryChartData}
                  dataKey="value"
                  nameKey="name"
                  height={250}
                />

                {ad.impressionsPerCountry.length > 10 && (
                  <p className="text-xs text-[#8B7FB5] text-center">
                    Showing top 10 of {ad.impressionsPerCountry.length} countries
                  </p>
                )}
              </div>
            )}

            {/* Targeting Card */}
            {ad.targeting && (
              <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-400" />
                  <h3 className="text-sm font-semibold text-[#F5F3FF]">Targeting</h3>
                </div>

                <div className="space-y-3">
                  {ad.targeting.language && (
                    <div>
                      <span className="text-xs uppercase text-[#8B7FB5]">Language</span>
                      <p className="text-sm text-[#F5F3FF]">{ad.targeting.language}</p>
                    </div>
                  )}
                  {ad.targeting.location && (
                    <div>
                      <span className="text-xs uppercase text-[#8B7FB5]">Location</span>
                      <p className="text-sm text-[#F5F3FF]">{ad.targeting.location}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
