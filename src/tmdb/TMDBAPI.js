class TMDBAPI {
    constructor() {
        this.baseUrl = "https://api.themoviedb.org/3";
    }

    async request(endpoint, params = {}) {
        const token = process.env.TMDB_TOKEN;

        console.log(`Makeing tmdb request to ${endpoint}, at ${Date.now()}`)
        console.log(`Token: ${token}`);
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
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(
                `TMDB API error: ${response.status} ${response.statusText}`
            );
        }

        return response.json();
    }

    async discoverMovies(providerID, params = {}) {
        const discoverMovieEndpoint = "/discover/movie";

        const defaultParams = {
            include_adult: true,
            include_video: true,
            sort_by: "original_title.asc",
            watch_region: "HU",
            with_watch_providers: providerID,
        };

        const firstPage = await this.request(discoverMovieEndpoint, {
            ...defaultParams,
            ...params,
            page: 1,
        });

        const movies = [...firstPage.results];

        for (let page = 2; page <= firstPage.total_pages; page++) {
            const response = await this.request(discoverMovieEndpoint, {
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

export default new TMDBAPI();
