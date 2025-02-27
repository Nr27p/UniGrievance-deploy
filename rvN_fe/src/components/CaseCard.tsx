import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface StatusEntry {
  status: string;
  updatedBy?: string;
  updatedByName?: string;
  timestamp: string;
}

interface Report {
  _id: string;
  title: string;
  description: string;
  image?: string;
  status: string;
  priority: string;
  dueDate: string;
  department: string;
  createdBy: string;
  statusHistory?: StatusEntry[];
}

interface CaseCardProps {
  report: Report;
  setIsModalOpen: (open: boolean) => void; // New prop to control modal state
}

const CaseCard: React.FC<CaseCardProps> = ({ report, setIsModalOpen }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [status, setStatus] = useState(report.status);
  const navigate = useNavigate();
  const [statusHistory, setStatusHistory] = useState(
    report.statusHistory || []
  );

  const openModal = () => {
    setShowDetails(true);
    setIsModalOpen(true);
    document.body.style.overflow = "hidden"; // Disable scrolling
  };

  const closeModal = () => {
    setShowDetails(false);
    setIsModalOpen(false);
    document.body.style.overflow = "auto"; // Enable scrolling
  };

  const updateStatus = async (newStatus: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:5000/user/updateReportStatus/${report._id}`,
        { status: newStatus },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        setStatus(newStatus);
        setStatusHistory((prevHistory) => [
          ...prevHistory,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            updatedByName:
              response.data.userReport.statusHistory.slice(-1)[0]
                ?.updatedByName || "Unknown User",
          },
        ]);
        alert(`Report status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const handleChat = () => {
    navigate(`/dash/chat/${report.createdBy}`);
  };

  return (
    <div
      className={`flex flex-col mb-10 px-8 py-6 sm:flex-row sm:justify-between rounded-xl bg-white text-black backdrop-blur-lg bg-opacity-40 shadow-md hover:shadow-lg transition-all duration-300 ${
        showDetails ? "h-[90vh]" : "h-auto"
      }`}
    >
      <div className="flex w-full space-x-4">
        <div className="flex flex-col w-full justify-between">
          <h3 className="font-semibold leading-snug sm:pr-8 text-2xl">
            {report.title}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            Due Date: {new Date(report.dueDate).toLocaleDateString()}
          </p>
          <p
            className={`text-md font-semibold mt-2 ${
              status === "resolved"
                ? "text-green-600"
                : status === "escalated"
                ? "text-red-600"
                : "text-blue-600"
            }`}
          >
            Status: {status.charAt(0).toUpperCase() + status.slice(1)}
          </p>

          {/* Timeline Section */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Status Timeline</h3>
            <ul className="border-l-4 border-blue-500 pl-4">
              {statusHistory.length === 0 ? (
                <p className="text-gray-500">No status updates yet</p>
              ) : (
                statusHistory.map((entry, index) => (
                  <li key={index} className="mb-3">
                    <div className="flex items-center">
                      <div className="bg-blue-500 h-3 w-3 rounded-full"></div>
                      <p className="ml-3 text-gray-700 font-medium">
                        {entry.status}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 ml-6">
                      Updated by{" "}
                      <strong>{entry.updatedByName || "Unknown User"}</strong> on {" "}
                      {new Date(entry.timestamp).toLocaleString()}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Details Button */}
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-all"
            onClick={openModal}
          >
            View Details
          </button>

          {/* Modal */}
          {showDetails && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md transition-opacity z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-[650px] relative max-h-[90vh] overflow-y-auto z-50">
                {/* Close Button */}
                <button
                  className="absolute top-4 right-4 text-xl font-bold text-gray-700 hover:text-red-600"
                  onClick={closeModal}
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-3 text-center">
                  {report.title}
                </h2>
                <p className="text-gray-700 mb-2">
                  <strong>Status:</strong> {status}
                </p>
                <p className="text-gray-700">{report.description}</p>
                <p className="text-gray-700 mt-2">
                  <strong>Due Date:</strong>{" "}
                  {new Date(report.dueDate).toLocaleDateString()}
                </p>
                <p className="text-gray-700">
                  <strong>Department:</strong> {report.department}
                </p>

                {/* Centered Image */}
                {report.image && (
                  <div className="flex justify-center mt-4">
                    <img
                      src={report.image}
                      alt="Report"
                      className="rounded-lg max-w-full h-auto"
                      style={{ maxHeight: "250px" }}
                    />
                  </div>
                )}

                {/* Status Change Buttons */}
                {status !== "resolved" && (
                  <div className="flex flex-col space-y-2 mt-4">
                    <button
                      onClick={() => updateStatus("in-progress")}
                      className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                      Mark as In Progress
                    </button>
                    <button
                      onClick={() => updateStatus("resolved")}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                    >
                      Resolve Case
                    </button>
                    <button
                      onClick={() => updateStatus("escalated")}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      Escalate Case
                    </button>
                    <button 
                  onClick={handleChat} 
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Chat With the Volunteer
                </button>
                  </div>
                )}

                {/* Close Button */}
                <button
                  className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 w-full"
                  onClick={closeModal}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseCard;
