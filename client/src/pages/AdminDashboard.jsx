import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import ProjectsList from '../components/ProjectsList';
import { auth } from '../firebase/auth'; // make sure to import your initialized firebase auth object

const AdminDashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if(user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
  
    // perform cleanup
    return () => unsubscribe();
  }, []); // empty dependency array
  

  return (
    <div className="pt-[120px] h-full w-full bg-cover bg-slate-900">
      <Navbar />
      <div className="flex w-screen h-screen justify-evenly ">
        <ProjectsList userId={userId} />
      </div>
    </div>
  )
};

export default AdminDashboard;
