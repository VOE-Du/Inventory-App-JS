import {
    parseQuantityDisplay,
    nextQuantityAfterToggle,
    validateNewProductDraft,
} from "../productValidation.js";

describe("parseQuantityDisplay", () => {
    test("parses integer text", () => {
        expect(parseQuantityDisplay("3")).toBe(3);
        expect(parseQuantityDisplay(" 12 ")).toBe(12);
    });
    test("non numeric becomes 0", () => {
        expect(parseQuantityDisplay("")).toBe(0);
        expect(parseQuantityDisplay("x")).toBe(0);
    });
});

describe("nextQuantityAfterToggle", () => {
    test("increment", () => {
        expect(nextQuantityAfterToggle(0, true)).toBe(1);
        expect(nextQuantityAfterToggle(5, true)).toBe(6);
    });
    test("decrement stops at 0", () => {
        expect(nextQuantityAfterToggle(0, false)).toBe(0);
        expect(nextQuantityAfterToggle(1, false)).toBe(0);
        expect(nextQuantityAfterToggle(4, false)).toBe(3);
    });
});

describe("validateNewProductDraft", () => {
    test("accepts valid draft", () => {
        expect(
            validateNewProductDraft({
                title: "Book",
                location: "A1",
                category: "Cat",
                quantity: 1,
            }).ok
        ).toBe(true);
    });
    test("rejects none location or category", () => {
        const a = validateNewProductDraft({
            title: "Book",
            location: "none",
            category: "Cat",
            quantity: 1,
        });
        expect(a.ok).toBe(false);
        expect(a.errors).toContain("location");
        const b = validateNewProductDraft({
            title: "Book",
            location: "A",
            category: "none",
            quantity: 1,
        });
        expect(b.ok).toBe(false);
        expect(b.errors).toContain("category");
    });
    test("rejects short title", () => {
        const r = validateNewProductDraft({
            title: " x ",
            location: "A",
            category: "C",
            quantity: 0,
        });
        expect(r.ok).toBe(false);
        expect(r.errors).toContain("title");
    });
    test("allows quantity 0", () => {
        const r = validateNewProductDraft({
            title: "OK",
            location: "A",
            category: "C",
            quantity: 0,
        });
        expect(r.ok).toBe(true);
    });
});
