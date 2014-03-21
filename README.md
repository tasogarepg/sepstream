# sepstream

A stream separating utility for Node.js.

## Installation

    $ npm install sepstream

## Usage
```js
var fs = require('fs');
var sepstream = require('sepstream');

fs.createReadStream('/path/to/file1')
.pipe(sepstream(function(data) {
  // data comes for every line.
  console.log(data.toString());
}))
```

### pipe
```js
var fs = require('fs');
var sepstream = require('sepstream');

fs.createReadStream('/path/to/file1')
.pipe(sepstream(function(data) {
  var str = data.toString();          // data comes for every line.
  str = str.replace(/abcd/, 'efgh');  // modify str
  return new Buffer(str);             // send to next pipe
}))
.pipe(fs.createWriteStream('/path/to/file2'));
```

### set separator
```js
var fs = require('fs');
var sepstream = require('sepstream');

fs.createReadStream('/path/to/file1')
.pipe(sepstream(function(data) {
  console.log(data.toString());
}, {
  sep: '\r\n'   // set separator. default: '\n'
}))
```

### set binary separator
```js
var fs = require('fs');
var sepstream = require('sepstream');

fs.createReadStream('/path/to/file1')
.pipe(sepstream(function(data) {
  console.log(data);
}, {
  sep: [0x32, 0x33, 0x34]
}))
```

### Error handling
```js
var fs = require('fs');
var sepstream = require('sepstream');

fs.createReadStream('/path/to/file1')
.pipe(sepstream(function(data) {
  throw new Error('error1');
}))
.on('error', function (err) {
  console.log(err.message);   // error1
})
```

## License

The MIT License
