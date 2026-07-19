import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from '../pages/CartPage';

test.describe("SauceDemo Cart", () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login("standard_user", "secret_sauce");
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
    });

    test("CT_1 cart shows the item that was added", async () => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        const names = await cartPage.getCartItemNames();
        expect(names).toContain("Sauce Labs Backpack");
    });

    test("CT_2 cart shows multiple items added", async () => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.addItemToCartByName("Sauce Labs Bike Light");
        await inventoryPage.goToCart();
        const names = await cartPage.getCartItemNames();
        expect(names).toEqual(["Sauce Labs Backpack", "Sauce Labs Bike Light"]);
    });

    test("CT_3 removing an item from cart page updates the list", async () => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.addItemToCartByName("Sauce Labs Bike Light");
        await inventoryPage.goToCart();
        await cartPage.removeItemByName("Sauce Labs Backpack");
        const names = await cartPage.getCartItemNames();
        expect(names).toEqual(["Sauce Labs Bike Light"]);
    });

    test("CT_4 cart is empty when nothing was added", async () => {
        await inventoryPage.goToCart();
        const names = await cartPage.getCartItemNames();
        expect(names).toEqual([]);
    });

    test("CT_5 continue shopping button returns to inventory page", async ({
        page,
    }) => {
        await inventoryPage.goToCart();
        await cartPage.continueShopping();
        await expect(page).toHaveURL(/inventory.html/);
    });

    test("CT_6 checkout button navigates to checkout info page", async ({
        page,
    }) => {
        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        await cartPage.goToCheckout();
        await expect(page).toHaveURL(/checkout-step-one.html/);
    });
});
