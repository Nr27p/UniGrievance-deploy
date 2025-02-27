import { FaHouse, FaUser} from "react-icons/fa6";
import { Link } from "react-router-dom";
// import DropdownMenuDemo from "../ui/DropDown";
const TopBar = () => {
  return (
    <div className="w-full flex justify-between py-6 px-10 items-center">
      <div className="flex gap-5 items-center">
      <Link to="/"><FaHouse /></Link>
        <input type="text" className="rounded-xl py-2 pl-4 bg-slate-700 focus:outline-none" placeholder="Search"/>
      </div>
      <div className="flex gap-5 items-center">
        
        {/* <DropdownMenuDemo/> */}
        <FaUser />

      </div>
    </div>
  )
}

export default TopBar
