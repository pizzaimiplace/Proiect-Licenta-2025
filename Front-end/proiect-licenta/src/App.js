import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PlayPiano from './pages/PlayPiano';
import Learn from './pages/Learn';
import './App.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PlayPiano />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
    </Router>
  );
};

export default App;