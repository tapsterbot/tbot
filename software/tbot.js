var serialport_wait = require('serialport-wait')
var repl = require('repl')
var serial = require('./serial')
var Webserver = require('./web-server')

var BAUDRATE = 115200
var WEBPORT = process.env.WEBPORT || 8080
var portName

var serialport = new serialport_wait()
var webserver = new Webserver(WEBPORT, serialport)

checkArguments = function() {
  // Get command line port argument
  if (process.argv[2]) {
    portName = process.argv[2]
  } else {
    console.log('Error: Missing port argument')
    console.log('\nExample:')
    console.log('  node tbot.js /dev/ttyUSB0\n')
    process.exit(1)
  }
}

setUpREPL = async function() {
  var replServer = await repl.start({
    prompt: "> ",
    ignoreUndefined: true
  })
  replServer.on('exit', () => {
    process.exit(0)
  })
  
  replServer.context.serialport = serialport
}

init = async function() {
  checkArguments()
  console.log('Tbot Controller 1.0\n')
  await serial.findBotPort(serialport, portName)
  await serial.connect(serialport, portName, BAUDRATE)
  await webserver.start()
  await serial.homing(serialport)
  await setUpREPL()
}

init()
