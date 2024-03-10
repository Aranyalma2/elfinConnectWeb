<h1 align="center">Elfin Connect Desktop</h1>

---

## About the app

The application can list and bridge remote connections to the remote device. The user connects to the local TCP server open on the local computer to access the remote device as if he were connecting directly to it. Each device creates its own local server and can therefore connect to any endpoint at the same time.

## The interface

-   **User and Server** The UUID field is used to enter the unique identifier of the user, and the address and port of the remote connecting server. The "Apply and Connect" button saves and initiates an automatic connection.
-   **Server connection status** Connection status
    -   Disconnected : Unsuccessful connection
    -   Connecting : Connection in progress
    -   Connected : Successful connection
-   **Table** In case of a successful connection, the user's devices are displayed here.
    -   After a device is selected, it is possible to establish a remote connection by clicking on the "Open connection" button, for this it is necessary that the device is "Online" and no local server is already open (Running port: none).
    -   "Close connection" can be used to close the connection and the running server.
