import { getAllVisitors } from "@/api";
import VisitCard from "@/components/VisitCard"
import SpinnerCircular from "@/components/ui/SpinnerCircular";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Visitor = () => {
    const [allVisitors, setAllVisitors] = useState();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchVisitors = async () => {
            try{
                const response = await getAllVisitors()
                setAllVisitors(response.data);

            }
            catch(e){
                toast.error("Error fetching visitors")
            }
            finally{
                setIsLoading(false);
            }
        }
        fetchVisitors();
    }, [])


return (
    <div className="px-2 py-2 md:px-6 md:py-10 ">
  <h1 className="text-2xl font-bold capitalize text-white lg:text-3xl mb-2">
    Visitor's Data
  </h1>
  {isLoading && <SpinnerCircular/>}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">

  {allVisitors &&
    allVisitors.map((visitor) => (
      <VisitCard
        key={visitor.id}
        Title={visitor.name}
        visitorid={visitor._id}
        rfid={visitor.rfid}
        nationality={visitor.nationality}
        in_time={visitor.inTime}
        out_time={visitor.outTime}
      />
    ))}
  </div>
</div>
)
}

export default Visitor;
