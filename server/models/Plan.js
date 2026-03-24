const mongoose = require('mongoose');

const daySchema = new mongoose.Schema({
  day: Number,
  title: String,
  activities: [String],
  meals: String,
  hotel: String,
  cost: Number
});

const planTypeSchema = new mongoose.Schema({
  type: String,
  icon: String,
  totalCost: Number,
  perDay: Number,
  hotel: String,
  transport: String,
  activities: [String],
  highlights: String,
  itinerary: [daySchema]
});

const planSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destinations: [{ type: String }],
  preferences: {
    duration: String,
    dates: String,
    group: String,
    food: String,
    transport: String,
    stars: String,
    activity: String,
    special: String,
    mustsee: String,
    budget: Number
  },
  plans: [planTypeSchema],
  selectedPlan: { type: Number, default: 0 },
  status: { type: String, enum: ['draft', 'confirmed'], default: 'confirmed' },
  weather: { type: Object, default: {} },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plan', planSchema);
