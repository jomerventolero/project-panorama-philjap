import React, { useEffect, useState } from 'react';
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

  return (
    <div>
      <Navbar />
      <div className="flex flex-row justify-center h-full w-full gap-8 py-2 pt-[150px] bg-slate-900">
        <div className="flex flex-row flex-wrap gap-4">
          {images.map((image, index) => (
            <div className="w-1/4 hover:z-10">
              <CardIndvComp key={index} image={image} onClick={() => handleCardClick(image.imageUrl)} />
            </div>
          ))}
        </div>
        {selectedImage && <PanoramaViewer image={selectedImage} />}
      </div>
    </div>
  );
};

export default ProjectViewer;
