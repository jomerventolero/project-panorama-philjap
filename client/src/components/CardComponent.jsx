import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Skeleton from 'react-loading-skeleton';

const CardComponent = ({ project, onClick }) => {
  const [imageURL, setImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchImageURL = async () => {
      const storage = getStorage();
      const gsReference = ref(storage, project.images[0].imageUrl);
      const url = await getDownloadURL(gsReference);
      setImageURL(url);
      setIsLoading(false);
    };

    fetchImageURL();
  }, [project]);

  return (
    <div 
    className="z-40 mx-auto overflow-hidden font-sans shadow-md cursor-pointer mr-20 w-96 h-[500px] card-component bg-gray-900 rounded-xl" 
    onClick={onClick}
  >
    <div className="flex-col pt-8 md:flex">
      <div className="md:flex-shrink-0">
        {isLoading ? <Skeleton height={200} /> : <img className="object-cover w-3/4 h-64 m-auto rounded-xl md:w-80" src={imageURL} alt={project.title} />}
      </div>
      <div className="flex flex-col items-center justify-center p-8">
        <div className="font-bold tracking-wide text-sky-400 uppercase text-lg">{project.title}</div>
        <p className="mt-2 text-sm text-center text-white">{project.description}</p>
        <button className="p-2 m-2 bg-cyan-600 w-1/2 rounded-full text-white" onClick={onClick}>Open</button>
      </div>
    </div>
  </div>
  );
};

export default CardComponent;
