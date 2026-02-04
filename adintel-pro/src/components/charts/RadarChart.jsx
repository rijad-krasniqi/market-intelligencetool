import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { CHART_COLORS } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#241E35] border border-[#3B3255] rounded-lg p-3 shadow-xl">
        <p className="text-[#F5F3FF] font-medium">{payload[0]?.payload?.format}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function RadarChart({ data, competitors }) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <RechartsRadarChart data={data}>
        <PolarGrid stroke="#3B3255" />
        <PolarAngleAxis dataKey="format" tick={{ fill: '#C4B5FD', fontSize: 12 }} />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 'auto']}
          tick={{ fill: '#8B7FB5', fontSize: 10 }}
        />
        {competitors.map((comp, index) => (
          <Radar
            key={comp}
            name={comp}
            dataKey={comp}
            stroke={CHART_COLORS[index % CHART_COLORS.length]}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
            fillOpacity={0.2}
          />
        ))}
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: 20 }}
          formatter={(value) => (
            <span className="text-[#C4B5FD] text-sm">{value}</span>
          )}
        />
      </RechartsRadarChart>
    </ResponsiveContainer>
  );
}
