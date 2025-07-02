import React from 'react';
import './ADSRControls.css';

const ADSRControls = ({ adsr, setAdsr, wave, setWave}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdsr(prev => ({ ...prev, [name]: parseFloat(value) }));
  };

  return (
    <div className="adsr-controls">
      {['attack', 'decay', 'sustain', 'release', 'volume'].map(param => (
          <label key={param}>{param.toUpperCase()}:
          <input
            type="range"
            min="0"
            max="2"
            step="0.01"
            name={param}
            value={adsr[param]}
            onChange={handleChange}
          />
          </label>
      ))}
      <div className="wave-container">
        <label>Wave:</label>
        <select onChange={(e) => setWave(e.target.value)} value={wave}>
          <option value="sine">Sine</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triange</option>
        </select>
      </div>
    </div>
  );
};

export default ADSRControls;
