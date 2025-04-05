// src/components/lessons/PythagorasLesson.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { FaSlidersH, FaKeyboard } from 'react-icons/fa'; // Icons for toggle
import './PythagorasLesson.css';

const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

// Clamp value between min and max
const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

function PythagorasLesson() {
  // State for sides
  const [sideA, setSideA] = useState(3);
  const [sideB, setSideB] = useState(4);

  // State for input mode ('slider' or 'number')
  const [inputMode, setInputMode] = useState('slider'); // Default to slider

  // --- Derived State & Calculations (mostly unchanged) ---
  const isValidA = useMemo(() => isPositiveNumber(sideA), [sideA]);
  const isValidB = useMemo(() => isPositiveNumber(sideB), [sideB]);
  const canCalculate = isValidA && isValidB;

  const sideC = useMemo(() => {
    if (!canCalculate) return NaN;
    const a = parseFloat(sideA);
    const b = parseFloat(sideB);
    return Math.sqrt(a * a + b * b);
  }, [sideA, sideB, canCalculate]);

  const sideCFormatted = canCalculate ? sideC.toFixed(2) : '---';
  const aSquared = isValidA ? (parseFloat(sideA) ** 2).toFixed(2) : 'a²';
  const bSquared = isValidB ? (parseFloat(sideB) ** 2).toFixed(2) : 'b²';
  const cSquared = canCalculate ? (sideC ** 2).toFixed(2) : 'c²';

  // --- SVG Calculations (unchanged) ---
  const svgSize = 300;
  const padding = 40;
  const maxVisSide = svgSize - 2 * padding;
  const scaleFactor = useMemo(() => {
      if (!canCalculate) return 1;
      const a = parseFloat(sideA);
      const b = parseFloat(sideB);
      return maxVisSide / Math.max(a, b, 1);
  }, [sideA, sideB, canCalculate, maxVisSide]);
  const visA = canCalculate ? parseFloat(sideA) * scaleFactor : maxVisSide * (3/5);
  const visB = canCalculate ? parseFloat(sideB) * scaleFactor : maxVisSide * (4/5);
  const xOrigin = padding;
  const yOrigin = svgSize - padding;
  const pointA = { x: xOrigin, y: yOrigin - visB };
  const pointB = { x: xOrigin, y: yOrigin };
  const pointC = { x: xOrigin + visA, y: yOrigin };
  const labelOffset = 10;
  const labelA_pos = { x: xOrigin + visA / 2, y: yOrigin + labelOffset * 1.5 };
  const labelB_pos = { x: xOrigin - labelOffset * 1.5, y: yOrigin - visB / 2 };
  const labelC_pos = { x: xOrigin + visA / 2 + labelOffset, y: yOrigin - visB / 2 - labelOffset };

  // --- Handlers ---

  // Handler for number inputs
  const handleNumberInputChange = useCallback((e, sideSetter) => {
      sideSetter(e.target.value);
  }, []);

  // Handler for sliders
  const handleSliderChange = useCallback((e, sideSetter) => {
       // Sliders only produce integers between 1-100 here
      sideSetter(parseInt(e.target.value, 10));
  }, []);

  // Toggle input mode and clamp values if switching TO slider
  const toggleInputMode = useCallback(() => {
      setInputMode(prevMode => {
          const newMode = prevMode === 'slider' ? 'number' : 'slider';
          // If switching TO slider mode, clamp existing values
          if (newMode === 'slider') {
              const currentA = parseFloat(sideA);
              const currentB = parseFloat(sideB);
              // Use clamp helper function
              if (!isNaN(currentA)) {
                  setSideA(clamp(currentA, 1, 100));
              } else {
                   setSideA(1); // Default to 1 if not a number
              }
              if (!isNaN(currentB)) {
                  setSideB(clamp(currentB, 1, 100));
              } else {
                  setSideB(1);
              }
          }
          return newMode;
      });
  }, [sideA, sideB]); // Dependency on sideA/B needed for clamping logic

  // Ensure sliders always show valid clamped values when in slider mode
  const sliderValueA = inputMode === 'slider' ? clamp(parseFloat(sideA) || 1, 1, 100) : sideA;
  const sliderValueB = inputMode === 'slider' ? clamp(parseFloat(sideB) || 1, 1, 100) : sideB;


  return (
    <div className="pythagoras-lesson card">
      <h2>Lesson 2: Pythagorean Theorem</h2>
      <p>
        Applies to <strong>right-angled triangles</strong>. It states: the square of the hypotenuse ('c') equals the sum of the squares of the other two sides ('a' and 'b').
      </p>
      <p className="formula">
        <strong>a² + b² = c²</strong>
      </p>

      <div className="lesson-interactive-area">
        {/* --- Controls Section --- */}
        <div className="lesson-controls">

          {/* Input Mode Toggle Button */}
          <button onClick={toggleInputMode} className="input-mode-toggle" title={`Switch to ${inputMode === 'slider' ? 'Number Input' : 'Slider Input'}`}>
            {inputMode === 'slider' ? <><FaKeyboard /> Switch to Numbers</> : <><FaSlidersH /> Switch to Sliders</>}
          </button>

          <p className='input-mode-label'>
            Input Mode: {inputMode === 'slider' ? 'Sliders (1-100)' : 'Number Input'}
          </p>

          {/* --- Conditional Rendering for Inputs --- */}
          {inputMode === 'slider' ? (
            // --- Slider Inputs ---
            <div className="slider-controls">
              <div className="control-group slider-group">
                <label htmlFor="sliderA">Side a:</label>
                <input
                  type="range" id="sliderA" name="sliderA"
                  min="1" max="100" step="1"
                  value={sliderValueA} // Use clamped value for slider position
                  onChange={(e) => handleSliderChange(e, setSideA)}
                />
                <span className="control-value">{sliderValueA}</span>
              </div>
               <div className="control-group slider-group">
                <label htmlFor="sliderB">Side b:</label>
                <input
                  type="range" id="sliderB" name="sliderB"
                  min="1" max="100" step="1"
                  value={sliderValueB} // Use clamped value
                  onChange={(e) => handleSliderChange(e, setSideB)}
                />
                <span className="control-value">{sliderValueB}</span>
              </div>
            </div>
          ) : (
            // --- Number Inputs ---
            <div className="number-controls">
               <div className="control-group number-group">
                <label htmlFor="sideA">Side a:</label>
                <input
                  type="number" id="sideA" name="sideA"
                  value={sideA}
                  onChange={(e) => handleNumberInputChange(e, setSideA)}
                  min="0" step="any" placeholder="e.g., 3"
                  className={!isValidA && sideA !== '' ? 'input-error' : ''}
                />
              </div>
              <div className="control-group number-group">
                <label htmlFor="sideB">Side b:</label>
                <input
                  type="number" id="sideB" name="sideB"
                  value={sideB}
                  onChange={(e) => handleNumberInputChange(e, setSideB)}
                  min="0" step="any" placeholder="e.g., 4"
                  className={!isValidB && sideB !== '' ? 'input-error' : ''}
                />
              </div>
              {/* Validation Message only needed for number input */}
              {(!isValidA || !isValidB) && (sideA !== '' || sideB !== '') && (
                <p className="error-message">Please enter positive numbers for sides a and b.</p>
              )}
            </div>
          )}
          {/* --- End Conditional Rendering --- */}


          {/* --- Results Display (Common to both modes) --- */}
          <div className="lesson-results">
            <h4>Calculations:</h4>
            <p>a² = {isValidA ? `${parseFloat(sideA).toFixed(2)}² = ${aSquared}`: 'a²'}</p>
            <p>b² = {isValidB ? `${parseFloat(sideB).toFixed(2)}² = ${bSquared}`: 'b²'}</p>
            <p>a² + b² = {canCalculate ? `${aSquared} + ${bSquared} = ${cSquared}` : '---'}</p>
            <p className="hypotenuse-result">
              Hypotenuse c = √(<span className="highlight">{cSquared}</span>) =
              <span className="highlight calculated-value"> {sideCFormatted}</span>
            </p>
          </div>
        </div> {/* End lesson-controls */}

        {/* --- Visualization Section (Unchanged) --- */}
        <div className="lesson-visual">
          <svg viewBox={`0 0 ${svgSize} ${svgSize}`} preserveAspectRatio="xMidYMid meet">
            {/* Triangle */}
            <polygon
              className="visual-triangle"
              points={`${pointA.x},${pointA.y} ${pointB.x},${pointB.y} ${pointC.x},${pointC.y}`}
            />
            {/* Right Angle Marker */}
            <polygon
              className="right-angle-marker"
              points={`${pointB.x},${pointB.y - 10} ${pointB.x + 10},${pointB.y - 10} ${pointB.x + 10},${pointB.y} ${pointB.x},${pointB.y}`}
            />
            {/* Side Labels */}
            <text className="visual-text side-label" x={labelA_pos.x} y={labelA_pos.y} textAnchor="middle">
              a = {isValidA ? parseFloat(sideA).toFixed(1) : '?'} {/* Show 1 decimal for labels */}
            </text>
            <text className="visual-text side-label" x={labelB_pos.x} y={labelB_pos.y} textAnchor="end" dominantBaseline="middle">
              b = {isValidB ? parseFloat(sideB).toFixed(1) : '?'}
            </text>
            <text className="visual-text side-label hypotenuse-label" x={labelC_pos.x} y={labelC_pos.y} textAnchor="middle" dominantBaseline="alphabetic" transform={`rotate(${canCalculate ? Math.atan2(-(pointA.y-pointB.y), pointC.x-pointB.x) * (180/Math.PI) : 0} ${pointB.x + visA/2} ${pointB.y - visB/2})`}>
              c = {sideCFormatted}
            </text>
          </svg>
        </div> {/* End lesson-visual */}

      </div> {/* End lesson-interactive-area */}
    </div> // End pythagoras-lesson
  );
}

export default PythagorasLesson;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos