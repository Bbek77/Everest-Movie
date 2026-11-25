
export class MovieManager {

    constructor(storage) {

        this.storage = storage;

        this.movies = storage.load().map(movie => {

            if (typeof movie === "string") {

                return {
                    title: movie,
                    dateAdded: null,
                    watched: false
                };

            }

            return {
                ...movie,
                watched: movie.watched === true
            };

        });

    }

    save() {
        this.storage.save(this.movies);
    }

    addMovie(title) {

        title = title.trim();

        if (!title) {
            throw new Error("Please enter a movie title.");
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
            watched: false
        };

        this.movies.push(movie);

        this.save();

        return movie;

    }

    validateIndex(index) {

        if (
            !Number.isInteger(index) ||
            index < 0 ||
            index >= this.movies.length
        ) {

            throw new Error("Movie not found.");

        }

    }

    removeMovie(index) {

        this.validateIndex(index);

        this.movies.splice(index, 1);

        this.save();

    }

    toggleWatched(index) {

        this.validateIndex(index);

        this.movies[index].watched =
            !this.movies[index].watched;

        this.save();

        return this.movies[index].watched;

    }

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

        return {
            total,
            watched,
            unwatched,
            addedToday,
            progress
        };

    }

}
