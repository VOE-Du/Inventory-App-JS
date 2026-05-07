"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _storage = _interopRequireDefault(require("./storage.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var CategoryView = exports["default"] = /*#__PURE__*/function () {
  function CategoryView(i18n) {
    var _this = this;
    _classCallCheck(this, CategoryView);
    this.i18n = i18n;
    this.ctgTitleInput = document.querySelector("#categoryTitle");
    this.ctgDescInput = document.querySelector("#categoryDescription");
    this.ctgCacelBtn = document.querySelector("#categoryCanelBtn");
    this.ctgAddBtn = document.querySelector("#categoryAddNewBtn");
    this.ctgSelect = document.querySelector("#categoriesSelect");
    this.ctgAddBtn.addEventListener("click", function () {
      _this.addNewCategory();
    });
    this.ctgCacelBtn.addEventListener("click", function () {
      _this.ctgTitleInput.value = "";
      _this.ctgDescInput.value = "";
    });
    document.addEventListener("languagechange", function () {
      _this.instantCtgUpdate(_storage["default"].getCategories());
    });
  }
  return _createClass(CategoryView, [{
    key: "text",
    value: function text(key) {
      return this.i18n.t(key);
    }
  }, {
    key: "setupApp",
    value: function setupApp() {
      this.instantCtgUpdate(_storage["default"].getCategories());
    }
  }, {
    key: "addNewCategory",
    value: function addNewCategory() {
      if (this.ctgTitleInput.value.trim().length >= 2) {
        var newCategroy = {
          id: new Date().getTime(),
          title: this.ctgTitleInput.value.trim(),
          description: this.ctgDescInput.value.trim()
        };
        this.ctgTitleInput.value = "";
        this.ctgDescInput.value = "";
        var savedCategories = _storage["default"].getCategories();
        var norm = function norm(t) {
          return String(t).trim().toLowerCase();
        };
        var existedItem = savedCategories.find(function (c) {
          return norm(c.title) === norm(newCategroy.title);
        });
        if (existedItem) {
          existedItem.title = newCategroy.title;
          existedItem.description = newCategroy.description;
          alert(this.text("duplicatedCategory"));
          _storage["default"].saveCategories(savedCategories);
          this.instantCtgUpdate(savedCategories);
          return;
        }
        newCategroy.id = new Date().getTime();
        newCategroy.createdAt = new Date().toISOString();
        savedCategories.push(newCategroy);
        _storage["default"].saveCategories(savedCategories);
        this.instantCtgUpdate(savedCategories);
      } else {
        alert(this.text("invalidCategoryTitle"));
      }
    }
  }, {
    key: "instantCtgUpdate",
    value: function instantCtgUpdate(categories) {
      var _this2 = this;
      var ctgListTitles = categories.map(function (obj) {
        return obj.title.trim();
      });
      this.ctgSelect.innerHTML = "";
      var defaultOption = document.createElement("option");
      defaultOption.selected = true;
      defaultOption.value = "none";
      defaultOption.textContent = this.text("selectCategory");
      this.ctgSelect.append(defaultOption);
      ctgListTitles.forEach(function (option) {
        var newOption = document.createElement("option");
        newOption.value = option;
        newOption.textContent = option;
        _this2.ctgSelect.append(newOption);
      });
    }
  }]);
}();
