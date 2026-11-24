import { describe, it, expect, beforeEach } from 'vitest';
import { loadSite, $, $$, setVal, click, sleep, TARGET } from './harness.js';

let s, doc, win;
beforeEach(async () => {
  s = await loadSite(TARGET);
  doc = s.doc; win = s.win;
});

const cards = () => $$(doc, '#productsGrid .product-card');
const addBtn = (i) => cards()[i].querySelector('.btn-add');
const cartCount = () => $$(doc, '#cartItems .cart-item').length;
const names = () => cards().map((c) => c.querySelector('.prod-name').textContent);
const prices = () => cards().map((c) => +c.querySelector('.price-now').textContent.replace(/[^\d]/g, ''));
const cat = (label) => $$(doc, '.cat-pill').find((b) => b.textContent.includes(label));
const tag = (label) => $$(doc, '.filter-tag').find((b) => b.textContent.includes(label));
const stored = () => JSON.parse(win.localStorage.getItem('artisans_haven_cart') || 'null');
const toasts = () => $$(doc, '#toast-container .toast').map((t) => t.textContent);

describe('page structure', () => {
  it('loads with no script errors', () => expect(s.errors).toEqual([]));
  it('has no Cloudflare email-obfuscation leftovers', () => {
    expect(doc.documentElement.innerHTML).not.toContain('email-protection');
    expect(doc.documentElement.innerHTML).not.toContain('[email');
  });
  it('shows plain contact email', () => expect(doc.getElementById('contact').textContent).toContain('skbkhan31@gmail.com'));
  it('keeps footer credit + LinkedIn link', () => {
    const f = $(doc, '.footer-student');
    expect(f.textContent).toContain('Salman Khan');
    expect(f.querySelector('a').href).toBe('https://www.linkedin.com/in/salmankhan-developer/');
  });
  it('renders hero headline characters', () => {
    expect($(doc, '#heroHeadline').textContent.replace(/\s/g, '')).toBe('WhereEveryPieceTellsaStory');
  });
});

describe('products', () => {
  it('renders 12 products and count label', () => {
    expect(cards()).toHaveLength(12);
    expect($(doc, '#productCount').textContent).toBe('Showing 12 products');
  });
  it('search by name / artisan / category', () => {
    setVal(doc, 'searchInput', 'kilim');
    doc.getElementById('searchInput').dispatchEvent(new win.Event('input', { bubbles: true }));
    expect(names()).toEqual(['Hand-loomed Kilim Rug']);
    setVal(doc, 'searchInput', 'tariq');
    doc.getElementById('searchInput').dispatchEvent(new win.Event('input', { bubbles: true }));
    expect(cards()).toHaveLength(3);
    setVal(doc, 'searchInput', 'candles');
    doc.getElementById('searchInput').dispatchEvent(new win.Event('input', { bubbles: true }));
    expect(names()).toEqual(['Beeswax Pillar Candle Set']);
  });
  it('shows empty state and singular count', () => {
    setVal(doc, 'searchInput', 'zzzz');
    doc.getElementById('searchInput').dispatchEvent(new win.Event('input', { bubbles: true }));
    expect($(doc, '.no-results')).not.toBeNull();
    expect($(doc, '#productCount').textContent).toBe('Showing 0 products');
    setVal(doc, 'searchInput', 'kilim');
    doc.getElementById('searchInput').dispatchEvent(new win.Event('input', { bubbles: true }));
    expect($(doc, '#productCount').textContent).toBe('Showing 1 product');
  });
  it('category pill filters', () => {
    click(cat('Pottery'));
    expect(names().sort()).toEqual(['Ceramic Espresso Set', 'Terracotta Vase Set']);
    expect(cat('Pottery').classList.contains('active')).toBe(true);
    click(cat('All Items'));
    expect(cards()).toHaveLength(12);
  });
  it('nav category link filters products', () => {
    const link = $$(doc, '.nav-menu .nav-link').find((a) => a.textContent.includes('Décor'));
    click(link);
    expect(names().sort()).toEqual(['Copper Wind Chime', 'Macramé Wall Hanging']);
    expect(link.classList.contains('active')).toBe(true);
  });
  it('filter tags: featured / bestseller / sale / new', () => {
    click(tag('Featured')); expect(cards()).toHaveLength(6);
    click(tag('Best Sellers')); expect(cards()).toHaveLength(3);
    click(tag('On Sale')); expect(cards()).toHaveLength(7);
    click(tag('New Arrivals')); expect(cards()).toHaveLength(3);
    click(tag('All')); expect(cards()).toHaveLength(12);
  });
  it('category + filter + search combine', () => {
    click(cat('Textiles')); click(tag('On Sale'));
    expect(names().sort()).toEqual(['Hand-painted Dhurrie', 'Indigo Block-print Cushion']);
  });
  it('sort low→high and high→low', () => {
    const sel = $(doc, '.sort-select');
    sel.value = 'price-low'; sel.dispatchEvent(new win.Event('change', { bubbles: true }));
    expect(prices()).toEqual([...prices()].sort((a, b) => a - b));
    sel.value = 'price-high'; sel.dispatchEvent(new win.Event('change', { bubbles: true }));
    expect(prices()).toEqual([...prices()].sort((a, b) => b - a));
  });
  it('sort by rating and popularity', () => {
    const sel = $(doc, '.sort-select');
    sel.value = 'rating'; sel.dispatchEvent(new win.Event('change', { bubbles: true }));
    expect(names()[0]).toBe('Silver Filigree Earrings');
    sel.value = 'popular'; sel.dispatchEvent(new win.Event('change', { bubbles: true }));
    expect(names()[0]).toBe('Indigo Block-print Cushion');
  });
  it('card shows discount pricing', () => {
    const c = cards()[0];
    expect(c.querySelector('.price-now').textContent).toBe('Rs 2,800');
    expect(c.querySelector('.price-was').textContent).toBe('Rs 3,500');
    expect(c.querySelector('.price-save').textContent).toContain('20%');
  });
});

