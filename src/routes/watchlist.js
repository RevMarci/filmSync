import { Router } from "express";
//import hboscraper from "../scrapers/HBOScraper.js";
import tmdb from "../tmdb/tmdb.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        console.log("Watchlist endpoint called");
        //const films = await hboscraper.scrapeList();
        const films = await tmdb.discoverMovies();
        res.json(films);
    } catch (error) {
        next(error);
    }
});

export default router;