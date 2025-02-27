import ChatComp from "@/components/Chat/ChatComp";
import TwitterFeed from "@/components/TwitterFeed";
import { useState } from "react";
import { FaCommentDots } from "react-icons/fa6";
const Explore = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };
  return (
    <div className="container mx-auto flex">
        {/* {isChatOpen ? "Hide Chat" : "Open Chat"} */}
      {/* <button onClick={toggleChat}>
      <FaCommentDots />
      </button> */}
     
    <div style={{ position: "fixed", bottom: 20, right: 20 }}>
      <div className="flex-1">
      <div className={`${isChatOpen ? "block" : "hidden"} w-[400px] duration-300`}>
        <ChatComp />
      </div>
      </div></div>
      <div className="flex-1 mt-1 mb-4">
        <h1 className="text-3xl font-bold mb-8 pl-40">Twitter Space</h1>
        <TwitterFeed />
      </div>
    
    </div>
    
  );

  
};

export default Explore;
