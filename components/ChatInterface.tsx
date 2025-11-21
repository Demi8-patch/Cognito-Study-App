
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Send, Paperclip, Mic, Image as ImageIcon, FileCode, X, RefreshCw, Database, Zap } from 'lucide-react';
import { Message, Role, Attachment, ModuleType } from '../types';
import { generateResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  currentModule: ModuleType;
  updateProgress: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentModule, updateProgress }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: `Hello! I'm Cognito. I'm running on a **System V2 Architecture** with Circuit Breakers and RAG enabled. \n\nAsk me about Python or Prompt Engineering.`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Reset welcome message when module changes
  useEffect(() => {
     setMessages([{
      id: `welcome-${currentModule}`,
      role: Role.MODEL,
      text: `Switched to **${currentModule === ModuleType.PYTHON ? 'Python Programming' : 'Prompt Engineering'}** mode. \n\nSystem status: HEALTHY.`,
      timestamp: Date.now()
    }]);
  }, [currentModule]);

  const handleSendMessage = async () => {
    if ((!inputText.trim() && attachments.length === 0) || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      text: inputText,
      attachments: [...attachments],
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachments([]);
    setIsTyping(true);

    // Call Gemini Service (Now returns object with stats)
    const response = await generateResponse(messages, userMsg.text, userMsg.attachments || [], currentModule);
    
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      text: response.text,
      timestamp: Date.now(),
      latency: response.latency,
      usedRAG: response.usedRAG
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
    updateProgress(); 
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const base64String = (event.target.result as string).split(',')[1];
          const newAttachment: Attachment = {
            name: file.name,
            type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'text',
            mimeType: file.type,
            data: base64String
          };
          setAttachments(prev => [...prev, newAttachment]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg text-slate-200">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-4 shadow-md relative ${
                msg.role === Role.USER
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-dark-surface border border-dark-border text-slate-200 rounded-tl-none'
              }`}
            >
              {/* Telemetry Badge for AI messages */}
              {msg.role === Role.MODEL && msg.latency && (
                <div className="absolute -top-3 right-0 flex gap-2">
                    {msg.usedRAG && (
                         <span className="bg-purple-900/80 border border-purple-700 text-purple-200 text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Database size={8} /> RAG
                         </span>
                    )}
                    <span className="bg-slate-800/80 border border-slate-700 text-slate-400 text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
                        <Zap size={8} /> {msg.latency}ms
                    </span>
                </div>
              )}

              {/* Attachments Display in Bubble */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {msg.attachments.map((att, idx) => (
                    <div key={idx} className="bg-black/20 rounded p-2 flex items-center gap-2 text-xs">
                       {att.type === 'image' ? <ImageIcon size={14} /> : <FileCode size={14} />}
                       <span className="truncate max-w-[150px]">{att.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="prose prose-invert prose-sm max-w-none leading-relaxed">
                <ReactMarkdown
                    components={{
                        code({node, className, children, ...props}) {
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                                <div className="rounded-md overflow-hidden my-2 bg-[#1e1e1e] border border-gray-700">
                                    <div className="bg-[#2d2d2d] px-3 py-1 text-xs text-gray-400 font-mono border-b border-gray-700 flex justify-between items-center">
                                        <span>{match[1]}</span>
                                    </div>
                                    <pre className="p-3 overflow-x-auto m-0">
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </pre>
                                </div>
                            ) : (
                                <code className="bg-slate-700/50 px-1 py-0.5 rounded text-brand-200 font-mono text-xs" {...props}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                >
                    {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-dark-surface border border-dark-border rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-400" />
              <span className="text-sm text-slate-400">Processing System Flow...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-dark-surface border-t border-dark-border">
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative group bg-slate-800 rounded-lg p-2 pr-8 border border-slate-700 flex items-center gap-2 min-w-[120px]">
                {att.type === 'image' ? (
                  <img src={`data:${att.mimeType};base64,${att.data}`} alt="preview" className="w-8 h-8 object-cover rounded" />
                ) : (
                  <FileCode className="w-8 h-8 text-brand-400" />
                )}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs text-slate-300 font-medium truncate w-24">{att.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{att.type}</span>
                </div>
                <button
                  onClick={() => removeAttachment(idx)}
                  className="absolute top-1 right-1 p-1 hover:bg-red-500/20 rounded-full text-slate-400 hover:text-red-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="relative flex items-end gap-2 bg-dark-bg p-2 rounded-xl border border-dark-border focus-within:border-brand-500 transition-colors">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*,application/pdf,.txt,.py,.js,.md"
                onChange={handleFileSelect}
            />
            <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                title="Attach file (Image, PDF, Code)"
            >
                <Paperclip size={20} />
            </button>
            
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 resize-none max-h-32 min-h-[44px] py-2.5 focus:outline-none text-sm font-sans"
                rows={1}
            />

            <button
                className="p-2 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 rounded-lg transition-colors"
                title="Voice Input (Demo)"
            >
                <Mic size={20} />
            </button>
            <button
                onClick={handleSendMessage}
                disabled={(!inputText.trim() && attachments.length === 0) || isTyping}
                className="p-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-brand-500/20"
            >
                <Send size={20} />
            </button>
        </div>
        <div className="text-center mt-2">
            <p className="text-[10px] text-slate-500">
                Cognito System V2: Observability & Resilience Layers Active.
            </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
