import { useProfileStore } from '@/store/store';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from 'react-hot-toast';

const ChatComponent = ({ receiverId }) => {
  const userId = useProfileStore((state) => state.userId);
  const [alarm, setAlarm] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    // Load initial messages between sender and receiver
    loadMessages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/data/messages/${userId}/${receiverId}`);
      const sortedMessages = response.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      setMessages(sortedMessages);
      // const arrayOfMessages = messages.map(item => item.content);
     
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (alarm) {
      toast.error("Personal questions detected. Please don't ask or share any personal info");
    }
  }, [alarm]);

  const sendMessage = async () => {
    try {
      const inputText=`You have to act as a chat monitoring system.Check if any personal messages are asked or answered  like "what is your name or location? and their answers or some other personal question. The answers should also be considered personal. Here is the message  ${messageInput} which you need to examine. Strictly reply with only a "yes" or a "no" if there are any personal questions or their answers`;
      const result = await model.generateContent(inputText);
      if(result.response.text().toLowerCase()=="yes"){
        setAlarm(true);
        toast.error("Personal questions detected. Please don't ask or share any personal info");
        return 
      }
      else if(result.response.text().toLowerCase()=="no"){
        setAlarm(false)
      }
      console.log("gemini response :",result.response.text())
      await axios.post('http://localhost:5000/data/sendmessages', { sender: userId, receiver: receiverId, content: messageInput, timestamp: new Date().toISOString() });
      // After sending the message, reload the messages
      loadMessages();
      setMessageInput('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='bg-white p-10 pb-0 rounded shadow-lg w-2/4 h-3/4'>
        <div className="overflow-y-auto h-3/4 mb-4 border-4 border-double p-4 border-slate-700 text-black">
          {messages.length === 0 ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {messages.map((msg, index) => (
                <li key={index} className={msg.sender === userId ? 'text-right' : 'text-left'}>
                  <div>
                    <span className="text-gray-500 text-xs">{new Date(msg.timestamp).toLocaleString()}</span>
                    <p>{msg.content}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center mt-10">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className='border-2 border-gray-300 px-4 py-2 mr-2 w-full rounded-md focus:outline-none focus:border-blue-500 text-black'
          />
          <button onClick={sendMessage} className='bg-green-500 text-white px-4 py-2 rounded focus:outline-none focus:shadow-outline-green hover:bg-green-600'>Send</button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
