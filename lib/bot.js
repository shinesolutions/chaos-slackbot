const config = require('../conf/config.json');
const mode = require('./modes/' + config.mode);
const slack = require('./slack');

function interact(data, cb) {

  if (config.allowedTokens.length > 0 && config.allowedTokens.indexOf(data.token) === -1) {

    var message = 'Your Slack app token is not recognised by Chaos Slackbot server.';
    cb(null, slack.error(message));

  } else {

    //TODO: there is no trigger word?
    // var trigger = util.format('%s ', data.trigger_word);
    // var text = data.text.replace(trigger, '');
    var text = data.text;

    if (is_enquiry(text)) {

      enquire(text, cb);

    } else if (mode.is_hit(text)) {

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

}

function is_enquiry(text) {

  return text.toLowerCase().indexOf('@chaos') !== -1;

}

function enquire(text, cb) {

  text = text.toLowerCase().replace('@chaos', '').trim();

  switch (text) {
    case "ping":

      cb(null, slack.success('pong'));
      break;

    case "help":

      var response = 'Options:' +
        '  ping        pong \n' +
        '  help        display enquiry options';

      cb(null, slack.success(response));

      break;

    default:
      cb(null, slack.error("Unknown enquiry. Try help."));

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
