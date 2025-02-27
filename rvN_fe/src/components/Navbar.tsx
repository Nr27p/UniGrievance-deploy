import { useProfileStore } from "@/store/store";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/image-removebg-preview.png"
import { Input } from "./ui/input";
const Navbar = () => {
  const token =useProfileStore((state)=>state.token)
  const logout =useProfileStore((state)=>state.logout)
  const handleLogout = ()=>{
    logout()
    window.location.href="/"
  }
  return (
    <nav className=" p-8 b-0 h-24 text-[#353538d2] bg-transparent relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className=" font-bold flex gap-6 items-center justify-center">
          <Link className="max-w-[80px]" to= "/"><img src={logo}/></Link>
          <div><a href="https://www.mcgm.gov.in/irj/go/km/docs/documents/MCGM%20Department%20List/Chief%20Officer%20(Enquiries)/Docs/Brihanmumbai%20Municipal%20Corporation%20Services%20(Discipline%20and%20Appeal)%20Rules%2C%202015.pdf" className=" hover:text-slate-400">Laws</a></div>
          <div><a href="#" className=" hover:text-slate-400">About</a></div>
        </div>
        <div><Input className="rounded-full w-[400px] " placeholder="Search"/></div>
        <ul className="flex space-x-4">
          {!token ?
          <div className="flex gap-6">

            <div><a href="/signin" className=" hover:text-slate-400">Sign in</a></div>
            <div><a href="/signup" className=" hover:text-slate-400">Register</a></div>
          </div>:<div><Button className="" onClick={handleLogout}>Signout</Button> <Link to="/dash"> <Button>Dashboard</Button></Link></div>

          }
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
