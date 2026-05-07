import ProductView from "./productView.js";
import CategoryView from "./categoryView.js";

function setupCookieConsentBanner() {
    const banner = document.querySelector("#cookieConsentBanner");
    const acceptButton = document.querySelector("#acceptCookieBtn");
    const rejectButton = document.querySelector("#rejectCookieBtn");

    if (!banner || !acceptButton || !rejectButton) {
        return;
    }

    const savedConsent = localStorage.getItem("cookieConsent");

    if (savedConsent) {
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
    const productView = new ProductView();
    const categoryView = new CategoryView();

    categoryView.setupApp();
    productView.setupApp();
    setupCookieConsentBanner();
});
