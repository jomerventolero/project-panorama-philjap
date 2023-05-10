import React from 'react';




function LoginForm() {
  return (
    <div className="flex flex-col justify-center">
        <form className="flex flex-col gap-2 pt-20">
            <input 
                className="rounded-full p-3 m-3"
                type="email" id='email' placeholder="Email"/>
            <input 
                className="rounded-full p-3 m-3"
                type="password" id='password' placeholder="Password"/>
            <button type="submit"
                className="p-2 m-10 font-poppins font-semibold rounded-full bg-white"
                >L O G I N</button>
            <div className="text-white font-poppins">
                <span>Don't have an account?</span>
                <a href='/register'
                    className="hover:text-blue-500 font-semibold"
                    > Register</a>
            </div>
        </form>
    </div>
  );
}

export default LoginForm;