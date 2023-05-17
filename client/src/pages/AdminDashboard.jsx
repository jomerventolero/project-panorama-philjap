import React from 'react'
import Navbar from '../components/Navbar'
import PanoramaViewer from '../components/PanoramaViewer'

const AdminDashboard = () => {
  const src = "./img/sample.jpg"
  return (
    <div className="pt-[120px] bg-slate-900">
      <Navbar />
      <div>
        <PanoramaViewer image={src}/>
      </div>
    </div>
  )
};

export default AdminDashboard