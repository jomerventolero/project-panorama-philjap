import React from 'react'
import { HashLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
        <HashLoader color="#00FFFF" size={15} />
    </div>
  )
}

export default Loader