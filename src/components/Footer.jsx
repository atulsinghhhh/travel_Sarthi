import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-200 text-sm py-16 transition-colors duration-300 font-medium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-gray-200">
          <div>
            <h3 className="font-bold text-gray-900 mb-4.5 text-base">Support & Help</h3>
            <ul className="space-y-3.5 text-gray-600 font-medium">
              <li><Link to="/help" className="hover:text-[#FF385C] transition-colors">Help Center</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF385C] transition-colors">Contact Support</Link></li>
              <li><Link to="/help" className="hover:text-[#FF385C] transition-colors">Cancellation Options</Link></li>
              <li><Link to="/help" className="hover:text-[#FF385C] transition-colors">Safety Information</Link></li>
              <li><Link to="/help" className="hover:text-[#FF385C] transition-colors">Disability Support</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4.5 text-base">Explore Experiences</h3>
            <ul className="space-y-3.5 text-gray-600 font-medium">
              <li><Link to="/hotels" className="hover:text-[#FF385C] transition-colors">Hotels & Stays</Link></li>
              <li><Link to="/packages" className="hover:text-[#FF385C] transition-colors">Holiday Packages</Link></li>
              <li><Link to="/packages?type=Honeymoon" className="hover:text-[#FF385C] transition-colors">Honeymoon Escapes</Link></li>
              <li><Link to="/packages?type=Luxury" className="hover:text-[#FF385C] transition-colors">Luxury Retreats</Link></li>
              <li><Link to="/packages?type=Adventure" className="hover:text-[#FF385C] transition-colors">Adventure Tours</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4.5 text-base">Hosting & Partners</h3>
            <ul className="space-y-3.5 text-gray-600 font-medium">
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">TravelSaarthi Your Home</Link></li>
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Hosting Protection</Link></li>
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Hosting Resources</Link></li>
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Partner Network</Link></li>
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Community Standards</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 mb-4.5 text-base">About TravelSaarthi</h3>
            <ul className="space-y-3.5 text-gray-600 font-medium">
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF385C] transition-colors">Careers</Link></li>
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Investors</Link></li>
              <li><Link to="/about" className="hover:text-[#FF385C] transition-colors">Press & Media</Link></li>
              <li><Link to="/contact" className="hover:text-[#FF385C] transition-colors">Corporate Details</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500 font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            <span>© {new Date().getFullYear()} TravelSaarthi, Inc.</span>
            <span>·</span>
            <Link to="/about" className="hover:underline hover:text-gray-900 transition-colors">Privacy</Link>
            <span>·</span>
            <Link to="/about" className="hover:underline hover:text-gray-900 transition-colors">Terms</Link>
            <span>·</span>
            <Link to="/about" className="hover:underline hover:text-gray-900 transition-colors">Sitemap</Link>
            <span>·</span>
            <Link to="/contact" className="hover:underline hover:text-gray-900 transition-colors">Company Details</Link>
          </div>
          <div className="flex items-center gap-6 text-gray-900 font-bold">
            <span className="flex items-center gap-1.5 cursor-pointer hover:underline">
              🌐 English (IN)
            </span>
            <span className="cursor-pointer hover:underline">₹ INR</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
