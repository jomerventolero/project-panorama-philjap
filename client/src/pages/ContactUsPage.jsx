import React from 'react'
import ClientNavbar from '../components/ClientNavbar'
import EmailForm from '../components/EmailForm'

const ContactUsPage = () => {
  return (
    <div className="flex items-center p-8">
      <ClientNavbar />
      <div className="flex flex-col items-center justify-center max-h-screen pt-20">
        <EmailForm />
      </div>
    </div>
  )
}

export default ContactUsPage