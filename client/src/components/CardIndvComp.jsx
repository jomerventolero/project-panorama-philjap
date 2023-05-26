import React from 'react';

const CardIndvComp = ({ image, onClick }) => {
  return (
    <div className="mx-auto overflow-hidden font-sans shadow-md cursor-pointer w-96 h-auto card-component bg-glass rounded-xl" onClick={onClick}>
      <div className="pt-2 pb-4 px-4">
        <img className="object-cover w-full h-48 mb-2 rounded-xl" src={image.imageUrl} alt={image.imageTitle} />
        <div className="text-xl font-semibold tracking-wide text-indigo-500 uppercase">{image.imageTitle}</div>
      </div>
    </div>
  );
};

export default CardIndvComp;
