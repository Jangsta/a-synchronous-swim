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
  // console.log('Serving request type ' + req.method + ' for url ' + req.url);
  res.writeHead(200, headers);
  // headers['Content-Type'] = 'image/jpeg';
  // if (!fs.existsSync('.' + req.url)) {
  //   console.error('err')
  //     res.writeHead(404, headers);
  //     res.end();
  // };
  // fs.access('./background.jpg', fs.F_OK, (err) => {
  //   if (err) {
  //     console.error('err')
  //     res.writeHead(404, headers);
  //     res.end();
  //   }
  //   //file exists
  // })

  // var array = ['left', 'up', 'right', 'down'];
  // var rand = Math.floor(Math.random() * array.length);
  if (req.method === 'POST') {
    // Buffer.concat([this._data, Buffer.from(data)]);
    var buf = Buffer.alloc(0);
    req.on('data', function(data) {
      buf = Buffer.concat([buf, data])
      console.log('buf: ', buf);
      var newFile = multipart.getFile(buf);
      console.log('newFile: ', newFile);

      fs.writeFile("./js/background.jpg", newFile, function(err) {
          if(err) {
              return console.log(err);
          }
          res.write(newFile);
          res.end();

          console.log("The file was saved!");
      });
    });
    next();
  }

  if (req.method === 'GET') {
    if(req.url === '/background.jpg') {
      headers['Content-Type'] = 'image/jpeg';

      fs.readFile('./js/background.jpg', function(err, data) {
        if (err) {
        console.log(err);
         } // Fail if the file can't be read.
        res.write(data, 'binary');
        res.end();
        next();
      });
    } else {
      console.log('messageQueue: ', messageQueue);
      res.end(messageQueue);
      messageQueue = null;
      next();
   }
  } else if (req.method === 'OPTIONS'){
    res.end();
    next();
  }
  // invoke next() at the end of a request to help with testing!
};
