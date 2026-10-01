# Reef Aquarium

A living 3D coral reef for the Windows desktop, as a screensaver and a live wallpaper, across every screen you own. Free, by Technology 83.

**Download:** https://reef.technology83.com

## What this repository is

Reef Aquarium is not open source. The rendering engine, the fish and coral artwork, the models and the reef itself are the property of Technology 83 Systems Ltd. and are not published here.

What is published here is every part of the app that touches your computer or the internet outside of drawing the reef, so you can read exactly what it does:

| File | What it does |
|---|---|
| `app/Online.cs` | Everything the app does online: the check-in with reef.technology83.com, what is sent with usage sharing on and off, and the self-update (download, SHA-256 check, file replacement). |
| `app/Installer.cs` | How the screensaver is installed and removed (the files it copies and the registry values it sets). |
| `app/Autostart.cs` | The one registry value used to start the live wallpaper with Windows. |
| `app/ReefSettings.cs` | Every setting the app stores, and where. |
| `app/Program.cs` | The entry point and every command-line switch. |
| `web/` | The complete service behind reef.technology83.com: the download page, the check-in endpoint, what is written to the database, and the developer area. |

These files are copied from the source the released builds are made from. They do not build on their own, because the rest of the app is not here.

## What the app sends

See [PRIVACY.md](PRIVACY.md). In short: with "Share anonymous usage" off, only the app's version number; with it on, a random install number, Windows version, graphics card, screen sizes and which features and settings are in use. Never your name, email, files or anything you type.

## Checking a download

Each release is listed in [RELEASES.md](RELEASES.md) with its SHA-256. In PowerShell:

```powershell
Get-FileHash .\ReefAquarium-6.2.0.zip -Algorithm SHA256
```

The app makes the same check itself before installing an update.

## Licence

See [LICENSE.md](LICENSE.md). You may read these files and quote them when discussing the app. Everything else is reserved.
