<h1 align="center">🏺 Artisan's Haven</h1>

<p align="center">
A Premium Handcrafted E-Commerce Platform — Built for Local Artisans
</p>

<p align="center">
<img src="https://img.shields.io/badge/HTML5-Structure-E34F26?style=for-the-badge&logo=html5">
<img src="https://img.shields.io/badge/CSS3-Styling-1572B6?style=for-the-badge&logo=css3">
<img src="https://img.shields.io/badge/JavaScript-Logic-F7DF1E?style=for-the-badge&logo=javascript">
<img src="https://img.shields.io/badge/EmailJS-Contact_Form-red?style=for-the-badge">
<img src="https://img.shields.io/badge/LocalStorage-Cart_Persistence-brightgreen?style=for-the-badge">
<img src="https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel">
<img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>

<p align="center">
<img src="https://readme-typing-svg.herokuapp.com/?font=Playfair+Display&size=26&center=true&vCenter=true&width=800&lines=Artisan's+Haven;Where+Every+Piece+Tells+a+Story;Handcrafted+with+Soul;Supporting+Local+Artisans+Across+Pakistan">
</p>

---

# 🚀 Live Platform

| Environment | Link |
|---|---|
| 🌐 Live App | https://artisans-haven.vercel.app |
| 📂 Repository | https://github.com/Salman-Sensei/artisans-haven |

---

# 📖 About Artisan's Haven

**Artisan's Haven** is a premium, fully responsive e-commerce website built to showcase and sell unique handcrafted products made by skilled local artisans across Pakistan.

Instead of generic online stores, Artisan's Haven delivers:

- A **premium shopping experience** with real product images
- **Smooth animations** and a custom cursor for a luxury feel
- **Real email delivery** via EmailJS when customers contact the store
- **Persistent cart** that survives page refreshes using localStorage
- A **fully working review system** where customers can rate and review products

Every piece on this platform carries the soul of its maker — unique, sustainable, and built to last.

---

# ✨ Platform Features

## 🛍️ Shopping Experience

| Feature | Description |
|---|---|
| 🏺 Product Grid | 12 handcrafted products with real Unsplash images |
| 🔍 Live Search | Search by name, category or artisan in real time |
| 🏷️ Filter & Sort | Filter by Featured, Best Sellers, Sale, New Arrivals |
| 📂 Category Pills | Filter by Pottery, Textiles, Gifts, Décor, Jewellery and more |
| 👁️ Quick View | Modal popup with full product specs, care instructions & qty picker |
| ❤️ Wishlist | Add/remove products from wishlist with toast notifications |

---

## 🛒 Cart System

| Feature | Description |
|---|---|
| 🛒 Add to Cart | Add any product with quantity control |
| 💾 localStorage | Cart persists across page refreshes automatically |
| ➕➖ Qty Control | Increase or decrease item quantity inside cart panel |
| 🗑️ Remove Items | Remove individual items from cart |
| 💰 Live Totals | Subtotal, discount and total calculated in real time |
| 🔒 Checkout | Simulated secure checkout flow with confirmation toast |

---

## ⭐ Reviews & Ratings

| Feature | Description |
|---|---|
| ⭐ Rating Summary | Overall 4.8 star rating with animated bar chart |
| 💬 Customer Reviews | 5 pre-loaded real-looking customer reviews |
| ✍️ Write a Review | Fully validated review form with interactive star picker |
| 👍 Helpful Votes | Mark reviews as helpful with live counter |
| 🎨 Animated Bars | Rating bars animate into view on scroll |

---

## 📬 Contact & EmailJS Integration

| Feature | Description |
|---|---|
| 📧 Real Email Delivery | Contact form sends actual emails via EmailJS |
| ✅ Form Validation | All fields validated before sending |
| ⏳ Loading State | Button shows spinner while email is sending |
| 📬 Gmail Integration | Emails delivered directly to skbkhan31@gmail.com |
| 🔄 Auto-Reply Ready | EmailJS template supports auto-reply setup |

---

## 🎨 Design & Animations

| Feature | Description |
|---|---|
| 🖱️ Custom Cursor | Terracotta dot with smooth lagging ring effect |
| 📜 Scroll Progress | Gradient progress bar at top of page |
| ✨ Particle Canvas | 130 floating particles in the hero background |
| 🔤 Letter Animation | Hero headline animates character by character |
| 👀 Scroll Reveals | Every section slides in smoothly on scroll |
| 🃏 3D Card Tilt | Product cards tilt in 3D following mouse position |
| 💫 Ripple Effects | Click ripples on every button |
| 🎞️ Marquee Strip | Animated category marquee scrolling continuously |
| 🔢 Counters | Hero stats count up from 0 on scroll into view |
| 🍞 Toast Notifications | Beautiful toast for every user action |
| 📱 Fully Responsive | Mobile, tablet and desktop optimized |

---

# 👩‍🎨 Featured Artisans

| Artisan | Specialty | Products |
|---|---|---|
| Fatima Malik | 🏺 Master Potter | 24 Products |
| Raza Ahmed | 🧵 Textile Weaver | 18 Products |
| Tariq Hussain | 🪵 Wood Carver | 15 Products |
| Zara Siddiqui | 🕯️ Candle Maker | 12 Products |
| Nadia Khan | 💎 Jewellery Artisan | 20 Products |

