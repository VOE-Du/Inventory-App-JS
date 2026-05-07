import CategoryView from "../categoryView.js";
import Storage from "../storage.js";

const i18n = {
    t: (key) =>
        ({
            selectCategory: "- select category -",
            duplicatedCategory: "Duplicate category",
            invalidCategoryTitle: "Invalid category title",
        }[key] || key),
};

function setupDom() {
    document.body.innerHTML = `
        <input id="categoryTitle" />
        <textarea id="categoryDescription"></textarea>
        <button id="categoryCanelBtn"></button>
        <button id="categoryAddNewBtn"></button>
        <select id="categoriesSelect"></select>
    `;
}

describe("CategoryView", () => {
    beforeEach(() => {
        localStorage.clear();
        setupDom();
        jest.spyOn(window, "alert").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test("renders default category option and saved categories", () => {
        Storage.saveCategories([{ id: 1, title: "Office" }]);

        const view = new CategoryView(i18n);
        view.setupApp();

        expect(document.querySelector("#categoriesSelect").children).toHaveLength(2);
        expect(document.querySelector("#categoriesSelect").children[0].textContent).toBe(
            "- select category -"
        );
        expect(document.querySelector("#categoriesSelect").children[1].textContent).toBe(
            "Office"
        );
    });

    test("adds a new category", () => {
        const view = new CategoryView(i18n);

        document.querySelector("#categoryTitle").value = "Food";
        document.querySelector("#categoryDescription").value = "Kitchen items";

        view.addNewCategory();

        const categories = Storage.getCategories();
        expect(categories).toHaveLength(1);
        expect(categories[0].title).toBe("Food");
        expect(categories[0].description).toBe("Kitchen items");
        expect(categories[0].createdAt).toBeTruthy();
    });

    test("updates an existing category instead of duplicating it", () => {
        Storage.saveCategories([
            { id: 1, title: "Food", description: "Old description" },
        ]);

        const view = new CategoryView(i18n);

        document.querySelector("#categoryTitle").value = " food ";
        document.querySelector("#categoryDescription").value = "New description";

        view.addNewCategory();

        const categories = Storage.getCategories();
        expect(categories).toHaveLength(1);
        expect(categories[0].title).toBe("food");
        expect(categories[0].description).toBe("New description");
        expect(window.alert).toHaveBeenCalledWith("Duplicate category");
    });

    test("rejects short category title", () => {
        const view = new CategoryView(i18n);

        document.querySelector("#categoryTitle").value = "x";

        view.addNewCategory();

        expect(Storage.getCategories()).toEqual([]);
        expect(window.alert).toHaveBeenCalledWith("Invalid category title");
    });

    test("cancel button clears category inputs", () => {
        const view = new CategoryView(i18n);

        document.querySelector("#categoryTitle").value = "Food";
        document.querySelector("#categoryDescription").value = "Kitchen";

        document.querySelector("#categoryCanelBtn").click();

        expect(document.querySelector("#categoryTitle").value).toBe("");
        expect(document.querySelector("#categoryDescription").value).toBe("");
    });
});
