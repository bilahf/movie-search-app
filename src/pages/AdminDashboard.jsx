import React, { useState, useEffect } from 'react';
import { useMovies } from '../context/MovieContext';
import { 
  Plus, Edit2, Trash2, Film, Users, Heart, 
  Search, ExternalLink, Image as ImageIcon, 
  Clapperboard, Calendar, Star, Tag, AlignLeft,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const { adminMovies, addMovie, updateMovie, deleteMovie } = useMovies();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalFavorites: 0
  });

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('movieApp_users') || '[]');
    const allFavs = JSON.parse(localStorage.getItem('movieApp_favorites') || '{}');
    let favCount = 0;
    Object.values(allFavs).forEach(list => favCount += list.length);

    setStats({
      totalMovies: adminMovies.length,
      totalUsers: users.length + 1, // +1 for admin
      totalFavorites: favCount
    });
  }, [adminMovies]);

  const [formData, setFormData] = useState({
    Title: '',
    Year: '',
    imdbRating: '',
    Genre: '',
    Plot: '',
    Poster: '',
    Trailer: '',
  });

  const handleOpenModal = (movie = null) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        Title: movie.Title,
        Year: movie.Year,
        imdbRating: movie.imdbRating,
        Genre: movie.Genre,
        Plot: movie.Plot,
        Poster: movie.Poster,
        Trailer: movie.Trailer || '',
      });
    } else {
      setEditingMovie(null);
      setFormData({
        Title: '',
        Year: '',
        imdbRating: '',
        Genre: '',
        Plot: '',
        Poster: '',
        Trailer: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingMovie) {
      updateMovie({ ...editingMovie, ...formData });
    } else {
      addMovie(formData);
    }
    setIsModalOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, Poster: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredMovies = adminMovies.filter(m => 
    m.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Admin <span className="text-primary-500">Dashboard</span></h1>
          <p className="text-slate-400 font-medium mt-1">Manage your custom movie database</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary-500/20 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Movie</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Custom Movies', value: stats.totalMovies, icon: Clapperboard, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Watchlist Adds', value: stats.totalFavorites, icon: Heart, color: 'text-rose-400', bg: 'bg-rose-400/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${stat.bg} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
            <div className="relative flex items-center gap-5">
              <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-black text-white mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-primary-500" />
            Your Movie List
          </h2>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search admin movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-primary-500/50 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/50">
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Movie</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Details</th>
                <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredMovies.length > 0 ? (
                filteredMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={movie.Poster || 'https://via.placeholder.com/300x450?text=No+Poster'} 
                          alt={movie.Title}
                          className="w-12 h-16 object-cover rounded-lg shadow-lg border border-slate-700 group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <p className="font-bold text-white leading-tight">{movie.Title}</p>
                          <p className="text-xs text-slate-500 mt-1">{movie.Year}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 rounded-md bg-slate-800 text-[10px] font-bold text-slate-300 uppercase tracking-wider">{movie.Genre}</span>
                        <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-[10px] font-bold text-yellow-500 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500" /> {movie.imdbRating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(movie)}
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 transition-all"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if(window.confirm('Delete this movie?')) deleteMovie(movie.id);
                          }}
                          className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-600">
                      <Clapperboard className="w-12 h-12 opacity-20" />
                      <p className="font-medium">No movies found in your database</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <div className="relative bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <h3 className="text-xl font-black text-white">{editingMovie ? 'Edit Movie' : 'Add New Movie'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Film className="w-3 h-3" /> Title
                </label>
                <input
                  required
                  type="text"
                  value={formData.Title}
                  onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Year
                </label>
                <input
                  required
                  type="text"
                  value={formData.Year}
                  onChange={(e) => setFormData({ ...formData, Year: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Star className="w-3 h-3" /> Rating (0-10)
                </label>
                <input
                  required
                  type="text"
                  value={formData.imdbRating}
                  onChange={(e) => setFormData({ ...formData, imdbRating: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Tag className="w-3 h-3" /> Genre
                </label>
                <input
                  required
                  type="text"
                  value={formData.Genre}
                  onChange={(e) => setFormData({ ...formData, Genre: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <AlignLeft className="w-3 h-3" /> Description
                </label>
                <textarea
                  required
                  value={formData.Plot}
                  onChange={(e) => setFormData({ ...formData, Plot: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Poster Image
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="poster-upload"
                  />
                  <label 
                    htmlFor="poster-upload"
                    className="w-full bg-slate-950 border border-dashed border-slate-800 rounded-xl py-4 px-4 text-slate-400 hover:text-primary-400 hover:border-primary-500/50 cursor-pointer transition-all text-center flex items-center justify-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Choose File</span>
                  </label>
                  {formData.Poster && (
                    <div className="relative w-20 h-28">
                      <img src={formData.Poster} alt="Preview" className="w-full h-full object-cover rounded-lg border border-slate-700" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, Poster: '' }))}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:scale-110 transition-transform"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" /> Trailer Link (YouTube)
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={formData.Trailer}
                  onChange={(e) => setFormData({ ...formData, Trailer: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-500/50 transition-all font-medium"
                />
              </div>

              <div className="md:col-span-2 pt-4 flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 hover:bg-primary-500 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95"
                >
                  {editingMovie ? 'Update Movie' : 'Save Movie'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-4 rounded-2xl font-black text-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
