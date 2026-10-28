import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

import syncRoutes from "./routes/sync.js";
import watchlistRoutes from "./routes/watchlist.js";

const app = express();
const port = 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());

app.use("/sync", syncRoutes);
app.use("/watchlist", watchlistRoutes);

app.use(express.static(path.resolve(__dirname, "../public")));

app.listen(port, "127.0.0.1", () => {
    console.log(`App running at http://localhost:${port}`);
});
