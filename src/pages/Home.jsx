import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FadeUp from '../components/common/FadeUp';
import { StaggerContainer, StaggerItem } from '../components/common/StaggerContainer';
import { Heart, Search } from 'lucide-react';
import { hotelService } from '../services/hotel.service';

const Home = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await hotelService.getAll();
        setHotels(response.data || []);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  const categories = [
    { name: 'All', icon: '🌍' },
    { name: 'Beachfront', icon: '🏖️' },
    { name: 'Cabins', icon: '🪵' },
    { name: 'Amazing pools', icon: '🏊‍♂️' },
    { name: 'Icons', icon: '✨' },
    { name: 'Castles', icon: '🏰' },
    { name: 'Arctic', icon: '❄️' },
    { name: 'Camping', icon: '⛺' },
  ];

  return (
    <div className="w-full bg-white min-h-screen pb-20">
      
      {/* Search Header - Sticky-ish */}
      <div className="w-full border-b border-gray-200 bg-white sticky top-20 z-30 pt-6 pb-4">
        {/* Categories Carousel */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-8 overflow-x-auto no-scrollbar pb-2">
          {categories.map((cat) => (
            <button 
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex flex-col items-center gap-2 min-w-max transition-all duration-200 border-b-2 pb-2 ${
                activeCategory === cat.name 
                  ? 'border-gray-900 text-gray-900' 
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <span className={`text-xs font-semibold ${activeCategory === cat.name ? 'text-gray-900' : 'text-gray-500'}`}>
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-500"></span>
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No places found</h2>
            <p className="text-gray-500">There are no destinations added by the admin yet.</p>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {hotels.map((hotel) => (
              <StaggerItem key={hotel.id} className="group cursor-pointer flex flex-col">
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-3 bg-gray-200">
                  <img 
                    src={hotel.image || hotel.imageUrl || 'https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={hotel.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  <button className="absolute top-3 right-3 p-1">
                    <Heart className="w-6 h-6 text-white drop-shadow-md hover:scale-110 transition-transform hover:fill-rose-500 hover:text-rose-500" />
                  </button>
                  {/* Optional 'Guest favorite' badge */}
                  {(hotel.rating >= 4.8 || hotel.is_favorite) && (
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full shadow-md text-sm font-bold text-gray-900">
                      Guest favorite
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-[15px] font-semibold text-gray-900 leading-tight truncate">
                      {hotel.city}, {hotel.location || hotel.country}
                    </h3>
                    <p className="text-[15px] text-gray-500 mt-0.5 truncate">{hotel.name}</p>
                    <p className="text-[15px] text-gray-500 mt-0.5">Added recently</p>
                    
                    <div className="mt-1.5 flex items-center gap-1">
                      <span className="text-[15px] font-semibold text-gray-900">${hotel.price || hotel.price_per_night}</span>
                      <span className="text-[15px] text-gray-900">night</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[15px] text-gray-900">
                    <span className="text-sm">★</span>
                    <span>{hotel.rating || '4.9'}</span>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
        
        {!loading && hotels.length > 0 && (
          <div className="mt-16 text-center">
            <p className="text-lg font-semibold text-gray-900 mb-4">Continue exploring {activeCategory !== 'All' ? activeCategory : 'amazing stays'}</p>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-black transition-colors">
              Show more
            </button>
          </div>
        )}
      </main>

    </div>
  );
};

export default Home;
