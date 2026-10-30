class TMDBMovie {
    constructor(tmdbData) {
        this.adult = tmdbData.adult;
        this.backdrop_path = tmdbData.backdrop_path;
        this.genre_ids = tmdbData.genre_ids;
        this.id = tmdbData.id;
        this.title = tmdbData.title;
        this.original_language = tmdbData.original_language;
        this.original_title = tmdbData.original_title;
        this.overview = tmdbData.overview;
        this.popularity = tmdbData.popularity;
        this.poster_path = tmdbData.poster_path;
        this.release_date = tmdbData.release_date;
        this.softcore = tmdbData.softcore;
        this.video = tmdbData.video;
        this.vote_average = tmdbData.vote_average;
        this.vote_count = tmdbData.vote_count;

        this.isInList = false;
        this.providers = [];
    }

    markAsInList() {
        this.isInList = true;
    }
}

export default TMDBMovie;