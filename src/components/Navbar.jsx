import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Heart, LayoutDashboard, LogOut, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-900">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-2xl font-black text-primary-500 tracking-tight">
          <Film className="w-8 h-8" />
          <span>MOVIE<span className="text-white">HUB</span></span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary-500 transition-colors">Home</Link>
          
          {/* Only Users see Favorites */}
          {user && !isAdmin && (
            <Link to="/favorites" className="flex items-center gap-1 text-sm font-medium hover:text-primary-500 transition-colors">
              <Heart className="w-4 h-4" />
              <span>Watchlist</span>
            </Link>
          )}

          {/* Only Admins see Dashboard */}
          {isAdmin && (
            <Link to="/admin/dashboard" className="flex items-center gap-1 text-sm font-medium hover:text-primary-500 transition-colors">
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="h-6 w-px bg-slate-800 mx-2 hidden md:block" />

          {user ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-slate-300">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                  <User className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold leading-none">{user.username}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 md:px-4 md:py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/50 transition-all flex items-center gap-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-xs font-bold hidden md:block">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login" 
                className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-primary-500/20 active:scale-95 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Join Free</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
