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
var omdb = require('omdb');

if (userCommand !== undefined) {
    switch(userCommand) {
        case "concert-this":
            getConcert(userInput)
        break;
        case "spotify-this-song":
            getMusic(userInput)
        break;
        case "movie-this":
            getMovie(userInput)
        break;
        case "do-what-it-says":
            readFile()
        default:
            console.log("sorry I don't know that command")
    }
} else {
    return console.log("input a liri command \n concert-this \n movie-this")
}


function getConcert() {
    console.log('concert');
    validateuserInput("concert-this");
    if(valid) {
        
        var queryParam =userInput.join("%20");
        queryParam = queryParam.replace(/\//g, "%252F");
        queryParam = queryParam.replace(/\?/g, "%253F");
        queryParam = queryParam.replace(/\*/g, "%252A");
        console.log(queryParam)
        var baseURL = "https://rest.bandsintown.com"
        var endpoint = `/artists/${queryParam}/events`
        var queryURL = `${baseURL}${endpoint}?app_id=${keys.bands.app_id}`

        axios.get(queryURL)
        .then(concerts => {
            var concertResults = concerts.data;
            if(concertResults.length >0) {
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
    // axios to get data for a query
    // /artists/{artistname}/events
    // .replace(/\//g, "%252F");
    // .replace(/\?/g, "%253F");
    // .replace(/\*/g, "%252A");
    // .replace(/\"/g, "%27C"); 
    // .replace(/\s/g, "%20");
    // space %20 replace(/\s/g, "%20")
   

}

function getMusic() {
    validateuserInput("spotity-this-song");
  if(valid) {
      var spotify  = new Spotify({
        id: keys.spotify.id,
        secret: keys.spotify.secret
      });

      var queryParam = userInput.join("20%");
      spotify.search({ type: 'track', query: queryParam}, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       
      console.log(data); 
      });
  }
}

function getMovie() {

}

function readFile() {

}

function validateuserInput(command){
    if(userInput.length > 0) {
        valid = true;
    } else {
        valid = false;
        return console.log("******\n" + command, "requires you to input a search term\n******")
    }
}