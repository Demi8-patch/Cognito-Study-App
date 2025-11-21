
import React from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { UserProgress } from '../types';
import SystemMonitor from './SystemMonitor';

interface DashboardProps {
  progress: UserProgress;
}

const Dashboard: React.FC<DashboardProps> = ({ progress }) => {
  const data = [
    { subject: 'Python Syntax', A: progress.pythonScore, fullMark: 100 },
    { subject: 'System Design', A: progress.pythonScore * 0.8, fullMark: 100 },
    { subject: 'Prompting', A: progress.promptScore, fullMark: 100 },
    { subject: 'RAG Concepts', A: progress.promptScore * 0.7, fullMark: 100 },
    { subject: 'Security', A: 65, fullMark: 100 },
    { subject: 'Optimization', A: 50, fullMark: 100 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in overflow-y-auto">
      {/* Top Row: System Health (Systems Thinking View) */}
      <SystemMonitor />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Skill Radar</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar
                  name="Current Skills"
                  dataKey="A"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="#0ea5e9"
                  fillOpacity={0.3}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Learning Status</h2>
            <p className="text-slate-400 mb-6">You are currently at the <span className="text-brand-400 font-semibold">{progress.currentLevel}</span> level.</p>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Python Mastery</span>
                  <span className="text-brand-300">{progress.pythonScore}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className="bg-brand-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress.pythonScore}%` }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Prompt Engineering</span>
                  <span className="text-purple-400">{progress.promptScore}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${progress.promptScore}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-200 mb-2">Next Leverage Point</h3>
            <p className="text-xs text-slate-400">
              Increase your system impact by focusing on <strong>B-Loops in Python Asyncio</strong> next.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
