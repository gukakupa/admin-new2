import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { translations } from '../data/mockData';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Testimonials = ({ language }) => {
  const t = translations[language];
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        console.log('Fetching testimonials from:', `${API}/testimonials/`);
        setLoading(true);
        const response = await axios.get(`${API}/testimonials/`);
        console.log('Testimonials response:', response.data);
        setTestimonials(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching testimonials:', err);
        setError(`Failed to load testimonials: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.testimonialsTitle}
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t.testimonialsSubtitle}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-accent mx-auto mb-4"></div>
            <p className="text-gray-400">
              {language === 'ka' ? 'იტვირთება...' : 'Loading...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-red-accent hover:text-red-400 underline"
            >
              {language === 'ka' ? 'სცადეთ თავიდან' : 'Try Again'}
            </button>
          </div>
        )}

        {/* Testimonials Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="bg-gray-800 border-gray-700 hover:border-red-accent/50 transition-colors duration-300 group relative overflow-hidden"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-12 h-12 text-red-accent" />
              </div>

              <CardContent className="p-6">
                {/* Rating */}
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-gray-300 mb-6 leading-relaxed">
                  "{language === 'ka' ? testimonial.text_ka : testimonial.text_en}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage src={testimonial.image} alt={language === 'ka' ? testimonial.name : testimonial.name_en} />
                    <AvatarFallback className="bg-red-accent text-white">
                      {(language === 'ka' ? testimonial.name : testimonial.name_en).charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-white font-semibold">
                      {language === 'ka' ? testimonial.name : testimonial.name_en}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {language === 'ka' ? testimonial.position : testimonial.position_en}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              {language === 'ka' 
                ? 'გახდით ჩვენი შემდეგი კმაყოფილი კლიენტი!' 
                : 'Become Our Next Satisfied Client!'
              }
            </h3>
            <p className="text-gray-300 mb-8">
              {language === 'ka' 
                ? 'ჩვენ მზად ვართ დაგეხმაროთ თქვენი მონაცემების აღდგენაში პროფესიონალური მიდგომით და საიმედო სერვისით.'
                : 'We are ready to help you recover your data with a professional approach and reliable service.'
              }
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-lg mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-accent mb-2">500+</div>
                <div className="text-gray-400">
                  {language === 'ka' ? 'კმაყოფილი კლიენტი' : 'Happy Clients'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-accent mb-2">99%</div>
                <div className="text-gray-400">
                  {language === 'ka' ? 'წარმატების მაჩვენებელი' : 'Success Rate'}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-accent mb-2">24/7</div>
                <div className="text-gray-400">
                  {language === 'ka' ? 'მხარდაჭერა' : 'Support'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;