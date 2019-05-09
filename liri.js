require("dotenv").config();
var keys = require("./key.js");

var userCommand = process.argv[2];
var userInput = process.argv;
userInput = userInput.slice(3, userInput.length + 1);
userInput = userInput.join(" ");
var moment = require('moment');
var keys = require('./key');
var Spotify = require('node-spotify-api');
var axios = require('axios');


if (userCommand === "do-what-it-says") {
    console.log(userCommand)
    readFile()
} else {
    runLiri(userCommand, userInput);
}



function runLiri(command, input) {
    if (command !== undefined) {
        switch (command) {
            case "concert-this":
                getConcert(input)
                break;
            case "spotify-this-song":
                getMusic(input)
                break;
            case "movie-this":
                getMovie(input)
                break;
            default:
                console.log("sorry I don't know that command")
        }
    } else {
        return console.log(`Input a liri command:
                        concert-this
                        spotify-this-song
                        movie-this
                        do-what-it-says`)
    }
}

// Bands in town
function getConcert(input) {
    if (input.length > 0) {
        var queryParam = input;
        queryParam = queryParam.replace(/\//g, "%252F");
        queryParam = queryParam.replace(/\?/g, "%253F");
        queryParam = queryParam.replace(/\*/g, "%252A");
        var baseURL = "https://rest.bandsintown.com"
        var endpoint = `/artists/${queryParam}/events`
        var queryURL = `${baseURL}${endpoint}?app_id=${keys.bands.app_id}`

        axios.get(queryURL)
            .then(concerts => {
                var concertResults = concerts.data;
                if (typeof (concertResults) != "object") {
                    console.log("Can't find artist. Try again.")
                } else if (concertResults.length > 0) {
                    concertResults.forEach(concert => {
                        var date = moment(concert.datetime).format("MM/DD/YYYY")
                        var time = moment(concert.datetime).format("hh:mm A")
                        console.log("\n*************");
                        console.log(queryParam)
                        console.log(`Venue: ${concert.venue.name}`)
                        console.log(`Location: ${concert.venue.city}, ${concert.venue.region},${concert.venue.country}`)
                        console.log(`Date: ${date}`)
                        console.log(`Time: ${time}`)

                    })
                } else {
                    console.log(`There aren't any upcoming events for ${queryParam}`)
                }


            })
            .catch(err => console.log(err));

    } else {
        return console.log("******\n" + "You need to input a search term\n******")
    }

}

// Spotify
function getMusic(input) {
    if (input.length > 0) {
        var spotify = new Spotify({
            id: keys.spotify.id,
            secret: keys.spotify.secret
        });

        var queryParam = input;

        spotify.search({ type: 'track', query: queryParam })
            .then(function (data) {
                var searchResult = data.tracks.items
                if (searchResult.length > 0) {
                    searchResult.forEach(song => {
                        console.log(`****************************`);
                        console.log(`Artist: ${song.artists[0].name}`);
                        console.log(`Song Name: ${song.name}`);
                        console.log(`Preview Link: ${song.preview_url}`);
                        console.log(`Album: ${song.album.name}`);
                        console.log(`****************************`);
                    });
                }
            }).catch(function (err) {
                console.log(err)
            });

    } else {
        // getMusic("The Sign");
        var spotify = new Spotify({
            id: keys.spotify.id,
            secret: keys.spotify.secret
        });

        var queryParam = "the sign";

        spotify.search({ type: 'track', query: queryParam })
            .then(function (data) {
                var searchResult = data.tracks.items
                var song = searchResult[7];
                console.log(`****************************`);
                console.log(`Artist: ${song.artists[0].name}`);
                console.log(`Song Name: ${song.name}`);
                console.log(`Preview Link: ${song.preview_url}`);
                console.log(`Album: ${song.album.name}`);
                console.log(`****************************`);
            });
    }

}

function getMovie(input) {
    if (input.length > 0) {
        var baseURL = `http://www.omdbapi.com/?`
        var moiveTitle = input;
        var queryURL = `${baseURL}t=${moiveTitle}&apikey=${keys.omdb.apikey}`

        axios.get(queryURL)
            .then(movies => {
                var movieResults = movies.data;
                console.log(`*****************`);
                console.log(`Movie Title: ${movieResults.Title}`);
                console.log(`Year: ${movieResults.Year}`);
                console.log(`IMDB Rating: ${movieResults.Ratings[0].Value}`);
                console.log(`Rotten Tomatoes Rating: ${movieResults.Ratings[1].Value}`);
                console.log(`Country: ${movieResults.Country}`);
                console.log(`Language: ${movieResults.Language}`);
                console.log(`Plot: ${movieResults.Plot}`);
                console.log(`Actors: ${movieResults.Actors}`);
                console.log(`*****************`);

            }).catch(function (err) {
                console.log(err)
            });

    } else {
        getMovie("Mr. Nobody");
    }


}



function readFile() {
    var fs = require('fs');
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(err);
        }
        var textArray = data.split(',');
        var comm = textArray[0];
        var inp = textArray[1];
        console.log(comm, inp)
        runLiri(comm, inp);
    })
}

