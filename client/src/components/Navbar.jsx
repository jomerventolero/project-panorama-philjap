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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    // Clean up the subscription when the component unmounts
    return () => unsubscribe();
  }, []);
  
  const [firstName, setFirstName] = useState("")

  useEffect(() => {
    getFirstName()
  }, [])
  
  const getFirstName = () => {
    const user = auth.currentUser;
      axios.get(`http://localhost:3002/user`) 
      .then (res => {
        console.log(res.data)
        setFirstName(res.data.firstName)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="fixed top-0 flex flex-row justify-between w-full gap-2 px-2 py-2 bg-slate-900">
      <div className="flex flex-row gap-4">
        <a className="" href="/">
          <img src={logo} alt="Philjap Logo" className="w-[78px]"/>
        </a>
        <span className='font-medium text-white'>{firstName}</span>
      </div>
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