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
    const [lessonData, setLessonData] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

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
        const currentScreen = lessonData?.screens[currentIndex];
        const task = currentScreen?.task;
        const condition = task?.condition;

        if (!task || !task.notes || !condition) return;

        const flattenedNotes = task.notes.flat();

        if (condition.ordered && !condition.chord) {
            keySequenceRef.current.push(note);
            if (keySequenceRef.current.length > 2) keySequenceRef.current.shift();

            const [first, second] = keySequenceRef.current;
            const [expected1, expected2] = flattenedNotes;

            if (first === expected1 && second === expected2) {
                setCurrentIndex((prev) => prev + 1);
                keySequenceRef.current = [];
            }
        } else if (
            condition.ordered === false &&
            condition.consecutive === false &&
            condition.allow_mistakes === true
        ) {
            if (flattenedNotes.includes(note) && !keySequenceRef.current.includes(note)) {
                keySequenceRef.current.push(note);
            }

            const allPlayed = flattenedNotes.every(n => keySequenceRef.current.includes(n));

            if (allPlayed) {
                setCurrentIndex((prev) => prev + 1);
                keySequenceRef.current = [];
            }
        }
    };


    useEffect(() => {
        fetch('http://localhost:8000/api/courses/8/lessons/1/')
            .then(res => res.json())
            .then(data => setLessonData(data))
            .catch(err => console.error("Error lesson fetch:", err));
    }, []);


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

    const advanceDialogue = () => {
        setCurrentIndex((prev) => {
            const next = prev + 1;
            return next < (lessonData?.screens.length || 0) ? next : prev;
        });
    };

    useEffect(() => {
        const handleClick = () => {
            const currentScreen = lessonData?.screens[currentIndex];
            if (!currentScreen?.play_piano) {
                advanceDialogue();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [lessonData, currentIndex]);

    console.log('lessonData:', lessonData);
    console.log('lessonData keys:', lessonData ? Object.keys(lessonData) : 'lessonData is null');
  console.log('currentIndex:', currentIndex);
  console.log('screens:', lessonData?.screens);
  console.log('currentScreen:', lessonData?.screens ? lessonData.screens[currentIndex] : null);

    const currentScreen = lessonData?.screens ? lessonData.screens[currentIndex] : null;
    const highlightedNotes = currentScreen?.task?.notes || [];


    return (
        <div className="learn">
            {currentScreen ? (
               <> 
                    <div className="learn-text">{currentScreen?.text}</div>
                    {audioCtx && masterGain.current && (
                        <Piano
                        mode={mode}
                        wave={wave}
                        audioCtx={audioCtx}
                        adsrSettings={adsr}
                        masterGain={masterGain.current}
                        highlightedNotes={highlightedNotes}
                        onKeyPress={handleKeyPress}
                        showNote={showNotes}
                        showKey={showKeys}
                        />
                    )}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default Learn;