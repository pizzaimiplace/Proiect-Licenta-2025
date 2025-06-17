import React, { useEffect, useState, useRef } from 'react';

const Metronome = ({ audioCtx }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const intervalRef = useRef(null);

  const clickSound = new Audio('/sounds/met.mp3');

  const playClick = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = (60 / bpm) * 1000;
      playClick();
      intervalRef.current = setInterval(playClick, interval);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm]);

  return (
    <div className="metronome">
      <h3>Metronome</h3>
      <label>BPM: </label>
      <input
        type="number"
        min="40"
        max="340"
        value={bpm}
        onChange={(e) => setBpm(parseInt(e.target.value))}
      />
      <button onClick={() => setIsPlaying(prev => !prev)}>
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

export default Metronome;
