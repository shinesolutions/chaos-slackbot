const nlp = require('speakeasy-nlp');

function is_hit(text) {

  var score = nlp.sentiment.analyze(text).score;

  return score < 0;

}

exports.is_hit = is_hit;
