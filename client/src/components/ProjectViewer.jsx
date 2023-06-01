import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import CardIndvComp from './CardIndvComp';
import PanoramaViewer from './PanoramaViewer';
import Navbar from './Navbar';
import ClientNavbar from './ClientNavbar';
import { firestore } from '../firebase/auth';

const ProjectViewer = () => {
  const { projectId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [projectTitle, setProjectTitle] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const imageContainerRef = useRef(null);
  const scrollStep = 400; // Number of pixels to scroll

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the userId from the URL
        const userIdFromUrl = searchParams.get('userId');
        setUserId(userIdFromUrl);

        // Fetch the user's data from Firestore to determine if they are an admin
        const userDoc = await firestore.collection('users').doc(userIdFromUrl).get();
        const userData = userDoc.data();
        if (userData && userData.isAdmin) {
          setIsAdmin(true);
        }

        if (userIdFromUrl) {
          // Fetch the project images using the userId
          const response = await axios.get(`http://localhost:3002/api/projects/images/${projectId}/${userIdFromUrl}`);
          setImages(response.data.images);
        }

        // Get project title from URL
        const projectTitleFromUrl = searchParams.get('projectTitle');
        if (projectTitleFromUrl) {
          setProjectTitle(decodeURIComponent(projectTitleFromUrl));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleScrollLeft = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollLeft -= scrollStep;
    }
  };

  const handleScrollRight = () => {
    if (imageContainerRef.current) {
      imageContainerRef.current.scrollLeft += scrollStep;
    }
  };

  const handleDeleteProject = async () => {
    try {
      // Delete the project document
      const userRef = firestore.collection('projects').doc(userId);
      const projectRef = userRef.collection('project').doc(projectId);
      await projectRef.delete();

      // Redirect to a different page or perform any necessary action
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Check if userIdFromUrl exists before rendering the component
  if (!userId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-[500px]">
      {isAdmin ? <ClientNavbar /> : <Navbar />}
      <div className="pt-[150px] flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold text-white">{projectTitle}</h1>
        {selectedImage && <PanoramaViewer image={selectedImage} />}
      </div>
      <div className="flex flex-row relative justify-center items-center h-full w-full px-2 pt-[50px] bg-slate-900">
        <button
          className="absolute left-0 top-1/2 text-[32px] transform -translate-y-1/2 z-20 bg-white p-2 rounded-r-md shadow"
          onClick={handleScrollLeft}
        >
          &lt;
        </button>
        <button
          className="absolute right-0 top-1/2 text-[32px] transform -translate-y-1/2 z-20 bg-white p-2 rounded-l-md shadow"
          onClick={handleScrollRight}
        >
          &gt;
        </button>

        <div
          className="z-10 flex flex-row justify-between overflow-y-hidden gap-36 scrollbar-thin"
          ref={imageContainerRef}
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((image, index) => (
            <div className={`w-1/4 hover:z-10 ${selectedImage === image.imageUrl ? '' : ''}`} key={index}>
              <CardIndvComp image={image} onClick={() => handleCardClick(image.imageUrl)} />
            </div>
          ))}
        </div>
      </div>

      {isAdmin && (
        <button
          onClick={handleDeleteProject}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete Project
        </button>
      )}
    </div>
  );
};

export default ProjectViewer;
