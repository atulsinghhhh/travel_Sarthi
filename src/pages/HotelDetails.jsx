import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Gallery from '../components/hotel-details/Gallery';
import Amenities from '../components/hotel-details/Amenities';
import BookingSidebar from '../components/hotel-details/BookingSidebar';
import ReviewCard from '../components/hotel-details/ReviewCard';
import { hotelService } from '../services/hotel.service';
import HotelCard from '../components/HotelCard';

const HotelDetails = () => {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [similarHotels, setSimilarHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchHotelDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await hotelService.getById(id);
      const hotelData = response.data;
      
      // Ensure specific fields map correctly to the frontend's expectations
      const formattedHotel = {
        ...hotelData,
        price: hotelData.price_per_night || hotelData.price,
        // Provide fallbacks if the backend doesn't have these exact structures yet
        images: hotelData.images?.length > 0 ? hotelData.images : [
          hotelData.imageUrl || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1540541338287-41700207dee6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
        ],
        amenities: hotelData.amenities?.length > 0 ? hotelData.amenities : ["Free WiFi", "Pool", "Spa"],
        reviews: hotelData.reviews || [],
        reviewsCount: hotelData.reviews?.length || 0,
        nearbyAttractions: hotelData.nearbyAttractions || []
      };

      setHotel(formattedHotel);
      setIsFavorite(hotelData.isFavorite || false);

      // Fetch similar hotels (for now, just fetch all and take 3)
      try {
        const allHotelsResp = await hotelService.getAll();
        const mappedAll = allHotelsResp.data.map(h => ({
          ...h,
          price: h.price_per_night || h.price,
          id: h._id || h.id
        }));
        setSimilarHotels(mappedAll.filter(h => h.id.toString() !== id.toString()).slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch similar hotels");
      }

    } catch (err) {
      console.error('Failed to fetch hotel details:', err);
      setError('We could not find the hotel details you were looking for.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on load
    fetchHotelDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse mt-20">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-[400px] bg-gray-200 rounded-3xl mb-8"></div>
        <div className="flex gap-8">
          <div className="w-2/3 space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
          <div className="w-1/3 h-[400px] bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 mt-20 text-center">
        <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
          <h2 className="text-2xl font-bold text-red-800 mb-4">Error Loading Hotel</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button 
            onClick={fetchHotelDetails}
            className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) return <div className="text-center py-20 mt-20">Hotel not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
            <Link to="/" className="hover:text-primary">Home</Link>
            <span>›</span>
            <Link to="/hotels" className="hover:text-primary">Hotels</Link>
            <span>›</span>
            <span className="text-dark font-medium">{hotel.location}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs text-primary font-semibold uppercase tracking-wider bg-primary/10 px-2 py-1 rounded-md">
                  {hotel.type}
                </span>
                <div className="flex items-center text-yellow-400">
                  {"⭐".repeat(Math.floor(hotel.rating))}
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-dark mb-2">{hotel.name}</h1>
              <p className="text-gray-600 flex items-center gap-2 text-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {hotel.city}, {hotel.location}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share
              </button>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition-colors shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className={`w-5 h-5 ${isFavorite ? 'text-red-500' : ''}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                Save
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <div className="mb-10">
          <Gallery images={hotel.images} />
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 relative">
          
          {/* Left Column: Details */}
          <div className="w-full lg:w-2/3">
            {/* Description */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-dark mb-4">About the Property</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {hotel.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8">
              <Amenities amenities={hotel.amenities} />
            </div>

            {/* Nearby Attractions */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-8">
              <h3 className="text-2xl font-bold text-dark mb-6">Explore the Area</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.nearbyAttractions.map((place, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 hover:border-primary/30 transition-colors">
                    <img src={place.image} alt={place.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-semibold text-dark text-sm">{place.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{place.distance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-dark">Guest Reviews</h3>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-dark">{hotel.rating}</span>
                  <span className="text-gray-500">({hotel.reviewsCount} reviews)</span>
                </div>
              </div>
              <div className="space-y-4">
                {hotel.reviews.map(review => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
              <button className="mt-6 text-primary font-semibold hover:text-primary-hover hover:underline">
                Read all {hotel.reviewsCount} reviews →
              </button>
            </div>
          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="w-full lg:w-1/3">
            <BookingSidebar pricePerNight={hotel.price} />
          </div>
        </div>

        {/* Similar Hotels */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-dark mb-8">Similar Properties</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Grab first 3 items from general list that aren't this hotel */}
            {similarHotels.map(h => (
              <HotelCard key={h.id} hotel={h} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HotelDetails;
