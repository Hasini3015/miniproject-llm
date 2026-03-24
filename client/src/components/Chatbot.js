import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Chatbot = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m NavBot 🤖 Your AI travel assistant. Ask me anything about India travel, plans, budgets, or destinations!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
      const res = await axios.post('/api/ai/chat', { message: input, history });
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Try checking our Tours or MyPlan sections!' }]);
    } finally { setLoading(false); }
  };

  if (!user) return null;

  return (
    <>
      {open && (
        <div className="chatbot-window">
          {/* Header */}
          <div style={{ background: 'var(--gold)', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 22 }}>🤖</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#000' }}>NavBot</div>
                <div style={{ fontSize: 11, color: 'rgba(0,0,0,0.6)' }}>AI Travel Assistant</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', color: '#000' }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 8px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div className={`chat-bubble ${m.role === 'user' ? 'sent' : 'received'}`}>{m.content}</div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', marginBottom: 10 }}>
                <div className="chat-bubble received" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0s' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.2s' }}>●</span>
                  <span style={{ animation: 'pulse 1s infinite', animationDelay: '0.4s' }}>●</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask anything about travel..."
              style={{ flex: 1, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'DM Sans, sans-serif' }} />
            <button onClick={send} style={{ background: 'var(--gold)', border: 'none', borderRadius: 8, width: 36, height: 36, cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>➤</button>
          </div>
        </div>
      )}
      <button className="chatbot-fab" onClick={() => setOpen(!open)}>{open ? '✕' : '🤖'}</button>
    </>
  );
};

export default Chatbot;
