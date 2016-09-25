/*jslint node: true */
'use strict';

const config = require('../conf/config.json');
const mode = require('./modes/' + config.mode);
const slack = require('./slack');

const AWS = require('aws-sdk');
const momentBusinessDays = require('moment-business-days');
const momentTimezone = require('moment-timezone');

const region = process.env.AWS_REGION || 'us-east-1';
const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || 'chaos-slackbot-unknown-handle';

AWS.config = {
  region: region,
  apiVersions: {
    ec2: '2016-04-01',
    simpledb: '2009-04-15',
    autoscaling: '2011-01-01'
  }
};

function interact(data, cb) {

  if (config.allowedTokens.length > 0 && config.allowedTokens.indexOf(data.token) === -1) {

    const message = 'Your Slack app token is not recognised by Chaos Slackbot server.';
    cb(null, slack.error(message));

    //TODO: call controlledHours
    //TODO: max terminations per day
    // } else if (isValidUser(data.user_name) && controlledHours() && mode.isHit(data.text)) {

  } else if (isValidUser(data.user_name) && mode.isHit(data.text)) {

    store(data.text, cb);

  } else {
    cb();
  }

}

function isValidUser(user_name) {
  return user_name && config.ignoredUserNames.length > 0 && config.ignoredUserNames.indexOf(user_name) === -1;
}

function store(text, cb) {

  const simpledb = new AWS.SimpleDB();

  const params = {
    DomainName: config.simpleDBDomainName
  };

  simpledb.createDomain(params, function (err, data) {

    if (err) {

      console.log(err, err.stack);
      cb(null, slack.error(err.message));

    } else {

      const characterString = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const randomString = Array(36).join().split(',').map(function () {
        return characterString.charAt(Math.floor(Math.random() * characterString.length));
      }).join('');

      const params = {
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
          shouldTerminate(cb);
        }

      });

    }

  });

}

function controlledHours() {

  const currentTimezone = momentTimezone(new Date()).tz(config.timezone);
  const isBusinessDay = momentBusinessDays(currentTimezone.format()).isBusinessDay();
  const currentTime = (currentTimezone.hour() * 3600) + (currentTimezone.minute() * 60) + currentTimezone.second();

  const startHour = config.controlledStartHour * 3600;
  const endHour = config.controlledEndHour * 3600;

  return isBusinessDay && currentTime >= startHour && currentTime < endHour;
}

function shouldTerminate(cb) {

  const simpledb = new AWS.SimpleDB();

  const params = {
    SelectExpression: 'select count(*) from ' + config.simpleDBDomainName,
    ConsistentRead: true
  };

  simpledb.select(params, function (err, data) {

    if (err) {

      console.log(err, err.stack);
      cb(null, slack.error(err.message));

    } else {

      const count = data.Items[0].Attributes[0].Value;

      if (Number(count) > Number(config.terminationLimit)) {
        terminate(cb);
      } else {
        cb();
      }

    }

  });

}

function extractInstanceIdArray(autoScalingGroups) {

  const instanceIdArray = [];

  for (let i = 0, l = autoScalingGroups.length; i < l; i++) {

    const autoScalingGroup = autoScalingGroups[i];

    for (let j = 0, m = autoScalingGroup.Instances.length; j < m; j++) {

      const instance = autoScalingGroup.Instances[j];

      if (instance.LifecycleState === "InService") {
        instanceIdArray.push(instance.InstanceId);
      }

    }

  }

  return instanceIdArray;

}

function terminateInstance(instanceId, cb) {

  const ec2 = new AWS.EC2();

  const params = {
    InstanceIds: [
      instanceId
    ]
  };

  ec2.terminateInstances(params, function (err, data) {

    if (err) {

      console.log(err, err.stack);
      cb(null, slack.error(err.message));

    } else {

      cb(null, slack.terminated(instanceId));

      cleanUp(cb);

    }

  });

}

function terminate(cb) {

  const autoscaling = new AWS.AutoScaling();

  const params = {
    AutoScalingGroupNames: config.autoScalingGroupNames
  };

  autoscaling.describeAutoScalingGroups(params, function (err, data) {

    if (err) {

      console.log(err, err.stack);
      cb(null, slack.error(err.message));

    } else {

      const instanceIdArray = extractInstanceIdArray(data.AutoScalingGroups);

      const randomNumber = Math.floor(Math.random() * (instanceIdArray.length - 1));

      const randomInstanceId = instanceIdArray[randomNumber];

      terminateInstance(randomInstanceId, cb);

      // TODO:
      // record termination

    }

  });


}

function cleanUp(cb) {

  const simpledb = new AWS.SimpleDB();

  var params = {
    DomainName: config.simpleDBDomainName
  };

  simpledb.deleteDomain(params, function (err, data) {

    if (err) {
      console.log(err, err.stack);
      cb(null, slack.error(err.message));
    }

  });


}

exports.interact = interact;
