// const edgar = 'edgar';
// const logger = ({ message }) => console.log(`logger: ${message}`);

// const message = { message: 'edgar' };
// logger({...message, message: 'new' });


var host = "127.0.0.1";
var port = 1234;
var express = require("express");

var app = express();
app.use('/', express.static(__dirname + '/'));
app.listen(port, host);

console.log('Running server at http://localhost:' + port + '/');