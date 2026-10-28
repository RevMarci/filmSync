import { Router } from "express";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        res.json({ response: "Sync route is working!" });
    } catch (error) {
        next(error);
    }
});

export default router;