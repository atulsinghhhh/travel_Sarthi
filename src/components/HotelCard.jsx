import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
  const [isFavorite, setIsFavorite] = useState(hotel.isFavorite);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Image Container */}
      <div className="h-56 overflow-hidden relative">
        {/* Rating Badge */}
        <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold flex items-center gap-1 z-10 text-dark dark:text-white shadow-sm">
          ⭐ {hotel.rating}
        </div>
        
        {/* Favorite Button */}
        <button 
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-900 transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            strokeWidth="2"
            className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        <Link to={`/hotels/${hotel.id}`} className="block w-full h-full">
          <img 
            src={hotel.imageUrl} 
            alt={hotel.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
      
      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <div className="text-xs text-primary font-semibold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
            {hotel.type}
          </div>
        </div>
        
        <Link to={`/hotels/${hotel.id}`} className="text-xl font-bold text-dark dark:text-white mb-2 line-clamp-1 hover:text-primary dark:hover:text-primary transition-colors">
          {hotel.name}
        </Link>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {hotel.city}, {hotel.location}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, index) => (
            <span key={index} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full border border-gray-200 dark:border-gray-700">
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 px-2 py-1 rounded-full border border-gray-100 dark:border-gray-800">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>
        
        {/* Footer/Price */}
        <div className="mt-auto border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between items-end">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">Starting from</span>
            <div className="font-extrabold text-2xl text-dark dark:text-white">
              ${hotel.price}
              <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/night</span>
            </div>
          </div>
          <Link to={`/hotels/${hotel.id}`} className="bg-[#FF385C] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#D70466] shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all text-center">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
