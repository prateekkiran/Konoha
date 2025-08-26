import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, Lightbulb, TrendingUp, Code, Sparkles } from 'lucide-react';
import { CaseStudy } from '../types';

interface CaseStudyModalProps {
  caseStudy: CaseStudy;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ caseStudy, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="bg-gray-900/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-700/50 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/98 backdrop-blur-xl border-b border-gray-700/50 p-8 rounded-t-3xl">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-blue-400" />
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {caseStudy.title}
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors p-3 hover:bg-gray-800 rounded-xl"
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Problem */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 hover:border-red-500/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-red-500/20 p-3 rounded-xl mr-4">
                    <Target className="w-7 h-7 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Problem</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">{caseStudy.problem}</p>
              </div>
            </motion.div>

            {/* Approach */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-blue-900/20 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500/20 p-3 rounded-xl mr-4">
                    <Lightbulb className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Approach</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">{caseStudy.approach}</p>
              </div>
            </motion.div>

            {/* Outcome */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-green-900/20 backdrop-blur-sm rounded-2xl p-8 border border-green-500/20 hover:border-green-500/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-green-500/20 p-3 rounded-xl mr-4">
                    <TrendingUp className="w-7 h-7 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Outcome</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg mb-6">{caseStudy.outcome}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {caseStudy.impact.map((impact, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-green-500/20 hover:border-green-500/40 transition-all duration-300 group/impact"
                    >
                      <div className="text-green-300 font-bold text-lg group-hover/impact:text-green-200 transition-colors">
                        {impact}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Stack & Methods */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-purple-900/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500/20 p-3 rounded-xl mr-4">
                    <Code className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Stack & Methods</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {caseStudy.stack.map((tech, idx) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + (idx * 0.05) }}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-purple-600/20 text-purple-300 text-sm rounded-xl border border-purple-500/20 font-semibold hover:border-purple-500/40 hover:bg-purple-600/30 transition-all duration-300"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};