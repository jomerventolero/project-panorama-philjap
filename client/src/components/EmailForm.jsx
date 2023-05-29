import React, { useState } from 'react';
import axios from 'axios';
import classnames from 'classnames';

const EmailForm = () => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'to') {
      setTo(value);
    } else if (name === 'subject') {
      setSubject(value);
    } else if (name === 'text') {
      setText(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);

    try {
      await axios.post('http://localhost:3002/send-email', {
        to,
        subject,
        text,
      });
      setIsSent(true);
      setError(null);
    } catch (error) {
      setIsSent(false);
      setError('An error occurred while sending the email');
    }

    setIsSending(false);
  };

  return (
    <div className="max-w-md p-6 mx-auto text-white bg-gray-900 rounded-lg shadow-lg">
      <h2 className="mb-4 text-2xl font-bold">Send Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="to" className="block mb-1">
            To:
          </label>
          <input
            type="email"
            id="to"
            name="to"
            value={to}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="subject" className="block mb-1">
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={subject}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="text" className="block mb-1">
            Message:
          </label>
          <textarea
            id="text"
            name="text"
            value={text}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 text-gray-200 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className={classnames(
            'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
            { 'opacity-50 cursor-not-allowed': isSending }
          )}
          disabled={isSending}
        >
          {isSending ? 'Sending...' : 'Send Email'}
        </button>
        {isSent && <p className="mt-2 text-green-500">Email sent successfully!</p>}
        {error && <p className="mt-2 text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default EmailForm;
