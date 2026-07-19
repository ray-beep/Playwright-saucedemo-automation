import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { CartPage } from "../pages/cartPage";
import { CheckoutPage } from "../pages/CheckOutPage";

test.describe("SauceDemo Checkout", () => {
    let inventoryPage: InventoryPage;
    let cartPage: CartPage;
    let checkoutPage: CheckoutPage;

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login("standard_user", "secret_sauce");
        inventoryPage = new InventoryPage(page);
        cartPage = new CartPage(page);
        checkoutPage = new CheckoutPage(page);

        await inventoryPage.addItemToCartByName("Sauce Labs Backpack");
        await inventoryPage.goToCart();
        await cartPage.goToCheckout();
    });

    test("completes checkout with valid info", async ({ page }) => {
        await checkoutPage.fillInfo("Aswin", "CP", "673001");
        await checkoutPage.continueToOverview();
        await expect(page).toHaveURL(/checkout-step-two.html/);
    });

    test("shows error when first name is missing", async () => {
        await checkoutPage.fillInfo("", "CP", "673001");
        await checkoutPage.continueToOverview();
        const error = await checkoutPage.getErrorText();
        expect(error).toContain("First Name is required");
    });

    test("shows error when last name is missing", async () => {
        await checkoutPage.fillInfo("Aswin", "", "673001");
        await checkoutPage.continueToOverview();
        const error = await checkoutPage.getErrorText();
        expect(error).toContain("Last Name is required");
    });

    test("shows error when postal code is missing", async () => {
        await checkoutPage.fillInfo("Aswin", "CP", "");
        await checkoutPage.continueToOverview();
        const error = await checkoutPage.getErrorText();
        expect(error).toContain("Postal Code is required");
    });

    test("order summary shows correct total on overview page", async ({
        page,
    }) => {
        await checkoutPage.fillInfo("Aswin", "CP", "673001");
        await checkoutPage.continueToOverview();
        const total = await checkoutPage.getTotalText();
        expect(total).toContain("Total:");
    });

    test("completes the full order and shows confirmation", async ({
        page,
    }) => {
        await checkoutPage.fillInfo("Aswin", "CP", "673001");
        await checkoutPage.continueToOverview();
        await checkoutPage.finishOrder();
        await expect(checkoutPage.completeHeader).toHaveText(
            "Thank you for your order!",
        );
    });

    test("cancel button on checkout info returns to cart", async ({ page }) => {
        await checkoutPage.cancelButton.click();
        await expect(page).toHaveURL(/cart.html/);
    });
});
