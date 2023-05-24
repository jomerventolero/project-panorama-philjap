import React from 'react';

const CardIndvComp = ({ image, onClick }) => {
  return (
    <div 
      className="z-40 m-3 mx-auto overflow-hidden font-sans shadow-md cursor-pointer w-72 h-[500px] card-component bg-glass rounded-xl" 
      onClick={onClick}
    >
      <div className="flex-col pt-8 md:flex">
        <div className="md:flex-shrink-0">
          <img className="object-cover w-3/4 h-64 m-auto rounded-xl md:w-48" src={image.imageUrl} alt={image.imageTitle} />
        </div>
        <div className="p-8">
          <div className="font-semibold tracking-wide text-indigo-500 uppercase text-md">{image.imageTitle}</div>
          <p className="mt-2 text-sm text-justify text-white">{image.imageDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default CardIndvComp;
