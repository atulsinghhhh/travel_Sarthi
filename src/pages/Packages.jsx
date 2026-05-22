import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePackages } from '../hooks/usePackages';
import PackageCard from '../components/PackageCard';
import PackageCardSkeleton from '../components/PackageCardSkeleton';
import EmptyState from '../components/EmptyState';
import { Search, X, Filter } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Packages = () => {
  const { isDarkMode } = useTheme();
  const [searchParams] = useSearchParams();
  const { data: packages, meta, loading, error, filters, updateFilter, removeFilter, loadMore, fetchPackages } = usePackages();
  const [searchInput, setSearchInput] = useState(filters.search);
  const [destinations, setDestinations] = useState([]);
  const queryType = searchParams.get('type');
  
  useEffect(() => {
    setDestinations(['Goa', 'Manali', 'Kerala', 'Dubai', 'Paris', 'Maldives', 'Thailand']);
  }, []);

  useEffect(() => {
    if (queryType && filters.type !== queryType) {
      updateFilter('type', queryType);
    }
  }, [queryType, filters.type, updateFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        updateFilter('search', searchInput);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const activeFilterChips = Object.entries(filters).filter(([k, v]) => v !== '' && k !== 'budget_max' && k !== 'search' && k !== 'sort');

  return (
    <div className={`min-h-screen pb-20 pt-24 transition-colors duration-300 ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
      {/* Top Banner */}
      <div className={`py-12 px-4 border-b shadow-sm ${isDarkMode ? 'bg-gray-950 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className={`text-4xl md:text-5xl font-extrabold mb-4 tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Explore Unique Packages & Tours</h1>
          <p className={`text-lg max-w-2xl mx-auto mb-8 font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Immersive guided trips, local adventures, and unforgettable worldwide experiences.
          </p>
          
          <div className={`max-w-3xl mx-auto relative group shadow-xl rounded-full border ${isDarkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-primary">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by destination, title, or keywords..."
              className={`w-full pl-14 pr-6 py-4 rounded-full border-0 outline-none bg-transparent text-lg font-medium ${isDarkMode ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className={`p-6 rounded-3xl shadow-sm border sticky top-28 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}><Filter size={20} className="text-primary"/> Filters</h2>
            
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Max Budget (₹{Number(filters.budget_max).toLocaleString('en-IN')})</label>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={filters.budget_max}
                onChange={(e) => updateFilter('budget_max', e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Destination</label>
              <select 
                value={filters.destination} 
                onChange={(e) => updateFilter('destination', e.target.value)} 
                className={`w-full p-3 border rounded-xl font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              >
                <option value="">Any Destination</option>
                {destinations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Duration</label>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Any Duration', val: '' },
                  { label: '1-3 Days', val: '1-3' },
                  { label: '4-7 Days', val: '4-7' },
                  { label: '8+ Days', val: '8+' }
                ].map(opt => (
                  <label key={opt.label} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={filters.duration === opt.val}
                      onChange={() => updateFilter('duration', opt.val)}
                      className="text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-semibold text-sm transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className={`block text-sm font-bold mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Type</label>
              <div className="flex flex-col gap-3">
                {['Adventure', 'Leisure', 'Pilgrimage', 'Honeymoon', 'Family'].map(type => (
                  <label key={type} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={filters.type === type}
                      onChange={() => updateFilter('type', filters.type === type ? '' : type)}
                      className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                    />
                    <span className={`font-semibold text-sm transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className={`block text-sm font-bold mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>Sort By</label>
              <select 
                value={filters.sort} 
                onChange={(e) => updateFilter('sort', e.target.value)} 
                className={`w-full p-3 border rounded-xl font-semibold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
              >
                <option value="">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>

        <div className="w-full md:w-3/4">
          <div className="flex flex-wrap gap-2 mb-6">
            {activeFilterChips.map(([key, val]) => (
              <div key={key} className="bg-primary/10 text-primary text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 border border-primary/20 shadow-sm">
                <span className="capitalize">{key}: {val}</span>
                <button onClick={() => removeFilter(key)} className="hover:bg-primary/20 p-1 rounded-full transition-colors"><X size={14} /></button>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 mb-6 flex justify-between items-center font-medium">
              <p>{error}</p>
              <button onClick={() => fetchPackages(true)} className="bg-red-100 px-5 py-2.5 rounded-xl font-bold hover:bg-red-200 transition-colors">Retry</button>
            </div>
          )}

          {packages.length === 0 && !loading && !error && (
            <EmptyState 
              icon={Search} 
              title="No packages found" 
              subtitle="Try adjusting your filters or search terms to find what you're looking for."
              actionLabel="Clear Filters"
              onAction={() => window.location.reload()}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => <PackageCard key={pkg.id} pkg={pkg} />)}
            {loading && [...Array(6)].map((_, i) => <PackageCardSkeleton key={i} />)}
          </div>

          {meta && meta.current_page < meta.last_page && !loading && (
            <div className="mt-14 mb-10 text-center">
              <button onClick={loadMore} className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-md">
                Load More Packages
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Packages;
