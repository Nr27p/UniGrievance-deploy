import React from 'react';
import { Copy, ArrowRight } from 'lucide-react';
import profile from "@/assets/empty.jpg"
const VisitCard = ({ Title, visitorid, rfid, nationality, in_time, out_time }) => {
    return (  
      <div className="mt-6 pl-2">
        <div className="w-[300px] bg-white text-black rounded-md border m-2 backdrop-blur-lg bg-opacity-40">
        <div className="pl-9 pt-1">
        <div className='h-[200px] w-[200px] border-2 rounded-full overflow-hidden p-4 m-2 pl-5'>
    <img
      src={profile}
      className="object-fit object-center rounded-full"
      alt={Title}
    />
          </div>
          </div>
          <div className="p-4">
            <h1 className="text-lg font-semibold">Name: {Title}</h1>
            <p className="mt-3 text-sm">Id: {visitorid}</p>
            <p className="mt-3 text-sm">RFID: {rfid}</p>
            <p className="mt-3 text-sm">Nationality: {nationality}</p>
            <p className="mt-3 text-sm">In Time: {in_time}</p>
            <p className="mt-3 text-sm">Out Time: {out_time}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default VisitCard;
  