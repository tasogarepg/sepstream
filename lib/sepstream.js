'use strict';

var stream = require('stream');
var util = require('util');

module.exports = function(fn, opts) {
  return new SepStream(fn, opts);
};

function SepStream(fn, opts) {
  stream.Transform.call(this, opts);
  this.chunk = new Buffer(0);
  this.func = fn;
  this.sep = (opts && opts.sep !== undefined)
    ? (Buffer.isBuffer(opts.sep) ? opts.sep : new Buffer(opts.sep))
    : new Buffer('\n');
}
util.inherits(SepStream, stream.Transform);

SepStream.prototype._transform = function(chunk, encoding, cb) {
  if (!Buffer.isBuffer(chunk)) {
    chunk = new Buffer(chunk, encoding);
  }
  var bufs = split(Buffer.concat([this.chunk, chunk]), this.sep);
  this.chunk = bufs.pop();
  try {
    this.send(bufs);
  } catch(e) {
    return cb(e);
  }
  cb(null);
};

SepStream.prototype._flush = function(cb) {
  try {
    this.send([this.chunk]);
  } catch(e) {
    return cb(e);
  }
  cb(null);
};

SepStream.prototype.send = function(bufs) {
  bufs.forEach(function(buf) {
    var dat = this.func && this.func(buf);
    if (dat) this.push(dat);
  }, this);
};

function split(buf, sep) {
  var bufs = [];
  for (var i = 0, start = 0; i < buf.length; i++) {
    if (isSep(buf, i, sep)) {
      var end = i + sep.length;
      bufs.push(buf.slice(start, end));
      if (end === buf.length) {
        bufs.push(new Buffer(0));
      }
      start = end;
      i = end - 1;
    } else if (i === buf.length - 1) {
      bufs.push(buf.slice(start, buf.length));
      break;
    }
  }
  return bufs;
}

function isSep(buf, index, sep) {
  if (index + sep.length > buf.length) return false;
  for (var i = 0; i < sep.length; i++) {
    if (sep[i] !== buf[index + i]) return false;
  }
  return true;
}
