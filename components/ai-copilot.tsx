'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, X, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function AICopilot({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hi! I am your AI Auditor Copilot. How can I help you analyze the dashboard data today?',
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!response.ok) throw new Error('Failed to fetch response');
      
      const data = await response.json();
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: "I encountered an error connecting to the AI engine. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // If closed, show a floating button or tab
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl hover:shadow-indigo-500/25 transition-all hover:scale-105 z-50 flex items-center gap-2",
          className
        )}
      >
        <Sparkles className="w-5 h-5" />
        <span className="font-semibold text-sm pr-1">Ask AI</span>
      </button>
    );
  }

  return (
    <div className={cn("fixed bottom-6 right-6 w-80 sm:w-96 flex flex-col bg-[var(--color-bg-primary)] border border-[var(--color-border-default)] rounded-xl shadow-2xl z-50 overflow-hidden h-[500px] max-h-[80vh]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-default)] bg-[var(--color-bg-hover)]">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Bot className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-semibold text-sm text-[var(--color-text-primary)]">Auditor Copilot</span>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={cn("flex items-start gap-2 max-w-[85%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
            <div className={cn("flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-1", msg.role === 'user' ? "bg-indigo-500/20 text-indigo-400" : "bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]")}>
              {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            <div className={cn("px-3 py-2 rounded-lg text-sm leading-relaxed whitespace-pre-wrap", msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]")}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-2 max-w-[85%]">
            <div className="flex-shrink-0 w-6 h-6 rounded flex items-center justify-center mt-1 bg-[var(--color-bg-hover)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="px-3 py-2 rounded-lg text-sm bg-[var(--color-bg-hover)] text-[var(--color-text-primary)] border border-[var(--color-border-default)] flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-[var(--color-border-default)] bg-[var(--color-bg-primary)]">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about claims, anomalies..."
            className="w-full bg-[var(--color-bg-hover)] border border-[var(--color-border-default)] text-[var(--color-text-primary)] text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 p-1.5 rounded-full bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
