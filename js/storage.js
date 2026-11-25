
export function createStorage(storage = localStorage) {

    const key = "movies";

    return {

        load() {

            return JSON.parse(
                storage.getItem(key) || "[]"
            );

        },

        save(movies) {

            storage.setItem(
                key,
                JSON.stringify(movies)
            );

        }

    };

}
