import React from 'react'
import Navbar from '../components/Navbar'
import PanoramaUploader from '../components/PanoramaUploader'

const UploadPage = () => {
  return (
    <div className="w-screen h-screen bg-slate-700">
        <Navbar />
        <div className="pt-[100px]">
            <PanoramaUploader />
        </div>
    </div>
  )
}

export default UploadPage
