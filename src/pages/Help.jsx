import React, { useState } from 'react';
import { Search, ChevronDown, MessageCircle, Phone, BookOpen, Shield, HelpCircle, FileText } from 'lucide-react';
import FadeUp from '../components/common/FadeUp';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { title: 'Booking & Payments', icon: <BookOpen className="w-6 h-6 text-[#FF385C]" />, description: 'Learn how booking confirmed, payment methods, and schedules.' },
    { title: 'Cancellations & Refunds', icon: <FileText className="w-6 h-6 text-[#FF385C]" />, description: 'Understand our cancellation policies and refund timelines.' },
    { title: 'Account & Safety', icon: <Shield className="w-6 h-6 text-[#FF385C]" />, description: 'Manage your profile, password, and security settings.' },
    { title: 'Hosting on TravelSaarthi', icon: <HelpCircle className="w-6 h-6 text-[#FF385C]" />, description: 'Everything you need to know about listing your property.' },
  ];

  const faqs = [
    { id: 1, question: 'How do I cancel my booking?', answer: 'You can cancel your reservation by logging into your account, navigating to Trips on your dashboard, selecting the trip, and clicking "Cancel Reservation". Review the cancellation policy on your itinerary for refund details.' },
    { id: 2, question: 'When will I be charged for my reservation?', answer: 'You are charged once the host confirms your booking. For instant bookings, payment is collected immediately upon checkout.' },
    { id: 3, question: 'What is AirCover?', answer: 'AirCover is comprehensive protection included for free with every booking. It covers booking guarantees, check-in guarantees, and a 24-hour safety line.' },
    { id: 4, question: 'How do I contact my host or tour guide?', answer: 'Once your reservation is confirmed, you will find your host’s direct contact number and a messaging thread in your Trips dashboard.' },
    { id: 5, question: 'Can I change the dates of my trip?', answer: 'Yes! Go to Trips, select your booking, and choose "Modify Reservation". Your host will need to approve date changes if prices differ.' },
  ];

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search */}
        <FadeUp className="text-center py-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
            Hi, how can we help?
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Find instant answers to your questions, explore guides, or connect with our 24/7 global support team.
          </p>

          <div className="relative max-w-2xl mx-auto shadow-lg shadow-gray-100 rounded-full border border-gray-200 bg-white p-2 flex items-center">
            <Search className="w-6 h-6 text-gray-400 ml-4" />
            <input 
              type="text" 
              placeholder="Search for articles, questions, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3.5 pl-4 pr-6 bg-transparent text-gray-900 font-semibold outline-none placeholder-gray-400 text-base md:text-lg"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="pr-4 text-xs font-bold text-gray-400 hover:text-gray-600">Clear</button>
            )}
          </div>
        </FadeUp>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
          {categories.map((cat, i) => (
            <div key={i} className="p-8 rounded-3xl border border-gray-200 bg-white hover:border-[#FF385C] hover:shadow-xl hover:shadow-[#FF385C]/5 transition-all duration-300 group cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-[#FF385C]/10 transition-colors">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="my-16 border-t border-gray-100 pt-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredFaqs.length === 0 ? (
              <p className="text-center text-gray-500 py-8 font-medium">No results found for "{searchQuery}". Please try another search term or contact support.</p>
            ) : (
              filteredFaqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200"
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full p-6 text-left flex justify-between items-center font-bold text-lg text-gray-900 hover:text-[#FF385C] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${openFaq === faq.id ? 'rotate-180 text-[#FF385C]' : ''}`} />
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-6 pt-2 text-gray-600 font-medium leading-relaxed border-t border-gray-100 bg-gray-50/50 animate-fade-in-up">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Contact Support Banner */}
        <div className="mt-20 p-10 md:p-12 bg-gradient-to-br from-rose-600 to-[#FF385C] rounded-3xl text-white text-center shadow-2xl shadow-[#FF385C]/20 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <h2 className="text-3xl font-extrabold mb-4">Still need assistance?</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8 font-medium text-lg">
            Our priority support team is available 24/7 to resolve any booking issues, emergencies, or inquiries.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="/contact" className="px-8 py-4 bg-white text-[#FF385C] font-bold rounded-2xl hover:bg-gray-100 shadow-lg transition flex items-center gap-2">
              <MessageCircle className="w-5 h-5" /> Chat with Support
            </a>
            <a href="tel:18005551234" className="px-8 py-4 border-2 border-white/60 hover:border-white text-white font-bold rounded-2xl transition flex items-center gap-2">
              <Phone className="w-5 h-5" /> Call Us Now
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Help;
