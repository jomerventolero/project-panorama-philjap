import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ContactUsPage from './pages/ContactUsPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import UploadPage from './pages/UploadPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css'
import ProjectsList from './components/ProjectsList';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/aboutus" element={<ContactUsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
