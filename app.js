var twitter = require('twit');
var sentiment = require('sentiment');
require('colors');
var twit = new twitter({
    consumer_key: '...',
    consumer_secret: '...',
    access_token: '...',
    access_token_secret: '...'
  });

ranges = [
  {low: -Infinity, high: -7, mood: 'red'},
  {low: -7, high: 0, mood: 'yellow'},
  {low: 0, high: 3, mood: 'white'},
  {low: 3, high: 7, mood: 'green'},
  {low: 7, high: Infinity, mood: 'rainbow'},
];

twit.stream('statuses/filter', { track: process.argv[2], language: 'en' }).on("tweet", function (tweet) {
      var m, score = sentiment(tweet.text).score;
      ranges.forEach(function (range) {
        if (range.low <= score && score < range.high) {
          m = tweet.text[range.mood];
        }
      });
      console.log('\n', m);
    });
