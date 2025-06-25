import React, { useState, useEffect, useRef, useCallback } from 'react';
import Piano from '../components/Piano';
import './Quiz.css';

const Quiz = () => {
    const [quizList, setQuizList] = useState([]);
    const [quizId, setQuizId] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);

    const [currentScreen, setCurrentScreen] = useState(null);
    const [currentQuiz, setCurrentQuiz] = useState(null);

    const [showNotes, setShowNotes] = useState(false);
    const [showKeys, setShowKeys] = useState(false);

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

    const keySequenceRef = useRef([]);

    const handleKeyPress = (note) => {
        /*setCurrentLesson(lessonList.find(lesson => lesson.id === lessonId));
        setCurrentScreen(currentLesson?.screens[currentIndex]);*/
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
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/quizzes/`);
                const json = await response.json();
                setQuizList(json);
            } catch(err) {
                console.error("Error lesson fetch:", err);
            }
        };

        fetchQuizzes(); 
    }, []);

    useEffect(() => {
        if(!quizId) return;
        const fetchQuizById = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/quizzes/${quizId}/`);
                const json = await response.json();
                setCurrentQuiz(json);
            } catch(err) {
                console.error("Error lesson fetch:", err);
            }
        };

        fetchQuizById(); 
    }, [quizId]);


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

    const advanceDialogue = useCallback(() => {
        setCurrentIndex((prev) => {
            const next = prev + 1;
            return next < (currentQuiz?.screens.length || 0) ? next : prev;
        });
    }, [currentQuiz]);

    useEffect(() => {
        if (currentQuiz) {
            setCurrentScreen(currentQuiz.screens?.[currentIndex] || null);
        }
    }, [currentQuiz, currentIndex]);


    useEffect(() => {
        if(!quizId) return;
        const handleClick = () => {
            if (!currentScreen?.play_piano) {
                advanceDialogue();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [quizId, currentScreen, advanceDialogue]);

    return (
        <div className="quiz">
            {!quizId && (
                <>
                    <h1>Select a Quiz</h1>
                    <div className='quiz-button-container'>
                        {quizList.map(quiz => (
                        <button key={quiz.id} onClick={() => setQuizId(quiz.id)}>
                            {quiz.title}
                        </button>
                        ))}
                    </div>
                </>
            )}

            {quizId && (
               <> 
                    <div className="quiz-text">{currentScreen?.text}</div>
                    {audioCtx && masterGain.current && (
                        <Piano
                        mode={mode}
                        wave={wave}
                        audioCtx={audioCtx}
                        adsrSettings={adsr}
                        masterGain={masterGain.current}
                        highlightedNotes={currentScreen?.task?.notes || []}
                        onKeyPress={handleKeyPress}
                        showNote={showNotes}
                        showKey={showKeys}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Quiz;