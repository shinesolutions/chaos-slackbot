function error(message) {
  return { text: 'Error: ' + message };
}

function success(message) {
  return { text: message };
}

exports.error = error;
exports.success = success;
