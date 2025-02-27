import { getDetails, getEndangeredSpeciesDetails } from "@/api";
import { useEffect, useState } from "react";
import AreaCharts from "./AreaCharts";
import PieCharts from "./PieCharts";
import LineCharts from "./LineCharts";

const ParkInsights = ({ parkName }: { parkName: string }) => {
  const [yearlyData, setYearlyData] = useState([]);
  const [endangeredData, setEndangeredData] = useState([]); // Initialize with an empty array
  useEffect(() => {
    const fetchParkData = async () => {
      try {
        const response = await getDetails(parkName);
        // const response2 = await getEndangeredSpeciesDetails(parkName, 2023);
        // const data1 = Object.entries(response2.data)
        //   .filter(([key, value]) => typeof value === 'number')
        //   .map(([key, value]) => ({ name: key, value }));
        // console.log(data1);
        // setEndangeredData(response2.data);
        setYearlyData(response.data.map(({ _id, parkName, ...rest }) => rest).reverse());
      } catch (error) {
        console.log("error:", error);
      }
    };
    fetchParkData();
  }, [parkName]); // Make sure to include parkName in the dependency array if it's used inside the effect
  console.log(yearlyData);
  console.log(endangeredData);
  return (
    <div>
      <div className="flex">
        <div className="w-[500px] h-[500px] flex-1 my-10">
          <AreaCharts data={yearlyData} />
        </div>
        <div className="w-[500px] h-[500px] flex-1">
          <PieCharts data1={endangeredData} />
        </div>
      </div>
      <div className="w-[1000px] h-[500px] mt-20 flex-1 mx-auto">
        <LineCharts />
      </div>
    </div>
  );
};

export default ParkInsights;
