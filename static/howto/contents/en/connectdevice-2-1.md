<h1 align="center">Connecting elfin devices to users</h1>

---------

## Elfin devices

To configure the devices for the first time, you also need the vendor software [IoTService](http://www.hi-flying.com/download-item-iotservice)
Once the software is installed, it is necessary to connect a physical device to a network or serial port to the computer running the software.
* General software help for IoTService: [Official document](http://www.hi-flying.com/index.php?route=tool/upload/download&code=5825d795832fd1998cd46aeafab9074c0c2114d3)
* Elfin EE1X: [Hardware Help](http://www.hi-flying.com/index.php?route=tool/upload/download&code=59167cf780d0b98d2175c857ad1240df7acdf9c4)
* Elfin EW1X [Hardware Help](http://www.hi-flying.com/index.php?route=tool/upload/download&code=c4d342467edef5f6080a569aa50223fc797e6899)
* [Additional tools](http://www.hi-flying.com/network-device)

>The full configuration is only available on the manufacturer's software or on the device's own web interface. For this reason, although difficult to use remotely, it is also worth registering the devices with the manufacturer's system: [IoT Bridge](http://bridge.hi-flying.com/?lang=en)

### General configuration

Open the device configuration window and configure:
* User/Password: Account for the remote and web interface of the device (Setting it to unique is highly recommended).
* HostName: The name of the device that will be displayed in Elfin Connect.
* DNS: A general DNS server. e.g.: 8.8.8.8
UART: Serial port settings.

![IoTService/Config](contents/_gfx/gFX-2-1-1.png)

### Connecting a device

Creating a new socket (New SOCKET)
* SOCKET Name: any name (pl.:elfinconnect)
Protocol: TCP Client
* Server Addr: remote elfin connect server address (by default: <span id="location"></span>)
* Server port: remote elfin connect server port (alapesetben: 8080)
* Connect Mode: Always
* Heartbeat: Enable
* Heartbeat Time: 30
* Registry Mode: Data

![IoTService/Config/NewSocket](contents/_gfx/gFX-2-1-2.png) 

The values of the following two attributes are available under the User tab in the Web interface.
* Heartbeat Serial
* The Registry Code

![/user](contents/_gfx/gFX-2-1-3.png)

### Use of Modbus
If you want to use the ModbusTCP protocol in your communication.
In the "Detail" menu, "UART Protocol" is required for settings, but "System" is also recommended.

* UART Protocol: Modbus

![IoTService/Config/Detail](contents/_gfx/gFX-2-1-4.png)