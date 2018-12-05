# Tbot
Controller software library for the Tapster Tbot robot

## Install:

_Run in a terminal window:_

    git clone https://github.com/tapsterbot/tbot.git
    cd tbot/software
    npm install

## Run:

Run in a terminal window: _(You'll need to know the serial port of your connected device.)_

    node tbot.js <serialport>

Example:

    node tbot.js /dev/ttyUSB0


If everything is working, this is what the terminal window will look like:

    $ node tbot.js /dev/ttyUSB0
    Tbot Controller 1.0

    Serial port: /dev/ttyUSB0
    Web server now listening on port 8080
    Homing...
    Ready!
    > 

