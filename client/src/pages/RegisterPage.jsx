import React from 'react'
import RegisterForm from '../components/RegisterForm'
import { motion } from 'framer-motion'

import headmaster from "../assets/HeadMaster.png"
import display from "../assets/image1.jpg"

const RegisterPage = () => {
    

  return (
    <div className="flex justify-end bg-slate-900">
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition = {{
                type: "fade",
                delay: "1",
                duration: "4"
            }}
            className="flex flex-col items-center justify-center pr-[15%]">
            <img 
            src={headmaster} 
            alt="Streamline your reservations and elevate your professional profile with ease."
            className="w-full -mt-30"
            />
            <RegisterForm />
        </motion.div>
        <motion.div 
            initial={{ x: 900 }}
            animate={{ x: 0 }}
            transition={{ 
                type: "spring",
                delay: ".3",
                duration: ".8"
            }}
            className="">
            <img
            src={display}
            alt="Landing page display"
            className="w-full h-screen rounded-tl-[25%]"
            />
        </motion.div>
    </div>
  )
}

export default RegisterPage