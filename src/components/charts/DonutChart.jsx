import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CHART_COLORS } from '../../utils/helpers';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#241E35] border border-[#3B3255] rounded-lg p-3 shadow-xl">
        <p className="text-[#F5F3FF] font-medium">{payload[0].name}</p>
        <p className="text-[#C4B5FD]">
          Count: <span className="font-semibold">{payload[0].value}</span>
        </p>
        <p className="text-[#8B7FB5] text-sm">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of total
        </p>
      </div>
    );
  }
  return null;
};

const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-[#C4B5FD]">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function DonutChart({ data, dataKey = 'value', nameKey = 'name', height = 300, showCenter = true }) {
  const total = data.reduce((sum, item) => sum + (item[dataKey] || 0), 0);

  const enrichedData = data.map(item => ({
    ...item,
    total
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={enrichedData}
          cx="50%"
          cy="45%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey={dataKey}
          nameKey={nameKey}
        >
          {enrichedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={renderCustomLegend} />
        {showCenter && (
          <text
            x="50%"
            y="45%"
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-[#F5F3FF] text-2xl font-bold"
          >
            {total}
          </text>
        )}
      </PieChart>
    </ResponsiveContainer>
  );
}
