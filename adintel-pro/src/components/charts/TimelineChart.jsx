import { useMemo } from 'react';
import { CHART_COLORS } from '../../utils/helpers';

export default function TimelineChart({ data, competitors }) {
  // Find date range
  const { minDate, maxDate, dateRange } = useMemo(() => {
    let min = new Date('2100-01-01');
    let max = new Date('1900-01-01');

    data.forEach((item) => {
      const start = new Date(item.start);
      const end = new Date(item.end);
      if (start < min) min = start;
      if (end > max) max = end;
    });

    const days = Math.ceil((max - min) / (1000 * 60 * 60 * 24));
    return { minDate: min, maxDate: max, dateRange: days };
  }, [data]);

  // Calculate position and width for each item
  const getItemStyle = (item) => {
    const start = new Date(item.start);
    const end = new Date(item.end);

    const startOffset = (start - minDate) / (1000 * 60 * 60 * 24);
    const duration = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));

    const left = (startOffset / dateRange) * 100;
    const width = Math.max(1, (duration / dateRange) * 100);

    return { left: `${left}%`, width: `${width}%` };
  };

  // Get color by competitor
  const getCompetitorColor = (advertiser) => {
    const index = competitors.indexOf(advertiser);
    return CHART_COLORS[index >= 0 ? index % CHART_COLORS.length : 0];
  };

  // Group by competitor
  const groupedData = useMemo(() => {
    const groups = {};
    data.forEach((item) => {
      if (!groups[item.advertiser]) {
        groups[item.advertiser] = [];
      }
      groups[item.advertiser].push(item);
    });
    return groups;
  }, [data]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Timeline header */}
      <div className="flex justify-between text-xs text-[#8B7FB5] px-4">
        <span>{formatDate(minDate)}</span>
        <span>{formatDate(maxDate)}</span>
      </div>

      {/* Timeline rows */}
      <div className="space-y-2">
        {Object.entries(groupedData).map(([advertiser, items]) => (
          <div key={advertiser} className="flex items-center gap-4">
            <div className="w-40 text-sm text-[#C4B5FD] truncate flex-shrink-0">
              {advertiser.length > 15 ? advertiser.substring(0, 15) + '...' : advertiser}
            </div>
            <div className="flex-1 h-8 bg-[#241E35] rounded relative">
              {items.map((item, idx) => (
                <div
                  key={`${item.adId}-${idx}`}
                  className="absolute top-1 bottom-1 rounded"
                  style={{
                    ...getItemStyle(item),
                    backgroundColor: getCompetitorColor(advertiser),
                    opacity: 0.8,
                  }}
                  title={`${item.start} to ${item.end}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-4 border-t border-[#3B3255]">
        {competitors.map((comp, index) => (
          <div key={comp} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span className="text-xs text-[#C4B5FD]">
              {comp.length > 20 ? comp.substring(0, 20) + '...' : comp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
