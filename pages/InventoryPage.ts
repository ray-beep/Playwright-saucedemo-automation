import { Page, Locator } from "@playwright/test";

export class InventoryPage {
    readonly page: Page;
    readonly sortDropdown: Locator;
    readonly inventoryItems: Locator;
    readonly cartBadge: Locator;
    readonly cartIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sortDropdown = page.locator(
            '[data-test="product-sort-container"]',
        );
        this.inventoryItems = page.locator('[data-test="inventory-item"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.cartIcon = page.locator('[data-test="shopping-cart-link"]');
    }

    async sortBy(option: string) {
        await this.sortDropdown.selectOption(option);
    }

    async getItemNames() {
        return this.inventoryItems
            .locator('[data-test="inventory-item-name"]')
            .allTextContents();
    }

    async getItemPrices() {
        const priceTexts = await this.inventoryItems
            .locator('[data-test="inventory-item-price"]')
            .allTextContents();
        return priceTexts.map((p) => parseFloat(p.replace("$", "")));
    }

    // product name -> data-test slug, e.g. "Sauce Labs Backpack" -> "sauce-labs-backpack"
    private toSlug(itemName: string) {
        return itemName.toLowerCase().replace(/\s+/g, "-");
    }

    async addItemToCartByName(itemName: string) {
        await this.page
            .locator(`[data-test="add-to-cart-${this.toSlug(itemName)}"]`)
            .click();
    }

    async removeItemFromCartByName(itemName: string) {
        await this.page
            .locator(`[data-test="remove-${this.toSlug(itemName)}"]`)
            .click();
    }

    async goToCart() {
        await this.cartIcon.click();
    }
}
