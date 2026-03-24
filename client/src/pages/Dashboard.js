import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DESTINATIONS } from '../utils/data';
import WeatherWidget from '../components/WeatherWidget';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [weatherCity, setWeatherCity] = useState('Goa');

  useEffect(() => {
    axios.get('/api/plans')
      .then(r => { setPlans(r.data); if (r.data[0]?.destinations?.[0]) setWeatherCity(r.data[0].destinations[0]); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const deletePlan = async (id) => {
    if (!window.confirm('Delete this plan?')) return;
    try { await axios.delete(`/api/plans/${id}`); setPlans(p => p.filter(x => x._id !== id)); showToast('Plan deleted', 'success'); }
    catch { showToast('Failed to delete', 'error'); }
  };

  const totalValue = plans.reduce((s, p) => s + (p.plans?.[p.selectedPlan]?.totalCost || 0), 0);
  const allDests = [...new Set(plans.flatMap(p => p.destinations || []))];
  const localExpenses = JSON.parse(localStorage.getItem('navig_expenses_' + user?.email) || '[]');
  const totalSpent = localExpenses.reduce((s, e) => s + e.amount, 0);
  const tabs = [{ id:'overview',label:'📊 Overview' },{ id:'plans',label:'✈️ My Plans' },{ id:'history',label:'📅 History' },{ id:'alerts',label:'🔔 Alerts' }];

  return (
    <div style={{ paddingTop:64, minHeight:'100vh', background:'var(--bg)' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'32px 20px' }}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:32, flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'clamp(24px,4vw,36px)' }}>Welcome, <span style={{ color:'var(--gold)' }}>{user?.name}</span> 👋</h1>
            <p style={{ fontSize:14, color:'var(--text-muted)', marginTop:4 }}>{user?.email}</p>
          </div>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <button className="btn-gold" style={{ padding:'10px 20px' }} onClick={() => navigate('/my-plan')}>+ New Plan</button>
            <Link to="/budget" style={{ padding:'10px 20px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, fontSize:14, color:'var(--text)', textDecoration:'none' }}>💰 Budget</Link>
            <Link to="/chat" style={{ padding:'10px 20px', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, fontSize:14, color:'var(--text)', textDecoration:'none' }}>💬 Community</Link>
            <button onClick={() => { logout(); navigate('/'); }} style={{ padding:'10px 20px', background:'transparent', border:'1px solid var(--border)', borderRadius:8, fontSize:14, cursor:'pointer', color:'var(--text-muted)', fontFamily:"'DM Sans',sans-serif" }}>⇒ Logout</button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:28 }}>
          {[['✈️','Total Plans',plans.length,'var(--gold)'],['₹','Plan Value','₹'+totalValue.toLocaleString('en-IN'),'var(--teal)'],['💸','Actual Spent','₹'+totalSpent.toLocaleString('en-IN'),'#a78bfa'],['🌍','Destinations',allDests.length,'#f97316']].map(([icon,label,val,color]) => (
            <div key={label} className="card" style={{ padding:20 }}>
              <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
              <div style={{ fontFamily:"'Playfair Display',serif", fontSize:26, fontWeight:700, color }}>{val}</div>
              <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:4, marginBottom:24, borderBottom:'1px solid var(--border)' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{ padding:'10px 20px', background:'transparent', border:'none', borderBottom: activeTab===t.id ? '2px solid var(--gold)' : '2px solid transparent', color: activeTab===t.id ? 'var(--text)' : 'var(--text-muted)', cursor:'pointer', fontSize:14, fontFamily:"'DM Sans',sans-serif", marginBottom:-1, fontWeight: activeTab===t.id ? 600 : 400 }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20 }}>
            <div>
              <div className="card" style={{ padding:24, marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                  <h3 style={{ fontSize:16, fontWeight:600 }}>📅 Recent Plans</h3>
                  <button className="btn-gold" style={{ padding:'6px 14px', fontSize:13 }} onClick={() => setActiveTab('plans')}>View All</button>
                </div>
                {loading ? <div style={{ textAlign:'center', padding:32 }}><div className="spinner" /></div>
                  : plans.length === 0 ? (
                    <div style={{ textAlign:'center', padding:32, color:'var(--text-muted)' }}>
                      <div style={{ fontSize:40, marginBottom:12 }}>✈️</div>
                      <p style={{ marginBottom:16 }}>No plans yet!</p>
                      <button className="btn-gold" onClick={() => navigate('/my-plan')}>Create First Plan →</button>
                    </div>
                  ) : plans.slice(0,3).map(plan => {
                    const sel = plan.plans?.[plan.selectedPlan];
                    const dest = plan.destinations?.[0];
                    const dd = DESTINATIONS.find(d => d.name === dest);
                    return (
                      <div key={plan._id} style={{ display:'flex', gap:14, padding:'14px 0', borderBottom:'1px solid var(--border)', alignItems:'center' }}>
                        {dd && <img src={dd.img} alt={dest} style={{ width:56, height:56, borderRadius:10, objectFit:'cover', flexShrink:0 }} loading="lazy" />}
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:15, fontWeight:600 }}>{plan.destinations?.join(', ')}</div>
                          <div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>{sel?.type} · {plan.preferences?.duration}</div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:15, fontWeight:700, color:'var(--gold)' }}>₹{(sel?.totalCost||0).toLocaleString('en-IN')}</div>
                          <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>{new Date(plan.createdAt).toLocaleDateString('en-IN')}</div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <div className="card" style={{ padding:24 }}>
                <h3 style={{ fontSize:16, fontWeight:600, marginBottom:16 }}>⚡ Quick Actions</h3>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                  {[['✈️','Plan New Trip','/my-plan','var(--gold)'],['💰','Budget Tracker','/budget','var(--teal)'],['💬','Community Chat','/chat','#a78bfa'],['🗺️','Explore Tours','/tours','#f97316']].map(([icon,label,to,color]) => (
                    <Link key={label} to={to} style={{ padding:16, background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:12, textDecoration:'none', display:'block', transition:'all .2s' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = color}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                      <div style={{ fontSize:24, marginBottom:8 }}>{icon}</div>
                      <div style={{ fontSize:14, fontWeight:600, color:'var(--text)' }}>{label}</div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="card" style={{ padding:20, marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                  <h3 style={{ fontSize:15, fontWeight:600 }}>🌤 Weather</h3>
                  <select style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:6, padding:'4px 8px', color:'var(--text)', fontSize:12 }} value={weatherCity} onChange={e => setWeatherCity(e.target.value)}>
                    {DESTINATIONS.map(d => <option key={d.name}>{d.name}</option>)}
                  </select>
                </div>
                <WeatherWidget city={weatherCity} />
              </div>
              {allDests.length > 0 && (
                <div className="card" style={{ padding:20, marginBottom:16 }}>
                  <h3 style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>📍 Your Destinations</h3>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {allDests.map(d => (
                      <a key={d} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d+' India')}`} target="_blank" rel="noopener noreferrer"
                        style={{ padding:'5px 12px', background:'rgba(245,166,35,0.1)', border:'1px solid rgba(245,166,35,0.3)', borderRadius:20, fontSize:12, color:'var(--gold)', textDecoration:'none' }}>
                        📍 {d}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              <div className="card" style={{ padding:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                  <h3 style={{ fontSize:15, fontWeight:600 }}>💸 Expenses</h3>
                  <Link to="/budget" style={{ fontSize:12, color:'var(--gold)', textDecoration:'none' }}>Manage →</Link>
                </div>
                {localExpenses.length === 0
                  ? <p style={{ fontSize:13, color:'var(--text-muted)' }}>No expenses yet. <Link to="/budget" style={{ color:'var(--gold)' }}>Start tracking →</Link></p>
                  : <><div style={{ fontSize:24, fontWeight:700, color:'var(--gold)', fontFamily:"'Playfair Display',serif" }}>₹{totalSpent.toLocaleString('en-IN')}</div><div style={{ fontSize:13, color:'var(--text-muted)', marginTop:4 }}>{localExpenses.length} expenses</div></>}
              </div>
            </div>
          </div>
        )}

        {/* PLANS TAB */}
        {activeTab === 'plans' && (
          <div>
            {loading ? <div style={{ textAlign:'center', padding:60 }}><div className="spinner" /></div>
              : plans.length === 0 ? (
                <div style={{ textAlign:'center', padding:60, color:'var(--text-muted)' }}>
                  <div style={{ fontSize:56, marginBottom:16 }}>✈️</div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:24, marginBottom:16 }}>No Plans Yet</h3>
                  <button className="btn-gold" style={{ padding:'12px 28px' }} onClick={() => navigate('/my-plan')}>Create Plan →</button>
                </div>
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:20 }}>
                  {plans.map(plan => {
                    const sel = plan.plans?.[plan.selectedPlan];
                    const dest = plan.destinations?.[0];
                    const dd = DESTINATIONS.find(d => d.name === dest);
                    return (
                      <div key={plan._id} className="card" style={{ overflow:'hidden', transition:'all .3s' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(245,166,35,0.4)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform='translateY(0)'; }}>
                        {dd && <img src={dd.img} alt={dest} style={{ width:'100%', height:160, objectFit:'cover' }} loading="lazy" />}
                        <div style={{ padding:20 }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                            <div style={{ fontFamily:"'Playfair Display',serif", fontSize:18, fontWeight:700 }}>{plan.destinations?.join(', ')}</div>
                            <div style={{ fontSize:16, color:'var(--gold)', fontWeight:700 }}>₹{(sel?.totalCost||0).toLocaleString('en-IN')}</div>
                          </div>
                          <div style={{ fontSize:13, color:'var(--text-muted)', marginBottom:14 }}>{sel?.icon} {sel?.type} · {plan.preferences?.duration} · {plan.preferences?.group}</div>
                          <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                            <button className="btn-gold" style={{ flex:1, padding:'8px 12px', fontSize:13 }} onClick={() => navigate('/my-plan')}>Edit</button>
                            <button onClick={() => deletePlan(plan._id)} style={{ padding:'8px 12px', background:'transparent', border:'1px solid #ff6b6b', color:'#ff6b6b', borderRadius:8, cursor:'pointer', fontSize:13 }}>🗑</button>
                          </div>
                          <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((dest||'')+' India')}`} target="_blank" rel="noopener noreferrer"
                            style={{ display:'block', textAlign:'center', padding:'8px', background:'var(--surface2)', borderRadius:8, fontSize:12, color:'var(--text-muted)', textDecoration:'none' }}>
                            🗺️ Get Directions on Google Maps
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="card" style={{ padding:28 }}>
            <h3 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>📅 Travel History</h3>
            {plans.length === 0 ? (
              <div style={{ textAlign:'center', padding:40, color:'var(--text-muted)' }}><div style={{ fontSize:40, marginBottom:12 }}>🗺️</div><p>No history yet.</p></div>
            ) : (
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute', left:20, top:0, bottom:0, width:2, background:'var(--border)' }} />
                {plans.map(plan => {
                  const sel = plan.plans?.[plan.selectedPlan];
                  return (
                    <div key={plan._id} style={{ display:'flex', gap:20, marginBottom:24, paddingLeft:52, position:'relative' }}>
                      <div style={{ position:'absolute', left:12, top:4, width:18, height:18, borderRadius:'50%', background:'var(--gold)', border:'3px solid var(--bg)', zIndex:1 }} />
                      <div className="card" style={{ flex:1, padding:16 }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                          <div style={{ fontFamily:"'Playfair Display',serif", fontSize:16, fontWeight:700 }}>{plan.destinations?.join(', ')}</div>
                          <div style={{ fontSize:12, color:'var(--text-muted)' }}>{new Date(plan.createdAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
                        </div>
                        <div style={{ display:'flex', gap:16, flexWrap:'wrap', fontSize:13, color:'var(--text-muted)' }}>
                          <span>{sel?.icon} {sel?.type}</span><span>⏱ {plan.preferences?.duration}</span><span>👥 {plan.preferences?.group}</span>
                          <span style={{ color:'var(--gold)', fontWeight:600 }}>₹{(sel?.totalCost||0).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ALERTS TAB */}
        {activeTab === 'alerts' && (
          <div className="card" style={{ padding:28 }}>
            <h3 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>🔔 Smart Alerts</h3>
            {[...plans.slice(0,2).flatMap(plan => {
              const dest = plan.destinations?.[0];
              const cost = plan.plans?.[plan.selectedPlan]?.totalCost || 0;
              return [
                { icon:'📅', type:'Reminder', msg:`Trip to ${dest} planned! Don't forget to pack essentials.`, color:'var(--gold)' },
                { icon:'💰', type:'Budget', msg:`Your plan costs ₹${cost.toLocaleString('en-IN')}. Track spending at Budget Tracker.`, color:'var(--teal)' },
              ];
            }),
            { icon:'🎉', type:'Tip', msg:'Book flights 6-8 weeks in advance for best prices!', color:'#34d399' },
            { icon:'🌦️', type:'Weather', msg:'Check weather before your trip for smart packing.', color:'#60a5fa' },
            { icon:'💬', type:'Community', msg:'Join destination chat rooms to connect with fellow travelers.', color:'#a78bfa' },
            ].map((a, i) => (
              <div key={i} style={{ padding:'14px 16px', background:a.color+'15', border:`1px solid ${a.color}35`, borderRadius:10, marginBottom:10, display:'flex', gap:12, alignItems:'flex-start' }}>
                <span style={{ fontSize:20, flexShrink:0 }}>{a.icon}</span>
                <div><div style={{ fontSize:13, fontWeight:600, color:a.color }}>{a.type}</div><div style={{ fontSize:13, color:'var(--text-muted)', marginTop:2 }}>{a.msg}</div></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
