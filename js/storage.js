
export function createStorage(storage = localStorage) {

    const key = "movies";

    return {

        load() {

            const savedMovies = storage.getItem(key);

            return JSON.parse(savedMovies || "[]");

        },

        save(movies) {

            storage.setItem(
                key,
                JSON.stringify(movies)
            );

        }

    };

}
