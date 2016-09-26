function error(message) {
  return {text: 'Error: ' + message};
}

function success(message) {
  return {text: message};
}

function terminated(instanceId) {
  return {
    'attachments': [{
      text: 'Hello humans, I am your friendly test bot. I just randomly terminated server ' + instanceId +' to help the technical team with continuously testing our cloud infrastructure. Have a nice day everyone.',
      color: 'danger'
    }]
  };

}

exports.error = error;
exports.success = success;
exports.terminated = terminated;
