import React from 'react';

const CardIndvComp = ({ image, onClick }) => {
  return (
    <div 
      className="hover:z-50 m-1 mx-auto overflow-hidden font-sans shadow-md cursor-pointer w-96 h-[350px] card-component bg-glass rounded-xl" 
      onClick={onClick}
    >
      <div className="flex-col pt-8 md:flex">
        <div className="md:flex-shrink-0 justify-center flex">
          <img className="object-cover w-max h-64 mx-2 rounded-xl md:w-48" src={image.imageUrl} alt={image.imageTitle} />
        </div>
        <div className="p-4">
          <div className="text-xl font-semibold tracking-wide text-indigo-500 uppercase">{image.imageTitle}</div>
        </div>
      </div>
    </div>
  );
};

export default CardIndvComp;
