import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import CardComponent from './CardComponent';

const ProjectsList = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleCardClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  }

  if (isLoading) {
    return (
      <div className="flex gap-8 py-2 -z-10 flex-nowrap">
        {Array(5).fill().map((item, index) => (
          <div key={index} className="w-64 h-64 m-3 rounded-md">
            <Skeleton height={100} />
            <Skeleton height={50} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="z-40 flex justify-center h-full gap-8 py-2 flex-nowrap">
      {projects.map((project, index) => (
        <CardComponent key={index} project={project} onClick={() => handleCardClick(project.id)} />
      ))}
    </div>
  );
};

export default ProjectsList;
