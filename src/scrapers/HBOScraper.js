import { chromium } from "playwright";
import BaseScraper from "./BaseScraper.js";
import TMDBMovieList from "../tmdb/TMDBMovieList.js";

export default class HBOScraper extends BaseScraper {
    constructor() {
        super();
        this.isScraping = false;
    }

    get id() {
        return 'hbo';
    }

    get providerID() {
        return 1899;
    }

    async scrapeList() {
        if (this.isScraping) {
            throw new Error("Scraping is already in progress.");
        }

        this.isScraping = true;

        let browser;

        try {
            console.log("Open chromium");
            browser = await chromium.launch({
                headless: false,
            });

            const context = await browser.newContext({
                storageState: "src/scrapersContext/max-auth.json",
            });

            const page = await context.newPage();

            await page.goto("https://play.hbomax.com/my-stuff");

            await page.getByText("Recommended for You").waitFor();
            await page.waitForTimeout(1000);

            // Scroll down to load all movies
            for (let i = 0; i < 50; i++) {
                await page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight * 0.8);
                });

                await page.waitForTimeout(200);

                const info = await page.evaluate(() => ({
                    scrollY: window.scrollY,
                }));

                console.log(`Scrolled to: ${info.scrollY}`);

                // TODO: needs better check
                if (info.scrollY % 1 !== 0) break;
            }

            const movieListClass =
                "StyledTileAlignmentContainer-Fuse-Web-Play__sc-29yzoe-1 etzHnr";

            const movieCardClass =
                "StyledTileWrapper-Fuse-Web-Play__sc-1ramr47-28 ieOdUc StyledTile-Fuse-Web-Play__sc-29yzoe-3 fDgJBC";

            const movieCards = page.locator(
                `${this.toSelector(movieListClass)} > ${this.toSelector(movieCardClass)}`
            );

            const count = await movieCards.count();

            const titleLocator =
                "span.StyledPrimaryTitle-Fuse-Web-Play__sc-1ramr47-22.bNXReg";

            const yearLocator =
                "span[data-testid='metadata_release_year']";

            const films = [];

            for (let i = 0; i < count; i++) {
                const card = movieCards.nth(i);
                const yearElement = card.locator(yearLocator);

                // Skip cards without a release year (e.g. series)
                if (!(await yearElement.count())) {
                    continue;
                }

                const year = await yearElement.innerText();
                const title = await card.locator(titleLocator).innerText();

                films.push({ title, year });
            }

            return films;
        } finally {
            if (browser) {
                await browser.close();
            }

            this.isScraping = false;
        }
    }

    toSelector(classNames) {
        return "." + classNames.trim().split(/\s+/).join(".");
    }

    async pairWithTMDB() {
        console.log("Start hbo scraping");
        const scrapedItems = await this.scrapeList();
        console.log("Scraping finished, start marking");
        for (const item of scrapedItems) {
            const match = TMDBMovieList.findByTitle(item.title, item.year);
      
            if (match) {
                match.markAsInList();
            }
        }
    }
}
