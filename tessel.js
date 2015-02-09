console.info("imports");
var twitter = require('twitter');
var sentiment = require('Sentimental').analyze;
require('colors');

console.info("twitter apis");
var twit = new twitter({
    consumer_key: '',
    consumer_secret: '',
    access_token_key: '',
    access_token_secret: ''
  });

var onTessel = process.env.DEPLOY_TIMESTAMP;
if(onTessel){
  var tessel = require('tessel');
  console.info("init leds");
  tessel.led[0].output(0);
  tessel.led[1].output(0);
  tessel.led[2].output(0);
  tessel.led[3].output(0);
}

console.info("ranges");
ranges = [
  {low: -Infinity, high: -7, mood: 'red', led: 0},
  {low: -7, high: 0, mood: 'yellow', led: 1},
  {low: 0, high: 3, mood: 'white', led: 2},
  {low: 3, high: 7, mood: 'green', led: 3},
  {low: 7, high: Infinity, mood: 'rainbow'},
];

console.info("streaming "+process.argv[2]);

twit.stream('statuses/filter', { track: process.argv[2], language: 'en' }, function(stream) {

  stream.on('data', function(tweet) {
    var m, score = sentiment(tweet.text).score;
    ranges.forEach(function (range) {
      if (range.low <= score && score < range.high) {
        m = tweet.text[range.mood];
        if(onTessel){
          tessel.led[0].output(0);
          tessel.led[1].output(0);
          tessel.led[2].output(0);
          tessel.led[3].output(0);
          tessel.led[range.led].toggle();
        }
      }
    });
    console.log('\n', m);
  });

  stream.on('error', function(error) {
    throw error;
  });

});
