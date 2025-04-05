// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
// No longer import lesson pages directly here

function App() {
  // --- Theme State ---
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  // Effect to apply theme attribute to <html> tag and save to localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme); // Apply to <html>
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Function to toggle theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  // --- End Theme State ---

  return (
    <Router>
      <Routes>
        {/* Pass theme state and toggle function to Layout */}
        <Route path="/" element={<Layout theme={theme} toggleTheme={toggleTheme} />}>
          {/* Only the HomePage route renders inside the layout's Outlet */}
          <Route index element={<HomePage />} />

          {/* Add a catch-all route for 404 later if needed */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos