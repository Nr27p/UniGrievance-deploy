import { getcaAlert } from "@/api";
import OverdueCaseCard from "@/components/OverdueCaseCard";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const CaAlerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const response = await getcaAlert();

        console.log("Overdue Reports Fetched:", response.data);

        // ✅ Ensure we are setting the state correctly
        if (response.data && Array.isArray(response.data)) {
          setAlerts(response.data);
        } else if (response.data.reports && Array.isArray(response.data.reports)) {
          setAlerts(response.data.reports);
        } else {
          setAlerts([]);
          toast.error(response.data.message || "No overdue reports found");
        }
      } catch (err) {
        console.error("Error fetching overdue reports:", err);
        toast.error("Error fetching alerts");
      }
    };

    fetchAlerts();
  }, []);

  console.log("Overdue Reports State After Setting:", alerts);

  return (
    <div className="mx-36">
      <h1 className="text-3xl mt-10 font-bold text-red-600">Central Admin: Overdue Alerts</h1>
      <div className="mt-5">
        {alerts.length > 0 ? (
          alerts.map((report) => <OverdueCaseCard key={report._id} report={report} />)
        ) : (
          <div className="text-gray-500 text-lg font-semibold">No Overdue Reports</div>
        )}
      </div>
    </div>
  );
};

export default CaAlerts;
