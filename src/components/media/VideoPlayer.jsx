import { useState } from 'react';
import { Video, Play } from 'lucide-react';

export default function VideoPlayer({ src, poster }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] rounded-xl flex items-center justify-center">
        <Video className="w-16 h-16 text-white/50" />
      </div>
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      controls
      className="w-full aspect-video rounded-xl bg-black"
      onError={() => setError(true)}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}
