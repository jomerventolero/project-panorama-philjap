import React from 'react'
import Navbar from '../components/Navbar'
import PanoramaView from '../components/PanoramaView'

const AdminDashboard = () => {
  return (
    <div className="pt-[120px] bg-slate-900">
      <Navbar />
      <div>
        <PanoramaView />
      </div>
    </div>
  )
}

export default AdminDashboard