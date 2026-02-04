import { Search, Filter } from 'lucide-react';

export default function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters',
  icon: CustomIcon,
  action,
  actionLabel = 'Clear Filters'
}) {
  const Icon = CustomIcon || Search;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-16 h-16 rounded-full bg-[#241E35] flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-[#8B7FB5]" />
      </div>
      <h3 className="text-lg font-semibold text-[#F5F3FF] mb-2">{title}</h3>
      <p className="text-[#8B7FB5] text-center max-w-md mb-4">{description}</p>
      {action && (
        <button
          onClick={action}
          className="px-4 py-2 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
