# Intro

A nodejs/CEVN stack rebuild-ish of the excellent (albeit commentless) [Ponyville Live](https://github.com/Poniverse/Ponyville-Live) webapp by SilverEagle. Please don't ask about the name. It's also pretty much still in development and probably cannot even hope to live up to even a shadow of the glory of its forebear. Sorry.

The backend is intended to be completely standalone and interacts with the frontend through a series of API calls.

# Repo structure

The frontend is completely located in the (aptly named) argentum-frontend folder. Within it is all the strange files webpack uses. The Vue components making up the app are located within the /src folder, and the built pages from webpack are located in the /dist folder. Do note that in order to properly view the pages, it has to be served by something pointed at /dist or whichever directory you so desire transferred to. Simply opening from the file manager will not work.

The rest of the repo is the backend. `index.js` does not hold much of interest, being the thing tying everything together. `api.js` holds all the api calls made to the backend, calls which would be documented at a later date, while `config.js` holds several adjustable values that may need to be adjusted, namely:

* `port`: Port at which the express app runs
* `dburl`: URL at which the database is located (`IP:port`)
* `secret`: Secret for JWTs
* `expiry`: Expiry time for JWTs

# Running

Pending a proper vagrant or docker file, I apologise for making you do everything manually. All commands are run from the repository root.

Build the frontend:

```
cd argentum-frontend
npm install
npm run build
```

Install the dependencies:

```
npm install
```

Setup CouchDB:

```
//Coming soon with a script!
```
