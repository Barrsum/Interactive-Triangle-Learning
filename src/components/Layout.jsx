// src/components/Layout.jsx
import React from 'react';
// Use HashLink for smooth scrolling to sections
import { HashLink } from 'react-router-hash-link'; // Use default import or named
import { Outlet } from 'react-router-dom';
import Footer from './Footer'; // Import the new Footer
import { FaSun, FaMoon } from 'react-icons/fa'; // Icons for toggle
import './Layout.css';

// Receive theme state and toggle function as props
function Layout({ theme, toggleTheme }) {

  // Helper for active class - simple version for hash links
  const getNavLinkClass = ({ isActive }) => {
    // isActive might not work reliably for hash links without extra logic.
    // For now, just return the base class. Active styling could be done via JS if needed.
    return 'nav-link';
  };

  // Smooth scroll function for HashLink
  const scrollWithOffset = (el) => {
      const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
      const yOffset = -80; // Adjust this value based on your sticky header height + extra space
      window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  }

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="logo">
          {/* Use NavLink for the logo link to home top */}
          <HashLink smooth to="/#top" scroll={scrollWithOffset}>📐 Interactive Triangle Tutor</HashLink>
          <p>- Created by Ram Bapat -</p>
        </div>
        <nav className="main-nav">
          {/* Update NavLinks to use HashLink and point to section IDs */}
          <HashLink smooth to="/#angle-sum" className={getNavLinkClass} scroll={scrollWithOffset}>
            Angle Sum
          </HashLink>
          <HashLink smooth to="/#pythagoras" className={getNavLinkClass} scroll={scrollWithOffset}>
            Pythagoras
          </HashLink>
          <HashLink smooth to="/#herons-formula" className={getNavLinkClass} scroll={scrollWithOffset}>
            Heron's Formula
          </HashLink>
        </nav>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-button"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
         >
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </header>

      <main className="app-content">
        <Outlet /> {/* This is where HomePage will be rendered */}
      </main>

      {/* Use the imported Footer component */}
      <Footer />
    </div>
  );
}

export default Layout;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos