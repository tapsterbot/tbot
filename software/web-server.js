var express = require('express')
var bodyParser = require('body-parser')

var app = express()
var jsonParser = bodyParser.json()


class Webserver {

  constructor(webport, serialport) {
    this.webport = webport
    this.serialport = serialport
  }

  async start() {
    await this.init()
    await this.listen()
  }

  async init() {
    app.use(bodyParser.json());

    app.use((err, req, res, next) => {
      if (err) {
        console.log('Invalid request data:\n ', err.toString())
        res.send(JSON.stringify('Invalid request data') + '\n')
      } else {
        next()
      }
    })

    app.get('/', function (req, res) {
      res.send('Welcome to Tapster Tbot!')
    })

    app.post('/go', jsonParser, async (req, res) => {
      if ((typeof req.body.x === 'undefined') ||
          (typeof req.body.y === 'undefined')) {
         console.log('Invalid request data:\n ', req.body)
         res.status(400).send(JSON.stringify('Invalid request') + '\n')

      } else {
        var x = req.body.x
        var y = req.body.y

        if ((typeof x !== 'number') || (typeof y !== 'number')) {
            console.log('Invalid request data:\n ', req.body)
            res.status(400).send(JSON.stringify('Invalid request') + '\n')
        } else {
          // Move to position
          console.log('Go Request:', req.body)
          await this.serialport.sendln(`G0 X${x} Y${y}`)
          await this.serialport.wait('ok\r\n').then( result => {
            this.serialport.get_buffer_wait()
            console.log('Moving to: (', x, ',', y, ')')
            console.log('OK')
            res.send(JSON.stringify('OK') + '\n')
          })
        } 
      }
    })


    app.post('/up', async (req, res) => {
      console.log('Stylus Up Request')
      // Move to position
      await this.serialport.sendln('G0 Z-1')
      await this.serialport.wait('ok\r\n').then( result => {
        this.serialport.get_buffer_wait()
        console.log('Moving stylus up')
        console.log('OK')
        res.send(JSON.stringify('OK') + '\n')
      })
    })

    app.post('/down', async (req, res) => {
      console.log('Stylus Down Request')
      // Move to position
      await this.serialport.sendln('G0 Z1')
      await this.serialport.wait('ok\r\n').then( result => {
        this.serialport.get_buffer_wait()
        console.log('Moving stylus down')
        console.log('OK')
        res.send(JSON.stringify('OK') + '\n')
      })
    })


    app.post('/home', async (req, res) => {
      console.log('Homing Request')
      // Move to position
      await this.serialport.sendln('$h')
      await this.serialport.wait('ok\r\n').then( result => {
        this.serialport.get_buffer_wait()
        console.log('OK')
        res.send(JSON.stringify('OK') + '\n')
      })
    })

  }

  async listen() {
    await app.listen(this.webport, () => {
      console.log('Web server now listening on port ' + this.webport)
    })
  }

}

module.exports = Webserver
