import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Shield, DollarSign, Users, Zap, Target } from 'lucide-react';

const impactData = [
  { 
    category: 'Speed & Efficiency', 
    icon: Zap,
    metrics: ['35% review time reduction', '15% faster TTM', '40% productivity boost'], 
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-500/20 hover:border-green-500/40'
  },
  { 
    category: 'Compliance & Quality', 
    icon: Shield,
    metrics: ['100% regulatory adherence', '50+ providers supported', 'Multi-state coverage'], 
    color: 'from-blue-500 to-cyan-600',
    bgColor: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40'
  },
  { 
    category: 'Cost Optimization', 
    icon: DollarSign,
    metrics: ['$1.3M vendor savings', '$100K cloud optimization', '90% automation achieved'], 
    color: 'from-amber-500 to-orange-600',
    bgColor: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-500/20 hover:border-amber-500/40'
  },
  { 
    category: 'Growth & Engagement', 
    icon: TrendingUp,
    metrics: ['$1.6M opportunity identified', '$390M+ programs enabled', '+10% user engagement'], 
    color: 'from-purple-500 to-pink-600',
    bgColor: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20 hover:border-purple-500/40'
  }
];

export const ImpactHeatmap: React.FC = () => {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true });

  return (
    <section id="impact" className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent mb-6">
            Impact Dashboard
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Quantified results across key business dimensions that drive measurable outcomes
          </p>
        </motion.div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {impactData.map((item, index) => {
            const IconComponent = item.icon;
            
            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className={`relative overflow-hidden rounded-3xl border ${item.borderColor} transition-all duration-500 hover:scale-[1.02] bg-gray-800/40 backdrop-blur-xl`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.bgColor} opacity-50`}></div>
                  
                  <div className="relative p-8">
                    <div className="flex items-center mb-8">
                      <div className={`bg-gradient-to-r ${item.color} p-4 rounded-2xl mr-4 shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white">{item.category}</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {item.metrics.map((metric, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={inView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.6, delay: (index * 0.1) + (idx * 0.1) }}
                          className="flex items-center justify-between p-4 bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 group/metric"
                        >
                          <span className="text-gray-300 font-medium group-hover/metric:text-white transition-colors">
                            {metric}
                          </span>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={inView ? { scale: 1 } : {}}
                            transition={{ duration: 0.4, delay: (index * 0.1) + (idx * 0.1) + 0.3 }}
                            className={`w-4 h-4 rounded-full bg-gradient-to-r ${item.color} shadow-lg group-hover/metric:scale-110 transition-transform duration-300`}
                          ></motion.div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gray-800/40 backdrop-blur-xl rounded-3xl p-8 border border-gray-700/50 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-2xl font-bold text-white">Combined Impact</h3>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed">
              Through strategic product leadership and AI innovation, delivered measurable results across 
              <span className="text-blue-400 font-semibold"> speed optimization</span>, 
              <span className="text-green-400 font-semibold"> compliance excellence</span>, 
              <span className="text-amber-400 font-semibold"> cost reduction</span>, and 
              <span className="text-purple-400 font-semibold"> revenue growth</span> — 
              transforming vision into quantifiable business value.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};