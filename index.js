
const { chromium } = require("playwright");

(async () => {
    const browser = await chromium.launch({ headless: false });

    const context = await browser.newContext({
        storageState: "max-auth.json",
    });

    const page = await context.newPage();

    await page.goto("https://play.hbomax.com/my-stuff");

    await page.getByText("Recommended for You").waitFor();

    await page.waitForTimeout(1000);

    for (let i = 0; i < 100; i++) {
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight * 0.8);
        });
    

        await page.waitForTimeout(200);

        const info = await page.evaluate(() => ({
            scrollY: window.scrollY
        }));

        console.log(info);

        if (info.scrollY % 1 != 0) break;
    }

    const movieListClass = "StyledTileAlignmentContainer-Fuse-Web-Play__sc-29yzoe-1 etzHnr";
    const movieCardClass = "StyledTileWrapper-Fuse-Web-Play__sc-1ramr47-28 ieOdUc StyledTile-Fuse-Web-Play__sc-29yzoe-3 fDgJBC";

    const movieCards = page.locator(`${toSelector(movieListClass)} > ${toSelector(movieCardClass)}`);
    const count = await movieCards.count();

    console.log("Number of movie cards:", count);

    let films = [];

    const titleLocator = "span.StyledPrimaryTitle-Fuse-Web-Play__sc-1ramr47-22.bNXReg";
    const yearLocator = "span[data-testid='metadata_release_year']";

    for (let i = 0; i < count; i++) {
        console.log("Processing card", i + 1);
        const card = movieCards.nth(i);

        console.log("year");
        const yearElement = card.locator(yearLocator);

        if (!(await yearElement.count())) {
            continue;
        }
        const year = await yearElement.innerText();

        console.log("title");
        const title = await card.locator(titleLocator).innerText();

        films.push({ title, year });
    }

    console.log(films);

    //await page.waitForTimeout(5000);
    await browser.close();
})();

const toSelector = (classNames) =>
    "." + classNames.trim().split(/\s+/).join(".");
