import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import Dashboard from './components/Dashboard';
import { ModuleType, UserProgress, Lesson } from './types';
import { INITIAL_LESSONS } from './constants';
import { Menu } from 'lucide-react';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.PYTHON);
  const [activeView, setActiveView] = useState<'dashboard' | 'chat'>('chat');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Mock Progress State
  const [progress, setProgress] = useState<UserProgress>({
    pythonScore: 45,
    promptScore: 30,
    completedLessons: ['1'],
    currentLevel: 'Beginner'
  });

  const [lessons, setLessons] = useState<Lesson[]>(INITIAL_LESSONS);

  const handleProgressUpdate = () => {
    // Simulate learning progress when chatting
    setProgress(prev => ({
        ...prev,
        pythonScore: Math.min(100, prev.pythonScore + (currentModule === ModuleType.PYTHON ? 2 : 0)),
        promptScore: Math.min(100, prev.promptScore + (currentModule === ModuleType.PROMPT_ENG ? 2 : 0))
    }));
  };

  return (
    <div className="flex h-screen w-full bg-dark-bg text-slate-100 font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
        activeView={activeView}
        setActiveView={setActiveView}
        lessons={lessons}
      />

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-dark-bg border-b border-dark-border flex items-center px-4 z-50">
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-200">
            <Menu />
        </button>
        <span className="ml-4 font-bold text-lg">Cognito AI</span>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden pt-16" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="bg-dark-surface w-64 h-full p-4" onClick={e => e.stopPropagation()}>
                {/* Reusing sidebar logic simplified for mobile would go here, 
                    but for this code gen we'll just keep the desktop sidebar visible on larger screens 
                    and hide it here to keep the file count low per instructions. 
                    Ideally Sidebar would be responsive. */}
                <div className="flex flex-col gap-4">
                     <button onClick={() => { setActiveView('dashboard'); setIsMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-700 rounded">Dashboard</button>
                     <button onClick={() => { setActiveView('chat'); setIsMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-700 rounded">Chat</button>
                     <hr className="border-slate-700"/>
                     <button onClick={() => { setCurrentModule(ModuleType.PYTHON); setIsMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-700 rounded text-brand-400">Python Module</button>
                     <button onClick={() => { setCurrentModule(ModuleType.PROMPT_ENG); setIsMobileMenuOpen(false); }} className="p-2 text-left hover:bg-slate-700 rounded text-purple-400">Prompt Engineering</button>
                </div>
            </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full pt-16 md:pt-0 relative overflow-hidden">
        {/* Header (Desktop) */}
        <header className="h-16 border-b border-dark-border flex items-center justify-between px-6 bg-dark-bg/80 backdrop-blur hidden md:flex">
            <h2 className="text-lg font-medium text-slate-200">
                {activeView === 'dashboard' ? 'Overview' : currentModule === ModuleType.PYTHON ? 'Python Programming' : 'Prompt Engineering Strategies'}
            </h2>
            <div className="flex items-center gap-4">
                 <span className="text-xs text-slate-500 bg-dark-surface px-2 py-1 rounded border border-dark-border">
                    Gemini 2.5 Flash Active
                 </span>
            </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-hidden relative">
            {activeView === 'dashboard' ? (
                <div className="h-full overflow-y-auto">
                    <Dashboard progress={progress} />
                </div>
            ) : (
                <ChatInterface 
                    currentModule={currentModule} 
                    updateProgress={handleProgressUpdate}
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;