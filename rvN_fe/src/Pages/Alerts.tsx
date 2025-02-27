import { getAlert } from "@/api"
import CaseCard from "@/components/CaseCard"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const Alerts = () => {
  const [alerts, setAlerts] = useState()
  useEffect(() => {
    const fetchAlerts = async () => {
      try{
       const response= await getAlert()
       if(response.data.message){
         setAlerts(response.data)
        toast.error(response.data.message)
       }
      }catch(err){
        console.log(err)
      }
    }
    fetchAlerts()
  }, [])
  console.log(alerts)
  return (
    <div>
      <div className="text-3xl">Alerts</div>
        {alerts?.message}
      <div className="mt-5">
        {alerts? alerts?.reports.map((item)=>(
          <CaseCard report={item}/>
        )):<div>No Existing Alerts Currently</div>}
      </div>
    </div>
  )
}

export default Alerts
