# LIRI-Bot 1.0

## Overview
	* LIRI is a Language Interpretation and Recognition Interface. 
	* LIRI will be a command line node app that takes in parameters and gives you back data.

## Packages download
* Dotenv 
```bash
npm install dotenv
```
* Moment
```bash
npm install moment
```
* Axios
```bash
npm install axios
```
* Spotify
```bash
npm install --save node-spotify-api
```


## LIRI Commands
* concert-this
* spotify-this-song
* movie-this
* do-what-it-says

## Demo
* Runing Liri.js without any command
```bash
node liri.js 
```
![liri](images/liri.png)

* Find concerts
```bash
node liri.js concert-this lady gaga
```
![concert-gaga](images/concert-ladygaga.png)

```bash
node liri.js concert-this adam levine
```
![concert-adam](images/concert-adam.png)

* Find songs
```bash
node liri.js spotify-this-song yesterday
```
![spotify-yesterday](images/spotify-yesterday.png)

```bash
node liri.js spotify-this-song
```
![spotify](images/spotify.png)

* Find movies
```bash
node liri.js movie-this avengers
```
![movie-avengers](images/movie-this-avengers.png)

```bash
node liri.js movie-this 
```
![movie](images/movie-this.png)

* Read Files
```bash
node liri.js do-what-it-says
```
![do-what-it-says](images/do-what-it-says.png)

