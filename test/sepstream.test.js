var fs = require('fs');
var path = require('path');
var assert = require('assert');
var sepstream = require('..');

describe('sepstream', function() {
  var fileCnt = 0;
  var makePath = function(cnt) {
    return path.join(__dirname, 'out_' + cnt + '.dat');
  };
  var getOutPath = function() {
    return makePath(fileCnt++);
  };

  after(function() {
    for (var i = 0; i < fileCnt; i++) {
      (function(i) {
        var p = makePath(i);
        fs.exists(p, function (exists) {
          exists && fs.unlink(p, function(err){});
        });
      })(i);
    }
  });

  it('simple pipe utf8.txt', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', 'utf8.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      return data;
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('simple pipe sjis.txt', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', 'sjis.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      return data;
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('simple pipe 4x1.txt', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '4x1.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      return data;
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('simple pipe 10x4.txt', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      return data;
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('simple pipe 10x4.txt with highWaterMark (r:8 s:8 w:8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn, {
      highWaterMark: 8
    })
    .pipe(sepstream(function(data) {
      return data;
    }, {
      highWaterMark: 8
    }))
    .pipe(fs.createWriteStream(fileOut, {
      highWaterMark: 8
    }))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('simple pipe 10x4.txt with highWaterMark (r:8 s:16 w:8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn, {
      highWaterMark: 8
    })
    .pipe(sepstream(function(data) {
      return data;
    }, {
      highWaterMark: 16
    }))
    .pipe(fs.createWriteStream(fileOut, {
      highWaterMark: 8
    }))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('simple pipe 10x4.txt with highWaterMark (r:16 s:8 w:8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn, {
      highWaterMark: 16
    })
    .pipe(sepstream(function(data) {
      return data;
    }, {
      highWaterMark: 8
    }))
    .pipe(fs.createWriteStream(fileOut, {
      highWaterMark: 8
    }))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('change data at func 4x1.txt', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '4x1.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      return new Buffer(data.toString().replace(/0|2/g, '1'));
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var out = fs.readFileSync(fileOut).toString();
      assert.deepEqual(out, '1113');
      done();
    });
  });

  it('change data at func 10x4.txt', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      return new Buffer(data.toString().replace(/0123456789/, 'abcdefghij'));
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var out = fs.readFileSync(fileOut).toString();
      assert.deepEqual(out, 'abcdefghij\nabcdefghij\nabcdefghij\nabcdefghij');
      done();
    });
  });

  it('change data at func 10x4.txt with highWaterMark (r:8 s:8 w:8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn, {
      highWaterMark: 8
    })
    .pipe(sepstream(function(data) {
      return new Buffer(data.toString().replace(/0123456789/, 'abcdefghij'));
    }, {
      highWaterMark: 8
    }))
    .pipe(fs.createWriteStream(fileOut, {
      highWaterMark: 8
    }))
    .on('finish', function() {
      var out = fs.readFileSync(fileOut).toString();
      assert.deepEqual(out, 'abcdefghij\nabcdefghij\nabcdefghij\nabcdefghij');
      done();
    });
  });

  it('change data at func 10x4.txt with highWaterMark (r:8 s:16 w:8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn, {
      highWaterMark: 8
    })
    .pipe(sepstream(function(data) {
      return new Buffer(data.toString().replace(/0123456789/, 'abcdefghij'));
    }, {
      highWaterMark: 16
    }))
    .pipe(fs.createWriteStream(fileOut, {
      highWaterMark: 8
    }))
    .on('finish', function() {
      var out = fs.readFileSync(fileOut).toString();
      assert.deepEqual(out, 'abcdefghij\nabcdefghij\nabcdefghij\nabcdefghij');
      done();
    });
  });

  it('change data at func 10x4.txt with highWaterMark (r:16 s:8 w:8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn, {
      highWaterMark: 16
    })
    .pipe(sepstream(function(data) {
      return new Buffer(data.toString().replace(/0123456789/, 'abcdefghij'));
    }, {
      highWaterMark: 8
    }))
    .pipe(fs.createWriteStream(fileOut, {
      highWaterMark: 8
    }))
    .on('finish', function() {
      var out = fs.readFileSync(fileOut).toString();
      assert.deepEqual(out, 'abcdefghij\nabcdefghij\nabcdefghij\nabcdefghij');
      done();
    });
  });

  it('func not return val', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', 'utf8.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      ;
    }))
    .pipe(fs.createWriteStream(fileOut))
    .on('finish', function() {
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, new Buffer(0));
      done();
    });
  });

  it('func called by line', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected = '0123456789' + ((count !== 4) ? '\n' : '');
      assert.equal(data.toString(), expected);
    }))
    .on('finish', function() {
      assert.equal(count, 4);
      done();
    });
  });

  it('func called by line utf8.txt', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', 'utf8.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
    }))
    .on('finish', function() {
      assert.equal(count, 3);
      done();
    });
  });

  it('func called by line sjis.txt', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', 'sjis.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
    }))
    .on('finish', function() {
      assert.equal(count, 3);
      done();
    });
  });

  it('set buffer sep', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected;
      if (count === 1) expected = '012';
      else if (count !== 5) expected = '3456789\n012';
      else if (count === 5) expected = '3456789';
      assert.equal(data.toString(), expected);
    }, {
      sep: new Buffer([0x32])
    }))
    .on('finish', function() {
      assert.equal(count, 5);
      done();
    });
  });

  it('set multibyte buffer sep', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected;
      if (count === 1) expected = '01234';
      else if (count !== 5) expected = '56789\n01234';
      else if (count === 5) expected = '56789';
      assert.equal(data.toString(), expected);
    }, {
      sep: new Buffer([0x32, 0x33, 0x34])
    }))
    .on('finish', function() {
      assert.equal(count, 5);
      done();
    });
  });

  it('set array sep', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected;
      if (count === 1) expected = '012';
      else if (count !== 5) expected = '3456789\n012';
      else if (count === 5) expected = '3456789';
      assert.equal(data.toString(), expected);
    }, {
      sep: [0x32]
    }))
    .on('finish', function() {
      assert.equal(count, 5);
      done();
    });
  });

  it('set multibyte array sep', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected;
      if (count === 1) expected = '01234';
      else if (count !== 5) expected = '56789\n01234';
      else if (count === 5) expected = '56789';
      assert.equal(data.toString(), expected);
    }, {
      sep: [0x32, 0x33, 0x34]
    }))
    .on('finish', function() {
      assert.equal(count, 5);
      done();
    });
  });

  it('set string sep', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected;
      if (count === 1) expected = '012';
      else if (count !== 5) expected = '3456789\n012';
      else if (count === 5) expected = '3456789';
      assert.equal(data.toString(), expected);
    }, {
      sep: '2'
    }))
    .on('finish', function() {
      assert.equal(count, 5);
      done();
    });
  });

  it('set multibyte string sep', function(done) {
    var count = 0;
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      count++;
      var expected;
      if (count === 1) expected = '01234';
      else if (count !== 5) expected = '56789\n01234';
      else if (count === 5) expected = '56789';
      assert.equal(data.toString(), expected);
    }, {
      sep: '234'
    }))
    .on('finish', function() {
      assert.equal(count, 5);
      done();
    });
  });

  it('set encoding (r:utf8 s:utf8 w:utf8)', function(done) {
    var fileOut = getOutPath();
    var fileIn = path.join(__dirname, 'fixtures', 'utf8.txt');
    fs.createReadStream(fileIn, {
      encoding: 'utf8'
    })
    .pipe(sepstream(function(data) {
      return data;
    }, {
      encoding: 'utf8'
    }))
    .pipe(fs.createWriteStream(fileOut, {
      encoding: 'utf8'
    }))
    .on('finish', function() {
      var src = fs.readFileSync(fileIn);
      var out = fs.readFileSync(fileOut);
      assert.deepEqual(out, src);
      done();
    });
  });

  it('throw exception from _transform()', function(done) {
    var fileIn = path.join(__dirname, 'fixtures', '10x4.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      throw new Error('error1');
    }))
    .on('error', function (err) {
      assert.equal(err.message, 'error1');
      done();
    });
  });

  it('throw exception from _flush()', function(done) {
    var fileIn = path.join(__dirname, 'fixtures', '4x1.txt');
    fs.createReadStream(fileIn)
    .pipe(sepstream(function(data) {
      throw new Error('error1');
    }))
    .on('error', function (err) {
      assert.equal(err.message, 'error1');
      done();
    });
  });

});