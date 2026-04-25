import React from 'react';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { favorites } = useMovies();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary-500/10 rounded-2xl text-primary-500">
          <Heart className="w-8 h-8 fill-current" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white">Your Watchlist</h1>
          <p className="text-slate-400">Movies you've saved to watch later</p>
        </div>
      </div>

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-900/50 rounded-3xl border border-dashed border-slate-800 space-y-6">
          <div className="inline-flex p-6 bg-slate-800 rounded-full text-slate-600">
            <Heart className="w-12 h-12" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Your list is empty</h3>
            <p className="text-slate-500 max-w-xs mx-auto">
              Start adding movies to your favorites to see them here!
            </p>
          </div>
          <Link 
            to="/" 
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all"
          >
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default Favorites;
