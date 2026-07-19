# Playwright SauceDemo Automation

![Playwright Tests](https://github.com/ray-beep/Playwright-saucedemo-automation/actions/workflows/playwright.yml/badge.svg)

A test automation project I built to practice and showcase UI testing with **Playwright** and **TypeScript**. It tests [SauceDemo](https://www.saucedemo.com/), a demo e-commerce site made specifically for practicing automation.

## What it does

I automated the full shopping flow a real user would go through:

- **Logging in** — including what happens with a locked account, wrong password, or empty fields
- **Browsing products** — sorting by name and price
- **Adding/removing items** from the cart
- **Checking out** — filling the form, handling missing info, and completing an order

That's **25 test cases**, run across Chromium, Firefox, and WebKit (75 test runs total when you count all three browsers).

## How it's built

I used the **Page Object Model** pattern — basically, each page of the site (Login, Inventory, Cart, Checkout) gets its own file that holds all the buttons/fields for that page and the actions you can do on it. The actual test files just call those actions, instead of repeating the same clicks everywhere. It keeps things organized and means if the site changes, I only need to fix one file, not twenty.

I also used `data-test` attributes as my main way of finding elements on the page, instead of CSS classes. Classes tend to change when someone tweaks the styling, but `data-test` attributes are usually added specifically so tests don't break — same idea as the `data-jarvis` attributes I use at my day job.

Tests run automatically through **GitHub Actions** every time I push new code, so I know right away if something breaks.

## Project layout

```
├── tests/              → the actual test files
│   ├── login.spec.ts
│   ├── inventory.spec.ts
│   ├── cart.spec.ts
│   └── checkout.spec.ts
├── pages/              → one file per page of the site
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   └── CheckoutPage.ts
├── .github/workflows/   → the CI setup that runs tests automatically
│   └── playwright.yml
└── playwright.config.ts
```

## Want to run it yourself?

```bash
# install everything the project needs
npm install

# download the browsers Playwright uses (only needed once)
npx playwright install

# run all the tests
npx playwright test

# just run it in Chrome
npx playwright test --project=chromium

# only run one file, e.g. the checkout tests
npx playwright test tests/checkout.spec.ts

# watch the browser actually do it, instead of running invisibly
npx playwright test --headed

# see a nice report of the last run
npx playwright show-report
```

## What a test run looks like

![Test report](./docs/test-report.png)

## A few honest notes

- I picked `data-test` attributes over CSS classes on purpose — it's a small thing, but it's the difference between tests that survive a redesign and tests that don't.
- Every test file only talks to Page Object methods, never raw selectors directly — keeps things clean and means changes only happen in one place.
- I hit a real bug while setting up CI: file naming that works fine on Windows (`CheckOutPage.ts` vs `CheckoutPage.ts`) broke on GitHub's Linux servers because Linux treats file names as case-sensitive and Windows doesn't. Fixed it, and now I won't make that mistake again.