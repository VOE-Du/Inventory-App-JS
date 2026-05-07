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

    test("handles numeric values converted to text", () => {
        expect(parseQuantityDisplay(7)).toBe(7);
    });
});

describe("nextQuantityAfterToggle", () => {
    test("increments quantity", () => {
        expect(nextQuantityAfterToggle(0, true)).toBe(1);
        expect(nextQuantityAfterToggle(5, true)).toBe(6);
    });

    test("decrements quantity but does not go below 0", () => {
        expect(nextQuantityAfterToggle(0, false)).toBe(0);
        expect(nextQuantityAfterToggle(1, false)).toBe(0);
        expect(nextQuantityAfterToggle(4, false)).toBe(3);
    });
});

describe("validateNewProductDraft", () => {
    test("accepts valid draft", () => {
        const result = validateNewProductDraft({
            title: "Book",
            location: "BDG",
            category: "Stationery",
            quantity: 1,
        });

        expect(result.ok).toBe(true);
        expect(result.errors).toEqual([]);
    });

    test("accepts quantity 0", () => {
        const result = validateNewProductDraft({
            title: "OK",
            location: "BDG",
            category: "Stationery",
            quantity: 0,
        });

        expect(result.ok).toBe(true);
    });

    test("accepts quantity provided as numeric text", () => {
        const result = validateNewProductDraft({
            title: "Pen",
            location: "BDG",
            category: "Stationery",
            quantity: "3",
        });

        expect(result.ok).toBe(true);
    });

    test("rejects short or blank title", () => {
        const result = validateNewProductDraft({
            title: " x ",
            location: "BDG",
            category: "Stationery",
            quantity: 0,
        });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain("title");
    });

    test("rejects missing location", () => {
        const result = validateNewProductDraft({
            title: "Book",
            location: "none",
            category: "Stationery",
            quantity: 1,
        });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain("location");
    });

    test("rejects missing category", () => {
        const result = validateNewProductDraft({
            title: "Book",
            location: "BDG",
            category: "none",
            quantity: 1,
        });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain("category");
    });

    test("rejects negative quantity", () => {
        const result = validateNewProductDraft({
            title: "Book",
            location: "BDG",
            category: "Stationery",
            quantity: -1,
        });

        expect(result.ok).toBe(false);
        expect(result.errors).toContain("quantity");
    });

    test("reports multiple validation errors together", () => {
        const result = validateNewProductDraft({
            title: "",
            location: "none",
            category: "none",
            quantity: -2,
        });

        expect(result.ok).toBe(false);
        expect(result.errors).toEqual(
            expect.arrayContaining(["title", "location", "category", "quantity"])
        );
    });
});
