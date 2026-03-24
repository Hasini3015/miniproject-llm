import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = ['Hotel', 'Transport', 'Food', 'Activities', 'Shopping', 'Miscellaneous'];
const CAT_ICONS = { Hotel: '🏨', Transport: '🚗', Food: '🍽️', Activities: '🎯', Shopping: '🛍️', Miscellaneous: '📦' };
const CAT_COLORS = { Hotel: '#f5a623', Transport: '#00c9a7', Food: '#ff6b6b', Activities: '#a78bfa', Shopping: '#34d399', Miscellaneous: '#60a5fa' };

const BudgetTracker = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [budget, setBudget] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [newExp, setNewExp] = useState({ category: 'Hotel', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
  const [loading, setLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`navig_expenses_${user?.email}`);
    if (saved) setExpenses(JSON.parse(saved));
    const savedBudget = localStorage.getItem(`navig_budget_${user?.email}`);
    if (savedBudget) setBudget(savedBudget);
  }, [user]);

  useEffect(() => {
    if (user) {
      axios.get('/api/plans').then(r => setPlans(r.data)).catch(() => {}).finally(() => setLoading(false));
    } else { setLoading(false); }
  }, [user]);

  const saveExpenses = (list) => {
    setExpenses(list);
    localStorage.setItem(`navig_expenses_${user?.email}`, JSON.stringify(list));
  };

  const saveBudget = (val) => {
    setBudget(val);
    localStorage.setItem(`navig_budget_${user?.email}`, val);
  };

  const addExpense = () => {
    if (!newExp.description || !newExp.amount) { showToast('Fill description and amount', 'error'); return; }
    const exp = { ...newExp, amount: parseFloat(newExp.amount), id: Date.now() };
    saveExpenses([...expenses, exp]);
    setNewExp({ category: 'Hotel', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
    showToast('Expense added!', 'success');
  };

  const deleteExpense = (id) => saveExpenses(expenses.filter(e => e.id !== id));

  const totalSpent = expenses.reduce((s, e) => s + e.amount, 0);
  const budgetNum = parseFloat(budget) || 0;
  const remaining = budgetNum - totalSpent;
  const pct = budgetNum > 0 ? Math.min(100, (totalSpent / budgetNum) * 100) : 0;
  const overBudget = budgetNum > 0 && totalSpent > budgetNum;

  const byCategory = CATEGORIES.map(cat => ({
    cat, total: expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter(e => e.category === cat).length
  })).filter(x => x.total > 0);

  if (!user) return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 400 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
        <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 24, marginBottom: 8 }}>Budget <span style={{ color: 'var(--gold)' }}>Tracker</span></h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Login to track your travel expenses.</p>
        <button className="btn-gold" style={{ width: '100%', padding: 12 }} onClick={() => navigate('/login')}>Sign In</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingTop: 64, minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(28px,4vw,40px)', fontWeight: 900 }}>
            Budget <span style={{ color: 'var(--gold)' }}>Tracker</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>Track your travel expenses and stay within budget</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
          {/* Set Budget */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>💎 Set Your Budget</h3>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', fontSize: 15 }}>₹</span>
                <input className="input-field" type="number" placeholder="Enter total budget" value={budget} onChange={e => saveBudget(e.target.value)} style={{ paddingLeft: 30 }} />
              </div>
              {plans.length > 0 && (
                <select className="input-field" style={{ maxWidth: 200 }} onChange={e => {
                  const p = plans[e.target.value];
                  if (p) saveBudget(p.plans?.[p.selectedPlan]?.totalCost || '');
                }}>
                  <option value="">Import from plan</option>
                  {plans.map((p, i) => <option key={p._id} value={i}>{p.destinations?.[0]} – ₹{p.plans?.[p.selectedPlan]?.totalCost?.toLocaleString('en-IN')}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>📊 Summary</h3>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['Budget', `₹${budgetNum.toLocaleString('en-IN')}`, 'var(--text)'], ['Spent', `₹${totalSpent.toLocaleString('en-IN')}`, overBudget ? '#ff6b6b' : 'var(--gold)'], ['Remaining', `₹${Math.abs(remaining).toLocaleString('en-IN')}`, remaining >= 0 ? 'var(--teal)' : '#ff6b6b']].map(([l, v, c]) => (
                <div key={l}><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{l}</div><div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Playfair Display',serif" }}>{v}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {budgetNum > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
              <span>Budget Used</span>
              <span style={{ color: overBudget ? '#ff6b6b' : 'var(--gold)', fontWeight: 600 }}>{pct.toFixed(1)}%</span>
            </div>
            <div style={{ height: 12, background: 'var(--surface2)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: overBudget ? 'linear-gradient(90deg,#ff6b6b,#ff4444)' : pct > 80 ? 'linear-gradient(90deg,var(--gold),#ff8c00)' : 'linear-gradient(90deg,var(--teal),var(--gold))', borderRadius: 6, transition: 'width .5s' }} />
            </div>
            {overBudget && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: 8, fontSize: 13, color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ You've exceeded your budget by <strong>₹{Math.abs(remaining).toLocaleString('en-IN')}</strong>
              </div>
            )}
            {!overBudget && pct > 80 && (
              <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 8, fontSize: 13, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 8 }}>
                ⚠️ You've used {pct.toFixed(0)}% of your budget. Spend carefully!
              </div>
            )}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 }}>
          {/* Expense List */}
          <div>
            {/* Add Expense */}
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>➕ Add Expense</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Category</label>
                  <select className="input-field" value={newExp.category} onChange={e => setNewExp(p => ({ ...p, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Date</label>
                  <input className="input-field" type="date" value={newExp.date} onChange={e => setNewExp(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Description</label>
                  <input className="input-field" placeholder="e.g. Hotel check-in" value={newExp.description} onChange={e => setNewExp(p => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Amount (₹)</label>
                  <input className="input-field" type="number" placeholder="0" value={newExp.amount} onChange={e => setNewExp(p => ({ ...p, amount: e.target.value }))} onKeyDown={e => e.key === 'Enter' && addExpense()} />
                </div>
              </div>
              <button className="btn-gold" style={{ width: '100%', padding: 12 }} onClick={addExpense}>Add Expense</button>
            </div>

            {/* Expense Table */}
            <div className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 16, fontWeight: 600 }}>📋 All Expenses ({expenses.length})</h3>
                {expenses.length > 0 && <button onClick={() => { if (window.confirm('Clear all expenses?')) saveExpenses([]); }} style={{ fontSize: 13, color: '#ff6b6b', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>}
              </div>
              {expenses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
                  <p>No expenses added yet</p>
                </div>
              ) : (
                <div>
                  {[...expenses].reverse().map(e => (
                    <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                      <div style={{ width: 36, height: 36, borderRadius: 8, background: `${CAT_COLORS[e.category]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{CAT_ICONS[e.category]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{e.description}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{e.category} · {e.date}</div>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--gold)' }}>₹{e.amount.toLocaleString('en-IN')}</div>
                      <button onClick={() => deleteExpense(e.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, padding: 4 }}>🗑</button>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 0 0', fontSize: 15, fontWeight: 700 }}>
                    Total: <span style={{ color: 'var(--gold)', marginLeft: 8 }}>₹{totalSpent.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📊 By Category</h3>
              {byCategory.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 14 }}>Add expenses to see breakdown</div>
              ) : (
                byCategory.sort((a, b) => b.total - a.total).map(({ cat, total, count }) => (
                  <div key={cat} style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>{CAT_ICONS[cat]} {cat}</span>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: CAT_COLORS[cat] }}>₹{total.toLocaleString('en-IN')}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>{count} items</span>
                      </div>
                    </div>
                    <div style={{ height: 6, background: 'var(--surface2)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${totalSpent > 0 ? (total / totalSpent) * 100 : 0}%`, background: CAT_COLORS[cat], borderRadius: 3, transition: 'width .4s' }} />
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Add Buttons */}
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>⚡ Quick Add</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[['Auto-rickshaw', 'Transport', 150], ['Street food', 'Food', 200], ['Hotel 1 night', 'Hotel', 2500], ['Entry ticket', 'Activities', 500], ['Souvenir', 'Shopping', 300], ['Tip', 'Miscellaneous', 100]].map(([desc, cat, amt]) => (
                  <button key={desc} onClick={() => {
                    const exp = { category: cat, description: desc, amount: amt, date: new Date().toISOString().split('T')[0], id: Date.now() };
                    saveExpenses([...expenses, exp]);
                    showToast(`Added: ${desc}`, 'success');
                  }} style={{ padding: '10px 8px', background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, cursor: 'pointer', fontSize: 12, color: 'var(--text)', textAlign: 'left', transition: 'all .2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div>{CAT_ICONS[cat]} {desc}</div>
                    <div style={{ color: 'var(--gold)', fontWeight: 600, marginTop: 3 }}>₹{amt}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
