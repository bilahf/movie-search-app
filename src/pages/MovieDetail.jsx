import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { Star, Play, Heart, ArrowLeft, Loader2, Calendar, Clock, Globe, Award, Film, User } from 'lucide-react';
import { clsx } from 'clsx';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMovieDetails, toggleFavorite, favorites } = useMovies();
  const { user, isAdmin } = useAuth();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      setLoading(true);
      const data = await getMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };
    fetchMovie();
  }, [id, getMovieDetails]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse">Loading Cinematic Experience...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-32 space-y-6">
        <div className="inline-flex p-6 bg-slate-900 rounded-full">
          <Film className="w-16 h-16 text-slate-700" />
        </div>
        <h2 className="text-4xl font-black text-white uppercase">Movie not found</h2>
        <p className="text-slate-500 max-w-md mx-auto">The movie you are looking for might have been removed or the link is incorrect.</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-primary-500 hover:bg-primary-600 text-white px-8 py-3 rounded-2xl font-black transition-all shadow-xl shadow-primary-500/20"
        >
          Return to Cinema
        </button>
      </div>
    );
  }

  const isFavorite = favorites.some(f => (f.imdbID === movie.imdbID || f.id === movie.id));

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYoutubeId(movie.Trailer);

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20 animate-in fade-in duration-700">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-slate-400 hover:text-white transition-all group bg-slate-900/50 px-5 py-2.5 rounded-2xl border border-slate-800"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-black uppercase text-xs tracking-widest">Back to Browse</span>
        </button>

        {movie.source === 'admin' && (
          <div className="flex items-center gap-2 bg-primary-500/10 text-primary-500 px-4 py-2 rounded-2xl border border-primary-500/20">
            <Award className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Admin Featured</span>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-[400px,1fr] gap-16">
        {/* Left Side: Poster & Quick Stats */}
        <div className="space-y-8">
          <div className="rounded-[40px] overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-900 aspect-[2/3] relative group">
            <img 
              src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600?text=No+Poster'} 
              alt={movie.Title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-40" />
          </div>
          
          {user && !isAdmin && (
            <button
              onClick={() => toggleFavorite(movie)}
              className={clsx(
                "w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-black uppercase tracking-widest transition-all shadow-2xl active:scale-95",
                isFavorite 
                  ? "bg-primary-500 text-white shadow-primary-500/30" 
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              )}
            >
              <Heart className={clsx("w-5 h-5", isFavorite && "fill-current")} />
              {isFavorite ? 'Saved to Watchlist' : 'Add to Watchlist'}
            </button>
          )}

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800/50">
              <span className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Status</span>
              <p className="text-white font-bold">{movie.Released !== 'N/A' ? 'Released' : 'Upcoming'}</p>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-3xl border border-slate-800/50">
              <span className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-1">Language</span>
              <p className="text-white font-bold">{movie.Language || 'English'}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Information Content */}
        <div className="space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-primary-500 text-white px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-primary-500/20">
                {movie.Year}
              </span>
              {movie.Runtime && movie.Runtime !== 'N/A' && (
                <span className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-xl text-xs font-black flex items-center gap-2 border border-slate-700">
                  <Clock className="w-3.5 h-3.5" />
                  {movie.Runtime}
                </span>
              )}
              <span className="bg-slate-800 text-slate-300 px-4 py-1.5 rounded-xl text-xs font-black border border-slate-700">
                {movie.Genre}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] uppercase tracking-tighter">
              {movie.Title}
            </h1>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-500/10 rounded-2xl">
                  <Star className="w-8 h-8 text-yellow-500 fill-current" />
                </div>
                <div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black text-white">{movie.imdbRating || 'N/A'}</span>
                    <span className="text-slate-500 text-sm font-bold mb-1">/10</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">IMDb Rating</span>
                </div>
              </div>

              {movie.Director && movie.Director !== 'N/A' && (
                <div className="flex items-center gap-3 border-l border-slate-800 pl-8">
                  <div className="p-3 bg-blue-500/10 rounded-2xl">
                    <User className="w-8 h-8 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-white font-black text-xl leading-tight">{movie.Director}</p>
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-500">Director</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-6 w-1.5 bg-primary-500 rounded-full" />
              <h3 className="text-2xl font-black text-white uppercase tracking-tight">The Storyline</h3>
            </div>
            <p className="text-slate-400 text-xl leading-relaxed font-medium">
              {movie.Plot || movie.description || 'No description available for this cinematic masterpiece.'}
            </p>
          </div>

          {/* Cast Section */}
          {movie.Actors && movie.Actors !== 'N/A' && (
            <div className="space-y-4">
              <h4 className="text-[10px] uppercase tracking-widest font-black text-slate-500">Top Billed Cast</h4>
              <p className="text-white font-bold text-lg bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50 inline-block">
                {movie.Actors}
              </p>
            </div>
          )}

          {/* Trailer Section */}
          {movie.Trailer && (
            <div className="space-y-6 pt-10 border-t border-slate-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-red-500/10 rounded-2xl">
                    <Play className="w-6 h-6 text-red-500 fill-current" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Official Trailer</h3>
                </div>
                {!videoId && (
                  <a 
                    href={movie.Trailer} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary-500 hover:text-primary-400 font-black text-xs uppercase tracking-widest"
                  >
                    Watch on YouTube <Globe className="w-4 h-4" />
                  </a>
                )}
              </div>
              
              {videoId ? (
                <div className="aspect-video rounded-[32px] overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-2xl relative group">
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                    title={`${movie.Title} Trailer`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="relative z-10"
                  ></iframe>
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-0">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 rounded-[32px] p-12 text-center border-2 border-dashed border-slate-800">
                  <Play className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                  <h4 className="text-white font-black uppercase text-xl mb-2">Trailer available externally</h4>
                  <p className="text-slate-500 mb-6">Click the button below to watch the official trailer for this movie.</p>
                  <a 
                    href={movie.Trailer} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-2xl font-black uppercase text-sm hover:bg-primary-500 hover:text-white transition-all shadow-xl active:scale-95"
                  >
                    Watch Now <Globe className="w-5 h-5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;
