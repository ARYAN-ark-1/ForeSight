// src/App.js
import React, { useState, useEffect } from 'react';
import Preloader from './components/Preloader'; // Import the Preloader component
import SetTitle from './pages/setTitle';

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time or API call
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000); // Adjust time as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="App">
      {loading ? <Preloader /> : <MainContent />} {/* Display Preloader if loading */}
    </div>
  );
};

const MainContent = () => {
  return (
    <div>
      {/* Your main content here */}
      <SetTitle />
      <h1>Welcome to Foresight Crypto Website</h1>
    </div>
  );
};

export default App;
