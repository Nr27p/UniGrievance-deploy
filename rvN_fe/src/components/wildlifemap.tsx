import React from 'react';

const MapEmbed = () => {
  return (
    <div className='flex justify-center items-center h-screen mt-[-70px]'>
      <iframe
        src="https://www.google.com/maps/d/u/0/embed?mid=1iXhy4bE5PLQPtuPqCcnSuqCRzQPrMiA&ehbc=2E312F"
        width="1000"
        height="600"
        title="Google Maps Embed"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
