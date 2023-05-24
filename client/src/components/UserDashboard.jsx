// UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProjectCard from './ProjectCard';
import { motion } from "framer-motion";
import { collection, getDocs, query, where } from '@firebase/firestore';

const UserDashboard = ({ userId }) => {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const db = getFirestore();
        const projectsCol = collection(db, 'projects');
        const q = query(projectsCol, where('userId', '==', userId));
        const projectSnapshots = await getDocs(q);
        const projectsData = projectSnapshots.docs.map(doc => doc.data());
        setProjects(projectsData);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    }

    getProjects();
  }, [userId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.5, duration: 1.5 }}
  }

  return (
    <motion.div 
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))
      )}
    </motion.div>
  )
}

export default UserDashboard;
