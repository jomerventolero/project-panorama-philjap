import { useState, useEffect } from 'react';
import ClientNavbar from '../components/ClientNavbar';
import ProfilePictureUpload from '../components/ProfilePictureUpload'
import { auth } from '../firebase/auth';

const ProfileEdit = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user && ( // Add conditional check for user object
        user.isAdmin ? <Navbar /> : <ClientNavbar />
      )}
      <ProfilePictureUpload />
    </div>
  );
};

export default ProfileEdit;
