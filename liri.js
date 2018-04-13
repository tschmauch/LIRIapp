//initialize variables and requirements
var Twitter = require('twitter');
var inquirer = require('inquirer');
var Spotify = require('node-spotify-api');
var omdb = require('omdb');
var request = require('request');
var keys = require("./keys.js");

var count = 0;
var count2 = 0;
//retrieve the user input selection
var userInput = process.argv[2];

//if user input is my-tweets run the twitter information section
if(userInput === "my-tweets"){
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });
   
  var user = "CoPilot78";
  var params = "";
  client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
    	//loop through 20 tweets and display them.
      for (var i = 0; i < 20; i++) {
        tweets[i];
        console.log(tweets[i].text);
      }
      //console.log(JSON.stringify(response, null, 2));
      //if there is an error display it.
    }else{
    	console.log(error);
    }
  });
}else if(userInput === "spotify-this-song"){

  //start a function to create a recursive loop
  var songQuestion = function(){

    if(count < 1){
      inquirer.prompt([
        {
          name: "song",
          message: "What song are you looking for:"
        }]).then(function(answers) { 
          var userSong = answers.song;
          var spotify = new Spotify({
            id: keys.spotifyKeys.id,
            secret: keys.spotifyKeys.secret
          });
          spotify.search({ type: 'track', query: answers.song, limit: 1}, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
          var album = data.tracks.items[0].album.name;
          var artist = data.tracks.items[0].artists[0].name;
          var song = data.tracks.items[0].name;
          var url = data.tracks.items[0].preview_url;

          console.log('You selected the song ' + song + ' by the artist ' + artist + '\n' + 'This song is on the "' + album + '" album.' + '\nYou can find a preview to the song here: ' + '\n' + url);
          //console.log(JSON.stringify(data.tracks.items[0], null, 2)); 
          });
          count++;
          songQuestion();
        }); 
    }
  }
  songQuestion();

}else if(userInput === "movie-this"){
  //start a function to create a recursive loop
  var movieQuestion = function(){

    if(count2 < 1){
      inquirer.prompt([
        {
          name: "movie",
          message: "What movie would you like information for:"
        }]).then(function(answers) {
          var movie = answers.movie;
          request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
            //console.log(JSON.parse(body));
          console.log(JSON.parse(body).Title);
          console.log("This movie came out in " + JSON.parse(body).Year);
          console.log("The movie's IMDB rating is: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes gave it a rating of: " + JSON.parse(body).Ratings[1].Value);
          console.log("This move was produced in: " + JSON.parse(body).Country);
          console.log("make sure you understand " + JSON.parse(body).Language + " when watching this movie.");
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors)
        });
        count2++;
        movieQuestion();
      });
    }
  }
  movieQuestion();
}