import Storage from "./storage.js";
import {
    parseQuantityDisplay,
    nextQuantityAfterToggle,
    validateNewProductDraft,
} from "./productValidation.js";

export default class ProductView {
    constructor() {
        this.pdtTitle = document.querySelector("#productTitle");
        this.pdtIncQty = document.querySelector("#incQty");
        this.pdtDecQty = document.querySelector("#decQty");
        this.pdtLocation = document.querySelector("#productLocations");
        this.ctgSelect = document.querySelector("#categoriesSelect");
        this.pdtAddNew = document.querySelector("#addNewProductBtn");
        this.pdtQty = document.querySelector("#productQuantity");
        this.productCenter = document.querySelector("#productsCenter");
        this.toggleBtns = document.querySelectorAll(".toggleBtn");
        this.searchInput = document.querySelector("#searchInput");
        this.sortSelect = document.querySelector("#sort");

        this.pdtAddNew.addEventListener("click", () => {
            this.addNewProduct();
        });

        this.toggleBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.toggleProductQty(e);
            });
        });

        this.searchInput.addEventListener("keyup", (e) => {
            this.searchProducts(e.target.value);
        });

        this.sortSelect.addEventListener("change", (e) => {
            this.sortBySelect(e.target.value);
        });
    }

    setupApp() {
        this.showListedProducts(Storage.getProducts);
        this.sortBySelect(this.sortSelect.value);
    }

    formatProductDate(product) {
        if (!product.createdAt) {
            return product.persianDate || "";
        }

        const date = new Date(product.createdAt);

        if (Number.isNaN(date.getTime())) {
            return product.persianDate || "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    addNewProduct() {
        const qty = parseQuantityDisplay(this.pdtQty.innerText);
        const check = validateNewProductDraft({
            title: this.pdtTitle.value,
            location: this.pdtLocation.value,
            category: this.ctgSelect.value,
            quantity: qty,
        });

        if (!check.ok) {
            if (check.errors.includes("title")) {
                alert(
                    "Your product title must be at least 2 non-space characters."
                );
                return;
            }
            if (check.errors.includes("location")) {
                alert("Please select a valid storage location.");
                return;
            }
            if (check.errors.includes("category")) {
                alert("Please select a category.");
                return;
            }
            if (check.errors.includes("quantity")) {
                alert("Quantity must be zero or a positive whole number.");
                return;
            }
        }

        const newProduct = {
            id: new Date().getTime(),
            title: this.pdtTitle.value.trim(),
            quantity: String(qty),
            location: this.pdtLocation.value,
            category: this.ctgSelect.value,
            createdAt: new Date().toISOString(),
        };

        this.pdtTitle.value = "";
        this.pdtQty.innerText = "0";
        this.pdtLocation.value = "none";
        this.ctgSelect.value = "none";

        const pdtList = Storage.getProducts;
        pdtList.push(newProduct);
        Storage.saveProducts(pdtList);

        this.sortBySelect(this.sortSelect.value);
        this.showListedProducts(pdtList);
    }

    showListedProducts(productList) {
        this.productCenter.textContent = "";

        productList.forEach((product) => {
            const item = document.createElement("li");
            item.className =
                "flex items-center justify-between w-full py-2 bg-blue-400/ text-white font-medium ss:min-w-[500px] ss:overflow-x-auto";

            const title = document.createElement("p");
            title.className =
                "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
            title.textContent = product.title;

            const location = document.createElement("p");
            location.className =
                "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
            location.textContent = product.location;

            const category = document.createElement("p");
            category.className =
                "basis-[16%] ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
            category.textContent = product.category;

            const date = document.createElement("p");
            date.className =
                "basis-[16%] font-vazir ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
            date.textContent = this.formatProductDate(product);

            const quantity = document.createElement("p");
            quantity.className =
                "border-2 border-slate-400 p-1 rounded-2xl ww:text-base xx:text-[15px] dd:text-[14px] ss:text-[13px]";
            quantity.textContent = product.quantity;

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.dataset.id = product.id;
            deleteButton.className = "pdt-dlt-btn flex items-center justify-center";
            deleteButton.setAttribute("aria-label", "Delete product");

            const svgNS = "http://www.w3.org/2000/svg";

            const deleteIcon = document.createElementNS(svgNS, "svg");
            deleteIcon.setAttribute("aria-hidden", "true");
            deleteIcon.setAttribute("focusable", "false");
            deleteIcon.setAttribute(
                "class",
                "stroke-red-500 dd:h-6 dd:w-6 ss:h-5 ss:w-5 cursor-pointer"
            );
            deleteIcon.setAttribute("viewBox", "0 0 24 24");
            deleteIcon.setAttribute("stroke-width", "1.5");
            deleteIcon.setAttribute("stroke", "currentColor");
            deleteIcon.setAttribute("fill", "none");

            const path = document.createElementNS(svgNS, "path");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("stroke-linejoin", "round");
            path.setAttribute(
                "d",
                "m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
            );

            deleteIcon.appendChild(path);
            deleteButton.appendChild(deleteIcon);

            item.append(title, location, category, date, quantity, deleteButton);
            this.productCenter.appendChild(item);
        });

        this.productsAction();
    }

    productsAction() {
        const removeBtns = [...document.querySelectorAll(".pdt-dlt-btn")];

        removeBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                this.deleteProduct(e);
            });
        });
    }

    toggleProductQty(e) {
        const id = e.currentTarget.id;
        const current = parseQuantityDisplay(this.pdtQty.innerText);

        if (id === "incQty") {
            this.pdtQty.innerText = String(
                nextQuantityAfterToggle(current, true)
            );
        } else if (id === "decQty") {
            this.pdtQty.innerText = String(
                nextQuantityAfterToggle(current, false)
            );
        }
    }

    deleteProduct(e) {
        const productId = Number(e.currentTarget.dataset.id);
        Storage.removeProduct(productId);
        this.showListedProducts(Storage.getProducts);
        this.sortBySelect(this.sortSelect.value);
    }

    searchProducts(searchTerm) {
        const addedProducts = Storage.getProducts;
        const normalizedSearchTerm = searchTerm.toLowerCase().trim();
        const filteredProducts = addedProducts.filter((product) =>
            product.title.toLowerCase().trim().includes(normalizedSearchTerm)
        );

        this.showListedProducts(filteredProducts);
    }

    sortBySelect(sortType) {
        const saveProducts = Storage.getProducts;
        let sortedProducts = [];

        if (sortType === "newest") {
            sortedProducts = saveProducts.slice().sort((a, b) => b.id - a.id);
        } else if (sortType === "oldest") {
            sortedProducts = saveProducts.slice().sort((a, b) => a.id - b.id);
        } else if (sortType === "A-Z") {
            sortedProducts = saveProducts
                .slice()
                .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        } else if (sortType === "Z-A") {
            sortedProducts = saveProducts
                .slice()
                .sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()))
                .reverse();
        } else {
            sortedProducts = saveProducts.slice();
        }

        this.showListedProducts(sortedProducts);
    }
}
