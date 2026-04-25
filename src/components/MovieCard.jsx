import { Link } from 'react-router-dom';
import { Star, Heart, PlayCircle, Calendar, Info } from 'lucide-react';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const MovieCard = ({ movie }) => {
  const { toggleFavorite, favorites } = useMovies();
  const { user, isAdmin } = useAuth();
  
  const movieId = movie.imdbID || movie.id;
  const isFavorite = favorites.some(f => (f.imdbID === movieId || f.id === movieId));

  return (
    <div className="group relative bg-slate-900 rounded-[32px] overflow-hidden shadow-2xl hover:shadow-primary-500/20 transition-all duration-500 border border-slate-800/50 hover:border-primary-500/50 animate-in fade-in zoom-in-95 duration-500">
      {/* Poster Image Wrapper */}
      <div className="aspect-[2/3] overflow-hidden relative">
        <img 
          src={movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'} 
          alt={movie.Title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        <div className="absolute inset-0 bg-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Hover Actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <Link 
            to={`/movie/${movieId}`}
            className="flex items-center gap-2 bg-white text-slate-950 px-6 py-3 rounded-2xl font-black text-sm hover:bg-primary-500 hover:text-white transition-all shadow-xl active:scale-95"
          >
            <PlayCircle className="w-5 h-5" />
            VIEW DETAILS
          </Link>
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {movie.source === 'admin' && (
            <div className="px-3 py-1.5 bg-primary-600/90 backdrop-blur-md text-[10px] font-black text-white rounded-xl uppercase tracking-widest shadow-lg border border-white/10">
              Featured
            </div>
          )}
          {movie.Genre && (
            <div className="px-3 py-1.5 bg-slate-950/60 backdrop-blur-md text-[10px] font-black text-slate-300 rounded-xl uppercase tracking-widest border border-white/5">
              {movie.Genre.split(',')[0]}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 relative bg-slate-900">
        <div className="flex justify-between items-start gap-3 mb-3">
          <h3 className="font-black text-white line-clamp-1 group-hover:text-primary-400 transition-colors text-lg uppercase tracking-tight">
            {movie.Title}
          </h3>
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-lg">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-black">{movie.imdbRating || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-400 font-bold">
              <Calendar className="w-3.5 h-3.5" />
              {movie.Year}
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Button (Hidden for Admin/Guest but functionality exists for Users) */}
      {user && !isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(movie);
          }}
          className={clsx(
            "absolute top-4 right-4 p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 active:scale-90 shadow-2xl z-10",
            isFavorite 
              ? "bg-primary-500 text-white shadow-primary-500/40" 
              : "bg-slate-950/40 text-white hover:bg-primary-500 border border-white/10"
          )}
        >
          <Heart className={clsx("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      )}
    </div>
  );
};

export default MovieCard;
