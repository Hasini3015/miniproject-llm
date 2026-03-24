import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DESTINATIONS } from '../utils/data';
import Footer from '../components/Footer';

const S = { // inline style helpers
  section: { padding: '80px 40px' },
  label: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, color: 'var(--gold)', marginBottom: 12 },
  title: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,4vw,48px)', fontWeight: 700, marginBottom: 16 },
  sub: { fontSize: 16, color: 'var(--text-muted)', maxWidth: 500, lineHeight: 1.6 },
};

const features = [
  { icon: '🧠', title: 'AI Itinerary Generator', desc: 'Get 4 personalized travel plans — Budget, Deluxe, Luxury & Jackpot — generated instantly by AI.' },
  { icon: '✨', title: 'Dynamic Plan Modification', desc: 'Tell the AI "make it cheaper" or "add adventure sports" and watch your plan update instantly.' },
  { icon: '💰', title: 'Budget Tracker', desc: 'Real-time cost calculations with smart alerts when you approach your budget limit.' },
  { icon: '🗺️', title: 'Google Maps Navigation', desc: 'One-tap directions to every location in your itinerary — directly from your plan.' },
  { icon: '🌦️', title: 'Weather-Based Adjustment', desc: 'AI automatically adjusts your itinerary based on live weather data.' },
  { icon: '👥', title: 'Community Connect', desc: 'Join destination-based groups, share tips, and find travel buddies.' },
];

const Home = () => {
  const navigate = useNavigate();
  return (
    <div style={{ paddingTop: 64 }}>
      {/* Hero */}
      <div style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1600&q=80) center/cover no-repeat', filter: 'brightness(0.4)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(13,13,13,0.7))' }} />
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: 800, padding: '0 20px' }} className="animate-fadeUp">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 16px', border: '1px solid rgba(245,166,35,0.4)', borderRadius: 20, fontSize: 12, color: 'var(--gold)', marginBottom: 24, backdropFilter: 'blur(4px)', background: 'rgba(245,166,35,0.08)' }}>✦ AI-Powered Travel Planning</div>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(48px,8vw,88px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 20 }}>
            NavAIgate <span style={{ color: 'var(--gold)' }}>India</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.75)', marginBottom: 40, lineHeight: 1.6, maxWidth: 520, margin: '0 auto 40px' }}>Plan Smart. Travel Better. Connect with fellow travelers and explore India's 20 most incredible destinations.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold" style={{ padding: '14px 32px', fontSize: 16 }} onClick={() => navigate('/tours')}>Explore Tours</button>
            <button className="btn-outline" style={{ padding: '14px 32px', fontSize: 16, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(4px)' }} onClick={() => navigate('/my-plan')}>Plan My Trip →</button>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
          <span>Scroll to explore</span>
          <div style={{ width: 6, height: 6, background: 'rgba(255,255,255,0.4)', borderRadius: '50%', animation: 'bounce 1.5s infinite' }} />
        </div>
      </div>

      {/* Stats */}
      <div style={{ background: 'var(--surface)', padding: '48px 40px', display: 'flex', justifyContent: 'center', gap: 60, flexWrap: 'wrap', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        {[['20+','Destinations'],['4','Plan Types'],['10K+','Happy Travelers'],['AI','Powered Planning']].map(([n,l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 40, fontWeight: 700, color: 'var(--gold)' }}>{n}</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={S.section}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={S.label}>WHAT WE OFFER</div>
            <h2 style={S.title}>Everything You Need to Travel Smart</h2>
            <p style={{ ...S.sub, margin: '0 auto' }}>From AI-generated itineraries to real-time budget tracking — all in one platform.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} className="card card-hover" style={{ padding: 28 }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section style={{ ...S.section, background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={S.label}>TOP PICKS</div>
              <h2 style={{ ...S.title, marginBottom: 0 }}>Popular Destinations</h2>
            </div>
            <Link to="/tours" className="btn-outline" style={{ textDecoration: 'none', borderRadius: 8, border: '1px solid var(--border)', color: 'var(--text)', padding: '10px 20px', fontSize: 14 }}>View All 20 →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
            {DESTINATIONS.slice(0, 8).map(d => (
              <div key={d.name} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer' }}
                onClick={() => navigate('/my-plan')}
                onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.07)'}
                onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
                <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} loading="lazy" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.75),transparent)' }} />
                <div style={{ position: 'absolute', bottom: 16, left: 16 }}>
                  <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>📍 {d.state}</div>
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'var(--gold)', color: '#000', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>{d.tags[0]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section style={S.section}>
        <div style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--surface)', borderRadius: 24, padding: 60 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={S.label}>SIMPLE PROCESS</div>
            <h2 style={S.title}>How NavAIgate Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 32, marginTop: 48 }}>
            {[
              ['1','Choose Destination','Pick from 20 curated India destinations — beaches, mountains, heritage, and more.'],
              ['2','Set Preferences','Tell us your travel dates, group size, food preference, and activity level.'],
              ['3','Get 4 AI Plans','Receive Budget, Deluxe, Luxury, and Jackpot plans tailored just for you.'],
              ['4','Modify & Save','Customize with AI chat, save your plan, and download a full itinerary.'],
            ].map(([n, t, d]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--gold)', color: '#000', fontSize: 20, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: "'Playfair Display',serif" }}>{n}</div>
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{t}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
