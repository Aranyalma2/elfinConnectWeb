<h1 align="center">Elfin eszközök felhasználóhoz való kapcsolása</h1>

---------

## Elfin eszközök

Az eszközök első konfigurálására a gyártói szoftverre is szükség van: [IoTService](http://ftp.hi-flying.com:9000/IOTService/IOTService3.1.3_20240115.rar)
A szoftver telepítését követően fizikai eszközt egy hálózatra, vagy soros porton keresztül szükséges összekapcsolni a programot futtató számítógéppel.

* Általános szoftver segédlet a IoTService programhoz: [Hivatalos dokumentum](http://www.hi-flying.com/index.php?route=tool/upload/download&code=5825d795832fd1998cd46aeafab9074c0c2114d3)
* Elfin EE1X: [Hardver segédlet](http://www.hi-flying.com/index.php?route=tool/upload/download&code=59167cf780d0b98d2175c857ad1240df7acdf9c4)
* Elfin EW1X [Hardver segédlet](http://www.hi-flying.com/index.php?route=tool/upload/download&code=c4d342467edef5f6080a569aa50223fc797e6899)
* [További eszközök](http://www.hi-flying.com/network-device)

>A teljes konfiguráció csak a gyártói szoftvereken, vagy az eszköz saját webes felületén érhető el. Ezen okból, bár táv elérésben nehezen lehet használni, de érdemes a készülékeket a gyártó rendszerbe is felregisztrálni: [IoT Bridge](http://bridge.hi-flying.com/?lang=en)

### Általános konfiguráció

Az eszköz konfigurációs ablakát megnyitva állítsunk be:

* User/Password: Az eszköz távoli, és webes felületére való fiók (Beállítása egyedire erősen ajánlott).
* HostName: Az eszköz neve, ami az Elfin Connect rendszerben is megjelenik.
* DNS: Egy általános DNS kiszolgáló. pl.: 8.8.8.8
* UART: Soros port beállításai.

![IoTService/Config](contents/_gfx/gfx-2-1-1.png)

### Eszköz csatlakoztatása

Egy új socket készítése (New SOCKET)

* SOCKET Name: tetszőleges név (pl.:elfinconnect)
* Protocol: TCP-CLIENT
* Server Addr: távoli elfin connect szerver címe (alapesetben: <span id="location"></span>)
* Server port: távoli elfin connect szerver portja (alapesetben: 8080)
* Connect Mode: Always
* HeartBeat: Enable
* HeartBeat Time: 30
* Regist Mode: Data

![IoTService/Config/NewSocket](contents/_gfx/gfx-2-1-2.png) 

A következő két attributum értéke az webes felületen a Felhasználói fül alatt érhető el.

* HeartBeat Serial
* Regist Code

![/user](contents/_gfx/gfx-2-1-3.png)

#### Modbus használata

Amennyiben a ModbusTCP protokolt szeretnénk használni a kommunikációban.
A "Detail" menüben a történő beállítások esetén az "UART Protocol" kötelező, de a "System" is ajánlott.

* UART Protocol: Modbus

![IoTService/Config/Detail](contents/_gfx/gfx-2-1-4.png)
