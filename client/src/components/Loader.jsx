import React from 'react'
import { HashLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-slate-800">
        <HashLoader color="#36d7b7" />
    </div>
  )
}

export default Loader