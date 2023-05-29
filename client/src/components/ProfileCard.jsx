import React, { useEffect, useState } from 'react';
import defaultProfileImage from '../assets/default_profile.jpg';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const ProfileCard = ({ user }) => {
  const [profileUrl, setProfileUrl] = useState(defaultProfileImage);

  useEffect(() => {
    getProfileUrl(user);
  }, [user]);

  const getProfileUrl = (user) => {
    if (user && user.uid) {
      const storage = getStorage();
      const storageRef = ref(storage, `${user.profileUrl}`);

      getDownloadURL(storageRef)
        .then((downloadUrl) => {
          setProfileUrl(downloadUrl);
        })
        .catch((error) => {
          console.error('Error getting profile image URL:', error);
          console.log('No profile picture found');
        });
    } else {
      console.log('No profile picture found');
    }
  };

  return (
      <div className="max-w-xl px-4 mx-auto overflow-hidden rounded-lg shadow-lg cursor-pointer hover:bg-gray-600 bg-glass">
        <div className="px-4 py-6">
          <img src={profileUrl} alt="Profile" className="w-32 h-32 mx-auto rounded-full" />
          <h2 className="mt-4 text-2xl font-bold text-center text-white">{user ? user.firstName : ''}</h2>
          <p className="text-center text-gray-400">Engr. {user ? user.lastName : ''}</p>
        </div>
        <div className="px-4 py-3">
          <p className="text-gray-700">{user ? user.bday : ''}</p>
        </div>
      </div>
  );
};

export default ProfileCard;
