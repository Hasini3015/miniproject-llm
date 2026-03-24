import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '60px 40px 32px' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Nav<span style={{ color: 'var(--gold)' }}>AI</span>gate
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 260 }}>Your AI-powered travel companion. Discover India's most incredible destinations, plan smarter, and travel better.</p>
        </div>
        {[
          { title: 'Explore', links: [{ to: '/tours', label: 'Tours' }, { to: '/gallery', label: 'Gallery' }, { to: '/group-travel', label: 'Group Travel' }, { to: '/blogs', label: 'Blogs' }] },
          { title: 'Company', links: [{ to: '/about', label: 'About Us' }, { to: '/contact', label: 'Contact' }, { to: '/', label: 'Privacy Policy' }, { to: '/', label: 'Terms of Service' }] },
          { title: 'Get in Touch', links: [{ to: 'mailto:hello@navaigate.in', label: '✉ hello@navaigate.in' }, { to: 'tel:+911234567890', label: '📞 +91 123 456 7890' }, { to: '/', label: '📍 Hyderabad, India' }] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>{col.title}</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {col.links.map(l => (
                <li key={l.label}><Link to={l.to} style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color .2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--gold)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
        <span>© 2026 NavAIgate India. All rights reserved.</span>
        <span>Built with ♥ and AI</span>
      </div>
    </div>
  </footer>
);

export default Footer;
