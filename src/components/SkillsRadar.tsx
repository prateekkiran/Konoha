import React, { useEffect, useRef } from 'react';
import { skills } from '../data/profile';

export const SkillsRadar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 60;

    const drawRadar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid circles
      for (let i = 1; i <= 5; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, (radius * i) / 5, 0, 2 * Math.PI);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw axes
      const angleStep = (2 * Math.PI) / skills.length;
      
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const endX = centerX + radius * Math.cos(angle);
        const endY = centerY + radius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Draw skill labels
        const labelX = centerX + (radius + 30) * Math.cos(angle);
        const labelY = centerY + (radius + 30) * Math.sin(angle);
        
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter, system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(skill.name, labelX, labelY);
      });

      // Draw skill levels
      ctx.beginPath();
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const skillRadius = (radius * skill.level) / 100;
        const x = centerX + skillRadius * Math.cos(angle);
        const y = centerY + skillRadius * Math.sin(angle);
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.closePath();
      
      // Fill the area
      ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
      ctx.fill();
      
      // Stroke the perimeter
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw skill points
      skills.forEach((skill, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const skillRadius = (radius * skill.level) / 100;
        const x = centerX + skillRadius * Math.cos(angle);
        const y = centerY + skillRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#3B82F6';
        ctx.fill();
        ctx.strokeStyle = '#1E40AF';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    };

    drawRadar();
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Skills Overview</h3>
      <div className="flex justify-center">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="max-w-full h-auto"
        />
      </div>
    </div>
  );
};