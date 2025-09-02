import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { profile, kpis } from '../data/profile';
import { KPI } from '../types';
import { ArrowRight, Download, Sparkles, Zap, Target, Linkedin, Mail } from 'lucide-react';

const AnimatedCounter: React.FC<{ kpi: KPI; delay: number }> = ({ kpi, delay }) => {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        const duration = 2000;
        const steps = 60;
        const increment = kpi.value / steps;
        const stepTime = duration / steps;

        let current = 0;
        const counter = setInterval(() => {
          current += increment;
          if (current >= kpi.value) {
            setCount(kpi.value);
            clearInterval(counter);
          } else {
            setCount(Math.floor(current));
          }
        }, stepTime);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [inView, kpi.value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative bg-white shadow-lg hover:shadow-xl rounded-2xl p-8 border border-gray-200 hover:border-blue-300 transition-all duration-500 group-hover:transform group-hover:scale-105">
        <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-500 group-hover:via-purple-500 group-hover:to-blue-500 transition-all duration-500">
          {count.toLocaleString()}{kpi.suffix}
        </div>
        <div className="text-sm text-gray-700 font-semibold mb-2">{kpi.label}</div>
        {kpi.description && (
          <div className="text-xs text-gray-600 leading-relaxed">{kpi.description}</div>
        )}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Sparkles className="w-5 h-5 text-blue-500" />
        </div>
      </div>
    </motion.div>
  );
};

const FloatingParticle: React.FC<{ delay: number; duration: number }> = ({ delay, duration }) => (
  <motion.div
    className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
    initial={{ 
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 20,
      opacity: 0 
    }}
    animate={{
      y: -20,
      opacity: [0, 1, 0],
      scale: [0.5, 1, 0.5]
    }}
    transition={{
      duration,
      delay,
      repeat: Infinity,
      repeatDelay: Math.random() * 5
    }}
  />
);

export const Hero: React.FC = () => {
  const [particles] = useState(() => 
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 4
    }))
  );

  return (
    <section className="relative min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05),transparent_50%)]"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map(particle => (
          <FloatingParticle
            key={particle.id}
            delay={particle.delay}
            duration={particle.duration}
          />
        ))}
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Professional Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Profile Section */}
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Profile Image Placeholder */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <span className="text-white font-bold text-2xl lg:text-3xl">PK</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </motion.div>

              {/* Name and Title */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {profile.name}
                </h1>
                <p className="text-lg text-gray-600 font-medium max-w-md">
                  {profile.tagline}
                </p>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href={profile.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-[#0077B5] hover:bg-[#005885] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Linkedin className="w-5 h-5" />
                Connect on LinkedIn
              </motion.a>

              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Mail className="w-5 h-5" />
                Send me an email
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Hero Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="relative inline-block mb-8"
            >
              <h2 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-gray-900 via-blue-700 to-gray-900 bg-clip-text text-transparent mb-6 leading-none tracking-tight">
                Product Leader
              </h2>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl opacity-50 animate-pulse"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Zap className="w-6 h-6 text-blue-600" />
              <p className="text-2xl md:text-3xl text-blue-700 font-bold">
                AI & LLM Innovator • Builder of Agentic Workflows
              </p>
              <Target className="w-6 h-6 text-purple-600" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed font-medium"
            >
              {profile.subline}
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(59,130,246,0.2)" }}
              whileTap={{ scale: 0.95 }}
              className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden group shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <span className="relative z-10">Let's Build the Future</span>
              <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-700 px-10 py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 hover:bg-blue-50 backdrop-blur-sm shadow-lg"
            >
              <Download className="w-6 h-6" />
              Download Resume
            </motion.button>
          </motion.div>

          {/* Enhanced KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {kpis.map((kpi, index) => (
              <AnimatedCounter key={kpi.label} kpi={kpi} delay={index * 200} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};