// src/components/lessons/AngleSumLesson.jsx
import React, { useState, useMemo } from 'react';
import './AngleSumLesson.css'; // Import the CSS

// Function to calculate triangle points
const calculateTrianglePoints = (angleA, angleB, angleC) => {
    const canvasWidth = 300;
    const canvasHeight = 180;
    const padding = 25; // Increased padding slightly more

    angleA = angleA || 60; angleB = angleB || 60; angleC = angleC || 60;

    const xB = padding; const yB = canvasHeight - padding;
    const baseLength = canvasWidth - 2 * padding;
    const xC = xB + baseLength; const yC = yB;

    const angleA_rad = angleA * (Math.PI / 180);
    const angleB_rad = angleB * (Math.PI / 180);
    const angleC_rad = angleC * (Math.PI / 180);

    let xA, yA;
    // Avoid division by zero or near-zero for degenerate triangles
    if (Math.sin(angleA_rad) < 0.01 || angleA < 1 || angleA > 178) {
        xA = xB + baseLength / 2;
        yA = padding; // Place at top padding
    } else {
        const side_c_length = baseLength * Math.sin(angleC_rad) / Math.sin(angleA_rad);
        xA = xB + side_c_length * Math.cos(angleB_rad);
        yA = yB - side_c_length * Math.sin(angleB_rad); // SVG y is inverted

        // Basic Clipping/Bounds check
        if (yA < padding / 2) yA = padding / 2; // Allow slightly closer to top edge
        if (yA > canvasHeight - padding / 2) yA = canvasHeight - padding / 2;
        if (xA < padding / 2) xA = padding / 2;
        if (xA > canvasWidth - padding / 2) xA = canvasWidth - padding / 2;
    }

    // Text label positions
    const labelOffset = 18; // Distance from vertex
    const xOffsetB = -8; // Horizontal offset for B label (move left)
    const xOffsetC = 8;  // Horizontal offset for C label (move right)
    const yOffsetBC = 5; // Vertical offset for B & C labels (move down slightly)

    const textA = { x: xA, y: yA - labelOffset / 1.5, anchor: 'middle' };
    const textB = { x: xB + xOffsetB, y: yB + yOffsetBC, anchor: 'end' }; // Anchor text end to its coordinate
    const textC = { x: xC + xOffsetC, y: yC + yOffsetBC, anchor: 'start' };// Anchor text start to its coordinate

    return {
        A: { x: xA, y: yA }, B: { x: xB, y: yB }, C: { x: xC, y: yC },
        labelA: textA, labelB: textB, labelC: textC,
        viewBox: `0 0 ${canvasWidth} ${canvasHeight}`
    };
};


function AngleSumLesson() {
  const [angleA, setAngleA] = useState(60);
  const [angleB, setAngleB] = useState(60);
  // Calculate C directly, ensuring it's at least 1 degree if A+B is large
  const angleC = Math.max(1, 180 - angleA - angleB);

  // Recalculate A and B based on C if needed (handles edge case where sliders cause A+B > 179)
  // This is a derived state adjustment based on the calculated C
  const currentAngleA = (180 - angleB - angleC >= 1) ? angleA : Math.max(1, 179 - angleB);
  const currentAngleB = (180 - currentAngleA - angleC >= 1) ? angleB : Math.max(1, 179 - currentAngleA);


  // Handlers need to ensure the *other* angle remains valid
  const handleAngleAChange = (event) => {
    let newAngleA = parseInt(event.target.value, 10);
    if (newAngleA < 1) newAngleA = 1;
    // Allow setting A up to 178, let B adjust
    const maxA = 178; // Max value for A slider
    if(newAngleA > maxA) newAngleA = maxA;

    setAngleA(newAngleA);
    // Adjust B if the sum would be too large (A + B > 178 allows C=1)
    if (newAngleA + currentAngleB > 179) {
        setAngleB(Math.max(1, 179 - newAngleA));
    }
  };

  const handleAngleBChange = (event) => {
    let newAngleB = parseInt(event.target.value, 10);
     if (newAngleB < 1) newAngleB = 1;
    // Allow setting B up to 178, let A adjust
    const maxB = 178; // Max value for B slider
     if(newAngleB > maxB) newAngleB = maxB;

    setAngleB(newAngleB);
    // Adjust A if the sum would be too large
    if (currentAngleA + newAngleB > 179) {
        setAngleA(Math.max(1, 179 - newAngleB));
    }
  };


  // Use the possibly adjusted angles for calculation
  const finalAngleC = Math.max(1, 180 - currentAngleA - currentAngleB);
  const triangleData = useMemo(() => {
     return calculateTrianglePoints(currentAngleA, currentAngleB, finalAngleC);
  }, [currentAngleA, currentAngleB, finalAngleC]); // Depend on adjusted angles

  const totalAngle = currentAngleA + currentAngleB + finalAngleC;

  return (
    // Add the 'card' utility class for styling defined in index.css
    <div className="angle-sum-lesson card">
      <h2>Lesson 1: Sum of Angles = 180°</h2>
      <p>A Triangle's three angles always add up to 180 degrees. Adjust the sliders and watch the magic happen!</p>

      <div className="lesson-interactive-area">
        {/* Controls Section */}
        <div className="lesson-controls">
          <div className="control-group">
            <label htmlFor="angleA">Angle A</label>
            <input
              type="range" id="angleA" name="angleA"
              min="1" max="178" // Max allows B and C to be at least 1
              value={currentAngleA} // Display the adjusted value
              onChange={handleAngleAChange}
            />
            <span className="control-value">{currentAngleA}°</span>
          </div>

          <div className="control-group">
            <label htmlFor="angleB">Angle B</label>
            <input
              type="range" id="angleB" name="angleB"
              min="1" max="178"
              value={currentAngleB} // Display the adjusted value
              onChange={handleAngleBChange}
            />
            <span className="control-value">{currentAngleB}°</span>
          </div>

          {/* Results Display */}
          <div className="lesson-results">
            <p>Calculated Angle C: <span className="calculated-value">{finalAngleC.toFixed(0)}°</span></p>
            <h3 className="total-sum">{currentAngleA}° + {currentAngleB}° + {finalAngleC.toFixed(0)}° = {totalAngle.toFixed(0)}°</h3>
          </div>
        </div>

        {/* Visualization Section */}
        <div className="lesson-visual">
          <svg viewBox={triangleData.viewBox} preserveAspectRatio="xMidYMid meet">
            <polygon
              className="visual-triangle"
              points={`${triangleData.A.x},${triangleData.A.y} ${triangleData.B.x},${triangleData.B.y} ${triangleData.C.x},${triangleData.C.y}`}
            />
            {/* Use textAnchor dynamically from triangleData */}
            <text className="visual-text" x={triangleData.labelA.x} y={triangleData.labelA.y} textAnchor={triangleData.labelA.anchor}>A:{currentAngleA}°</text>
            <text className="visual-text" x={triangleData.labelB.x} y={triangleData.labelB.y} textAnchor={triangleData.labelB.anchor}>B:{currentAngleB}°</text>
            <text className="visual-text" x={triangleData.labelC.x} y={triangleData.labelC.y} textAnchor={triangleData.labelC.anchor}>C:{finalAngleC.toFixed(0)}°</text>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default AngleSumLesson;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos