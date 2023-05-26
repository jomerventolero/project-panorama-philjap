import { app } from '../firebase/auth';

async function getUserData(userId) {
  const db = app.firestore();

  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    return {
      firstName: userData.firstName,
      profileUrl: userData.profileUrl,
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
}

export default getUserData;
