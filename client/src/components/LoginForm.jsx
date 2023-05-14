/* This is a React component that defines a login form. It imports the `React` library and the
`useState` hook from the `react` package, as well as an `auth` object from a Firebase authentication
module. The component uses the `useState` hook to manage the state of the email and password input
fields. It defines a `handleSignIn` function that is called when the form is submitted, which
attempts to sign in the user using the `auth` object and sets the email and password fields to empty
strings. If there is an error, it sets an error message and displays an alert. The component returns
a form with email and password input fields, a login button, and a link to a registration page. */
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
            <div className="flex flex-row items-center justify-center gap-2 text-white font-poppins">
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