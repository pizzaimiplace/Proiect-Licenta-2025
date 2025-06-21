import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import banner from '../assets/banner.png';

const Home = () => {
    const navigate = useNavigate();


    return (
        <div className="home">
            <img src = {banner} alt="App Banner"/>
            <div className="home-button-container">
                <button onClick={() => navigate('/play')}>
                    Piano
                </button>
                <button onClick={() => navigate('/learn')}>
                    Courses
                </button>
                <button onClick={() => navigate('/quiz')}>
                    Quiz
                </button>
            </div>
        </div>
    );
};

export default Home;