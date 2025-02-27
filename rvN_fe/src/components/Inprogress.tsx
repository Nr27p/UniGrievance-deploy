import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import { getReportsbyStatus } from "@/api";

function Pending() {
  const [pendingReports, setReports] = useState([]);

  useEffect(() => {
    const getPendingReport = async () => {
      try {
        const response = await getReportsbyStatus("in-progress");
        setReports(response.data);
      } catch (e) {
        console.error(e);
      }
    };
    getPendingReport();
  }, []);

  // Log image data for debugging

  return (
    <div className="flex flex-col gap-4">
      {pendingReports.map((item) => (
        <Modal
          key={item._id}
          reportId={item._id}
          title={item.title}
          description={item.description}
          status={item.status}
          createdBy={item.createdBy}
          department={item.department} // Added department field
          image={item.image} // Assuming imageURL is the property that holds the image URL
          priority={item.priority}
        />
      ))}
    </div>
  );
}

export default Pending;
