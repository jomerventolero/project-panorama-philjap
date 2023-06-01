import React from 'react';
import axios from 'axios';
import { useState } from 'react';

const RegisterForm = () => {
  const [toggle, setToggle] = useState(false);
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const handleRegister = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('profileImage', profileImage);

    axios
      .post(process.env.signup, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log(response.data);
        window.location.href = '/login';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleChange1 = (e) => {
    setPass1(e.target.value);
  };

  const handleChange2 = (e) => {
    setPass2(e.target.value);
    if (pass1 === pass2) {
      setToggle(true);
      console.log('True');
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  return (
    <div className="flex flex-col justify-center">
      <form onSubmit={handleRegister} className="flex flex-col pt-20">
        <input
          className="p-3 m-3 rounded-full"
          required
          type="email"
          id="email"
          placeholder="Email"
        />
        <input
          className="p-3 m-3 rounded-full"
          value={pass1}
          onChange={handleChange1}
          required
          type="password"
          id="password1"
          placeholder="Password"
        />
        <input
          onChange={handleChange2}
          value={pass2}
          className="p-3 m-3 rounded-full"
          required
          type="password"
          id="password2"
          placeholder="Confirm Password"
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="p-3 m-3 rounded-full"
          required
          id="profileImage"
        />
        <button
          type="submit"
          id="register"
          disabled={!toggle}
          className={`${
            toggle
              ? 'blur-none p-3 m-10 font-semibold bg-white rounded-full font-poppins'
              : 'drop-shadow-2xl p-3 m-10 font-semibold bg-white rounded-full font-poppins'
          } `}
        >
          REGISTER
        </button>
        <div className="text-white font-poppins">
          <span>Already have an account?</span>
          <a href="/" className="pl-2 font-semibold hover:text-blue-500">
            Login
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;