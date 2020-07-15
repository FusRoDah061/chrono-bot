require('dotenv').config();

function getSystemRoot() {
  var path = require("path");
  var os = require("os");
  return (os.platform == "win32") ? process.cwd().split(path.sep)[0] : "/";
}

function createLogger(module) {
  const manager = require('simple-node-logger').createLogManager();
  
  let opts = {
    dateFormat: 'YYYY-MM-DD',
    logDirectory: process.env.LOG_DIRECTORY || getSystemRoot(),
    fileNamePattern: process.env.LOG_FILENAME_PATTERN || 'chrono-bot-<DATE>.log'
  };  
     
  manager.createRollingFileAppender(opts);
  
  return manager.createLogger(module); 
}

module.exports = { getLogger: createLogger };