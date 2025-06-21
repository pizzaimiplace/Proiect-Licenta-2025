import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayPiano from './pages/PlayPiano';
import Learn from './pages/Learn';
import Home from './pages/Home';
import Quiz from './pages/Quiz';

import './App.css';

const App = () => {
  return (
      <Routes>
        <Route path="/" element ={<Home /> }/>
        <Route path="/play" element={<PlayPiano />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/quiz" element={<Quiz />} />
      </Routes>

  );
};

export default App;