import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";

test.describe("SauceDemo Inventory", () => {
    let inventoryPage: InventoryPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login("standard_user", "secret_sauce");
        inventoryPage = new InventoryPage(page);
    });

    test("INV_1 sorts products by name A to Z", async () => {
        await inventoryPage.sortBy("az");
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort();
        expect(names).toEqual(sorted);
    });

    test("INV_2 sorts products by name Z to A", async () => {
        await inventoryPage.sortBy("za");
        const names = await inventoryPage.getItemNames();
        const sorted = [...names].sort().reverse();
        expect(names).toEqual(sorted);
    });

    test("INV_3 sorts products by price low to high", async () => {
        await inventoryPage.sortBy("lohi");
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(sorted);
    });

    test("INV_4 sorts products by price high to low", async () => {
        await inventoryPage.sortBy("hilo");
        const prices = await inventoryPage.getItemPrices();
        const sorted = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(sorted);
    });

    test("INV_5 adds an item to the cart and badge updates", async ({
        page,
    }) => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await expect(inventoryPage.cartBadge).toHaveText("1");
    });

    test("INV_6 adds multiple items and badge count is correct", async ({
        page,
    }) => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.addItemToCartByName("Sauce Labs Bike Light");
        await expect(inventoryPage.cartBadge).toHaveText("2");
    });

    test("INV_7 removing an item updates the cart badge", async ({ page }) => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.removeItemFromCartByName("Sauce Labs Backpack");
        await expect(inventoryPage.cartBadge).toHaveCount(0);
    });
});
