// ProjectCard.js
import React from 'react';
import { motion } from "framer-motion";
import { useHistory } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/project/${project.id}`);
  }

  const cardVariants = {
    hidden: { y: '-30vh', opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  }

  return (
    <motion.div 
      className="overflow-hidden rounded shadow-lg cursor-pointer"
      variants={cardVariants}
      onClick={handleClick}
    >
      <img className="w-full" src={project.images[0].imageUrl} alt="Project" />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold">{project.title}</div>
        <p className="text-base text-gray-700">{project.description}</p>
      </div>
    </motion.div>
  );
}

export default ProjectCard;
