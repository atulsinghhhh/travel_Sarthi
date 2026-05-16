import React, { useState, useCallback } from 'react';
import { Upload, X, GripVertical } from 'lucide-react';

const ImageUploader = ({ images = [], onImagesChange, max = 10 }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [images]);

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(f => f.type.startsWith('image/'));
    
    if (images.length + validFiles.length > max) {
      alert(`You can only upload up to ${max} images.`);
      validFiles.splice(max - images.length);
    }

    const newImagesPromises = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ id: Math.random().toString(36).substring(7), file, preview: reader.result, isNew: true });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(newImagesPromises).then(newImages => {
      onImagesChange([...images, ...newImages]);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {images.length < max && (
        <div 
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            onChange={handleFileInput} 
            className="hidden" 
            id="image-upload" 
          />
          <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
            <Upload className="text-gray-400 mb-3" size={32} />
            <p className="text-sm font-bold text-gray-700">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max {max} images)</p>
          </label>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, index) => (
            <div key={img.id || index} className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square">
              <img src={img.preview || img} alt={`Upload ${index}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => removeImage(index)} 
                  className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {index === 0 && (
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Cover
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
