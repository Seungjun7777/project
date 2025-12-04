import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { getAICoachingResponse } from '../services/geminiService';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const MindfulChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "안녕하세요. 오늘 하루는 어떠셨나요? 힘들거나 고민되는 일이 있다면 편하게 이야기해주세요. 제가 들어드릴게요.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const history = messages.map(m => ({ role: m.role, text: m.text }));
    const responseText = await getAICoachingResponse(userMsg.text, history);

    const aiMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm">
            <Bot size={24} className="text-indigo-600" />
        </div>
        <div>
            <h3 className="font-bold text-slate-800">마음 챙김 코치</h3>
            <p className="text-xs text-slate-500">당신의 속도로 함께 걸어요</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-slate-200' : 'bg-indigo-100'
            }`}>
              {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} className="text-indigo-600" />}
            </div>
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
              msg.role === 'user' 
                ? 'bg-slate-800 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-12">
            <Loader2 size={16} className="animate-spin" />
            <span>생각하는 중...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-4 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
          <input
            type="text"
            className="flex-1 bg-transparent focus:outline-none text-sm py-2"
            placeholder="지금 드는 생각을 편하게 적어주세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MindfulChat;