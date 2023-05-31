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
import ProjectViewer from './components/ProjectViewer';
import ClientProjectView from './components/ClientProjectView';
import ClientDashboardPage from './pages/ClientDashboardPage';
import './index.css'


const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact/:userId" element={<ContactUsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard-admin" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard-user" element={<ProtectedRoute><ClientDashboardPage /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/projects/:projectId" element={<ProjectViewer />} />
        <Route path="/profile/:userId" element={<ClientProjectView />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
