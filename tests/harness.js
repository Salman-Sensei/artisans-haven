// Loads a site (original single file OR refactored multi-file) into jsdom.
// Black-box: tests only use DOM (ids/classes/clicks), so the same tests run on both versions.
import jsdom from 'jsdom';
const { JSDOM, ResourceLoader, VirtualConsole } = jsdom;
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const ORIGIN = 'http://localhost/';

// Serves http://localhost/<path> from the site's folder (so relative <script src>/<link href> work
// while localStorage still has a real origin). Every other URL (CDN fonts, FontAwesome, EmailJS,
// Unsplash) is blocked so tests are offline and deterministic.
class SiteLoader extends ResourceLoader {
  constructor(root) { super(); this.root = root; }
  fetch(url) {
    if (!url.startsWith(ORIGIN)) return null;
    const rel = decodeURIComponent(new URL(url).pathname.slice(1));
    return fs.promises.readFile(path.join(this.root, rel));
  }
}

export async function loadSite(htmlPath, { storage = {} } = {}) {
  const sent = [];
  const errors = [];
  const vc = new VirtualConsole();
  vc.on('jsdomError', (e) => errors.push(e.message));
  vc.on('error', (e) => errors.push(String(e)));

  const abs = path.resolve(htmlPath);
  const dom = new JSDOM(fs.readFileSync(abs, 'utf8'), {
    url: ORIGIN, runScripts: 'dangerously',
    resources: new SiteLoader(path.dirname(abs)),
    pretendToBeVisual: true,
    virtualConsole: vc,
    beforeParse(win) {
      for (const [k, v] of Object.entries(storage)) win.localStorage.setItem(k, v);
      win.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
      win.HTMLCanvasElement.prototype.getContext = () => ({
        clearRect() {}, beginPath() {}, arc() {}, fill() {}, fillStyle: '',
      });
      win.scrollTo = () => {};
      win.emailjs = {
        init() {},
        send(service, template, params) {
          sent.push({ service, template, params });
          return win.__emailFail ? Promise.reject(new Error('x')) : Promise.resolve({ status: 200 });
        },
      };
    },
  });
  // wait for load event (local scripts executed)
  await new Promise((r) => {
    if (dom.window.document.readyState === 'complete') r();
    else dom.window.addEventListener('load', r);
  });
  return { dom, win: dom.window, doc: dom.window.document, sent, errors };
}

export const $ = (doc, s) => doc.querySelector(s);
export const $$ = (doc, s) => [...doc.querySelectorAll(s)];
export const setVal = (doc, id, v) => { doc.getElementById(id).value = v; };
export const click = (el) => el.dispatchEvent(new el.ownerDocument.defaultView.MouseEvent('click', { bubbles: true, cancelable: true }));
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// Site under test: the index.html one folder up (override with SITE=/path/to/index.html)
export const TARGET = process.env.SITE || fileURLToPath(new URL('../index.html', import.meta.url));
