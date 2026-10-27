import { filmCard } from "./filmCard.js";

console.log("Watchlist script loaded");

export async function loadWatchlist() {
    try {
        const response = await fetch("/watchlist");

        if (!response.ok) {
            throw new Error("Could not fetch watchlist.");
        }

        const movies = await response.json();

        let countre = 1;
        for (const movie of movies) {
            console.log(`Movie ${countre}:`, movie);
            countre++;
            filmCard("watchlist-grid", movie);
        }
    } catch (error) {
        console.error("Error in loadWatchlist:", error);
    }
}
