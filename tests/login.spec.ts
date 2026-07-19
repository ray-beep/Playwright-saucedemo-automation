import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";

test.describe("SauceDemo Login", () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goto();
    });

    test("LG_1 logs in with valid credentials", async ({ page }) => {
        await loginPage.login("standard_user", "secret_sauce");
        await expect(page).toHaveURL(/inventory.html/);
        await expect(page.locator(".title")).toHaveText("Products");
    });

    test("LG_2 locked out user cannot log in", async ({ page }) => {
        await loginPage.login("locked_out_user", "secret_sauce");
        const error = await loginPage.getErrorText();
        expect(error).toContain("Sorry, this user has been locked out");
    });

    test("LG_3 wrong password shows error", async ({ page }) => {
        await loginPage.login("standard_user", "wrong_password");
        const error = await loginPage.getErrorText();
        expect(error).toContain("Username and password do not match");
    });

    test("LG_4 empty username is rejected", async ({ page }) => {
        await loginPage.login("", "secret_sauce");
        const error = await loginPage.getErrorText();
        expect(error).toContain("Username is required");
    });

    test("LG_5 empty password is rejected", async ({ page }) => {
        // same idea as the empty username case, just flipped
        await loginPage.login("standard_user", "");
        const error = await loginPage.getErrorText();
        expect(error).toContain("Password is required");
    });
});
