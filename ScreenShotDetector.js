'use strict';

const EventEmitter = require('events');
const Path = require('path');
const fs = require('fs');

const ScreenShotDetector = class ScreenShotDetector extends EventEmitter {
  constructor(path, amount = 6){
    super();
    this._path = path;
    this._files = [...new Array(amount)].map((_, index) =>
      `SavedScreen${amount - index - 1}.png`
    );
    this._watcher = null;
    super.on('update', file => {
      const index = this._files.indexOf(file);
      super.emit('screenshot', [
        ...this._files.slice(index),
        ...this._files.slice(0, index)
      ]);
    });
  }
  start(){
    if(this._watcher !== null) return false;
    const firstTime = [...new Array(this._files.length)].map(_ => true);
    this._watcher = fs.watch(this._path, (type, file) => {
      console.log(type, file);
      const index = this._files.indexOf(file);
      if(index === -1) return;
      if(firstTime[index]) return firstTime[index] = false;
      firstTime[index] = true;
      super.emit('update', file);
    });
    return true;
  }
  stop(){
    if(this._watcher === null) return false;
    watcher.close();
    return true;
  }
}

module.exports = ScreenShotDetector;
