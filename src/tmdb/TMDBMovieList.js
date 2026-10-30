import TMDBMovie from "./TMDBMovie.js";

class TMDBMovieList {
    constructor() {
        this.movies = [];
    }

    getMovies() {
        return this.movies;
    }

    addTMDBListWithProvider(list, providerID) {
        if (!Array.isArray(list)) {
            console.error('addTMDBListWithProvider: The given list is not an array!');
            return;
        }

        for (const rawItem of list) {
            let existingMovie = this.movies.find(movie => movie.id === rawItem.id);

            if (existingMovie) {
                if (!existingMovie.providers.includes(providerID)) {
                    existingMovie.providers.push(providerID);
                }
                continue;
            }

            const newMovie = new TMDBMovie(rawItem);
        
            newMovie.providers.push(providerID);

            this.movies.push(newMovie);
        }
    }

    /**
     * Titel (and optional year) base search
     */
    findByTitle(title, year = null) {
        const cleanTitle = title.trim().toLowerCase();
    
        return this.movies.find(movie => {
            const matchTitle = movie.title.toLowerCase() === cleanTitle || 
                                movie.originalTitle?.toLowerCase() === cleanTitle;
      
            if (!matchTitle) return false;
            if (year && movie.releaseYear) return movie.releaseYear === year;
      
            return true;
        });
    }
}

export default new TMDBMovieList();