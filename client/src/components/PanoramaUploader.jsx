import React, { useState } from 'react';
import axios from 'axios';

const PanoramaUploader = () => {
  const [projectName, setProjectName] = useState('');
  const [views, setViews] = useState([{ title: '', description: '', image: null }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProjectNameChange = (e) => {
    setProjectName(e.target.value);
  };

  const handleViewChange = (index, field, value) => {
    const newViews = [...views];
    newViews[index][field] = value;
    setViews(newViews);
  };

  const addView = () => {
    setViews([...views, { title: '', description: '', image: null }]);
  };

  const removeView = (index) => {
    setViews(views.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    setError('');

    if (projectName.trim() === '') {
      setError('Please enter a project name.');
      return;
    }

    if (views.some(view => view.title.trim() === '' || view.description.trim() === '' || view.image === null)) {
      setError('Please fill in all fields for each view.');
      return;
    }

    // Validate image size before upload
    for (const view of views) {
      // Check if image is undefined before accessing its size property
      if (!view.image || view.image.size > 500000000) { // 50MB
        setError('Each image should be smaller than 50MB and should be uploaded.');
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('projectName', projectName.trim());
      views.forEach((view, index) => {
        formData.append(`titles[${index}]`, view.title.trim());
        formData.append(`descriptions[${index}]`, view.description.trim());
        if(view.image) { // check if image exists before appending
          formData.append(`images[${index}]`, view.image);
        }
      });

      // Move axios request to an asynchronous function
      const uploadImage = async () => {
        await axios.post('http://localhost:3002/upload', formData);
      }

      // Execute function
      await uploadImage();

      setProjectName('');
      setViews([{ title: '', description: '', image: null }]);
    } catch (error) {
      console.error(error);
      setError('Error uploading images. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  
  

  return (
    <div className="max-w-md p-4 mx-auto text-white bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold">Upload Project</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Project Name"
          className="w-full px-3 py-2 mb-2 text-gray-800 bg-white rounded"
          value={projectName}
          onChange={handleProjectNameChange}
        />
        {views.map((view, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full px-3 py-2 mb-2 text-gray-800 bg-white rounded"
              value={view.title}
              onChange={(e) => handleViewChange(index, 'title', e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="w-full px-3 py-2 mb-2 text-gray-800 bg-white rounded"
              rows={4}
              value={view.description}
              onChange={(e) => handleViewChange(index, 'description', e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 text-gray-800 bg-white rounded"
              onChange={(e) => handleViewChange(index, 'image', e.target.files[0])}
            />
            <button
              className="px-4 py-2 mt-4 text-white bg-red-500 rounded hover:bg-red-700 focus:outline-none focus:shadow-outline"
              onClick={() => removeView(index)}
            >
              Remove this view
            </button>
          </div>
        ))}
        <button
          className="px-4 py-2 mt-4 text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:shadow-outline"
          onClick={addView}
        >
          Add another view
        </button>
        <button
          className="px-4 py-2 mt-4 ml-4 text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default PanoramaUploader;
