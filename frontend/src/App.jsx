import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginButton from './components/LoginButton';
// import UserInfo from './components/UserInfo';
import Navbar from './components/Navbar';
// import LandingPage from './components/LandingPage';
import Services from './components/Services';
import Footer from './components/Footer';
import './styles/App.css';

const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('access_token');
    if (token) {
      setAccessToken(token);
    }
  }, []);

  return (
    <Router>
      <Navbar isAuthenticated={!!accessToken} />
      <Routes>
        <Route path="/" element={
          <div className="landing-page">
          <h1 className="title">Instagram OAuth Integration</h1>
          {!accessToken ? <LoginButton /> : <UserInfo accessToken={accessToken} />}
        </div>
        } />
        <Route path="/services" element={<Services />} />
        {/* Add other routes as needed */}
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;