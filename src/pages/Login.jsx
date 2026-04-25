import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Slight delay for better UX
    setTimeout(() => {
      const result = login(email, password);
      
      if (result.success) {
        if (result.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 blur-3xl rounded-full transition-all group-hover:bg-primary-500/20" />
        
        <div className="relative">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white mb-2">Welcome Back</h1>
            <p className="text-slate-400 font-medium">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@movieapp.com or user@email.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-slate-600 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800 text-center">
            <p className="text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-400 hover:text-primary-300 font-bold transition-colors">
                Create account
              </Link>
            </p>
          </div>

          {/* Admin Hint */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/50 text-center">
            <p className="text-[11px] text-slate-500 uppercase tracking-widest font-black mb-1">Testing Credentials</p>
            <p className="text-xs text-slate-400 font-medium">Admin: <span className="text-primary-500/80">admin@movieapp.com</span> / <span className="text-primary-500/80">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
