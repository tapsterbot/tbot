//var serialport_wait = require('serialport-wait')
//var port = new serialport_wait()

exports.findBotPort = async function(port, portName) {
  var foundPort = false
  await port.listAll().then(results => {
    for(let item of results) {
      //if (item.comName.search(/usb|acm|^com/i) !== -1) {
      //  console.log('Found port:', item.comName)
      //  foundPort = true
      //}
      if (item.comName === portName) {
        console.log('Serial port:', item.comName)
        foundPort = true
      }
    }
  })

  if (!foundPort) {
    console.log('Error: Robot not found. Is it plugged in?')
    process.exit(1)
  }
}

exports.connect = async function(port, portname, baudrate) {
  await port.connect(portname, baudrate)
}

exports.homing = async function(port) {
  await port.wait('[MSG:').then( result => {
    var str = port.get_buffer_wait()
    str = str.substr(0,str.length-3)

    //console.log('Message:', str)
    console.log('Homing...')
  })
  await port.sendln('$h')
  await port.wait('ok\r\n').then( result => {
    port.get_buffer_wait()
    console.log('Ready!')
  })
}
