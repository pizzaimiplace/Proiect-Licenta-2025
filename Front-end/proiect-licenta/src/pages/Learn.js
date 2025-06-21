import React, { useState, useEffect, useRef } from 'react';
import Piano from '../components/Piano';
import './Learn.css';

const Learn = () => {
    const [courseData, setCourseData] = useState([]);
    const [courseId, setCourseId] = useState(null);

    const [lessonData, setLessonData] = useState(null);
    const [lessonId, setLessonId] = useState(null);

    const [currentIndex, setCurrentIndex] = useState(0);

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
        const fetchCourses = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/courses/`);
                const json = await response.json();
                setCourseData(json);
            } catch(err) {
                console.error("Error lesson fetch:", err);
            }
        };

        fetchCourses(); 
    }, []);


    useEffect(() => {
        if(!courseId) {
            console.log("ALOOOO");
            return;}
        const fetchCourseById = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/courses/${courseId}/lessons/`);
                const json = await response.json();
                setLessonData(json);
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
                setLessonData(json);
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

    /*console.log('lessonData:', lessonData);
    console.log('lessonData keys:', lessonData ? Object.keys(lessonData) : 'lessonData is null');
    console.log('currentIndex:', currentIndex);
    console.log('screens:', lessonData?.screens);
    console.log('currentScreen:', lessonData?.screens ? lessonData.screens[currentIndex] : null);*/

    const currentScreen = lessonData?.screens ? lessonData.screens[currentIndex] : null;
    const highlightedNotes = currentScreen?.task?.notes || [];


    return (
        <div className="learn">
            <h1>Select a Course</h1>
            <div>
                {courseData.map(course => (
                <button key={course.id} onClick={() => setCourseId(course.id)}>
                    {course.title}
                </button>
                ))}
            </div>

            {courseId && lessonData && (
                <>
                <h2>Select a Lesson</h2>
                    <div>
                        {lessonData.map(lesson => (
                        <button key={lesson.id} onClick={() => setLessonId(lesson.id)}>
                            {lesson.title}
                        </button>
                        ))}
                    </div>
                </>
            )}

            {currentScreen && (
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
            )}
        </div>
    );
};

export default Learn;