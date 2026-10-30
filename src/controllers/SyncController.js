import config from '../../config.json' with { type: 'json' };
import { getActiveScrapers } from "../scrapers/index.js";
import TMDBAPI from "../tmdb/TMDBAPI.js";
import TMDBMovieList from "../tmdb/TMDBMovieList.js";

class SyncController {
    async runSync() {
        const scrapers = await getActiveScrapers(config.activeScrapers);

        for (const scraper of scrapers) {
            console.log(`Syncing: ${scraper.id}...`);
            const tmdbMoviesRaw = await TMDBAPI.discoverMovies(scraper.providerID);
            await TMDBMovieList.addTMDBListWithProvider(tmdbMoviesRaw, scraper.providerID);

            console.log(`Found ${TMDBMovieList.movies.length} movies`);
            await scraper.pairWithTMDB();
        }

        return TMDBMovieList.getMovies();
    }
}

export default new SyncController();