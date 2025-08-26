export const LiveSkeleton: React.FC = () => {
  return (
    <div className="flex animate-pulse items-stretch gap-2 p-1">
      <div className="w-1 flex-none rounded-full bg-gray-200" />
      <div className="w-min-0 flex-1 space-y-1 py-1">
        {/* Title */}
        <div className="w-min-0 h-3.5 w-full max-w-72 rounded-sm bg-gray-200" />
        {/* Attributes */}
        <div className="w-min-0 mt-1.5 h-3 max-w-24 rounded-sm bg-gray-200" />
        <div className="w-min-0 h-3 max-w-32 rounded-sm bg-gray-200" />
        <div className="w-min-0 h-1.5 w-full" />
      </div>
    </div>
  );
};
