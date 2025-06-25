import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import PlayPiano from './pages/PlayPiano';
import Learn from './pages/Learn';
import Home from './pages/Home';
import Quiz from './pages/Quiz';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';

function Logout(){
  localStorage.clear();
  return <Navigate to="/login" />
}

function SignUp(){
  localStorage.clear();
  return <Register />
}

const App = () => {
  return (
      <Routes>
        <Route path="/" element ={<ProtectedRoute>
            <Home /> 
          </ProtectedRoute>}/>
        <Route path="/play" element={<ProtectedRoute>
            <PlayPiano />
          </ProtectedRoute>} />
        <Route path="/learn" element={<ProtectedRoute>
            <Learn />
          </ProtectedRoute>} />
        <Route path="/quiz" element={<ProtectedRoute>
            <Quiz />
          </ProtectedRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
      </Routes>

  );
};

export default App;