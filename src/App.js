import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Login from './Pages/Login';
import WeatherDetailsView from './Pages/WeatherDetailsView'; 
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/WeatherDetailsView" element={ <WeatherDetailsView /> } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
