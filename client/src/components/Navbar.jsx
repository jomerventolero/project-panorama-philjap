/**
 * This is a React component for a navbar that includes a logo, an upload link, and a logout button
 * that uses Firebase authentication.
 */
import React from 'react'
import logo from '../assets/logo.png'
import { useState, useEffect } from 'react'
import { auth } from '../firebase/auth'

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
  return (
    <div className="fixed top-0 flex flex-row justify-between w-full gap-2 px-2 py-2 bg-slate-900">
      <div>
        <a className="" href="/">
          <img src={logo} alt="Philjap Logo" className="w-[78px]"/>
        </a>
      </div>
      <div 
        className="flex flex-row gap-4 font-medium"
      >
        <a href="/upload"
          className="self-center text-white align-middle hover:text-blue-500"
        >
          Upload
        </a>
        {user ? 
          ( <button 
            className="px-4 py-1 text-white border-2 rounded-lg border-violet-500 hover:text-violet-500"  
            onClick={logout}>Logout</button> ) : 
          ( null )
        }
      </div>
      
    </div>
  )
}

export default Navbar