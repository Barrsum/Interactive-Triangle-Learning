// src/components/lessons/HeronsFormulaLesson.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { FaSlidersH, FaKeyboard } from 'react-icons/fa';
import './HeronsFormulaLesson.css';

// --- Helper Functions ---
const isPositiveNumber = (value) => {
  const num = parseFloat(value);
  return !isNaN(num) && num > 0;
};

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

// Triangle Inequality Theorem check
const isValidTriangle = (a, b, c) => {
  // Ensure they are numbers greater than 0 before checking inequality
  if (!(isPositiveNumber(a) && isPositiveNumber(b) && isPositiveNumber(c))) {
    return false;
  }
  // Add a small tolerance for floating point comparisons if needed, but usually direct comparison is fine
  const tol = 1e-9;
  return (a + b > c + tol) && (a + c > b + tol) && (b + c > a + tol);
};

// Calculates triangle coordinates and BOTH vertex AND side label positions
const calculateTriangleCoords = (a, b, c, svgWidth, svgHeight, padding) => {
    // Check for valid sides early
    if (!isValidTriangle(a, b, c)) {
       return null;
    }

    const maxVisDimension = Math.min(svgWidth, svgHeight) - 2 * padding;
    const maxSide = Math.max(a, b, c);
    const scaleFactor = maxVisDimension / maxSide;

    // Scaled side lengths
    const sA = a * scaleFactor; const sB = b * scaleFactor; const sC = c * scaleFactor;

    // Vertices (A: bottom-left, B: bottom-right, C: top)
    const pAx = padding; const pAy = svgHeight - padding;
    const pBx = padding + sC; const pBy = pAy;

    const cosAngleA = clamp((sB * sB + sC * sC - sA * sA) / (2 * sB * sC), -1, 1);
    const angleA_rad = Math.acos(cosAngleA);
    const pCx = pAx + sB * Math.cos(angleA_rad);
    const pCy = pAy - sB * Math.sin(angleA_rad);

    // Vertex Label Positions
    const vertexLabelOffset = 15;
    const labelAx = pAx - vertexLabelOffset * 0.7; const labelAy = pAy + vertexLabelOffset * 0.7;
    const labelBx = pBx + vertexLabelOffset * 0.7; const labelBy = pBy + vertexLabelOffset * 0.7;
    const labelCx = pCx; const labelCy = pCy - vertexLabelOffset;

    // --- Side Label Positions ---
    const sideLabelOffset = 10;

    // Side c (Base AB)
    const midABx = (pAx + pBx) / 2; const midABy = pAy;
    const labelSideCx = midABx; const labelSideCy = midABy + sideLabelOffset * 1.2;

    // Side b (Side AC)
    const midACx = (pAx + pCx) / 2; const midACy = (pAy + pCy) / 2;
    let dxAC = pCx - pAx; let dyAC = pCy - pAy;
    let lenAC = Math.sqrt(dxAC * dxAC + dyAC * dyAC) || 1; // Avoid division by zero
    let nxAC = -dyAC / lenAC; let nyAC = dxAC / lenAC;
    const labelSideBx = midACx + nxAC * sideLabelOffset;
    const labelSideBy = midACy + nyAC * sideLabelOffset;
    let angleAC = Math.atan2(dyAC, dxAC) * (180 / Math.PI);
    // --- Adjustment for side b label ---
    if (angleAC > 90 || angleAC < -90) { // Check if upside down
        angleAC += 180;
    }

    // Side a (Side BC)
    const midBCx = (pBx + pCx) / 2; const midBCy = (pBy + pCy) / 2;
    let dxBC = pCx - pBx; let dyBC = pCy - pBy;
    let lenBC = Math.sqrt(dxBC * dxBC + dyBC * dyBC) || 1; // Avoid division by zero
    let nxBC = -dyBC / lenBC; let nyBC = dxBC / lenBC;
    const labelSideAx = midBCx + nxBC * sideLabelOffset;
    const labelSideAy = midBCy + nyBC * sideLabelOffset;
    let angleBC = Math.atan2(dyBC, dxBC) * (180 / Math.PI);
    // --- Adjustment for side a label --- // <<< MODIFICATION HERE
    if (angleBC > 90 || angleBC < -90) { // Check if text angle points mostly down/left
        angleBC += 180; // Add 180 degrees to flip it upright
    }
    // --- End Modification --- //

    return {
        A: { x: pAx, y: pAy }, B: { x: pBx, y: pBy }, C: { x: pCx, y: pCy },
        vertexLabels: {
            A: { x: labelAx, y: labelAy, anchor: 'end' },
            B: { x: labelBx, y: labelBy, anchor: 'start' },
            C: { x: labelCx, y: labelCy, anchor: 'middle' },
        },
        sideLabels: {
            a: { x: labelSideAx, y: labelSideAy, rotation: angleBC }, // Use potentially adjusted angle
            b: { x: labelSideBx, y: labelSideBy, rotation: angleAC }, // Use potentially adjusted angle
            c: { x: labelSideCx, y: labelSideCy, rotation: 0 },
        }
    };
};


