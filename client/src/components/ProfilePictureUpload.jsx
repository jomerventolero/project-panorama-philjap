import React, { useState } from 'react';
import { firestore } from '../firebase/auth';

const ProfilePictureUpload = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfileImage(file);
  };

  const handleUpload = async () => {
    if (profileImage) {
      const storageRef = firestore.storage().ref();
      const imageRef = storageRef.child(`profile-images/${profileImage.name}`);
      const uploadTask = imageRef.put(profileImage);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          setUploadError('Failed to upload image. Please try again.');
          console.error(error);
        },
        () => {
          // Upload completed successfully
          imageRef.getDownloadURL().then((downloadUrl) => {
            // Save the profile image URL to Firestore
            const userId = firestore.auth().currentUser.uid;
            firestore.collection('users').doc(userId).update({
              profileUrl: downloadUrl,
            });

            setUploadSuccess(true);
            setProfileImage(null);
            setUploadProgress(0);
            setTimeout(() => {
              setUploadSuccess(false);
            }, 3000);
          });
        }
      );
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      {profileImage && (
        <img
          src={URL.createObjectURL(profileImage)}
          alt="Profile"
          className="w-full mb-4 rounded"
        />
      )}
      {uploadProgress > 0 && (
        <progress
          value={uploadProgress}
          max="100"
          className="w-full mb-4"
        ></progress>
      )}
      {uploadError && <div className="text-red-500 mb-4">{uploadError}</div>}
      {uploadSuccess && (
        <div className="text-green-500 mb-4">Image uploaded successfully.</div>
      )}
      <button
        onClick={handleUpload}
        className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded"
        disabled={!profileImage}
      >
        Upload Image
      </button>
    </div>
  );
};

export default ProfilePictureUpload;
