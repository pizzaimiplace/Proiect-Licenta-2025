import React, { useState, useEffect, useRef } from 'react';
import Piano from '../components/Piano';
import ADSRControls from '../components/ADSRControls';
import Recorder from '../components/Recorder';
import Metronome from '../components/Metronome';
import './PlayPiano.css';

const scales = {
  'None': [],

  'C Major':  [['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']],
  'C# Major': [['Cs4', 'Ds4', 'Fs4', 'Fs4', 'Gs4', 'As4', 'Cs5']],
  'D Major':  [['D4', 'E4', 'Fs4', 'G4', 'A4', 'B4', 'Cs5']],
  'D# Major': [['Ds4', 'Fs4', 'Gs4', 'As4', 'As4', 'Cs5', 'Ds5']], 
  'E Major':  [['E4', 'Fs4', 'Gs4', 'A4', 'B4', 'Cs5', 'Ds5']],
  'F Major':  [['F4', 'G4', 'A4', 'As4', 'C5', 'D5', 'E5']],
  'F# Major': [['Fs4', 'Gs4', 'As4', 'B4', 'Cs5', 'Ds5', 'Fs5']],
  'G Major':  [['G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'Fs5']],
  'G# Major': [['Gs4', 'As4', 'Cs5', 'Cs5', 'Ds5', 'Fs5', 'Gs5']],
  'A Major':  [['A4', 'B4', 'Cs5', 'D5', 'E5', 'Fs5', 'Gs5']],
  'A# Major': [['As4', 'Cs5', 'Ds5', 'Ds5', 'Fs5', 'Gs5', 'As5']],
  'B Major':  [['B4', 'Cs5', 'Ds5', 'E5', 'Fs5', 'Gs5', 'As5']],

  'C Minor':  [['C4', 'D4', 'Ds4', 'F4', 'G4', 'Gs4', 'As4']],
  'C# Minor': [['Cs4', 'Ds4', 'E4', 'Fs4', 'Gs4', 'A4', 'B4']],
  'D Minor':  [['D4', 'E4', 'Fs4', 'G4', 'A4', 'As4', 'C5']],
  'D# Minor': [['Ds4', 'Fs4', 'G4', 'Gs4', 'As4', 'B4', 'Cs5']],
  'E Minor':  [['E4', 'Fs4', 'Gs4', 'A4', 'B4', 'C5', 'D5']],
  'F Minor':  [['F4', 'G4', 'Gs4', 'As4', 'C5', 'Cs5', 'Ds5']],
  'F# Minor': [['Fs4', 'Gs4', 'A4', 'B4', 'Cs5', 'D5', 'E5']],
  'G Minor':  [['G4', 'A4', 'As4', 'C5', 'D5', 'Ds5', 'F5']],
  'G# Minor': [['Gs4', 'As4', 'B4', 'Cs5', 'Ds5', 'E5', 'Fs5']],
  'A Minor':  [['A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5']],
  'A# Minor': [['As4', 'Cs5', 'Cs5', 'Ds5', 'E5', 'F5', 'Gs5']],
  'B Minor':  [['B4', 'Cs5', 'D5', 'E5', 'Fs5', 'G5', 'A5']],
};



const PlayPiano = () => {
  const [selectedScale, setSelectedScale] = useState('None');
  const [mode, setMode] = useState('oscillator');
  const [wave, setWave] = useState('sine');
  const [adsr, setAdsr] = useState({
    attack: 0,
    decay: 0.2,
    sustain: 0.5,
    release: 0.5,
    volume: 0.3
  });

  const [audioCtx, setAudioCtx] = useState(null);

  const masterGain = useRef(null);
  const mediaStreamDest = useRef(null);


  useEffect(() => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const gain = ctx.createGain();
    const dest = ctx.createMediaStreamDestination();

    gain.connect(ctx.destination);
    gain.connect(dest);

    setAudioCtx(ctx);
    masterGain.current = gain;
    mediaStreamDest.current = dest;
  }, []);

  return (
    <div className="playpiano">
      <div className="wrapper">
        <div className="scale-container">
          <label htmlFor="scale-select">Select Scale:</label>
          <select
            id="scale-select"
            value={selectedScale}
            onChange={(e) => setSelectedScale(e.target.value)}
          >
            {Object.keys(scales).map((scaleName) => (
                <option key={scaleName} value={scaleName}>
                  {scaleName}
                </option>
            ))}
          </select>
        </div>
        <div className="mode-container">
          <label>Mode:</label>
          <select onChange={(e) => setMode(e.target.value)} value={mode}>
            <option value="oscillator">Oscillator</option>
            <option value="samples">Samples</option>
          </select>
        </div>
      </div>

      {mode === 'oscillator' && (
        <ADSRControls adsr={adsr} setAdsr={setAdsr} wave={wave} setWave={setWave} />
      )}

      {audioCtx && masterGain.current && (
        <Piano
          mode={mode}
          wave={wave}
          audioCtx={audioCtx}
          adsrSettings={adsr}
          masterGain={masterGain.current}
          highlightedNotes={scales[selectedScale]}
          showNote={true}
          showKey={false}
        />
      )}
      <div className='playpiano-wrapper'>      
        {audioCtx && <Metronome audioCtx={audioCtx} />}

        {audioCtx && masterGain.current && (
          <Recorder audioCtx={audioCtx} masterGain={masterGain.current} />
        )}
      </div>
    </div>
  );
};

export default PlayPiano;