// --- Component ---
function HeronsFormulaLesson() {
  // State for sides
  const [sideA, setSideA] = useState(50);
  const [sideB, setSideB] = useState(60);
  const [sideC, setSideC] = useState(70);

  // State for input mode
  const [inputMode, setInputMode] = useState('slider');

  // --- Input Validation ---
  const numA = useMemo(() => parseFloat(sideA), [sideA]);
  const numB = useMemo(() => parseFloat(sideB), [sideB]);
  const numC = useMemo(() => parseFloat(sideC), [sideC]);

  const allSidesValidNumbers = useMemo(() =>
    isPositiveNumber(numA) && isPositiveNumber(numB) && isPositiveNumber(numC),
    [numA, numB, numC]);

  // Check Triangle Inequality
  const canFormTriangle = useMemo(() => {
    if (!allSidesValidNumbers) return false;
    return isValidTriangle(numA, numB, numC);
  }, [numA, numB, numC, allSidesValidNumbers]);

  const validationError = useMemo(() => {
      const hasInput = sideA !== '' || sideB !== '' || sideC !== '';
      if (!hasInput) return null;
      if (!allSidesValidNumbers) return "Please enter positive numbers for all sides.";
      if (!canFormTriangle) return "These side lengths cannot form a valid triangle (Triangle Inequality fails: a + b > c, etc.).";
      return null; // No error
  }, [sideA, sideB, sideC, allSidesValidNumbers, canFormTriangle]);


  // --- Calculations ---
  const semiPerimeter = useMemo(() => {
    if (!canFormTriangle) return NaN;
    return (numA + numB + numC) / 2;
  }, [numA, numB, numC, canFormTriangle]);

  const area = useMemo(() => {
    if (!canFormTriangle) return NaN;
    const s = semiPerimeter;
    const radicand = s * (s - numA) * (s - numB) * (s - numC);
    return Math.sqrt(Math.max(0, radicand)); // Prevent sqrt(<0) from floating point errors
  }, [numA, numB, numC, semiPerimeter, canFormTriangle]);

  const semiPerimeterFormatted = canFormTriangle ? semiPerimeter.toFixed(2) : '---';
  const areaFormatted = canFormTriangle ? area.toFixed(2) : '---';

  // --- SVG Visualization ---
  const svgWidth = 320;
  const svgHeight = 200;
  const padding = 25; // Increased padding slightly for labels

  const triangleCoords = useMemo(() => {
    if (!canFormTriangle) return null;
    // Pass current valid numbers
    return calculateTriangleCoords(numA, numB, numC, svgWidth, svgHeight, padding);
  }, [numA, numB, numC, canFormTriangle]); // Removed width/height/padding


  // --- Handlers ---
  const handleInputChange = useCallback((e, sideSetter) => {
      sideSetter(e.target.value);
  }, []);

  const handleSliderChange = useCallback((e, sideSetter) => {
      sideSetter(parseInt(e.target.value, 10));
  }, []);

  const toggleInputMode = useCallback(() => {
    setInputMode(prevMode => {
      const newMode = prevMode === 'slider' ? 'number' : 'slider';
      if (newMode === 'slider') {
        setSideA(clamp(parseFloat(sideA) || 50, 1, 100));
        setSideB(clamp(parseFloat(sideB) || 60, 1, 100));
        setSideC(clamp(parseFloat(sideC) || 70, 1, 100));
      }
      return newMode;
    });
  }, [sideA, sideB, sideC]);

  const sliderValueA = inputMode === 'slider' ? clamp(parseFloat(sideA) || 1, 1, 100) : sideA;
  const sliderValueB = inputMode === 'slider' ? clamp(parseFloat(sideB) || 1, 1, 100) : sideB;
  const sliderValueC = inputMode === 'slider' ? clamp(parseFloat(sideC) || 1, 1, 100) : sideC;


  return (
    <div className="herons-formula-lesson card">
      <h2>Lesson 3: Heron's Formula</h2>
      <p>
        Find the area of <strong>any triangle</strong> if you know the lengths of its three sides (a, b, c).
        First, calculate the semi-perimeter (s), which is half the perimeter.
      </p>
      <p className="formula semi-perimeter-formula">s = (a + b + c) / 2</p>
      <p>Then, use Heron's Formula for the area:</p>
      <p className="formula area-formula">Area = √[ s(s - a)(s - b)(s - c) ]</p>

       <div className="lesson-interactive-area">
         {/* --- Controls Section --- */}
        <div className="lesson-controls">
           <button onClick={toggleInputMode} className="input-mode-toggle" title={`Switch to ${inputMode === 'slider' ? 'Number Input' : 'Slider Input'}`}>
            {inputMode === 'slider' ? <><FaKeyboard /> Switch to Numbers</> : <><FaSlidersH /> Switch to Sliders</>}
          </button>
          <p className='input-mode-label'>
             Input Mode: {inputMode === 'slider' ? 'Sliders (1-100)' : 'Number Input'}
          </p>

          {/* --- Conditional Inputs --- */}
          {inputMode === 'slider' ? (
            <div className="slider-controls">
              {/* Slider A */}
              <div className="control-group slider-group">
                <label htmlFor="sliderHeronA">Side a:</label>
                <input type="range" id="sliderHeronA" min="1" max="100" value={sliderValueA} onChange={(e) => handleSliderChange(e, setSideA)} />
                <span className="control-value">{sliderValueA}</span>
              </div>
               {/* Slider B */}
              <div className="control-group slider-group">
                <label htmlFor="sliderHeronB">Side b:</label>
                <input type="range" id="sliderHeronB" min="1" max="100" value={sliderValueB} onChange={(e) => handleSliderChange(e, setSideB)} />
                <span className="control-value">{sliderValueB}</span>
              </div>
               {/* Slider C */}
              <div className="control-group slider-group">
                <label htmlFor="sliderHeronC">Side c:</label>
                <input type="range" id="sliderHeronC" min="1" max="100" value={sliderValueC} onChange={(e) => handleSliderChange(e, setSideC)} />
                <span className="control-value">{sliderValueC}</span>
              </div>
            </div>
          ) : (
             <div className="number-controls">
               {/* Number A */}
               <div className="control-group number-group">
                  <label htmlFor="numHeronA">Side a:</label>
                  <input type="number" id="numHeronA" value={sideA} onChange={(e) => handleInputChange(e, setSideA)} min="0" step="any" placeholder="e.g., 5" className={!isValidA && sideA !== '' ? 'input-error' : ''}/>
               </div>
               {/* Number B */}
                <div className="control-group number-group">
                  <label htmlFor="numHeronB">Side b:</label>
                  <input type="number" id="numHeronB" value={sideB} onChange={(e) => handleInputChange(e, setSideB)} min="0" step="any" placeholder="e.g., 6" className={!isValidB && sideB !== '' ? 'input-error' : ''}/>
               </div>
               {/* Number C */}
               <div className="control-group number-group">
                  <label htmlFor="numHeronC">Side c:</label>
                  <input type="number" id="numHeronC" value={sideC} onChange={(e) => handleInputChange(e, setSideC)} min="0" step="any" placeholder="e.g., 7" className={!isValidC && sideC !== '' ? 'input-error' : ''}/>
               </div>
            </div>
          )}
          {/* --- End Conditional Inputs --- */}

           {/* Validation Error Display */}
          {validationError && (
              <p className="error-message">{validationError}</p>
          )}

          {/* --- Results Display --- */}
          <div className="lesson-results">
             <h4>Calculations:</h4>
             <p>Semi-perimeter (s): <span className="highlight calculated-value">{semiPerimeterFormatted}</span></p>
             {/* Show detailed formula only if valid */}
             {canFormTriangle && (
                 <p className="area-result">
                    Area = √[{semiPerimeterFormatted}({semiPerimeterFormatted} - {numA?.toFixed(1)})({semiPerimeterFormatted} - {numB?.toFixed(1)})({semiPerimeterFormatted} - {numC?.toFixed(1)})]
                 </p>
              )}
             <p className="area-result final-area">
                Calculated Area ≈ <span className="highlight calculated-value">{areaFormatted}</span>
             </p>
          </div>

        </div> {/* End lesson-controls */}

         {/* --- Visualization Section --- */}
         <div className="lesson-visual">
           <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="xMidYMid meet">
              {/* --- Render Triangle and Labels ONLY if coords are valid --- */}
              {triangleCoords ? (
                 <>
                  {/* Triangle Polygon */}
                  <polygon
                      className="visual-triangle"
                      points={`${triangleCoords.A.x},${triangleCoords.A.y} ${triangleCoords.B.x},${triangleCoords.B.y} ${triangleCoords.C.x},${triangleCoords.C.y}`}
                  />

                  {/* Vertex Labels */}
                  <text
                      x={triangleCoords.vertexLabels.A.x}
                      y={triangleCoords.vertexLabels.A.y}
                      className="visual-text vertex-label"
                      textAnchor={triangleCoords.vertexLabels.A.anchor}
                      dominantBaseline="hanging"
                  > A </text>
                  <text
                      x={triangleCoords.vertexLabels.B.x}
                      y={triangleCoords.vertexLabels.B.y}
                      className="visual-text vertex-label"
                      textAnchor={triangleCoords.vertexLabels.B.anchor}
                      dominantBaseline="hanging"
                  > B </text>
                  <text
                      x={triangleCoords.vertexLabels.C.x}
                      y={triangleCoords.vertexLabels.C.y}
                      className="visual-text vertex-label"
                      textAnchor={triangleCoords.vertexLabels.C.anchor}
                      dominantBaseline="auto"
                  > C </text>

                  {/* Side Length Labels */}
                   <text
                      x={triangleCoords.sideLabels.a.x}
                      y={triangleCoords.sideLabels.a.y}
                      className="visual-text side-label"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${triangleCoords.sideLabels.a.rotation} ${triangleCoords.sideLabels.a.x} ${triangleCoords.sideLabels.a.y})`}
                   >
                     a = {numA?.toFixed(1)}
                   </text>
                   <text
                      x={triangleCoords.sideLabels.b.x}
                      y={triangleCoords.sideLabels.b.y}
                      className="visual-text side-label"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${triangleCoords.sideLabels.b.rotation} ${triangleCoords.sideLabels.b.x} ${triangleCoords.sideLabels.b.y})`}
                   >
                     b = {numB?.toFixed(1)}
                   </text>
                   <text
                      x={triangleCoords.sideLabels.c.x}
                      y={triangleCoords.sideLabels.c.y}
                      className="visual-text side-label"
                      textAnchor="middle"
                      dominantBaseline="hanging"
                      transform={`rotate(${triangleCoords.sideLabels.c.rotation} ${triangleCoords.sideLabels.c.x} ${triangleCoords.sideLabels.c.y})`}
                   >
                     c = {numC?.toFixed(1)}
                   </text>
                 </>
              ) : (
                 // --- Placeholder Text when coords are null ---
                 <text x={svgWidth / 2} y={svgHeight / 2} textAnchor="middle" className="visual-text placeholder-text">
                   {validationError ? "Cannot draw triangle" : "Enter valid side lengths"}
                 </text>
              )}
           </svg>
           {/* Display text error below SVG ONLY if validation fails */}
           {!triangleCoords && validationError && (
              <p className="visual-error-text">{validationError}</p>
           )}
         </div> {/* End lesson-visual */}

       </div> {/* End lesson-interactive-area */}
    </div> // End herons-formula-lesson
  );
}

export default HeronsFormulaLesson;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos