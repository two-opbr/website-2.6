import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, DollarSign, Users, Palette, Shield } from 'lucide-react';
import { useUserStats } from '../hooks/useUserStats';

interface SkillNode {
  name: string;
  icon: any;
  color: string;
  level: number;
  xp: number;
  angle: number;
}

const SkillTree = () => {
  const { skillsData, loading } = useUserStats();
  
  const skillNodes: SkillNode[] = [
    {
      name: "Mind",
      icon: Brain,
      color: "from-blue-500 to-purple-500",
      level: skillsData.find(s => s.skill_name === 'Mind')?.level || 0,
      xp: skillsData.find(s => s.skill_name === 'Mind')?.xp || 0,
      angle: 0
    },
    {
      name: "Body",
      icon: Heart,
      color: "from-green-500 to-blue-500",
      level: skillsData.find(s => s.skill_name === 'Body')?.level || 0,
      xp: skillsData.find(s => s.skill_name === 'Body')?.xp || 0,
      angle: 60
    },
    {
      name: "Wealth",
      icon: DollarSign,
      color: "from-yellow-500 to-orange-500",
      level: skillsData.find(s => s.skill_name === 'Wealth')?.level || 0,
      xp: skillsData.find(s => s.skill_name === 'Wealth')?.xp || 0,
      angle: 120
    },
    {
      name: "Relationships",
      icon: Users,
      color: "from-pink-500 to-red-500",
      level: skillsData.find(s => s.skill_name === 'Relationships')?.level || 0,
      xp: skillsData.find(s => s.skill_name === 'Relationships')?.xp || 0,
      angle: 180
    },
    {
      name: "Creativity",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      level: skillsData.find(s => s.skill_name === 'Creativity')?.level || 0,
      xp: skillsData.find(s => s.skill_name === 'Creativity')?.xp || 0,
      angle: 240
    },
    {
      name: "Discipline",
      icon: Shield,
      color: "from-red-500 to-purple-500",
      level: skillsData.find(s => s.skill_name === 'Discipline')?.level || 0,
      xp: skillsData.find(s => s.skill_name === 'Discipline')?.xp || 0,
      angle: 300
    }
  ];

  const getNodePosition = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radian) * radius,
      y: Math.sin(radian) * radius
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Mastery Tree</h2>
        <p className="text-gray-300">Your journey radiates outward from the center - you are the hub of your own mastery</p>
      </div>
      
      <div className="flex justify-center">
        <div className="relative w-96 h-96 bg-gradient-to-br from-gray-900/50 to-slate-900/20 border border-cyan-500/20 rounded-full">
          {/* Central User Node */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center border-4 border-white/20"
          >
            <span className="text-2xl">🎯</span>
          </motion.div>

          {/* Skill Nodes */}
          {skillNodes.map((skill, index) => {
            const position = getNodePosition(skill.angle, 140);
            const progress = skill.level > 0 ? ((skill.xp % 100) / 100) * 100 : 0;
            
            return (
              <motion.div
                key={skill.name}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                style={{
                  left: `calc(50% + ${position.x}px)`,
                  top: `calc(50% + ${position.y}px)`
                }}
              >
                {/* Connection Line */}
                <svg
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  width="160"
                  height="160"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${skill.angle}deg)`
                  }}
                >
                  <motion.line
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    x1="80"
                    y1="80"
                    x2="20"
                    y2="80"
                    stroke={skill.level > 0 ? "#06b6d4" : "#374151"}
                    strokeWidth="2"
                    className={skill.level > 0 ? "drop-shadow-sm" : ""}
                  />
                </svg>

                {/* Skill Node */}
                <div className="relative">
                  <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 ${
                    skill.level > 0
                      ? `bg-gradient-to-r ${skill.color} border-cyan-400 shadow-lg shadow-cyan-500/20`
                      : 'bg-gray-700 border-gray-500'
                  }`}>
                    <skill.icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Level Badge */}
                  {skill.level > 0 && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-600 rounded-full flex items-center justify-center border-2 border-gray-900">
                      <span className="text-white text-xs font-bold">{skill.level}</span>
                    </div>
                  )}

                  {/* Progress Ring */}
                  {skill.level > 0 && (
                    <svg className="absolute inset-0 w-12 h-12 transform -rotate-90">
                      <circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="rgba(6, 182, 212, 0.2)"
                        strokeWidth="2"
                        fill="none"
                      />
                      <motion.circle
                        cx="24"
                        cy="24"
                        r="22"
                        stroke="#06b6d4"
                        strokeWidth="2"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: progress / 100 }}
                        transition={{ duration: 1.5, delay: index * 0.1 }}
                        style={{
                          strokeDasharray: `${2 * Math.PI * 22}`,
                          strokeDashoffset: `${2 * Math.PI * 22 * (1 - progress / 100)}`
                        }}
                      />
                    </svg>
                  )}

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/90 text-white text-xs px-3 py-2 rounded whitespace-nowrap">
                      <div className="font-semibold">{skill.name}</div>
                      <div className="text-cyan-400">Level {skill.level}</div>
                      {skill.level > 0 && (
                        <div className="text-gray-300">{skill.xp} XP</div>
                      )}
                    </div>
                  </div>

                  {/* Glow effect for active skills */}
                  {skill.level > 0 && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${skill.color} opacity-20 blur-sm`}
                    />
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
        {skillNodes.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="text-center p-3 bg-gray-800/30 rounded-lg"
          >
            <div className={`inline-flex p-2 bg-gradient-to-r ${skill.color} rounded-lg mb-2`}>
              <skill.icon className="h-4 w-4 text-white" />
            </div>
            <div className="text-sm font-semibold text-white">{skill.name}</div>
            <div className="text-xs text-cyan-400">Level {skill.level}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillTree;