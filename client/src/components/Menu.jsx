import React, { useState, useEffect } from 'react';
import { FaTruckLoading } from 'react-icons/fa';
import logout_img from "../assets/logout.png"
import default_profile_img from "../assets/default_profile.jpg";
import { auth } from '../firebase/auth';
import axios from 'axios';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const Menu = ({ logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const storage = getStorage();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      getProfileUrl(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    try {
      logout();
      console.log('Logged out');
    } catch (error) {
      console.log(error);
    }
  };

  const getProfileUrl = (user) => {
    if (user) {
      user.getIdToken(true).then((idToken) => {
        axios
          .get(`http://localhost:3002/getProfile/${user.uid}`, {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          })
          .then((res) => {
            const profileImageUrl = res.data.profileUrl;
            if (profileImageUrl) {
              const storageRef = ref(storage, profileImageUrl);
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
          })
          .catch((err) => {
            console.log(err);
            console.log('No profile picture found');
          });
      });
    }
  };

  return (
    <div className="relative">
      <button 
        className="p-1 text-xl text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {profileUrl ? (
          <img
            src={profileUrl}
            alt="profile"
            className="w-[48px] rounded-full z-10"
          />
        ) : (
          <img
            src={default_profile_img}
            alt="default-profile"
            className="w-[48px] rounded-full z-10"
          />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 items-center w-40 mt-2 rounded-lg shadow-xl bg-glass">
          <a href="/dashboard-admin" className="flex items-center justify-start px-2 py-1 text-xl text-white hover:bg-gray-400 hover:rounded-xl hover:text-blue-500">
            <FaTruckLoading className="inline-block w-6 h-6 mr-2 align-text-top" />
            <span>Reload</span>
          </a>
          <a
            className="flex items-center justify-start px-2 py-1 text-xl text-white cursor-pointer hover:bg-gray-400 hover:rounded-xl hover:text-blue-500"
            onClick={handleLogout}
          >
            <img src={logout_img} className="inline-block w-6 h-6 mr-2 align-text-top" /> 
            <span>Logout</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default Menu;
