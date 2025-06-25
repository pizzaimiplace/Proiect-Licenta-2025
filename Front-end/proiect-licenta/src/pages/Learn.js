import React, { useState, useEffect, useRef, useCallback } from 'react';
import Piano from '../components/Piano';
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
        const fetchCourses = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/courses/`);
                const json = await response.json();
                setCourseList(json);
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
                const response = await fetch(`http://localhost:8000/api/courses/${courseId}/lessons/`);
                const json = await response.json();
                setLessonList(json);
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
                const response = await fetch(`http://localhost:8000/api/courses/${courseId}/lessons/${lessonId}/`);
                const json = await response.json();
                console.log(json);
                setCurrentLesson(json);
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

export default Learn;