import React from 'react'
import logo from '../assets/logo.png'


import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useState, useEffect } from 'react'
import { auth, app } from '../firebase/auth'


import axios from 'axios'
import upload from '../assets/upload.png'
import chat from '../assets/chat.png'
import Menu from './Menu'

const Navbar = () => {
  const [firstName, setFirstName] = useState(null);
  const [user, setUser] = useState(null);
  const [profileUrl, setProfileUrl] = useState('');
  const storage = getStorage();

  const logout = () => {
    auth.signOut()
      .then(() => {
        window.location.href = '/';
      })
      .catch((error) => {
        console.error(error);
        alert('An error occurred while logging out');
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      getFirstName(user);
    });

    return () => unsubscribe();
  }, []);

  const getFirstName = (user) => {
    if (user) { 
      user.getIdToken(true)
        .then((idToken) => {
          axios.get('http://localhost:3002/user', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          })
          .then(res => {
            setFirstName(res.data.firstName);
          })
          .catch(err => {
            console.log(err);
          });
        });
    }
  }



  return (
    <div className="fixed top-0 z-50 flex flex-row justify-between w-full gap-2 px-2 py-2 bg-slate-900">
      <div className="flex flex-row gap-4">
        <a className="" href="/dashboard-admin">
          <img src={logo} alt="Philjap Logo" className="w-[78px]"/>
        </a>
      </div>
      <a href="/dashboard-admin" className="self-center mx-auto">
          <span className='px-8 pt-4 font-medium text-white align-middle'>Engr. {firstName}</span>
      </a>
      <div className="flex flex-row gap-4 font-medium">
        <a href="/chat">
          <img src={chat} alt="chat" className="w-[48px] pt-1 self-center align-middle"/>
        </a>
        <a href="/upload">
          <img src={upload} alt="upload" className="w-[48px] pt-1 self-center align-middle"/>
        </a>
        
        {user ? 
          ( <Menu logout={logout} /> ) : 
          ( null )
        }
      </div>
    </div>
  )
}

export default Navbar;