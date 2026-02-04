import { useNavigate } from 'react-router-dom';
import { ExternalLink, Play, FileText, Briefcase, UserPlus } from 'lucide-react';
import AdImage from './AdImage';
import FormatBadge from './FormatBadge';
import { truncate } from '../../utils/helpers';

export default function AdCard({ ad }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/ads/${ad.adId}`);
  };

  const handleExternalClick = (e) => {
    e.stopPropagation();
  };

  // Get the appropriate image for preview
  const getPreviewImage = () => {
    switch (ad.format) {
      case 'SINGLE_IMAGE':
        return ad.imageUrl;
      case 'VIDEO':
        return ad.imageUrl; // May have a thumbnail
      case 'CAROUSEL':
        return ad.slides?.[0]?.imageUrl || ad.imageUrl;
      case 'DOCUMENT':
        return ad.imageUrls?.[0] || ad.imageUrl;
      case 'FOLLOW_COMPANY':
        return ad.advertiserLogo;
      default:
        return ad.imageUrl;
    }
  };

  // Render format-specific overlay
  const renderFormatOverlay = () => {
    switch (ad.format) {
      case 'VIDEO':
        return (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-black/50 flex items-center justify-center">
              <Play className="w-7 h-7 text-white ml-1" />
            </div>
          </div>
        );
      case 'CAROUSEL':
        return (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs">
            1/{ad.slides?.length || '?'} slides
          </div>
        );
      case 'DOCUMENT':
        return (
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/50 text-white text-xs flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {ad.imageUrls?.length || 1} pages
          </div>
        );
      case 'JOB':
        return (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#5B21B6] to-[#7C3AED]">
            <Briefcase className="w-12 h-12 text-white/50" />
          </div>
        );
      case 'FOLLOW_COMPANY':
        return null; // Logo is shown as the image
      default:
        return null;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-[#1A1425] border border-[#3B3255] rounded-xl overflow-hidden cursor-pointer hover:border-violet-500/50 hover:scale-[1.02] transition-all duration-200 group"
    >
      {/* Image/Media Preview */}
      <div className="relative aspect-video bg-[#241E35]">
        <AdImage
          src={getPreviewImage()}
          alt={ad.headline || ad.advertiserName}
          format={ad.format}
          className="w-full h-full"
        />
        {renderFormatOverlay()}

        {/* Format badge overlay */}
        <div className="absolute top-2 left-2">
          <FormatBadge format={ad.format} small />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Advertiser row */}
        <div className="flex items-center gap-2 mb-2">
          {ad.advertiserLogo && (
            <img
              src={ad.advertiserLogo}
              alt={ad.advertiserName}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F5F3FF] truncate">
              {ad.advertiserName}
            </p>
            {ad.paidBy && ad.paidBy !== ad.advertiserName && (
              <p className="text-xs text-[#8B7FB5] truncate">
                Paid by: {ad.paidBy}
              </p>
            )}
          </div>
        </div>

        {/* Headline */}
        {ad.headline && (
          <h3 className="text-sm font-semibold text-[#F5F3FF] line-clamp-2 mb-2">
            {truncate(ad.headline.replace(/\n.*see more/g, '').replace(/\n/g, ' '), 80)}
          </h3>
        )}

        {/* Body text */}
        {ad.body && (
          <p className="text-sm text-[#8B7FB5] line-clamp-3 mb-3">
            {truncate(ad.body, 120)}
          </p>
        )}

        {/* CTA badges */}
        {ad.ctas && ad.ctas.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {ad.ctas.map((cta, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-full bg-[#241E35] text-xs text-[#C4B5FD]"
              >
                {cta}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[#3B3255]">
          <span className="text-xs text-[#8B7FB5] font-mono">
            ID: {ad.adId}
          </span>
          <a
            href={ad.adLibraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleExternalClick}
            className="text-[#8B7FB5] hover:text-violet-400 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
