import React from 'react';

const CardComponent = ({ project }) => {
  return (
    <div className="max-w-md m-3 mx-auto overflow-hidden bg-white shadow-md rounded-xl md:max-w-2xl">
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          <img className="object-cover w-full h-48 md:w-48" src={project.images[0]} alt={project.title} />
        </div>
        <div className="p-8">
          <div className="text-sm font-semibold tracking-wide text-indigo-500 uppercase">{project.title}</div>
          <p className="mt-2 text-gray-500">{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
