'use strict';

const folder = `D:/Steam/steamapps/common/Phasmophobia`;
const port = 3009;

const Path = require('path');
const http = require('http');
const fs = require('fs');
const WebSocket = require('ws');
const express = require('express');
const ScreenShotDetector = require('./ScreenShotDetector');

const app = express();
app.get('/screenshot/:fileName', (req, res, next) => {
  const fileName = req.params.fileName;
  if(fileName.indexOf('/') !== -1) return next();
  res.sendFile(Path.resolve(folder, fileName));
});
app.use(express.static(Path.resolve(__dirname, 'root')));
app.all('*', (req, res) => res.sendStatus(404));

const httpServer = http.createServer(app);

const wss = new WebSocket.Server({ server: httpServer });
const listeners = new Set();
const broadcast = data => {
  for(const ws of listeners) ws.send(data);
};
wss.on('connection', ws => {
  listeners.add(ws);
  ws.on('close', () => listeners.delete(ws));
});

const detector = new ScreenShotDetector(folder);
detector.on('screenshot', files => broadcast(files[0]));
detector.start();

httpServer.listen(port);
console.log(`http is listening at: localhost:${port}`);

process.stdin.on('data', async buf => {
  try{
    console.log(eval(buf + ''));
  }catch(err){ console.log(err); };
});
