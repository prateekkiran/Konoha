import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { timeline } from '../data/profile';
import { FilterState, Role } from '../types';
import { Calendar, MapPin, ExternalLink, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { CaseStudyModal } from './CaseStudyModal';

interface TimelineProps {
  filterState: FilterState;
}

const formatDate = (dateStr: string) => {
  if (dateStr === 'Present') return 'Present';
  const [year, month] = dateStr.split('-');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const RoleCard: React.FC<{ role: Role; org: string; location?: string; index: number }> = ({ 
  role, org, location, index 
}) => {
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50, y: 30 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
        transition={{ duration: 0.8, delay: index * 0.1 }}
        className="relative group"
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="relative bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 hover:border-blue-500/30 transition-all duration-500 hover:transform hover:scale-[1.02]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h3 className="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">
                  {role.title}
                </h3>
              </div>
              
              <div className="flex items-center text-gray-400 text-sm mb-2">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(role.start)} - {formatDate(role.end)}
              </div>
              
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-2" />
                {org} {location && `• ${location}`}
              </div>
            </div>
            
            {role.caseStudy && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCaseStudy(role.caseStudy)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 text-blue-400 hover:text-blue-300 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 border border-blue-500/20 hover:border-blue-500/40"
              >
                <TrendingUp className="w-4 h-4" />
                Case Study
              </motion.button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {role.tags.map((tag, tagIndex) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: (index * 0.1) + (tagIndex * 0.05) }}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-blue-300 text-sm rounded-full border border-blue-500/20 font-medium"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          <ul className="space-y-3">
            {role.highlights.map((highlight, idx) => (
              <motion.li
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: (index * 0.1) + (idx * 0.1) }}
                className="text-gray-300 text-sm flex items-start leading-relaxed"
              >
                <Zap className="text-blue-400 mr-3 mt-0.5 w-4 h-4 flex-shrink-0" />
                <span>{highlight}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      </motion.div>

      <AnimatePresence>
        {selectedCaseStudy && (
          <CaseStudyModal
            caseStudy={selectedCaseStudy}
            onClose={() => setSelectedCaseStudy(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export const Timeline: React.FC<TimelineProps> = ({ filterState }) => {
  const { ref: titleRef, inView: titleInView } = useInView({ threshold: 0.3, triggerOnce: true });

  const filteredTimeline = timeline.map(org => ({
    ...org,
    roles: org.roles.filter(role => {
      // Filter by search term
      if (filterState.searchTerm) {
        const searchableContent = [
          role.title,
          role.tags.join(' '),
          role.highlights.join(' '),
          org.org
        ].join(' ').toLowerCase();
        
        if (!searchableContent.includes(filterState.searchTerm.toLowerCase())) {
          return false;
        }
      }

      // Filter by active filters
      if (filterState.activeFilters.length > 0) {
        return filterState.activeFilters.some(filter =>
          role.tags.some(tag => tag.includes(filter))
        );
      }

      return true;
    })
  })).filter(org => org.roles.length > 0);

  return (
    <section id="timeline" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 30 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-6">
            Journey Map
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A visual timeline of product leadership, innovation, and measurable impact
          </p>
        </motion.div>

        <div className="space-y-16">
          {filteredTimeline.map((org, orgIdx) => (
            <motion.div
              key={org.org}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="flex items-center mb-10">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 w-6 h-6 rounded-full mr-6 shadow-lg shadow-blue-500/30 relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-sm opacity-70"></div>
                </motion.div>
                <div>
                  <h3 className="text-3xl font-bold text-white">{org.org}</h3>
                  {org.location && (
                    <span className="text-gray-400 text-lg">• {org.location}</span>
                  )}
                </div>
              </div>

              <div className="ml-12 space-y-8">
                {org.roles.map((role, roleIdx) => (
                  <RoleCard
                    key={`${role.title}-${roleIdx}`}
                    role={role}
                    org={org.org}
                    location={org.location}
                    index={roleIdx}
                  />
                ))}
              </div>

              {orgIdx < filteredTimeline.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                  className="ml-3 mt-12 h-16 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-transparent origin-top"
                ></motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredTimeline.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-700/50 max-w-md mx-auto">
              <p className="text-gray-400 text-lg mb-4">No results found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters to see more content.</p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};