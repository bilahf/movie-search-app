import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import fallbackMovies from '../data/movies.json';

const MovieContext = createContext();

const OMDB_API_KEY = 'c951076f'; 
const BASE_URL = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}`;

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]); // Currently displayed movies (filtered/searched)
  const [adminMovies, setAdminMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentQuery, setCurrentQuery] = useState('');

  // 1. Load Admin Movies and Initial Homepage Data
  useEffect(() => {
    const storedAdminMovies = localStorage.getItem('movieApp_adminMovies');
    const parsedAdminMovies = storedAdminMovies ? JSON.parse(storedAdminMovies) : [];
    setAdminMovies(parsedAdminMovies);
    
    // Initial load: Admin + Fallback movies (No default API search)
    const initialMovies = [...parsedAdminMovies, ...fallbackMovies];
    setMovies(initialMovies);
    setTotalResults(initialMovies.length);
  }, []);

  // 2. Load Favorites when user changes
  useEffect(() => {
    const storedUser = localStorage.getItem('movieApp_currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const allFavorites = JSON.parse(localStorage.getItem('movieApp_favorites') || '{}');
      setFavorites(allFavorites[user.id] || []);
    } else {
      setFavorites([]);
    }
  }, []);

  /**
   * Unified Search & Filter Function
   * Priority: Admin -> Local Dummy -> OMDb API (only if searching)
   */
  const getMovies = useCallback(async (params = {}) => {
    const { 
      query = '', 
      genre = '', 
      year = '', 
      rating = '', 
      sort = 'newest', 
      page = 1 
    } = params;

    setLoading(true);
    setCurrentPage(page);
    setCurrentQuery(query);

    try {
      let baseResults = [];
      
      // If user is searching via query, we might want to hit the API
      if (query.trim()) {
        try {
          const response = await axios.get(`${BASE_URL}&s=${query}&page=${page}`);
          if (response.data.Response === 'True') {
            baseResults = response.data.Search;
          }
        } catch (apiErr) {
          console.error('OMDb API error, falling back to local search');
        }
      }

      // Merge with Admin and Fallback movies
      const allLocal = [...adminMovies, ...fallbackMovies];
      
      // Filter local movies based on query
      const filteredLocal = allLocal.filter(m => 
        m.Title.toLowerCase().includes(query.toLowerCase())
      );

      // Combine: Local (Admin + Fallback) first, then API results
      // Ensure no duplicates by imdbID or id
      let combined = [...filteredLocal];
      baseResults.forEach(apiMovie => {
        if (!combined.some(m => (m.imdbID === apiMovie.imdbID || m.id === apiMovie.imdbID))) {
          combined.push(apiMovie);
        }
      });

      // --- APPLY FILTERS ---
      let filtered = [...combined];

      // Genre Filter
      if (genre) {
        filtered = filtered.filter(m => 
          m.Genre?.toLowerCase().includes(genre.toLowerCase())
        );
      }

      // Year Filter
      if (year) {
        if (year === 'older') {
          filtered = filtered.filter(m => parseInt(m.Year) < 2022);
        } else {
          filtered = filtered.filter(m => m.Year === year);
        }
      }

      // Rating Filter
      if (rating) {
        const minRating = parseFloat(rating);
        filtered = filtered.filter(m => parseFloat(m.imdbRating || 0) >= minRating);
      }

      // --- APPLY SORTING ---
      filtered.sort((a, b) => {
        if (sort === 'newest') return parseInt(b.Year || 0) - parseInt(a.Year || 0);
        if (sort === 'oldest') return parseInt(a.Year || 0) - parseInt(b.Year || 0);
        if (sort === 'rating') return parseFloat(b.imdbRating || 0) - parseFloat(a.imdbRating || 0);
        if (sort === 'az') return a.Title.localeCompare(b.Title);
        return 0;
      });

      setMovies(filtered);
      setTotalResults(filtered.length);
    } catch (error) {
      console.error('Get movies error:', error);
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  }, [adminMovies]);

  /**
   * Admin CRUD Operations
   */
  const addMovie = (movieData) => {
    const newMovie = {
      ...movieData,
      id: `admin-${Date.now()}`,
      imdbID: `admin-${Date.now()}`,
      source: 'admin',
      Year: movieData.Year || new Date().getFullYear().toString()
    };

    const updatedAdminMovies = [newMovie, ...adminMovies];
    setAdminMovies(updatedAdminMovies);
    localStorage.setItem('movieApp_adminMovies', JSON.stringify(updatedAdminMovies));
    
    // Refresh current view immediately
    setMovies(prev => [newMovie, ...prev]);
    setTotalResults(prev => prev + 1);
    
    toast.success('Movie added to featured list!');
  };

  const updateMovie = (updatedMovie) => {
    const updatedList = adminMovies.map(m => 
      (m.id === updatedMovie.id || m.imdbID === updatedMovie.imdbID) ? updatedMovie : m
    );

    setAdminMovies(updatedList);
    localStorage.setItem('movieApp_adminMovies', JSON.stringify(updatedList));

    // Update current view
    setMovies(prev => prev.map(m => 
      (m.id === updatedMovie.id || m.imdbID === updatedMovie.imdbID) ? updatedMovie : m
    ));

    toast.success('Movie updated successfully!');
  };

  const deleteMovie = (id) => {
    const updatedList = adminMovies.filter(m => m.id !== id && m.imdbID !== id);
    
    setAdminMovies(updatedList);
    localStorage.setItem('movieApp_adminMovies', JSON.stringify(updatedList));

    // Update current view
    setMovies(prev => prev.filter(m => m.id !== id && m.imdbID !== id));
    setTotalResults(prev => prev - 1);

    toast.success('Movie removed from database');
  };

  const toggleFavorite = (movie) => {
    const storedUser = localStorage.getItem('movieApp_currentUser');
    if (!storedUser) {
      toast.error('Please login to save favorites');
      return;
    }

    const user = JSON.parse(storedUser);
    const allFavorites = JSON.parse(localStorage.getItem('movieApp_favorites') || '{}');
    const userFavorites = allFavorites[user.id] || [];
    
    const isFav = userFavorites.some(f => (f.imdbID === movie.imdbID || f.id === movie.id));
    let updatedFavs;

    if (isFav) {
      updatedFavs = userFavorites.filter(f => (f.imdbID !== movie.imdbID && f.id !== movie.id));
      toast.success('Removed from watchlist');
    } else {
      updatedFavs = [...userFavorites, movie];
      toast.success('Added to watchlist');
    }

    allFavorites[user.id] = updatedFavs;
    localStorage.setItem('movieApp_favorites', JSON.stringify(allFavorites));
    setFavorites(updatedFavs);
  };

  const getMovieDetails = async (id) => {
    // 1. Check admin movies
    const adminMatch = adminMovies.find(m => m.id === id || m.imdbID === id);
    if (adminMatch) return adminMatch;

    // 2. Check fallback local movies
    const fallbackMatch = fallbackMovies.find(m => m.imdbID === id);
    if (fallbackMatch) return fallbackMatch;

    // 3. Check OMDb API
    try {
      const response = await axios.get(`${BASE_URL}&i=${id}&plot=full`);
      return response.data;
    } catch (error) {
      console.error('Detail fetch error:', error);
      return null;
    }
  };

  return (
    <MovieContext.Provider value={{ 
      movies, 
      adminMovies, 
      favorites, 
      loading, 
      totalResults,
      currentPage,
      getMovies, // New unified fetch/filter function
      getMovieDetails,
      addMovie,
      updateMovie,
      deleteMovie,
      toggleFavorite
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovies = () => useContext(MovieContext);
