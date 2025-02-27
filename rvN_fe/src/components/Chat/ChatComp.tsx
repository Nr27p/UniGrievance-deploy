import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import MDEditor from "@uiw/react-md-editor";
import InputBox from "./InputBox";

import "./ChatWindow.css"; // For custom styles
import ReactMarkdown from "react-markdown";
// import logo from "../assets/img/gemini-small.png";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

const Header = () => {
  return (
    <div className="header">
      <h1 id="chat-header">
        {/* <img src={logo} alt="gemini" width={120} /> */}
        <b style={{ marginLeft: 5 }}>Chat AI</b>
      </h1>
      <small>Chat with Ai to know more about your local laws</small>
    </div>
  );
};

const ChatComp = () => {
  const chatContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const calculateTimeAgo = (timestamp) => {
    const currentTime = new Date();
    const messageTime = new Date(timestamp);
    const difference = currentTime - messageTime;

    // Convert milliseconds to seconds
    const seconds = Math.floor(difference / 1000);

    // Calculate time ago
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    } else if (seconds < 3600) {
      return `${Math.floor(seconds / 60)} minutes ago`;
    } else if (seconds < 86400) {
      return `${Math.floor(seconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(seconds / 86400)} days ago`;
    }
  };
  useEffect(() => {
    // Auto-scroll to the bottom of the chat container when new messages are added
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = async (inputText) => {
    if (!inputText) {
      return;
    }

    // Update messages with the user message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: inputText, sender: "user", timestamp: new Date() },
    ]);

    setLoading(true);

    try {
      const result = await model.generateContent(inputText);
      const text = result.response.text();

      // Check if the response is code before updating messages
      const isCode = text.includes("```");

      // Update messages with the AI response
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: text,
          sender: "ai",
          timestamp: new Date(),
          isCode, // Add a flag to identify code snippets
        },
      ]);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("generateContent error: ", error);
    }
  };

  return (
    <div className={`chat-window rounded-md flex items-center justify-center h-screen`}>
      <Header />
      <div className="chat-container overflow-y-auto scrollbar-hide"  ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === "user" ? "user" : "ai"}`}
          >
            {message.isCode ? (
              <ReactMarkdown>{message.text}</ReactMarkdown>
            ) : (
              <>
                <p className="message-text">{message.text}</p>
                <span
                  className={`time ${
                    message.sender === "user" ? "user" : "ai"
                  }`}
                >
                  {calculateTimeAgo(message.timestamp)}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
      
      <InputBox sendMessage={sendMessage} loading={loading} />
    </div>
  );
};

export default ChatComp;