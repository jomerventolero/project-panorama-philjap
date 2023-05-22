import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'
import ProjectsList from '../components/ProjectsList';
import { auth } from '../firebase/auth'; // make sure to import your initialized firebase auth object

const AdminDashboard = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if(user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    console.log(userId);
  }, [userId]);

  return (
    <div className="pt-[120px] bg-slate-800">
      <Navbar />
      <div className="w-screen h-screen bg-slate-800">
        <ProjectsList userId={userId} />
      </div>
    </div>
  )
};

export default AdminDashboard;
