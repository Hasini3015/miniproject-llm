import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const THEMES = ['dark','light','beach','mountain','gradient'];
const THEME_ICONS = { dark:'🌙', light:'☀️', beach:'🏖️', mountain:'🏔️', gradient:'🌈' };

const Navbar = () => {
  const { user, logout, updateTheme } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to:'/', label:'Home' },
    { to:'/about', label:'About Us' },
    { to:'/tours', label:'Tours' },
    { to:'/gallery', label:'Gallery' },
    { to:'/blogs', label:'Blogs' },
    { to:'/group-travel', label:'Group Travel' },
    { to:'/chat', label:'Community' },
    { to:'/contact', label:'Contact Us' },
  ];

  return (
    <nav className="nav-fixed flex items-center justify-between px-6 md:px-10">
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, fontFamily:"'Playfair Display',serif", fontSize:20, fontWeight:700, textDecoration:'none', color:'var(--text)' }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Nav<span style={{ color:'var(--gold)' }}>AI</span>gate
      </Link>

      <ul style={{ display:'flex', gap:20, listStyle:'none', margin:0, padding:0 }} className="hidden-mobile">
        {navLinks.map(l => (
          <li key={l.to}>
            <Link to={l.to} style={{ fontSize:13, color: isActive(l.to) ? 'var(--text)' : 'var(--text-muted)', textDecoration:'none', transition:'color .2s', fontWeight: isActive(l.to) ? 500 : 400 }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        {/* Budget quick link */}
        <Link to="/budget" title="Budget Tracker" style={{ padding:'6px 10px', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, fontSize:16, textDecoration:'none' }}>💰</Link>

        {/* Theme picker */}
        <div style={{ position:'relative' }}>
          <button onClick={() => setThemeOpen(!themeOpen)} style={{ padding:'6px 10px', background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:8, cursor:'pointer', fontSize:16 }}>🎨</button>
          {themeOpen && (
            <div style={{ position:'absolute', right:0, top:'110%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:8, zIndex:100, minWidth:150, boxShadow:'0 8px 24px rgba(0,0,0,0.3)' }}>
              {THEMES.map(t => (
                <button key={t} onClick={() => { updateTheme(t); setThemeOpen(false); }}
                  style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'8px 12px', background:'transparent', border:'none', color:'var(--text)', cursor:'pointer', borderRadius:6, fontSize:13, fontFamily:"'DM Sans',sans-serif" }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  {THEME_ICONS[t]} {t.charAt(0).toUpperCase()+t.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {user ? (
          <>
            <Link to="/dashboard" style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, color:'var(--text-muted)', textDecoration:'none' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
              {user.name?.split(' ')[0]}
            </Link>
            <button onClick={() => { logout(); navigate('/'); }} style={{ padding:'8px 16px', background:'transparent', border:'1px solid var(--border)', borderRadius:8, fontSize:14, cursor:'pointer', color:'var(--text-muted)', fontFamily:"'DM Sans',sans-serif", transition:'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold)'; e.currentTarget.style.color='var(--gold)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; }}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" style={{ padding:'8px 16px', background:'transparent', border:'1px solid var(--border)', borderRadius:8, fontSize:14, color:'var(--text)', textDecoration:'none', transition:'all .2s' }}>Sign In</Link>
        )}

        <Link to="/my-plan" style={{ padding:'8px 16px', background:'var(--gold)', color:'#000', borderRadius:8, fontSize:14, fontWeight:700, textDecoration:'none' }}>My Plan</Link>
      </div>
    </nav>
  );
};

export default Navbar;
