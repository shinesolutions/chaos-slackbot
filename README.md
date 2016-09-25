<img align="right" src="https://raw.github.com/shinesolutions/chaos-slackbot/master/icon.png" alt="Icon"/>

[![Build Status](https://img.shields.io/travis/shinesolutions/chaos-slackbot.svg)](http://travis-ci.org/shinesolutions/chaos-slackbot)

Chaos Slackbot
--------------

Chaos is a [serverless](http://martinfowler.com/articles/serverless.html) [Slack bot](https://www.wired.com/2015/08/slack-overrun-bots-friendly-wonderful-bots/) for randomly terminating EC2 instance from whitelisted [Auto Scaling Groups](http://docs.aws.amazon.com/autoscaling/latest/userguide/AutoScalingGroup.html).

It's inspired by [Chaos Monkey](https://github.com/Netflix/SimianArmy/wiki/Chaos-Monkey), but the randomness is determined by what the chatters are talking about on a Slack channel. The bot wouldn't know up front what the humans will be saying and when they will say it, that's natural randomness we're taking advantage of.

TODO: sample interaction screenshot

Architecture
------------

[![Architecture Diagram](https://raw.github.com/shinesolutions/chaos-slackbot/master/docs/architecture.jpg)](https://raw.github.com/shinesolutions/chaos-slackbot/master/docs/architecture.jpg)

Usage
-----

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
