import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DESTINATIONS, GROUP_TRIPS, BLOG_POSTS, GALLERY_IMAGES } from '../utils/data';
import Footer from '../components/Footer';

// ============ TOURS ============
export const Tours = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const filters = ['All', 'Adventure', 'Romantic', 'Family', 'Spiritual', 'Solo'];
  const filtered = DESTINATIONS.filter(d => {
    const ms = filter === 'All' || d.tags.includes(filter);
    const mq = d.name.toLowerCase().includes(search.toLowerCase()) || d.state.toLowerCase().includes(search.toLowerCase());
    return ms && mq;
  });
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900 }}>Explore <span style={{ color: 'var(--gold)' }}>Tours</span></h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>20 handpicked destinations across India — click any to plan</p>
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>🔍</span>
            <input className="input-field" placeholder="Search destinations or states..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 40 }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.map(f => <button key={f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>)}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((d, i) => (
            <div key={d.name} onClick={() => navigate('/my-plan')} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 20, cursor: 'pointer', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(245,166,35,0.5)'; e.currentTarget.style.background = 'rgba(245,166,35,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)'; }}>
              <div style={{ width: 40, height: 40, background: 'var(--surface2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontWeight: 700, color: 'var(--gold)', flexShrink: 0 }}>{DESTINATIONS.indexOf(d) + 1}</div>
              <img src={d.img} alt={d.name} style={{ width: 64, height: 64, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{d.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{d.tagline} · {d.state}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  {d.tags.map(t => <span key={t} style={{ padding: '3px 8px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 4, fontSize: 11, color: 'var(--gold)' }}>{t}</span>)}
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{d.season}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gold)', marginTop: 4 }}>{d.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

// ============ GALLERY ============
export const Gallery = () => (
  <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Travel <span style={{ color: 'var(--gold)' }}>Gallery</span></h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40 }}>Stunning visuals from India's most beautiful destinations</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gridAutoRows: 200, gap: 12 }}>
        {GALLERY_IMAGES.map((img, i) => (
          <div key={i} style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer', gridRow: img.span === 'row-span-2' ? 'span 2' : undefined, gridColumn: img.span === 'col-span-2' ? 'span 2' : undefined }}
            onMouseEnter={e => e.currentTarget.querySelector('img').style.transform = 'scale(1.08)'}
            onMouseLeave={e => e.currentTarget.querySelector('img').style.transform = 'scale(1)'}>
            <img src={img.url} alt="Gallery" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s' }} loading="lazy" />
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

// ============ GROUP TRAVEL ============
export const GroupTravel = () => {
  const [joined, setJoined] = useState([]);
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 40px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Group <span style={{ color: 'var(--gold)' }}>Travel</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>Don't travel alone! Join like-minded travelers heading to the same destination.</p>
        {/* How it works */}
        <div className="card" style={{ padding: 32, marginBottom: 40 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>How It Works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[['1','Pick a Trip','Browse upcoming group trips or suggest your own destination'],['2','Join the Group',"Click join and we'll add you to a WhatsApp or Telegram group chat"],['3','Travel Together','Plan together, split costs, share experiences, and make lifelong friends']].map(([n,t,d]) => (
              <div key={n} style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, background: 'var(--gold)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, color: '#000', margin: '0 auto 12px' }}>{n}</div>
                <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{t}</h4>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5 }}>{d}</p>
              </div>
            ))}
          </div>
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>Upcoming Group Trips</h3>
        {GROUP_TRIPS.map((t, i) => (
          <div key={i} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 20, marginBottom: 12 }}>
            <img src={t.img} alt={t.dest} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }} loading="lazy" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 18, fontWeight: 700 }}>{t.dest}</span>
                <span style={{ padding: '2px 8px', background: 'var(--gold)', color: '#000', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>{t.type}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 8 }}>
                <span>📅 {t.dates}</span><span>₹ {t.price}</span><span>👥 {t.spotsLeft}/{t.totalSpots} spots</span>
              </div>
              <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', maxWidth: 200 }}>
                <div style={{ height: '100%', width: `${((t.totalSpots - t.spotsLeft) / t.totalSpots) * 100}%`, background: 'var(--gold)', borderRadius: 2 }} />
              </div>
            </div>
            <button onClick={() => setJoined(p => [...p, i])} disabled={joined.includes(i)}
              style={{ padding: '12px 20px', background: joined.includes(i) ? 'var(--surface2)' : (t.via === 'WhatsApp' ? '#25d366' : '#0088cc'), border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: joined.includes(i) ? 'default' : 'pointer', color: joined.includes(i) ? 'var(--text-muted)' : '#fff', flexShrink: 0 }}>
              {joined.includes(i) ? '✓ Joined' : (t.via === 'WhatsApp' ? '💬 Join via WhatsApp' : '✈ Join via Telegram')}
            </button>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

// ============ BLOGS ============
export const Blogs = () => (
  <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px' }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Travel <span style={{ color: 'var(--gold)' }}>Blogs</span></h1>
      <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40 }}>Stories, tips, and guides from India's most beautiful destinations</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
        {BLOG_POSTS.map((b, i) => (
          <div key={i} className="card" style={{ overflow: 'hidden', cursor: 'pointer', transition: 'all .3s' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(245,166,35,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
            <img src={b.img} alt={b.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} loading="lazy" />
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--gold)', marginBottom: 8 }}>{b.category}</div>
              <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, fontWeight: 700, marginBottom: 8, lineHeight: 1.3 }}>{b.title}</div>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{b.excerpt}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 13, color: 'var(--text-muted)' }}>
                <span>By {b.author}</span><span>{b.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

// ============ ABOUT ============
export const About = () => (
  <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, marginBottom: 20 }}>About <span style={{ color: 'var(--gold)' }}>NavAIgate</span></h1>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto 20px' }}>NavAIgate is an intelligent, full-stack travel platform that simplifies trip planning through Artificial Intelligence. We believe travel should be effortless, personalized, and memorable.</p>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.8, maxWidth: 700, margin: '0 auto 40px' }}>Our mission is to eliminate the need to juggle multiple apps — itinerary tools, booking platforms, budget trackers, and navigation apps. NavAIgate brings it all together.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, marginBottom: 60 }}>
        {[['🎯','Our Mission','Make AI-powered travel planning accessible to every Indian traveler.'],['👁️','Our Vision',"Become India's #1 intelligent travel companion by 2027."],['💡','Innovation','Combining LLMs, real-time data, and smart UX for the best travel experience.']].map(([icon, title, desc]) => (
          <div key={title} className="card" style={{ padding: 28, textAlign: 'center' }}><div style={{ fontSize: 28, marginBottom: 12 }}>{icon}</div><div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{title}</div><div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{desc}</div></div>
        ))}
      </div>
      <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 32, marginBottom: 32 }}>Our <span style={{ color: 'var(--gold)' }}>Team</span></h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24, maxWidth: 700, margin: '0 auto' }}>
        {[['🧑‍💻','Rahul Sharma','Founder & CEO'],['👩‍💼','Priya Nair','Head of AI'],['🧑‍🎨','Arjun Mehta','Lead Designer']].map(([av, name, role]) => (
          <div key={name} className="card" style={{ padding: 28, textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 12px' }}>{av}</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{role}</div>
          </div>
        ))}
      </div>
    </div>
    <Footer />
  </div>
);

// ============ CONTACT ============
export const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e) => { e.preventDefault(); if (form.name && form.email && form.message) { setSent(true); setForm({ name: '', email: '', message: '' }); } };
  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 40px' }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 900, textAlign: 'center', marginBottom: 8 }}>Contact <span style={{ color: 'var(--gold)' }}>Us</span></h1>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40 }}>We'd love to hear from you. Reach out anytime.</p>
        <div className="card" style={{ padding: 40 }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: 40 }}><div style={{ fontSize: 48, marginBottom: 16 }}>✅</div><h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 8 }}>Message <span style={{ color: 'var(--gold)' }}>Sent!</span></h3><p style={{ color: 'var(--text-muted)' }}>We'll reply within 24 hours.</p><button className="btn-gold" style={{ marginTop: 20 }} onClick={() => setSent(false)}>Send Another</button></div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
                {[{ label: 'Your Name', id: 'name', placeholder: 'Full name' }, { label: 'Email', id: 'email', placeholder: 'your@email.com', type: 'email' }].map(f => (
                  <div key={f.id}><label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>{f.label}</label><input className="input-field" type={f.type || 'text'} placeholder={f.placeholder} value={form[f.id]} onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))} /></div>
                ))}
              </div>
              <div style={{ marginBottom: 20 }}><label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>Message</label><textarea className="input-field" placeholder="How can we help you?" rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} style={{ resize: 'vertical' }} /></div>
              <button type="submit" className="btn-gold" style={{ width: '100%', padding: 14, fontSize: 16, borderRadius: 10 }}>Send Message ✈</button>
            </form>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20, marginTop: 32 }}>
          {[['✉','Email','hello@navaigate.in'],['📞','Phone','+91 123 456 7890'],['📍','Location','Hyderabad, India']].map(([icon, label, val]) => (
            <div key={label} className="card" style={{ padding: 20, textAlign: 'center' }}><div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div><p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</p><strong style={{ fontSize: 14, display: 'block', marginTop: 4 }}>{val}</strong></div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Tours;
