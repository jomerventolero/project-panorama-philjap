import React from 'react';
import Skeleton from 'react-loading-skeleton';

const CardIndvComp = ({ image, onClick }) => {
  return (
    <div className="h-auto mx-auto font-sans shadow-md cursor-pointer w-96 card-component bg-gray-900 rounded-xl" onClick={onClick}>
      {image ? (
        <div className="px-4 pt-2 pb-4">
          <img className="object-cover w-full h-48 mb-2 rounded-xl" src={image.imageUrl} alt={image.imageTitle} />
          
          <div className="flex flex-row justify-between text-xl font-semibold tracking-wide text-indigo-500 uppercase">
            {image.imageTitle}
            <button className="rounded-full text-white px-4 bg-slate-500 hover:bg-sky-500 p-2">View</button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <Skeleton height={48} />
          <Skeleton height={24} width="80%" style={{ marginTop: '0.5rem' }} />
        </div>
      )}
    </div>
  );
};

export default CardIndvComp;
