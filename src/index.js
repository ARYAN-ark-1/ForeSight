import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/Home';
import Crypto from './pages/Crypto';
import Trending from './pages/Trending';
import Saved from './pages/Saved';
import CryptoDetails from './components/CryptoDetails';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Result from './pages/Result';
import Preloader from './components/Preloader';
import { CryptoProvider } from './context/CryptoContext';
import Chatbot from './pages/Chatbot';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      { path: "/", element: <Crypto /> },
      { path: "trending", element: <Trending /> },
      { path: "saved", element: <Saved /> },
      { path: ":coinId", element: <CryptoDetails /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/result", element: <Result /> },
  { path: "/chatbot", element: <Chatbot /> },
]);

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000); // Show preloader for 2 seconds
    return () => clearTimeout(timer); // Cleanup timeout
  }, []);

  return loading ? <Preloader /> : <RouterProvider router={router} />;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CryptoProvider>
      <App />
    </CryptoProvider>
  </React.StrictMode>
);
