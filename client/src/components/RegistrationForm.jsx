import React, { useState } from "react";
import axios from 'axios'

const RegistrationForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      axios.post('http://localhost:3000/signup', { email, password })
      .then(response => {
        console.log(response.data);
        window.location.href = '/';
      })
      .catch(error => {
        console.log(error);
      })
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleRegister} className="px-8 pt-6 pb-8 mb-4 bg-transparent rounded shadow-md">
        <h2 className="mb-6 text-2xl font-medium text-center text-white">Register</h2>
        {error && <div className="relative px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>}
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="email">
            Email Address
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="**********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 font-bold text-gray-700" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-full shadow appearance-none focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            type="password"
            placeholder="**********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
