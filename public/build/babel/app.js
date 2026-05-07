"use strict";

var _productView = _interopRequireDefault(require("./productView.js"));
var _categoryView = _interopRequireDefault(require("./categoryView.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function setupCookieConsentBanner() {
  var banner = document.querySelector("#cookieConsentBanner");
  var acceptButton = document.querySelector("#acceptCookieBtn");
  var rejectButton = document.querySelector("#rejectCookieBtn");
  if (!banner || !acceptButton || !rejectButton) {
    return;
  }
  var savedConsent = localStorage.getItem("cookieConsent");
  if (savedConsent) {
    banner.classList.add("hidden");
    return;
  }
  banner.classList.remove("hidden");
  acceptButton.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "accepted");
    banner.classList.add("hidden");
  });
  rejectButton.addEventListener("click", function () {
    localStorage.setItem("cookieConsent", "rejected");
    banner.classList.add("hidden");
  });
}
document.addEventListener("DOMContentLoaded", function () {
  var productView = new _productView["default"]();
  var categoryView = new _categoryView["default"]();
  categoryView.setupApp();
  productView.setupApp();
  setupCookieConsentBanner();
});
