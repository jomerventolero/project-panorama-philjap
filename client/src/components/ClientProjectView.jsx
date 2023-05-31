import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import axios from 'axios';
import CardComponent from './CardComponent';
import ClientNavbar from './ClientNavbar';
import { firestore } from '../firebase/auth';

const ClientProjectView = () => {
  const { userId } = useParams();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [firstName, setFirstName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (projects.length === 0) {
          const response = await axios.get(`http://localhost:3002/api/projects/${userId}`);
          setProjects(response.data);
          setIsLoading(false);
        }
      } catch (error) {
        setError(error.message);
        setIsLoading(false);
      }
    };
  
    if (userId) {
      fetchData();
    }
  }, [userId]);
  

  useEffect(() => {
    const fetchFirstName = async () => {
      try {
        const userDoc = await firestore.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData) {
          setFirstName(userData.firstName);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchFirstName();
    }
  }, [userId]);

  const handleCardClick = (projectId, projectTitle) => {
    navigate(`/projects/${projectId}/?userId=${userId}&projectTitle=${projectTitle}`);
  };

  const handleContact = () => {  
    navigate(`/contact/?userId=${userId}`);
  };

  if (isLoading) {
    return (
      <div>
        <ClientNavbar />
        <div className="flex gap-8 py-2 -z-10 flex-nowrap">
          {Array(5)
            .fill()
            .map((item, index) => (
              <div key={index} className="w-64 h-64 m-3 rounded-md">
                <Skeleton height={100} />
                <Skeleton height={50} />
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <ClientNavbar />
      <div className="flex flex-col items-center justify-center">
        <h1 className="pt-20 text-2xl font-bold text-blue-300">Engr. {firstName}</h1>
        <span className="font-normal text-white">Projects Directory 📁</span>
      </div>
      <button className="px-4 py-2 mt-6 font-medium text-white border-2 border-blue-400 rounded-full" onClick={handleContact}>Contact {firstName} 📨</button>
      <div className="z-40 flex justify-center h-full gap-8 py-2 pt-20 flex-nowrap">
        {projects.map((project, index) => (
          <CardComponent
            key={index}
            project={project}
            onClick={() => handleCardClick(project.id, project.title)}
          />
        ))}
      </div>
    </div>
  );
};

export default ClientProjectView;
