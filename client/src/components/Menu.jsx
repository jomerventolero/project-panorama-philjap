import React, { useState } from 'react';
import { FaHome, FaUser, FaCog, FaPowerOff, FaBars } from 'react-icons/fa';

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
        <div className="absolute right-0 w-48 py-2 mt-2 bg-gray-900 rounded-lg shadow-xl">
          <button className="block px-4 py-2 text-xl text-white hover:bg-gray-800">
            <FaHome className="inline-block mr-2 align-text-top" /> Home
          </button>
          <button className="block px-4 py-2 text-xl text-white hover:bg-gray-800">
            <FaUser className="inline-block mr-2 align-text-top" /> Profile
          </button>
          <button 
            className="block px-4 py-2 text-xl text-white hover:bg-gray-800"
            onClick={handleLogout}
          >
            <FaPowerOff className="inline-block mr-2 align-text-top" /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Menu;
