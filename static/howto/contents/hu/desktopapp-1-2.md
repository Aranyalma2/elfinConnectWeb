# Elfin Connect Desktop

---

## Az alkalmazásról

A program lehetővé teszi a távoli eszköz listázását és távoli kapcsolati hidat kiépítését. A felhasználó a helyi számítógépen nyitott lokális TCP szerverre kapcsolódva elérheti a távoli eszközt, mintha közvetlenül csatlakozna hozzá. Minden eszközhöz saját helyi szerver tartozik, így egyidejűleg több végponttal is kiépíthető kapcsolat.

## A felület

* **User and Server:** A UUID mezőbe a felhasználó egyedi azonosítóját, a szerverhez pedig a távoli összekötő szerver címét és portját lehet megadni. Az "Apply and Connect" gomb menti a beállításokat és automatikusan csatlakozást kezdeményez.
* **Server connection status:** A kapcsolat állapota
  * Disconnected: Sikertelen csatlakozás
  * Connecting: Csatlakozás folyamatban
  * Connected: Sikeres csatlakozás
* **Táblázat:** Sikeres csatlakozás esetén a felhasználó eszközei itt jelennek meg.
  * Egy eszköz kijelölése után az "Open connection" gombbal lehetőség van a távoli kapcsolat kiépítésére. Ehhez szükséges, hogy az eszköz "Online" állapotban legyen, és ne legyen lokális szerver nyitva (Running port: none).
  * A kapcsolat és a futó szerver bezárásához a "Close connection" gomb használható.
