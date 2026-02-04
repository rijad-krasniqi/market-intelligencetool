import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Images } from 'lucide-react';
import AdImage from '../common/AdImage';

export default function CarouselViewer({ slides }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
      } else if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] rounded-xl flex items-center justify-center">
        <Images className="w-16 h-16 text-white/50" />
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="relative w-full">
      {/* Main image */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-[#1A1425]">
        <AdImage
          src={slides[currentIndex]?.imageUrl}
          alt={`Slide ${currentIndex + 1}`}
          format="CAROUSEL"
          className="w-full h-full"
        />

        {/* Navigation arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter */}
        <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
          {currentIndex + 1} of {slides.length}
        </div>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-violet-500'
                  : 'bg-[#3B3255] hover:bg-[#4C3D6E]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-violet-500'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <AdImage
                src={slide.imageUrl}
                alt={`Thumbnail ${index + 1}`}
                format="CAROUSEL"
                className="w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
