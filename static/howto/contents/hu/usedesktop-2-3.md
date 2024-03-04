<h1 align="center">Kapcsolat kiépítése az alkalmazáson keresztül</h1>

---------

### Asztali alkalmazás beállításai

Felhasználó és szerver beállítása
* UUID: Felhasználó egyedi azonosítója, a webes felületen található
* Server: A szerver cím és port együttese (formátum: cím:port)
  + cím: <span id="location"></span> (alapesetben)
  + port: 8443
  
![Elfin Connect Desktop](contents/_gfx/gfx-2-3-1.png)

### Csatlakozás a szerverhez

Az "Apply and Connect" gomb megkísérli a csatlakozást, amennyiben sikeres, akkor a táblázatban megjelennek a felhasználóhoz regisztrált eszközök.

* Amennyiben az adatok formailag helyesek, akkor az alkalmazás elmenti, és követekző indításkor ezen adatokkal próbál meg autómatikusan csatlakozni.

![Elfin Connect Desktop](contents/_gfx/gfx-2-3-2.png)

### Csatlakozás egy távoli eszközhöz

Az "Online" státusszal, és nem létező lokális porttal rendelkező eszközöknél kezdeményezhető. 
* Az eszköz kijelölése a sorra való kattintással.
* Az "Open connection" gombbal felépül a szerveren keresztüli kapcsolat. A port mezőben megjelenő érték egy nyílt TCP port, amire lokálisan lehetséges kapcsolódni.

![Elfin Connect Desktop](contents/_gfx/gfx-2-3-3.png)

A példában látható esetben az eszköz innentől kezdve elérhető

* **localhost:55680** vagy **127.0.0.1:55680**

címeken a helyi számítógépről.

A kapcsolat lebontható a "Close connection" gombbal.

### Hiba esetén

A kapcsolat fel nem épülése, vagy megszakadása esetén ezt az alkalmazás hibaüzenettel jelzi. Megaszakadás esetén az éppen aktív kapcsolatokat bontja is, újra létrejötte esetén ezeket manuálisan kell újra nyitni.
A hiba létrejöhet általánosan a szerverrel, vagy csak az adott eszközzel is.
