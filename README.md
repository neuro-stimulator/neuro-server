# Neuro server

Serverová část **hardwarového stimulátoru pro neuroinformatické experimenty**.

![](https://github.com/neuro-stimulator/neuro-server/workflows/build/badge.svg)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=neuro-stimulator_neuro-server&metric=coverage)](https://sonarcloud.io/summary/new_code?id=neuro-stimulator_neuro-server)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=neuro-stimulator_neuro-server&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=neuro-stimulator_neuro-server)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=neuro-stimulator_neuro-server&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=neuro-stimulator_neuro-server)
![](https://img.shields.io/github/languages/code-size/neuro-stimulator/neuro-server)
![](https://img.shields.io/github/package-json/v/neuro-stimulator/neuro-server)
![](https://img.shields.io/librariesio/github/neuro-stimulator/neuro-server)

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
   - [x] příklad [externího programu v JS](https://github.com/neuro-stimulator/neuro-server/blob/master/ipc-client.js)
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
