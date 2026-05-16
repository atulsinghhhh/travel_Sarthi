import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { packageService } from '../services/package.service';
import ImageGallery from '../components/ImageGallery';
import StarRating from '../components/StarRating';
import ItineraryMap from '../components/ItineraryMap';
import PackageCard from '../components/PackageCard';
import { useToast } from '../context/ToastContext';
import { MapPin, Clock, Calendar, Check, X, Share2, Info, User } from 'lucide-react';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedDays, setExpandedDays] = useState([1]); // Expand day 1 by default
  const [relatedPackages, setRelatedPackages] = useState([]);
  
  const [reviews, setReviews] = useState([]);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchPackageDetails();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (activeTab === 'reviews' && reviews.length === 0) {
      loadReviews(1);
    }
  }, [activeTab]);

  const fetchPackageDetails = async () => {
    setLoading(true);
    try {
      const { data } = await packageService.getById(id);
      setPkg(data);
      
      // Fetch related packages (simplified mock logic using generic search)
      if (data.type) {
        const relRes = await packageService.getAll({ type: data.type });
        setRelatedPackages(relRes.data.data.filter(p => p.id !== data.id).slice(0, 3));
      }
    } catch (error) {
      showToast('Failed to load package details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async (pageToLoad) => {
    setReviewsLoading(true);
    try {
      // Assuming GET /api/packages/{id}/reviews?page=X is added
      const { data } = await packageService.getReviews(id, pageToLoad);
      // Backend should return paginated data
      const newReviews = Array.isArray(data) ? data : (data.data || []);
      
      if (pageToLoad === 1) {
        setReviews(newReviews);
      } else {
        setReviews(prev => [...prev, ...newReviews]);
      }
      
      // Basic check for more
      setHasMoreReviews(data.last_page ? pageToLoad < data.last_page : false);
      setReviewPage(pageToLoad);
    } catch (error) {
      console.error("Failed to load reviews");
    } finally {
      setReviewsLoading(false);
    }
  };

  const toggleDay = (day) => {
    setExpandedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  if (loading) return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-pulse">
      <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
      <div className="h-10 bg-gray-200 w-1/3 mb-4 rounded"></div>
      <div className="h-4 bg-gray-200 w-full mb-2 rounded"></div>
      <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
    </div>
  );

  if (!pkg) return <div className="text-center py-20 text-2xl text-gray-500">Package not found</div>;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'itinerary', label: 'Itinerary' },
    { id: 'hotel', label: 'Hotel' },
    { id: 'reviews', label: 'Reviews' }
  ];

  // Safely parse JSON strings if needed (backend casts should handle this, but fallback)
  const itinerary = typeof pkg.itinerary === 'string' ? JSON.parse(pkg.itinerary) : (pkg.itinerary || []);
  const included = typeof pkg.included === 'string' ? JSON.parse(pkg.included) : (pkg.included || []);
  const excluded = typeof pkg.excluded === 'string' ? JSON.parse(pkg.excluded) : (pkg.excluded || []);
  const images = typeof pkg.images === 'string' ? JSON.parse(pkg.images) : (pkg.images || (pkg.image ? [pkg.image] : []));
  const availableDates = typeof pkg.available_dates === 'string' ? JSON.parse(pkg.available_dates) : (pkg.available_dates || []);

  return (
    <div className="bg-gray-50 pb-12">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header & Gallery */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
            <div>
              <div className="flex gap-2 mb-2">
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">{pkg.type}</span>
                <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded flex items-center gap-1"><MapPin size={12}/> {pkg.destination}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">{pkg.title}</h1>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <StarRating rating={pkg.reviews_avg_rating || 0} size={16} />
                  <span className="font-bold text-gray-900">{Number(pkg.reviews_avg_rating || 0).toFixed(1)}</span>
                  <span>({pkg.reviews_count || 0} reviews)</span>
                </div>
              </div>
            </div>
          </div>
          
          <ImageGallery images={images} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="w-full lg:w-2/3">
            
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Contents */}
            <div className="min-h-[400px]">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="animate-fade-in-up">
                  <h2 className="text-2xl font-bold mb-4 text-gray-900">About this package</h2>
                  <p className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line text-lg">{pkg.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Check className="text-green-500"/> What's Included</h3>
                      {included.length > 0 ? (
                        <ul className="space-y-3">
                          {included.map((item, i) => (
                            <li key={i} className="flex gap-3 text-gray-600"><Check size={20} className="text-green-500 flex-shrink-0"/> {item}</li>
                          ))}
                        </ul>
                      ) : <p className="text-gray-500 italic">Not specified</p>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><X className="text-red-500"/> What's Excluded</h3>
                      {excluded.length > 0 ? (
                        <ul className="space-y-3">
                          {excluded.map((item, i) => (
                            <li key={i} className="flex gap-3 text-gray-600"><X size={20} className="text-red-500 flex-shrink-0"/> {item}</li>
                          ))}
                        </ul>
                      ) : <p className="text-gray-500 italic">Not specified</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* ITINERARY TAB */}
              {activeTab === 'itinerary' && (
                <div className="animate-fade-in-up">
                  <div className="flex justify-between items-end mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Itinerary Timeline</h2>
                    <span className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full text-sm">{pkg.duration} Days</span>
                  </div>

                  {itinerary.length > 0 ? (
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-200 before:to-gray-100">
                      {itinerary.map((day) => {
                        const isExpanded = expandedDays.includes(day.day);
                        return (
                          <div key={day.day} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                              {day.day}
                            </div>
                            
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-5 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all" onClick={() => toggleDay(day.day)}>
                              <div className="flex justify-between items-center mb-1">
                                <h3 className="font-bold text-lg text-gray-900">{day.title}</h3>
                                <span className="text-xl text-gray-400">{isExpanded ? '−' : '+'}</span>
                              </div>
                              <p className="text-sm font-medium text-blue-600 mb-2"><MapPin size={14} className="inline mr-1"/>{day.location_name}</p>
                              
                              {isExpanded && (
                                <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in-up">
                                  <p className="text-gray-600 mb-4 text-sm">{day.description}</p>
                                  {day.activities && day.activities.length > 0 && (
                                    <div>
                                      <h4 className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-wider">Activities</h4>
                                      <ul className="space-y-2">
                                        {day.activities.map((act, i) => (
                                          <li key={i} className="flex gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-lg"><Check size={16} className="text-green-500 shrink-0 mt-0.5"/> {act}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-500">Detailed itinerary is not available for this package yet.</p>
                    </div>
                  )}

                  <ItineraryMap itinerary={itinerary} />
                </div>
              )}

              {/* HOTEL TAB */}
              {activeTab === 'hotel' && (
                <div className="animate-fade-in-up">
                  {pkg.hotel ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="h-64 bg-gray-200 relative">
                        {pkg.hotel.image ? (
                          <img src={pkg.hotel.image} alt={pkg.hotel.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">Hotel Image</div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex gap-1 shadow-sm">
                          <StarRating rating={pkg.hotel.stars || pkg.hotel.rating} size={14} maxStars={Math.floor(pkg.hotel.stars || pkg.hotel.rating || 0)} />
                        </div>
                      </div>
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{pkg.hotel.name}</h2>
                        <p className="text-gray-600 flex items-center gap-2 mb-6"><MapPin size={18} className="text-blue-500"/> {pkg.hotel.location}</p>
                        
                        <h3 className="font-bold text-gray-800 mb-3 text-lg">Amenities</h3>
                        <div className="flex flex-wrap gap-3">
                          {pkg.hotel.amenities ? (
                            JSON.parse(pkg.hotel.amenities).map((amenity, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border border-blue-100">
                                <Info size={16} /> {amenity}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-500 italic">No amenities listed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-500">Hotel information is not provided for this package.</p>
                    </div>
                  )}
                </div>
              )}

              {/* REVIEWS TAB */}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in-up">
                  <div className="flex items-center gap-6 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100 min-w-[150px]">
                      <div className="text-5xl font-black text-blue-600 mb-2">{Number(pkg.reviews_avg_rating || 0).toFixed(1)}</div>
                      <StarRating rating={pkg.reviews_avg_rating || 0} size={20} />
                      <div className="text-sm text-gray-500 mt-2 font-medium">{pkg.reviews_count || 0} Reviews</div>
                    </div>
                    {/* Placeholder for bar chart breakdown */}
                    <div className="flex-grow hidden md:block">
                      <p className="text-gray-500 italic text-sm text-center">Star breakdown available here</p>
                    </div>
                  </div>

                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map(review => (
                        <div key={review.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4 items-center">
                              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-xl">
                                {review.user?.name ? review.user.name.charAt(0) : <User/>}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                                <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <StarRating rating={review.rating} size={14} />
                          </div>
                          <h5 className="font-bold text-gray-800 mb-2">{review.title}</h5>
                          <p className="text-gray-600 leading-relaxed text-sm md:text-base">{review.comment}</p>
                        </div>
                      ))}
                      
                      {hasMoreReviews && (
                        <div className="text-center pt-4">
                          <button 
                            onClick={() => loadReviews(reviewPage + 1)}
                            disabled={reviewsLoading}
                            className="text-blue-600 font-bold border border-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 disabled:opacity-50"
                          >
                            {reviewsLoading ? 'Loading...' : 'Load More Reviews'}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                      <p className="text-gray-500">No reviews yet. Be the first to review after booking!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar (Sticky) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <div className="flex justify-between items-start border-b border-gray-100 pb-6 mb-6">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Price</p>
                  <p className="text-3xl font-black text-gray-900">₹{Number(pkg.budget).toLocaleString('en-IN')}</p>
                  <p className="text-xs text-gray-500 mt-1">per person (taxes incl.)</p>
                </div>
                <button onClick={handleShare} className="p-3 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full transition-colors group">
                  <Share2 size={20} className="group-active:scale-90 transition-transform" />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-700 font-medium bg-gray-50 p-3 rounded-lg">
                  <Clock className="text-blue-500" size={20} /> {pkg.duration} Days / {pkg.duration - 1} Nights
                </div>
                {availableDates.length > 0 && (
                  <div className="flex items-center gap-3 text-gray-700 font-medium bg-gray-50 p-3 rounded-lg">
                    <Calendar className="text-blue-500" size={20} /> Next Dep: {new Date(availableDates[0]).toLocaleDateString()}
                  </div>
                )}
              </div>

              <button 
                onClick={() => navigate(`/checkout?packageId=${pkg.id}`)}
                className="w-full bg-[#FF385C] hover:bg-[#D70466] text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg shadow-[#FF385C]/30 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Proceed to Book
              </button>
              
              <p className="text-center text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                <Info size={12}/> Free cancellation up to 48 hours before
              </p>
            </div>
          </div>
        </div>

        {/* Related Packages */}
        {relatedPackages.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Packages You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPackages.map(rel => <PackageCard key={rel.id} pkg={rel} />)}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PackageDetail;
