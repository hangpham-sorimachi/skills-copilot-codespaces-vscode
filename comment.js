// create a server
var express = require('express');
var app = express();
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();

// set up body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// set up server
app.use(express.static(path.join(__dirname, 'public')));

// set up router
app.use('/', router);

// get comments
app.get('/comments', function(req, res) {
  fs.readFile(__dirname + '/public/comments.json', 'utf8', function(err, data) {
    res.end(data);
  });
});

// post comments
app.post('/comments', function(req, res) {
  fs.readFile(__dirname + '/public/comments.json', 'utf8', function(err, data) {
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile(__dirname + '/public/comments.json', JSON.stringify(comments, null, 4), function(err) {
      res.end(JSON.stringify(comments));
    });
  });
});

// start server
var server = app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