describe('cart', () => {
  it('starts empty', () => {
    expect($(doc, '#cartEmpty').style.display).not.toBe('none');
    expect($(doc, '#cartFooter').style.display).toBe('none');
    expect($(doc, '#cartBadge').style.display).toBe('none');
  });
  it('adds item, updates badge, totals, toast, storage', () => {
    click(addBtn(0));
    expect(cartCount()).toBe(1);
    expect($(doc, '#cartBadge').textContent).toBe('1');
    expect($(doc, '#cartBadge').style.display).toBe('flex');
    expect($(doc, '#cSub').textContent).toBe('Rs 2,800');
    expect($(doc, '#cDisc').textContent).toBe('-Rs 700');
    expect($(doc, '#cTotal').textContent).toBe('Rs 2,800');
    expect(stored()).toEqual([{ id: 1, qty: 1 }]);
    expect(toasts().join()).toContain('added to cart');
  });
  it('adding same product twice increments qty', () => {
    click(addBtn(0)); click(addBtn(0));
    expect(cartCount()).toBe(1);
    expect($(doc, '.ciq-n').textContent).toBe('2');
    expect($(doc, '#cTotal').textContent).toBe('Rs 5,600');
  });
  it('qty +/- and minimum of 1', () => {
    click(addBtn(0));
    const [minus, plus] = $$(doc, '.ciq-btn');
    click(plus); expect($(doc, '.ciq-n').textContent).toBe('2');
    click($$(doc, '.ciq-btn')[0]); click($$(doc, '.ciq-btn')[0]); click($$(doc, '.ciq-btn')[0]);
    expect($(doc, '.ciq-n').textContent).toBe('1');
    expect(stored()).toEqual([{ id: 1, qty: 1 }]);
  });
  it('remove item empties cart', () => {
    click(addBtn(0)); click($(doc, '.cart-rm'));
    expect(cartCount()).toBe(0);
    expect($(doc, '#cartEmpty').style.display).toBe('block');
    expect(stored()).toEqual([]);
  });
  it('badge caps at 9+', () => {
    for (let i = 0; i < 10; i++) click(addBtn(0));
    expect($(doc, '#cartBadge').textContent).toBe('9+');
  });
  it('multiple products total', () => {
    click(addBtn(0)); click(addBtn(1)); // 2800 + 12500
    expect($(doc, '#cTotal').textContent).toBe('Rs 15,300');
  });
  it('toggle cart panel + overlay', () => {
    const open = () => $(doc, '#cartPanel').classList.contains('open');
    click($$(doc, '.nav-btn').find((b) => b.textContent.includes('Cart')));
    expect(open()).toBe(true);
    click($(doc, '#cartOverlay'));
    expect(open()).toBe(false);
    click($$(doc, '.nav-btn').find((b) => b.textContent.includes('Cart')));
    click($(doc, '.cart-close'));
    expect(open()).toBe(false);
  });
  it('restores cart from localStorage on load', async () => {
    const seeded = await seededLoad(TARGET, [{ id: 2, qty: 3 }, { id: 999, qty: 1 }]);
    expect($$(seeded.doc, '#cartItems .cart-item')).toHaveLength(1); // unknown id ignored
    expect($(seeded.doc, '#cartBadge').textContent).toBe('3');
    expect($(seeded.doc, '#cTotal').textContent).toBe('Rs 37,500');
    expect($$(seeded.doc, '#toast-container .toast').map((x) => x.textContent).join()).toContain('Cart restored');
  });
  it('survives corrupt localStorage', async () => {
    const seeded = await seededLoad(TARGET, '{not json', true);
    expect(seeded.errors).toEqual([]);
    expect($$(seeded.doc, '#cartItems .cart-item')).toHaveLength(0);
  });
  it('checkout clears cart and storage', async () => {
    click(addBtn(0));
    click($(doc, '.cart-checkout'));
    await sleep(1900);
    expect(cartCount()).toBe(0);
    expect(win.localStorage.getItem('artisans_haven_cart')).toBeNull();
    expect(toasts().join()).toContain('Order placed');
  });
});

