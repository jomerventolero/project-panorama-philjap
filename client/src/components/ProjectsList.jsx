import React, { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";


import Loader from './Loader';
import axios from 'axios';
import CardComponent from './CardComponent';
import PanoramaViewer from './PanoramaViewer';

const ProjectsList = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchData = async () => {
        if (userId !== null) {
          try {
            const response = await axios.get(`http://localhost:3002/api/projects/${userId}`);
            setProjects(response.data);
            setIsLoading(false);
          } catch (error) {
            setError(error.message);
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      };
      

    fetchData();
  }, [userId]);

  // Before passing the image to PanoramaViewer, convert the Google Storage link to a direct URL
  const handleCardClick = async (project) => {
    const storage = getStorage();
    const gsReference = ref(storage, project.images[0].imageUrl);
    const url = await getDownloadURL(gsReference);
    setSelectedImage(url);
  }
  

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-wrap justify-center">
      {projects.map((project, index) => (
        <CardComponent key={index} project={project} onClick={() => handleCardClick(project)} />
      ))}
      {selectedImage && <PanoramaViewer image={selectedImage} />}
    </div>
  );
};

export default ProjectsList;