---

# 🧰 Tech Stack

### 🎨 Frontend
- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, transitions, responsive grid
- **Vanilla JavaScript** — All logic, DOM manipulation, state management

### 📧 Email Integration
- **EmailJS** — Real contact form email delivery (no backend needed)
  - Service: Gmail
  - Template variables: `{{from_name}}`, `{{from_email}}`, `{{phone}}`, `{{subject}}`, `{{message}}`

### 💾 Data Persistence
- **localStorage** — Cart items saved and restored on every page load

### 🎭 Animations & Effects
- **Canvas API** — Hero particle system
- **IntersectionObserver API** — Scroll-triggered reveals
- **CSS Keyframes** — Marquee, float, pulse, ripple, fade animations
- **requestAnimationFrame** — Smooth cursor ring tracking

### ☁️ Deployment
- **Vercel** — Automatic deployment from GitHub
- **GitHub** — Source control and version management

### 🖼️ Images
- **Unsplash API** — Real high-quality product and artisan photos
- **Fallback Emojis** — Emoji fallbacks if any image fails to load

---

# ⚙️ EmailJS Setup

To enable real email delivery from the contact form:

### Step 1 — Create Free Account
Go to [emailjs.com](https://www.emailjs.com) and sign up for free (200 emails/month free)

### Step 2 — Connect Gmail Service
Dashboard → **"Add New Service"** → Choose **Gmail** → Connect your Gmail account → Copy the **Service ID**

### Step 3 — Create Email Template
Dashboard → **"Email Templates"** → **"Create New Template"** → Set up body:
```
Name:    {{from_name}}
Email:   {{from_email}}
Phone:   {{phone}}
Subject: {{subject}}
Message: {{message}}
```
Save → Copy the **Template ID**

### Step 4 — Get Public Key
Dashboard → **"Account"** → Copy your **Public Key**

### Step 5 — Add Keys to Code
Open `index.html` → find these lines and paste your keys:
```javascript
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';
```

---

# 🚀 Deployment Guide

### Deploy to Vercel via GitHub

**Step 1** — Create a new GitHub repository named `artisans-haven`

**Step 2** — Upload `index.html` to the repository

**Step 3** — Go to [vercel.com](https://vercel.com) → Sign up with GitHub

**Step 4** — Click **"Add New Project"** → Import `artisans-haven`

**Step 5** — Click **"Deploy"** — your site goes live in ~30 seconds! 🚀

**Every future update:** Edit `index.html` on GitHub → Vercel auto-redeploys instantly ♻️

---

# 🗺️ Future Roadmap

Planned improvements for Artisan's Haven:

- 🔥 Firebase backend for real product database
- 💳 JazzCash / Easypaisa payment integration
- 📦 Real order tracking system
- 👤 Customer account & order history
- 📱 Progressive Web App (PWA) for mobile install
- 🌍 Multi-language support (Urdu / English)
- 📊 Admin dashboard for artisans to manage products
- 🤖 AI-powered product recommendations
- 📸 Multiple product images with gallery slider

---

# 📁 Project Structure

```
artisans-haven/
│
└── index.html          # Complete website — HTML + CSS + JS in one file
    │
    ├── CSS Sections
    │   ├── Variables & Reset
    │   ├── Custom Cursor
    │   ├── Header & Navigation
    │   ├── Hero Section
    │   ├── Product Grid & Cards
    │   ├── Cart Panel
    │   ├── Product Modal
    │   ├── Reviews Section
    │   ├── Contact Form
    │   ├── Newsletter
    │   └── Footer
    │
    └── JavaScript Sections
        ├── Product Data (12 products)
        ├── Custom Cursor Logic
        ├── Hero Canvas Particles
        ├── Scroll Reveal Observer
        ├── 3D Card Tilt
        ├── Cart + localStorage
        ├── Wishlist
        ├── Product Filters & Sort
        ├── Quick View Modal
        ├── Reviews & Star Picker
        ├── EmailJS Contact Form
        └── Toast Notifications
```

---

# 🤝 Contributing

Contributions, issues and feature requests are welcome!

### Contribution Workflow

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push the branch
5. Create a Pull Request

### Example

```bash
git checkout -b feature/new-feature
git commit -m "Add new feature"
git push origin feature/new-feature
```

---

# 📄 License

This project is distributed under the **MIT License**.

You are free to use, modify, and distribute this software under the terms of the license.

---

# 👨‍💻 Developer

**Salman Khan**

🎓 Enrollment No: **02-1311232-121**

📧 Email
skbkhan31@gmail.com

💼 LinkedIn
[https://www.linkedin.com/in/salmankhan-developer/](https://www.linkedin.com/in/salmankhan-developer/)

🐙 GitHub
[https://github.com/Salman-Sensei](https://github.com/Salman-Sensei)

---

# ⭐ Support the Project

If you like **Artisan's Haven**, consider supporting:

- ⭐ Star the repository
- 🍴 Fork the project
- 🛠️ Contribute improvements
- 📢 Share with others

<p align="center">
<strong>Every purchase supports a real craftsperson. 🤝</strong>
</p>

<p align="center">
Made with ❤️ in Karachi, Pakistan 🇵🇰
</p>
