// Create web server
// Web server will listen on port 3000
// Web server will send back a response to any request
// Web server will send back a 404 error for any request that does not match a route

// Load the 'http' module
var http = require('http');

// Load the 'url' module
var url = require('url');

// Load the 'fs' module
var fs = require('fs');

// Create the web server
var server = http.createServer(function(req, res) {
  // Get the request URL
  var url_parts = url.parse(req.url);

  // Check the request method
  if(req.method == 'GET') {
    // Check the request URL
    if(url_parts.pathname == '/') {
      // Read the file 'index.html'
      fs.readFile('./index.html', function(err, data) {
        // Send the contents of 'index.html' to the client
        res.end(data);
      });
    } else if(url_parts.pathname == '/comments') {
      // Read the file 'comments.json'
      fs.readFile('./comments.json', function(err, data) {
        // Send the contents of 'comments.json' to the client
        res.end(data);
      });
    } else {
      // Send a 404 error
      res.statusCode = 404;
      res.end('404 Not Found');
    }
  } else if(req.method == 'POST') {
    if(url_parts.pathname == '/comments') {
      // Create a string to hold the data
      var data = '';

      // When the server receives data
      req.on('data', function(chunk) {
        // Append the data to the string
        data += chunk;
      });

      // When the server has received all the data
      req.on('end', function() {
        // Read the file 'comments.json'
        fs.readFile('./comments.json', function(err, fileData) {
          // Parse the file data
          var comments = JSON.parse(fileData);

          // Parse the data string
          var comment = JSON.parse(data);

          // Add the comment to the comments array
          comments.push(comment);

          // Write the comments array to the file
          fs.writeFile('./comments.json', JSON.stringify(comments), function(err) {
            // Send a response to the client
            res.end('Comment added');
          });
        });
      });
    } else {
      // Send a 404 error