# DiplomkaBackend

Serverová část diplomové práce na téma: **Návrh hardwarového stimulátoru pro neuroinformatické experimenty**

![](https://github.com/stechy1/diplomka-backend/workflows/build/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/stechy1/diplomka-backend/badge.svg?branch=master)](https://coveralls.io/github/stechy1/diplomka-backend?branch=master)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/1b6fd0adc9e84470b9ce9fcc2d133759)](https://www.codacy.com/manual/stechy12/diplomka-backend)
![](https://img.shields.io/github/languages/code-size/stechy1/diplomka-backend)
![](https://img.shields.io/github/package-json/v/stechy1/diplomka-backend)
![](https://img.shields.io/librariesio/github/stechy1/diplomka-backend)

## Funkce

 - Experimenty
   - [x] prohlížeč všech experimentů
   - [x] CRUD operace s experimenty
   - [x] tvorba nových experimentů
     - [x] ERP
       - [x] sekvence
     - [x] CVEP
     - [x] FVEP
     - [x] TVEP
     - [x] REA
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
   - [x] Experimenty
     - [x] ERP
       - [x] sekvence
     - [x] CVEP
     - [x] FVEP
     - [x] TVEP
     - [x] REA
