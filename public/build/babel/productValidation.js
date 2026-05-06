"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nextQuantityAfterToggle = nextQuantityAfterToggle;
exports.parseQuantityDisplay = parseQuantityDisplay;
exports.validateNewProductDraft = validateNewProductDraft;
/**
 * Pure helpers for product form validation (defect 4 — data integrity / client-side checks).
 */

function parseQuantityDisplay(text) {
  var n = Number.parseInt(String(text).trim(), 10);
  return Number.isFinite(n) ? n : 0;
}
function nextQuantityAfterToggle(current, isIncrement) {
  if (isIncrement) return current + 1;
  return current > 0 ? current - 1 : 0;
}

/**
 * @param {{ title: string, location: string, category: string, quantity: number }} draft
 * @returns {{ ok: boolean, errors: string[]= }}
 */
function validateNewProductDraft(draft) {
  var errors = [];
  var title = (draft.title || "").trim();
  if (title.length < 2) errors.push("title");
  var loc = draft.location || "";
  if (!loc || loc === "none") errors.push("location");
  var cat = draft.category || "";
  if (!cat || cat === "none") errors.push("category");
  var q = typeof draft.quantity === "number" ? draft.quantity : parseQuantityDisplay(draft.quantity);
  if (!Number.isFinite(q) || q < 0) errors.push("quantity");
  return {
    ok: errors.length === 0,
    errors: errors
  };
}
