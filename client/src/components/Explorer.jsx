import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase/auth';
import ProfileCard from './ProfileCard';

const Explorer = () => {
  const [adminUsers, setAdminUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const adminUsersSnapshot = await firestore.collection('users').where('isAdmin', '==', true).get();
        const adminUsersData = adminUsersSnapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            ...userData,
            uid: doc.id,
          };
        });
        setAdminUsers(adminUsersData);
      } catch (error) {
        console.error('Error fetching admin users:', error);
      }
    };

    fetchAdminUsers();
  }, []);

  const handleProfileCardClick = (user) => {
    navigate(`/profile/${user.uid}`);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 pt-10">
        {adminUsers.map((user) => (
          <div key={user.uid} onClick={() => handleProfileCardClick(user)} className="cursor-pointer">
            <ProfileCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorer;
