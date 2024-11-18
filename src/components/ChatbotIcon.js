import React from "react";
import { useNavigate } from "react-router-dom"; // Updated to use useNavigate

const ChatbotIcon = () => {
  const navigate = useNavigate(); // useNavigate for navigation

  const handleChatbotClick = () => {
    navigate("/chatbot"); // Navigate to the chatbot page
  };

  return (
    <div
      onClick={handleChatbotClick}
      className="fixed bottom-4 right-4 bg-blue-600 text-white rounded-full p-3 cursor-pointer shadow-lg hover:bg-blue-700 transition duration-200 ease-in-out"
    >
      <span className="text-2xl">💬</span>
    </div>
  );
};

export default ChatbotIcon;
