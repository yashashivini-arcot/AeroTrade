import { useState, useEffect, useMemo } from 'react';

/* ────────────────────────────────────────────────────────────
   DECORATIVE SVG COMPONENTS  (Warli / Kolam – heritage art)
   ──────────────────────────────────────────────────────────── */
const WarliCorner = ({ position = 'top-left' }) => {
  const rotation = {
    'top-left':     'rotate(0deg)',
    'top-right':    'rotate(90deg)',
    'bottom-left':  'rotate(270deg)',
    'bottom-right': 'rotate(180deg)',
  }[position];
  return (
    <svg viewBox="0 0 100 100" width="60" height="60" style={{
      position:'absolute', opacity:0.12, pointerEvents:'none', transform:rotation,
      top:   position.includes('top')    ? '10px' : 'auto',
      bottom:position.includes('bottom') ? '10px' : 'auto',
      left:  position.includes('left')   ? '10px' : 'auto',
      right: position.includes('right')  ? '10px' : 'auto',
      color:'var(--color-secondary-accent)'
    }}>
      <path d="M10,10 L40,10 L10,40 Z" fill="currentColor"/>
      <circle cx="25" cy="25" r="5" fill="var(--color-cta)"/>
      <line x1="10" y1="10" x2="60" y2="10" stroke="currentColor" strokeWidth="2"/>
      <line x1="10" y1="10" x2="10" y2="60" stroke="currentColor" strokeWidth="2"/>
      <path d="M50,15 L60,25 L50,35 Z" fill="currentColor"/>
    </svg>
  );
};

const KolamDivider = () => (
  <div className="kolam-divider-container">
    <svg viewBox="0 0 200 40" width="160" height="32">
      <path d="M20,20 Q40,5 60,20 T100,20 T140,20 T180,20 M20,20 Q40,35 60,20 T100,20 T140,20 T180,20"
        fill="none" stroke="var(--color-secondary-accent)" strokeWidth="1.5"/>
      <circle cx="60"  cy="20" r="3" fill="var(--color-primary-accent)"/>
      <circle cx="100" cy="20" r="3" fill="var(--color-primary-accent)"/>
      <circle cx="140" cy="20" r="3" fill="var(--color-primary-accent)"/>
    </svg>
  </div>
);

/* ────────────────────────────────────────────────────────────
   ROYALTY-FREE IMAGE HELPER
   All images: Unsplash (https://unsplash.com/license – free)
   Format: https://images.unsplash.com/photo-{id}?w=600&q=80
   ──────────────────────────────────────────────────────────── */
const u = (id) => `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`;

/* ────────────────────────────────────────────────────────────
   MOCK REGISTERED USERS
   ──────────────────────────────────────────────────────────── */
const MOCK_REGISTERED_USERS = [
  { id:'usr_001', name:'Priyasree Sen',  email:'priya.sen@heritage.in',        role:'USER',  created:'2026-05-12' },
  { id:'usr_002', name:'Rajesh Patel',   email:'rajesh@patelcrafts.com',        role:'USER',  created:'2026-06-01' },
  { id:'usr_003', name:'Meera Bai',      email:'meera.pottery@jaipur.org',      role:'USER',  created:'2026-06-15' },
  { id:'usr_004', name:'Ananya Iyer',    email:'ananya@kerala-ayurveda.in',     role:'USER',  created:'2026-06-20' },
  { id:'usr_005', name:'Arjun Sharma',   email:'arjun@bastarcraft.co.in',       role:'USER',  created:'2026-07-01' },
  { id:'usr_006', name:'Admin User',     email:'admin@shopez-swadeshi.gov.in',  role:'ADMIN', created:'2026-04-10' },
];

/* ────────────────────────────────────────────────────────────
   PRODUCT DATABASE  (120 + products across 8 categories)
   ──────────────────────────────────────────────────────────── */
