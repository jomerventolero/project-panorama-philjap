import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectDetails = ({ userId, title }) => {
  const [projectData, setProjectData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/project/${userId}/${title}`);
        setProjectData(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [userId, title]);

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      {projectData.map((project, index) => (
        <div key={index} className="w-1/2 p-4 m-4 bg-blue-200 rounded-md">
          <h2 className="mb-2 text-2xl">{project.title}</h2>
          <p>{project.description}</p>
        </div>
      ))}
    </div>
  );
};

export default ProjectDetails;
