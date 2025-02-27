import React, { useEffect, useState } from "react";
import { Card } from "./ui/card";
import Modal from "react-modal";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

const modalStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  content: {
    maxWidth: "400px",
    margin: "auto",
    padding: "20px",
    borderRadius: "8px",
  },
};

const ReportModal = ({
  reportId,
  title,
  description,
  status,
  createdBy,
  department,
  image,
  priority
}) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [spam, setSpam] = useState("");
  const navigate = useNavigate();

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const handleChat = () => {
    navigate(`/dash/chat/${createdBy}`);
  };

  useEffect(() => {
    const detectSpam = async () => {
      try {
        const inputText = `This is a grievance report for a municipal corporation. Reply with only "yes" or "no" if this is a potential spam or not. Classify it as NOT spam only if it has a detailed description of the grievance. 
        Title: ${title} Description: ${description}`;
        
        const result = await model.generateContent(inputText);
        const text = result.response.text();
        console.log("Gemini response:", text);
        setSpam(text.toLowerCase());
      } catch (e) {
        console.error(e);
      }
    };
    detectSpam();
  }, [title, description]);

  return (
    <Card
      className={`flex p-6 min-w-[800px] relative rounded-xl shadow-lg backdrop-blur-lg bg-opacity-40 ${
        status === "resolved" ? "bg-green-100" :
        status === "rejected" ? "bg-red-100" :
        status === "escalated" ? "bg-yellow-100" :
        status === "in-progress" ? "bg-purple-100" :
        "bg-blue-100"
      }`}
    >
      <div className="flex justify-between w-full items-center p-4">
        <div className="ml-6 flex flex-col gap-2 w-4/5">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-md">Description: {description}</p>
          <p className="text-md">Department: {department}</p>
          <p className="text-sm font-bold">Priority: {priority}</p>
          <p className={`text-sm font-bold ${status === "resolved" ? "text-green-700" : status === "rejected" ? "text-red-700" : status === "escalated" ? "text-yellow-700" : status === "in-progress" ? "text-purple-700" : "text-blue-700"}`}>
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>
        </div>

        <div>
          <button onClick={openModal} className="text-md text-blue-600 underline cursor-pointer">
            View Details
          </button>

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={modalStyles}
            contentLabel="Report Details"
            className="backdrop-blur-2xl bg-white bg-opacity-80 min-w-[600px] min-h-[600px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-xl"
          >
            <div className="absolute top-4 right-4">
              <button onClick={closeModal} className="text-2xl font-bold hover:text-red-600 transition">
                ✕
              </button>
            </div>

            <div className="p-4">
              <h2 className="text-xl font-bold">{title}</h2>

              {image && (
                <div className="text-center mt-3">
                  <img src={image} alt="Report Image" className="max-w-full max-h-[300px] mx-auto rounded-lg" />
                </div>
              )}

              <p className="text-sm mt-3">{description}</p>
              <p className="text-sm">Department: {department}</p>
              <div className="flex text-sm items-center mt-5 gap-2">
                <span className="font-bold">Priority:</span>
                <span>{priority}</span>
              </div>

              <div className="text-sm text-[#ea563c] font-bold mt-2">
                {spam === "yes" ? "This report is a potential Spam" : "This report is not a potential Spam"}
              </div>
            </div>

            <div className="absolute bottom-4 left-6">
              <Button onClick={handleChat}>Chat with Reporter</Button>
            </div>
          </Modal>
        </div>
      </div>
    </Card>
  );
};

export default ReportModal;
