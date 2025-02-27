import { Outlet, useNavigate } from "react-router-dom"
import SideBar from "../components/SideBar"
import TopBar from "../components/TopBar"
import "@/components/Sidebar.css"
import { useProfileStore } from "@/store/store"
import { useEffect } from "react"
// import bgdash from "@/assets/bggrounddash.jpeg"
const Homepage = () => {
  const token =useProfileStore((state)=>state.token)
  const navigate = useNavigate()
  useEffect(()=>{
    if(!token){
      navigate("/signin")
    }
  },[])
  return (
    <div className="flex bg-[#212633] text-white bg-cover bg-center " style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457129962825-adcaea7406c3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }}>

        <SideBar/>
        <main className="grow">
          <TopBar/>
          <div className="overflow-y-scroll grow main-content px-16">
            <Outlet/>

          </div>
        </main>
    </div>
  )
}

export default Homepage
