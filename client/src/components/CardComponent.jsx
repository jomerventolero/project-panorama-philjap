import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const CardComponent = ({ project, onClick }) => {
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const fetchImageURL = async () => {
      const storage = getStorage();
      const gsReference = ref(storage, project.images[0].imageUrl);
      const url = await getDownloadURL(gsReference);
      setImageURL(url);
    };

    fetchImageURL();
  }, [project]);

  return (
    <div 
      className="z-40 m-3 mx-auto overflow-hidden font-sans shadow-md cursor-pointer w-72 card-component bg-glass rounded-xl" 
      onClick={onClick}
    >
      <div className="flex-col pt-8 md:flex">
        <div className="md:flex-shrink-0">
          {imageURL && <img className="object-cover w-3/4 h-64 m-auto rounded-xl md:w-48" src={imageURL} alt={project.title} />}
        </div>
        <div className="p-8">
          <div className="font-semibold tracking-wide text-indigo-500 uppercase text-md">{project.title}</div>
          <p className="mt-2 text-justify text-white">{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
