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
      className="max-w-md m-3 mx-auto overflow-hidden font-sans shadow-md cursor-pointer rounded-xl md:max-w-2xl" 
      onClick={onClick}
    >
      <div className="flex-col md:flex">
        <div className="md:flex-shrink-0">
          {imageURL && <img className="object-cover w-3/4 h-64 m-auto rounded-xl md:w-48" src={imageURL} alt={project.title} />}
        </div>
        <div className="p-8">
          <div className="font-semibold tracking-wide text-indigo-500 uppercase text-md">{project.title}</div>
          <p className="p-8 mt-2 text-white">{project.description}</p>
        </div>
      </div>
    </div>
  );
};

export default CardComponent;
