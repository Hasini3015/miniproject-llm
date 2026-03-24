import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AuthCard = ({ children }) => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px 40px', background: 'var(--bg)' }}>
    <div className="card" style={{ padding: 48, width: '100%', maxWidth: 420 }}>{children}</div>
  </div>
);

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { showToast('Please fill all fields', 'error'); return; }
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back! 🎉', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard>
      <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 16, color: 'var(--gold)' }}>✦</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, textAlign: 'center', marginBottom: 6 }}>Welcome Back</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32 }}>Sign in to continue your journey</p>

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>✉</span>
          <input className="input-field" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔒</span>
          <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 40 }} />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>{showPass ? '🙈' : '👁'}</button>
        </div>
        <button type="submit" className="btn-gold" style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 8, borderRadius: 10 }} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
        Don't have an account? <Link to="/signup" style={{ color: 'var(--gold)' }}>Sign Up</Link>
      </p>
    </AuthCard>
  );
};

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) { showToast('Please fill all fields', 'error'); return; }
    if (password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return; }
    setLoading(true);
    try {
      await signup(name, email, password);
      showToast('Account created! Welcome aboard 🚀', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Signup failed', 'error');
    } finally { setLoading(false); }
  };

  return (
    <AuthCard>
      <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 16, color: 'var(--gold)' }}>✦</div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, textAlign: 'center', marginBottom: 6 }}>Create Account</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', textAlign: 'center', marginBottom: 32 }}>Start your AI travel journey today</p>

      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>👤</span>
          <input className="input-field" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>✉</span>
          <input className="input-field" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} style={{ paddingLeft: 40 }} />
        </div>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔒</span>
          <input className="input-field" type={showPass ? 'text' : 'password'} placeholder="Create password" value={password} onChange={e => setPassword(e.target.value)} style={{ paddingLeft: 40, paddingRight: 40 }} />
          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16 }}>{showPass ? '🙈' : '👁'}</button>
        </div>
        <button type="submit" className="btn-gold" style={{ width: '100%', padding: 14, fontSize: 16, marginTop: 8, borderRadius: 10 }} disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
      <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--gold)' }}>Sign In</Link>
      </p>
    </AuthCard>
  );
};

export default Login;
