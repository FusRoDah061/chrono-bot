function createLogger(module) {
  return require('simple-node-logger').createSimpleLogger(); 
}

module.exports = { getLogger: createLogger };