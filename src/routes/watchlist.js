import { Router } from "express";
import SyncController from "../controllers/SyncController.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        console.log("Watchlist endpoint called");
        const films = await SyncController.runSync();
        res.json(films);
    } catch (error) {
        next(error);
    }
});

export default router;