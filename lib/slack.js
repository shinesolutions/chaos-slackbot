function error(message) {
  return {text: 'Error: ' + message};
}

function success(message) {
  return {text: message};
}

function terminated(instanceId) {
  return {
    'attachments': [{
      title: 'Terminated instance ' + instanceId,
      text: 'The monkeys have been unleashed and have terminated your instance.',
      color: 'danger'
    }]
  };

}

exports.error = error;
exports.success = success;
exports.terminated = terminated;
