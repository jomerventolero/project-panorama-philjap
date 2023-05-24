import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CardIndvComp from './CardIndvComp';
import PanoramaViewer from './PanoramaViewer';
import { auth } from '../firebase/auth'; 

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
          const userId = user.uid;
          setUserId(userId);

          // Fetch the project images using the userId
          const headers = { userId };
          const response = await axios.get(`http://localhost:3002/api/projects/images/${projectId}`, { headers });
          setImages(response.data);
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
    <div className="flex justify-center h-full gap-8 py-2 flex-nowrap">
      {images.map((image, index) => (
        <CardIndvComp key={index} image={image} onClick={() => handleCardClick(image.imageUrl)} />
      ))}
      {selectedImage && <PanoramaViewer image={selectedImage} />}
    </div>
  );
};

export default ProjectViewer;
