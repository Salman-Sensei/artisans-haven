/* ==========================================================================
   Artisan's Haven — application logic
   Depends on js/data.js (CONFIG, PRODUCTS, INIT_REVIEWS, NAV_LINKS, ...).

   Structure
     1. Utilities            (DOM helpers, escaping, formatting)
     2. State
     3. Toast
     4. Product catalogue    (filters, sorting, rendering)
     5. Cart                 (pure totals + storage + UI)
     6. Wishlist & modal
     7. Reviews
     8. Forms                (validation, EmailJS, newsletter)
     9. Navigation & static content builders
    10. Visual effects       (cursor, particles, headline, reveal, tilt, counters)
    11. Event delegation     (single click handler for all data-action elements)
    12. Init
   ========================================================================== */
(function () {
  'use strict';

  /* ======================================================================
     1. UTILITIES
     ====================================================================== */
  const $ = (id) => document.getElementById(id);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^[+\d\s\-()]{7,15}$/;

  function escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  const formatPrice = (amount) => `Rs ${amount.toLocaleString()}`;
  const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`;
  const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
  const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

  /* ======================================================================
     2. STATE
     ====================================================================== */
  const state = {
    cart: [], // [{ id, qty }] — product details are looked up from PRODUCTS
    wishlist: [],
    category: 'All',
    filter: 'all',
    sort: 'default',
    reviews: INIT_REVIEWS.map((r) => ({ ...r, voted: false })),
    starRating: 0,
  };

  /* ======================================================================
     3. TOAST
     ====================================================================== */
  const TOAST_ICONS = { success: 'check-circle', error: 'exclamation-circle' };

  function showToast(message, type = '') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icon = document.createElement('i');
    icon.className = `fas fa-${TOAST_ICONS[type] || 'bell'}`;
    toast.append(icon, ` ${message}`); // text node: message is never parsed as HTML

    $('toast-container').appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'toastOut .4s ease forwards';
      setTimeout(() => toast.remove(), CONFIG.toastExitMs);
    }, CONFIG.toastDurationMs);
  }

  /* ======================================================================
     4. PRODUCT CATALOGUE
     ====================================================================== */
  function starsHTML(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) html += '<i class="fas fa-star"></i>';
      else if (rating >= i - 0.5) html += '<i class="fas fa-star-half-alt"></i>';
      else html += '<i class="far fa-star"></i>';
    }
    return html;
  }

  const FILTER_PREDICATES = {
    all: () => true,
    featured: (p) => p.featured,
    bestseller: (p) => p.badge === 'bestseller',
    sale: (p) => p.discount > 0,
    new: (p) => p.isNew,
  };

  const SORTERS = {
    default: null,
    'price-low': (a, b) => a.price - b.price,
    'price-high': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    newest: (a, b) => b.isNew - a.isNew,
    popular: (a, b) => b.reviews - a.reviews,
  };

  function matchesSearch(product, query) {
    return [product.name, product.category, product.artisan].some((field) =>
      field.toLowerCase().includes(query)
    );
  }

  /** Pure: returns the products to show for a given view state. */
  function selectProducts({ category, filter, sort, query }) {
    let list = PRODUCTS.filter((p) => category === 'All' || p.category === category);
    list = list.filter(FILTER_PREDICATES[filter] || FILTER_PREDICATES.all);
    if (query) list = list.filter((p) => matchesSearch(p, query));
    const sorter = SORTERS[sort];
    if (sorter) list = [...list].sort(sorter);
    return list;
  }

  function productCardHTML(p) {
    const inWishlist = state.wishlist.includes(p.id);
    const badge = p.badge ? `<span class="badge-pill ${p.badge}">${BADGE_LABELS[p.badge] || BADGE_LABELS.sale}</span>` : '';
    const discount = p.discount ? `<span class="badge-pill sale">-${p.discount}%</span>` : '';
    const wasPrice = p.originalPrice ? `<span class="price-was">${formatPrice(p.originalPrice)}</span>` : '';
    const saveNote = p.discount ? `<span class="price-save">💚 Save ${p.discount}%</span>` : '';

    return `
    <div class="product-card reveal">
      <div class="prod-img-wrap">
        <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}" loading="lazy"/>
        <div class="prod-fallback">${p.emoji}</div>
        <div class="prod-badges">${badge}${discount}</div>
        <button class="prod-wish ${inWishlist ? 'active' : ''}" data-action="toggle-wishlist" data-id="${p.id}" title="${inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">
          <i class="${inWishlist ? 'fas' : 'far'} fa-heart"></i>
        </button>
        <div class="prod-hover-bar" data-action="open-modal" data-id="${p.id}">
          👁️&nbsp; Quick View
        </div>
      </div>
      <div class="prod-body">
        <div class="prod-cat">${p.emoji} ${escapeHTML(p.category)}</div>
        <div class="prod-name">${escapeHTML(p.name)}</div>
        <div class="prod-artisan"><i class="fas fa-user-circle"></i>&nbsp; by ${escapeHTML(p.artisan)}</div>
        <div class="prod-stars"><div class="stars">${starsHTML(p.rating)}</div><span class="rev-count">&nbsp;(${p.reviews})</span></div>
        <div class="prod-pricing">
          <span class="price-now">${formatPrice(p.price)}</span>${wasPrice}${saveNote}
        </div>
        <button class="btn-add" data-action="add-to-cart" data-id="${p.id}" data-ripple>
          <div class="ba-inner"><i class="fas fa-shopping-bag"></i> Add to Cart</div>
        </button>
      </div>
    </div>`;
  }

  function renderProducts() {
    const products = selectProducts({
      category: state.category,
      filter: state.filter,
      sort: state.sort,
      query: $('searchInput').value.toLowerCase().trim(),
    });

    $('productCount').textContent = `Showing ${pluralize(products.length, 'product')}`;
    $('productsGrid').innerHTML = products.length
      ? products.map(productCardHTML).join('')
      : `<div class="no-results"><i class="fas fa-search"></i><h3>😕 No products found</h3><p>Try adjusting your search or filters.</p></div>`;

    $$('.product-card.reveal').forEach((el) => revealObserver.observe(el));
  }

  function setCategory(category) {
    state.category = category;
    $$('.cat-pill').forEach((pill) => pill.classList.toggle('active', pill.dataset.category === category));
    renderProducts();
  }

  function setFilter(filter, button) {
    state.filter = filter;
    $$('.filter-tag').forEach((tag) => tag.classList.toggle('active', tag === button));
    renderProducts();
  }

  /* ======================================================================
     5. CART
     ====================================================================== */
  /** Pure: subtotal / discount / total for a cart of {id, qty}. */
  function calculateTotals(cart) {
    let subtotal = 0;
    let discount = 0;
    let count = 0;
    cart.forEach(({ id, qty }) => {
      const p = findProduct(id);
      subtotal += p.price * qty;
      discount += p.originalPrice ? (p.originalPrice - p.price) * qty : 0;
      count += qty;
    });
    return { subtotal, discount, total: subtotal, count };
  }

  function saveCart() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state.cart));
    } catch (err) {
      console.warn('localStorage unavailable', err);
    }
  }

  function clearSavedCart() {
    try {
      localStorage.removeItem(CONFIG.storageKey);
    } catch (err) {
      /* storage unavailable — nothing to clear */
    }
  }

  function loadSavedCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey) || '[]');
      state.cart = saved
        .filter(({ id, qty }) => findProduct(id) && Number.isInteger(qty) && qty > 0)
        .map(({ id, qty }) => ({ id, qty }));
    } catch (err) {
      console.warn('Could not restore cart', err);
      state.cart = [];
      return;
    }
    if (state.cart.length) {
      const { count } = calculateTotals(state.cart);
      showToast(`🛒 Cart restored — ${pluralize(count, 'item')} waiting for you!`, 'success');
    }
  }

  function addToCart(id, qty = 1) {
    const product = findProduct(id);
    const existing = state.cart.find((item) => item.id === id);
    if (existing) existing.qty += qty;
    else state.cart.push({ id, qty });
    commitCart();
    showToast(`${product.emoji} ${product.name} added to cart!`, 'success');
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((item) => item.id !== id);
    commitCart();
  }

  function changeQty(id, delta) {
    const item = state.cart.find((x) => x.id === id);
    if (!item) return;
    item.qty = Math.max(1, item.qty + delta);
    commitCart();
  }

  /** Save + redraw — the one place cart mutations finish. */
  function commitCart() {
    saveCart();
    renderCart();
  }

  function cartItemHTML({ id, qty }) {
    const p = findProduct(id);
    return `
    <div class="cart-item">
      <div class="cart-img">
        <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}"/>
        <div class="cart-emoji-fb">${p.emoji}</div>
      </div>
      <div class="cart-info">
        <div class="cart-name">${p.emoji} ${escapeHTML(p.name)}</div>
        <div class="cart-by">✍️ by ${escapeHTML(p.artisan)}</div>
        <div class="cart-bottom">
          <div class="cart-qty">
            <button class="ciq-btn" data-action="cart-qty" data-id="${id}" data-delta="-1"><i class="fas fa-minus"></i></button>
            <span class="ciq-n">${qty}</span>
            <button class="ciq-btn" data-action="cart-qty" data-id="${id}" data-delta="1"><i class="fas fa-plus"></i></button>
          </div>
          <span class="cart-price">${formatPrice(p.price * qty)}</span>
          <button class="cart-rm" data-action="cart-remove" data-id="${id}" title="Remove"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    </div>`;
  }

  function renderCart() {
    const { subtotal, discount, total, count } = calculateTotals(state.cart);
    const isEmpty = state.cart.length === 0;

    const badge = $('cartBadge');
    badge.style.display = count > 0 ? 'flex' : 'none';
    badge.textContent = count > CONFIG.maxBadgeCount ? `${CONFIG.maxBadgeCount}+` : count;

    $('cartEmpty').style.display = isEmpty ? 'block' : 'none';
    $('cartFooter').style.display = isEmpty ? 'none' : 'block';
    $('cartItems').innerHTML = state.cart.map(cartItemHTML).join('');

    $('cSub').textContent = formatPrice(subtotal);
    $('cDisc').textContent = `-${formatPrice(discount)}`;
    $('cTotal').textContent = formatPrice(total);
  }

  function toggleCart() {
    $('cartPanel').classList.toggle('open');
    $('cartOverlay').classList.toggle('open');
  }

  function checkout() {
    showToast('🔒 Processing your order…', 'success');
    setTimeout(() => {
      state.cart = [];
      clearSavedCart();
      renderCart();
      toggleCart();
      showToast('🎉 Order placed! Thank you so much, we will contact you soon!', 'success');
    }, CONFIG.checkoutDelayMs);
  }

  /* ======================================================================
     6. WISHLIST & QUICK-VIEW MODAL
     ====================================================================== */
  function toggleWishlist(id, button) {
    const product = findProduct(id);
    const wasWishlisted = state.wishlist.includes(id);

    state.wishlist = wasWishlisted ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
    showToast(
      wasWishlisted ? '💔 Removed from wishlist' : `❤️ ${product.name} added to wishlist!`,
      wasWishlisted ? '' : 'success'
    );

    // update just this button instead of re-rendering the whole grid
    button.classList.toggle('active', !wasWishlisted);
    button.title = wasWishlisted ? 'Add to wishlist' : 'Remove from wishlist';
    button.querySelector('i').className = `${wasWishlisted ? 'far' : 'fas'} fa-heart`;
  }

  function modalHTML(p) {
    const specs = Object.entries(p.specs)
      .map(([k, v]) => `<div class="spec-item"><div class="spec-key">${escapeHTML(k)}</div><div class="spec-val">${escapeHTML(v)}</div></div>`)
      .join('');
    const wasPrice = p.originalPrice ? `<s>${formatPrice(p.originalPrice)}</s>` : '';

    return `
    <div class="modal-img">
      <img src="${escapeHTML(p.img)}" alt="${escapeHTML(p.name)}"/>
      <div class="modal-emoji-fb">${p.emoji}</div>
    </div>
    <div class="modal-details">
      <div class="prod-cat" style="margin-top:0">${p.emoji} ${escapeHTML(p.category)}</div>
      <h2>${escapeHTML(p.name)}</h2>
      <div class="modal-artisan"><i class="fas fa-user-circle icon-terra"></i>&nbsp; Crafted by <strong>${escapeHTML(p.artisan)}</strong></div>
      <div class="modal-stars-row"><div class="stars">${starsHTML(p.rating)}</div><span style="font-size:13px;color:var(--muted);margin-left:6px">(${p.reviews} reviews)</span></div>
      <div class="modal-price">${formatPrice(p.price)} ${wasPrice}</div>
      <p class="modal-desc">${escapeHTML(p.description)}</p>
      <div class="specs-title">📋 Specifications</div>
      <div class="specs-grid">${specs}</div>
      <div class="qty-row">
        <div class="qty-ctrl">
          <button class="qty-btn" data-action="modal-qty" data-delta="-1">−</button>
          <div class="qty-disp" id="mqty">1</div>
          <button class="qty-btn" data-action="modal-qty" data-delta="1">+</button>
        </div>
        <button class="btn btn-primary modal-add" data-action="modal-add" data-id="${p.id}">🛒 Add to Cart</button>
      </div>
      <div class="care-note"><i class="fas fa-info-circle"></i>&nbsp;<div><strong>🧹 Care Instructions:</strong> ${escapeHTML(p.care)}</div></div>
    </div>`;
  }

  function openModal(id) {
    $('modalInner').innerHTML = modalHTML(findProduct(id));
    $('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    $('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
  }

  const modalQty = () => Number($('mqty').textContent);
  function changeModalQty(delta) {
    $('mqty').textContent = Math.max(1, modalQty() + delta);
  }

  /* ======================================================================
     7. REVIEWS
     ====================================================================== */
  function reviewHTML(r, index) {
    return `
    <div class="review-card">
      <div class="rv-hd">
        <div class="rv-user">
          <div class="rv-av">${escapeHTML(r.av)}</div>
          <div><div class="rv-name">${escapeHTML(r.name)}</div><div class="rv-date">📅 ${escapeHTML(r.date)}</div></div>
        </div>
        <span class="rv-prod">${escapeHTML(r.product)}</span>
      </div>
      <div class="rv-stars">${starsHTML(r.rating)}</div>
      <div class="rv-title">💬 ${escapeHTML(r.title)}</div>
      <div class="rv-text">${escapeHTML(r.text)}</div>
      <div class="rv-helpful"><span>Helpful? 👍</span>
        <button class="helpful-btn" data-action="helpful" data-index="${index}" ${r.voted ? 'disabled style="background:var(--clay2)"' : ''}><i class="fas fa-thumbs-up"></i> Yes (${r.helpful})</button>
      </div>
    </div>`;
  }

  function renderReviews() {
    $('reviewsList').innerHTML = state.reviews.map(reviewHTML).join('');
  }

  function markHelpful(index, button) {
    const review = state.reviews[index];
    review.helpful++;
    review.voted = true;
    button.innerHTML = `<i class="fas fa-thumbs-up"></i> Yes (${review.helpful})`;
    button.style.background = 'var(--clay2)';
    button.disabled = true;
  }

  /* --- star picker --- */
  const starIcons = () => $$('#starPicker i');

  function paintStars(upTo, hoverColor) {
    starIcons().forEach((star, i) => {
      star.style.color = i < upTo ? hoverColor : 'var(--clay)';
    });
  }

  function setRating(value) {
    state.starRating = value;
    $('rev-rating').value = value;
    starIcons().forEach((star, i) => star.classList.toggle('active', i < value));
    $('rating-err').style.display = value > 0 ? 'none' : 'block';
  }

  function resetStarPicker() {
    state.starRating = 0;
    $('rev-rating').value = 0;
    starIcons().forEach((star) => {
      star.classList.remove('active');
      star.style.color = 'var(--clay)';
    });
  }

  function initStarPicker() {
    starIcons().forEach((star, i) => {
      star.addEventListener('click', () => setRating(i + 1));
      star.addEventListener('mouseenter', () => paintStars(i + 1, 'var(--gold)'));
    });
    $('starPicker').addEventListener('mouseleave', () => paintStars(state.starRating, 'var(--gold)'));
  }

  /* ======================================================================
     8. FORMS — validation, reviews, contact (EmailJS), newsletter
     ====================================================================== */
  /**
   * Validates a list of rules and toggles error classes on every field
   * (no short-circuit, so all errors show at once). Returns true if all pass.
   */
  function validate(rules) {
    return rules
      .map(({ field, group, test }) => {
        const input = $(field);
        const valid = test(input.value);
        $(group).classList.toggle('has-error', !valid);
        input.classList.toggle('error', !valid);
        return valid;
      })
      .every(Boolean);
  }

  const rules = {
    name: (field, group) => ({ field, group, test: (v) => v.trim().length >= 2 }),
    email: (field, group) => ({ field, group, test: (v) => EMAIL_RE.test(v) }),
    required: (field, group) => ({ field, group, test: (v) => v !== '' }),
    minLength: (field, group, min) => ({ field, group, test: (v) => v.trim().length >= min }),
  };

  const clearFields = (ids) => ids.forEach((id) => { $(id).value = ''; });

  function submitReview() {
    const fieldsOk = validate([
      rules.name('rev-name', 'fg-name'),
      rules.email('rev-email', 'fg-email'),
      rules.required('rev-product', 'fg-product'),
      rules.minLength('rev-title', 'fg-title', 3),
      rules.minLength('rev-text', 'fg-review', CONFIG.minReviewLength),
    ]);
    const ratingOk = state.starRating > 0;
    $('rating-err').style.display = ratingOk ? 'none' : 'block';

    if (!fieldsOk || !ratingOk) {
      showToast('⚠️ Please fix the errors above.', 'error');
      return;
    }

    state.reviews.unshift({
      name: $('rev-name').value.trim(),
      av: randomItem(AVATARS),
      date: 'Just now ✨',
      product: $('rev-product').value,
      rating: state.starRating,
      title: $('rev-title').value.trim(),
      text: $('rev-text').value.trim(),
      helpful: 0,
      voted: false,
    });
    renderReviews();
    clearFields(['rev-name', 'rev-email', 'rev-title', 'rev-text', 'rev-product']);
    resetStarPicker();
    showToast('🌟 Thank you for your review!', 'success');
  }

  const CONTACT_FIELDS = ['cf-name', 'cf-email', 'cf-phone', 'cf-message', 'cf-subject'];
  const SEND_BUTTON_HTML = '<i class="fas fa-paper-plane"></i> 📤 Send Message';

  function collectContactParams() {
    const email = $('cf-email').value.trim();
    return {
      from_name: $('cf-name').value.trim(),
      from_email: email,
      phone: $('cf-phone').value.trim() || 'Not provided',
      subject: $('cf-subject').value,
      message: $('cf-message').value.trim(),
      reply_to: email,
    };
  }

  function setSending(button, sending) {
    button.disabled = sending;
    button.innerHTML = sending ? '<i class="fas fa-spinner fa-spin"></i> Sending…' : SEND_BUTTON_HTML;
  }

  function submitContact() {
    const rulesList = [
      rules.name('cf-name', 'cfg-name'),
      rules.email('cf-email', 'cfg-email'),
      rules.required('cf-subject', 'cfg-subject'),
      rules.minLength('cf-message', 'cfg-message', CONFIG.minReviewLength),
    ];
    if ($('cf-phone').value.trim()) {
      rulesList.push({ field: 'cf-phone', group: 'cfg-phone', test: (v) => PHONE_RE.test(v) });
    }
    if (!validate(rulesList)) {
      showToast('⚠️ Please fill in all required fields.', 'error');
      return;
    }

    const params = collectContactParams();
    const button = document.querySelector('.form-submit');
    const { publicKey, serviceId, templateId } = CONFIG.emailjs;

    if (typeof emailjs === 'undefined') {
      showToast(`❌ Failed to send. Please email us directly at ${CONFIG.contactEmail}`, 'error');
      return;
    }

    setSending(button, true);
    emailjs
      .send(serviceId, templateId, params, { publicKey })
      .then(() => {
        clearFields(CONTACT_FIELDS);
        showToast('📬 Message sent! We will reply within 24 hours. ✅', 'success');
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showToast(`❌ Failed to send. Please try emailing us directly at ${CONFIG.contactEmail}`, 'error');
      })
      .finally(() => setSending(button, false));
  }

  function subscribeNewsletter() {
    const input = $('nlEmail');
    if (!EMAIL_RE.test(input.value.trim())) {
      showToast('⚠️ Please enter a valid email.', 'error');
      return;
    }
    input.value = '';
    showToast("💌 You're subscribed! Welcome to the Haven family.", 'success');
  }

  /* ======================================================================
     9. NAVIGATION & STATIC CONTENT BUILDERS
     ====================================================================== */
  function toggleMenu() {
    $('mobileMenu').classList.toggle('open');
    $('hamburger').classList.toggle('active');
  }

  function setActiveNav(link) {
    $$('.nav-link').forEach((l) => l.classList.remove('active'));
    link.classList.add('active');
  }

  function renderNavigation() {
    const link = (item, action, extraClass = '') =>
      `<a href="${item.href}" class="nav-link ${extraClass}" data-action="${action}"${item.category ? ` data-category="${item.category}"` : ''}>${item.label}</a>`;

    $('desktopNav').innerHTML = NAV_LINKS
      .map((item, i) => link(item, 'nav-desktop', i === 0 ? 'active' : ''))
      .join('');
    $('mobileMenu').innerHTML = NAV_LINKS.map((item) => link(item, 'nav-mobile')).join('');
  }

  function renderCategoryPills() {
    $('catScroll').innerHTML = CATEGORIES.map(
      (c, i) =>
        `<button class="cat-pill ${i === 0 ? 'active' : ''}" data-action="category" data-category="${c.value}"><div class="cp-inner"><span>${c.icon}</span> ${c.label}</div></button>`
    ).join('');
  }

  function renderReviewProductOptions() {
    $('rev-product').insertAdjacentHTML(
      'beforeend',
      PRODUCTS.map((p) => `<option>${escapeHTML(`${p.emoji} ${p.name}`)}</option>`).join('')
    );
  }

  /** Marquees scroll seamlessly, so their content is rendered twice. */
  function renderMarquees() {
    const twice = (items) => [...items, ...items];
    $('tbTrack').innerHTML = twice(TOPBAR_MESSAGES)
      .map((html) => `<div class="tb-item">${html}</div><span class="tb-sep">|</span>`)
      .join('');
    $('mqTrack').innerHTML = twice(MARQUEE_ITEMS)
      .map((text) => `<div class="mq-item"><span class="mq-dot"></span>${escapeHTML(text)}</div>`)
      .join('');
  }

  /* ======================================================================
     10. VISUAL EFFECTS
     ====================================================================== */
  /* --- reveal on scroll --- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  function initReveal() {
    $$('.reveal, .reveal-l, .reveal-r').forEach((el) => revealObserver.observe(el));
  }

  /* --- animated rating bars --- */
  function initRatingBars() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          $$('.rb-fill', entry.target).forEach((bar) => { bar.style.width = bar.dataset.w; });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );
    $$('.reviews-summary').forEach((el) => observer.observe(el));
  }

  /* --- hero counters --- */
  function animateCounter(el) {
    const target = Number(el.dataset.target);
    const step = target / CONFIG.counterSteps;
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = `${Math.floor(current).toLocaleString()}+`;
      if (current >= target) clearInterval(timer);
    }, CONFIG.counterIntervalMs);
  }

  function initCounters() {
    const stats = document.querySelector('.hero-stats');
    if (!stats) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        observer.disconnect();
        $$('.counter').forEach(animateCounter);
      },
      { threshold: 0.5 }
    );
    observer.observe(stats);
  }

  /* --- custom cursor --- */
  function initCursor() {
    const dot = $('cursor');
    const ring = $('cursor-ring');
    const RING_LAG = 0.12;
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    (function followMouse() {
      ringX += (mouseX - ringX) * RING_LAG;
      ringY += (mouseY - ringY) * RING_LAG;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(followMouse);
    })();
  }

  /* --- scroll progress, header shadow, back-to-top --- */
  function initScrollEffects() {
    window.addEventListener('scroll', () => {
      const scrollable = Math.max(1, document.body.scrollHeight - window.innerHeight);
      $('scroll-prog').style.width = `${(window.scrollY / scrollable) * 100}%`;
      $('header').classList.toggle('scrolled', window.scrollY > CONFIG.scrolledOffsetPx);
      $('scrollTop').classList.toggle('visible', window.scrollY > CONFIG.scrollTopOffsetPx);
    }, { passive: true });
  }

  /* --- hero particle canvas --- */
  function initParticles() {
    const canvas = $('hero-canvas');
    const ctx = canvas.getContext('2d');
    const COLORS = ['rgba(232,196,160,', 'rgba(196,98,45,', 'rgba(201,168,74,', 'rgba(107,124,94,'];
    let width, height;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles = Array.from({ length: CONFIG.particleCount }, () => ({
      x: Math.random() * (width || 1400),
      y: Math.random() * (height || 900),
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35 - 0.15,
      color: randomItem(COLORS),
      alpha: Math.random() * 0.45 + 0.1,
    }));

    (function draw() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    })();
  }

  /* --- hero headline: letter-by-letter entrance --- */
  function initHeadline() {
    const lines = [['Where', 'Every', 'Piece'], ['Tells', 'a', 'Story']];
    const ACCENT_WORDS = ['a', 'Story'];
    const CHAR_DELAY = 0.03;
    const container = $('heroHeadline');
    let delay = 0;

    lines.forEach((words, lineIndex) => {
      const row = document.createElement('div');
      row.className = 'hl-row';
      words.forEach((word) => {
        const wordEl = document.createElement('span');
        wordEl.className = 'hl-word';
        [...word].forEach((char) => {
          const charEl = document.createElement('span');
          charEl.className = 'hl-char';
          if (lineIndex === 1 && ACCENT_WORDS.includes(word)) charEl.classList.add('hl-accent');
          charEl.textContent = char;
          charEl.style.animationDelay = `${delay.toFixed(2)}s`;
          wordEl.appendChild(charEl);
          delay += CHAR_DELAY;
        });
        row.appendChild(wordEl);
      });
      container.appendChild(row);
    });
  }

  /* --- 3D card tilt (throttled to one update per frame) --- */
  function initCardTilt() {
    const TILT_DEG = 6;
    const REACH = 1.4;
    let pending = null;

    document.addEventListener('mousemove', (e) => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = null;
        $$('.product-card').forEach((card) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          card.style.transform = Math.hypot(dx, dy) < REACH
            ? `perspective(800px) rotateY(${dx * TILT_DEG}deg) rotateX(${-dy * TILT_DEG}deg) translateY(-5px)`
            : '';
        });
      });
    }, { passive: true });
  }

  /* --- button ripple --- */
  function rippleEffect(e, el) {
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    Object.assign(ripple.style, {
      width: `${size}px`,
      height: `${size}px`,
      left: `${e.clientX - rect.left - size / 2}px`,
      top: `${e.clientY - rect.top - size / 2}px`,
      position: 'absolute',
    });
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  }

  /* --- image fallback: replaces every inline onerror="" --- */
  function handleImageError(e) {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (img.dataset.fallbackText) img.parentElement.textContent = img.dataset.fallbackText;
    else if (img.dataset.fallback === 'hide') img.style.display = 'none';
    else img.parentElement.classList.add('img-failed'); // CSS swaps in the emoji sibling
  }

  /* ======================================================================
     11. EVENT DELEGATION — one listener for every [data-action] element
     ====================================================================== */
  const actions = {
    'toggle-cart': () => toggleCart(),
    checkout: () => checkout(),
    'scroll-top': () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    'toggle-menu': () => toggleMenu(),
    'close-modal': () => closeModal(),
    'close-modal-overlay': (el, e) => { if (e.target === el) closeModal(); },
    category: (el) => setCategory(el.dataset.category),
    'filter-tag': (el) => setFilter(el.dataset.filter, el),
    'nav-desktop': (el) => {
      if (el.dataset.category) setCategory(el.dataset.category);
      setActiveNav(el);
    },
    'nav-mobile': (el) => {
      if (el.dataset.category) setCategory(el.dataset.category);
      toggleMenu();
    },
    'add-to-cart': (el) => addToCart(Number(el.dataset.id)),
    'toggle-wishlist': (el, e) => { e.stopPropagation(); toggleWishlist(Number(el.dataset.id), el); },
    'open-modal': (el) => openModal(Number(el.dataset.id)),
    'modal-qty': (el) => changeModalQty(Number(el.dataset.delta)),
    'modal-add': (el) => { addToCart(Number(el.dataset.id), modalQty()); closeModal(); },
    'cart-qty': (el) => changeQty(Number(el.dataset.id), Number(el.dataset.delta)),
    'cart-remove': (el) => removeFromCart(Number(el.dataset.id)),
    helpful: (el) => markHelpful(Number(el.dataset.index), el),
    'submit-review': () => submitReview(),
    'submit-contact': () => submitContact(),
    subscribe: () => subscribeNewsletter(),
  };

  function initEvents() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (el && actions[el.dataset.action]) actions[el.dataset.action](el, e);

      const rippleTarget = e.target.closest('[data-ripple]');
      if (rippleTarget) rippleEffect(e, rippleTarget);
    });

    $('searchInput').addEventListener('input', renderProducts);
    $('sortSelect').addEventListener('change', (e) => {
      state.sort = e.target.value;
      renderProducts();
    });

    // 'error' doesn't bubble, so listen in the capture phase
    document.addEventListener('error', handleImageError, true);

    // Images that already failed while the page was still parsing fired their
    // 'error' event before this script ran — handle those now.
    $$('img').forEach((img) => {
      if (img.complete && img.naturalWidth === 0) handleImageError({ target: img });
    });
  }

  /* ======================================================================
     12. INIT
     ====================================================================== */
  function init() {
    renderMarquees();
    renderNavigation();
    renderCategoryPills();
    renderReviewProductOptions();

    initEvents();
    initStarPicker();
    initCursor();
    initScrollEffects();
    initParticles();
    initHeadline();
    initCounters();
    initRatingBars();
    initReveal();
    initCardTilt();

    renderProducts();
    renderReviews();
    loadSavedCart();
    renderCart();
  }

  init();
})();
