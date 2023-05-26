import React, { useState, useEffect } from 'react';
import { auth, app } from '../firebase/auth';
import getUserData from '../api/getUserData';

async function updateUserData(userId, data) {
  const db = app.firestore();

  try {
    await db.collection('users').doc(userId).update(data);
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
}

function Profile() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      
      if (user) {
        try {
          const userData = await getUserData(user.uid);
          
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
          setProfileUrl(userData.profileUrl);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    
    fetchUserData();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const user = auth.currentUser;

    if (user) {
      setLoading(true);
      
      try {
        await updateUserData(user.uid, {
          firstName,
          lastName,
          profileUrl,
        });

        setLoading(false);
      } catch (error) {
        console.error('Error updating user data:', error);
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <label>
          First Name:
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </label>
        <label>
          Last Name:
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </label>
        <label>
          Profile Picture URL:
          <input type="text" value={profileUrl} onChange={(e) => setProfileUrl(e.target.value)} />
        </label>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Profile;
