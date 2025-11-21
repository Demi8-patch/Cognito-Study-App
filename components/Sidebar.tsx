import React from 'react';
import { BookOpen, Terminal, Code, Settings, PieChart, GraduationCap } from 'lucide-react';
import { ModuleType, Lesson } from '../types';

interface SidebarProps {
  currentModule: ModuleType;
  setCurrentModule: (m: ModuleType) => void;
  activeView: 'dashboard' | 'chat';
  setActiveView: (v: 'dashboard' | 'chat') => void;
  lessons: Lesson[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  currentModule, 
  setCurrentModule, 
  activeView, 
  setActiveView,
  lessons 
}) => {
  return (
    <div className="w-64 bg-dark-bg border-r border-dark-border flex flex-col h-full hidden md:flex">
      <div className="p-6 border-b border-dark-border flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
            <GraduationCap className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 tracking-tight">
          Cognito
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Main</p>
          <button
            onClick={() => setActiveView('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              activeView === 'dashboard' 
                ? 'bg-brand-500/10 text-brand-400' 
                : 'text-slate-400 hover:bg-dark-surface hover:text-slate-200'
            }`}
          >
            <PieChart size={18} />
            Dashboard
          </button>
          <button
            onClick={() => setActiveView('chat')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mt-1 ${
              activeView === 'chat' 
                ? 'bg-brand-500/10 text-brand-400' 
                : 'text-slate-400 hover:bg-dark-surface hover:text-slate-200'
            }`}
          >
            <Code size={18} />
            AI Tutor Chat
          </button>
        </div>

        <div className="px-4 mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Modules</p>
          <button
            onClick={() => setCurrentModule(ModuleType.PYTHON)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentModule === ModuleType.PYTHON 
                ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' 
                : 'text-slate-400 hover:bg-dark-surface hover:text-slate-200'
            }`}
          >
            <Terminal size={18} />
            Python Master
          </button>
          <button
            onClick={() => setCurrentModule(ModuleType.PROMPT_ENG)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mt-2 ${
              currentModule === ModuleType.PROMPT_ENG 
                ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                : 'text-slate-400 hover:bg-dark-surface hover:text-slate-200'
            }`}
          >
            <BookOpen size={18} />
            Prompt Engineering
          </button>
        </div>

        <div className="px-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Recent Lessons</p>
          <div className="space-y-1">
            {lessons.map(lesson => (
                <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 text-slate-400 text-xs hover:bg-dark-surface rounded-lg cursor-pointer group">
                    <div className={`w-1.5 h-1.5 rounded-full ${lesson.isCompleted ? 'bg-green-500' : 'bg-slate-600 group-hover:bg-brand-400'}`} />
                    <span className="truncate">{lesson.title}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-dark-border">
        <button className="flex items-center gap-3 text-slate-400 hover:text-white text-sm px-2 transition-colors">
            <Settings size={18} />
            <span>Settings</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;