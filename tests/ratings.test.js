
import {
    describe,
    it,
    expect,
    beforeEach
} from "vitest";

import { MovieManager } from "../js/movieManager.js";
import { createStorage } from "../js/storage.js";

describe("Movie Rating Functionality", () => {

    let manager;
    let storage;

    beforeEach(() => {

        const data = new Map();

        storage = createStorage({

            getItem: key => data.get(key) ?? null,

            setItem: (key, value) => data.set(key, value)

        });

        manager = new MovieManager(storage);

    });

    it("should add movies without a rating by default", () => {

        manager.addMovie("Interstellar");

        expect(manager.movies[0].rating).toBe(0);

    });

    it("should assign a valid movie rating", () => {

        manager.addMovie("Interstellar");

        manager.rateMovie(0, 5);

        expect(manager.movies[0].rating).toBe(5);

    });

    it("should update an existing rating", () => {

        manager.addMovie("Interstellar");

        manager.rateMovie(0, 3);
        manager.rateMovie(0, 5);

        expect(manager.movies[0].rating).toBe(5);

    });

    it("should reject ratings below 1", () => {

        manager.addMovie("Interstellar");

        expect(() => manager.rateMovie(0, 0))
            .toThrow("Rating must be between 1 and 5.");

    });

    it("should reject ratings above 5", () => {

        manager.addMovie("Interstellar");

        expect(() => manager.rateMovie(0, 6))
            .toThrow("Rating must be between 1 and 5.");

    });

    it("should reject non-integer ratings", () => {

        manager.addMovie("Interstellar");

        expect(() => manager.rateMovie(0, 3.5))
            .toThrow("Rating must be between 1 and 5.");

    });

    it("should save movie ratings", () => {

        manager.addMovie("Interstellar");

        manager.rateMovie(0, 4);

        const reloaded = new MovieManager(storage);

        expect(reloaded.movies[0].rating).toBe(4);

    });

    it("should calculate average rating and rated count", () => {

        manager.addMovie("Interstellar");
        manager.addMovie("Avatar");
        manager.addMovie("Inception");

        manager.rateMovie(0, 5);
        manager.rateMovie(1, 4);

        const stats = manager.getStats();

        expect(stats.average).toBe(4.5);
        expect(stats.rated).toBe(2);

    });

    it("should return zero when no movies are rated", () => {

        manager.addMovie("Interstellar");

        expect(manager.getStats().average).toBe(0);
        expect(manager.getStats().rated).toBe(0);

    });

});
