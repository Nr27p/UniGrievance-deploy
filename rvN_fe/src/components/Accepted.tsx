import { getReportsbyStatus } from "@/api";
import { useEffect, useState } from "react";
// import ReportComponent from "./ReportComponent";
import Modal from "./Modal";

function Rejected() {
  const [acceptedReports, setAcceptedReports] = useState([]);
  useEffect(() => {
    const getPendingReport = async () => {
      try {
        const response = await getReportsbyStatus("accepted");
        setAcceptedReports(response.data);
      } catch (e) {}
    };
    getPendingReport();
  }, []);
  return (
    <div className="flex flex-col gap-4">
      {acceptedReports.map((item) => (
        <Modal
          title={item.title}
          description={item.description}
          status={item.status}
          createdBy={item.createdBy}
          reportId={item._id}
          image={item.image}
          department={item.department}
          priority={item.priority}
        />
      ))}
    </div>
  );
}

export default Rejected;
