import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { firestore } from '../firebase/auth'; // Import your Firestore instance

const UploadComponent = ({ userId }) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      images: [{ imageTitle: '', imageFile: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const [formFields, setFormFields] = useState(fields);

  const onSubmit = async (data) => {
    try {
      const projectRef = firestore.collection('projects').doc(userId).collection('project').doc();
      const batch = firestore.batch();

      const project = {
        title: data.title,
        description: data.description,
      };

      batch.set(projectRef, project);

      const uploadPromises = data.images.map(async (img, index) => {
        const imageRef = projectRef.collection('images').doc();
        const file = img.imageFile && img.imageFile[0];
        if (file) {
          await uploadToWebDAV(file, imageRef.id);
          const imageUrl = `http://your-nas-ip/path/to/uploads/${imageRef.id}`; // Replace with your NAS WebDAV image URL
          const image = {
            imageTitle: img.imageTitle,
            imageUrl: imageUrl,
          };
          batch.set(imageRef, image);
        }
      });

      await Promise.all(uploadPromises);

      await batch.commit();

      console.log('Upload successful!');
    } catch (error) {
      console.error('Error uploading data:', error);
    }
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedFields = [...formFields];
    updatedFields[index].imageFile = [file];
    setFormFields(updatedFields);
  };

  const uploadToWebDAV = async (file, filename) => {
    const webdavUrl = 'http://your-nas-ip/webdav/path/to/uploads'; // Replace with your NAS WebDAV upload folder URL
    const credentials = 'username:password'; // Replace with your WebDAV credentials

    const formData = new FormData();
    formData.append('file', file);

    await fetch(`${webdavUrl}/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `Basic ${btoa(credentials)}`,
      },
      body: formData,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen text-white bg-slate-900">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md p-8 bg-glass">
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-300">
            Project Title:
          </label>
          <input
            type="text"
            {...register('title')}
            required
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-300">
            Project Description:
          </label>
          <input
            type="text"
            {...register('description')}
            required
            className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          />
        </div>

        {formFields.map((item, index) => (
          <fieldset key={item.id} className="mb-4">
            <div className="mb-2">
              <label className="block mb-2 text-sm font-bold text-gray-300">
                Image Title:
              </label>
              <input
                type="text"
                {...register(`images.${index}.imageTitle`)}
                required
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-2">
              <label className="block mb-2 text-sm font-bold text-gray-300">
                Image:
              </label>
              <input
                type="file"
                onChange={(e) => handleFileChange(e, index)}
                required
                className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              />
            </div>

            <button type="button" onClick={() => remove(index)} className="text-red-500">
              Remove Image
            </button>
          </fieldset>
        ))}

        <button
          type="button"
          onClick={() => append({ imageTitle: '', imageFile: null })}
          className="text-blue-500"
        >
          Add Image
        </button>

        <div className="flex items-center justify-center mt-4">
          <button
            type="submit"
            className="w-3/4 px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadComponent;
