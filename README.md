<h1 align="center">Elfin Connect WebUI</h1>
<p align="center">
<img alt="Development version" src="https://img.shields.io/github/package-json/v/Aranyalma2/elfinConnectWeb/development">

<img alt="Latest release" src="https://img.shields.io/github/v/release/Aranyalma2/elfinConnectWeb">

<img alt="Github top language" src="https://img.shields.io/github/languages/top/Aranyalma2/elfinconnectweb?color=8f3d3d">

<img alt="Codacy qualty" src="https://img.shields.io/codacy/grade/c3979895a7cb4800badebefc286cde5f" />

<img alt="Repository size" src="https://img.shields.io/github/repo-size/Aranyalma2/elfinConnectweb?color=532BEAF">

<img alt="License" src="https://img.shields.io/github/license/Aranyalma2/elfinconnectweb?color=56BEB8">

</p>

<hr>

## :dart: About

* Elfin Connect service Web UI, not a standalone application, for basic functionalities, must have a MongoDB connection. It will use multiple documents for general data and files (with GridFS).
* For full functionality, you have to run Elfin Connect Server. This service will create most of the data that is accessible and manageable from the WebUI.

## :checkered_flag: First login

After a full application deployment, for the first login, you have to set up and create a profile with the highest privileges.

1. Load setup page.

```
https://your-domain.com/setup
```

2. Create a profile and login with it.


>Setup page will be disabled after a valid user created and leave the page.

## Basic functionalities

### Home page

Availability statistics of devices.

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

## :page_with_curl: Upcoming Features

* :gear: proper mobile view
* :pushpin:after beta testing phase: public registration
* :bulb: news page
* :gear:has to accept the new devices 
* :bulb: create and manage groups for devices
* :bulb: able to share a device with other profiles (grant and remove access)
* :bulb: categorize the download center
* :bulb: able to add third-party links to e download center (github release)

## :memo: License

This project is under license from Apache 2.0. For more details, see the [LICENSE](LICENSE.md) file.

Made with :heart: by <a href="https://github.com/Aranyalma2" target="_blank">Aranyalma2</a>

&#xa0;

<a href="#top">Back to top</a>