async function seededLoad(htmlPath, data, raw = false) {
  const value = raw ? data : JSON.stringify(data);
  return loadSite(htmlPath, { storage: { artisans_haven_cart: value } });
}

describe('wishlist', () => {
  it('toggles heart and toasts', () => {
    click(cards()[0].querySelector('.prod-wish'));
    expect(cards()[0].querySelector('.prod-wish').classList.contains('active')).toBe(true);
    expect(toasts().join()).toContain('added to wishlist');
    click(cards()[0].querySelector('.prod-wish'));
    expect(cards()[0].querySelector('.prod-wish').classList.contains('active')).toBe(false);
    expect(toasts().join()).toContain('Removed from wishlist');
  });
  it('wishlist click does not open the modal', () => {
    click(cards()[0].querySelector('.prod-wish'));
    expect($(doc, '#modalOverlay').classList.contains('open')).toBe(false);
  });
});

describe('quick-view modal', () => {
  const open = (i = 0) => click(cards()[i].querySelector('.prod-hover-bar'));
  it('opens with product details and locks scroll', () => {
    open(0);
    expect($(doc, '#modalOverlay').classList.contains('open')).toBe(true);
    expect($(doc, '#modalInner h2').textContent).toBe('Terracotta Vase Set');
    expect($$(doc, '#modalInner .spec-item')).toHaveLength(4);
    expect(doc.body.style.overflow).toBe('hidden');
    expect($(doc, '#modalInner .care-note').textContent).toContain('Not dishwasher safe');
  });
  it('close button and overlay click close it; inner click does not', () => {
    open(0); click($(doc, '.modal')); expect($(doc, '#modalOverlay').classList.contains('open')).toBe(true);
    click($(doc, '.modal-close'));
    expect($(doc, '#modalOverlay').classList.contains('open')).toBe(false);
    expect(doc.body.style.overflow).toBe('');
    open(0); click($(doc, '#modalOverlay'));
    expect($(doc, '#modalOverlay').classList.contains('open')).toBe(false);
  });
  it('qty picker and add to cart with qty', () => {
    open(0);
    const [minus, plus] = $$(doc, '.qty-btn');
    click(plus); click($$(doc, '.qty-btn')[1]);
    expect($(doc, '#mqty').textContent).toBe('3');
    click($$(doc, '.qty-btn')[0]); click($$(doc, '.qty-btn')[0]); click($$(doc, '.qty-btn')[0]);
    expect($(doc, '#mqty').textContent).toBe('1');
    click($$(doc, '.qty-btn')[1]); click($$(doc, '.qty-btn')[1]);
    click($(doc, '.modal-add'));
    expect(stored()).toEqual([{ id: 1, qty: 3 }]);
    expect($(doc, '#modalOverlay').classList.contains('open')).toBe(false);
  });
});

