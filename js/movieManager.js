
export class MovieManager {

    constructor(storage) {

        this.storage = storage;

        this.movies = storage.load().map(movie => {

            if (typeof movie === "string") {

                return {
                    title: movie,
                    dateAdded: null,
                    watched: false,
                    rating: 0
                };

            }

            return {
                ...movie,
                watched: movie.watched === true,
                rating: Number.isInteger(movie.rating) &&
                        movie.rating >= 1 &&
                        movie.rating <= 5
                    ? movie.rating
                    : 0
            };

        });

    }

    // Save Movies

    save() {

        this.storage.save(this.movies);

    }

    // Add Movie

    addMovie(title) {

        title = title.trim();

        if (!title) {

            throw new Error(
                "Please enter a movie title."
            );

        }

        const duplicate = this.movies.some(movie =>
            movie.title.toLowerCase() === title.toLowerCase()
        );

        if (duplicate) {

            throw new Error(
                "This movie is already in your watchlist."
            );

        }

        const movie = {
            title,
            dateAdded: new Date().toISOString(),
            watched: false,
            rating: 0
        };

        this.movies.push(movie);

        this.save();

        return movie;

    }

    // Validate Movie Index

    validateIndex(index) {

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= this.movies.length
        ) {

            throw new Error("Movie not found.");

        }

    }

    // Remove Movie

    removeMovie(index) {

        this.validateIndex(index);

        this.movies.splice(index, 1);

        this.save();

    }

    // Watched and Unwatched Status

    toggleWatched(index) {

        this.validateIndex(index);

        this.movies[index].watched =
            !this.movies[index].watched;

        this.save();

        return this.movies[index].watched;

    }

    // Rate Movie

    rateMovie(index, rating) {

        this.validateIndex(index);

        if (
            !Number.isInteger(rating) ||
            rating < 1 ||
            rating > 5
        ) {

            throw new Error(
                "Rating must be between 1 and 5."
            );

        }

        this.movies[index].rating = rating;

        this.save();

        return rating;

    }

    // Calculate Dashboard Statistics

    getStats() {

        const total = this.movies.length;

        const watched = this.movies.filter(
            movie => movie.watched
        ).length;

        const unwatched = total - watched;

        const today = new Date().toDateString();

        const addedToday = this.movies.filter(movie =>
            movie.dateAdded &&
            new Date(movie.dateAdded).toDateString() === today
        ).length;

        const progress = total > 0
            ? Math.round(watched / total * 100)
            : 0;

        const ratedMovies = this.movies.filter(
            movie => movie.rating >= 1 &&
                     movie.rating <= 5
        );

        const rated = ratedMovies.length;

        const average = rated > 0
            ? Number((
                ratedMovies.reduce(
                    (sum, movie) => sum + movie.rating,
                    0
                ) / rated
            ).toFixed(1))
            : 0;

        return {
            total,
            watched,
            unwatched,
            addedToday,
            progress,
            rated,
            average
        };

    }

}
