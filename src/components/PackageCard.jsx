import React from 'react';
import { Heart, MapPin, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorite } from '../hooks/useFavorite';

const PackageCard = ({ pkg }) => {
  const { isFavorited, toggleFavorite } = useFavorite(pkg.id, pkg.is_favorited);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      <div className="h-48 relative overflow-hidden bg-gray-100">
        {pkg.image ? (
          <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">No Image</div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1 uppercase tracking-wider">
          <MapPin size={12} className="text-[#FF385C]" /> {pkg.destination}
        </div>
        <div className="absolute top-3 right-3 flex gap-2">
          <span className="bg-[#FF385C] text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm uppercase tracking-wider">
            {pkg.type}
          </span>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); toggleFavorite(); }}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors group/btn"
        >
          <Heart size={18} className={`transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-500 group-hover/btn:text-red-500'}`} />
        </button>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1" title={pkg.title}>{pkg.title}</h3>
        
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock size={16} className="text-gray-400" />
            <span>{pkg.duration} Days</span>
          </div>
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="font-medium text-gray-800">{pkg.avg_rating || 'New'}</span>
            {pkg.total_reviews > 0 && <span className="text-gray-400">({pkg.total_reviews})</span>}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Starts From</p>
            <p className="text-xl font-extrabold text-[#FF385C]">₹{Number(pkg.budget).toLocaleString('en-IN')}</p>
          </div>
          <Link to={`/packages/${pkg.id}`} className="bg-[#FF385C] hover:bg-[#D70466] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors shadow-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
