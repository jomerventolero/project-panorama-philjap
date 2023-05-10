import React from 'react'
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <div className="fixed top-0 flex flex-row justify-between w-full gap-2 px-2 py-2 bg-slate-900">
      <div>
        <a className="" href="/">
          <img src={logo} alt="Philjap Logo" className="w-[78px]"/>
        </a>
      </div>
      <div>
        <a href="/upload"
          className="pt-8 font-medium text-white hover:text-blue-500"
        >
          Upload
        </a>
      </div>
      
    </div>
  )
}

export default Navbar