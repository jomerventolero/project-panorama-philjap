import React, { useEffect, useState } from 'react';
import { storage } from '../firebase'; // Replace with your Firebase configuration

const ProjectCollection = ({ userId }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch projects data for the given user from your backend or Firestore
    const fetchProjects = async () => {
      // Example data structure for projects: [{ name: 'Project 1', images: ['image1.jpg', 'image2.jpg', ...] }, ...]
      const projectsData = await fetchProjectsData(userId);
      setProjects(projectsData);
    };

    fetchProjects();
  }, [userId]);

  const fetchProjectsData = async (userId) => {
    // Fetch projects data for the given user from your backend or Firestore
    // Modify this function to suit your specific project data retrieval logic
    // Return an array of projects, where each project contains the project name and images

    // Example code:
    const projectsRef = storage.ref().child(`${userId}/`);
    const projectsList = await projectsRef.listAll();
    const projectsData = [];

    for (const projectItem of projectsList.items) {
      const projectName = projectItem.name;
      const images = await fetchProjectImages(userId, projectName);
      projectsData.push({ name: projectName, images });
    }

    return projectsData;
  };

  const fetchProjectImages = async (userId, projectName) => {
    // Fetch the images for a specific project from Firebase Storage
    // Modify this function to suit your specific image retrieval logic
    // Return an array of image URLs for the project

    // Example code:
    const projectRef = storage.ref().child(`${userId}/${projectName}/`);
    const imagesList = await projectRef.listAll();
    const images = [];

    for (const imageItem of imagesList.items) {
      const imageUrl = await imageItem.getDownloadURL();
      images.push(imageUrl);
    }

    return images;
  };

  return (
    <div className="project-collection-container">
      <div className="project-collection-row">
        {projects.map((project) => (
          <ProjectCard key={project.name} name={project.name} images={project.images} />
        ))}
      </div>
    </div>
  );
};

const ProjectCard = ({ name, images }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`project-card ${isHovered ? 'scale-110' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="project-card-thumbnail">
        {images.length > 0 && (
          <img
            src={images[0]} // Display the first image from the project
            alt={name}
            className={`project-card-image ${isHovered ? '' : 'blur'}`}
          />
        )}
      </div>
      <div className="project-card-name">{name}</div>
    </div>
  );
};

export default ProjectCollection;
