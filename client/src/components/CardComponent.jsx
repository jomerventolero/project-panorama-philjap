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
      className="max-w-md m-3 mx-auto overflow-hidden bg-white shadow-md cursor-pointer rounded-xl md:max-w-2xl" 
      onClick={onClick}
    >
      <div className="md:flex">
        <div className="md:flex-shrink-0">
          {imageURL && <img className="object-cover w-full h-48 md:w-48" src={imageURL} alt={project.title} />}
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
