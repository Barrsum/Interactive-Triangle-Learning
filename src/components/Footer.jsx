// src/components/Footer.jsx
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="social-links">
        <a
          href="https://www.linkedin.com/in/ram-bapat-barrsum-diamos" 
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn Profile"
        >
          <FaLinkedin />
        </a>
        <a
          href="https://github.com/Barrsum/Interactive-Triangle-Learning.git"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Profile"
          title="GitHub Profile"
        >
          <FaGithub />
        </a>
      </div>
      <p className="connect-text">
        Connect via <a href="https://www.linkedin.com/in/ram-bapat-barrsum-diamos" target="_blank" rel="noopener noreferrer">LinkedIn</a> /
        View source on <a href="https://github.com/Barrsum/Interactive-Triangle-Learning.git" target="_blank" rel="noopener noreferrer">GitHub</a>
      </p>
      <p className="connect-text">Created By Ram Bapat</p>
       <p className="connect-text tutor-credit">
        Interactive Triangle Tutor Concept & Base Code
       </p>
    </footer>
  );
}

export default React.memo(Footer);

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos