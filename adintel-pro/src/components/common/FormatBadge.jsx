import { Image, Video, Images, FileText, Briefcase, UserPlus } from 'lucide-react';

const formatConfig = {
  SINGLE_IMAGE: {
    bg: 'bg-violet-500/20',
    text: 'text-violet-300',
    label: 'Image',
    icon: Image,
  },
  VIDEO: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-300',
    label: 'Video',
    icon: Video,
  },
  CAROUSEL: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    label: 'Carousel',
    icon: Images,
  },
  DOCUMENT: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    label: 'Document',
    icon: FileText,
  },
  JOB: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-300',
    label: 'Job',
    icon: Briefcase,
  },
  FOLLOW_COMPANY: {
    bg: 'bg-pink-500/20',
    text: 'text-pink-300',
    label: 'Follow',
    icon: UserPlus,
  },
};

export default function FormatBadge({ format, small = false, showIcon = true }) {
  const config = formatConfig[format] || formatConfig.SINGLE_IMAGE;
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${config.bg} ${config.text} ${
        small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {showIcon && <Icon className={small ? 'w-3 h-3' : 'w-4 h-4'} />}
      {config.label}
    </span>
  );
}
