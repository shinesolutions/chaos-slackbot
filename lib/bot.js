const config = require('../conf/config.json');
const mode = require('./modes/' + config.mode);
const slack = require('./slack');

function interact(data, cb) {

  if (config.allowedTokens.length > 0 && config.allowedTokens.indexOf(data.token) === -1) {

    var message = 'Your Slack app token is not recognised by Chaos Slackbot server.';
    cb(null, slack.error(message));

    //TODO: call controlled_hours
    //TODO: max terminations per day
    // } else if (is_valid_user(data.user_name) && controlled_hours() && mode.is_hit(data.text)) {

  } else if (is_valid_user(data.user_name) && mode.is_hit(data.text)) {

    store(data.text);

  } else {
    cb();
  }

}

function is_valid_user(user_name) {
  return user_name && config.ignoredUserNames.length > 0 && config.ignoredUserNames.indexOf(user_name) === -1;
}

function store(text) {

  var AWS = require('aws-sdk');

  var region = process.env.AWS_REGION || 'us-east-1';

  var simpledb = new AWS.SimpleDB({
    endpoint: 'sdb.amazonaws.com',
    region: region
  });

  var characterString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var randomString = Array(36).join().split(',').map(function () {
    return characterString.charAt(Math.floor(Math.random() * characterString.length));
  }).join('');

  var functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || 'chaos-slackbot-unknown-handle';

  var params = {
    Attributes: [
      {
        Name: 'Message',
        Value: text
      }
    ],
    DomainName: config.simpleDBDomainName,
    ItemName: new Date().toISOString() + '_' + region + '_' + functionName + '_' + randomString
  };

  simpledb.putAttributes(params, function (err) {

    if (err) {
      console.log(err, err.stack);
      cb(null, slack.error(err.message));
    } else {
      should_terminate();
    }

  });

}

function controlled_hours() {

  var momentBusinessDays = require('moment-business-days');
  var momentTimezone = require('moment-timezone');

  var currentTimezone = momentTimezone(new Date()).tz(config.timezone);

  var isBusinessDay = momentBusinessDays(currentTimezone.format()).isBusinessDay();

  var currentTime = (currentTimezone.hour() * 3600) + (currentTimezone.minute() * 60) + currentTimezone.second();

  var tenAm = (10 * 3600);
  var fourPm = (16 * 3600);

  return isBusinessDay && currentTime >= tenAm && currentTime < fourPm;
}

function should_terminate() {

  var AWS = require('aws-sdk');

  var region = process.env.AWS_REGION || 'us-east-1';

  var simpledb = new AWS.SimpleDB({
    endpoint: 'sdb.amazonaws.com',
    region: region
  });

  var params = {
    SelectExpression: 'select count(*) from ' + config.simpleDBDomainName,
    ConsistentRead: true
  };

  simpledb.select(params, function (err, data) {

    if (err) {

      console.log(err, err.stack);
      cb(null, slack.error(err.message));

    } else {

      var count = data.Items[0].Attributes[0].Value;

      if (count > config.terminationLimit) {
        terminate();
      }

    }

  });

}

function terminate() {

  // TODO:
  // - clean out domain
  // - discover instances
  // - terminate one instance
  // - construct message notifying the room of the instance that was terminated

}

exports.interact = interact;