describe('reviews', () => {
  const fill = (o = {}) => {
    const v = { 'rev-name': 'Ali Raza', 'rev-email': 'ali@test.com', 'rev-product': '🏺 Terracotta Vase Set', 'rev-title': 'Lovely', 'rev-text': 'This is a long enough review text.', ...o };
    for (const [k, val] of Object.entries(v)) setVal(doc, k, val);
  };
  const star = (n) => click($$(doc, '#starPicker i')[n - 1]);
  const submit = () => click($$(doc, '#writeReview .btn-primary')[0]);
  it('renders 5 seeded reviews', () => expect($$(doc, '.review-card')).toHaveLength(5));
  it('empty submit shows all errors + error toast', () => {
    submit();
    expect($$(doc, '#writeReview .has-error').length).toBeGreaterThanOrEqual(4);
    expect($(doc, '#rating-err').style.display).toBe('block');
    expect(toasts().join()).toContain('fix the errors');
    expect($$(doc, '.review-card')).toHaveLength(5);
  });
  it('rejects too-short review text (regression: original validated wrong id)', () => {
    fill({ 'rev-text': 'too short' }); star(4); submit();
    expect($(doc, '#fg-review').classList.contains('has-error')).toBe(true);
    expect($$(doc, '.review-card')).toHaveLength(5);
  });
  it('rejects bad email', () => {
    fill({ 'rev-email': 'nope' }); star(4); submit();
    expect($(doc, '#fg-email').classList.contains('has-error')).toBe(true);
  });
  it('star picker sets rating', () => {
    star(3);
    expect($$(doc, '#starPicker i.active')).toHaveLength(3);
    expect($(doc, '#rev-rating').value).toBe('3');
  });
  it('valid submit prepends review and resets form', () => {
    fill(); star(5); submit();
    const cardsNow = $$(doc, '.review-card');
    expect(cardsNow).toHaveLength(6);
    expect(cardsNow[0].querySelector('.rv-name').textContent).toBe('Ali Raza');
    expect(cardsNow[0].querySelector('.rv-title').textContent).toContain('Lovely');
    expect($(doc, '#rev-name').value).toBe('');
    expect($(doc, '#rev-rating').value).toBe('0');
    expect($$(doc, '#starPicker i.active')).toHaveLength(0);
    expect(toasts().join()).toContain('Thank you for your review');
  });
  it('helpful button increments once and disables', () => {
    const b = $(doc, '.helpful-btn');
    expect(b.textContent).toContain('(12)');
    click(b);
    expect(b.textContent).toContain('(13)');
    expect(b.disabled).toBe(true);
  });
  it('helpful vote lands on the right review after a new one is added', () => {
    fill(); star(5); submit();
    const second = $$(doc, '.helpful-btn')[1]; // formerly first (12)
    click(second);
    expect(second.textContent).toContain('(13)');
  });
});

