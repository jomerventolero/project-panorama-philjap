import React from 'react';
import { useState } from 'react'
import { auth } from '../firebase/auth'

function LoginForm() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSignIn = async (e) => {
        e.preventDefault();
    
        try {
          await auth.signInWithEmailAndPassword(email, password);
          setEmail('');
          setPassword('');
          window.location.href = '/dashboard';
        } catch (error) {
          setError(error.message);
          alert("Invalid email or password");
        }
      };
      
  return (
    <div className="flex flex-col justify-center">
        <form onSubmit={handleSignIn} className="flex flex-col gap-2 pt-20">
            <input 
                className="p-3 m-3 rounded-full"
                type="email" 
                id='email' 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"/>
            <input 
                className="p-3 m-3 rounded-full"
                type="password" 
                id='password' 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"/>
            <button 
                type="submit"
                className="p-2 m-10 font-semibold bg-white rounded-full font-poppins"
                >L O G I N</button>
            <div className="text-white font-poppins">
                <span>Don't have an account?</span>
                <a href='/register'
                    className="font-semibold hover:text-blue-500"
                    > Register</a>
            </div>
        </form>
    </div>
  );
}

export default LoginForm;