import React from 'react';
import { useLocation } from 'react-router-dom';
import ClientNavbar from '../components/ClientNavbar';
import EmailForm from '../components/EmailForm';

const ContactUsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get('userId');

  return (
    <div className="flex items-center justify-center">
      <ClientNavbar />
      <div className="flex flex-col items-center w-3/4 justify-center max-h-screen pt-28">
        <EmailForm userId={userId} />
      </div>
    </div>
  );
};

export default ContactUsPage;
