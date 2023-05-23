/**
 * This is a React component for a navbar that includes a logo, an upload link, and a logout button
 * that uses Firebase authentication.
 */
import React from 'react'
import logo from '../assets/logo.png'
import { useState, useEffect } from 'react'
import { auth } from '../firebase/auth'
import axios from 'axios'
import upload from '../assets/upload.png'
import logout_img from '../assets/logout.png'

const Navbar = () => {
  const [firstName, setFirstName] = useState(null);
  const [user, setUser] = useState(null);

  const logout = () => {
    auth.signOut(auth)
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
      getFirstName(user); // Update the getFirstName call to pass in the user
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);
  
  const getFirstName = (user) => {
    if (user) { // Only make the request if the user is logged in
      user.getIdToken(true)
        .then((idToken) => {
          axios.get('http://localhost:3002/user', {
            headers: {
              Authorization: `Bearer ${idToken}`,
            },
          })
          .then(res => {
            console.log(res.data);
            setFirstName(res.data.firstName);
          })
          .catch(err => {
            console.log(err);
          });
        });
    }
  }

  return (
    <div className="fixed top-0 flex flex-row justify-between w-full gap-2 px-2 py-2 bg-slate-900">
      <div className="flex flex-row gap-4">
        <a className="" href="/">
          <img src={logo} alt="Philjap Logo" className="w-[78px]"/>
        </a>
      </div>
      <a href="/dashboard" className="mx-auto">
          <span className='px-8 pt-4 font-medium text-white align-middle'>{firstName}</span>
      </a>
      <div 
        className="flex flex-row gap-4 font-medium"
      >
        <a href="/upload">
          <img src={upload} alt="upload" className="w-[48px] pt-1 self-center align-middle"/>
        </a>
        
        {user ? 
          ( <a onClick={logout}>
            <img src={logout_img} alt="upload" className="cursor-pointer w-[48px] pt-1 self-center align-middle"/>
            </a>) : 
          ( null )
        }
      </div>
      
    </div>
  )
}

export default Navbar