import React, { useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';

const UploadComponent = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleImageChange = (event, index) => {
    const file = event.target.files[0];
    const newImages = [...images];
    newImages[index] = {
      title: '',
      file: file,
      preview: URL.createObjectURL(file),
      progress: 0,
    };
    setImages(newImages);
  };

  const handleTitleInputChange = (event, index) => {
    const newImages = [...images];
    newImages[index].title = event.target.value;
    setImages(newImages);
  };

  const handleAddImage = () => {
    const newImages = [...images, { title: '', file: null, preview: null, progress: 0 }];
    setImages(newImages);
  };

  const handleRemoveImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload images to Firebase Storage
    const storageRef = firebase.storage().ref();
    const imageUrls = await Promise.all(
      images.map(async (image, index) => {
        if (image.file) {
          const imageRef = storageRef.child(`images/${image.file.name}`);
          const uploadTask = imageRef.put(image.file);

          uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const newImages = [...images];
            newImages[index].progress = progress;
            setImages(newImages);
          });

          await uploadTask;

          const imageUrl = await imageRef.getDownloadURL();
          return imageUrl;
        }
      })
    );

    // Save data to Firestore
    const firestore = firebase.firestore();
    const projectRef = firestore
      .collection('projects')
      .doc(userId)
      .collection('project')
      .doc();

    await projectRef.set({
      title: title,
      description: description,
    });

    const imagesCollectionRef = projectRef.collection('images');
    imageUrls
      .filter(Boolean)
      .forEach((imageUrl, index) =>
        imagesCollectionRef.add({
          title: images[index].title,
          imageUrl: imageUrl,
        })
      );

    // Reset form fields
    setTitle('');
    setDescription('');
    setImages([]);
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-3xl text-white mb-4">Upload Component</h2>
      {uploadSuccess && (
        <div className="bg-green-500 text-white p-2 mb-4 rounded">Upload successful!</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="w-96 bg-gray-800 p-6 rounded shadow"
      >
        <div className="mb-4">
          <label
            htmlFor="title"
            className="text-white text-sm font-bold"
          >
            Project Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            required
            className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="text-white text-sm font-bold"
          >
            Project Description:
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={handleDescriptionChange}
            required
            className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded"
          />
        </div>
        <div className="mb-4">
          <h3 className="text-white text-lg font-bold mb-2">Images:</h3>
          {images.map((image, index) => (
            <div key={index} className="mb-2">
              <label
                htmlFor={`imageTitle-${index}`}
                className="text-white text-sm font-bold"
              >
                Image Title:
              </label>
              <input
                type="text"
                id={`imageTitle-${index}`}
                value={image.title}
                onChange={(event) => handleTitleInputChange(event, index)}
                required
                className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded"
              />
              <input
                type="file"
                onChange={(event) => handleImageChange(event, index)}
                required
                className="w-full px-3 py-2 text-gray-700 bg-gray-200 rounded"
              />
              {image.preview && (
                <img
                  src={image.preview}
                  alt="Preview"
                  className="w-full mt-2 rounded"
                />
              )}
              {image.progress > 0 && image.progress < 100 && (
                <div className="bg-blue-500 h-2 mt-2 rounded">
                  <div
                    className="bg-white h-full"
                    style={{ width: `${image.progress}%` }}
                  ></div>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="text-red-500 mt-2"
              >
                Remove Image
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddImage}
            className="text-blue-500 mb-2"
          >
            Add Image
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default UploadComponent;
