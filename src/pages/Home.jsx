import React, { useState, useEffect, useCallback } from 'react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Search, Filter, X, ChevronDown, Sparkles, TrendingUp, Calendar, Star as StarIcon, SortAsc, LayoutGrid, Ghost } from 'lucide-react';
import { clsx } from 'clsx';

const Home = () => {
  const { movies, loading, getMovies, totalResults } = useMovies();
  
  // Search and Filter State
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Debounced fetch
  useEffect(() => {
    const timer = setTimeout(() => {
      getMovies({ query, genre, year, rating, sort });
    }, 400);
    return () => clearTimeout(timer);
  }, [query, genre, year, rating, sort, getMovies]);

  const clearFilters = () => {
    setQuery('');
    setGenre('');
    setYear('');
    setRating('');
    setSort('newest');
  };

  const genres = ['Action', 'Drama', 'Horror', 'Comedy', 'Sci-Fi', 'Romance', 'Thriller', 'Animation'];
  const years = ['2024', '2023', '2022', 'older'];
  const ratings = [
    { label: '9+ Stars', value: '9' },
    { label: '8+ Stars', value: '8' },
    { label: '7+ Stars', value: '7' },
  ];

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="relative h-[500px] -mt-8 mb-16 rounded-b-[40px] overflow-hidden group">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
            alt="Hero Background"
            className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-10000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>
        
        <div className="relative h-full max-w-7xl mx-auto px-4 flex flex-col justify-center items-center text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary-500/20 backdrop-blur-md border border-primary-500/30 px-4 py-2 rounded-full text-primary-400 text-sm font-black uppercase tracking-widest animate-bounce">
            <Sparkles className="w-4 h-4" />
            Discover the Magic of Cinema
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
            Unlimited Movies, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">Infinite Stories.</span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl font-medium">
            Browse through our curated collection of blockbusters and independent gems. 
            From local favorites to international hits, find your next favorite movie today.
          </p>

          {/* Search Bar in Hero */}
          <div className="w-full max-w-2xl relative group mt-8">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by title, actor, or director..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-900/80 backdrop-blur-xl border-2 border-slate-800 rounded-3xl py-5 pl-16 pr-6 text-white text-lg placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all shadow-2xl"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* Filter Bar */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800/50 rounded-[32px] p-6 space-y-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-500/10 rounded-2xl">
                <Filter className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-tight">Explore Content</h2>
                <p className="text-slate-500 text-sm font-bold">{totalResults} Movies Found</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={clsx(
                  "flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all border-2",
                  showFilters 
                    ? "bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20" 
                    : "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600"
                )}
              >
                Advanced Filters
                <ChevronDown className={clsx("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
              </button>
              {(genre || year || rating || query) && (
                <button 
                  onClick={clearFilters}
                  className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all border-2 border-red-500/20"
                  title="Clear All Filters"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-6 border-t border-slate-800/50 animate-in slide-in-from-top-4 duration-300">
              {/* Genre Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3" /> Genre
                </label>
                <select 
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Genres</option>
                  {genres.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              {/* Year Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Release Year
                </label>
                <select 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">All Years</option>
                  {years.map(y => <option key={y} value={y}>{y === 'older' ? 'Before 2022' : y}</option>)}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <StarIcon className="w-3 h-3" /> Minimum Rating
                </label>
                <select 
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Any Rating</option>
                  {ratings.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <SortAsc className="w-3 h-3" /> Sort Results
                </label>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-4 py-3 text-white font-bold focus:outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="az">A - Z</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Main Content Title */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-2 bg-primary-500 rounded-full shadow-lg shadow-primary-500/50" />
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">
              {query ? `Search Results for "${query}"` : genre ? `${genre} Collection` : 'Featured Movies'}
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="aspect-[2/3] bg-slate-900 rounded-[32px] animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID || movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 space-y-6 bg-slate-900/30 rounded-[40px] border-2 border-dashed border-slate-800">
              <div className="p-8 bg-slate-800/50 rounded-full">
                <Ghost className="w-20 h-20 text-slate-600" />
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-black text-white mb-2">No Movies Found</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto px-4">
                  We couldn't find any movies matching your current filters. Try adjusting your search or clearing filters.
                </p>
              </div>
              <button 
                onClick={clearFilters}
                className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-primary-500/20 active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
