# Movie Search App

A professional, modern Movie Search Application built with React, Vite, and Tailwind CSS. This project features user authentication, role-based access, OMDb API integration, and a full admin dashboard with CRUD capabilities.

## 🚀 Features

- **Guest Access**: Browse and search movies without an account.
- **User Authentication**: Register and login (persisted via LocalStorage).
- **Watchlist**: Registered users can save movies to their favorites.
- **Admin Dashboard**:
  - Full CRUD for movies (Add, Edit, Delete).
  - Image upload support (Base64 storage).
  - YouTube trailer embedding.
  - Statistics overview.
- **Modern UI**: Dark cinema theme, glassmorphism, responsive design, and smooth animations.
- **API Integration**: Real-time search using OMDb API with local JSON fallback.

## 🛠️ Installation

1. **Clone or download the project**
2. **Install dependencies**:
   ```bash
   npm install
   ```

## 💻 Running Locally

To start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

## 🏗️ Build Instructions

To create a production build:
```bash
npm run build
```
The optimized files will be in the `dist/` folder.

## 🌐 Deployment to Netlify

1. **Manual Deploy**:
   - Run `npm run build`.
   - Drag and drop the `dist/` folder into the Netlify UI.
2. **Git Deploy**:
   - Connect your repository to Netlify.
   - Build command: `npm run build`.
   - Publish directory: `dist`.

## 🔑 Credentials for Testing

- **Admin Account**:
  - Username: `admin`
  - Password: `admin123`
- **User Account**:
  - Register a new account on the Register page.

## 📝 Technical Notes

- **OMDb API**: The project uses a public OMDb API key. If it hits the limit, the app automatically falls back to local JSON data.
- **Storage**: All user data, admin-created movies, and favorites are stored in `localStorage`, meaning no backend is required.
- **Images**: Admin-uploaded posters are converted to Base64 strings and stored locally.

---
*Created for University Assignment - Professional Web Development*
