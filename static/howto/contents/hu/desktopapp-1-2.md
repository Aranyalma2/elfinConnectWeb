<h1 align="center">Elfin Connect Desktop</h1>

------

## Az alkalmazásról

A program képes listázni, és távoli kapcsolati hidat kiépíteni a távoli eszközzel. A felhasználó a helyi számítógépen nyitott lokális TCP szerverre kapcsolódva kap elérést a távoli eszközre, mintha közvetlen rá csatlakozna. Minden eszközhös saját helyi szerver jön létre ezért egy időben tetszőleges végponttal építhető fel kapcsolat.

## A felület

* **User and Server** A UUID mezőbe a felhasználó egyedi azonosítója, a szerverhez a távoli összekötő szerver címe és portja adható meg. Az "Apply and Connect" gomb menti, és autómatikusan csatlakozást kezdeményez.
* **Server connection status** A kapcsolat státusza
    + Disconnected : Sikertelen csatlakozás
    + Connecting : Csatlakozás folyamatban
    + Connected : Sikeres csatlakozás
* **Táblázat** Sikeres csatlakozás esetén a felhasználó eszköze itt jelennek meg.
    + Egy eszköz kijelölése követekeztében az "Open connection" gombbal lehetséges a távoli kapcsolat kiépítése, ehhez az szükséges, hogy az eszköz "Online" állapotban legyen, és ne legyen már lokális szerver nyitva (Running port: none).
    + A kapcsolat és a futó szerver bezárásához a "Close connection" használható.