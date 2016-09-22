const config = require('../conf/config.json');
const mode = require('./modes/' + config.mode);
const slack = require('./slack');

function interact(data, cb) {

  if (config.allowedTokens.length > 0 && config.allowedTokens.indexOf(data.token) === -1) {
    var message = 'Your Slack app token is not recognised by Chaos Slackbot server.';
    cb(null, slack.error(message));
  }

  var trigger = util.format('%s ', data.trigger_word);
  var text = data.text.replace(trigger, '');

  // TODO: mode.is_hit  might need to be refactored to accept callback if AWS calls are all non-blocking
  if (mode.is_hit(text)) {
    store(text);
    if (should_terminate()) {
      terminate();
    } else {
      // TODO: else if it doesn't qualify, then ignore, simply cb();
      cb();
    }
  } else {
    // TODO: ignore if it's a miss? simply cb();
    cb();
  }
}

function store(text) {
  // TODO: store text / message in db for later calculation based on config parameter (time, max, etc)
}

function should_terminate() {
  // TODO: calculate stored texts in db, if it qualifies (e.g. 50 negative sentiment texts in db), then
}

function terminate() {
  // TODO:
  // - discover instances
  // - terminate one instance
  // - construct message notifying the room of the instance that was terminated
}

exports.interact = interact;
