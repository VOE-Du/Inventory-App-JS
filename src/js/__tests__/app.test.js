function setupDom(options = {}) {
    const {
        includeLanguageButtons = true,
        includeCookieBanner = true,
        includeDefaultLocationOption = true,
        includeSortDateOptions = true,
        includeUnknownTranslation = false,
    } = options;

    document.body.innerHTML = `
        <h1 data-i18n="appTitle">Inventory App With JS & TailwindCSS</h1>
        ${includeUnknownTranslation ? '<p id="unknownTranslation" data-i18n="missingTranslationKey">old</p>' : ""}

        <span data-i18n="languageLabel">Language</span>
        ${
            includeLanguageButtons
                ? `
                    <button id="englishLanguageBtn" type="button">English</button>
                    <button id="chineseLanguageBtn" type="button">中文</button>
                `
                : ""
        }

        <input id="categoryTitle" />
        <textarea id="categoryDescription"></textarea>
        <button id="categoryCanelBtn" type="button" data-i18n="cancel">Cancel</button>
        <button id="categoryAddNewBtn" type="button" data-i18n="addCategory">Add Category</button>

        <input id="productTitle" />
        <button id="incQty" type="button" class="toggleBtn" data-i18n-aria-label="increaseQuantity"></button>
        <button id="decQty" type="button" class="toggleBtn" data-i18n-aria-label="decreaseQuantity"></button>

        <select id="productLocations">
            ${includeDefaultLocationOption ? '<option selected value="none">- select location -</option>' : ""}
            <option value="BDG">BDG</option>
        </select>

        <select id="categoriesSelect">
            <option selected value="none">- select category -</option>
        </select>

        <button id="addNewProductBtn" type="button" data-i18n="addProduct">Add Product</button>
        <p id="productQuantity">0</p>

        <input id="searchInput" data-i18n-placeholder="searchPlaceholder" />

        <select id="sort">
            ${includeSortDateOptions ? '<option selected value="newest">Newest</option>' : ""}
            ${includeSortDateOptions ? '<option value="oldest">Oldest</option>' : ""}
            <option value="A-Z">A-Z</option>
            <option value="Z-A">Z-A</option>
        </select>

        <ul id="productsCenter"></ul>

        <a href="privacy-policy.html" data-i18n="privacyPolicy">Privacy Policy</a>

        ${
            includeCookieBanner
                ? `
                    <div id="cookieConsentBanner" class="hidden">
                        <p data-i18n="cookieMessage"></p>
                        <a href="privacy-policy.html" data-i18n="readPrivacyPolicy">Read our Privacy Policy</a>
                        <button id="rejectCookieBtn" type="button" data-i18n="reject">Reject</button>
                        <button id="acceptCookieBtn" type="button" data-i18n="accept">Accept</button>
                    </div>
                `
                : ""
        }
    `;
}

function loadApp() {
    jest.resetModules();
    require("../app.js");
    document.dispatchEvent(new Event("DOMContentLoaded"));
}

describe("app bootstrap", () => {
    beforeEach(() => {
        localStorage.clear();
        setupDom();
    });

    test("applies English translations by default", () => {
        loadApp();

        expect(document.documentElement.lang).toBe("en");
        expect(document.querySelector("[data-i18n='appTitle']").textContent).toBe(
            "Inventory App With JS & TailwindCSS"
        );
        expect(document.querySelector("#searchInput").placeholder).toBe("Search...");
        expect(document.querySelector("#incQty").getAttribute("aria-label")).toBe(
            "Increase quantity"
        );
        expect(document.querySelector("#decQty").getAttribute("aria-label")).toBe(
            "Decrease quantity"
        );
    });

    test("switches to Chinese and stores language preference", () => {
        loadApp();

        document.querySelector("#chineseLanguageBtn").click();

        expect(localStorage.getItem("appLanguage")).toBe("zh");
        expect(document.documentElement.lang).toBe("zh");
        expect(document.querySelector("[data-i18n='appTitle']").textContent).toBe(
            "库存管理应用"
        );
        expect(document.querySelector("#searchInput").placeholder).toBe("搜索...");
        expect(document.querySelector("#productLocations option[value='none']").textContent).toBe(
            "- 选择地点 -"
        );
        expect(document.querySelector("#sort option[value='newest']").textContent).toBe("最新");
        expect(document.querySelector("#sort option[value='oldest']").textContent).toBe("最旧");
    });

    test("switches back to English from Chinese", () => {
        localStorage.setItem("appLanguage", "zh");

        loadApp();

        document.querySelector("#englishLanguageBtn").click();

        expect(localStorage.getItem("appLanguage")).toBe("en");
        expect(document.documentElement.lang).toBe("en");
        expect(document.querySelector("[data-i18n='appTitle']").textContent).toBe(
            "Inventory App With JS & TailwindCSS"
        );
    });

    test("shows cookie banner when consent has not been stored", () => {
        loadApp();

        expect(document.querySelector("#cookieConsentBanner").classList.contains("hidden")).toBe(
            false
        );
    });

    test("accept button stores consent and hides banner", () => {
        loadApp();

        document.querySelector("#acceptCookieBtn").click();

        expect(localStorage.getItem("cookieConsent")).toBe("accepted");
        expect(document.querySelector("#cookieConsentBanner").classList.contains("hidden")).toBe(
            true
        );
    });

    test("reject button stores consent and hides banner", () => {
        loadApp();

        document.querySelector("#rejectCookieBtn").click();

        expect(localStorage.getItem("cookieConsent")).toBe("rejected");
        expect(document.querySelector("#cookieConsentBanner").classList.contains("hidden")).toBe(
            true
        );
    });

    test("keeps cookie banner hidden when consent already exists", () => {
        localStorage.setItem("cookieConsent", "accepted");

        loadApp();

        expect(document.querySelector("#cookieConsentBanner").classList.contains("hidden")).toBe(
            true
        );
    });

    test("does not crash when language buttons are missing", () => {
        setupDom({
            includeLanguageButtons: false,
        });

        expect(() => loadApp()).not.toThrow();
    });

    test("does not crash when cookie banner controls are missing", () => {
        setupDom({
            includeCookieBanner: false,
        });

        expect(() => loadApp()).not.toThrow();
    });

    test("does not crash when optional select options are missing", () => {
        setupDom({
            includeDefaultLocationOption: false,
            includeSortDateOptions: false,
        });

        expect(() => loadApp()).not.toThrow();
        expect(document.querySelector("#productLocations option[value='none']")).toBeNull();
        expect(document.querySelector("#sort option[value='newest']")).toBeNull();
        expect(document.querySelector("#sort option[value='oldest']")).toBeNull();
    });

    test("falls back to the key name when a translation is missing", () => {
        setupDom({
            includeUnknownTranslation: true,
        });

        loadApp();

        expect(document.querySelector("#unknownTranslation").textContent).toBe(
            "missingTranslationKey"
        );
    });
});
