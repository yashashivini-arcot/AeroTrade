const fs = require('fs');
let c = fs.readFileSync('c:/Users/venua/OneDrive/Desktop/Documents/Trading platform/frontend/src/App.jsx', 'utf8');
c = c.replace(/const u = \(id\) => https:\/\/images\.unsplash\.com\/photo-\?w=600&q=80&auto=format&fit=crop;/, 'const u = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;');
fs.writeFileSync('c:/Users/venua/OneDrive/Desktop/Documents/Trading platform/frontend/src/App.jsx', c);