describe('contact form (EmailJS)', () => {
  const fill = (o = {}) => {
    const v = { 'cf-name': 'Sara', 'cf-email': 'sara@test.com', 'cf-phone': '+92 345 2140357', 'cf-subject': '🏺 Product Enquiry', 'cf-message': 'Hello there, I would like to ask about a custom order.', ...o };
    for (const [k, val] of Object.entries(v)) setVal(doc, k, val);
  };
  const submit = () => click($(doc, '.form-submit'));
  it('blocks invalid input', () => {
    submit();
    expect(s.sent).toHaveLength(0);
    expect($$(doc, '.contact-form .has-error').length).toBe(4);
  });
  it('rejects bad phone but allows empty phone', () => {
    fill({ 'cf-phone': 'abc' }); submit();
    expect(s.sent).toHaveLength(0);
    expect($(doc, '#cfg-phone').classList.contains('has-error')).toBe(true);
    fill({ 'cf-phone': '' }); submit();
    expect(s.sent).toHaveLength(1);
    expect(s.sent[0].params.phone).toBe('Not provided');
  });
  it('sends with correct IDs and params, then resets', async () => {
    fill(); submit();
    expect($(doc, '.form-submit').disabled).toBe(true);
    expect(s.sent).toHaveLength(1);
    expect(s.sent[0].service).toBe('service_ml5esxt');
    expect(s.sent[0].template).toBe('template_i8wfe0t');
    expect(s.sent[0].params).toEqual({
      from_name: 'Sara', from_email: 'sara@test.com', phone: '+92 345 2140357',
      subject: '🏺 Product Enquiry', message: 'Hello there, I would like to ask about a custom order.', reply_to: 'sara@test.com',
    });
    await sleep(20);
    expect($(doc, '#cf-name').value).toBe('');
    expect($(doc, '.form-submit').disabled).toBe(false);
    expect(toasts().join()).toContain('Message sent');
  });
  it('shows error toast and re-enables button on failure', async () => {
    win.__emailFail = true; fill(); submit();
    await sleep(20);
    expect(toasts().join()).toContain('Failed to send');
    expect($(doc, '.form-submit').disabled).toBe(false);
    expect($(doc, '#cf-name').value).toBe('Sara');
  });
});

describe('newsletter', () => {
  it('rejects invalid, accepts valid and clears', () => {
    setVal(doc, 'nlEmail', 'bad'); click($(doc, '.nl-form button'));
    expect(toasts().join()).toContain('valid email');
    setVal(doc, 'nlEmail', 'ok@test.com'); click($(doc, '.nl-form button'));
    expect(toasts().join()).toContain("You're subscribed");
    expect($(doc, '#nlEmail').value).toBe('');
  });
});

describe('navigation / UI', () => {
  it('hamburger toggles mobile menu', () => {
    click($(doc, '#hamburger'));
    expect($(doc, '#mobileMenu').classList.contains('open')).toBe(true);
    expect($(doc, '#hamburger').classList.contains('active')).toBe(true);
    click($(doc, '#hamburger'));
    expect($(doc, '#mobileMenu').classList.contains('open')).toBe(false);
  });
  it('mobile category link filters and closes menu', () => {
    click($(doc, '#hamburger'));
    const link = $$(doc, '#mobileMenu .nav-link').find((a) => a.textContent.includes('Pottery'));
    click(link);
    expect(cards()).toHaveLength(2);
    expect($(doc, '#mobileMenu').classList.contains('open')).toBe(false);
  });
  it('setActive moves active class', () => {
    const l = $$(doc, '.nav-menu .nav-link').find((a) => a.textContent.includes('Reviews'));
    click(l);
    expect($$(doc, '.nav-menu .nav-link.active')).toEqual([l]);
  });
  it('toast auto-removes', async () => {
    setVal(doc, 'nlEmail', 'bad'); click($(doc, '.nl-form button'));
    expect(toasts()).toHaveLength(1);
    await sleep(4100);
    expect(toasts()).toHaveLength(0);
  }, 8000);
  it('header gets "scrolled" and scroll-top gets "visible" on scroll', () => {
    Object.defineProperty(win, 'scrollY', { value: 500, configurable: true });
    win.dispatchEvent(new win.Event('scroll'));
    expect($(doc, '#header').classList.contains('scrolled')).toBe(true);
    expect($(doc, '#scrollTop').classList.contains('visible')).toBe(true);
  });
  it('rating bars carry target widths', () => {
    expect($$(doc, '.rb-fill').map((b) => b.dataset.w)).toEqual(['74%', '18%', '5%', '2%', '1%']);
  });
  it('XSS: product text is not interpreted as HTML in review list', () => {
    setVal(doc, 'rev-name', '<img src=x id=pwn>'); setVal(doc, 'rev-email', 'a@b.co');
    setVal(doc, 'rev-product', '🏺 Terracotta Vase Set'); setVal(doc, 'rev-title', 'Title');
    setVal(doc, 'rev-text', 'x'.repeat(25));
    click($$(doc, '#starPicker i')[4]);
    click($$(doc, '#writeReview .btn-primary')[0]);
    expect(doc.getElementById('pwn')).toBeNull();
  });
});
