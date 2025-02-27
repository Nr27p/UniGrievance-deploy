import ParkInsights from "@/components/ParkInsights";
import { useState } from "react";
const Charts = () => {
  const [selectedPark, setSelectedPark] = useState("Mumbai Muncipal Corporation");

  const handleParkChange = (event) => {
    setSelectedPark(event.target.value);
  };
  return (
    <div className="">
      <div className="text-[28px] font-bold">{selectedPark} :</div>
      <div className="mb-4">
        <label
          htmlFor="parkSelect"
          className="block text-sm font-medium text-gray-500"
        >
          Select Department:
        </label>
        <select
          id="parkSelect"
          name="parkSelect"
          className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-500"
          value={selectedPark}
          onChange={handleParkChange}
        >
          <option value="Traffic Department">traffic</option>
          <option value="Water Department">water</option>
          <option value="PWD Department">PWD</option>
          {/* Add more options as needed */}
        </select>
      </div>
      <ParkInsights parkName="Kaziranga" />
    </div>
  );
};

export default Charts;
