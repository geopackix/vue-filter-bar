const express = require('express');

const app = express();
const port = 3001

//make 'example' folder available.
app.use('/', express.static(__dirname + '/example'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/assets', express.static(__dirname + '/src/assets'));

app.listen(port, function () {
  console.log('Example is running on port ' + port);
  console.log('Open "localhost:'+port+'/" in your browser.');
});