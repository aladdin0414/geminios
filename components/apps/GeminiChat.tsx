import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User } from 'lucide-react';
import { createChatSession, sendMessageStream, GeminiChatSession } from '../../services/geminiService';
import { ChatMessage } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';

export const GeminiChat: React.FC = () => {
  const { t, language } = useLanguage();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const sessionRef = useRef<GeminiChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and handle language changes
  useEffect(() => {
    sessionRef.current = createChatSession();
    // Reset messages on mount or just when first opening? 
    // Let's just add the welcome message in current language
    setMessages([
        {
          role: 'model',
          text: t('gemini.welcome'),
          timestamp: new Date()
        }
    ]);
  }, [t]); // Re-init when language changes to update welcome message? Or just init once?
  // Better: When language changes, we might want to inform the model, but for now let's just reset or keep history. 
  // For this demo, re-initializing on language change ensures the welcome message matches.

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !sessionRef.current) return;

    const userText = input;
    setInput('');
    setIsLoading(true);

    // Add user message
    setMessages(prev => [
      ...prev,
      { role: 'user', text: userText, timestamp: new Date() }
    ]);

    try {
      // Add placeholder for AI response
      setMessages(prev => [
        ...prev,
        { role: 'model', text: '', timestamp: new Date(), isStreaming: true }
      ]);

      let fullResponse = '';
      
      // Inject language instruction if needed, but simplest is to just send user text. 
      // The model usually auto-detects. To be safe, we could prepend system instruction updates, 
      // but standard usage is sufficient.
      const stream = sendMessageStream(sessionRef.current, userText);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'model' && lastMsg.isStreaming) {
            lastMsg.text = fullResponse;
          }
          return newMessages;
        });
      }

      // Finalize
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMsg = newMessages[newMessages.length - 1];
        if (lastMsg.role === 'model') {
          lastMsg.isStreaming = false;
        }
        return newMessages;
      });

    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 glass-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${msg.role === 'model' 
                ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg text-white' 
                : 'bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-200'}
            `}>
              {msg.role === 'model' ? <Sparkles size={16} /> : <User size={16} />}
            </div>
            
            <div className={`
              max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm
              ${msg.role === 'user' 
                ? 'bg-blue-500 text-white rounded-tr-sm' 
                : 'bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-tl-sm'}
            `}>
              <div className="whitespace-pre-wrap font-normal">
                {msg.text}
                {msg.isStreaming && (
                  <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-blue-400 animate-pulse"></span>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-700">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('gemini.placeholder')}
            disabled={isLoading}
            className="w-full pl-4 pr-12 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-center mt-2">
           <p className="text-[10px] text-slate-400 dark:text-slate-500">
            {t('gemini.powered')}
           </p>
        </div>
      </div>
    </div>
  );
};