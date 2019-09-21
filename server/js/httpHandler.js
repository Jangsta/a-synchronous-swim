const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');

// Path for the background image ///////////////////////
backgroundImageFile = path.join('.', 'background.jpg');
module.exports.backgroundImageFile = backgroundImageFile;
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};

module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  // var array = ['left', 'up', 'right', 'down'];
  // var rand = Math.floor(Math.random() * array.length);
  if (req.method === 'GET') {
    if(req.url === '/background') {
      console.log('AHHHH');
      // headers['Content-Type'] = 'image/jpeg';
      headers['Content-Type'] = 'text/html';
      fs.readFile('./js/background.jpg', function(err, data) {
        // console.log(data);
        if (err) throw err; // Fail if the file can't be read.
        //  res.writeHead(200, {'Content-Type': 'image/jpeg'});
        // res.write('<div><img src="data:image/jpeg;base64,')
        // res.write(data);
        // res.end();
        // res.end(data);

        // res.writeHead(200, {'Content-Type': 'text/html'});
        // res.writeHead(200, {'Content-Type': 'image/jpeg'});
        res.write('<img src="data:image/jpeg;base64,');
        res.write(data.toString());
        res.end();
        // res.end('"/>');
      });
    } else {
      console.log('messageQueue: ', messageQueue);
      res.end(messageQueue);
      messageQueue = null;
   }
  } else if (req.method === 'OPTIONS'){
    res.end();
  }
  next(); // invoke next() at the end of a request to help with testing!
};
