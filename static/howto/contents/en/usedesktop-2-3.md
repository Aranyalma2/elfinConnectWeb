<h1 align="center">Establishing a connection through the app</h1>

---------

### Desktop App settings

User and server setup
* UUID: User unique identifier, located on the web interface
* Server: server address and port (format: address:port)
  + address: <span id="location"></span> (by default)
  + port: 8443
  
![Elfin Connect Desktop](contents/_gfx/gfx-2-3-1.png)

### Connect to the server

The "Apply and Connect" button will attempt to connect, if successful the table will show the devices registered to the user.

* If the data is formally correct, the application saves it and will try to connect automatically with this data on subsequent startups.

![Elfin Connect Desktop](contents/_gfx/gfx-2-3-2.png)

### Connecting to a remote device

Can be initiated for devices with "Online" status and no local port. 
* Select the device by clicking on the line.
* The "Open connection" button establishes the connection to the server. The value displayed in the port field is an open TCP port to which it is possible to connect locally.

![Elfin Connect Desktop](contents/_gfx/gfx-2-3-3.png)

In the case shown in the example, the tool is now available

* **localhost:55680** or **127.0.0.1:55680**

from the local machine.

The connection can be closed by clicking on the "Close connection" button.

### In case of error

If the connection fails or is interrupted, the application will display an error message. In the case of a failure, the currently active connections will be closed, if they are re-established, they will have to be re-opened manually.
The error can occur with the server in general or with the device in particular.