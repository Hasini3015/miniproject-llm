const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

const getOpenAI = () => {
  const OpenAI = require('openai');
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
};

const FALLBACK_PLANS = (destinations, prefs) => {
  const dest = destinations[0] || 'Goa';
  const days = parseInt(prefs.duration) || 3;
  return [
    {
      type: 'Budget Friendly', icon: '⭐', totalCost: 18000 * days / 3, perDay: 6000,
      hotel: `${dest} Budget Inn (2★) — ₹2,500/night`,
      transport: 'Shared cabs & public transport',
      activities: ['Local sightseeing', 'Street food tour', 'Beach/park visit'],
      highlights: 'Perfect for backpackers and budget travelers',
      itinerary: Array.from({ length: days }, (_, i) => ({
        day: i + 1, title: `Day ${i + 1} – Explore ${dest}`,
        activities: ['Morning walk & breakfast', 'Sightseeing', 'Evening local market'],
        meals: 'Local dhabas', hotel: `${dest} Budget Inn`, cost: 6000
      }))
    },
    {
      type: 'Deluxe', icon: '💎', totalCost: 45000 * days / 3, perDay: 15000,
      hotel: `${dest} Premium Resort (4★) — ₹8,500/night`,
      transport: 'Private cab',
      activities: ['Guided city tour', 'Sunset dinner cruise', 'Spa treatment'],
      highlights: 'Comfortable stays with curated experiences',
      itinerary: Array.from({ length: days }, (_, i) => ({
        day: i + 1, title: `Day ${i + 1} – ${dest} Experience`,
        activities: ['Guided tour', 'Local cuisine lunch', 'Evening cruise'],
        meals: 'Hotel + Fine dining', hotel: `${dest} Premium Resort`, cost: 15000
      }))
    },
    {
      type: 'Luxury', icon: '👑', totalCost: 120000 * days / 3, perDay: 40000,
      hotel: `Taj ${dest} (5★) — ₹32,000/night`,
      transport: 'Private chauffeur',
      activities: ['Private yacht rental', 'Couples spa', 'Fine dining'],
      highlights: 'Opulent stays with exclusive experiences',
      itinerary: Array.from({ length: days }, (_, i) => ({
        day: i + 1, title: `Day ${i + 1} – Luxury ${dest}`,
        activities: ['Sunrise yoga', 'Private tour', 'Gourmet dinner'],
        meals: 'In-room dining + Fine restaurants', hotel: `Taj ${dest}`, cost: 40000
      }))
    },
    {
      type: 'Jackpot', icon: '🌟', totalCost: 450000 * days / 3, perDay: 150000,
      hotel: `The Leela ${dest} Presidential Suite — ₹1,15,000/night`,
      transport: 'Private helicopter + Mercedes S-Class',
      activities: ['Helicopter city tour', 'Personal butler', 'Private island'],
      highlights: 'Ultimate luxury — no compromises, only perfection',
      itinerary: Array.from({ length: days }, (_, i) => ({
        day: i + 1, title: `Day ${i + 1} – Ultimate ${dest}`,
        activities: ['Helicopter arrival', 'Exclusive experiences', 'VIP dining'],
        meals: 'Michelin star dining', hotel: `The Leela ${dest}`, cost: 150000
      }))
    }
  ];
};

// POST /api/ai/generate
router.post('/generate', protect, async (req, res) => {
  const { destinations, preferences } = req.body;
  try {
    const openai = getOpenAI();
    const days = parseInt(preferences.duration) || 3;
    const prompt = `You are a travel planning AI. Generate 4 travel plans for: ${destinations.join(', ')}.
Duration: ${preferences.duration || '3D'}, Group: ${preferences.group || 'Solo'}, Food: ${preferences.food || 'No Preference'}, Transport: ${preferences.transport || 'No Preference'}, Hotel: ${preferences.stars || '3★'}, Activity: ${preferences.activity || 'Moderate'}

Return ONLY a valid JSON array with 4 objects. No markdown, no explanation.
Each object must have:
{
  "type": "Budget Friendly" | "Deluxe" | "Luxury" | "Jackpot",
  "icon": "⭐" | "💎" | "👑" | "🌟",
  "totalCost": number (INR),
  "perDay": number (INR),
  "hotel": "hotel name with stars and price",
  "transport": "transport description",
  "activities": ["activity1", "activity2", "activity3"],
  "highlights": "brief description",
  "itinerary": [
    {"day": 1, "title": "Day 1 - Title", "activities": ["morning", "afternoon", "evening"], "meals": "meal info", "hotel": "hotel name", "cost": perDayCost}
    ... for ${days} days
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    });

    const text = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const plans = JSON.parse(text);
    res.json({ plans });
  } catch (err) {
    console.log('OpenAI error, using fallback:', err.message);
    res.json({ plans: FALLBACK_PLANS(destinations, preferences), fallback: true });
  }
});

// POST /api/ai/modify
router.post('/modify', protect, async (req, res) => {
  const { plan, instruction } = req.body;
  try {
    const openai = getOpenAI();
    const prompt = `Modify this travel plan based on the instruction: "${instruction}"
Current plan: ${JSON.stringify(plan)}
Return ONLY the modified plan as JSON with the same structure. No markdown.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    });

    const text = completion.choices[0].message.content.replace(/```json|```/g, '').trim();
    const modified = JSON.parse(text);
    res.json({ plan: modified });
  } catch (err) {
    res.json({ plan, message: `Applied: "${instruction}" (AI service unavailable, plan structure preserved)` });
  }
});

// POST /api/chat (AI Chatbot)
router.post('/chat', protect, async (req, res) => {
  const { message, history } = req.body;
  try {
    const openai = getOpenAI();
    const messages = [
      {
        role: 'system',
        content: 'You are NavBot, an expert AI travel assistant for NavAIgate India. You help users plan trips to Indian destinations, suggest itineraries, answer travel queries, and provide budget advice. Be helpful, concise, and enthusiastic about travel. Always suggest specific places, hotels, and activities.'
      },
      ...(history || []).slice(-6),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.8
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (err) {
    const fallbackReplies = [
      `Great question about ${message.includes('Goa') ? 'Goa' : 'Indian travel'}! I'd recommend checking our My Plan section to generate a personalized itinerary. Would you like tips on budget planning?`,
      `For your travel query, I suggest using our AI Plan Generator! Select your destination, preferences, and get 4 customized plans instantly. Want me to guide you through it?`,
      `India has amazing destinations! Whether it's beaches in Goa, mountains in Manali, or heritage in Jaipur — we have perfect plans for all budgets. Try our MyPlan feature!`
    ];
    res.json({ reply: fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)] });
  }
});

module.exports = router;
