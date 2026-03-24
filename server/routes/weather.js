const express = require('express');
const router = express.Router();
const axios = require('axios');
const { protect } = require('../middleware/auth');

// GET /api/weather/:city
router.get('/:city', protect, async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey || apiKey === 'your-openweather-api-key-here') {
      // Return mock data if no API key
      const mockData = {
        city,
        temp: Math.floor(Math.random() * 15) + 20,
        feels_like: Math.floor(Math.random() * 15) + 18,
        humidity: Math.floor(Math.random() * 40) + 40,
        description: ['clear sky', 'partly cloudy', 'scattered clouds', 'light rain'][Math.floor(Math.random() * 4)],
        icon: '01d',
        suggestion: 'Great weather for outdoor activities!',
        mock: true
      };
      return res.json(mockData);
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}&units=metric`;
    const response = await axios.get(url);
    const data = response.data;

    const desc = data.weather[0].description.toLowerCase();
    let suggestion = 'Perfect weather for outdoor activities!';
    if (desc.includes('rain') || desc.includes('storm')) suggestion = 'Rain expected — plan indoor activities like museums, cafes, and shopping.';
    else if (desc.includes('cloud')) suggestion = 'Partly cloudy — great for sightseeing without harsh sun.';
    else if (data.main.temp > 35) suggestion = 'Very hot — visit early morning or evening; carry water.';
    else if (data.main.temp < 10) suggestion = 'Cold weather — pack warm clothes; great for mountain activities.';

    res.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      feels_like: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      suggestion
    });
  } catch (err) {
    res.status(500).json({ message: 'Weather data unavailable', error: err.message });
  }
});

module.exports = router;
