import React, { useState } from 'react';
import { FaHome, FaUser, FaBars } from 'react-icons/fa';
import logout_img from "../assets/logout.png"

const Menu = ({logout}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    try {
        logout();
        console.log('Logged out');
    } catch (error) {
        console.log(error);
    }
  };

  return (
    <div className="relative">
      <button 
        className="p-4 text-xl text-white bg-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBars />
      </button>

      {isOpen && (
        <div className="absolute right-0 w-40 mt-2 bg-gray-900 rounded-lg shadow-xl bg-glass">
          <button className="flex items-center justify-start px-2 py-1 text-xl text-white hover:bg-gray-400 hover:rounded-l-lg hover:text-blue-500">
            <FaHome className="inline-block w-6 h-6 mr-2 align-text-top " />
            <span>Home</span>
          </button>
          <button className="flex items-center justify-start px-2 py-1 text-xl text-white hover:bg-gray-400 hover:text-blue-500 hover:rounded-l-lg">
            <FaUser className="inline-block w-6 h-6 mr-2 align-text-top"  />
            <span>Profile</span>
          </button>
          <button 
            className="flex items-center justify-start px-2 py-1 text-xl text-white hover:bg-gray-400 hover:rounded-l-lg hover:text-blue-500"
            onClick={handleLogout}
          >
            <img src={logout_img} className="inline-block w-6 h-6 mr-2 align-text-top" /> 
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
