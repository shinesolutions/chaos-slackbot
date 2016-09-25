<img align="right" src="https://raw.github.com/shinesolutions/chaos-slackbot/master/icon.png" alt="Icon"/>

[![Build Status](https://img.shields.io/travis/shinesolutions/chaos-slackbot.svg)](http://travis-ci.org/shinesolutions/chaos-slackbot)

Chaos Slackbot
--------------

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
