export const DESTINATIONS = [
  { name: 'Goa', state: 'Goa', tags: ['Adventure', 'Romantic'], img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500&q=70', season: 'Nov – Feb', price: '₹8,000+', tagline: 'Sun, Sand & Serenity' },
  { name: 'Andaman & Nicobar', state: 'Andaman & Nicobar', tags: ['Adventure', 'Romantic'], img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&q=70', season: 'Oct – May', price: '₹10,000+', tagline: 'Tropical Island Paradise' },
  { name: 'Pondicherry', state: 'Puducherry', tags: ['Romantic', 'Solo'], img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500&q=70', season: 'Oct – Mar', price: '₹5,000+', tagline: 'French Riviera of India' },
  { name: 'Manali', state: 'Himachal Pradesh', tags: ['Adventure', 'Romantic'], img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=500&q=70', season: 'Mar – Jun', price: '₹5,000+', tagline: 'Valley of the Gods' },
  { name: 'Shimla', state: 'Himachal Pradesh', tags: ['Family', 'Romantic'], img: 'https://images.unsplash.com/photo-1598977267060-b7e0f7b7f52c?w=500&q=70', season: 'Mar – Jun', price: '₹4,000+', tagline: 'Queen of Hills' },
  { name: 'Munnar', state: 'Kerala', tags: ['Romantic', 'Family'], img: 'https://images.unsplash.com/photo-1609766418204-92e4f636e34c?w=500&q=70', season: 'Sep – Mar', price: '₹5,000+', tagline: 'Tea Garden Paradise' },
  { name: 'Darjeeling', state: 'West Bengal', tags: ['Romantic', 'Solo'], img: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=500&q=70', season: 'Oct – Apr', price: '₹4,500+', tagline: 'Land of Thunder Bolt' },
  { name: 'Ladakh', state: 'Ladakh', tags: ['Adventure', 'Solo'], img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=70', season: 'May – Sep', price: '₹12,000+', tagline: 'Land of High Passes' },
  { name: 'Jaipur', state: 'Rajasthan', tags: ['Family', 'Spiritual'], img: 'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=500&q=70', season: 'Oct – Mar', price: '₹5,000+', tagline: 'Pink City of Rajasthan' },
  { name: 'Udaipur', state: 'Rajasthan', tags: ['Romantic', 'Family'], img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=500&q=70', season: 'Oct – Mar', price: '₹6,000+', tagline: 'City of Lakes' },
  { name: 'Agra', state: 'Uttar Pradesh', tags: ['Family', 'Romantic'], img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=500&q=70', season: 'Oct – Mar', price: '₹4,000+', tagline: 'City of the Taj Mahal' },
  { name: 'Varanasi', state: 'Uttar Pradesh', tags: ['Spiritual', 'Solo'], img: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=500&q=70', season: 'Oct – Mar', price: '₹3,500+', tagline: 'City of Light' },
  { name: 'Hampi', state: 'Karnataka', tags: ['Spiritual', 'Solo'], img: 'https://images.unsplash.com/photo-1570532814026-c0fa04b2c5db?w=500&q=70', season: 'Oct – Feb', price: '₹3,500+', tagline: 'City of Ruins' },
  { name: 'Rishikesh', state: 'Uttarakhand', tags: ['Adventure', 'Spiritual'], img: 'https://images.unsplash.com/photo-1609766107989-f9ca5fbd96e4?w=500&q=70', season: 'Feb – May', price: '₹4,000+', tagline: 'Yoga Capital of the World' },
  { name: 'Coorg', state: 'Karnataka', tags: ['Romantic', 'Adventure'], img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=70', season: 'Oct – May', price: '₹5,500+', tagline: 'Scotland of India' },
  { name: 'Gangtok', state: 'Sikkim', tags: ['Adventure', 'Family'], img: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500&q=70', season: 'Mar – Jun', price: '₹6,000+', tagline: 'Gateway to Sikkim' },
  { name: 'Delhi', state: 'Delhi', tags: ['Family', 'Spiritual'], img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500&q=70', season: 'Oct – Mar', price: '₹3,000+', tagline: 'Heart of India' },
  { name: 'Mumbai', state: 'Maharashtra', tags: ['Solo', 'Adventure'], img: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?w=500&q=70', season: 'Nov – Feb', price: '₹4,000+', tagline: 'City of Dreams' },
  { name: 'Bengaluru', state: 'Karnataka', tags: ['Solo', 'Family'], img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=500&q=70', season: 'Sep – Feb', price: '₹3,500+', tagline: 'Garden City of India' },
  { name: 'Hyderabad', state: 'Telangana', tags: ['Family', 'Spiritual'], img: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=500&q=70', season: 'Oct – Feb', price: '₹3,000+', tagline: 'City of Pearls' },
];

export const GROUP_TRIPS = [
  { dest: 'Goa', type: 'Adventure', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=300&q=70', dates: 'May 15–20, 2026', price: '₹12,000/person', spotsLeft: 4, totalSpots: 8, via: 'WhatsApp' },
  { dest: 'Ladakh', type: 'Adventure', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=70', dates: 'Jun 5–14, 2026', price: '₹35,000/person', spotsLeft: 2, totalSpots: 6, via: 'Telegram' },
  { dest: 'Rishikesh', type: 'Spiritual', img: 'https://images.unsplash.com/photo-1609766107989-f9ca5fbd96e4?w=300&q=70', dates: 'May 1–5, 2026', price: '₹8,000/person', spotsLeft: 5, totalSpots: 10, via: 'WhatsApp' },
  { dest: 'Manali', type: 'Adventure', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=300&q=70', dates: 'Jun 20–26, 2026', price: '₹15,000/person', spotsLeft: 3, totalSpots: 8, via: 'Telegram' },
  { dest: 'Kerala Backwaters', type: 'Romantic', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=300&q=70', dates: 'Jul 10–15, 2026', price: '₹18,000/person', spotsLeft: 6, totalSpots: 8, via: 'WhatsApp' },
];

export const BLOG_POSTS = [
  { title: 'Top 10 Hidden Beaches in Goa You Must Visit', category: 'Travel Tips', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=70', excerpt: 'Beyond the crowded shores of Baga and Calangute lie pristine stretches of sand waiting to be discovered.', author: 'Priya Nair', date: 'Apr 12, 2026' },
  { title: 'The Complete Ladakh Road Trip Guide 2026', category: 'Adventure', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70', excerpt: 'From Manali to Leh — everything you need to know about India\'s most epic road trip.', author: 'Rahul Sharma', date: 'Mar 28, 2026' },
  { title: 'Budget Travel in Rajasthan: ₹500/Day Guide', category: 'Budget Travel', img: 'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=400&q=70', excerpt: 'Explore palaces, forts, and desert landscapes without breaking the bank.', author: 'Anita Joshi', date: 'Mar 15, 2026' },
  { title: 'Kerala Backwaters: A Houseboat Experience', category: 'Experiences', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&q=70', excerpt: 'Gliding through the tranquil waterways of God\'s Own Country on a traditional kettuvallam.', author: 'Vivek Menon', date: 'Feb 22, 2026' },
  { title: 'Best Time to Visit Manali: Month by Month', category: 'Travel Guide', img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&q=70', excerpt: 'Snow, adventure, and stunning views — but when should you actually go?', author: 'Meera Singh', date: 'Feb 10, 2026' },
  { title: 'Pondicherry: Where India Meets France', category: 'Culture', img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=70', excerpt: 'Explore the French Quarter, pristine beaches, and spiritual Auroville in this charming union territory.', author: 'Arjun Mehta', date: 'Jan 30, 2026' },
];

export const GALLERY_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1570532814026-c0fa04b2c5db?w=600&q=70', span: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1609766418204-92e4f636e34c?w=600&q=70', span: 'row-span-2' },
  { url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=70', span: 'col-span-2' },
  { url: 'https://images.unsplash.com/photo-1477587458883-47145ed6979e?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=70', span: '' },
  { url: 'https://images.unsplash.com/photo-1609766107989-f9ca5fbd96e4?w=600&q=70', span: 'col-span-2' },
  { url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=600&q=70', span: '' },
];
