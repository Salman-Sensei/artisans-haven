/* ==========================================================================
   Artisan's Haven — static data & configuration
   Loaded before js/main.js. Plain data only: no DOM access, no side effects.
   ========================================================================== */
'use strict';

/* ---------- Configuration (magic values live here) ---------- */
const CONFIG = Object.freeze({
  storageKey: 'artisans_haven_cart',
  contactEmail: 'skbkhan31@gmail.com',
  emailjs: Object.freeze({
    publicKey: 'ZzUQkXyQ6AZp5n0l0',
    serviceId: 'service_ml5esxt',
    templateId: 'template_i8wfe0t',
  }),
  toastDurationMs: 3500,
  toastExitMs: 400,
  checkoutDelayMs: 1800,
  scrolledOffsetPx: 60,
  scrollTopOffsetPx: 400,
  minReviewLength: 20,
  particleCount: 130,
  counterSteps: 60,
  counterIntervalMs: 25,
  maxBadgeCount: 9,
});

/* ---------- Navigation & category config (single source for desktop + mobile menus) ---------- */
const NAV_LINKS = [
  { href: '#home', label: '🏠 Home' },
  { href: '#products', label: '🛍️ All Products' },
  { href: '#products', label: '🏺 Pottery', category: 'Pottery' },
  { href: '#products', label: '🧵 Textiles', category: 'Textiles' },
  { href: '#products', label: '🎁 Gifts', category: 'Gifts' },
  { href: '#products', label: '🪴 Décor', category: 'Décor' },
  { href: '#artisans', label: '👩‍🎨 Artisans' },
  { href: '#reviews', label: '⭐ Reviews' },
  { href: '#contact', label: '📬 Contact' },
];

const CATEGORIES = [
  { value: 'All', icon: '✨', label: 'All Items' },
  { value: 'Pottery', icon: '🏺', label: 'Pottery' },
  { value: 'Textiles', icon: '🧵', label: 'Textiles' },
  { value: 'Gifts', icon: '🎁', label: 'Gifts' },
  { value: 'Décor', icon: '🪴', label: 'Décor' },
  { value: 'Jewellery', icon: '💎', label: 'Jewellery' },
  { value: 'Wood', icon: '🪵', label: 'Woodcraft' },
  { value: 'Candles', icon: '🕯️', label: 'Candles' },
  { value: 'Baskets', icon: '🧺', label: 'Baskets' },
];

const TOPBAR_MESSAGES = [
  '<span>🎁</span> Free shipping on orders over <b>Rs 3,000</b>',
  'Use code <b>HAVEN10</b> for 10% off your first order <span>🏷️</span>',
  '<span>🤝</span> Supporting <b>45+ local artisans</b> across Pakistan',
  '<span>✨</span> Every piece is <b>one-of-a-kind</b> &amp; handmade',
];

const MARQUEE_ITEMS = [
  '🏺 Pottery & Ceramics', '🧵 Woven Textiles', '💎 Handcrafted Jewellery', '🪴 Home Décor',
  '🎁 Personalised Gifts', '🪵 Woodcraft', '🕯️ Artisan Candles', '🧺 Woven Baskets',
];

const BADGE_LABELS = {
  bestseller: '🔥 Best Seller',
  featured: '⭐ Featured',
  new: '🆕 New',
  sale: '🏷️ Sale',
};

const AVATARS = ['👩', '🧑', '👨', '👩‍🦱', '👩‍🦰', '🧓', '👦', '👧'];

