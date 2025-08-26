import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Timeline } from './components/Timeline';
import { ImpactHeatmap } from './components/ImpactHeatmap';
import { SkillsRadar } from './components/SkillsRadar';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FilterState } from './types';
import { trackPageView } from './lib/supabase';

function App() {
  const [filterState, setFilterState] = useState<FilterState>({
    activeFilters: [],
    searchTerm: ''
  });

  useEffect(() => {
    // Track initial page view
    trackPageView('home');
  }, []);

  const handleFilterChange = (filters: string[]) => {
    setFilterState(prev => ({ ...prev, activeFilters: filters }));
  };

  const handleSearchChange = (searchTerm: string) => {
    setFilterState(prev => ({ ...prev, searchTerm }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      <Navigation
        filterState={filterState}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
      />
      
      <main>
        <Hero />
        <Timeline filterState={filterState} />
        <ImpactHeatmap />
        
        <section id="skills" className="py-24 bg-gradient-to-br from-gray-800 via-gray-900 to-black relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-6">
                Skills & Expertise
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                A comprehensive view of technical and leadership capabilities that drive results
              </p>
            </div>
            <SkillsRadar />
          </div>
        </section>
        
        <Contact />
      </main>
      
      <Footer />
    </div>
  );
}

export default App;