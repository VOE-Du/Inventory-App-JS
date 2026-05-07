import ProductView from "../productView.js";
import Storage from "../storage.js";

const i18n = {
    t: (key) =>
        ({
            invalidProductTitle: "Invalid title",
            invalidLocation: "Invalid location",
            invalidCategory: "Invalid category",
            invalidQuantity: "Invalid quantity",
            deleteProduct: "Delete product",
        }[key] || key),
};

function setupDom() {
    document.body.innerHTML = `
        <input id="productTitle" />
        <button id="incQty" class="toggleBtn"></button>
        <button id="decQty" class="toggleBtn"></button>
        <select id="productLocations">
            <option value="none">- select location -</option>
            <option value="BDG">BDG</option>
            <option value="JKT">JKT</option>
        </select>
        <select id="categoriesSelect">
            <option value="none">- select category -</option>
            <option value="Food">Food</option>
            <option value="Office">Office</option>
        </select>
        <button id="addNewProductBtn"></button>
        <p id="productQuantity">0</p>
        <ul id="productsCenter"></ul>
        <input id="searchInput" />
        <select id="sort">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
        </select>
    `;
}

describe("ProductView", () => {
    beforeEach(() => {
        localStorage.clear();
        setupDom();
        jest.spyOn(window, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("add product button triggers addNewProduct", () => {
        const view = new ProductView(i18n);
        const spy = jest.spyOn(view, "addNewProduct");

        document.querySelector("#addNewProductBtn").click();

        expect(spy).toHaveBeenCalled();
    });

    test("search input keyup triggers product search", () => {
        const view = new ProductView(i18n);
        const spy = jest.spyOn(view, "searchProducts");

        const input = document.querySelector("#searchInput");
        input.value = "apple";
        input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));

        expect(spy).toHaveBeenCalledWith("apple");
    });

    test("sort select change triggers sorting", () => {
        const view = new ProductView(i18n);
        const spy = jest.spyOn(view, "sortBySelect");

        const sort = document.querySelector("#sort");
        sort.value = "oldest";
        sort.dispatchEvent(new Event("change", { bubbles: true }));

        expect(spy).toHaveBeenCalledWith("oldest");
    });

    test("adds a valid product with UTC createdAt", () => {
        const view = new ProductView(i18n);

        document.querySelector("#productTitle").value = "Apple";
        document.querySelector("#productQuantity").innerText = "3";
        document.querySelector("#productLocations").value = "BDG";
        document.querySelector("#categoriesSelect").value = "Food";

        view.addNewProduct();

        const products = Storage.getProducts;
        expect(products).toHaveLength(1);
        expect(products[0].title).toBe("Apple");
        expect(products[0].quantity).toBe("3");
        expect(products[0].createdAt).toBeTruthy();
    });

    test("rejects invalid product title", () => {
        const view = new ProductView(i18n);

        document.querySelector("#productTitle").value = "x";
        document.querySelector("#productLocations").value = "BDG";
        document.querySelector("#categoriesSelect").value = "Food";

        view.addNewProduct();

        expect(Storage.getProducts).toEqual([]);
        expect(window.alert).toHaveBeenCalledWith("Invalid title");
    });

    test("rejects missing location", () => {
        const view = new ProductView(i18n);

        document.querySelector("#productTitle").value = "Apple";
        document.querySelector("#productLocations").value = "none";
        document.querySelector("#categoriesSelect").value = "Food";

        view.addNewProduct();

        expect(window.alert).toHaveBeenCalledWith("Invalid location");
    });

    test("rejects missing category", () => {
        const view = new ProductView(i18n);

        document.querySelector("#productTitle").value = "Apple";
        document.querySelector("#productLocations").value = "BDG";
        document.querySelector("#categoriesSelect").value = "none";

        view.addNewProduct();

        expect(window.alert).toHaveBeenCalledWith("Invalid category");
    });

    test("rejects negative quantity", () => {
        const view = new ProductView(i18n);

        document.querySelector("#productTitle").value = "Apple";
        document.querySelector("#productQuantity").innerText = "-1";
        document.querySelector("#productLocations").value = "BDG";
        document.querySelector("#categoriesSelect").value = "Food";

        view.addNewProduct();

        expect(Storage.getProducts).toEqual([]);
        expect(window.alert).toHaveBeenCalledWith("Invalid quantity");
    });

    test("increments and decrements product quantity", () => {
        new ProductView(i18n);

        document.querySelector("#incQty").click();
        expect(document.querySelector("#productQuantity").innerText).toBe("1");

        document.querySelector("#decQty").click();
        expect(document.querySelector("#productQuantity").innerText).toBe("0");

        document.querySelector("#decQty").click();
        expect(document.querySelector("#productQuantity").innerText).toBe("0");
    });

    test("renders products and delete button removes a product", () => {
        Storage.saveProducts([
            {
                id: 1,
                title: "Apple",
                quantity: "2",
                location: "BDG",
                category: "Food",
                createdAt: "2026-05-08T00:00:00.000Z",
            },
        ]);

        const view = new ProductView(i18n);
        view.showListedProducts(Storage.getProducts);

        expect(document.querySelectorAll("#productsCenter li")).toHaveLength(1);
        expect(document.querySelector(".pdt-dlt-btn").getAttribute("aria-label")).toBe(
            "Delete product"
        );

        document.querySelector(".pdt-dlt-btn").click();

        expect(Storage.getProducts).toEqual([]);
    });

    test("formats createdAt date and falls back to persianDate", () => {
        const view = new ProductView(i18n);

        expect(
            view.formatProductDate({
                createdAt: "2026-05-08T00:00:00.000Z",
            })
        ).toMatch(/^2026-05-0[78]$/);

        expect(
            view.formatProductDate({
                persianDate: "old-date",
            })
        ).toBe("old-date");

        expect(
            view.formatProductDate({
                createdAt: "not-a-date",
                persianDate: "fallback-date",
            })
        ).toBe("fallback-date");
    });

    test("search filters products by title", () => {
        Storage.saveProducts([
            { id: 1, title: "Apple", quantity: "1", location: "BDG", category: "Food" },
            { id: 2, title: "Book", quantity: "1", location: "JKT", category: "Office" },
        ]);

        const view = new ProductView(i18n);
        view.searchProducts("app");

        expect(document.querySelectorAll("#productsCenter li")).toHaveLength(1);
        expect(document.querySelector("#productsCenter").textContent).toContain("Apple");
    });

    test("sorts products by newest, oldest, A-Z, and Z-A", () => {
        Storage.saveProducts([
            { id: 1, title: "Book", quantity: "1", location: "JKT", category: "Office" },
            { id: 2, title: "Apple", quantity: "1", location: "BDG", category: "Food" },
        ]);

        const view = new ProductView(i18n);

        view.sortBySelect("newest");
        expect(document.querySelector("#productsCenter").textContent.indexOf("Apple")).toBeLessThan(
            document.querySelector("#productsCenter").textContent.indexOf("Book")
        );

        view.sortBySelect("oldest");
        expect(document.querySelector("#productsCenter").textContent.indexOf("Book")).toBeLessThan(
            document.querySelector("#productsCenter").textContent.indexOf("Apple")
        );

        view.sortBySelect("A-Z");
        expect(document.querySelector("#productsCenter").textContent.indexOf("Apple")).toBeLessThan(
            document.querySelector("#productsCenter").textContent.indexOf("Book")
        );

        view.sortBySelect("Z-A");
        expect(document.querySelector("#productsCenter").textContent.indexOf("Book")).toBeLessThan(
            document.querySelector("#productsCenter").textContent.indexOf("Apple")
        );
    });

    test("sortBySelect falls back to unsorted copy for unknown sort type", () => {
        Storage.saveProducts([
            { id: 1, title: "Book", quantity: "1", location: "JKT", category: "Office" },
            { id: 2, title: "Apple", quantity: "1", location: "BDG", category: "Food" },
        ]);

        const view = new ProductView(i18n);
        view.sortBySelect("unknown");

        const text = document.querySelector("#productsCenter").textContent;
        expect(text.indexOf("Book")).toBeLessThan(text.indexOf("Apple"));
    });

    test("languagechange event re-renders current product list", () => {
        Storage.saveProducts([
            { id: 1, title: "Apple", quantity: "1", location: "BDG", category: "Food" },
        ]);

        const view = new ProductView(i18n);
        const spy = jest.spyOn(view, "showListedProducts");

        document.dispatchEvent(new CustomEvent("languagechange"));

        expect(spy).toHaveBeenCalled();
    });
});
