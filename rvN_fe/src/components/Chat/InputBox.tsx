import { useState } from "react";
import "./ChatWindow.css"; // For custom styles

const InputBox = ({ sendMessage, loading }) => {
  const [input, setInput] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <div className="input-box text-black">
      {loading && <div className="loader"></div>}
      
      <input
        
        disabled={loading}
        type="text"
        className="form-control w-full rounded-md p-4"
        placeholder="Type a message..."
        value={loading ? "Loading..." : input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
      />
    </div>
  );
};

export default InputBox;