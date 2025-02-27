import { getUserReports } from "@/api";
import UserCaseCard from "@/components/UserCaseCard";
import { useProfileStore } from "@/store/store";
import { useEffect, useState } from "react";

const UserCases = () => {
  const userId = useProfileStore((state) => state.userId);
  const [userReports, setUserReports] = useState([]);
  useEffect(() => {
    const getReports = async () => {
      try {
        const response = await getUserReports(userId);
        setUserReports(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getReports();
  });
  return (
    <div className="mx-4">
      <div className="text-3xl mt-8 font-bold">My Cases</div>
      <div className="mt-10">
        {userReports.map((item) => {
          return <UserCaseCard report={item} />;
        })}
      </div>
    </div>
  );
};

export default UserCases;
