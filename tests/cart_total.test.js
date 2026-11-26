// Lab 9 - Task 2: unit tests for the amount calculation (calculateTotals) of Artisan's Haven.
// calculateTotals is private inside main.js (IIFE), so the test pulls its source out and runs it
// against the real PRODUCTS data from data.js. No code in the website was changed.
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataSrc = fs.readFileSync(path.join(root, 'js', 'data.js'), 'utf8');
const mainSrc = fs.readFileSync(path.join(root, 'js', 'main.js'), 'utf8');
const fnSrc = mainSrc.match(/function calculateTotals[\s\S]*?\n  }\n/)[0];

// Expected result from the requirement: total = subtotal (listed price already has the discount)
const expected = (subtotal, discount, count) => ({ subtotal, discount, total: subtotal, count });

let calculateTotals;
beforeEach(() => {
  // Arrange (shared): real catalogue + the function under test
  const find = 'const findProduct = (id) => PRODUCTS.find((p) => p.id === id);';
  calculateTotals = new Function(`${dataSrc}\n${find}\n${fnSrc}\nreturn calculateTotals;`)();
});

describe('calculateTotals - amount calculation', () => {
  it('TC-01 empty cart', () => {
    expect(calculateTotals([])).toEqual(expected(0, 0, 0));
  });
  it('TC-02 one discounted item (Terracotta Vase Set x1, Rs 2,800 was 3,500)', () => {
    const result = calculateTotals([{ id: 1, qty: 1 }]);                    // Arrange + Act
    expect(result).toEqual(expected(2800, 700, 1));                         // Assert
  });
  it('TC-03 item without discount (Kilim Rug x1)', () => {
    expect(calculateTotals([{ id: 2, qty: 1 }])).toEqual(expected(12500, 0, 1));
  });
  it('TC-04 quantity multiplies price and discount (Vase x3)', () => {
    expect(calculateTotals([{ id: 1, qty: 3 }])).toEqual(expected(8400, 2100, 3));
  });
  it('TC-05 mixed cart (Vase x1 + Rug x1 + Candle Set x2)', () => {
    const cart = [{ id: 1, qty: 1 }, { id: 2, qty: 1 }, { id: 6, qty: 2 }];
    expect(calculateTotals(cart)).toEqual(expected(17500, 700, 4));
  });
  it('TC-06 same product on two lines (Cushion 2 + 1)', () => {
    const cart = [{ id: 5, qty: 2 }, { id: 5, qty: 1 }];
    expect(calculateTotals(cart)).toEqual(expected(4200, 1200, 3));
  });
  it('TC-07 large quantity (Dhurrie x10)', () => {
    expect(calculateTotals([{ id: 10, qty: 10 }])).toEqual(expected(89000, 21000, 10));
  });
  it('TC-08 unknown product id is rejected', () => {
    expect(() => calculateTotals([{ id: 999, qty: 1 }])).toThrow();
  });
});
