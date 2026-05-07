import ProductView from "./productView.js";
import CategoryView from "./categoryView.js";

const translations = {
    en: {
        appTitle: "Inventory App With JS & TailwindCSS",
        languageLabel: "Language",
        addCategoryHeading: "Add New Category",
        addProductHeading: "Add New Product",
        title: "Title",
        description: "Description",
        quantity: "Quantity",
        location: "Location",
        category: "Category",
        cancel: "Cancel",
        addCategory: "Add Category",
        addProduct: "Add Product",
        productsList: "Products List",
        searchProducts: "Search products",
        searchPlaceholder: "Search...",
        sortProducts: "Sort products",
        newest: "Newest",
        oldest: "Oldest",
        selectLocation: "- select location -",
        selectCategory: "- select category -",
        decreaseQuantity: "Decrease quantity",
        increaseQuantity: "Increase quantity",
        deleteProduct: "Delete product",
        privacyPolicy: "Privacy Policy",
        cookieMessage: "We use local storage to save your inventory data, category data, language preference, and cookie consent choice.",
        readPrivacyPolicy: "Read our Privacy Policy",
        reject: "Reject",
        accept: "Accept",
        invalidProductTitle: "Your product title must be at least 2 non-space characters.",
        invalidLocation: "Please select a valid storage location.",
        invalidCategory: "Please select a category.",
        invalidQuantity: "Quantity must be zero or a positive whole number.",
        duplicatedCategory: "This category name has been added before, so we will update the category description.",
        invalidCategoryTitle: "Your entered title for category must be at least 2 characters.",
    },
    zh: {
        appTitle: "库存管理应用",
        languageLabel: "语言",
        addCategoryHeading: "新增分类",
        addProductHeading: "新增商品",
        title: "名称",
        description: "描述",
        quantity: "数量",
        location: "地点",
        category: "分类",
        cancel: "取消",
        addCategory: "添加分类",
        addProduct: "添加商品",
        productsList: "商品列表",
        searchProducts: "搜索商品",
        searchPlaceholder: "搜索...",
        sortProducts: "商品排序",
        newest: "最新",
        oldest: "最旧",
        selectLocation: "- 选择地点 -",
        selectCategory: "- 选择分类 -",
        decreaseQuantity: "减少数量",
        increaseQuantity: "增加数量",
        deleteProduct: "删除商品",
        privacyPolicy: "隐私政策",
        cookieMessage: "我们使用本地存储来保存库存数据、分类数据、语言偏好和 Cookie 同意选择。",
        readPrivacyPolicy: "查看隐私政策",
        reject: "拒绝",
        accept: "接受",
        invalidProductTitle: "商品名称至少需要 2 个非空字符。",
        invalidLocation: "请选择有效的存放地点。",
        invalidCategory: "请选择一个分类。",
        invalidQuantity: "数量必须是 0 或正整数。",
        duplicatedCategory: "这个分类名称已经存在，所以会更新该分类的描述。",
        invalidCategoryTitle: "分类名称至少需要 2 个字符。",
    },
};

function getCurrentLanguage() {
    return localStorage.getItem("appLanguage") || "en";
}

function t(key) {
    const language = getCurrentLanguage();
    return translations[language][key] || translations.en[key] || key;
}

function applyStaticTranslations() {
    document.documentElement.lang = getCurrentLanguage();

    document.querySelectorAll("[data-i18n]").forEach((element) => {
        element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
        element.placeholder = t(element.dataset.i18nPlaceholder);
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
        element.setAttribute("aria-label", t(element.dataset.i18nAriaLabel));
    });

    const locationSelect = document.querySelector("#productLocations option[value='none']");
    const sortNewest = document.querySelector("#sort option[value='newest']");
    const sortOldest = document.querySelector("#sort option[value='oldest']");

    if (locationSelect) locationSelect.textContent = t("selectLocation");
    if (sortNewest) sortNewest.textContent = t("newest");
    if (sortOldest) sortOldest.textContent = t("oldest");
}

function setupLanguageToggle() {
    const englishButton = document.querySelector("#englishLanguageBtn");
    const chineseButton = document.querySelector("#chineseLanguageBtn");

    if (!englishButton || !chineseButton) {
        return;
    }

    function updateLanguageButtons() {
        const currentLanguage = getCurrentLanguage();
        const activeClass = "px-3 py-2 bg-green-600 text-main rounded-lg font-semibold";
        const inactiveClass = "px-3 py-2 border-2 border-green-600 text-green-600 rounded-lg font-semibold";

        englishButton.className = currentLanguage === "en" ? activeClass : inactiveClass;
        chineseButton.className = currentLanguage === "zh" ? activeClass : inactiveClass;
    }

    function changeLanguage(language) {
        localStorage.setItem("appLanguage", language);
        applyStaticTranslations();
        updateLanguageButtons();
        document.dispatchEvent(new CustomEvent("languagechange"));
    }

    englishButton.addEventListener("click", () => {
        changeLanguage("en");
    });

    chineseButton.addEventListener("click", () => {
        changeLanguage("zh");
    });

    updateLanguageButtons();
}


function setupCookieConsentBanner() {
    const banner = document.querySelector("#cookieConsentBanner");
    const acceptButton = document.querySelector("#acceptCookieBtn");
    const rejectButton = document.querySelector("#rejectCookieBtn");

    if (!banner || !acceptButton || !rejectButton) {
        return;
    }

    if (localStorage.getItem("cookieConsent")) {
        banner.classList.add("hidden");
        return;
    }

    banner.classList.remove("hidden");

    acceptButton.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        banner.classList.add("hidden");
    });

    rejectButton.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "rejected");
        banner.classList.add("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    applyStaticTranslations();

    const i18n = { t };
    const productView = new ProductView(i18n);
    const categoryView = new CategoryView(i18n);

    categoryView.setupApp();
    productView.setupApp();
    setupLanguageToggle();
    setupCookieConsentBanner();
});
