import React, { useState, useEffect } from 'react';
import emailjs from 'emailjs-com';
import classnames from 'classnames';
import { firestore, auth } from '../firebase/auth';

const EmailForm = ({ userId }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(null);
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    const fetchReceiverEmail = async () => {
      try {
        const userDoc = await firestore.collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (userData && userData.email) {
          setTo(userData.email);
        }
      } catch (error) {
        console.error('Error fetching receiver email:', error);
      }
    };

    if (userId) {
      fetchReceiverEmail();
    }
  }, [userId]);

  useEffect(() => {
    const fetchSenderName = async () => {
      try {
        const userDoc = await firestore.collection('users').doc(auth.currentUser.uid).get();
        const userData = userDoc.data();
        if (userData && userData.firstName) {
          setSenderName(userData.firstName);
        }
      } catch (error) {
        console.error('Error fetching sender name:', error);
      }
    };

    if (auth.currentUser) {
      fetchSenderName();
    }
  }, []);

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
      await emailjs.send('service_zjcigin', 'template_ft1grju', {
        to_email: to,
        from_name: senderName,
        subject,
        message: text,
      }, '4b35hCQFivBvVPHWY');
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
          className={classnames('bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded', {
            'opacity-50 cursor-not-allowed': isSending,
          })}
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
