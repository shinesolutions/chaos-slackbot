<img align="right" src="https://raw.github.com/shinesolutions/chaos-slackbot/master/icon.png" alt="Icon"/>

[![Build Status](https://img.shields.io/travis/shinesolutions/chaos-slackbot.svg)](http://travis-ci.org/shinesolutions/chaos-slackbot)

Chaos Slackbot
--------------

Chaos is a [serverless](http://martinfowler.com/articles/serverless.html) [Slack bot](https://www.wired.com/2015/08/slack-overrun-bots-friendly-wonderful-bots/) for randomly terminating EC2 instance from [Auto Scaling Groups](http://docs.aws.amazon.com/autoscaling/latest/userguide/AutoScalingGroup.html) whitelist.

It's inspired by [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey), but the randomness is determined by what the chatters are talking about on a Slack channel. The bot wouldn't know up front what the humans will be saying and when they will say it, that's natural randomness we're taking advantage of.

Here's an example of a conversation between Bruce Wayne and Tony Stark on a Slack channel, which messages are analysed by Chaos bot, and are used to determine whether to terminate a random EC2 instance.

[![Sample Interaction Screenshot](https://raw.github.com/shinesolutions/chaos-slackbot/master/docs/sample_interaction.jpg)](https://raw.github.com/shinesolutions/chaos-slackbot/master/docs/sample_interaction.jpg)

Architecture
------------

Chaos has two components, a bot that's configured on Slack, and a piece of infrastructure on [AWS](https://aws.amazon.com/).

The bot is a Slack [outgoing webhook](https://api.slack.com/outgoing-webhooks) custom integration.

The infrastructure on AWS is a Lambda function that receives POST requests from the Slack bot via an API Gateway, it parses the messages using a simple natural language processing [speakeasy-nlp](https://www.npmjs.com/package/speakeasy-nlp) package, those messages will then be used to determine whether to terminate a random EC2 instance from the specified Auto Scaling Groups.

Chaos currently supports a mode called `sentiment`, which processes the messages based on positive/negative sentiment using speakeasy-nlp. It is easy to introduce new modes in the future for other processing algorithm(s).

[![Architecture Diagram](https://raw.github.com/shinesolutions/chaos-slackbot/master/docs/architecture.jpg)](https://raw.github.com/shinesolutions/chaos-slackbot/master/docs/architecture.jpg)

Installation
------------

There are two parts to install, the bot on Slack, and the infrastructure on AWS.

Let's install the bot first by creating a Slack outgoing webhook custom integration.

1. Go to your Slack account's custom integrations page at `https://account.slack.com/apps/manage/custom-integrations` .
2. The page will show the available custom integrations. Click on **Outgoing WebHooks** link.
3. Click **Add Configuration** button.
4. Click **Add Outgoing WebHooks integration** button.
5. Fill in the integration settings:
    - **Channel**: select the channel where you want the bot to be running on, pick a channel with many users, e.g. #general
    - **Trigger Word(s)**: leave this empty because we want to consume all messages
    - **URL(s)**: leave this empty for now, we'll go back to this option after the infrastructure is built.
    - **Token**: Slack will generate the token for you, this token will be configured in Lambda function.
    - **Descriptive Label**: description for this custom integration, e.g. **Chaos Outgoing WebHook**
    - **Customize Name**: the name of your bot, e.g. **Chaos**
    - **Customize Icon**: upload Chaos [astro monkey icon](https://raw.githubusercontent.com/shinesolutions/chaos-slackbot/master/icon.png)
6. Click **Save Settings** button.

Next, the second part is to create the infrastructure on AWS.

1. [Install node.js](https://nodejs.org/en/download/package-manager/) .
2. Set up [AWS credential](https://serverless.com/framework/docs/providers/aws/setup/), to be used by [Serverless framework](https://serverless.com/).
3. Clone the repository: `git clone https://github.com/shinesolutions/chaos-slackbot` .
4. Configure the Slack token from the outgoing webhook custom integration settings in `conf/config.json` . Add the token to `allowedTokens` array property.
5. Configure the Auto Scaling Group names in `conf/config.json` to `autoScalingGroupNames` array property. (TODO: move this to SimpleDB so this can be programatically configured outside of Chaos Slackbot)
6. Install tools and dependencies: `make tools deps` .
7. Build the Lambda function and API Gateway: `make deploy` . The output of this command will show a POST endpoint, e.g. `https://id.execute-api.us-east-1.amazonaws.com/prod/handle`
8. Return to the Slack Outgoing WebHook custom integration settings page, and copy paste the POST endpoint from the command output to **URL(s)** setting, then click **Save Settings** button.

Usage
-----

1. Have the users join the Slack channel configured in the bot setting, e.g. #general .
2. Chaos bot will start consuming the messages from that channel, and when the algorithm hits, it will terminate a random EC2 instance.

Configuration
-------------

Chaos Slack bot Lambda function can be configured in [conf/config.json](https://github.com/shinesolutions/sitechecker-slackbot/blob/master/conf/config.json) .

| Name                  | Description |
|-----------------------|-------------|
| allowedTokens         | An array of allowed Slack tokens. If any is specified, then only incoming requests with that token are accepted. If left empty, then all incoming requests are accepted. |
| mode                  | Chaos mode to determine message processing rule, currently only supports `sentiment` . |
| ignoredUserNames      | An array of Slack usernames to be ignored, at the very least you want to ignore `slackbot` . |
| controlledStartHour   | Start hour of the day when Chaos bot is allowed to terminate EC2 instance. Valid value: 0 to 24. |
| controlledEndHour     | End hour of the day when Chaos bot is no longer allowed to terminate EC2 instance. Valid value: 0 to 24. |
| timezone              | Timezone for controlledStartHour and controlledEndHour. Use [Moment Timezone](http://momentjs.com/timezone/) to find valid timezone values. |
| terminationLimit      | The number of message hits before Chaos terminates a random EC2 instance. The specified mode determines how a message hit is calculated. |
| autoScalingGroupNames | An array of whitelisted Auto Scaling Group names. EC2 instances that belong to these Auto Scaling Groups are candidates for termination. |
| simpleDBDomainName    | The name of SimpleDB database domain. |

Development
-----------

Install [Serverless](https://serverless.com/) framework and other tools:

    make tools

Download library dependencies:

    make deps

Build the infrastructure with default prod stage:

    make deploy

Remove the infrastructure with default prod stage:

    make remove

Specify custom stage:

    STAGE=dev make deps deploy remove

Colophon
--------

Chaos Slackbot astro monkey icon made by [Madebyoliver](http://www.flaticon.com/authors/madebyoliver) from [www.flaticon.com](http://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)

[Demo video](https://www.youtube.com/watch?v=q5w5VX4tAD4) background music [Epic and Dark Electronic Music - Welcome to Chaos (Copyright and Royalty Free) by Ross Bugden](https://www.youtube.com/watch?v=q5w5VX4tAD4).

This project is a submission to [AWS Serverless Chatbot Hackathon 2016](https://awschatbot.devpost.com/) - with self-imposed 24-hour total time limit scattered across several days/nights.
