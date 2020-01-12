# DiplomkaBackend

Serverová část diplomové práce na téma: **Návrh hardwarového stimulátoru pro neuroinformatické experimenty**

![](https://github.com/stechy1/diplomka-backend/workflows/build/badge.svg)

## Funkce

 - Experimenty
   - [x] prohlížeč všech experimentů
   - [x] CRUD operace s experimenty
   - [ ] tvorba nových experimentů
     - [x] ERP
       - [ ] sekvence
     - [x] CVEP
     - [x] FVEP
     - [x] TVEP
     - [ ] REA
 - Výsledky experimentů
   - [x] zobrazení
   - [x] smazání
 - Prohlížeč souborů
   - [x] CRUD operace se soubory
 - Meziprocesová komunikace mezi serverem a aplikací pro zobrazení obrázků a přehrávání zvuků
   - [x] navržení API
   - [x] příklad [externího programu v JS](https://github.com/stechy1/diplomka-backend/blob/master/ipc-client.js)
 - Sériová komunikace se stimulátorem
   - [x] navržení API
   - [x] full duplex komunikace
   - [ ] Experimenty
     - [ ] ERP
       - [ ] sekvence
     - [x] CVEP
     - [x] FVEP
     - [x] TVEP
     - [ ] REA
