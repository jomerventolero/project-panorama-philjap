import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CardIndvComp from './CardIndvComp';
import PanoramaViewer from './PanoramaViewer';
import { auth } from '../firebase/auth';
import Navbar from './Navbar';

const ProjectViewer = () => {
  const { projectId } = useParams();
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);

  const imageContainerRef = useRef(null);
  const scrollStep = 400; // Number of pixels to scroll

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the current user's userId
        const user = auth.currentUser;
        if (user) {
          const userIdCurrent = user.uid;
          setUserId(userIdCurrent);
  
          // Fetch the project images using the userId
          const response = await axios.get(`http://localhost:3002/api/projects/images/${projectId}/${userIdCurrent}`);
          setImages(response.data.images);
        } else {
          // handle case where no user is signed in
          console.error("No user signed in");
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, [projectId]);
  

  const handleCardClick = async (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleScrollLeft = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollLeft -= scrollStep;
    }
  };

  const handleScrollRight = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollLeft += scrollStep;
    }
  };

  return (
    <div className="h-[500px]">
      <Navbar />
      <div className="pt-[150px] flex flex-col justify-center items-center">
        {selectedImage && <PanoramaViewer image={selectedImage} />}
      </div>
      <div className="flex flex-row relative justify-center items-center h-full w-full px-2 pt-[50px] bg-slate-900">
        <button className="absolute left-0 top-1/2 text-[32px] transform -translate-y-1/2 z-20 bg-white p-2 rounded-r-md shadow" onClick={handleScrollLeft}>
          &lt;
        </button>
        <button className="absolute right-0 top-1/2 text-[32px] transform -translate-y-1/2 z-20 bg-white p-2 rounded-l-md shadow" onClick={handleScrollRight}>
          &gt;
        </button>
        
        <div className="z-10 flex flex-row justify-between overflow-y-hidden gap-36 scrollbar-thin" ref={imageContainerRef} style={{ scrollbarWidth: "none" }}>
          
          {images.map((image, index) => (
            <div className={`w-1/4 hover:z-10 ${selectedImage === image.imageUrl ? "" : ""}`} key={index}>
              <CardIndvComp image={image} onClick={() => handleCardClick(image.imageUrl)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectViewer;
