import React, { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const validImages = images.length > 0 ? images : ['https://via.placeholder.com/800x400?text=No+Image+Available'];
  const [mainImage, setMainImage] = useState(validImages[0]);

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-64 md:h-[450px] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 relative group">
        <img src={mainImage} alt="Package view" className="w-full h-full object-cover transition-opacity duration-300" />
      </div>
      
      {validImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {validImages.map((img, index) => (
            <button 
              key={index}
              onClick={() => setMainImage(img)}
              className={`flex-shrink-0 w-24 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20' : 'border-transparent hover:border-gray-300 opacity-60 hover:opacity-100'}`}
            >
              <img src={img} alt={`Thumbnail ${index}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
