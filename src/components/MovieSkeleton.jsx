const MovieSkeleton = () => {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 animate-pulse">
      <div className="aspect-[2/3] bg-slate-800" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="flex justify-between">
          <div className="h-3 bg-slate-800 rounded w-1/4" />
          <div className="h-3 bg-slate-800 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
};

export default MovieSkeleton;
