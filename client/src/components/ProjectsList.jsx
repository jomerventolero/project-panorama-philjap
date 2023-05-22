import React, { useEffect, useState } from 'react';
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
      try {
        const response = await axios.get(`http://localhost:3002/api/projects/${userId}`);
        setProjects(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCardClick = (project) => {
    setSelectedImage(project.images[0]); // Set the first image of the selected project
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
