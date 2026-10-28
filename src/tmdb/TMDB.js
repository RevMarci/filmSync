require("dotenv").config();

class TMDB {
    constructor() {
        this.baseUrl = "https://api.themoviedb.org/3";
        this.token = process.env.TMDB_TOKEN;
    }

    async request(endpoint, params = {}) {
        console.log("Token: " + process.env.TMDB_TOKEN);
        const url = new URL(`${this.baseUrl}${endpoint}`);

        for (const [key, value] of Object.entries(params)) {
            if (value !== undefined && value !== null) {
                url.searchParams.set(key, value);
            }
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${this.token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `TMDB API error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }

    async discoverMovies(params = {}) {
        const defaultParams = {
            include_adult: true,
            include_video: true,
            language: "en-US",
            sort_by: "original_title.asc",
            watch_region: "HU",
            with_watch_providers: "1899",
        };

        const firstPage = await this.request("/discover/movie", {
            ...defaultParams,
            ...params,
            page: 1,
        });

        const movies = [...firstPage.results];

        for (let page = 2; page <= firstPage.total_pages; page++) {
            const response = await this.request("/discover/movie", {
                ...defaultParams,
                ...params,
                page,
            });

            movies.push(...response.results);
        }

        return movies;
    }

    async getMovie(movieId, params = {}) {
        return this.request(`/movie/${movieId}`, {
            language: "en-US",
            ...params,
        });
    }

    async searchMovies(query, params = {}) {
        return this.request("/search/movie", {
            query,
            language: "en-US",
            ...params,
        });
    }

    async getMovieProviders(movieId) {
        return this.request(`/movie/${movieId}/watch/providers`);
    }
}

module.exports = new TMDB();
