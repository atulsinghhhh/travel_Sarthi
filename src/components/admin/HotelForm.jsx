import React, { useState } from 'react';
import Modal from '../Modal';
import { useForm } from 'react-hook-form';
import ImageUploader from './ImageUploader';

const HotelForm = ({ isOpen, onClose, hotel = null, onSuccess }) => {
  const { register, handleSubmit, reset } = useForm({ defaultValues: hotel || {} });
  const [images, setImages] = useState(hotel?.images ? JSON.parse(hotel.images) : []);

  const onSubmit = (data) => {
    // API logic to save hotel
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={hotel ? "Edit Hotel" : "Add Hotel"} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Name</label>
          <input {...register('name')} className="w-full border border-gray-200 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <ImageUploader images={images} onImagesChange={setImages} />
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg">Save Hotel</button>
        </div>
      </form>
    </Modal>
  );
};
export default HotelForm;
