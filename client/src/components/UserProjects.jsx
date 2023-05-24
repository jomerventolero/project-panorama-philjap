import React, { useEffect, useState } from 'react';
import { getUserProjects } from './api';
import ProjectCard from './ProjectCard';

const UserProjects = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const projects = await getUserProjects(userId);
      setProjects(projects);
      setIsLoading(false);
    };

    fetchProjects();
  }, [userId]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {projects.map((project, index) => (
        <ProjectCard key={index} project={project} />
      ))}
    </div>
  );
};

export default UserProjects;
