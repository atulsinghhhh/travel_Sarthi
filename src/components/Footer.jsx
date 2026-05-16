import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 border-t border-gray-200 text-sm py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/help" className="hover:underline">Help Center</Link></li>
              <li><Link to="#" className="hover:underline">AirCover</Link></li>
              <li><Link to="#" className="hover:underline">Anti-discrimination</Link></li>
              <li><Link to="#" className="hover:underline">Disability support</Link></li>
              <li><Link to="#" className="hover:underline">Cancellation options</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Hosting</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:underline">TravelSaarthi your home</Link></li>
              <li><Link to="#" className="hover:underline">AirCover for Hosts</Link></li>
              <li><Link to="#" className="hover:underline">Hosting resources</Link></li>
              <li><Link to="#" className="hover:underline">Community forum</Link></li>
              <li><Link to="#" className="hover:underline">Hosting responsibly</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">TravelSaarthi</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="hover:underline">Newsroom</Link></li>
              <li><Link to="#" className="hover:underline">New features</Link></li>
              <li><Link to="#" className="hover:underline">Careers</Link></li>
              <li><Link to="#" className="hover:underline">Investors</Link></li>
              <li><Link to="#" className="hover:underline">Gift cards</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-wrap items-center gap-2">
            <span>© {new Date().getFullYear()} TravelSaarthi, Inc.</span>
            <span>·</span>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <span>·</span>
            <Link to="/terms" className="hover:underline">Terms</Link>
            <span>·</span>
            <Link to="#" className="hover:underline">Sitemap</Link>
            <span>·</span>
            <Link to="/contact" className="hover:underline">Company details</Link>
          </div>
          <div className="flex items-center gap-4 font-semibold text-gray-900">
            <span className="flex items-center gap-1 cursor-pointer hover:underline">
              🌐 English (IN)
            </span>
            <span className="cursor-pointer hover:underline">$ USD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
