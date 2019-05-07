require("dotenv").config();
var keys = require("./key.js");

var userCommand = process.argv[2];
var userInput = process.argv;
userInput = userInput.slice(3, userInput.length+1);
var valid;
var moment = require('moment');
var keys = require('./key');
var Spotify = require('node-spotify-api');
var axios = require('axios');

runLiri(userCommand, userInput);


function runLiri(command, input) {
if (command !== undefined) {
    switch(userCommand) {
        case "concert-this":
            getConcert(input)
        break;
        case "spotify-this-song":
            getMusic(input)
        break;
        case "movie-this":
            getMovie(input)
        break;
        case "do-what-it-says":
            readFile()
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
function getConcert() {
    validateuserInput("concert-this");
    if(valid) {        
        var queryParam =userInput.join("%20");
        queryParam = queryParam.replace(/\//g, "%252F");
        queryParam = queryParam.replace(/\?/g, "%253F");
        queryParam = queryParam.replace(/\*/g, "%252A");
        var baseURL = "https://rest.bandsintown.com"
        var endpoint = `/artists/${queryParam}/events`
        var queryURL = `${baseURL}${endpoint}?app_id=${keys.bands.app_id}`

        axios.get(queryURL)
        .then(concerts => {
            var concertResults = concerts.data;
            if(typeof(concertResults) != "object") {
                console.log("Can't find artist. Try again.")
            }else if(concertResults.length >0) {
                concertResults.forEach(concert => {
                    var date = moment(concert.datetime).format("MM/DD/YYYY")
                    var time = moment(concert.datetime).format("hh:mm A")
                    console.log("\n*************");
                    console.log(userInput.join(" "))
                    console.log(`Venue: ${concert.venue.name}`)
                    console.log(`Location: ${concert.venue.city}, ${concert.venue.region},${concert.venue.country}`)
                    console.log(`Date: ${date}`)
                    console.log(`Time: ${time}`)
                   
                })
            } else {
                console.log(`There aren't any upcoming events for ${userInput.join(" ")}`)
            }
            
           
        })
        .catch(err => console.log(err));

    }  

}

// Spotify
function getMusic() {
    validateuserInput("spotity-this-song");
  if(valid) {
      var spotify  = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
      });

      var queryParam = userInput.join(" ");
    
      spotify.search({ type: 'track', query: queryParam})
      .then(function(data) {   
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
    }).catch(function(err) {
               console.log(err)
    });   
      
  }
}

function getMovie() {
    var baseURL = `http://www.omdbapi.com/?`
    var moiveTitle = userInput.join("20%");
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
    }); 




}  
   


function readFile() {
    var fs = require('fs');
    fs.readFile('random.txt', 'utf8', function(err, data){
        if(err) {
            console.log(err);
        }
        var textArray = data.split(',');
        var comm = textArray[0];
        var inp = textArray[1];
    })

    


}

// check if user typed any input after command
function validateuserInput(command){
    if(userInput.length > 0) {
        valid = true;
    } else {
        valid = false;
        return console.log("******\n" + command, "requires you to input a search term\n******")
    }
}