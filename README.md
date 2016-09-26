<img align="right" src="https://raw.github.com/shinesolutions/chaos-slackbot/master/icon.png" alt="Icon"/>

[![Build Status](https://img.shields.io/travis/shinesolutions/chaos-slackbot.svg)](http://travis-ci.org/shinesolutions/chaos-slackbot)

Chaos Slackbot
--------------

Chaos is a [serverless](http://martinfowler.com/articles/serverless.html) [Slack bot](https://www.wired.com/2015/08/slack-overrun-bots-friendly-wonderful-bots/) for randomly terminating EC2 instance from [Auto Scaling Groups](http://docs.aws.amazon.com/autoscaling/latest/userguide/AutoScalingGroup.html) whitelist.

It's inspired by [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey), but the randomness is determined by what the chatters are talking about on a Slack channel. The bot wouldn't know up front what the humans will be saying and when they will say it, that's natural randomness we're taking advantage of.

TODO: sample interaction screenshot

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
    - **Customize Icon**: upload SiteChecker [radar icon](https://raw.githubusercontent.com/shinesolutions/chaos-slackbot/master/icon.png)
6. Click **Save Settings** button.

Next, the second part is to create the infrastructure on AWS.

1. [Install node.js](https://nodejs.org/en/download/package-manager/) .
2. Set up [AWS credential](https://serverless.com/framework/docs/providers/aws/setup/), to be used by [Serverless framework](https://serverless.com/).
3. Clone the repository: `git clone https://github.com/shinesolutions/chaos-slackbot` .
4. Configure the Slack token from the outgoing webhook custom integration settings in `conf/config.json` . Add the token to `allowedTokens` array property.
5. Install tools and dependencies: `make tools deps` .
6. Build the Lambda function and API Gateway: `make deploy` . The output of this command will show a POST endpoint, e.g. `https://id.execute-api.us-east-1.amazonaws.com/prod/handle`
8. Return to the Slack Outgoing WebHook custom integration settings page, and copy paste the POST endpoint from the command output to **URL(s)** setting, then click **Save Settings** button.

Usage
-----

1. Have the users join the Slack channel configured in the bot setting, e.g. #general .
2. Chaos bot will start consuming the messages from that channel, and when the algorithm hits, it will terminate a random EC2 instance.

Configuration
-------------

TODO

Development
-----------

Download service dependencies:

    make deps

Build the infrastructure with default prod stage:

    make deploy

Remove the infrastructure with default prod stage:

    make remove

Specify custom stage:

    STAGE=dev make deps deploy remove

Colophon
--------

This project is a submission to [AWS Serverless Chatbot Competition 2016](https://awschatbot.devpost.com/).

Chaos Slackbot astro monkey icon made by [Madebyoliver](http://www.flaticon.com/authors/madebyoliver) from [www.flaticon.com](http://www.flaticon.com) is licensed by [CC 3.0 BY](http://creativecommons.org/licenses/by/3.0/)