const PRODUCTS_DATA = [
  /* ── Fashion ── */
  { id:'f01', name:'Hand-Block Printed Chanderi Saree',           brand:'Taneira',              price:4200,  rating:4.8, category:'Fashion',     state:'Madhya Pradesh',  craftType:'Chanderi Weaving',   isSustainable:true,  isMSME:true,  img:u('1583391099-eae30f4a0d53'),   history:'Chanderi sarees trace back to the Vedic period and were patronised by Mughal royalty. They are woven on traditional handlooms using silk-cotton blends shot through with pure gold zari.', materials:'Organic silk, cotton yarn, gold zari',           artisan:'Bunkaar Society (MSME), Chanderi' },
  { id:'f02', name:'Ikat Silk Dupatta – Deep Indigo',             brand:'Pochampally Weavers',  price:1800,  rating:4.7, category:'Fashion',     state:'Telangana',       craftType:'Ikat Weaving',       isSustainable:true,  isMSME:true,  img:u('1585386959-a4a9b3b4b8fc'),   history:'Double Ikat from Pochampally uses tie-resist dyeing on both warp and weft before weaving, producing mirror-symmetric geometric patterns impossible to replicate industrially.', materials:'Mulberry silk, vegetable dyes',                  artisan:'Pochampally Handloom Co-op' },
  { id:'f03', name:'Bandhani Gota-Patti Lehenga Set',             brand:'Kalki Fashion',        price:12500, rating:4.9, category:'Fashion',     state:'Rajasthan',       craftType:'Bandhani Tie-Dye',   isSustainable:false, isMSME:false, img:u('1610030169-d56d7a22a86e'),   history:'Bandhani is an ancient tie-dye craft from Rajasthan and Gujarat. Tiny fabric dots are pinched and tied with thread before dyeing, creating exquisite patterns after untying.', materials:'Pure cotton, natural tie-dye, gota ribbon',     artisan:'Jaipur Artisan Guild' },
  { id:'f04', name:'Kashmiri Pashmina Shawl – Natural Grey',      brand:'Shingora',             price:8900,  rating:4.9, category:'Fashion',     state:'Jammu & Kashmir', craftType:'Pashmina Weaving',   isSustainable:true,  isMSME:false, img:u('1544966503-7f56c85f1f4e'),   history:'Pashmina fibre is hand-combed from the underbelly of Changthangi goats reared above 4500 m in Ladakh. Master weavers spend months on a single 5-kg loom-woven shawl.', materials:'Grade-A Pashmina, natural pigments',            artisan:'Kashmir Pashmina Craft Council' },
  { id:'f05', name:'Kanjivaram Silk Saree – Temple Border',       brand:'Palam Silks',          price:18000, rating:5.0, category:'Fashion',     state:'Tamil Nadu',      craftType:'Kanjivaram Weaving', isSustainable:false, isMSME:true,  img:u('1610030169-4d0c0ef6d26d'),   history:'Kanjivaram silk is synonymous with South Indian bridal tradition. The heavy silk-zari interlock weave originated in Kanchipuram over 400 years ago and remains entirely handloom.', materials:'Pure mulberry silk, 22-kt gold zari',          artisan:'Kanchipuram Silk Handloom Society' },
  { id:'f06', name:'Khadi Cotton Kurta – Hand-Spun',              brand:'Fab India',            price:1250,  rating:4.5, category:'Fashion',     state:'Gujarat',         craftType:'Khadi Weaving',      isSustainable:true,  isMSME:true,  img:u('1594938298608-ec58f5d3e4cb'),   history:"Gandhi's Swadeshi movement revived Khadi hand-spinning. The fabric is spun on a charkha from raw cotton, providing livelihoods to rural women artisans across India.", materials:'100 % hand-spun organic cotton, natural dyes',  artisan:'Khadi & Village Industries Commission' },
  { id:'f07', name:'Sambalpuri Ikat Cotton Saree',                brand:'Ekaya Banaras',        price:3400,  rating:4.6, category:'Fashion',     state:'Odisha',          craftType:'Sambalpuri Ikat',    isSustainable:true,  isMSME:true,  img:u('1583241800-9f8e5b2f0f46'),   history:'Sambalpuri ikat uses resist-dyeing techniques where threads are tied and dyed in multiple colours before weaving, forming intricate Shankha (conch) and Chakra motifs.', materials:'Fine cotton yarn, vegetable dyes',             artisan:'Sambalpur Handloom Cluster' },
  { id:'f08', name:'Phulkari Embroidered Dupatta',                brand:'Amrapali',             price:2200,  rating:4.7, category:'Fashion',     state:'Punjab',          craftType:'Phulkari Embroidery',isSustainable:true,  isMSME:true,  img:u('1594938298608-5a9d524b3d5b'),   history:"Phulkari ('flower work') is a traditional embroidery technique from Punjab where bright silk threads are stitched onto homespun cotton cloth in geometric floral patterns.", materials:'Handwoven cotton, silk floss threads',          artisan:'Punjab Phulkari Artisan Collective' },
  { id:'f09', name:'Assam Muga Silk Mekhela Chador',             brand:'Silkworm Assam',       price:6800,  rating:4.8, category:'Fashion',     state:'Assam',           craftType:'Muga Silk Weaving',  isSustainable:true,  isMSME:true,  img:u('1610030169-6e6e4bfde2f2'),   history:'Muga silk is unique to Assam and is produced by Antheraea assamensis silkworms feeding on Som and Soalu leaves. It has a natural golden sheen that deepens with every wash.', materials:'Wild Muga silk cocoons, natural sizing',       artisan:'Sualkuchi Weaving Cluster, Assam' },
  { id:'f10', name:'Paithani Silk Saree – Peacock Border',        brand:'Ranka Jewellers',      price:22000, rating:4.9, category:'Fashion',     state:'Maharashtra',     craftType:'Paithani Weaving',   isSustainable:false, isMSME:false, img:u('1583241800-6e6e4bfde2f2'),   history:'Paithani was the royal silk of the Peshwas. The interlocked tapestry technique produces crisp oblique lines on the border and a distinctive flying-bird pallav motif.', materials:'Pure silk warp, zari weft, metallic thread',   artisan:'Yeola Handloom Weavers Co-op, Maharashtra' },
  { id:'f11', name:'Kalamkari Cotton Kurta – Floral',             brand:'Dhrama Designs',       price:1650,  rating:4.4, category:'Fashion',     state:'Andhra Pradesh',  craftType:'Kalamkari Printing', isSustainable:true,  isMSME:true,  img:u('1594938298608-7a1f9c2d8e3a'),   history:'Kalamkari ("pen work") uses a bamboo pen and tamarind dyes to hand-draw mythological narratives and floral patterns on cotton cloth treated with myrobalan mordant.', materials:'Organic cotton, tamarind dyes, myrobalan',     artisan:'Machilipatnam Kalamkari Centre' },
  { id:'f12', name:'Lucknowi Chikankari Kurta',                   brand:'Aza Fashions',         price:3200,  rating:4.6, category:'Fashion',     state:'Uttar Pradesh',   craftType:'Chikankari Embroidery',isSustainable:true,isMSME:true,  img:u('1594938298608-2e9d7b8b3e4a'),   history:'Chikankari is a 400-year-old white-thread embroidery introduced to Lucknow by the Mughal court. Artisans use 36 distinct stitches to create shadow-work and floral motifs.', materials:'Fine muslin, white cotton floss thread',      artisan:'Lucknow Chikankari Artisan Group' },
  { id:'f13', name:'Woollen Kullu Shawl – Geometric',             brand:'Himachal Handlooms',   price:2800,  rating:4.5, category:'Fashion',     state:'Himachal Pradesh',craftType:'Kullu Weaving',      isSustainable:true,  isMSME:true,  img:u('1544966503-8e7b6a5f0e46'),   history:'Kullu shawls are woven on pit-looms in the Kullu Valley by communities that have practised the craft for centuries, using geometric temple-border motifs specific to each village.', materials:'Pure wool, vegetable dyes',                    artisan:'Kullu Valley Handloom Society' },
  { id:'f14', name:'Kota Doria Silk-Cotton Saree',                brand:'Rajsilk',              price:3900,  rating:4.7, category:'Fashion',     state:'Rajasthan',       craftType:'Kota Doria Weaving', isSustainable:true,  isMSME:true,  img:u('1610030169-1d0c1ef6d26d'),   history:'Kota Doria is a lightweight fabric woven on pit-looms in Kaithoon, Kota. Its characteristic square-check transparency (khats) is created by interlocking silk and cotton yarns.', materials:'Silk-cotton blend, gold zari accents',         artisan:'Kaithoon Handloom Cluster, Rajasthan' },
  { id:'f15', name:'Pochampally Silk Saree – Geometric',          brand:'Nalli Silks',          price:7200,  rating:4.8, category:'Fashion',     state:'Telangana',       craftType:'Pochampally Ikat',   isSustainable:true,  isMSME:true,  img:u('1583241800-4e4e2bfde2f2'),   history:'Pochampally ikat is a GI-tagged craft where threads are resist-dyed before weaving to produce geometric patterns that align perfectly through traditional master-weaver skill.', materials:'Pure mulberry silk, chemical-free dyes',      artisan:'Bhoodan Pochampally Handloom Society' },

  /* ── Handicrafts ── */
  { id:'h01', name:'Jaipur Blue Pottery Floral Vase',             brand:'Jaipur Claycrafts',    price:1850,  rating:4.9, category:'Handicrafts', state:'Rajasthan',       craftType:'Blue Pottery',       isSustainable:true,  isMSME:true,  img:u('1610830110-3a56c6c9a85a'),   history:'Jaipur Blue Pottery is unique in that it uses no clay — the dough comprises quartz stone powder, glass grit and gum, then is hand-painted with cobalt oxide before firing.', materials:'Quartz powder, glass grit, organic gums, cobalt glaze', artisan:'Ram Swaroop Pottery Cluster, Sanganer' },
  { id:'h02', name:'Dhokra Brass Casting Elephant Figurine',      brand:'Bastar Tribal Art',    price:2400,  rating:4.8, category:'Handicrafts', state:'Chhattisgarh',    craftType:'Dhokra Casting',     isSustainable:true,  isMSME:true,  img:u('1602516168-5e1c88e3abe4'),   history:'Dhokra is a 4000-year-old lost-wax brass casting technique. A wax model is encased in clay, molten brass poured in, the clay broken to reveal the unique metal sculpture.', materials:'Recycled brass, beeswax, alluvial clay',       artisan:'Bastar Dhokra Shilp Kala Cluster' },
  { id:'h03', name:'Channapatna Wooden Spinning Top Set',          brand:'Rasoi Crafts',         price:680,   rating:4.7, category:'Handicrafts', state:'Karnataka',       craftType:'Wood Carving',       isSustainable:true,  isMSME:true,  img:u('1567016379-6b3b4fe9b5f9'),   history:'Channapatna toys are handcrafted on traditional lathes in the "toy-town" near Bengaluru. The bright ivory-safe lacquer colours and smooth finish are globally GI-tagged.', materials:'Aged ivory wood (Wrightia tinctoria), lac dye', artisan:'Channapatna Heritage Woodcraft Group' },
  { id:'h04', name:'Madhubani Painting – Village Scene',           brand:'Mithila Art Studio',   price:3200,  rating:4.9, category:'Handicrafts', state:'Bihar',           craftType:'Madhubani Painting', isSustainable:true,  isMSME:true,  img:u('1580933073889-0b4a3971ee80'),   history:'Madhubani painting originated in the Mithila region. Women traditionally drew elaborate two-dimensional motifs on walls for ceremonies, using fingers, twigs and natural dyes.', materials:'Handmade paper, natural pigments, bamboo pen',  artisan:'Mithila Women Artisan Cooperative' },
  { id:'h05', name:'Warli Art Tribal Panel on Canvas',             brand:'Tribal Strokes',       price:2100,  rating:4.6, category:'Handicrafts', state:'Maharashtra',     craftType:'Warli Tribal Art',   isSustainable:true,  isMSME:true,  img:u('1604328698567-40cfce61c2b3'),   history:'Warli art is practised by the Warli tribe of northern Maharashtra. Using white rice paste on red-brown mud-coated cloth, they depict harvest festivals and community life.', materials:'Organic cotton canvas, rice-paste pigment, bamboo', artisan:'Warli Tribal Artist Collective, Palghar' },
  { id:'h06', name:'Bidriware Decorative Tray – Inlaid Silver',   brand:'Deccan Craft House',   price:4500,  rating:4.8, category:'Handicrafts', state:'Karnataka',       craftType:'Bidriware Inlay',    isSustainable:false, isMSME:true,  img:u('1568702135-37af5b0f44d6'),   history:'Bidriware uses a zinc-copper alloy oxidised jet black with sal ammoniac mud, then inlaid with pure silver wire. The craft originated in Bidar during the Bahmani Sultanate.', materials:'Zinc-copper alloy, pure silver wire, sal ammoniac', artisan:'Bidar Craftsmen Cluster, Karnataka' },
  { id:'h07', name:'Rogan Art Painted Cushion Cover',              brand:'Kutch Craft Village',  price:1600,  rating:4.7, category:'Handicrafts', state:'Gujarat',         craftType:'Rogan Art',          isSustainable:true,  isMSME:true,  img:u('1581623895-cbedb8e0d479'),   history:'Rogan art uses a thick paint made by boiling castor oil, then applying it to cotton cloth using a metal rod. Only one family in Kutch preserves this 300-year-old craft.', materials:'Castor oil paint, handwoven cotton cloth',     artisan:'Khatri Family, Nirona Village, Kutch' },
  { id:'h08', name:'Dokra Brass Peacock Wall Art',                 brand:'Orissa Crafts Org',    price:3800,  rating:4.8, category:'Handicrafts', state:'Odisha',          craftType:'Dhokra Casting',     isSustainable:true,  isMSME:true,  img:u('1545558935-0f6c00e4d03e'),   history:'Bell metal craft of Odisha (known as Dhokra or Kansari) uses lost-wax process to create elaborate wall panels depicting deities, peacocks and ritual scenes.', materials:'Recycled brass and bell metal alloy',          artisan:'Dhenkanal Bell Metal Craft Society' },
  { id:'h09', name:'Terracotta Ganesha from Bishnupur',            brand:'Bengal Pottery House',  price:1200,  rating:4.6, category:'Handicrafts', state:'West Bengal',     craftType:'Terracotta Moulding',isSustainable:true,  isMSME:true,  img:u('1610830110-5a56c6c9a85a'),   history:"Bishnupur terracotta temples inspired potters to create fine figurines. The distinctive red-clay panels on Bishnupur's Rasmancha temples have informed pottery art for 400+ years.", materials:'Alluvial terracotta clay, natural kiln firing',  artisan:'Bishnupur Potter Self-Help Group' },
  { id:'h10', name:'Pattachitra Scroll Painting – Jagannath',      brand:'Raghurajpur Art',      price:2800,  rating:4.9, category:'Handicrafts', state:'Odisha',          craftType:'Pattachitra Painting',isSustainable:true, isMSME:true,  img:u('1604328698567-80cfce61c2b3'),   history:'Pattachitra ("cloth painting") depicts mythological narratives of Lord Jagannath using stone colours and lacquer. The village of Raghurajpur is entirely dedicated to this craft.', materials:'Cotton scroll, stone pigments, natural lacquer',artisan:'Raghurajpur Heritage Village Co-op' },
  { id:'h11', name:'Leather Puppet – Tholu Bommalata',             brand:'Nimmalakunta Crafts',  price:1950,  rating:4.5, category:'Handicrafts', state:'Andhra Pradesh',  craftType:'Shadow Puppetry',    isSustainable:true,  isMSME:true,  img:u('1566073506-a87843c50a83'),   history:'Tholu Bommalata shadow puppets are made from translucent goat leather scraped thin and painted with bold primary colours. A single puppet requires 3 days of craftwork.', materials:'Vegetable-tanned goat leather, natural dyes',  artisan:'Nimmalakunta Leather Craft Centre' },
  { id:'h12', name:'Kerala Brass Urli Decorative Bowl',            brand:'Mohan Lal Sons',       price:3400,  rating:4.7, category:'Handicrafts', state:'Kerala',          craftType:'Brass Casting',      isSustainable:false, isMSME:false, img:u('1568702135-57af5b0f44d6'),   history:'The Urli is a round brass vessel traditionally used in Kerala temples to offer flowers floating on water. Master bell-metal craftsmen produce them using traditional sand casting.', materials:'Panchaloha alloy (brass, copper, gold, silver, iron)', artisan:'Thrissur Bell Metal Craft Society' },
  { id:'h13', name:'Paper Mache Kashmiri Lacquer Box',             brand:'Suffering Moses Kashmir',price:2600, rating:4.6, category:'Handicrafts', state:'Jammu & Kashmir', craftType:'Paper Mache',        isSustainable:true,  isMSME:true,  img:u('1567016379-8b3b4fe9b5f9'),   history:'Kashmiri paper mache (Kar-e-Qalamdani) involves layering wet paper over moulds, drying, painting with Persian and Mughal floral motifs, then lacquering for durability.', materials:'Recycled newspaper pulp, natural pigments, lacquer', artisan:'Kashmir Paper Mache Artisan Guild' },
  { id:'h14', name:'Brocade Banaras Silk Box – Gift Set',          brand:'Meena Bazaar',         price:1800,  rating:4.5, category:'Handicrafts', state:'Uttar Pradesh',   craftType:'Banarasi Brocade',   isSustainable:false, isMSME:true,  img:u('1545558935-1f6c00e4d03e'),   history:'Banarasi brocade weaving began during the Mughal era in Varanasi. Artisans weave intricate silver and gold zari motifs into silk fabric on pit-looms using Jacquard card designs.', materials:'Silk, pure silver zari, gold zari threads',    artisan:'Varanasi Silk Brocade Cooperative' },
  { id:'h15', name:'Gond Art Painting – Forest Spirit',            brand:'Jangarh Art Studio',   price:4200,  rating:4.9, category:'Handicrafts', state:'Madhya Pradesh',  craftType:'Gond Tribal Art',    isSustainable:true,  isMSME:true,  img:u('1604328698567-70cfce61c2b3'),   history:'Gond art from Madhya Pradesh uses dotted and dashed lines to fill animals, trees and deities with a vibrant visual rhythm. Each painting takes 4–12 weeks of painstaking work.', materials:'Acrylic on canvas, natural earth pigment detail',artisan:'Jangarh Singh Shyam Memorial Trust' },

  /* ── Ayurveda ── */
  { id:'a01', name:'Eladi Hydrating Ayurvedic Facial Cream',       brand:'Forest Essentials',    price:2450,  rating:4.7, category:'Ayurveda',    state:'Kerala',          craftType:'Ayurvedic Formulation',isSustainable:true,isMSME:false, img:u('1556228578-8c53b12c5b47'),   history:'Based on Ashtanga Hridaya formulas, this cream incorporates pearl powder, cardamom and saffron as documented in classical Ayurvedic texts to restore luminous skin tone.', materials:'Cold-pressed coconut oil, saffron, cardamom, pearl powder', artisan:'Forest Essentials Heritage Labs' },
  { id:'a02', name:'Kama Ayurveda Pure Rose Water Toner',           brand:'Kama Ayurveda',        price:895,   rating:4.8, category:'Ayurveda',    state:'Rajasthan',       craftType:'Steam Distillation',  isSustainable:true,  isMSME:false, img:u('1526570207-b8e3bd3e5aa5'),   history:'The Kannauj and Pushkar valleys have produced rose water by traditional deg-bhapka steam distillation for 400 years, prized by Mughal perfumers and Ayurvedic physicians alike.', materials:'Damask roses, purified mountain spring water',  artisan:'Kannauj Attar Distillery Collective' },
  { id:'a03', name:'Ashwagandha KSM-66 Capsules (60-count)',        brand:'Himalaya Wellness',    price:680,   rating:4.6, category:'Ayurveda',    state:'Uttarakhand',     craftType:'Herbal Extraction',   isSustainable:true,  isMSME:false, img:u('1471193565-6b73dc8e3e01'),   history:'Ashwagandha (Withania somnifera) is the cornerstone adaptogen of Ayurvedic medicine. The KSM-66 extract retains the full-spectrum root profile without solvent residue.', materials:'Certified organic Ashwagandha root, rice flour capsule', artisan:'Himalaya Botanical Research Centre' },
  { id:'a04', name:'Triphala Churna Digestive Powder – 200g',       brand:'Patanjali',            price:145,   rating:4.3, category:'Ayurveda',    state:'Uttarakhand',     craftType:'Herbal Blend',        isSustainable:true,  isMSME:false, img:u('1512621776831-2b6c5c1e5b2d'),   history:'Triphala ("three fruits") has been prescribed in Ayurvedic texts for over 2000 years. The combination of Amalaki, Bibhitaki and Haritaki balances all three doshas.', materials:'Amalaki, Bibhitaki, Haritaki (equal parts)',    artisan:'Patanjali Haridwar Research Institute' },
  { id:'a05', name:'Nalpamaradi Turmeric Skin Brightening Oil',     brand:'Siddhalepa',           price:1250,  rating:4.7, category:'Ayurveda',    state:'Kerala',          craftType:'Classical Oil Preparation',isSustainable:true,isMSME:false,img:u('1556228578-9c53b12c5b47'),   history:'The Nalpamaradi formula prescribes 15 barks of the fig family boiled in coconut oil with turmeric, sesame and vetiver to remove suntan and hyperpigmentation naturally.', materials:'15 fig-tree barks, turmeric, sesame, vetiver, coconut oil', artisan:'Kerala Kottakkal Arya Vaidya Sala' },
  { id:'a06', name:'Organic Kumkumadi Tailam Face Serum',           brand:'Vaidyaratnam',         price:3200,  rating:4.9, category:'Ayurveda',    state:'Kerala',          craftType:'Classical Oil Preparation',isSustainable:true,isMSME:false,img:u('1526570207-6b8e3bd3e5aa5'),  history:'Kumkumadi Tailam is the Ayurvedic gold standard for skin radiance, combining saffron stigmas, lotus stamens and sandalwood with sesame oil over 16 days of slow infusion.', materials:'Saffron, lotus stamens, sandalwood, sesame oil', artisan:'Vaidyaratnam Heritage Laboratory, Ollur' },
  { id:'a07', name:'Brahmi Herbal Hair Oil – 200ml',                brand:'Indulekha',            price:320,   rating:4.5, category:'Ayurveda',    state:'Kerala',          craftType:'Herbal Oil Infusion',  isSustainable:true,  isMSME:false, img:u('1512621776831-3b6c5c1e5b2d'),   history:'The Brahmi plant (Bacopa monnieri) is a classic Ayurvedic nervine used topically to strengthen hair roots. It is slow-infused in sesame oil with neem and amla for synergy.', materials:'Brahmi, Amla, Neem, Bhringraj, sesame oil',    artisan:'Indulekha Ayurvedic Research Team' },
  { id:'a08', name:'Ayurvedic Tooth Powder – Dant Manjan',          brand:'Vicco',                price:85,    rating:4.4, category:'Ayurveda',    state:'Maharashtra',     craftType:'Herbal Dental Formula',isSustainable:true,  isMSME:false, img:u('1471193565-7b73dc8e3e01'),   history:'Vicco Vajradanti has used Ayurvedic barks and roots since 1952. The formula includes babul bark, catechu, clove oil and lime calcium to promote gum health naturally.', materials:'Babul bark, catechu, clove oil, calcium carbonate', artisan:'Vicco Laboratories, Pune' },
  { id:'a09', name:'Chyawanprash Awaleha – 500g',                   brand:'Baidyanath',           price:390,   rating:4.5, category:'Ayurveda',    state:'West Bengal',     craftType:'Classical Rasayana',   isSustainable:true,  isMSME:false, img:u('1512621776831-4b6c5c1e5b2d'),   history:'Chyawanprash is a classical Ayurvedic rasayana recorded in the Charaka Samhita. Amla is the primary ingredient (a 20:1 fresh-fruit concentrate) surrounded by 40+ herbs.', materials:'Fresh Amla concentrate, 40 Ayurvedic herbs, pure honey, ghee', artisan:'Baidyanath Nadia Research Institute' },
  { id:'a10', name:'Pure Shilajit Resin – 15g',                     brand:'Upakarma Ayurveda',    price:2800,  rating:4.8, category:'Ayurveda',    state:'Uttarakhand',     craftType:'Mineral Extraction',   isSustainable:true,  isMSME:false, img:u('1526570207-7b8e3bd3e5aa5'),   history:'Shilajit is an exudate formed over thousands of years as Himalayan vegetation decomposes and is pressed by layer upon layer of rock. It is rich in fulvic acid and humic compounds.', materials:'Grade-A Himalayan Shilajit resin, purified',    artisan:'Himalayan Wellness Sourcing' },
  { id:'a11', name:'Neem & Tulsi Anti-Acne Face Wash',              brand:'Biotique',             price:195,   rating:4.3, category:'Ayurveda',    state:'Uttarakhand',     craftType:'Herbal Formulation',   isSustainable:true,  isMSME:false, img:u('1556228578-7c53b12c5b47'),   history:'Neem and Tulsi are the two foremost Ayurvedic antiseptics. Their synergy is documented in Sushruta Samhita for treating Kushtha (inflammatory skin conditions).', materials:'Neem leaf extract, Holy Basil steam-distillate, aloe vera', artisan:'Biotique Green Herb Research Lab' },
  { id:'a12', name:'Shatavari Powder – Womens Wellness (200g)',      brand:'Organic India',        price:450,   rating:4.7, category:'Ayurveda',    state:'Rajasthan',       craftType:'Herbal Extraction',    isSustainable:true,  isMSME:false, img:u('1471193565-5b73dc8e3e01'),   history:'Shatavari (Asparagus racemosus) is considered the primary Ayurvedic adaptogen for women, supporting hormonal balance and lactation. Organic India sources from certified farms.', materials:'Certified organic Shatavari root, no fillers',  artisan:'Organic India Chhatishgarh Farms' },
  { id:'a13', name:'Mahanarayan Tailam Joint Relief Oil',            brand:'Kottakkal Arya Vaidya Sala', price:860, rating:4.6, category:'Ayurveda', state:'Kerala',        craftType:'Classical Oil Preparation',isSustainable:true,isMSME:false,img:u('1526570207-8b8e3bd3e5aa5'),  history:'Mahanarayan Tailam contains 52 herbs and is the classical Ayurvedic formulation for vataja (vata-dosha) joint pain and muscular stiffness, prepared via traditional sthavara process.', materials:'52 Ayurvedic herbs, sesame oil base, rock salt',artisan:'AVS Kottakkal Manufacturing Division' },
  { id:'a14', name:'Panchagavya Hair Mask – 150g',                   brand:'Cow Science',          price:540,   rating:4.2, category:'Ayurveda',    state:'Maharashtra',     craftType:'Herbal Hair Formula',  isSustainable:true,  isMSME:true,  img:u('1512621776831-5b6c5c1e5b2d'),   history:"Panchagavya products use the five sacred products of the cow (milk, curd, ghee, urine, dung) which Ayurveda considers highly therapeutic when combined with herbal adjuvants.", materials:'Organic cow ghee, curd, amla, bhringraj, tulsi', artisan:'Gosalas of Maharashtra' },
  { id:'a15', name:'Sandal & Turmeric Ubtan Scrub – 100g',           brand:'Vedic Naturals',       price:650,   rating:4.6, category:'Ayurveda',    state:'Karnataka',       craftType:'Traditional Ubtan',    isSustainable:true,  isMSME:true,  img:u('1526570207-9b8e3bd3e5aa5'),   history:'Ubtan is a traditional pre-wedding scrub from Vedic customs combining sandalwood paste, turmeric, rose water and chickpea flour to bestow a golden natural glow.', materials:'Sandalwood powder, turmeric, rose water, chickpea flour', artisan:'Vedic Naturals Heritage Farm, Coorg' },

  /* ── Home Decor ── */
  { id:'d01', name:'Handwoven Natural Jute Rug – 5x8 ft',           brand:'EcoWeave India',       price:5400,  rating:4.6, category:'Home Decor',  state:'West Bengal',     craftType:'Jute Weaving',         isSustainable:true,  isMSME:true,  img:u('1567016379-5b3b4fe9b5f9'),   history:'West Bengal produces 75% of the world\'s jute. Artisans hand-braid long golden-fibre stalks on traditional wooden frame looms to create dense, biodegradable floor mats.', materials:'100% organic jute fibre, vegetable dyes',      artisan:'Howrah Weaving Self-Help Group' },
  { id:'d02', name:'Condhi Clay Pot Table Lamp',                     brand:'The Bombay Store',     price:2200,  rating:4.5, category:'Home Decor',  state:'Rajasthan',       craftType:'Pottery & Firing',     isSustainable:true,  isMSME:true,  img:u('1610830110-6a56c6c9a85a'),   history:'Khurja potters in UP and Rajasthani kumbhars fire red clay vessels using traditional wood kilns. The warm orange glow of lamp-lit terracotta creates a distinctive Diyas aesthetic.', materials:'Terracotta clay, natural glaze, cotton wick',  artisan:'Khurja Pottery Cluster, Uttar Pradesh' },
  { id:'d03', name:'Madhubani Painted Wooden Coaster Set of 6',      brand:'Mithila Art',          price:1400,  rating:4.8, category:'Home Decor',  state:'Bihar',           craftType:'Madhubani Painting',   isSustainable:true,  isMSME:true,  img:u('1580933073889-1b4a3971ee80'),  history:'Traditional Madhubani motifs of fish, lotus and peacock painted on round wood coasters preserve the ancient visual language of Mithila art in a functional modern product.', materials:'Teak wood disc, natural pigments, acrylic seal', artisan:'Mithila Women Artisan Cooperative, Darbhanga' },
  { id:'d04', name:'Pipli Applique Work Hanging Lamp',               brand:'Pipli Craft House',    price:1800,  rating:4.7, category:'Home Decor',  state:'Odisha',          craftType:'Pipli Applique',       isSustainable:true,  isMSME:true,  img:u('1545558935-3f6c00e4d03e'),   history:'Pipli applique craft uses brightly coloured fabric cut-outs stitched onto black cloth in floral patterns. The village of Pipli near Puri sustains hundreds of artisan families.', materials:'Cotton fabric applique, brass fittings',       artisan:'Pipli Artisan Village Cooperative' },
  { id:'d05', name:'Kashmiri Walnut Wood Carved Bowl',               brand:'Craft Emporium Kashmir',price:6200, rating:4.9, category:'Home Decor',  state:'Jammu & Kashmir', craftType:'Walnut Wood Carving',  isSustainable:true,  isMSME:true,  img:u('1568702135-67af5b0f44d6'),   history:'Kashmiri walnut-wood carving dates to the 15th century. Craftsmen use hand-held chisels to produce intricately detailed patterns of chinar leaves and Mughal floral arabesques.', materials:'Aged Kashmiri walnut wood, natural lacquer',   artisan:'Kashmir Handicraft Emporium, Srinagar' },
  { id:'d06', name:'Brass Diyas Gift Set of 12 – Festival Edition', brand:'Brass Bazar India',    price:1200,  rating:4.8, category:'Home Decor',  state:'Rajasthan',       craftType:'Brass Casting',        isSustainable:true,  isMSME:true,  img:u('1569937756-8c94c4e4b2af'),   history:'Decorative brass diyas for Diwali are cast in Moradabad using traditional sand-casting moulds. The golden finish comes from hand-polishing with tamarind paste.', materials:'Cast brass, hand-polished Moradabad finish',   artisan:'Moradabad Brass Craft Cluster' },
  { id:'d07', name:'Warli Painted Furniture – Side Table',           brand:'Wooden Street',        price:8500,  rating:4.4, category:'Home Decor',  state:'Maharashtra',     craftType:'Warli Tribal Art',     isSustainable:true,  isMSME:true,  img:u('1521783988-7e7d0a3e2b3b'),   history:'A contemporary fusion of Warli tribal motifs hand-painted on solid mango wood furniture. The traditional rice-paste white paint has been adapted with food-safe primers.', materials:'Solid mango wood, non-toxic eco-paint',       artisan:'Warli Artisan Studio, Palghar' },
  { id:'d08', name:'Phulkari Embroidered Cushion Cover Set of 2',    brand:'Amrapali Home',        price:1600,  rating:4.5, category:'Home Decor',  state:'Punjab',          craftType:'Phulkari Embroidery',  isSustainable:true,  isMSME:true,  img:u('1581623895-dbedb8e0d479'),   history:'Phulkari embroidery traditionally covers every inch of cloth with floral silk threads. These cushion covers adapt the bold geometric patterns for contemporary home interiors.', materials:'Cotton base, pure silk embroidery thread',    artisan:'Punjab Phulkari Artisan Collective' },
  { id:'d09', name:'Kalamkari Printed Table Runner – 180cm',         brand:'Anokhi',               price:1100,  rating:4.6, category:'Home Decor',  state:'Andhra Pradesh',  craftType:'Kalamkari Printing',   isSustainable:true,  isMSME:true,  img:u('1567016379-7b3b4fe9b5f9'),   history:'Srikalahasti Kalamkari uses a bamboo pen (kalam) to draw intricate temple stories using iron-acetate (black), pomegranate (yellow) and indigo (blue) natural dyes on cotton.', materials:'Organic cotton, natural dyes, tamarind mordant', artisan:'Srikalahasti Kalamkari Artisan Centre' },
  { id:'d10', name:'Bamboo Lampshade – Assamese Weave',              brand:'Crafts Council NE',    price:2400,  rating:4.5, category:'Home Decor',  state:'Assam',           craftType:'Bamboo Weaving',       isSustainable:true,  isMSME:true,  img:u('1545558935-5f6c00e4d03e'),   history:'Assamese bamboo weavers create intricate geometric screens from a single bamboo stalk split into thin slats. The lamp filters warm light through the woven grid pattern.', materials:'Local Himalayan bamboo, natural varnish',      artisan:'Northeast India Bamboo Craft Circle' },
  { id:'d11', name:'Dhurrie Flatweave Rug – Geometric Stripe',       brand:'Fabindia',             price:4800,  rating:4.7, category:'Home Decor',  state:'Rajasthan',       craftType:'Flatweave Dhurrie',    isSustainable:true,  isMSME:true,  img:u('1581623895-ebedb8e0d479'),   history:'Dhurrie weaving is a traditional flatweave technique using cotton on frame looms. Rajasthani dhurries are characterised by bold geometric stripes and earthy colour palettes.', materials:'Recycled cotton, vegetable dyes, jute warp',   artisan:'Salawas Dhurrie Weaver Community, Jodhpur' },
  { id:'d12', name:'Neem Wood Organic Salt & Pepper Set',            brand:'Ariro Toys',           price:680,   rating:4.4, category:'Home Decor',  state:'Tamil Nadu',      craftType:'Wood Carving',         isSustainable:true,  isMSME:true,  img:u('1521783988-8e7b6a5f0e46'),   history:'Neem wood (Azadirachta indica) is naturally antimicrobial and insect-repellent. Tamil Nadu artisans shape and sand each piece by hand, finished with food-safe sesame oil.', materials:'Organic neem wood, food-safe sesame oil finish', artisan:'Ariro Toy Crafts, Chennai' },
  { id:'d13', name:'Wooden Ganesha Wall Panel – Teak',               brand:'The Elephant Company', price:5600,  rating:4.8, category:'Home Decor',  state:'Kerala',          craftType:'Wood Carving',         isSustainable:false, isMSME:false, img:u('1545558935-7f6c00e4d03e'),   history:'Kerala\'s tradition of wood carving for temple doors and mandapas produces large-scale decorative panels with crisp three-dimensional relief of deities and floral motifs.', materials:'Sustainably-sourced teak, natural lacquer',   artisan:'Thrissur Wood Carving Society' },
  { id:'d14', name:'Tokai Paper Mache Hanging Mobile',               brand:'Channapatna Crafts',   price:1400,  rating:4.5, category:'Home Decor',  state:'Karnataka',       craftType:'Paper Mache',          isSustainable:true,  isMSME:true,  img:u('1604328698567-90cfce61c2b3'),   history:'Channapatna paper mache mobiles reinterpret the colourful toys of the toy-town tradition in hanging kinetic forms that capture the joy of festival decoration.', materials:'Recycled newspaper, lac-based dye, cotton string', artisan:'Channapatna Artisan School, Karnataka' },
  { id:'d15', name:'Copper Hammered Water Jug – 1.5L',               brand:'Vedic Vatica',         price:1800,  rating:4.7, category:'Home Decor',  state:'Rajasthan',       craftType:'Copper Craft',         isSustainable:true,  isMSME:true,  img:u('1568702135-77af5b0f44d6'),   history:'Ayurveda recommends drinking water stored in copper vessels to benefit from the metal\'s antimicrobial properties. Rajasthani metalworkers hammer copper sheets into smooth juglets.', materials:'99% pure food-grade copper, lead-free',       artisan:'Jaipur Copper Craft Cluster' },

  /* ── Kitchen ── */
  { id:'k01', name:'Teak Wood Masala Spice Box – 12 compartments',  brand:'Rasoi Crafts',         price:1250,  rating:4.8, category:'Kitchen',     state:'Karnataka',       craftType:'Wood Carving',         isSustainable:true,  isMSME:true,  img:u('1565071181-f12cb8f0ad27'),   history:'Channapatna woodcarvers fashion masala boxes from aged teak, a wood prized for its insect-resistance. The rotating lid ensures airtight preservation of whole spices.', materials:'Aged teak, organic shellac finish, brass clasp', artisan:'Channapatna Heritage Woodcraft Group' },
  { id:'k02', name:'Hand-Hammered Iron Kadai – 30cm',               brand:'The Indus Valley',     price:2400,  rating:4.7, category:'Kitchen',     state:'Maharashtra',     craftType:'Iron Smithing',        isSustainable:true,  isMSME:true,  img:u('1542810603-5b52e33e7e90'),   history:'Iron cooking vessels were the standard in Indian kitchens for millennia. Cast-iron and hand-hammered iron kadais leach beneficial dietary iron into food while cooking.', materials:'Seasoned pig iron, hand-hammered 5mm gauge',   artisan:'Maharashtra Iron Smith Guild' },
  { id:'k03', name:'Brass Mortar & Pestle – Ohkli Set',             brand:'Shankh Handicrafts',   price:1600,  rating:4.6, category:'Kitchen',     state:'Uttar Pradesh',   craftType:'Brass Casting',        isSustainable:true,  isMSME:true,  img:u('1465014785-b1c918f6ef08'),   history:'Brass mortars for grinding spices are a Moradabad speciality. The interior is sand-cast rough to provide abrasive grinding action while the exterior is mirror-polished.', materials:'Food-grade cast brass, sand-cast rough interior', artisan:'Moradabad Brass Craft Cluster' },
  { id:'k04', name:'Coconut Shell Serving Bowls Set of 4',           brand:'Eco Craft Kerala',     price:890,   rating:4.5, category:'Kitchen',     state:'Kerala',          craftType:'Coconut Shell Craft',  isSustainable:true,  isMSME:true,  img:u('1484564785-2b7df9cb4a9c'),   history:'South Indian artisans polish and lacquer halved coconut shells to make zero-waste serving bowls. The natural oil content of coconut shell makes them naturally food-safe.', materials:'Mature coconut shell, organic coconut oil finish', artisan:'Kerala Coconut Craft Society' },
  { id:'k05', name:'Handcrafted Bamboo Serving Tray',               brand:'BO Living',            price:980,   rating:4.6, category:'Kitchen',     state:'Assam',           craftType:'Bamboo Weaving',       isSustainable:true,  isMSME:true,  img:u('1484564785-3b7df9cb4a9c'),   history:'Bamboo grows in dense stands in northeast India without need for pesticides. Assamese artisans split, flatten and weave bamboo into sturdy trays with a natural organic look.', materials:'Moso bamboo, food-safe varnish, cotton rope handles', artisan:'Northeast India Bamboo Craft Circle' },
  { id:'k06', name:'Urli Panchaloha Rice Cooker – Traditional',     brand:'Mohan Lal Sons',       price:4200,  rating:4.8, category:'Kitchen',     state:'Kerala',          craftType:'Panchaloha Casting',   isSustainable:false, isMSME:false, img:u('1542810603-6b52e33e7e90'),   history:'Panchaloha (five-metal alloy) cooking vessels are prescribed in Ayurvedic dietetics for their mineral-leaching properties. The bell-metal finish resists corrosion for decades.', materials:'Panchaloha: copper, brass, tin, lead-free zinc, iron', artisan:'Thrissur Bell Metal Cast Society' },
  { id:'k07', name:'Khurja Pottery Dinner Set – 24 pieces',          brand:'Khurja Ceramics',      price:4800,  rating:4.5, category:'Kitchen',     state:'Uttar Pradesh',   craftType:'Blue Pottery',         isSustainable:true,  isMSME:true,  img:u('1567016379-9b3b4fe9b5f9'),   history:'Khurja is called the Ceramic City of India. Potters use a clean white kaolin body painted with underglaze cobalt-blue and fired at 1200°C in gas kilns fuelled by biogas.', materials:'High-fire kaolin ceramic, lead-free cobalt glaze', artisan:'Khurja Ceramics Manufacturing Cluster' },
  { id:'k08', name:'Copper Tongue Cleaner – Jiwa Set of 2',          brand:'Puja Store',           price:240,   rating:4.7, category:'Kitchen',     state:'Rajasthan',       craftType:'Copper Craft',         isSustainable:true,  isMSME:true,  img:u('1465014785-3c7df9cb4a9c'),   history:'Ayurvedic oral hygiene prescribes scraping the tongue with copper, which destroys bacteria through the oligodynamic effect. Pure copper tongue scrapers are free of any plastic parts.', materials:'99.9 % pure food-grade copper',                artisan:'Jaipur Copper Artisan Collective' },
  { id:'k09', name:'Iron Tawa Flat Griddle – Hand-Hammered 28cm',   brand:'The Indus Valley',     price:1650,  rating:4.8, category:'Kitchen',     state:'Maharashtra',     craftType:'Iron Smithing',        isSustainable:true,  isMSME:true,  img:u('1542810603-7b52e33e7e90'),   history:'Traditional hand-hammered iron tawas, once pre-seasoned, develop a natural non-stick patina that improves with use. The hammering creates micro-textures that hold seasoning.', materials:'Pre-seasoned cast iron, riveted steel handle',  artisan:'Maharashtra Iron Smith Guild' },
  { id:'k10', name:'Wooden Salad Servers – Acacia Handmade',        brand:'Wooden Story India',   price:750,   rating:4.4, category:'Kitchen',     state:'West Bengal',     craftType:'Wood Carving',         isSustainable:true,  isMSME:true,  img:u('1484564785-4b7df9cb4a9c'),   history:'Acacia wood is sourced from plantation forests. West Bengal craftsmen use traditional lathe-turning and hand-carving to produce graceful utensils with a natural oil finish.', materials:'FSC-certified acacia wood, walnut oil finish',  artisan:'West Bengal Woodcraft Society' },
  { id:'k11', name:'Steel Dabba Stacked Tiffin Box – 4-Tier',       brand:'Milton',               price:1200,  rating:4.6, category:'Kitchen',     state:'Gujarat',         craftType:'Steel Fabrication',    isSustainable:true,  isMSME:false, img:u('1565071181-g12cb8f0ad27'),   history:'The Indian tiffin box (dabba) is a marvel of zero-waste design: four stackable steel containers with snap-lock lids have been used by Mumbai\'s famous dabbawala delivery network for over 130 years.', materials:'18/8 food-grade stainless steel, BPA-free lids', artisan:'Milton India Manufacturing Division' },
  { id:'k12', name:'Neem Wood Spatula & Ladle Gift Set',             brand:'Ariro Naturals',       price:580,   rating:4.5, category:'Kitchen',     state:'Tamil Nadu',      craftType:'Wood Carving',         isSustainable:true,  isMSME:true,  img:u('1465014785-4c7df9cb4a9c'),   history:'Neem wood utensils are naturally antimicrobial. Tamil Nadu artisans shape each ladle and spatula on a hand lathe and polish them with food-safe sesame oil from local presses.', materials:'Organic neem wood, sesame oil finish',          artisan:'Ariro Toy Crafts, Chennai' },
  { id:'k13', name:'Ceramic Masala Grinder – Rajasthani Hand-Painted',brand:'Jaipur Claycrafts',  price:2100,  rating:4.7, category:'Kitchen',     state:'Rajasthan',       craftType:'Blue Pottery',         isSustainable:true,  isMSME:true,  img:u('1610830110-7a56c6c9a85a'),   history:'Blue pottery grinders with quartz-grit grinding surface are unique to Jaipur. The ceramic body never imparts metallic taste and keeps freshly ground spices cool.', materials:'Quartz-body ceramic, cobalt blue glaze',       artisan:'Jaipur Blue Pottery Cluster' },
  { id:'k14', name:'Gunny Jute Shopping Bag – Eco Block Print',      brand:'Cloth Story',          price:350,   rating:4.3, category:'Kitchen',     state:'West Bengal',     craftType:'Jute Weaving',         isSustainable:true,  isMSME:true,  img:u('1567016379-0b3b4fe9b5f9'),   history:'Jute bags are a staple of Indian green consumerism. Block-printed with wooden stamps using azo-free water inks, each bag is unique and replaces 200+ single-use plastic bags.', materials:'Jute hessian, water-based block print ink',    artisan:'Howrah Weaving and Printing Group' },
  { id:'k15', name:'Rajasthani Lac Bangle Tray Organiser',           brand:'Craft Fair India',     price:1100,  rating:4.6, category:'Kitchen',     state:'Rajasthan',       craftType:'Lacquerware',          isSustainable:true,  isMSME:true,  img:u('1568702135-87af5b0f44d6'),   history:'Lac-turned objects from Rajasthan use natural shellac resin applied to spinning wood. The multi-colour bangle tray fuses this ancient technique with functional kitchen organisation.', materials:'Sheesham wood, natural lac resin, mineral pigments', artisan:'Jaipur Lac Artisan Co-op' },

  /* ── Jewellery ── */
  { id:'j01', name:'Kundan Polki Necklace Set – Bridal',            brand:'Amrapali Jaipur',      price:24500, rating:4.9, category:'Jewellery',   state:'Rajasthan',       craftType:'Kundan Jewellery',     isSustainable:false, isMSME:false, img:u('1542038906-8800c4d7c8b6'),   history:'Kundan jewellery originated in the Mughal court. Molten gold is poured around precious stones in a lac-filling mould, then polished glass (Polki) is set to create the signature brilliant effect.', materials:'22kt gold foil, uncut diamond Polki, lac',    artisan:'Jaipur Gemstone Jewellers Cluster' },
  { id:'j02', name:'Oxidised Silver Tribal Choker Necklace',         brand:'Silvesto India',       price:1800,  rating:4.6, category:'Jewellery',   state:'Rajasthan',       craftType:'Oxidised Silver',      isSustainable:false, isMSME:true,  img:u('1535893673-3e1c54d2e04c'),   history:'Tribal-inspired oxidised silver jewellery from Rajasthan takes inspiration from Bhil and Gond adornment traditions, using oxidisation to enhance engraved surface detail.', materials:'92.5 sterling silver, chemical oxidation',    artisan:'Jaipur Silver Artisan Guild' },
  { id:'j03', name:'Meenakari Floral Bangles Set – Gold Plated',    brand:'Amrapali',             price:3200,  rating:4.7, category:'Jewellery',   state:'Rajasthan',       craftType:'Meenakari Enamelwork', isSustainable:false, isMSME:true,  img:u('1542038906-9800c4d7c8b6'),   history:'Meenakari (enamel art) was introduced to the Amber court in the 16th century. Coloured glass enamels are fired into engraved gold channels to create vivid floral designs.', materials:'Gold-plated brass, kiln-fired enamel',         artisan:'Jaipur Meenakari Artisan Cluster' },
  { id:'j04', name:'Temple Jewellery Earrings – South Indian Gold', brand:'Tanishq',              price:8500,  rating:4.8, category:'Jewellery',   state:'Tamil Nadu',      craftType:'Temple Jewellery',     isSustainable:false, isMSME:false, img:u('1535893673-4e1c54d2e04c'),   history:'South Indian temple jewellery was created to adorn deity idols, then adapted for bharatanatyam dancers. The distinctive repousse gold work with rubies and emeralds is BIS-hallmarked.', materials:'22kt BIS-hallmarked gold, ruby, emerald',    artisan:'GRT & Tanishq certified goldsmiths' },
  { id:'j05', name:'Silver Filigree Pendant – Cuttack Craft',        brand:'Odisha Craft',         price:4200,  rating:4.8, category:'Jewellery',   state:'Odisha',          craftType:'Silver Filigree',      isSustainable:false, isMSME:true,  img:u('1542038906-0800c4d7c8b6'),   history:'Cuttack is famous for its Tarakasi (silver filigree) craft, in which fine silver wire is twisted into lace-like patterns. An intricate pendant can contain over 50 metres of wire.', materials:'99.9 % pure silver wire, no solder',          artisan:'Cuttack Silver Filigree Association' },
  { id:'j06', name:'Lac Bangle Set – Rajasthani Traditional (12)',   brand:'Shree Bangles',        price:950,   rating:4.5, category:'Jewellery',   state:'Rajasthan',       craftType:'Lacquerware',          isSustainable:true,  isMSME:true,  img:u('1535893673-5e1c54d2e04c'),   history:'Lac bangles from Jaipur and Hyderabad are made by rolling molten lac around a metal mandrel and embedding semi-precious stones and glass while the lac is still pliable.', materials:'Natural lac resin, glass stones, mirror inlay', artisan:'Jaipur Lac Artisan Co-op' },
  { id:'j07', name:'Tribal Dokri Bracelet – Horn & Brass',           brand:'Bastar Craft',         price:780,   rating:4.4, category:'Jewellery',   state:'Chhattisgarh',    craftType:'Dhokra Casting',       isSustainable:true,  isMSME:true,  img:u('1542038906-1800c4d7c8b6'),   history:'Bastar tribal jewellery uses brass casting and buffalo-horn elements carved into geometric patterns that carry totemic significance for Gondi and Muria communities.', materials:'Lost-wax brass, polished buffalo horn',        artisan:'Bastar Tribal Artisan Federation' },
  { id:'j08', name:'Navratna Pendant in Sterling Silver',             brand:'Ratna Sagar',          price:5400,  rating:4.7, category:'Jewellery',   state:'Uttar Pradesh',   craftType:'Gemstone Setting',     isSustainable:false, isMSME:true,  img:u('1535893673-6e1c54d2e04c'),   history:'The Navratna (nine gems) pendant represents the nine planets of Vedic astrology — ruby (Sun), pearl (Moon), red coral (Mars), emerald (Mercury), yellow sapphire (Jupiter), diamond (Venus), blue sapphire (Saturn), hessonite (Rahu), and cat\'s eye (Ketu).', materials:'92.5 sterling silver, 9 certified gemstones',artisan:'Jaipur Gemstone Jewellers Cluster' },
  { id:'j09', name:'Gold-Dipped Marble Earrings – Pietra Dura',      brand:'Nilofer\'s',           price:3600,  rating:4.6, category:'Jewellery',   state:'Uttar Pradesh',   craftType:'Pietra Dura Inlay',    isSustainable:false, isMSME:true,  img:u('1542038906-2800c4d7c8b6'),   history:'Pietra Dura (known as Parchin Kari in India) was perfected by Mughal craftsmen building the Taj Mahal. Semi-precious stones are cut and inlaid flush into white marble in floral patterns.', materials:'White marble, lapis lazuli, malachite, carnelian, gold', artisan:'Agra Pietra Dura Craft Society' },
  { id:'j10', name:'Pearl Haar Necklace – Hyderabad Double Strand',  brand:'Mangatrai',            price:12800, rating:4.9, category:'Jewellery',   state:'Telangana',       craftType:'Pearl Stringing',      isSustainable:false, isMSME:false, img:u('1535893673-7e1c54d2e04c'),   history:'Hyderabad has been the world\'s pearl trading capital since the era of the Nizams. Pearl stringers knot each bead individually on silk thread so that breaking one strand preserves all others.', materials:'Freshwater pearls, silk knotted thread, 18kt gold clasps', artisan:'Hyderabad Pearl Artisan Federation' },
  { id:'j11', name:'Dokra Choker – Tribal Bell Motif',               brand:'Orissa Crafts',        price:1650,  rating:4.5, category:'Jewellery',   state:'Odisha',          craftType:'Dhokra Casting',       isSustainable:true,  isMSME:true,  img:u('1542038906-3800c4d7c8b6'),   history:'Dokra bell-motif jewellery is cast using lost-wax method in tribal Odisha. Each bell is individually cast, then strung on brass wire into chokers worn during Dussehra celebrations.', materials:'Recycled brass, traditional bell alloy',       artisan:'Dhenkanal Tribal Craft Cooperative' },
  { id:'j12', name:'Jhumka Earrings – Antique Brass with Mirror',    brand:'Zevar by Ritu',        price:1100,  rating:4.6, category:'Jewellery',   state:'Gujarat',         craftType:'Metal Jewellery',      isSustainable:false, isMSME:true,  img:u('1535893673-8e1c54d2e04c'),   history:'Traditional Gujarati Jhumka earrings use stamped brass bells studded with mirror-work glass that catch the light during Garba dance. The distinctive bell-drop form has been worn since the 10th century.', materials:'Antique brass, handset mirror glass, oxidised silver finish', artisan:'Rajkot Jewellery Artisan Guild' },
  { id:'j13', name:'Silver Payal Anklet Pair – Traditional Ghungroo',brand:'Zaveri Bazaar',        price:3800,  rating:4.7, category:'Jewellery',   state:'Maharashtra',     craftType:'Silver Jewellery',     isSustainable:false, isMSME:true,  img:u('1542038906-4800c4d7c8b6'),   history:'Ghungroo anklets with hollow silver bells are an essential part of classical Bharatnatyam and Kathak dancer costumes. Traditional Mumbai craftsmen attach each bell individually to the silver chain.', materials:'92.5 sterling silver, hollow silver ghungroos',artisan:'Zaveri Bazaar Silversmith Community' },
  { id:'j14', name:'Maang Tikka – Kundan Forehead Jewel',            brand:'Amrapali Jaipur',      price:4200,  rating:4.8, category:'Jewellery',   state:'Rajasthan',       craftType:'Kundan Jewellery',     isSustainable:false, isMSME:false, img:u('1535893673-9e1c54d2e04c'),   history:'The Maang Tikka is a traditional bridal forehead ornament. Kundan technique involves embedding uncut polki diamonds and coloured gemstones in molten gold, hallmarked by the Rajasthan Jewellers Association.', materials:'22kt gold foil, polki diamond, colour gemstones', artisan:'Jaipur Gemstone Jewellers Cluster' },
  { id:'j15', name:'Bidri Silver-Inlaid Ring – Geometric Pattern',   brand:'Deccan Craft House',   price:2200,  rating:4.7, category:'Jewellery',   state:'Karnataka',       craftType:'Bidriware Inlay',      isSustainable:false, isMSME:true,  img:u('1542038906-5800c4d7c8b6'),   history:'Bidri rings feature pure silver wire inlaid into an oxidised zinc-copper alloy that turns jet black in the presence of sal ammoniac soil from Bidar Fort. No two rings are identical.', materials:'Zinc-copper alloy, pure silver inlay, sal ammoniac oxidation', artisan:'Bidar Craftsmen Cluster, Karnataka' },

  /* ── Handloom ── */
  { id:'l01', name:'Organic Cotton Bedsheet Set – Double',           brand:'Fabindia',             price:2800,  rating:4.6, category:'Handloom',    state:'Rajasthan',       craftType:'Handloom Weaving',     isSustainable:true,  isMSME:true,  img:u('1519710164-9b9c3e5ee7be'),   history:'Rajasthani handloom bedsheets are woven from stone-washed organic cotton on traditional wooden floor looms by artisan families in Barmer and Bagru producing heritage block prints.', materials:'GOTS-certified organic cotton, Azo-free pigments', artisan:'Barmer Women Weaver Society' },
  { id:'l02', name:'Jamdani Muslin Table Cloth – 6-seater',          brand:'Tangail Saree Kushtia', price:3400, rating:4.7, category:'Handloom',    state:'West Bengal',     craftType:'Jamdani Muslin',       isSustainable:true,  isMSME:true,  img:u('1519710164-0b9c3e5ee7be'),   history:'Jamdani (UNESCO-listed Intangible Heritage) uses a supplementary weft technique to create floating floral motifs on fine muslin. The thread count can reach 1000 per inch.', materials:'Extra-fine organic cotton muslin, natural dyes',artisan:'Tangail Muslin Weavers Co-op, West Bengal' },
  { id:'l03', name:'Khadi Hand-Spun Blanket – Winter Heritage',      brand:'KVIC',                 price:3200,  rating:4.5, category:'Handloom',    state:'Gujarat',         craftType:'Khadi Weaving',        isSustainable:true,  isMSME:true,  img:u('1519710164-1b9c3e5ee7be'),   history:'Khadi spinning was revived by Gandhi as a symbol of self-reliance. KVIC (Khadi & Village Industries Commission) certifies genuine hand-spun, hand-woven textiles from over 5000 charkha centres.', materials:'Hand-spun organic wool, natural indigo stripe dye', artisan:'KVIC Weaving Centres, Gujarat' },
  { id:'l04', name:'Mangalgiri Cotton Shirting – Classic Stripe',    brand:'Fab India',            price:1600,  rating:4.5, category:'Handloom',    state:'Andhra Pradesh',  craftType:'Mangalgiri Weaving',   isSustainable:true,  isMSME:true,  img:u('1519710164-2b9c3e5ee7be'),   history:'Mangalgiri cotton is woven in Guntur district using a distinctive "Zari-border" technique where gold thread is woven into the selvedge while keeping the body in crisp plain cotton.', materials:'Organic cotton warp, pure gold zari selvedge',  artisan:'Mangalgiri Handloom Weavers\' Trust' },
  { id:'l05', name:'Banaras Kinkhab Silk Brocade Fabric – per metre', brand:'Ekaya Banaras',       price:4200,  rating:4.9, category:'Handloom',    state:'Uttar Pradesh',   craftType:'Kinkhab Brocade',      isSustainable:false, isMSME:true,  img:u('1519710164-3b9c3e5ee7be'),   history:'Kinkhab ("a thousand hues") is the most complex Banarasi brocade, weaving a continuous fabric so densely with gold and silver threads that it requires specialised support for the drawloom.', materials:'Pure silk warp, silver and gold zari weft',    artisan:'Varanasi Silk Brocade Cooperative' },
  { id:'l06', name:'Leheriya Tie-Dye Dupatta – Rajasthani',          brand:'Anokhi',               price:1400,  rating:4.4, category:'Handloom',    state:'Rajasthan',       craftType:'Leheriya Tie-Dye',     isSustainable:true,  isMSME:true,  img:u('1519710164-4b9c3e5ee7be'),   history:'Leheriya ("wave-like") refers to the diagonal resist-dyeing technique from Jaipur, where cloth is rolled on a diagonal and tied at intervals before dyeing to create chevron stripe patterns.', materials:'Chiffon georgette, direct fibre dyes',         artisan:'Sanganer Dyers\' Cooperative, Rajasthan' },
  { id:'l07', name:'Kutch Embroidered Mirror-Work Cushion Cover',    brand:'Kutch Craft Village',  price:1200,  rating:4.6, category:'Handloom',    state:'Gujarat',         craftType:'Kutchi Embroidery',    isSustainable:true,  isMSME:true,  img:u('1519710164-5b9c3e5ee7be'),   history:'Kutchi embroidery uses bright silk thread and Abhla (mirror) inserts in geometric patterns unique to each community. Mutwa, Rabari and Ahir groups each have a distinct stitch vocabulary.', materials:'Cotton base, silk thread, Abhla mirror glass', artisan:'Kutch Embroidery Artisan Collective' },
  { id:'l08', name:'Tangail Cotton Saree – Floral Woven',             brand:'Tangail Saree Kushtia', price:2800, rating:4.7, category:'Handloom',    state:'West Bengal',     craftType:'Tangail Weaving',      isSustainable:true,  isMSME:true,  img:u('1519710164-6b9c3e5ee7be'),   history:'Tangail sarees from Nadia district feature fine cotton weaving with delicate floral motifs woven by a pull-warp technique that creates a slight three-dimensional texture.', materials:'Fine mercerised cotton, zari border',          artisan:'Fulia Handloom Society, Nadia' },
  { id:'l09', name:'Himachali Kinnauri Shawl – Wool Woven',           brand:'Himachal Handlooms',   price:5800,  rating:4.8, category:'Handloom',    state:'Himachal Pradesh',craftType:'Kinnauri Weaving',     isSustainable:true,  isMSME:true,  img:u('1519710164-7b9c3e5ee7be'),   history:'Kinnauri shawls from the Kinnaur valley are woven in double-sided twill with geometric patterns in a palette of saffron, forest green and black. Each shawl takes 2–3 weeks.', materials:'Himalayan pashmina-grade wool, silk accent thread', artisan:'Kinnaur Valley Handloom Society' },
  { id:'l10', name:'Naga Handloom Stole – Tribal Stripe Pattern',    brand:'North East Roots',     price:2200,  rating:4.6, category:'Handloom',    state:'Nagaland',        craftType:'Naga Loin-Loom',       isSustainable:true,  isMSME:true,  img:u('1519710164-8b9c3e5ee7be'),   history:'Naga loin-loom weaving is practised by tribal women who strap the loom to their waist and use their body-tension to create tight, sturdy geometric striped textiles in ceremonial colours.', materials:'Wild cotton, natural earth dyes',               artisan:'Nagaland Tribal Weavers Union' },
  { id:'l11', name:'Batik Fabric – Javanese Batik Influence India', brand:'Ahmedabad Textiles',   price:1800,  rating:4.3, category:'Handloom',    state:'Gujarat',         craftType:'Batik Printing',       isSustainable:true,  isMSME:true,  img:u('1519710164-9b9c3e5ee7be'),   history:'Batik printing uses hot wax applied by a tjanting tool to resist dye on cotton. Surat and Ahmedabad artisans adapted the Javanese technique using Indian motifs and natural indigo dyes.', materials:'Fine cotton, beeswax resist, natural indigo dye', artisan:'Surat Batik Artisan Guild' },
  { id:'l12', name:'Handloom Wool Durry – Natural Undyed',            brand:'Dastkari Haat',        price:6400,  rating:4.7, category:'Handloom',    state:'Uttar Pradesh',   craftType:'Wool Flatweave',       isSustainable:true,  isMSME:true,  img:u('1519710164-0c9c3e5ee7be'),   history:'Undyed wool durries from Agra and Mirzapur use natural Merino and indigenous Deccani sheep wool in their natural cream and dark-brown shades to create beautiful earth-toned flatweaves.', materials:'Natural undyed Merino and Deccani sheep wool',  artisan:'Mirzapur Carpet Cluster, Uttar Pradesh' },
  { id:'l13', name:'Sambalpuri Silk Saree – Shankha Chakra',          brand:'Loom India',           price:8600,  rating:4.8, category:'Handloom',    state:'Odisha',          craftType:'Sambalpuri Ikat',      isSustainable:true,  isMSME:true,  img:u('1519710164-1c9c3e5ee7be'),   history:'The Shankha (conch) and Chakra (wheel) motifs of Sambalpuri ikat are pre-tied in the threads before weaving, so they appear identically on both faces of the finished silk cloth.', materials:'Pure mulberry silk, chemical-free dyes',       artisan:'Sambalpur Handloom Cluster' },
  { id:'l14', name:'Kantha Quilt – Recycled Silk Sari Patchwork',     brand:'Sasha Handicrafts',    price:5200,  rating:4.7, category:'Handloom',    state:'West Bengal',     craftType:'Kantha Embroidery',    isSustainable:true,  isMSME:true,  img:u('1519710164-2c9c3e5ee7be'),   history:'Kantha quilts are made by layering old silk saris and running thousands of tiny running stitches through all layers to create pictorial narratives. Every quilt is unique.', materials:'Recycled silk saris, cotton thread, organic batting', artisan:'Sasha Handicrafts Women\'s Group, Kolkata' },
  { id:'l15', name:'Muga Silk Scarf – Assam Weave Natural Gold',      brand:'Silkworm Assam',       price:4200,  rating:4.8, category:'Handloom',    state:'Assam',           craftType:'Muga Silk Weaving',    isSustainable:true,  isMSME:true,  img:u('1519710164-3c9c3e5ee7be'),   history:'Muga silk scarves shine brighter after every wash. The wild semi-silk is woven in simple twill on traditional Assamese pit-looms that produce a light, breathable fabric for all seasons.', materials:'Wild Muga silk cocoons, handwoven natural gloss', artisan:'Sualkuchi Weaving Cluster, Assam' },

  /* ── Books ── */
  { id:'b01', name:'The Art of Indian Cooking – A Heritage Cookbook',brand:'Rupa Publications',    price:1200,  rating:4.8, category:'Books',       state:'Delhi',           craftType:'Heritage Publishing',  isSustainable:true,  isMSME:false, img:u('1512821099-4fe22e6e7f73'),   history:'A comprehensive exploration of India\'s 29-state culinary heritage, featuring 350+ recipes from ancient Vedic kitchens to royal Mughal feasts, sourced from handwritten cookbooks.', materials:'Acid-free paper, soy-based inks, linen cover', artisan:'Rupa Publications Heritage Division' },
  { id:'b02', name:'Sarees of India – Photographic Atlas',            brand:'Niyogi Books',         price:3800,  rating:4.9, category:'Books',       state:'Delhi',           craftType:'Heritage Publishing',  isSustainable:true,  isMSME:false, img:u('1512821099-5fe22e6e7f73'),   history:'A 340-page photographic record of 108 distinct saree traditions across India. Each entry includes loom diagrams, artisan interviews and historical provenance documentation.', materials:'Coated matte art paper, full-bleed photography', artisan:'Niyogi Books, New Delhi' },
  { id:'b03', name:'Lost Cities of the Indus – Archaeological Study',brand:'Oxford University Press',price:2600, rating:4.7, category:'Books',       state:'Delhi',           craftType:'Academic Publishing',  isSustainable:true,  isMSME:false, img:u('1512821099-6fe22e6e7f73'),   history:'A rigorous survey of Harappan civilisation sites from Rakhigarhi to Lothal, examining craft production, urban planning, standardised weights and metallurgical innovations.', materials:'FSC-certified paper, archival ink',             artisan:'OUP India Press, Chennai' },
  { id:'b04', name:'Yoga: The Science of the Soul – Patanjali',      brand:'Penguin Random House',  price:450,   rating:4.6, category:'Books',       state:'Maharashtra',     craftType:'Spiritual Publishing', isSustainable:true,  isMSME:false, img:u('1512821099-7fe22e6e7f73'),   history:'Osho\'s translation and commentary on Patanjali\'s Yoga Sutras presents all 196 aphorisms with word-by-word translation and contemporary psychological interpretation.', materials:'Recycled paper, plant-based inks',              artisan:'Penguin Books India, Mumbai' },
  { id:'b05', name:'Malgudi Days – R K Narayan (Collector\'s Edition)',brand:'Indian Thought Publications',price:1800,rating:4.9,category:'Books',  state:'Karnataka',       craftType:'Literary Publishing',  isSustainable:true,  isMSME:false, img:u('1512821099-8fe22e6e7f73'),   history:'First published in 1943, Malgudi Days introduced the fictional South Indian town that became one of literature\'s most beloved settings. This collector\'s edition uses reproductions of R K Laxman\'s original illustrations.', materials:'Cream-tinted acid-free paper, cloth cover', artisan:'Indian Thought Publications, Bengaluru' },
  { id:'b06', name:'Miniature Paintings of Rajasthan – Illustrated',  brand:'Indira Gandhi National Centre', price:4200, rating:4.8, category:'Books', state:'Delhi',        craftType:'Academic Publishing',  isSustainable:true,  isMSME:false, img:u('1512821099-9fe22e6e7f73'),   history:'This scholarly volume documents 500+ miniature paintings from the Bundi, Mewar, Marwar and Amber schools, including previously unpublished royal collection works.', materials:'Archival coated paper, museum-quality printing', artisan:'IGNCA Print Division, New Delhi' },
  { id:'b07', name:'The Argumentative Indian – Amartya Sen',          brand:'Penguin Books India',   price:599,   rating:4.7, category:'Books',       state:'West Bengal',     craftType:'Non-fiction Publishing',isSustainable:true, isMSME:false, img:u('1512821099-0ge22e6e7f73'),   history:'Nobel laureate Amartya Sen\'s examination of India\'s intellectual heritage argues for an ancient culture of public reasoning, pluralism and democratic value that predates Western Enlightenment.', materials:'Recycled paper, soy-based inks',               artisan:'Penguin Books India, Mumbai' },
  { id:'b08', name:'Curry: A Tale of Cooks & Conquerors',             brand:'Westland Books',        price:750,   rating:4.6, category:'Books',       state:'Maharashtra',     craftType:'Food History Publishing',isSustainable:true,isMSME:false, img:u('1512821099-1ge22e6e7f73'),   history:'Lizzie Collingham\'s acclaimed history traces the origin of curry from Mughal court kitchens, through the British Raj spice trade to its global proliferation as a culinary icon.', materials:'Acid-free paper, food-safe embossed cover',    artisan:'Westland Books, Mumbai' },
  { id:'b09', name:'Hand & Spirit – Indian Handicrafts Monograph',   brand:'Dastkari Haat Samiti',  price:2200,  rating:4.9, category:'Books',       state:'Delhi',           craftType:'Craft Documentation', isSustainable:true,  isMSME:false, img:u('1512821099-2ge22e6e7f73'),   history:'Authored by leading craft scholars, this monograph documents 80 endangered Indian crafts with master-artisan oral histories, process photographs and market livelihood data.', materials:'Handmade cotton rag paper, archival photographs', artisan:'Dastkari Haat Samiti Press' },
  { id:'b10', name:'India After Gandhi – Ramachandra Guha',           brand:'Harper Collins India',  price:1100,  rating:4.8, category:'Books',       state:'Karnataka',       craftType:'History Publishing',   isSustainable:true,  isMSME:false, img:u('1512821099-3ge22e6e7f73'),   history:'A sweeping people\'s history of the Indian Republic from 1947 to 2007. Guha weaves political narrative with social history including artisan communities, regional languages and ecological movements.', materials:'Recycled acid-free paper, archival ink',      artisan:'HarperCollins India, Noida' },
  { id:'b11', name:'The Discovery of India – Jawaharlal Nehru',       brand:'Penguin Random House',  price:650,   rating:4.7, category:'Books',       state:'Uttar Pradesh',   craftType:'Political History',    isSustainable:true,  isMSME:false, img:u('1512821099-4ge22e6e7f73'),   history:'Written in Ahmednagar Fort prison in 1944, Nehru\'s magnum opus traces India\'s civilisational history across 5000 years, touching on philosophy, religion, art and the independence movement.', materials:'Acid-free paper',                              artisan:'Penguin Classics India Division' },
  { id:'b12', name:'Devdutt Pattanaik\'s Indian Mythology (Box Set)', brand:'Westland Books',        price:2400,  rating:4.8, category:'Books',       state:'Maharashtra',     craftType:'Mythology Publishing', isSustainable:true,  isMSME:false, img:u('1512821099-5ge22e6e7f73'),   history:'A five-volume illustrated mythology set covering Vishnu Purana, Shiva Purana, Mahabharata, Ramayana and Devi mythology with modern retellings and original artwork.', materials:'Art paper, embossed slipcase, bookmark ribbon', artisan:'Westland Books Mumbai' },
  { id:'b13', name:'Classic Indian Weaves – Textile Heritage Atlas', brand:'Niyogi Books',          price:5600,  rating:4.9, category:'Books',       state:'Delhi',           craftType:'Textile Documentation',isSustainable:true, isMSME:false, img:u('1512821099-6ge22e6e7f73'),   history:'Documents 200 distinct Indian weaving traditions with museum-quality photography, interviews with master weavers, and an interactive map of India\'s Handloom Geographic Indicators.', materials:'280gsm coated art paper, linen quarter-bound cover', artisan:'Niyogi Books Heritage Division' },
  { id:'b14', name:'The Palace of Illusions – Chitra Banerjee Divakaruni', brand:'Picador India', price:550,   rating:4.8, category:'Books',       state:'West Bengal',     craftType:'Literary Fiction',     isSustainable:true,  isMSME:false, img:u('1512821099-7ge22e6e7f73'),   history:'A feminist retelling of the Mahabharata through the eyes of Draupadi, interweaving Vedic legend with a powerful modern voice that has resonated with over two million readers globally.', materials:'FSC-certified paper, plant-based inks',       artisan:'Pan Macmillan India, Delhi' },
  { id:'b15', name:'A Fine Balance – Rohinton Mistry',                brand:'Faber & Faber India',   price:750,   rating:4.9, category:'Books',       state:'Maharashtra',     craftType:'Literary Fiction',     isSustainable:true,  isMSME:false, img:u('1512821099-8ge22e6e7f73'),   history:'Set during the Emergency (1975-77), this Booker-shortlisted novel follows four strangers whose lives collide in a Mumbai chawl, exploring caste, class and the resilience of the human spirit.', materials:'Cream matte paper, printed cloth cover',     artisan:'Faber India, Mumbai' },
];

