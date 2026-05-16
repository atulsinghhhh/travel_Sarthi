import React, { useEffect, useState } from 'react';
import { usePackages } from '../hooks/usePackages';
import PackageCard from '../components/PackageCard';
import PackageCardSkeleton from '../components/PackageCardSkeleton';
import EmptyState from '../components/EmptyState';
import { Search, X, Filter } from 'lucide-react';

const Packages = () => {
  const { data: packages, meta, loading, error, filters, updateFilter, removeFilter, loadMore, fetchPackages } = usePackages();
  const [searchInput, setSearchInput] = useState(filters.search);
  const [destinations, setDestinations] = useState([]);
  
  useEffect(() => {
    setDestinations(['Goa', 'Manali', 'Kerala', 'Dubai', 'Paris', 'Maldives', 'Thailand']);
  }, []);

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
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="bg-blue-600 py-10 px-4">
        <div className="container mx-auto max-w-4xl relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by destination, title, or keywords..."
            className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg focus:ring-4 focus:ring-blue-300 outline-none text-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/4">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2"><Filter size={20}/> Filters</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Max Budget (₹{Number(filters.budget_max).toLocaleString('en-IN')})</label>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={filters.budget_max}
                onChange={(e) => updateFilter('budget_max', e.target.value)}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Destination</label>
              <select 
                value={filters.destination} 
                onChange={(e) => updateFilter('destination', e.target.value)} 
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Any Destination</option>
                {destinations.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Any', val: '' },
                  { label: '1-3 Days', val: '1-3' },
                  { label: '4-7 Days', val: '4-7' },
                  { label: '8+ Days', val: '8+' }
                ].map(opt => (
                  <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="duration" 
                      checked={filters.duration === opt.val}
                      onChange={() => updateFilter('duration', opt.val)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Type</label>
              <div className="flex flex-col gap-2">
                {['Adventure', 'Leisure', 'Pilgrimage', 'Honeymoon', 'Family'].map(type => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={filters.type === type}
                      onChange={() => updateFilter('type', filters.type === type ? '' : type)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700 text-sm">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">Sort By</label>
              <select 
                value={filters.sort} 
                onChange={(e) => updateFilter('sort', e.target.value)} 
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              <div key={key} className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                <span className="capitalize">{key}: {val}</span>
                <button onClick={() => removeFilter(key)} className="hover:bg-blue-200 p-0.5 rounded-full"><X size={14} /></button>
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex justify-between items-center">
              <p>{error}</p>
              <button onClick={() => fetchPackages(true)} className="bg-red-100 px-4 py-2 rounded-lg font-medium hover:bg-red-200">Retry</button>
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
            <div className="mt-8 text-center">
              <button onClick={loadMore} className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-xl transition-colors">
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
