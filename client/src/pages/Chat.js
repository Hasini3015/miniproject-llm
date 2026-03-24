import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../utils/data';

let socket;

const Chat = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [room, setRoom] = useState('Goa');
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onlineCount, setOnlineCount] = useState(Math.floor(Math.random() * 8) + 2);
  const [typing, setTyping] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) return;
    socket = io('http://localhost:5000', { transports: ['websocket'] });

    socket.on('room_history', (history) => {
      setMessages(history || []);
    });

    socket.on('receive_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on('user_joined', ({ username }) => {
      setMessages(prev => [...prev, { id: Date.now(), system: true, message: `${username} joined the room 👋`, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
      setOnlineCount(c => c + 1);
    });

    socket.on('user_left', ({ username }) => {
      setMessages(prev => [...prev, { id: Date.now(), system: true, message: `${username} left the room`, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]);
      setOnlineCount(c => Math.max(1, c - 1));
    });

    return () => { socket.disconnect(); };
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const joinRoom = (selectedRoom) => {
    if (socket && user) {
      if (joined) socket.emit('leave_room', { room, username: user.name });
      setRoom(selectedRoom);
      setMessages([]);
      socket.emit('join_room', { room: selectedRoom, username: user.name });
      setJoined(true);
      setOnlineCount(Math.floor(Math.random() * 8) + 2);
    }
  };

  const sendMessage = () => {
    if (!input.trim() || !joined) return;
    socket.emit('send_message', { room, message: input, username: user.name });
    setInput('');
  };

  if (!user) {
    return (
      <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 8 }}>Join the <span style={{ color: 'var(--gold)' }}>Community</span></h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Login to chat with fellow travelers in destination-based rooms.</p>
          <button className="btn-gold" style={{ width: '100%', padding: 12 }} onClick={() => navigate('/login')}>Sign In to Chat</button>
        </div>
      </div>
    );
  }

  const destNames = DESTINATIONS.map(d => d.name);

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900 }}>
            Community <span style={{ color: 'var(--gold)' }}>Chat</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>
            Connect with fellow travelers in destination-based rooms
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, height: 'calc(100vh - 240px)', minHeight: 500 }}>
          {/* Sidebar - Rooms */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 4 }}>Destination Rooms</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
              {destNames.map(dest => (
                <button key={dest} onClick={() => joinRoom(dest)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 12px',
                    background: room === dest && joined ? 'rgba(245,166,35,0.1)' : 'transparent',
                    border: `1px solid ${room === dest && joined ? 'rgba(245,166,35,0.4)' : 'transparent'}`,
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left', marginBottom: 2, transition: 'all .2s'
                  }}
                  onMouseEnter={e => { if (!(room === dest && joined)) e.currentTarget.style.background = 'var(--surface2)'; }}
                  onMouseLeave={e => { if (!(room === dest && joined)) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ fontSize: 18 }}>📍</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: room === dest && joined ? 600 : 400, color: room === dest && joined ? 'var(--gold)' : 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dest}</div>
                  </div>
                  {room === dest && joined && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--teal)', flexShrink: 0 }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Chat Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>📍</span>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{room}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: joined ? 'var(--teal)' : 'var(--text-muted)' }} />
                    {joined ? `${onlineCount} online` : 'Click a room to join'}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room + ' India')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ padding: '6px 12px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>
                  🗺️ View Map
                </a>
                {!joined && (
                  <button className="btn-gold" style={{ padding: '6px 16px', fontSize: 13 }} onClick={() => joinRoom(room)}>
                    Join Room
                  </button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {!joined ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: 48 }}>💬</span>
                  <p>Select a destination room to start chatting</p>
                  <button className="btn-gold" style={{ padding: '10px 24px' }} onClick={() => joinRoom('Goa')}>Join Goa Room</button>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--text-muted)' }}>
                  <span style={{ fontSize: 40 }}>👋</span>
                  <p>You joined <strong style={{ color: 'var(--gold)' }}>{room}</strong>!</p>
                  <p style={{ fontSize: 13 }}>Be the first to say hello.</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id}>
                    {msg.system ? (
                      <div style={{ textAlign: 'center', margin: '8px 0' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)', background: 'var(--surface2)', padding: '3px 12px', borderRadius: 20 }}>{msg.message}</span>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: msg.username === user.name ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 12 }}>
                        {msg.username !== user.name && (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000', flexShrink: 0 }}>
                            {msg.username?.[0]?.toUpperCase()}
                          </div>
                        )}
                        <div style={{ maxWidth: '70%' }}>
                          {msg.username !== user.name && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 3, paddingLeft: 4 }}>{msg.username}</div>
                          )}
                          <div className={`chat-bubble ${msg.username === user.name ? 'sent' : 'received'}`}>
                            {msg.message}
                          </div>
                          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3, textAlign: msg.username === user.name ? 'right' : 'left', paddingLeft: 4 }}>
                            {msg.time}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
              {typing && <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '0 0 8px' }}>{typing} is typing...</div>}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <input value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder={joined ? `Message #${room}...` : 'Join a room to chat...'}
                disabled={!joined}
                className="input-field"
                style={{ flex: 1, opacity: joined ? 1 : .5 }} />
              <button onClick={sendMessage} disabled={!joined || !input.trim()}
                style={{ width: 44, height: 44, background: joined && input.trim() ? 'var(--gold)' : 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 10, cursor: joined ? 'pointer' : 'not-allowed', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s', flexShrink: 0 }}>
                ➤
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div style={{ marginTop: 20, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['💡 Share travel tips & experiences', '🤝 Find travel buddies', '📅 Coordinate group trips', '🏨 Get hotel recommendations'].map(tip => (
            <div key={tip} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 14px', fontSize: 13, color: 'var(--text-muted)' }}>{tip}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