/* ---------- Catalogue ---------- */
const PRODUCTS = [
  {id:1,name:"Terracotta Vase Set",category:"Pottery",artisan:"Fatima Malik",
   img:"https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&h=600&fit=crop&q=80",
   emoji:"🏺",price:2800,originalPrice:3500,discount:20,rating:4.9,reviews:48,badge:"bestseller",
   description:"A stunning trio of hand-thrown terracotta vases, each uniquely shaped on the wheel. Rich earthy tones and natural imperfections celebrate the beauty of handcraft.",
   specs:{Material:"Terracotta Clay",Dimensions:"15/22/30 cm",Weight:"1.2 kg",Finish:"Matte glaze"},
   care:"Wipe with a damp cloth. Not dishwasher safe.",isNew:false,featured:true},
  {id:2,name:"Hand-loomed Kilim Rug",category:"Textiles",artisan:"Raza Ahmed",
   img:"https://images.unsplash.com/photo-1600166898405-da9535204843?w=600&h=600&fit=crop&q=80",
   emoji:"🎨",price:12500,originalPrice:null,discount:0,rating:4.8,reviews:32,badge:"featured",
   description:"A vibrant flat-weave rug crafted on a traditional wooden loom using hand-spun wool. Geometric patterns drawn from centuries of South Asian weaving tradition.",
   specs:{Material:"100% Wool",Dimensions:"120×180 cm",Weight:"2.8 kg",Wash:"Dry clean"},
   care:"Dry clean recommended. Rotate periodically.",isNew:false,featured:true},
  {id:3,name:"Macramé Wall Hanging",category:"Décor",artisan:"Nadia Khan",
   img:"https://images.unsplash.com/photo-1594040226829-7f251ab46d80?w=600&h=600&fit=crop&q=80",
   emoji:"🧵",price:1950,originalPrice:2400,discount:19,rating:4.7,reviews:67,badge:"sale",
   description:"An intricate macramé wall hanging knotted by hand using natural cotton rope. A statement piece bringing bohemian warmth to any interior.",
   specs:{Material:"Natural Cotton",Dimensions:"40×75 cm",Weight:"380 g",Mounting:"Driftwood included"},
   care:"Keep away from direct moisture.",isNew:false,featured:false},
  {id:4,name:"Carved Mango Wood Bowl",category:"Wood",artisan:"Tariq Hussain",
   img:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=600&h=600&fit=crop&q=80",
   emoji:"🪵",price:3200,originalPrice:null,discount:0,rating:4.9,reviews:21,badge:"new",
   description:"Hand-carved from a single piece of sustainably harvested mango wood. No two bowls are identical — the grain pattern is nature's own signature.",
   specs:{Material:"Mango Wood",Dimensions:"Ø28 cm, H9 cm",Weight:"680 g",Finish:"Food-safe oil"},
   care:"Hand wash only. Re-oil every few months.",isNew:true,featured:false},
  {id:5,name:"Indigo Block-print Cushion",category:"Textiles",artisan:"Raza Ahmed",
   img:"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=600&fit=crop&q=80",
   emoji:"🧶",price:1400,originalPrice:1800,discount:22,rating:4.6,reviews:89,badge:"sale",
   description:"A cotton cushion cover block-printed by hand using a carved wooden stamp dipped in natural indigo dye. Intentional variation proves human hands were here.",
   specs:{Material:"100% Cotton",Dimensions:"45×45 cm",Closure:"Envelope back",Wash:"Machine wash cold"},
   care:"Machine wash cold. Tumble dry low.",isNew:false,featured:false},
  {id:6,name:"Beeswax Pillar Candle Set",category:"Candles",artisan:"Zara Siddiqui",
   img:"https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&h=600&fit=crop&q=80",
   emoji:"🕯️",price:1100,originalPrice:null,discount:0,rating:4.8,reviews:54,badge:"bestseller",
   description:"Three pillar candles hand-poured from pure, sustainably sourced beeswax. Soft honey scent, burns up to 40 hours each.",
   specs:{Material:"100% Beeswax",Dimensions:"5×12 cm each","Burn Time":"~40 hrs",Scent:"Natural honey"},
   care:"Trim wick to 5mm before lighting.",isNew:false,featured:true},
  {id:7,name:"Silver Filigree Earrings",category:"Jewellery",artisan:"Nadia Khan",
   img:"https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&h=600&fit=crop&q=80",
   emoji:"💎",price:3800,originalPrice:4500,discount:16,rating:5.0,reviews:28,badge:"featured",
   description:"Delicate drop earrings crafted using the ancient art of silver filigree — fine silver wire twisted and soldered into intricate lace-like patterns.",
   specs:{Material:"Sterling Silver",Weight:"4 g/pair",Fitting:"Hypoallergenic",Dimensions:"3.5 cm drop"},
   care:"Store in airtight bag. Polish with silver cloth.",isNew:false,featured:true},
  {id:8,name:"Coiled Grass Basket",category:"Baskets",artisan:"Fatima Malik",
   img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=600&fit=crop&q=80",
   emoji:"🧺",price:1750,originalPrice:null,discount:0,rating:4.7,reviews:43,badge:"new",
   description:"A storage basket woven from dried sweetgrass using the traditional coil technique. Lightweight yet strong.",
   specs:{Material:"Sweetgrass & Cotton",Dimensions:"Ø30 cm, H20 cm",Weight:"240 g",Closure:"None"},
   care:"Dust with dry cloth. Avoid soaking.",isNew:true,featured:false},
  {id:9,name:"Ceramic Espresso Set",category:"Pottery",artisan:"Fatima Malik",
   img:"https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=600&fit=crop&q=80",
   emoji:"☕",price:4200,originalPrice:5000,discount:16,rating:4.8,reviews:36,badge:"featured",
   description:"A set of four hand-thrown espresso cups with matching saucers, individually fired in a wood kiln — subtle colour variations in each glaze.",
   specs:{Material:"Stoneware Clay",Dimensions:"Ø6 cm, H5 cm",Capacity:"80 ml",Dishwasher:"Safe"},
   care:"Dishwasher safe on gentle cycle.",isNew:false,featured:true},
  {id:10,name:"Hand-painted Dhurrie",category:"Textiles",artisan:"Raza Ahmed",
   img:"https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=600&h=600&fit=crop&q=80",
   emoji:"🖼️",price:8900,originalPrice:11000,discount:19,rating:4.9,reviews:15,badge:"sale",
   description:"A flat-woven cotton dhurrie with a bold floral pattern painted by hand using natural dyes. Light for layering, durable for daily use.",
   specs:{Material:"Cotton & Natural Dyes",Dimensions:"90×150 cm",Weight:"1.4 kg",Wash:"Cold gentle"},
   care:"Wash alone cold. Air dry flat.",isNew:false,featured:false},
  {id:11,name:"Copper Wind Chime",category:"Décor",artisan:"Tariq Hussain",
   img:"https://images.unsplash.com/photo-1595435742656-5272d0b3fa82?w=600&h=600&fit=crop&q=80",
   emoji:"🔔",price:2100,originalPrice:null,discount:0,rating:4.6,reviews:22,badge:"new",
   description:"Hand-hammered copper tubes suspended on a knotted cotton cord. Tuned to produce a soothing pentatonic melody in the breeze.",
   specs:{Material:"Hammered Copper",Dimensions:"15×55 cm",Weight:"320 g",Tubes:"6 tuned"},
   care:"Polish with copper cloth. Covered outdoor use.",isNew:true,featured:false},
  {id:12,name:"Stone Mortar & Pestle",category:"Gifts",artisan:"Tariq Hussain",
   img:"https://images.unsplash.com/photo-1542528180-1c2803fa048c?w=600&h=600&fit=crop&q=80",
   emoji:"🪨",price:2600,originalPrice:3200,discount:19,rating:4.9,reviews:61,badge:"bestseller",
   description:"Hewn from a single block of volcanic basalt. Heavy-bottomed, rough-textured for efficient grinding of spices and herbs.",
   specs:{Material:"Basalt Stone",Dimensions:"Ø15 cm, H8 cm",Weight:"2.1 kg",Origin:"Himalayan Foothills"},
   care:"Rinse with water only. Season before first use.",isNew:false,featured:true},
];

