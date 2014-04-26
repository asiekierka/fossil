## Fossil

### Introduction

**Fossil** (Free Open-Source Software I Love) is a modpack by asie centered around being fully open and free to modify and fork by all of its users. It accomplishes this goal in a few ways:

* Using MCUpdater and an easy-to-use pack generation system,
* Using only open-source mods (with permissions to use, modify, redistribute originals and modified copies).

On top of that, we'd love to make it a fun pack to play on!

### Testing

The pack is still in heavy development, but if you would like to test it:

* either grab [our local build of MCUpdater](http://fossil.asie.pl/MCUpdater.jar),
* or manually add our repository to [MCUpdater](http://mcupdater.com/):

        http://fossil.asie.pl/files/ServerPack.xml

### Generation/Forking

1. Fork the repository.
2. Edit config.json to configure your version of the pack.
3. Run

        $ npm install
        $ node fossil
    
4. Upload the "output/web" folder to the folder you configured in config.json *and/or* send us a pull request!

### Support

All bug reports, crashlogs and issues when running the modpack should be opened in this repository's issues.

To see a list of all the mods used in the pack, try [this GDoc](https://docs.google.com/spreadsheet/ccc?key=0AuqVyNf3BeXLdHNXYkxQTTRITEoyc0kwUC1pY3lDWkE&usp=drive_web).

### Licensing

All mods are copyright (c) by their respective authors and licensed under their respective licenses.

The configuration files are put under Creative Commons BY-SA 3.0. The Fossil generator is placed under the same license as the AsieLauncher, being in part a derivative of its server code. MCUpdater is licensed under the Apache License, version 2.0.

We encourage you to modify the modpack to suit your specific needs.
