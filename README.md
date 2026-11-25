
# Everest Movie

Everest Movie is a web application that allows users
to create and manage their personal movie watchlist.

## Features

- Add movies to a watchlist.
- View saved movies.
- Remove movies.
- Prevent empty and duplicate movie titles.
- Mark movies as watched or unwatched.
- View dashboard statistics.
- Track watching progress.
- Save movie information using local storage.

## Technologies

- HTML
- CSS
- JavaScript
- Local Storage
- Vitest

## Requirements

- Modern web browser
- Python 3
- Node.js
- npm

## Installation

Install the project dependencies:

    npm install

## Running the Application

Start the local server:

    python3 -m http.server 8001

Open the following address in your browser:

    http://localhost:8001/

## Automated Testing

Run the automated tests:

    npm test

The watched-status test suite contains six tests.

## SOLID Principles

Single Responsibility Principle:

MovieManager handles movie management, storage.js
handles data persistence, and script.js handles the
user interface.

Dependency Inversion Principle:

MovieManager receives its storage dependency through
its constructor, allowing different storage
implementations to be used during testing.

## Limitations

- Movie information is stored locally in the browser.
- User accounts are not available.
- Movie ratings, search, and discussions are not
  implemented in this feature branch.
