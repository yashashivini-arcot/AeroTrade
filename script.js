const fs = require('fs'); 
const file = 'c:/Users/venua/OneDrive/Desktop/Documents/Trading platform/frontend/src/App.jsx'; 
const lines = fs.readFileSync(file, 'utf8').split('\n'); 
const out = lines.map(line => { 
  const catMatch = line.match(/category:\s*'([^']+)'/); 
  if (catMatch && line.match(/img:\s*u\('[^']+'\)/)) { 
    const cat = catMatch[1].toLowerCase().replace(' ', '_'); 
    return line.replace(/img:\s*u\('[^']+'\)/, "img: '/cat_" + cat + ".png'"); 
  } 
  return line; 
}); 
fs.writeFileSync(file, out.join('\n'));
