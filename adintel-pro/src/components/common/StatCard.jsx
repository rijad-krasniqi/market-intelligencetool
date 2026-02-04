export default function StatCard({ title, value, icon: Icon, subtext, trend }) {
  return (
    <div className="bg-[#1A1425] border border-[#3B3255] rounded-xl p-5 hover:border-violet-500/30 transition-all duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#8B7FB5] mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#F5F3FF] tabular-nums">{value}</p>
          {subtext && (
            <p className="text-sm text-[#8B7FB5] mt-1">{subtext}</p>
          )}
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last period
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-full bg-violet-600/20 flex items-center justify-center">
            <Icon className="w-6 h-6 text-violet-400" />
          </div>
        )}
      </div>
    </div>
  );
}
