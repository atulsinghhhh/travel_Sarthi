import React, { useState, useEffect, useMemo } from 'react';
import HotelCard from '../components/HotelCard';
import HotelFilter from '../components/HotelFilter';
import SkeletonCard from '../components/SkeletonCard';
import { hotelService } from '../services/hotel.service';
import FadeUp from '../components/common/FadeUp';
import { StaggerContainer, StaggerItem } from '../components/common/StaggerContainer';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended'); // recommended, priceLow, priceHigh, topRated
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    priceRange: 1000,
    types: [],
    ratings: []
  });

  // Fetch Hotels from API
  const fetchHotels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await hotelService.getAll();
      // Map backend fields to frontend expectations if necessary
      // For instance: price_per_night -> price
      const mappedHotels = response.data.map(hotel => ({
        ...hotel,
        price: hotel.price_per_night || hotel.price,
        id: hotel._id || hotel.id // Handle MongoDB ObjectId
      }));
      setHotels(mappedHotels);
    } catch (err) {
      console.error('Failed to fetch hotels:', err);
      setError('We encountered an error while fetching the hotels. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Filter and Sort Logic
  const filteredAndSortedHotels = useMemo(() => {
    let result = hotels;

    // 1. Search Query (Name, City, Location)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(hotel => 
        hotel.name.toLowerCase().includes(query) ||
        hotel.city.toLowerCase().includes(query) ||
        hotel.location.toLowerCase().includes(query)
      );
    }

    // 2. Price Filter
    result = result.filter(hotel => hotel.price <= filters.priceRange);

    // 3. Type Filter
    if (filters.types.length > 0) {
      result = result.filter(hotel => filters.types.includes(hotel.type));
    }

    // 4. Rating Filter
    if (filters.ratings.length > 0) {
      // If user selected '4', it means 4 and up (4 to 4.9)
      const minSelectedRating = Math.min(...filters.ratings);
      result = result.filter(hotel => Math.floor(hotel.rating) >= minSelectedRating);
    }

    // 5. Sorting
    switch (sortBy) {
      case 'priceLow':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'topRated':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'recommended':
      default:
        // Default order from JSON
        break;
    }

    return result;
  }, [hotels, searchQuery, filters, sortBy]);

  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen pb-20 transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-dark dark:bg-gray-900 text-white py-16 px-4 border-b border-gray-100/10 dark:border-gray-800">
        <FadeUp className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Perfect Stay</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Discover luxury resorts, cozy villas, and budget-friendly hotels in top destinations around the world.
          </p>
          
          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <input 
              type="text" 
              placeholder="Search by hotel name, city, or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/20 outline-none text-dark text-lg shadow-lg transition-all"
            />
          </div>
        </FadeUp>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Toolbar: Mobile Filter Toggle & Sorting */}
        <div className="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-8 gap-4">
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-dark dark:text-white rounded-xl font-medium transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters
          </button>

          <div className="text-gray-500 dark:text-gray-400 font-medium">
            Showing <span className="text-dark dark:text-white font-bold">{filteredAndSortedHotels.length}</span> properties
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">Sort by:</span>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-auto bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-sm rounded-xl focus:ring-primary focus:border-primary block p-2.5 outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="topRated">Top Rated</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filter */}
          <div className="hidden lg:block w-1/4 flex-shrink-0">
            <div className="sticky top-24">
              <HotelFilter filters={filters} setFilters={setFilters} />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsMobileFilterOpen(false)}
              ></div>
              <div className="relative w-4/5 max-w-sm bg-white h-full transform transition-transform ease-in-out duration-300">
                <HotelFilter 
                  filters={filters} 
                  setFilters={setFilters} 
                  onClose={() => setIsMobileFilterOpen(false)} 
                />
              </div>
            </div>
          )}

          {/* Main Content: Grid */}
          <div className="w-full lg:w-3/4">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : error ? (
              <FadeUp className="bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-800 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-red-600 dark:text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-2">Something went wrong</h3>
                <p className="text-red-600 dark:text-red-300 max-w-md mx-auto mb-6">
                  {error}
                </p>
                <button 
                  onClick={fetchHotels}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </FadeUp>
            ) : filteredAndSortedHotels.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAndSortedHotels.map(hotel => (
                  <StaggerItem key={hotel.id}>
                    <HotelCard hotel={hotel} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              /* Empty State */
              <FadeUp className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-gray-400 dark:text-gray-500">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-dark dark:text-white mb-2">No hotels found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  We couldn't find any properties matching your current search and filter criteria. Try adjusting your filters or search query.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({ priceRange: 1000, types: [], ratings: [] });
                  }}
                  className="px-6 py-3 bg-primary/10 text-primary dark:text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
                >
                  Clear all filters
                </button>
              </FadeUp>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hotels;
