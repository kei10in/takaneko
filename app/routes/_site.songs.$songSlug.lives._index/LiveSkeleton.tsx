export const LiveSkeleton: React.FC = () => {
  return (
    <div className="w-full animate-pulse overflow-hidden rounded-3xl border border-zinc-500/10 bg-white p-2 shadow-xl shadow-black/2">
      <div className="flex items-start gap-2">
        <div className="w-24 flex-none self-stretch rounded-2xl bg-gray-200" />
        <div className="min-w-0 flex-1 space-y-2 px-2 py-0.5">
          <div className="h-4 w-full max-w-32 rounded-sm bg-gray-200" />
          <div className="h-5 w-full max-w-72 rounded-sm bg-gray-200" />
          <div className="h-4 w-full max-w-40 rounded-sm bg-gray-200" />
          <div className="h-3 w-full max-w-48 rounded-sm bg-gray-200" />
          <div className="h-4 w-16 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
};
