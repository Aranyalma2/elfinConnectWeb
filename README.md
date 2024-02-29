# Elfin Connect WebUI

* Elfin Connect service Web UI, not a standalone application, for basic functionalities, must have a MongoDB connection. It will use multiple documents for general data and files (with GridFS).
* For full functionality, you have to run Elfin Connect Server. This service will create most of the data that is accessible and manageable from the WebUI.

## First login
After a full application deployment, for the first login, you have to set up and create a profile with the highest privileges.
1. Load setup page.
```
https://your-domain.com/setup
```
2. Create a profile and login with it.

>Setup page will be disabled after a valid user created and leave the page.

## Basic functionalities

### Home page
Statistics availability of devices.

### User Page
User's attributums, uuid, elfin strings.
Change password.

### Devices
User's devices. List them, able to sorting them, and delete.
Page will auto reload every 60 seconds.

### Downloads
Administrators able to upload files.
Users can download them.
Default sorting by upload date.

### Register
Administrators able to register new users

#### Extra functionalities
* change language (en/hu)

## 🌟 Upcoming Features
* :gear: proper mobile view
* :pushpin:after beta testing phase: public registration
* :bulb: news page
* :gear:has to accept the new devices 
* :bulb: create and manage groups for devices
* :bulb: able to share a device with other profiles (grant and remove access)



