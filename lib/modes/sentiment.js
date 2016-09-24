const nlp = require('speakeasy-nlp');

function isHit(text) {

  var score = nlp.sentiment.analyze(text).score;

  return score < 0;

}

exports.isHit = isHit;
