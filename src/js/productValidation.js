/**
 * Pure helpers for product form validation (defect 4 — data integrity / client-side checks).
 */

export function parseQuantityDisplay(text) {
    const n = Number.parseInt(String(text).trim(), 10);
    return Number.isFinite(n) ? n : 0;
}

export function nextQuantityAfterToggle(current, isIncrement) {
    if (isIncrement) return current + 1;
    return current > 0 ? current - 1 : 0;
}

/**
 * @param {{ title: string, location: string, category: string, quantity: number }} draft
 * @returns {{ ok: boolean, errors: string[]= }}
 */
export function validateNewProductDraft(draft) {
    const errors = [];
    const title = (draft.title || "").trim();
    if (title.length < 2) errors.push("title");
    const loc = draft.location || "";
    if (!loc || loc === "none") errors.push("location");
    const cat = draft.category || "";
    if (!cat || cat === "none") errors.push("category");
    const q = typeof draft.quantity === "number" ? draft.quantity : parseQuantityDisplay(draft.quantity);
    if (!Number.isFinite(q) || q < 0) errors.push("quantity");
    return { ok: errors.length === 0, errors };
}
