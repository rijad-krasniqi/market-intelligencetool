import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CHART_COLORS } from '../../utils/helpers';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#241E35] border border-[#3B3255] rounded-lg p-3 shadow-xl">
        <p className="text-[#F5F3FF] font-medium">{label}</p>
        <p className="text-[#C4B5FD]">
          Count: <span className="font-semibold">{payload[0].value}</span>
        </p>
        {payload[0].payload.percentage && (
          <p className="text-[#8B7FB5] text-sm">
            {payload[0].payload.percentage}% of total
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function HorizontalBarChart({ data, dataKey = 'value', nameKey = 'name', height = 300, showPercentage = false }) {
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  const enrichedData = data.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item[dataKey] / total) * 100) : 0
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={enrichedData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#3B3255" horizontal={false} />
        <XAxis type="number" stroke="#8B7FB5" fontSize={12} />
        <YAxis
          type="category"
          dataKey={nameKey}
          stroke="#8B7FB5"
          fontSize={12}
          width={120}
          tick={{ fill: '#C4B5FD' }}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#2D2545' }} />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]}>
          {enrichedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
