import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Menu, X, Sparkles } from 'lucide-react';
import { filters } from '../data/profile';
import { FilterState } from '../types';
import { trackFilterUsage } from '../lib/supabase';

interface NavigationProps {
  filterState: FilterState;
  onFilterChange: (filters: string[]) => void;
  onSearchChange: (search: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  filterState,
  onFilterChange,
  onSearchChange
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFilter = async (filter: string) => {
    const newFilters = filterState.activeFilters.includes(filter)
      ? filterState.activeFilters.filter(f => f !== filter)
      : [...filterState.activeFilters, filter];
    
    onFilterChange(newFilters);
    
    // Track filter usage
    try {
      await trackFilterUsage(filter, filterState.searchTerm);
    } catch (error) {
      console.error('Failed to track filter usage:', error);
    }
  };

  const navItems = [
    { label: 'Journey', href: '#timeline' },
    { label: 'Impact', href: '#impact' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl' 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Prateek Kiran
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className="text-gray-300 hover:text-white transition-colors duration-200 font-medium relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </motion.a>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                Hire Me
              </motion.button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white p-2 hover:bg-gray-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-gray-900/98 backdrop-blur-xl border-t border-gray-800"
            >
              <div className="px-6 py-4 space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-gray-300 hover:text-white transition-colors duration-200 py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold">
                  Hire Me
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Enhanced Filter Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`fixed top-20 w-full z-40 transition-all duration-500 ${
          isScrolled ? 'bg-gray-900/90 backdrop-blur-xl' : 'bg-gray-900/70'
        } border-b border-gray-800/50`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
              <input
                type="text"
                placeholder="Search skills, projects, achievements..."
                value={filterState.searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-gray-800/80"
              />
            </div>

            {/* Enhanced Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-gray-400">
                <Filter className="w-5 h-5" />
                <span className="text-sm font-medium">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <motion.button
                    key={filter}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleFilter(filter)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden ${
                      filterState.activeFilters.includes(filter)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-gray-800/60 text-gray-300 hover:bg-gray-700/80 hover:text-white border border-gray-700/50 hover:border-gray-600'
                    }`}
                  >
                    <span className="relative z-10">{filter}</span>
                    {filterState.activeFilters.includes(filter) && (
                      <motion.div
                        layoutId="activeFilter"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};