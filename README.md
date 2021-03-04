# Motiforge

* Live version: 
* Demo Username: admin
* Demo Password: pass
* Frontend Repository: https://github.com/GeorgeLuther/motiforge-app

## Summary

Motiforge assists users in the music composition process. 
Users can create music from its basic building blocks:

- Melodies
- Chord progressions.
- Forms

Users can control each elements in two ways:
- By hand through a game-like UI
- Guide the composition process and allow the computer to choose,
based on a set of rules and randomness.


## Set up

Complete the following steps to start a new project (NEW-PROJECT-NAME):

1. Clone this repository to your local machine `git clone BOILERPLATE-URL NEW-PROJECTS-NAME`
2. `cd` into the cloned repository
3. Make a fresh start of the git history for this project with `rm -rf .git && git init`
4. Install the node dependencies `npm install`
5. Move the example Environment file to `.env` that will be ignored by git and read by the express server `mv example.env .env`
6. Edit the contents of the `package.json` to use NEW-PROJECT-NAME instead of `"name": "express-boilerplate",`

## IMPORTANT NOTE ON NODE VERSION

If you are running Node v14, then you must also upgrade your `pg` package to v8.x by typing:

`npm install pg@8`

If you are on Node v12 or lower, run `npm install` as normal and let it remain locked to major version `pg` v7.

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests in watch mode `npm test`

Migrate the dev database `npm run migrate`

Migrate the test database `npm run migrate:test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's main branch.