const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('*', function (request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

(function () {
  var cluster = require('cluster');
  if (cluster.isMaster) {
    return (
      cluster.fork() &&
      cluster.on('exit', function () {
        cluster.fork();
      })
    );
  }

  var fs = require('fs');
  var config = { port: 8765 };
  var Gun = require('gun');

  if (process.env.HTTPS_KEY) {
    config.key = fs.readFileSync(process.env.HTTPS_KEY);
    config.cert = fs.readFileSync(process.env.HTTPS_CERT);
    config.server = require('https').createServer(config, Gun.serve(__dirname));
  } else {
    config.server = require('http').createServer(Gun.serve(__dirname));
  }

  var gun = Gun({
    web: config.server.listen(8765),
    config,
  });
  console.log('Relay peer started on port ' + 8765 + ' with /gun');

  module.exports = gun;
  const listener = app.listen(process.env.PORT || 5151, function () {
    console.log('Your app is listening on port ' + listener.address().port);
  });
})();
