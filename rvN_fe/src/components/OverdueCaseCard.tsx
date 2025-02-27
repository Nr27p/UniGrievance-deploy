import React from "react";

// Define the report type
interface Report {
  _id: string;
  title: string;
  description: string;
  department: string;
  priority: string;
  dueDate: string;
  status: string;
  assignedTo?: { username: string; email: string; department: string; post: string } | string;
}

interface OverdueCaseCardProps {
  report: Report;
}

const OverdueCaseCard: React.FC<OverdueCaseCardProps> = ({ report }) => {
  const isOverdue = Date.parse(report.dueDate) < Date.now();

  return (
    <div className="flex flex-col p-6 mb-6 bg-white shadow-md rounded-xl border border-red-500">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold text-gray-900">{report.title}</h3>
        {isOverdue && (
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-lg">
            Overdue
          </span>
        )}
      </div>
      <p className="text-gray-700 mt-2">
        <strong>Department:</strong> {report.department}
      </p>
      <p className="text-gray-700 mt-1">
        <strong>Priority:</strong> {report.priority}
      </p>
      <p className="text-gray-700 mt-1">
        <strong>Status:</strong> {report.status}
      </p>
      <p className="text-gray-700 mt-1">
        <strong>Due Date:</strong>{" "}
        <span className={`${isOverdue ? "text-red-500 font-bold" : "text-gray-900"}`}>
          {new Date(report.dueDate).toLocaleDateString()}
        </span>
      </p>

      {/* ✅ Assigned To Information */}
      {typeof report.assignedTo === "object" && report.assignedTo !== null ? (
        <p className="text-gray-600 mt-1">
          <strong>Assigned To:</strong> {report.assignedTo.username} ({report.assignedTo.post} - {report.assignedTo.department})
        </p>
      ) : (
        <p className="text-gray-500 mt-1"><strong>Assigned To:</strong> Not Assigned</p>
      )}
    </div>
  );
};

export default OverdueCaseCard;
