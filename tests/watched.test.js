
import { describe, it, expect, beforeEach } from "vitest";
import { MovieManager } from "../js/movieManager.js";
import { createStorage } from "../js/storage.js";

describe("Watched Movie Functionality", () => {

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

    it("should add a movie as unwatched by default", () => {

        manager.addMovie("Interstellar");

        expect(manager.movies[0].watched).toBe(false);

    });

    it("should mark a movie as watched", () => {

        manager.addMovie("Interstellar");

        manager.toggleWatched(0);

        expect(manager.movies[0].watched).toBe(true);

    });

    it("should mark a watched movie as unwatched", () => {

        manager.addMovie("Interstellar");

        manager.toggleWatched(0);

        manager.toggleWatched(0);

        expect(manager.movies[0].watched).toBe(false);

    });

    it("should save watched status", () => {

        manager.addMovie("Interstellar");

        manager.toggleWatched(0);

        const reloaded = new MovieManager(storage);

        expect(reloaded.movies[0].watched).toBe(true);

    });

    it("should calculate watched and unwatched counts", () => {

        manager.addMovie("Interstellar");

        manager.addMovie("Avatar");

        manager.toggleWatched(0);

        const stats = manager.getStats();

        expect(stats.watched).toBe(1);

        expect(stats.unwatched).toBe(1);

        expect(stats.progress).toBe(50);

    });

    it("should reject an invalid movie index", () => {

        expect(() => manager.toggleWatched(10))
            .toThrow("Movie not found.");

    });

});
