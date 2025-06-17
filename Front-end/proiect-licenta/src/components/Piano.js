import React, { useState, useCallback, useEffect } from 'react';
import './Piano.css';

const keys = [
    { note: 'C4', key: 'z', isSharp: false },
    { note: 'Cs4', key: 's', isSharp: true },
    { note: 'D4', key: 'x', isSharp: false },
    { note: 'Ds4', key: 'd', isSharp: true },
    { note: 'E4', key: 'c', isSharp: false },
    { note: 'F4', key: 'v', isSharp: false },
    { note: 'Fs4', key: 'g', isSharp: true },
    { note: 'G4', key: 'b', isSharp: false },
    { note: 'Gs4', key: 'h', isSharp: true },
    { note: 'A4', key: 'n', isSharp: false },
    { note: 'As4', key: 'j', isSharp: true },
    { note: 'B4', key: 'm', isSharp: false },
    { note: 'C5', key: 'y', isSharp: false },
    { note: 'Cs5', key: '7', isSharp: true },
    { note: 'D5', key: 'u', isSharp: false },
    { note: 'Ds5', key: '8', isSharp: true },
    { note: 'E5', key: 'i', isSharp: false },
    { note: 'F5', key: 'o', isSharp: false },
    { note: 'Fs5', key: '0', isSharp: true },
    { note: 'G5', key: 'p', isSharp: false },
    { note: 'Gs5', key: '-', isSharp: true },
    { note: 'A5', key: '[', isSharp: false },
    { note: 'As5', key: '=', isSharp: true },
    { note: 'B5', key: ']', isSharp: false }
];

const Piano = ({ mode, wave, audioCtx, adsrSettings, masterGain, highlightedNotes = [], onKeyPress, showNote, showKey }) => {
    const samples = {};
    keys.forEach(({ note }) => {
        samples[note] = new Audio(`sounds/${note}.mp3`);
    });
    const [pressedKeys, setPressedKeys] = useState([]);

    const playOscillator = (freq) => {
        const { attack, decay, sustain, release, volume } = adsrSettings;
        
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();


        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + attack);
        gain.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);
        gain.gain.linearRampToValueAtTime(0, now + attack + decay + release);

        osc.type = wave;
        osc.frequency.value = freq;

        osc.connect(gain);
        gain.connect(masterGain);
        osc.start(now);
        osc.stop(now + attack + decay + release + 0.1);

        osc.onended = () => {
            osc.disconnect();
            gain.disconnect();
        };
        
    };

    const getFrequency = (note) => {
        const noteOrder = ['C', 'Cs', 'D', 'Ds', 'E', 'F', 'Fs', 'G', 'Gs', 'A', 'As', 'B'];

        const match = note.match(/^([A-G]s?)(\d)$/);
        if (!match) return null;

        const [, pitch, octave] = match;
        const semitoneIndex = noteOrder.indexOf(pitch);
        if (semitoneIndex === -1) return null;

        const midiNumber = (parseInt(octave, 10) + 1) * 12 + semitoneIndex;

        return 440 * Math.pow(2, (midiNumber - 69) / 12);

        /*const noteFrequencies = {
        'C4': 261.63,
        'Cs4': 277.18,
        'D4': 293.66,
        'Ds4': 311.13,
        'E4': 329.63,
        'F4': 349.23,
        'Fs4': 369.99,
        'G4': 392.00,
        'Gs4': 415.30,
        'A4': 440.00,
        'As4': 466.16,
        'B4': 493.88,
        'C5': 523.25,
        'Cs5': 554.37,
        'D5': 587.33,
        'Ds5': 622.25,
        'E5': 659.26,
        'F5': 698.46,
        'Fs5': 739.99,
        'G5': 783.99,
        'Gs5': 830.61,
        'A5': 880.00,
        'As5': 932.33,
        'B5': 987.77,
        };

        
        return noteFrequencies[note];*/
    };

    const handlePlay = useCallback((note) => {
        setPressedKeys((prev) => [...prev, note]);

        if (onKeyPress) {onKeyPress(note);
            console.log(note);
        }

        if (mode === 'oscillator') {
        playOscillator(getFrequency(note));
        } 
        else {
           
            const audio = samples[note];

            if (audio) {
                
                const original = samples[note];
                const audio = original.cloneNode();
                const source = audioCtx.createMediaElementSource(audio);
                source.connect(masterGain);
                audio.play();   
            }
        }

        setTimeout(() => {
            setPressedKeys((prev) => prev.filter((k) => k !== note));
        }, 1000);
    },[mode, playOscillator]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.repeat) return;

            const key = keys.find(k => k.key === e.key);

            if (key) {
                handlePlay(key.note);
                setPressedKeys((prev) => {
                    if (!prev.includes(key.note)) {
                    return [...prev, key.note];
                    }
                    return prev;
                });
            }
        };

        const handleKeyUp = (e) => {
            const key = keys.find(k => k.key === e.key);
            if (key) {
            setPressedKeys((prev) => prev.filter((k) => k !== key.note));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }

    }, [handlePlay, keys, mode]);

    return (
        <div className="piano">
        {keys.map(({ note, key : keyboardKey, isSharp }) => {
            const isHighlighted = highlightedNotes && highlightedNotes.length > 0 && highlightedNotes.includes(note);
            const highlightGroupIndex = highlightedNotes.findIndex(group => group.includes(note));
            console.log(highlightedNotes);
            const isPressed = pressedKeys.includes(note);
            return (
                <button
                    key={note}
                    onMouseDown={() => handlePlay(note)}
                    className={`key ${isSharp ? 'key sharp' : 'key'} ${highlightGroupIndex !== -1 ? `highlight-${highlightGroupIndex}` : ''} ${isPressed ? 'pressed' : ''}`}
                >
                {showNote && note}
                {showKey && keyboardKey}
                </button>
            );
        })}
        </div>
    );
};

export default Piano;
