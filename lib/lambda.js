const bot = require('./bot');

module.exports.handle = (event, context, cb) => bot.interact(event.body, cb);
