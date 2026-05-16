import React, { useState } from 'react';
import Modal from './Modal';
import StarRating from './StarRating';
import { useToast } from '../context/ToastContext';
import { packageService } from '../services/package.service';
import { Upload, X } from 'lucide-react';

const ReviewForm = ({ isOpen, onClose, packageId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      showToast('Maximum 3 images allowed', 'error');
      return;
    }

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }
    if (comment.length < 20) {
      showToast('Comment must be at least 20 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      await packageService.postReview({
        package_id: packageId,
        rating,
        title,
        comment,
        images
      });
      showToast('Review submitted successfully!', 'success');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to submit review', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Write a Review">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center mb-6">
          <p className="text-sm font-bold text-gray-700 mb-2">How was your experience?</p>
          <StarRating rating={rating} setRating={setRating} interactive={true} size={32} />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="Summarize your experience"
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Review ({comment.length} chars)</label>
          <textarea 
            value={comment} 
            onChange={(e) => setComment(e.target.value)} 
            placeholder="Tell us about the trip... (min 20 chars)"
            rows="4"
            required
            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Add Photos (Max 3)</label>
          {images.length < 3 && (
            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors text-center">
              <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-sm text-gray-500 font-medium">Click to upload or drag and drop</p>
            </div>
          )}
          
          {images.length > 0 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </Modal>
  );
};

export default ReviewForm;
