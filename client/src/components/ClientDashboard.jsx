import React, { useEffect, useState } from 'react';
import { db } from './firebase'; // Your Firebase configuration file
import CardComponentProfile from './CardComponentProfile';
import CardComponent from './CardComponent';

const ClientDashboard = () => {
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [projects, setProjects] = useState([]);
  
  useEffect(() => {
    const fetchAdmins = async () => {
      const adminsSnapshot = await db.collection('admins').get();
      const adminsData = adminsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminsData);
    }

    fetchAdmins();
  }, []);

  const handleAdminClick = async (adminId) => {
    setSelectedAdmin(adminId);
    const projectsSnapshot = await db.collection('admins').doc(adminId).collection('projects').get();
    const projectsData = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(projectsData);
  }

  return (
    <div>
      <div className="AdminsList">
        {admins.map(admin => (
          <CardComponentProfile key={admin.id} admin={admin} onClick={() => handleAdminClick(admin.id)} />
        ))}
      </div>
      {selectedAdmin && (
        <div className="ProjectsList">
          {projects.map(project => (
            <CardComponent key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
