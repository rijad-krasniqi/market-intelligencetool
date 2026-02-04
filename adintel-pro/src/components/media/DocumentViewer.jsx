import { FileText, Download, ExternalLink } from 'lucide-react';
import AdImage from '../common/AdImage';

export default function DocumentViewer({ pages, documentUrl }) {
  if (!pages || pages.length === 0) {
    return (
      <div className="w-full aspect-video bg-gradient-to-br from-[#5B21B6] to-[#7C3AED] rounded-xl flex flex-col items-center justify-center gap-4">
        <FileText className="w-16 h-16 text-white/50" />
        {documentUrl && (
          <a
            href={documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg bg-white/20 text-white flex items-center gap-2 hover:bg-white/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Page previews */}
      <div className="space-y-4">
        {pages.map((pageUrl, index) => (
          <div key={index} className="relative">
            <div className="absolute top-2 left-2 px-2 py-1 rounded bg-black/50 text-white text-xs">
              Page {index + 1} of {pages.length}
            </div>
            <AdImage
              src={pageUrl}
              alt={`Page ${index + 1}`}
              format="DOCUMENT"
              className="w-full rounded-xl"
            />
          </div>
        ))}
      </div>

      {/* Download button */}
      {documentUrl && (
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
        >
          <Download className="w-5 h-5" />
          Download PDF Document
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
