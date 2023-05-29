import React, { useState } from 'react';
import { auth, app } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
      setError(null);
      console.log(isAdmin);
  
      const checkUserStatus = async () => {
        const user = app.auth().currentUser;
        if (user) {
          const userId = user.uid;
          const db = app.firestore();
  
          try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
              const isAdministrator = doc.data().isAdmin;
              setIsAdmin(isAdministrator);
  
              if (isAdministrator) {
                navigate('/dashboard-admin');
              } else {
                navigate('/dashboard-user');
              }
            } else {
              setIsAdmin(false);
              navigate('/dashboard-user');
            }
          } catch (error) {
            console.error('Error fetching user data:', error);
            setIsAdmin(false);
            navigate('/dashboard-user');
          }
        }
      };
  
      await checkUserStatus(); // Wait for the function to fetch admin status
    } catch (error) {
      setError(error.message);
      alert('Invalid email or password');
    }
  };
  

  return (
    <div className="flex flex-col justify-center">
      <form onSubmit={handleSignIn} className="flex flex-col gap-2 pt-20">
        <input
          className="p-3 m-3 rounded-full"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="p-3 m-3 rounded-full"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button type="submit" className="p-2 m-10 font-semibold bg-white rounded-full font-poppins">
          L O G I N
        </button>
        <div className="flex flex-row items-center justify-center gap-2 text-white font-poppins">
          <span>Don't have an account?</span>
          <a href="/register" className="font-semibold hover:text-blue-500">
            Register
          </a>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
