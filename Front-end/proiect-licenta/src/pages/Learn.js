import React, { useState, useEffect, useRef, useCallback } from 'react';
import Piano from '../components/Piano';
import Api from "../Api";
import './Learn.css';

const Learn = () => {
    const [courseList, setCourseList] = useState([]);
    const [courseId, setCourseId] = useState(null);

    const [lessonList, setLessonList] = useState([]);
    const [lessonId, setLessonId] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [currentScreen, setCurrentScreen] = useState(null);
    const [currentLesson, setCurrentLesson] = useState(null);

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
    
        if (!currentScreen || !currentScreen.notes) return;

        const flattenedNotes = currentScreen.notes.flat();

        if (currentScreen.ordered && !currentScreen.chord) {
            keySequenceRef.current.push(note);
            if (keySequenceRef.current.length > 2) keySequenceRef.current.shift();

            const [first, second] = keySequenceRef.current;
            const [expected1, expected2] = flattenedNotes;

            if (first === expected1 && second === expected2) {
                setCurrentIndex((prev) => prev + 1);
                keySequenceRef.current = [];
            }
        } else if (
            currentScreen.ordered === false &&
            currentScreen.consecutive === false &&
            currentScreen.allow_mistakes === true
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
        const fetchCourses = async () => {
            try {
                const response = await Api.get(`http://localhost:8000/api/courses/`);
                setCourseList(response.data);
            } catch(err) {
                console.error("Error lesson fetch:", err);
            }
        };

        fetchCourses(); 
    }, []);


    useEffect(() => {
        if(!courseId) {
            return;}
        const fetchCourseById = async () => {
            try {
                const response = await Api.get(`http://localhost:8000/api/courses/${courseId}/lessons/`);
                setLessonList(response.data);
            } catch(err) {
                console.error("Error lesson fetch:", err);
            }
        };

        fetchCourseById(); 
    }, [courseId]);

    useEffect(() => {
        if(!courseId || !lessonId) return;
        const fetchLesson = async () => {
            try {
                const response = await Api.get(`http://localhost:8000/api/courses/${courseId}/lessons/${lessonId}/`);
                setCurrentLesson(response.data);
                console.log(response.data);
            } catch(err) {
                console.error("Error lesson fetch:", err);
            }
        };

        fetchLesson(); 
    }, [lessonId]);


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
            return next < (currentLesson?.screens.length || 0) ? next : prev;
        });
    }, [currentLesson]);

    useEffect(() => {
        if (currentLesson) {
            setCurrentScreen(currentLesson.screens?.[currentIndex] || null);
        }
    }, [currentLesson, currentIndex]);


    useEffect(() => {
        if(!lessonId) return;
        const handleClick = () => {
            if (!currentScreen?.play_piano) {
                advanceDialogue();
            }
        };

        document.addEventListener('click', handleClick);
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, [lessonId, currentScreen, advanceDialogue]);

    const isLastScreen = currentLesson && currentIndex === currentLesson.screens.length - 1;

    return (
        <div className="learn">
            {!courseId && (
                <>
                    <h1>Select a Course</h1>
                    <div className="learn-button-container">
                        {courseList.map(course => (
                        <button key={course.id} onClick={() => setCourseId(course.id)}>
                            {course.title}
                        </button>
                        ))}
                    </div>
                </>
            )}

            {courseId && !lessonId && (
                <>
                    <h2>Select a Lesson</h2>
                    <div className="learn-button-container">
                        {lessonList.map(lesson => (
                        <button key={lesson.id} onClick={() => setLessonId(lesson.id)}>
                            {lesson.title}
                        </button>
                        ))}
                    </div>
                </>
            )}

            {lessonId && (
               <> 
                    <div className="learn-text">{currentScreen?.text}</div>
                    {audioCtx && masterGain.current && (
                        <Piano
                        mode={mode}
                        wave={wave}
                        audioCtx={audioCtx}
                        adsrSettings={adsr}
                        masterGain={masterGain.current}
                        highlightedNotes={currentScreen?.notes || []}
                        onKeyPress={handleKeyPress}
                        showNote={showNotes}
                        showKey={showKeys}
                        />
                    )}
                    <div className="learn-return-button-container">
                        {isLastScreen && (
                            <button onClick={() => {
                                    setLessonId(null);
                                    setLessonList([]);
                                    setCourseId(null);
                                    setCurrentLesson(null);
                                    setCurrentScreen(null);
                                    setCurrentIndex(0);
                                }
                            }>
                                Return to Course Selection
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Learn;