// src/Preloader.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.1); }
  100% { opacity: 0; transform: scale(1); }
`;

const PreloaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #0e0e0e; /* Dark background */
  color: #ffffff;
  font-size: 2.5rem;
  font-family: 'Arial', sans-serif;
`;

const ForesightText = styled.div`
  animation: ${fadeIn} 2s ease-in-out infinite;
`;

const Preloader = () => {
  return (
    <PreloaderWrapper>
      <ForesightText>Foresight</ForesightText>
    </PreloaderWrapper>
  );
};

export default Preloader;
