import React, { useState } from 'react';
import axios from 'axios';
import { useForm, useFieldArray } from 'react-hook-form';

const UploadComponent = ({ userId }) => {
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      images: [{ imageTitle: '', imageDescription: '', imageFile: null }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'images',
  });

  const [formFields, setFormFields] = useState(fields);

  const onSubmit = async (data) => {
    const formData = new FormData();
  
    data.images.forEach((img, index) => {
      formData.append(`images[${index}][title]`, img.imageTitle);
      formData.append(`images[${index}][description]`, img.imageDescription);
      if (img.imageFile && img.imageFile[0]) {
        formData.append(`images[${index}][file]`, img.imageFile[0]);
      }
    });
  
    formData.append('uid', userId);
    formData.append('title', data.title);
    formData.append('description', data.description);
  
    const response = await axios.post('http://localhost:3002/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    console.log(response.data);
  };
  

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const updatedFields = [...formFields];
    updatedFields[index].imageFile = file;
    setFormFields(updatedFields);
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
            {...register("title")} 
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
            {...register("description")} 
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
          onClick={() => append({ imageTitle: '', imageDescription: '', imageFile: null })} 
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
