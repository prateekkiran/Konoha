import React from 'react';
import { profile } from '../data/profile';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {profile.name}
          </div>
          <div className="text-blue-600 font-medium mb-6">
            Always building. Always learning.
          </div>
          
          <div className="flex justify-center space-x-8 mb-8">
            <a href="#timeline" className="text-gray-600 hover:text-gray-900 transition-colors">
              Journey
            </a>
            <a href="#impact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Impact
            </a>
            <a href="#skills" className="text-gray-600 hover:text-gray-900 transition-colors">
              Skills
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </a>
          </div>

          <div className="text-gray-500 text-sm">
            © {currentYear} {profile.name}. Crafted with passion for product excellence.
          </div>
        </div>
      </div>
    </footer>
  );
};