const INIT_REVIEWS = [
  {name:"Amna Tariq",av:"👩",date:"2 days ago",product:"🏺 Terracotta Vase Set",rating:5,title:"Absolutely breathtaking craftsmanship!",text:"I ordered the terracotta set as a housewarming gift and the recipient was speechless. The weight, texture, earthy tones — it looks like it belongs in an interior design magazine. Packaging was impeccable too.",helpful:12},
  {name:"Omar Shaikh",av:"🧑",date:"1 week ago",product:"🎨 Hand-loomed Kilim Rug",rating:5,title:"Worth every rupee and more",text:"This rug transformed our living room. Colours even more vibrant in person. My whole family keeps complimenting it. You can feel the heart in it. Will be ordering again!",helpful:9},
  {name:"Sana Bashir",av:"👩‍🦱",date:"2 weeks ago",product:"💎 Silver Filigree Earrings",rating:5,title:"The most delicate jewellery I own",text:"I wore these to a wedding and got at least 10 compliments. The filigree work is extraordinary. They feel very secure despite looking so delicate.",helpful:7},
  {name:"Bilal Asif",av:"👨",date:"3 weeks ago",product:"☕ Ceramic Espresso Set",rating:4,title:"Beautiful and functional",text:"These cups are gorgeous. Love the earthy imperfection in each glaze. Minor note: one cup had a slightly smaller handle, but it doesn't affect use. Very satisfied overall.",helpful:5},
  {name:"Hina Qureshi",av:"👩‍🦰",date:"1 month ago",product:"🧵 Macramé Wall Hanging",rating:5,title:"My living room centrepiece!",text:"I've been looking for this for months. The cotton feels premium and the knotwork is incredibly even. Arrived with a handwritten card from the artisan. That personal touch made my day.",helpful:14},
];
