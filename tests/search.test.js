
import {
    describe,
    it,
    expect,
    beforeEach
} from "vitest";

import { MovieManager } from "../js/movieManager.js";
import { createStorage } from "../js/storage.js";

describe("Movie Search and Filter Functionality", () => {

    let manager;

    beforeEach(() => {

        const data = new Map();

        const storage = createStorage({

            getItem: key => data.get(key) ?? null,

            setItem: (key, value) => data.set(key, value)

        });

        manager = new MovieManager(storage);

        manager.addMovie("Interstellar");
        manager.addMovie("Inception");
        manager.addMovie("Avatar");
        manager.addMovie("The Dark Knight");

        manager.toggleWatched(0);
        manager.toggleWatched(3);

        manager.rateMovie(0, 5);

    });

    it("should search by full movie title", () => {

        const results =
            manager.getFilteredMovies("Interstellar");

        expect(results.length).toBe(1);
        expect(results[0].title).toBe("Interstellar");

    });

    it("should support partial title searches", () => {

        const results =
            manager.getFilteredMovies("Dark");

        expect(results.length).toBe(1);
        expect(results[0].title).toBe("The Dark Knight");

    });

    it("should ignore uppercase and lowercase differences", () => {

        const results =
            manager.getFilteredMovies("  AVATAR  ");

        expect(results.length).toBe(1);
        expect(results[0].title).toBe("Avatar");

    });

    it("should return no results for an unknown movie", () => {

        const results =
            manager.getFilteredMovies("Unknown Movie");

        expect(results).toEqual([]);

    });

    it("should display all movies when search is empty", () => {

        const results =
            manager.getFilteredMovies("", "all");

        expect(results.length).toBe(4);

    });

    it("should filter watched movies", () => {

        const results =
            manager.getFilteredMovies("", "watched");

        expect(results.map(movie => movie.title))
            .toEqual(["Interstellar", "The Dark Knight"]);

    });

    it("should filter unwatched movies", () => {

        const results =
            manager.getFilteredMovies("", "unwatched");

        expect(results.map(movie => movie.title))
            .toEqual(["Inception", "Avatar"]);

    });

    it("should filter rated movies", () => {

        const results =
            manager.getFilteredMovies("", "rated");

        expect(results.length).toBe(1);
        expect(results[0].title).toBe("Interstellar");
        expect(results[0].rating).toBe(5);

    });

    it("should combine search and watched filters", () => {

        const results =
            manager.getFilteredMovies("Dark", "watched");

        expect(results.length).toBe(1);
        expect(results[0].title).toBe("The Dark Knight");

    });

    it("should exclude movies that do not match the filter", () => {

        const results =
            manager.getFilteredMovies("Avatar", "watched");

        expect(results.length).toBe(0);

    });

    it("should restore filtered movies after clearing search", () => {

        const searched =
            manager.getFilteredMovies("Dark", "watched");

        expect(searched.length).toBe(1);

        const cleared =
            manager.getFilteredMovies("", "watched");

        expect(cleared.length).toBe(2);

        expect(manager.movies.length).toBe(4);

    });

});
