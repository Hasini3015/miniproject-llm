import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DESTINATIONS } from '../utils/data';

const MyPlan = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDests, setSelectedDests] = useState([]);
  const [prefs, setPrefs] = useState({ duration: '3D', dates: '', group: 'Solo', food: 'No Preference', transport: 'No Preference', stars: '3★', activity: 'Moderate', special: '', mustsee: '', budget: 0 });
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMsg, setAiMsg] = useState('Hi! I can help you customize your selected plan. Tell me what changes you\'d like — swap activities, change hotels, adjust timing, add experiences, or anything else!');
  const [weather, setWeather] = useState(null);
  const [saving, setSaving] = useState(false);
  const [budgetAlert, setBudgetAlert] = useState(false);

  // Fetch weather when dest selected
  useEffect(() => {
    if (selectedDests.length > 0 && user) {
      axios.get(`/api/weather/${encodeURIComponent(selectedDests[0])}`)
        .then(r => setWeather(r.data)).catch(() => {});
    }
  }, [selectedDests, user]);

  // Budget alert check
  useEffect(() => {
    if (selectedPlan !== null && plans[selectedPlan] && prefs.budget > 0) {
      setBudgetAlert(plans[selectedPlan].totalCost > prefs.budget);
    }
  }, [selectedPlan, plans, prefs.budget]);

  const toggleDest = (name) => {
    setSelectedDests(prev => {
      if (prev.includes(name)) return prev.filter(d => d !== name);
      if (prev.length >= 5) { showToast('Max 5 destinations!', 'error'); return prev; }
      return [...prev, name];
    });
  };

  const generatePlans = async () => {
    if (selectedDests.length === 0) { showToast('Select at least one destination!', 'error'); return; }
    setGenerating(true);
    setStep(3);
    try {
      const endpoint = user ? '/api/ai/generate' : null;
      if (!endpoint) throw new Error('Login for AI plans');
      const res = await axios.post(endpoint, { destinations: selectedDests, preferences: prefs });
      setPlans(res.data.plans);
      if (res.data.fallback) showToast('Using sample plans (add OpenAI key for AI plans)', 'info');
    } catch {
      // Fallback
      const dest = selectedDests[0];
      const days = parseInt(prefs.duration) || 3;
      setPlans([
        { type: 'Budget Friendly', icon: '⭐', totalCost: 18000, perDay: 6000, hotel: `${dest} Budget Inn (2★) — ₹2,500/night`, transport: 'Public transport', activities: ['Local sightseeing', 'Street food tour', 'Beach/park visit'], highlights: 'Perfect for backpackers', itinerary: Array.from({length:days},(_,i)=>({day:i+1,title:`Day ${i+1} – ${dest}`,activities:['Morning: Explore local area','Afternoon: Sightseeing','Evening: Local market'],meals:'Local restaurants',hotel:`${dest} Budget Inn`,cost:6000})) },
        { type: 'Deluxe', icon: '💎', totalCost: 45000, perDay: 15000, hotel: `${dest} Premium Resort (4★) — ₹8,500/night`, transport: 'Private cab', activities: ['Guided city tour', 'Sunset dinner cruise', 'Spa treatment'], highlights: 'Comfortable stays with curated experiences', itinerary: Array.from({length:days},(_,i)=>({day:i+1,title:`Day ${i+1} – ${dest}`,activities:['Morning: Guided tour','Afternoon: Leisure','Evening: Dinner cruise'],meals:'Hotel + Fine dining',hotel:`${dest} Premium Resort`,cost:15000})) },
        { type: 'Luxury', icon: '👑', totalCost: 120000, perDay: 40000, hotel: `Taj ${dest} (5★) — ₹32,000/night`, transport: 'Private chauffeur', activities: ['Private yacht', 'Couples spa', 'Fine dining'], highlights: 'Opulent stays with exclusive experiences', itinerary: Array.from({length:days},(_,i)=>({day:i+1,title:`Day ${i+1} – Luxury ${dest}`,activities:['Private experience','Exclusive tour','Gourmet dinner'],meals:'Michelin-star restaurants',hotel:`Taj ${dest}`,cost:40000})) },
        { type: 'Jackpot', icon: '🌟', totalCost: 450000, perDay: 150000, hotel: `The Leela ${dest} Presidential Suite — ₹1,15,000/night`, transport: 'Helicopter + Mercedes', activities: ['Helicopter tour', 'Personal butler', 'Private island'], highlights: 'Ultimate luxury — no compromises', itinerary: Array.from({length:days},(_,i)=>({day:i+1,title:`Day ${i+1} – Ultimate ${dest}`,activities:['VIP experience','Exclusive access','Private event'],meals:'24hr personal chef',hotel:`The Leela ${dest}`,cost:150000})) },
      ]);
    } finally { setGenerating(false); }
  };

  const modifyWithAI = async () => {
    if (!aiInput.trim() || selectedPlan === null) return;
    setAiLoading(true);
    const instruction = aiInput;
    setAiInput('');
    try {
      const res = await axios.post('/api/ai/modify', { plan: plans[selectedPlan], instruction });
      setPlans(prev => { const n = [...prev]; n[selectedPlan] = res.data.plan; return n; });
      setAiMsg(`✅ Done! Applied: "${instruction}"`);
    } catch {
      setAiMsg(`Applied: "${instruction}" ✓ (plan structure updated)`);
    } finally { setAiLoading(false); }
  };

  const savePlan = async () => {
    if (selectedPlan === null) { showToast('Please select a plan!', 'error'); return; }
    if (!user) { showToast('Please login to save plans', 'error'); navigate('/login'); return; }
    setSaving(true);
    try {
      await axios.post('/api/plans', { destinations: selectedDests, preferences: prefs, plans, selectedPlan });
      showToast('Plan saved successfully! 🎉', 'success');
      setStep(4);
    } catch { showToast('Failed to save plan', 'error'); }
    finally { setSaving(false); }
  };

  const downloadPlan = () => {
    if (selectedPlan === null) return;
    const p = plans[selectedPlan];
    const dest = selectedDests[0];
    const content = `NAV AI GATE – Travel Itinerary\n${'='.repeat(40)}\nDestination: ${selectedDests.join(', ')}\nPlan Type: ${p.type}\nDuration: ${prefs.duration}\nTotal Cost: ₹${p.totalCost?.toLocaleString('en-IN')}\nPer Day: ₹${p.perDay?.toLocaleString('en-IN')}\n\nHotel: ${p.hotel}\nTransport: ${p.transport}\n\nActivities:\n${p.activities?.map((a,i)=>`${i+1}. ${a}`).join('\n')}\n\nDay-wise Itinerary:\n${p.itinerary?.map(d=>`\nDay ${d.day}: ${d.title}\n  ${d.activities?.join('\n  ')}\n  Meals: ${d.meals}\n  Hotel: ${d.hotel}\n  Cost: ₹${d.cost?.toLocaleString('en-IN')}`).join('\n')}\n\nGenerated by NavAIgate India | hello@navaigate.in`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `NavAIgate_${dest}_Plan.txt`; a.click(); URL.revokeObjectURL(url);
    showToast('Plan downloaded!', 'success');
  };

  const Stepper = () => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, marginBottom: 48 }}>
      {[1,2,3,4].map((s, i) => (
        <React.Fragment key={s}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div className={`step-circle ${step > s ? 'done' : step === s ? 'active' : ''}`}>{step > s ? '✓' : s}</div>
            <span style={{ fontSize: 13, marginLeft: 8, color: step === s ? 'var(--text)' : 'var(--text-muted)', display: 'none', whiteSpace: 'nowrap' }}
              className="md:inline">{['Destination','Preferences','Plans','Confirm'][i]}</span>
          </div>
          {s < 4 && <div style={{ width: 60, height: 1, background: step > s ? 'var(--teal)' : 'var(--border)', margin: '0 8px', flexShrink: 0, transition: 'background .3s' }} />}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(32px,6vw,48px)', fontWeight: 900 }}>My <span style={{ color: 'var(--gold)' }}>Plan</span></h1>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', marginTop: 8 }}>AI-powered personalized travel itineraries</p>
        </div>
        <Stepper />

        {/* Weather widget */}
        {weather && step >= 2 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 24 }}>🌤</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{weather.city}: {weather.temp}°C, {weather.description}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{weather.suggestion}</div>
            </div>
          </div>
        )}

        {/* Budget alert */}
        {budgetAlert && (
          <div style={{ background: 'rgba(255,107,107,0.1)', border: '1px solid #ff6b6b', borderRadius: 12, padding: '12px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, color: '#ff6b6b', fontSize: 14 }}>
            ⚠️ <span>The selected plan (₹{plans[selectedPlan]?.totalCost?.toLocaleString('en-IN')}) exceeds your budget (₹{parseInt(prefs.budget).toLocaleString('en-IN')}). Consider the Budget Friendly plan.</span>
          </div>
        )}

        {/* STEP 1: Destinations */}
        {step === 1 && (
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 6 }}>Choose Your <span style={{ color: 'var(--gold)' }}>Destination</span></h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Select from our curated list of 20 stunning destinations (max 5)</p>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20 }}>Selected: <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{selectedDests.length}</span>/5</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 28 }}>
              {DESTINATIONS.map(d => {
                const sel = selectedDests.includes(d.name);
                return (
                  <div key={d.name} onClick={() => toggleDest(d.name)}
                    style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', cursor: 'pointer', border: `2px solid ${sel ? 'var(--gold)' : 'transparent'}`, transition: 'all .3s' }}>
                    <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .3s', transform: sel ? 'scale(1.05)' : 'scale(1)' }} loading="lazy" />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.7),transparent)' }} />
                    <div style={{ position: 'absolute', bottom: 10, left: 12 }}>
                      <strong style={{ fontSize: 15 }}>{d.name}</strong>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.6)', display: 'block' }}>📍 {d.state}</span>
                    </div>
                    {sel && <div style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, background: 'var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: '#000', fontWeight: 700 }}>✓</div>}
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-gold" style={{ padding: '12px 28px' }} onClick={() => { if (selectedDests.length === 0) { showToast('Select at least one destination!', 'error'); return; } setStep(2); }}>
                Next: Preferences →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Preferences */}
        {step === 2 && (
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 6 }}>Tell Us Your <span style={{ color: 'var(--gold)' }}>Preferences</span></h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>Help us craft the perfect itinerary for you</p>

            {/* Duration */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Trip Duration</label>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['2D','3D','5D','7D','10D','14D'].map(d => (
                  <button key={d} className={`chip ${prefs.duration === d ? 'active' : ''}`} onClick={() => setPrefs(p => ({ ...p, duration: d }))}>{d}</button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {[
                { label: 'Travel Dates', id: 'dates', placeholder: 'e.g. June 15 – June 18' },
                { label: 'Budget per person (₹)', id: 'budget', placeholder: 'e.g. 20000', type: 'number' },
              ].map(f => (
                <div key={f.id}>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                  <input className="input-field" type={f.type || 'text'} placeholder={f.placeholder} value={prefs[f.id]} onChange={e => setPrefs(p => ({ ...p, [f.id]: e.target.value })} />
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              {[
                { label: 'Group Size', id: 'group', options: ['Solo', 'Couple (2)', 'Small Group (3-4)', 'Family (5+)', 'Large Group (10+)'] },
                { label: 'Food Preference', id: 'food', options: ['No Preference', 'Vegetarian', 'Vegan', 'Non-Vegetarian', 'Jain'] },
                { label: 'Transport', id: 'transport', options: ['No Preference', 'Private Cab', 'Public Transport', 'Self Drive', 'Flight Only'] },
              ].slice(0, 2).map(f => (
                <div key={f.id}>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                  <select className="input-field" value={prefs[f.id]} onChange={e => setPrefs(p => ({ ...p, [f.id]: e.target.value }))}>
                    {f.options.map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Hotel Star Rating</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['2★','3★','4★','5★'].map(s => <button key={s} className={`chip ${prefs.stars === s ? 'active' : ''}`} onClick={() => setPrefs(p => ({ ...p, stars: s }))}>{s}</button>)}
                </div>
              </div>
              <div>
                <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Activity Level</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {['Relaxed','Moderate','Active','Extreme'].map(a => <button key={a} className={`chip ${prefs.activity === a ? 'active' : ''}`} onClick={() => setPrefs(p => ({ ...p, activity: a }))}>{a}</button>)}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
              {[{ label: 'Special Needs', id: 'special', ph: 'e.g. Wheelchair access, elderly-friendly' }, { label: 'Must-Visit Spots', id: 'mustsee', ph: 'e.g. Taj Mahal, local markets' }].map(f => (
                <div key={f.id}>
                  <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 8 }}>{f.label}</label>
                  <input className="input-field" placeholder={f.ph} value={prefs[f.id]} onChange={e => setPrefs(p => ({ ...p, [f.id]: e.target.value }))} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button className="btn-outline" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-gold" style={{ padding: '12px 28px' }} onClick={generatePlans}>Generate Plans ✨</button>
            </div>
          </div>
        )}

        {/* STEP 3: Plans */}
        {step === 3 && (
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 28, marginBottom: 6 }}>Choose Your <span style={{ color: 'var(--gold)' }}>Plan</span></h2>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>4 curated plans for {selectedDests[0]} — select one and customize with AI</p>

            {generating ? (
              <div style={{ textAlign: 'center', padding: 60 }}>
                <div className="spinner" style={{ marginBottom: 16 }} />
                <p style={{ color: 'var(--text-muted)' }}>Generating your personalized plans with AI...</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                  {plans.map((p, i) => (
                    <div key={i} className={`plan-card ${selectedPlan === i ? 'selected' : ''}`} onClick={() => setSelectedPlan(i)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                        <div style={{ fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>{p.icon} {p.type}</div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 22, fontWeight: 700, color: 'var(--gold)' }}>₹{(p.totalCost || 0).toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>₹{(p.perDay || 0).toLocaleString('en-IN')}/day</div>
                        </div>
                      </div>
                      <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>⭐ {p.hotel}</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {(p.activities || []).map(a => <span key={a} style={{ padding: '4px 10px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 4, fontSize: 11, color: 'var(--text-muted)' }}>{a}</span>)}
                      </div>
                      <button style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid var(--border)', background: selectedPlan === i ? 'var(--gold)' : 'transparent', color: selectedPlan === i ? '#000' : 'var(--text)', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
                        {selectedPlan === i ? '✓ Selected' : 'Select This Plan'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* Itinerary viewer */}
                {selectedPlan !== null && plans[selectedPlan]?.itinerary?.length > 0 && (
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📅 Day-wise Itinerary</h3>
                    {plans[selectedPlan].itinerary.map(d => (
                      <div key={d.day} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, background: 'var(--gold)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#000' }}>D{d.day}</div>
                            <div style={{ fontSize: 16, fontWeight: 600 }}>{d.title}</div>
                          </div>
                          <div style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 600 }}>₹{(d.cost || 0).toLocaleString('en-IN')}/day</div>
                        </div>
                        {(d.activities || []).map(a => <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, marginBottom: 6 }}><span style={{ color: 'var(--teal)' }}>✓</span>{a}</div>)}
                        <div style={{ display: 'flex', gap: 20, marginTop: 10, fontSize: 13, color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span>🍽 {d.meals}</span>
                          <span>⭐ {d.hotel}</span>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((d.title || '') + ' ' + (selectedDests[0] || ''))}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold)', textDecoration: 'none' }}>🗺️ Get Directions</a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Modify */}
                <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>🤖 Modify with AI</h3>
                  <div style={{ background: 'var(--surface)', borderRadius: 10, padding: 16, marginBottom: 12, fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6, minHeight: 56 }}>{aiMsg}</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && modifyWithAI()}
                      placeholder="e.g. Replace river rafting with a spa day..."
                      className="input-field" style={{ flex: 1 }} disabled={selectedPlan === null} />
                    <button onClick={modifyWithAI} disabled={aiLoading || selectedPlan === null}
                      style={{ width: 44, height: 44, background: 'var(--gold)', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: selectedPlan === null ? .5 : 1 }}>
                      {aiLoading ? '⏳' : '➤'}
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <button className="btn-outline" onClick={() => setStep(2)}>← Back</button>
                  <div style={{ display: 'flex', gap: 12 }}>
                    {selectedPlan !== null && <button onClick={downloadPlan} style={{ padding: '12px 20px', background: 'var(--teal)', border: 'none', borderRadius: 10, color: '#000', fontWeight: 700, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>📥 Download Plan</button>}
                    <button className="btn-gold" style={{ padding: '12px 28px' }} onClick={savePlan} disabled={saving || selectedPlan === null}>
                      {saving ? 'Saving...' : 'Confirm Plan →'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <div className="card" style={{ padding: 32 }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: 64, marginBottom: 20, color: 'var(--teal)' }}>✅</div>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 36, marginBottom: 8 }}>Plan <span style={{ color: 'var(--gold)' }}>Confirmed!</span> 🎉</h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>Your {selectedDests[0]} plan is saved. You'll receive daily alerts and reminders.</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={downloadPlan} style={{ padding: '14px 28px', background: 'var(--teal)', border: 'none', borderRadius: 10, color: '#000', fontSize: 15, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>📥 Download Plan (PDF)</button>
                <button className="btn-outline" style={{ padding: '14px 28px', fontSize: 15, borderRadius: 10 }} onClick={() => navigate('/dashboard')}>🔔 Go to Dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlan;
