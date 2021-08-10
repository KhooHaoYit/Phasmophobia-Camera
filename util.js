'use strict';

const util = require('util');

const Registry = require('winreg');
const regKey = new Registry({ hive: Registry.HKLM, key: '\\SOFTWARE\\Wow6432Node\\Valve\\Steam' });

module.exports = {
  findSteamPath(){
    return new Promise((rs, rj) => regKey.get('InstallPath', (err, val) => err ? rj(err) : rs(val.value)));
  }
}