/* Pagination constant */
const PAGE_SIZE = 12;

/* ────────────────────────────────────────────────────────────
   APP COMPONENT
   ──────────────────────────────────────────────────────────── */
export default function App() {
  /* Filter & nav state */
  const [activeTab,        setActiveTab]        = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedState,    setSelectedState]    = useState('All');
  const [searchQuery,      setSearchQuery]      = useState('');
  const [sortBy,           setSortBy]           = useState('default');
  const [currentPage,      setCurrentPage]      = useState(1);

  /* Cart / Wishlist */
  const [wishlist, setWishlist] = useState([]);
  const [cart,     setCart]     = useState([]);

  /* Overlays */
  const [isCartOpen,      setIsCartOpen]      = useState(false);
  const [isWishlistOpen,  setIsWishlistOpen]  = useState(false);
  const [isLoginOpen,     setIsLoginOpen]     = useState(false);
  const [quickViewProduct,setQuickViewProduct]= useState(null);

  /* Auth mock */
  const [username,    setUsername]    = useState(localStorage.getItem('swadeshi_user') || '');
  const [userRole,    setUserRole]    = useState(localStorage.getItem('swadeshi_role') || 'USER');
  const [loginEmail,  setLoginEmail]  = useState('');
  const [loginPassword,setLoginPassword]= useState('');
  const [showUsersDir,setShowUsersDir]= useState(false);

  /* Toast */
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  useEffect(() => {
    const u = localStorage.getItem('swadeshi_user');
    const r = localStorage.getItem('swadeshi_role');
    if (u) { setUsername(u); setUserRole(r || 'USER'); }
  }, []);

  /* Reset page on filter change */
  useEffect(() => { setCurrentPage(1); }, [selectedCategory, selectedState, searchQuery, sortBy]);

  /* ── Cart helpers ── */
  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(i => i !== id));
      triggerToast('Removed from Favorites.');
    } else {
      setWishlist([...wishlist, id]);
      triggerToast('Added to Favorites! ❤️');
    }
  };

  const addToCart = (product) => {
    const existing = cart.find(i => i.product.id === product.id);
    if (existing) {
      setCart(cart.map(i =>
        i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
    triggerToast(`Added to Bag: ${product.name}`);
  };

  const updateCartQty = (id, delta) => {
    setCart(cart.map(i => {
      if (i.product.id === id) {
        const q = i.quantity + delta;
        return q > 0 ? { ...i, quantity: q } : null;
      }
      return i;
    }).filter(Boolean));
  };

  /* ── Auth mock ── */
  const handleMockLogin = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    const isAdmin = loginEmail.toLowerCase().includes('admin');
    const name = loginEmail.split('@')[0];
    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
    const role = isAdmin ? 'ADMIN' : 'USER';
    setUsername(displayName);
    setUserRole(role);
    localStorage.setItem('swadeshi_user', displayName);
    localStorage.setItem('swadeshi_role', role);
    setIsLoginOpen(false);
    setLoginEmail('');
    setLoginPassword('');
    triggerToast(`Namaste, ${displayName}! Welcome back. (${role})`);
  };

  const handleLogout = () => {
    setUsername(''); setUserRole('USER'); setShowUsersDir(false);
    localStorage.removeItem('swadeshi_user');
    localStorage.removeItem('swadeshi_role');
    triggerToast('Logged out successfully.');
  };

  /* ── Derived product list ── */
  const filteredProducts = useMemo(() => {
    let list = PRODUCTS_DATA.filter(p => {
      const matchCat   = selectedCategory === 'All' || p.category === selectedCategory;
      const matchState = selectedState === 'All' || p.state === selectedState;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) ||
                          p.brand.toLowerCase().includes(q) ||
                          p.craftType.toLowerCase().includes(q) ||
                          p.state.toLowerCase().includes(q) ||
                          p.category.toLowerCase().includes(q);
      return matchCat && matchState && matchSearch;
    });

    if      (sortBy === 'price-asc')  list = [...list].sort((a,b) => a.price - b.price);
    else if (sortBy === 'price-desc') list = [...list].sort((a,b) => b.price - a.price);
    else if (sortBy === 'rating')     list = [...list].sort((a,b) => b.rating - a.rating);
    else if (sortBy === 'name')       list = [...list].sort((a,b) => a.name.localeCompare(b.name));

    return list;
  }, [selectedCategory, selectedState, searchQuery, sortBy]);

  const totalPages     = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pagedProducts  = filteredProducts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const cartTotal      = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const cartItemCount  = cart.reduce((s, i) => s + i.quantity, 0);

  const CATEGORIES = ['Fashion','Handicrafts','Ayurveda','Home Decor','Kitchen','Jewellery','Handloom','Books'];
  const CAT_ICONS  = {Fashion:'👗',Handicrafts:'🏺',Ayurveda:'🌿','Home Decor':'🏡',Kitchen:'☕',Jewellery:'💍',Handloom:'🧵',Books:'📚'};
  const CAT_COUNTS = Object.fromEntries(CATEGORIES.map(c => [c, PRODUCTS_DATA.filter(p => p.category === c).length]));

  /* ── Page helpers ── */
  const scrollToProducts = () =>
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="swadeshi-app">

      {/* Toast */}
      {toastMessage && (
        <div className="swadeshi-toast animate-slide-in">
          <span className="toast-icon">🪔</span>
          <span className="toast-text">{toastMessage}</span>
        </div>
      )}

      {/* ============================================================
          NAVIGATION BAR
          ============================================================ */}
      <header className="swadeshi-navbar">
        <div className="nav-container">
          {/* Brand */}
          <div className="nav-brand" onClick={() => { setActiveTab('Home'); setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}>
            <span className="logo-mandala">🪔</span>
            <div>
              <span className="logo-text">ShopEZ</span>
              <span className="logo-sub">Swadeshi</span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="nav-links">
            {['Home','Categories','Collections','Brands','About'].map(tab => (
              <button key={tab} className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'Categories') document.getElementById('categories-section')?.scrollIntoView({ behavior:'smooth' });
                  else if (tab === 'Collections') document.getElementById('festival-section')?.scrollIntoView({ behavior:'smooth' });
                  else if (tab === 'Brands') document.getElementById('made-in-india-section')?.scrollIntoView({ behavior:'smooth' });
                }}>
                {tab}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="nav-actions">
            <div className="nav-search-bar">
              <span className="search-icon">🔍</span>
              <input id="search-input" type="text" placeholder="Search crafts, states, brands…"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); if (e.target.value) scrollToProducts(); }} />
              {searchQuery && <button className="clear-search-btn" onClick={() => setSearchQuery('')}>×</button>}
            </div>

            <button className="action-icon-btn" onClick={() => setIsWishlistOpen(true)} aria-label="Wishlist">
              <span>❤️</span>
              {wishlist.length > 0 && <span className="badge-count">{wishlist.length}</span>}
            </button>

            <button className="action-icon-btn" onClick={() => setIsCartOpen(true)} aria-label="Cart">
              <span>🛒</span>
              {cartItemCount > 0 && <span className="badge-count bg-terracotta">{cartItemCount}</span>}
            </button>

            {username ? (
              <div className="user-profile-menu">
                <span className="user-greeting">Namaste, <strong>{username}</strong><span className="role-tag">{userRole}</span></span>
                <button className="nav-logout-btn" onClick={handleLogout}>Sign Out</button>
              </div>
            ) : (
              <button className="btn-nav-login" onClick={() => setIsLoginOpen(true)}>Login</button>
            )}
          </div>
        </div>
      </header>

      {/* ============================================================
          HERO
          ============================================================ */}
      <section className="swadeshi-hero">
        <WarliCorner position="top-left" />
        <WarliCorner position="top-right" />

        <div className="hero-content">
          <div className="hero-text-panel">
            <span className="hero-badge-tag">🇮🇳 Celebrating Indian Heritage</span>
            <h1>Proudly Made in India.</h1>
            <p>From local generational artisans to trusted home-grown brands — discover authentic apparel, handicrafts, and wellness products crafted with tradition, organic quality, and heritage care.</p>
            <div className="hero-ctas">
              <button className="btn btn-terracotta" onClick={scrollToProducts}>Shop Authentic Crafts</button>
              <button className="btn btn-outline-maroon" onClick={() => document.getElementById('state-explorer-section')?.scrollIntoView({ behavior:'smooth' })}>Explore by State</button>
            </div>
          </div>

          <div className="hero-graphics-panel">
            <div className="mandala-outer">
              <div className="mandala-inner">
                <div className="mandala-center">
                  <span className="mandala-icon">🪔</span>
                </div>
              </div>
            </div>
            <div className="heritage-card animate-float">
              <h4>Artisan Hand-Woven Textiles</h4>
              <p>Chanderi • Ikat • Pochampally</p>
              <span className="origin-stamp">Origin: Madhya Pradesh</span>
            </div>
          </div>
        </div>
      </section>

      <KolamDivider />

      {/* ============================================================
          CATEGORIES
          ============================================================ */}
      <section id="categories-section" className="swadeshi-categories">
        <div className="section-header text-center">
          <h2>Featured Heritage Categories</h2>
          <p>Carefully curated collections representing India's traditional crafts and wellness legacy.</p>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map(cat => (
            <div key={cat}
              className={`category-pill-card ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => { setSelectedCategory(cat === selectedCategory ? 'All' : cat); scrollToProducts(); }}>
              <span className="cat-icon">{CAT_ICONS[cat]}</span>
              <div className="cat-details">
                <h4>{cat}</h4>
                <span>{CAT_COUNTS[cat]} Products</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          STATE EXPLORER
          ============================================================ */}
      <section id="state-explorer-section" className="swadeshi-state-explorer">
        <div className="section-header">
          <h2>🇮🇳 State Heritage Explorer</h2>
          <p>Browse signature handicrafts catalogued by their Indian state of origin.</p>
        </div>
        <div className="states-scroller">
          <button className={`state-card-btn ${selectedState === 'All' ? 'active' : ''}`} onClick={() => setSelectedState('All')}>All States</button>
          {[
            {code:'TG',name:'Telangana',    specialty:'Pochampally Weaving'},
            {code:'KL',name:'Kerala',       specialty:'Ayurvedic Formulations'},
            {code:'RJ',name:'Rajasthan',    specialty:'Blue Pottery & Block Prints'},
            {code:'JK',name:'Jammu & Kashmir',specialty:'Pashmina & Saffron'},
            {code:'AS',name:'Assam',        specialty:'Muga Silk & Bamboo'},
            {code:'TN',name:'Tamil Nadu',   specialty:'Kanjivaram Silk'},
            {code:'GJ',name:'Gujarat',      specialty:'Patola & Bandhani'},
            {code:'MP',name:'Madhya Pradesh',specialty:'Chanderi Weaving'},
            {code:'CG',name:'Chhattisgarh', specialty:'Dhokra Brass Craft'},
            {code:'WB',name:'West Bengal',  specialty:'Jute & Kantha Quilt'},
            {code:'KA',name:'Karnataka',    specialty:'Channapatna & Bidri'},
            {code:'UP',name:'Uttar Pradesh',specialty:'Banarasi Silk & Chikankari'},
            {code:'OD',name:'Odisha',       specialty:'Pattachitra & Sambalpuri'},
            {code:'MH',name:'Maharashtra',  specialty:'Paithani & Warli Art'},
            {code:'PB',name:'Punjab',       specialty:'Phulkari Embroidery'},
          ].map(st => (
            <button key={st.name}
              className={`state-card-btn ${selectedState === st.name ? 'active' : ''}`}
              onClick={() => { setSelectedState(st.name === selectedState ? 'All' : st.name); scrollToProducts(); }}>
              <span className="state-badge-circle">{st.code}</span>
              <div className="state-btn-text">
                <strong>{st.name}</strong>
                <span>{st.specialty}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================
          BRAND STORIES
          ============================================================ */}
      <section id="made-in-india-section" className="made-in-india-stories">
        <div className="section-header text-center">
          <h2>Empowering Indian Businesses</h2>
          <p>Every purchase supports generations of traditional weavers, local artisans, and home-grown MSMEs.</p>
        </div>
        <div className="brand-stories-grid">
          <div className="brand-story-card">
            <div className="brand-card-top">
              <span className="badge-origin">Madhya Pradesh</span>
              <span className="badge-type">MSME Certified</span>
            </div>
            <h3>Taneira Handlooms</h3>
            <p className="brand-narrative">"We work directly with 150+ master weavers in Madhya Pradesh to preserve Chanderi cotton-silk techniques. Our patterns use raw vegetable dyes, ensuring biodegradable finishes and fair living wages."</p>
            <div className="brand-footer-artisan">
              <span><strong>Artisan Cluster:</strong> Bunkaar Cooperative</span>
              <span className="stamp-verified">✓ Authentic Handloom</span>
            </div>
          </div>
          <div className="brand-story-card highlighted-card">
            <div className="brand-card-top">
              <span className="badge-origin">Rajasthan</span>
              <span className="badge-type">Artisan Spotlight</span>
            </div>
            <h3>Jaipur Claycrafts</h3>
            <p className="brand-narrative">"Jaipur Blue Pottery had nearly disappeared until local family clusters revived the cobalt glaze formula. Because it uses quartz rather than clay, every piece is incredibly light, water-impervious, and hand-painted."</p>
            <div className="brand-footer-artisan">
              <span><strong>Artisan Lead:</strong> Meera Bai (Generational Master)</span>
              <span className="stamp-verified">✓ 100% Clay-Free Pottery</span>
            </div>
          </div>
          <div className="brand-story-card">
            <div className="brand-card-top">
              <span className="badge-origin">Kerala</span>
              <span className="badge-type">Organic Standard</span>
            </div>
            <h3>Forest Essentials Heritage</h3>
            <p className="brand-narrative">"Our skin formulations are prepared in rural Kerala using heritage methods. We employ local farming cooperatives to harvest fresh herbs, cardamoms, and coconuts at sunrise to lock in maximum botanical potency."</p>
            <div className="brand-footer-artisan">
              <span><strong>Artisan Lead:</strong> Malabar Herb Growers Co-Op</span>
              <span className="stamp-verified">✓ Sustainable Agriculture</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          ADMIN PANEL (shown only to Admin users)
          ============================================================ */}
      {username && userRole === 'ADMIN' && (
        <section className="admin-quick-links">
          <div className="welcome-card">
            <h2>Welcome Admin, {username}!</h2>
            <p>Access simulated backend databases and user registers securely from this registry panel.</p>
            <button className="btn btn-admin" onClick={() => setShowUsersDir(!showUsersDir)}>
              {showUsersDir ? 'Hide User Directory' : 'Access User Directory (Mock API)'}
            </button>
          </div>
          {showUsersDir && (
            <div className="admin-section animate-fade-in" style={{marginTop:'20px',background:'var(--color-card-bg)',borderRadius:'16px',border:'1px solid var(--color-border)'}}>
              <h3>Simulated Registered Users Directory</h3>
              <div className="table-responsive">
                <table className="users-table">
                  <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Registered</th></tr></thead>
                  <tbody>
                    {MOCK_REGISTERED_USERS.map(u => (
                      <tr key={u.id}>
                        <td><code>{u.id}</code></td>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className={`role-badge role-${u.role.toLowerCase()}`}>{u.role}</span></td>
                        <td>{u.created}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ============================================================
          PRODUCTS SECTION
          ============================================================ */}
      <section id="products-section" className="swadeshi-trending-products">
        {/* Toolbar */}
        <div className="products-toolbar">
          <div className="section-title-wrap">
            <h2>Trending Indian Creations</h2>
            <p>Showing {filteredProducts.length} products
              {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
              {selectedState !== 'All' ? ` from ${selectedState}` : ''}
              {searchQuery ? ` matching "${searchQuery}"` : ''}
            </p>
          </div>
          <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
            {(selectedCategory !== 'All' || selectedState !== 'All' || searchQuery) && (
              <button className="clear-all-filters-btn"
                onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}>
                Reset Filters ×
              </button>
            )}
            <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {pagedProducts.length === 0 ? (
          <div className="no-products-fallback">
            <span className="fallback-icon">🏺</span>
            <h3>No Products Match Your Criteria</h3>
            <p>Try resetting your filters to explore more handcrafted goods.</p>
            <button className="btn btn-terracotta"
              onClick={() => { setSelectedCategory('All'); setSelectedState('All'); setSearchQuery(''); }}>
              View All Creations
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {pagedProducts.map(product => (
              <div className="product-card" key={product.id}>
                <div className="product-image-frame" onClick={() => setQuickViewProduct(product)}>
                  <img src={product.img} alt={product.name} loading="lazy" />
                  <div className="product-card-badges">
                    <span className="badge-origin-label">📍 {product.state}</span>
                    {product.isSustainable && <span className="badge-sustainable-leaf">🌿 Eco</span>}
                  </div>
                </div>
                <div className="product-card-info">
                  <div className="product-brand-line">
                    <span className="brand-name">{product.brand}</span>
                    <span className="craft-type-tag">{product.craftType}</span>
                  </div>
                  <h3 onClick={() => setQuickViewProduct(product)}>{product.name}</h3>
                  <div className="product-rating-row">
                    <span className="rating-stars">{'★'.repeat(Math.floor(product.rating))} ({product.rating})</span>
                    {product.isMSME && <span className="badge-msme-support">👥 MSME</span>}
                  </div>
                  <div className="product-card-footer">
                    <span className="product-card-price">₹{product.price.toLocaleString('en-IN')}</span>
                    <div className="product-card-actions">
                      <button
                        className={`btn-wishlist-toggle ${wishlist.includes(product.id) ? 'active' : ''}`}
                        onClick={() => toggleWishlist(product.id)}
                        title="Add to Favorites">
                        {wishlist.includes(product.id) ? '❤️' : '🤍'}
                      </button>
                      <button className="btn btn-terracotta btn-sm" onClick={() => addToCart(product)}>
                        Add to Bag
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-row">
            <button className="page-btn page-btn-nav"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`page-btn ${currentPage === n ? 'active' : ''}`}
                onClick={() => { setCurrentPage(n); scrollToProducts(); }}>
                {n}
              </button>
            ))}
            <button className="page-btn page-btn-nav"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}>
              Next →
            </button>
          </div>
        )}
      </section>

      {/* ============================================================
          FESTIVAL SHOWCASE
          ============================================================ */}
      <section id="festival-section" className="swadeshi-festival-showcase">
        <div className="section-header text-center">
          <h2>🪔 Shubh Utsav Festival Picks</h2>
          <p>Specially curated collections to bring joy, light, and heritage tradition to your home.</p>
        </div>
        <div className="festival-banners-grid">
          <div className="fest-banner-card festival-diwali">
            <div className="fest-overlay">
              <span className="fest-badge">Deepavali Collection</span>
              <h3>Festival of Lights & Luxury</h3>
              <p>Hand-poured ghee diyas, pure brass puja thalis, and gold-thread Banarasi silk sarees.</p>
              <button className="btn btn-outline-white" onClick={() => { setSelectedCategory('Home Decor'); scrollToProducts(); }}>Browse Diwali Picks</button>
            </div>
          </div>
          <div className="fest-banner-card festival-pongal">
            <div className="fest-overlay">
              <span className="fest-badge">Sankranti & Pongal</span>
              <h3>Harvest & Handlooms</h3>
              <p>Traditional brass cookware, raw terracotta servers, and hand-woven Kasavu from Kerala.</p>
              <button className="btn btn-outline-white" onClick={() => { setSelectedState('Kerala'); scrollToProducts(); }}>Explore Southern Harvest</button>
            </div>
          </div>
          <div className="fest-banner-card festival-raksha">
            <div className="fest-overlay">
              <span className="fest-badge">Raksha Bandhan</span>
              <h3>Sacred Threads of Jute & Seed</h3>
              <p>Organic cotton plant-seeded eco-rakhis and handcrafted wooden sweet hampers.</p>
              <button className="btn btn-outline-white" onClick={() => { setSelectedCategory('Handicrafts'); scrollToProducts(); }}>Explore Eco-Rakhis</button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          BENEFITS
          ============================================================ */}
      <section className="swadeshi-benefits">
        <div className="section-header text-center">
          <h2>Why Choose ShopEZ Swadeshi</h2>
          <p>We connect you directly to the roots of Indian heritage, guaranteeing fair trade and authenticity.</p>
        </div>
        <div className="benefits-grid">
          {[
            ['👥','Support Local Businesses','Over 80% of sales value flows directly to artisan clusters and MSME units, securing rural livelihoods.'],
            ['🛡️','Authentic Heritage Products','Every handloom carries a certified Origin label verifying geographic authenticity.'],
            ['🎨','Generational Craft Quality','Items constructed using age-old ancestral techniques passed down through generations.'],
            ['🌱','Eco-Friendly & Sustainable','All items use organic materials, natural colours, and environment-friendly packaging.'],
          ].map(([icon,title,desc]) => (
            <div key={title} className="benefit-card">
              <span className="benefit-icon">{icon}</span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          ARTISAN SPOTLIGHT
          ============================================================ */}
      <section className="artisan-spotlight-section">
        <div className="artisan-spotlight-wrapper">
          <div className="artisan-graphics">
            <div className="artisan-avatar-frame">
              <img src={u('1580330070416-9b9e825b2f63')} alt="Artisan Meera Bai" style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <span className="spotlight-tag">Artisan of the Week</span>
          </div>
          <div className="artisan-details-text">
            <span className="artisan-origin-badge">Jaipur, Rajasthan</span>
            <h2>Meera Bai</h2>
            <h3>5th Generation Master Blue Potter</h3>
            <blockquote className="artisan-quote">
              "We paint cobalt designs by hand under the light of early morning. Because we do not use clay, our pottery survives centuries without cracking. Reviving this craft saved our community and feeds 40 families."
            </blockquote>
            <p className="artisan-narrative-paragraph">
              Meera Bai is one of the few remaining masters of Jaipur's heritage blue pottery, reviving the Mughal-era glaze recipes that use mineral paints like cobalt oxide and copper. Every vase she creates takes 14 days of meticulous sculpting, baking, and hand-painting.
            </p>
            <button className="btn btn-terracotta" onClick={() => { setSelectedState('Rajasthan'); scrollToProducts(); }}>
              Shop Meera's Creations
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIALS
          ============================================================ */}
      <section className="swadeshi-testimonials">
        <div className="section-header text-center">
          <h2>Stories from Our Community</h2>
          <p>What our patrons say about their journey to discover Indian luxury.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <span className="quote-mark">"</span>
            <p>"The sheer weight and breathability of the Chanderi saree I ordered is phenomenal. You can immediately tell it was woven by a master artisan, not rolled off an industrial powerloom."</p>
            <div className="client-info"><strong>Aditi Sharma</strong><span>New Delhi • Verified Patron</span></div>
          </div>
          <div className="testimonial-card">
            <span className="quote-mark">"</span>
            <p>"I love the complete origin labelling. Reading the Know Your Craft history on the Blue Pottery vase let me explain the cultural heritage of the piece to my guests. Outstanding."</p>
            <div className="client-info"><strong>Karan Johar</strong><span>Mumbai • Art Collector</span></div>
          </div>
          <div className="testimonial-card">
            <span className="quote-mark">"</span>
            <p>"The Eladi facial cream is a sensory masterpiece. Its saffron fragrance is incredibly soothing. Knowing it supports rural farming clusters in Kerala makes it even more special."</p>
            <div className="client-info"><strong>Dr. Ananya Iyer</strong><span>Bengaluru • Dermatologist</span></div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="swadeshi-footer">
        <div className="footer-container">
          <div className="footer-brand-info">
            <h3>ShopEZ Swadeshi</h3>
            <p>Celebrating India's finest heritage craft, handloom, and organic botanical legacy. Handcrafted with pride for the world.</p>
            <span className="footer-copyright">© {new Date().getFullYear()} ShopEZ Swadeshi Private Ltd. All Rights Reserved.</span>
          </div>
          <div className="footer-links-grid">
            <div className="footer-column">
              <h4>Heritage Categories</h4>
              <ul>
                {['Handloom Weaves','Tribal Handicrafts','Botanical Ayurveda','Artisanal Decor'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="footer-column">
              <h4>State Guilds</h4>
              <ul>
                {['Jaipur Potters','Kerala Herb Guilds','Chanderi Weavers','Bastar Metal Casting'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <ul>
                {['MSME Certification Info','Fair Wages Policy','Sustainable Sourcing Guide','Grievance Cell'].map(l => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </footer>

      {/* ============================================================
          CART DRAWER
          ============================================================ */}
      {isCartOpen && (
        <div className="drawer-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="drawer-panel animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Shopping Bag 💼</h3>
              <button className="close-drawer-btn" onClick={() => setIsCartOpen(false)}>×</button>
            </div>
            <div className="drawer-content">
              {cart.length === 0 ? (
                <div className="empty-drawer-state">
                  <span className="empty-icon">🛒</span>
                  <p>Your shopping bag is empty.</p>
                  <button className="btn btn-terracotta" onClick={() => { setIsCartOpen(false); scrollToProducts(); }}>Explore Indian Crafts</button>
                </div>
              ) : (
                <div className="drawer-items-list">
                  {cart.map(item => (
                    <div className="drawer-item-card" key={item.product.id}>
                      <div className="drawer-item-thumbnail">
                        <img src={item.product.img} alt={item.product.name} />
                      </div>
                      <div className="drawer-item-details">
                        <h4>{item.product.name}</h4>
                        <span className="drawer-item-brand">{item.product.brand}</span>
                        <div className="drawer-item-qty-row">
                          <div className="qty-selector">
                            <button onClick={() => updateCartQty(item.product.id, -1)}>−</button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQty(item.product.id, 1)}>+</button>
                          </div>
                          <span className="drawer-item-price">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <strong>₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
                <p className="cart-notice">👥 Your purchase supports local artisans & MSMEs directly.</p>
                <button className="btn btn-terracotta btn-block" onClick={() => { setCart([]); setIsCartOpen(false); triggerToast('Checkout successful! Namaste. 🙏'); }}>
                  Secure Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          WISHLIST DRAWER
          ============================================================ */}
      {isWishlistOpen && (
        <div className="drawer-overlay" onClick={() => setIsWishlistOpen(false)}>
          <div className="drawer-panel animate-slide-left" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>My Favorites ❤️</h3>
              <button className="close-drawer-btn" onClick={() => setIsWishlistOpen(false)}>×</button>
            </div>
            <div className="drawer-content">
              {wishlist.length === 0 ? (
                <div className="empty-drawer-state">
                  <span className="empty-icon">❤️</span>
                  <p>No favorites saved yet.</p>
                </div>
              ) : (
                <div className="drawer-items-list">
                  {wishlist.map(id => {
                    const p = PRODUCTS_DATA.find(x => x.id === id);
                    if (!p) return null;
                    return (
                      <div className="drawer-item-card" key={p.id}>
                        <div className="drawer-item-thumbnail"><img src={p.img} alt={p.name} /></div>
                        <div className="drawer-item-details">
                          <h4>{p.name}</h4>
                          <span className="drawer-item-brand">{p.brand}</span>
                          <span className="drawer-item-price">₹{p.price.toLocaleString('en-IN')}</span>
                          <div className="wishlist-action-links">
                            <button className="link-btn-terracotta" onClick={() => { addToCart(p); toggleWishlist(p.id); }}>Move to Bag</button>
                            <button className="link-btn-grey" onClick={() => toggleWishlist(p.id)}>Remove</button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          LOGIN MODAL
          ============================================================ */}
      {isLoginOpen && (
        <div className="modal-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="modal-card animate-zoom-in" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setIsLoginOpen(false)}>×</button>
            <div className="modal-header">
              <span className="modal-header-icon">🪔</span>
              <h2>Welcome to ShopEZ Swadeshi</h2>
              <p>Sign in to access your custom collections and artisan registry.</p>
            </div>
            <form onSubmit={handleMockLogin} className="modal-form">
              <div className="form-group">
                <label htmlFor="modal-email-input">Email Address</label>
                <input id="modal-email-input" type="email" placeholder="name@example.com"
                  value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label htmlFor="modal-password-input">Password</label>
                <input id="modal-password-input" type="password" placeholder="••••••••"
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              </div>

              {/* Autofill buttons for quick testing */}
              <div style={{display:'flex',gap:'10px'}}>
                <button type="button" id="autofill-admin-btn"
                  className="btn btn-outline-maroon btn-sm"
                  style={{flex:1}}
                  onClick={() => { setLoginEmail('admin@shopez-swadeshi.gov.in'); setLoginPassword('Admin@123'); }}>
                  Autofill Admin
                </button>
                <button type="button" id="autofill-customer-btn"
                  className="btn btn-outline-maroon btn-sm"
                  style={{flex:1}}
                  onClick={() => { setLoginEmail('patron@swadeshi.in'); setLoginPassword('User@123'); }}>
                  Autofill Customer
                </button>
              </div>

              <button type="submit" id="login-submit-btn" className="btn btn-terracotta btn-block">Sign In</button>
            </form>
            <div className="modal-footer-mock text-center">
              <p>Enter any email and password — or use the autofill buttons above.</p>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          QUICK VIEW / KNOW YOUR CRAFT MODAL
          ============================================================ */}
      {quickViewProduct && (
        <div className="modal-overlay" onClick={() => setQuickViewProduct(null)}>
          <div className="modal-card craft-details-modal animate-zoom-in" onClick={e => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setQuickViewProduct(null)}>×</button>
            <div className="craft-modal-grid">
              <div className="craft-modal-visual">
                <img src={quickViewProduct.img} alt={quickViewProduct.name} />
                <div className="craft-origin-seal">
                  <span>Made in</span>
                  <strong>{quickViewProduct.state}</strong>
                </div>
              </div>
              <div className="craft-modal-text">
                <div className="craft-badges-row">
                  <span className="origin-label-badge">📍 {quickViewProduct.state} · {quickViewProduct.craftType}</span>
                  {quickViewProduct.isSustainable && <span className="sustainable-leaf-badge">🌿 Sustainable Choice</span>}
                </div>
                <h2>{quickViewProduct.name}</h2>
                <div className="craft-brand-rating">
                  <span className="craft-brand-sub">By <strong>{quickViewProduct.brand}</strong></span>
                  <span className="rating-stars">{'★'.repeat(Math.floor(quickViewProduct.rating))} ({quickViewProduct.rating})</span>
                </div>
                <div className="craft-modal-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</div>
                <div className="know-your-craft-panel">
                  <h4>🌾 Know Your Craft</h4>
                  <p>{quickViewProduct.history}</p>
                </div>
                <div className="craft-info-table">
                  <div className="info-table-row">
                    <span>Authentic Materials</span>
                    <strong>{quickViewProduct.materials}</strong>
                  </div>
                  <div className="info-table-row">
                    <span>Artisan Source</span>
                    <strong>{quickViewProduct.artisan}</strong>
                  </div>
                  {quickViewProduct.isMSME && (
                    <div className="info-table-row msme-verified-row">
                      <span>MSME Support</span>
                      <strong>👥 Generates Local Employment</strong>
                    </div>
                  )}
                </div>
                <div className="craft-modal-ctas">
                  <button className="btn btn-terracotta" onClick={() => { addToCart(quickViewProduct); setQuickViewProduct(null); }}>
                    Add to Shopping Bag
                  </button>
                  <button
                    className={`btn btn-outline-maroon ${wishlist.includes(quickViewProduct.id) ? 'active' : ''}`}
                    onClick={() => toggleWishlist(quickViewProduct.id)}>
                    {wishlist.includes(quickViewProduct.id) ? '❤️ In Favorites' : '♡ Add to Favorites'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
