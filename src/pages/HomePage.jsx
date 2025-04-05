// src/pages/HomePage.jsx
import React from 'react';
import { FaLightbulb } from 'react-icons/fa'; // Example icon
import AngleSumLesson from '../components/lessons/AngleSumLesson';
import PythagorasLesson from '../components/lessons/PythagorasLesson';
import HeronsFormulaLesson from '../components/lessons/HeronsFormulaLesson';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page-container">
      <div id="top" style={{ position: 'absolute', top: '-80px' }}></div>

      <section id="intro" className="intro-section card enhanced-intro"> {/* Add 'enhanced-intro' class */}
        <div className="intro-icon">
            <FaLightbulb />
        </div>
        <h2>Welcome to the Interactive Triangle Tutor!</h2>
        <p className="intro-subtitle">Fun way to experience triangles starts here.</p>
        <p>Explore the interactive lessons below.</p>
      </section>


      {/* Lesson 1: Angle Sum */}
      <section id="angle-sum" className="lesson-section">
        <AngleSumLesson />
      </section>

      {/* Lesson 2: Pythagoras */}
      <section id="pythagoras" className="lesson-section">
        <PythagorasLesson />
      </section>

      {/* Lesson 3: Heron's Formula */}
      <section id="herons-formula" className="lesson-section">
        <HeronsFormulaLesson />
      </section>

    </div>
  );
}

export default HomePage;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos