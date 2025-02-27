import { useEffect, useState } from "react";
import { getAssignedReports } from "@/api";
import CaseCard from "@/components/CaseCard";

interface StatusEntry {
  status: string;
  updatedBy?: { username?: string };
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
  statusHistory: StatusEntry[];
}

const Cases: React.FC = () => {
  const [pendingCases, setPendingCases] = useState<Report[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const response = await getAssignedReports();
        setPendingCases(response.data);
      } catch (error) {
        console.log("Error fetching assigned reports", error);
      }
    };

    fetchPending();
  }, []);

  return (
    <div className={`transition-all duration-300 ${isModalOpen ? "pb-60" : "pb-10"}`}>
      {pendingCases.map((report) => (
        <CaseCard key={report._id} report={report} setIsModalOpen={setIsModalOpen} />
      ))}
    </div>
  );
};

export default Cases;
