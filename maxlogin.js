
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://auth.hbomax.com/login/");

    console.log("Login at the website.");
    console.log("If you are already logged in, press Enter in the terminal.");

    const readline = require("node:readline");
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    await new Promise((resolve) => rl.question("", resolve));
    rl.close();

    await context.storageState({
        path: "max-auth.json",
        indexedDB: true,
    });

    await browser.close();
})();
