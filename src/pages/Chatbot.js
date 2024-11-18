import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db, auth } from './firebase'; // Import Firebase db and auth
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'; // Firebase Firestore methods
import { onAuthStateChanged } from 'firebase/auth'; // To track user login state

const Chatbot = () => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [user, setUser] = useState(null); // To hold current logged in user

  // Google Gemini API setup
  const API_KEY = "AIzaSyD0j4iMm7yEZRZcAN6YoMmSSq5MJV3eIeY"; // Replace with your actual API Key
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Refs for scrolling
  const chatContainerRef = useRef();

  // Append message function
  const appendMessage = (sender, message) => {
    setChatHistory((prevHistory) => [...prevHistory, { sender, message }]);
  };

  // Function to highlight important words
  const highlightText = (text) => {
    const importantWords = ['stocks', 'market', 'price', 'investment', 'prediction']; // Example keywords to highlight
    let highlightedText = text;

    importantWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match whole words, case-insensitive
      highlightedText = highlightedText.replace(regex, (match) => `<span class="bg-yellow-200">${match}</span>`);
    });

    return highlightedText;
  };

  // Function to get bot response
  const getBotResponse = async (userMessage) => {
    const conversationHistory = chatHistory
      .map((entry) => `${entry.sender}: ${entry.message}`)
      .join('\n');

    try {
      const result = await model.generateContent(conversationHistory + `\nuser: ${userMessage}`);
      const response = await result.response;
      const text = await response.text();

      if (text.includes("Sorry, I cannot help")) {
        appendMessage('bot', 'Sorry, I can only answer questions related to stocks.');
      } else {
        // Highlight important words and break the response into multiple paragraphs
        const highlightedText = highlightText(text);
        const paragraphs = highlightedText.split('\n').map((para, index) => (
          <p key={index} dangerouslySetInnerHTML={{ __html: para }}></p>
        ));

        appendMessage('bot', paragraphs);
      }

      // Save the chat history to Firestore for the current user
      if (user) {
        saveChatHistory(user.uid, [...chatHistory, { sender: 'user', message: userMessage }, { sender: 'bot', message: text }]);
      }

    } catch (error) {
      console.error('Error:', error);
      appendMessage('bot', 'Sorry, something went wrong.');
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };

  // Handle sending message
  const handleSendMessage = () => {
    if (userMessage.trim()) {
      appendMessage('user', userMessage);
      setUserMessage('');
      getBotResponse(userMessage);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [chatHistory]);

  // Fetch initial greeting message from Gemini
  const fetchInitialGreeting = async () => {
    try {
      const initialMessage = "Hello! Feel free to ask me any questions about stocks.";
      const result = await model.generateContent(initialMessage);
      const response = await result.response;
      const text = await response.text();
      appendMessage('bot', text);
    } catch (error) {
      console.error('Error:', error);
      appendMessage('bot', 'Sorry, something went wrong.');
    }
  };

  // Send initial greeting when the component is mounted
  useEffect(() => {
    // Check user login state
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      if (loggedInUser) {
        // Load chat history if user is logged in
        loadChatHistory(loggedInUser.uid);
      } else {
        // Fetch initial greeting for users not logged in
        fetchInitialGreeting();
      }
    });

    return () => unsubscribe(); // Clean up the listener on component unmount
  }, []);

  // Save chat history to Firestore
  const saveChatHistory = async (userId, history) => {
    try {
      const chatRef = doc(db, 'users', userId); // Reference to the user's chat history
      await setDoc(chatRef, { history }, { merge: true }); // Merge new data with existing data
    } catch (error) {
      console.error("Error saving chat history:", error);
    }
  };

  // Load chat history from Firestore
  const loadChatHistory = async (userId) => {
    try {
      const chatRef = doc(db, 'users', userId); // Reference to the user's chat history document
      const docSnap = await getDoc(chatRef); // Use getDoc for a single document

      if (docSnap.exists()) {
        // Load chat history if the document exists
        const history = docSnap.data().history;
        setChatHistory(history || []); // Ensure an empty array if no history exists
      } else {
        console.log("No previous chat history found.");
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-2xl p-8 flex flex-col space-y-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Forebot</h1>

        {/* Chat History */}
        <div ref={chatContainerRef} className="flex-1 overflow-auto max-h-[500px] bg-gray-50 p-6 rounded-lg shadow-md mb-6 space-y-4">
          <div className="space-y-4">
            {chatHistory.map((entry, index) => (
              <div key={index} className={`flex ${entry.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-4 max-w-xs rounded-lg ${entry.sender === 'user' ? 'bg-pink text-white' : 'bg-blue text-white'}`}>
                  {/* For bot response, handle paragraphs with dangerouslySetInnerHTML */}
                  {Array.isArray(entry.message) ? entry.message : entry.message}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input and Send Button */}
        <div className="flex items-center space-x-4 border-t pt-6 mt-6">
          <input
            type="text"
            className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 "
            placeholder="Type a message..."
            value={userMessage}
            onChange={handleInputChange}
          />
          <button
            className="bg-green text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
