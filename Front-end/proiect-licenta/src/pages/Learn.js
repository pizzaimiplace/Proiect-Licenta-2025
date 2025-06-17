import React, { useState, useEffect, useRef } from 'react';
import Piano from '../components/Piano';
import './Learn.css';


const lessonOne = {
    'None' : [],
    'White Keys' : [['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5']],
    'Black Keys' : [['Cs4', 'Ds4', 'Fs4', 'Gs4', 'As4', 'Cs5', 'Ds5', 'Fs5', 'Gs5', 'As5']],
    'Octaves' : [['C4', 'Cs4', 'D4', 'Ds4', 'E4', 'F4', 'Fs4', 'G4', 'Gs4', 'A4', 'As4', 'B4'], ['C5', 'Cs5', 'D5', 'Ds5', 'E5', 'F5', 'Fs5', 'G5', 'Gs5', 'A5', 'As5', 'B5']],
    'NotesAcrossOctaves' : [['C4'], ['C5']],
    'NaturalFirstOc' :  [['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4']],
    'SharpFirstOc' : [['Cs4', 'Ds4', 'Fs4', 'Gs4', 'As4']]
}

const Learn = () => {
    const [showNotes, setShowNotes] = useState(false);
    const [showKeys, setShowKeys] = useState(false);
    const [selectedHighlight, setSelectedHighlight] = useState('None');
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

    const dialogue = [
        "Welcome to your first music theory lesson!",
        "Today I will teach you the basics! Let's start.",
        "The white notes are called Natural notes",
        "The black notes are called Sharp notes",
        "As you can see, this piano has 24 notes.",
        "That's because this piano has 2 octaves, as highlighted below!",
        "The notes of each octave are exactly the same, but the frequency is doubled.",
        "Try pressing the same key of each octave, to do that press 'Z' and 'Y'",
        "Also, keep in mind that the difference between the same key on 2 consecutive octaves is always 12 notes, neat trick!",
        "Perfect! As you've seen, each key is binded to a button on your keyboard",
        "Buttons from 'Z' to 'M' represent the natural notes of the first octave",
        "Buttons from 'S' to 'J' represent the sharp notes of the first octave",
        "Same principle applies for the second octave, 'Y' through ']', respectively '7' to '='",
        "Try singing all the notes of the first octave!",
        "Great, you're done with the first lesson, now it's Quiz Time!",
        "That's not right, try again!"
    ];

    const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
    const keySequenceRef = useRef([]);

    const handleKeyPress = (note) => {
        if (currentDialogueIndex === 7) {
            keySequenceRef.current.push(note);
            if (keySequenceRef.current.length > 2) {
                keySequenceRef.current.shift();
            }
            const [first, second] = keySequenceRef.current;
            {
                if (first === 'C4' && second === 'C5') {
                    setCurrentDialogueIndex(8);
                    keySequenceRef.current = [];
                }
            }
        }
        if (currentDialogueIndex === 13) {
            const Octave4 = ['C4', 'Cs4', 'D4', 'Ds4', 'E4', 'F4', 'Fs4', 'G4', 'Gs4', 'A4', 'As4', 'B4'];

            if (!keySequenceRef.current.includes(note) && Octave4.includes(note)) {
                keySequenceRef.current.push(note);
            }

            const allNotesPlayed = Octave4.every(n => keySequenceRef.current.includes(n));
            if (allNotesPlayed) {
                setCurrentDialogueIndex((prev) => prev + 1);
                keySequenceRef.current = [];
            }
        }
    };


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

    useEffect(() => {
        const handleButton = (e) => {
            setCurrentDialogueIndex((prev) => {
                if (prev === 7) return prev;
                return (prev + 1) % dialogue.length;
            });
        };

        document.addEventListener('click', handleButton);
        return () => {
            document.removeEventListener('click', handleButton);
        };
    }, [dialogue.length]);

    useEffect(() => {
        if (currentDialogueIndex === 2) {
            setSelectedHighlight('White Keys');
        } else if (currentDialogueIndex === 3) {
            setSelectedHighlight('Black Keys');
        } else if (currentDialogueIndex === 5) {
            setSelectedHighlight('Octaves');
        } else if (currentDialogueIndex === 7) {
            setSelectedHighlight('NotesAcrossOctaves');
        } else if (currentDialogueIndex === 9) {
            setShowKeys(true);
        } else {
            setSelectedHighlight('None');
        }
    }, [currentDialogueIndex]);


    return (
        <div className="learn">
            <div className="learn-text">{dialogue[currentDialogueIndex]}</div>
            {audioCtx && masterGain.current && (
                <Piano
                mode={mode}
                wave={wave}
                audioCtx={audioCtx}
                adsrSettings={adsr}
                masterGain={masterGain.current}
                highlightedNotes={lessonOne[selectedHighlight]}
                onKeyPress={handleKeyPress}
                showNote={showNotes}
                showKey={showKeys}
                />
            )}   
        </div>
    );
};

export default Learn;