import Storage from "../storage.js";

describe("Storage", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    test("returns empty arrays when nothing is stored", () => {
        expect(Storage.getProducts).toEqual([]);
        expect(Storage.getCategories()).toEqual([]);
    });

    test("saves and loads products", () => {
        const products = [{ id: 1, title: "Book" }];

        Storage.saveProducts(products);

        expect(Storage.getProducts).toEqual(products);
    });

    test("saves and loads categories", () => {
        const categories = [{ id: 1, title: "Office" }];

        Storage.saveCategories(categories);

        expect(Storage.getCategories()).toEqual(categories);
    });

    test("removes product by id", () => {
        Storage.saveProducts([
            { id: 1, title: "Book" },
            { id: 2, title: "Pen" },
        ]);

        Storage.removeProduct(1);

        expect(Storage.getProducts).toEqual([{ id: 2, title: "Pen" }]);
    });
});
