import React from 'react';
import PanoramaViewer from '../components/PanoramaViewer';

const TestDashboard = () => {
  const panoramaPath = '../utils/img/sample.jpg'; 

  return (
    <div>
      <h1>My Panorama Viewer</h1>
      <PanoramaViewer imagePath={panoramaPath} />
    </div>
  );
};

export default TestDashboard;
