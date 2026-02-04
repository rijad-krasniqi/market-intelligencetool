import { useState } from 'react';
import { ImageOff, Video, FileText, Briefcase, UserPlus } from 'lucide-react';

const formatIcons = {
  SINGLE_IMAGE: ImageOff,
  VIDEO: Video,
  CAROUSEL: ImageOff,
  DOCUMENT: FileText,
  JOB: Briefcase,
  FOLLOW_COMPANY: UserPlus,
};

export default function AdImage({ src, alt, format = 'SINGLE_IMAGE', className = '' }) {
  const [error, setError] = useState(false);
  const Icon = formatIcons[format] || ImageOff;

  if (error || !src) {
    return (
      <div
        className={`bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] flex items-center justify-center ${className}`}
      >
        <Icon className="w-12 h-12 text-white/50" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || 'Ad image'}
      onError={() => setError(true)}
      className={`object-cover ${className}`}
      loading="lazy"
    />
  );
}
