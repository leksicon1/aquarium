# What Reef Aquarium sends, and what the site records

The code that does this is `app/Online.cs` (the app) and `web/src/worker.js` (the service).

## The app

The app contacts `reef.technology83.com` when you open Settings, and at most once a day while the screensaver or the live wallpaper runs. The reply contains the latest version number and a short note from the developer.

**"Share anonymous usage" off** (About page): the request contains the app's version number and nothing else. No install number exists on your computer while this is off.

**"Share anonymous usage" on** (the default): the request also contains

- a random install number created on your computer (not derived from anything about you or your hardware)
- your Windows version number
- the name of your graphics card
- your screen sizes
- which mode ran (settings, screensaver or wallpaper), and how long a screensaver or wallpaper run lasted
- a summary of settings: quality level, resolution, frame-rate limits, fish and coral amounts, shadow and anti-aliasing choices, whether camera movement, stats, sound, a clock or a text message are switched on (never the text itself), how many custom fish exist, how many screens are used

The app never sends your name, email address, files, the text you type, or the designs of your custom fish.

## The site

- Every check-in is counted per day, version and country. The country comes from the network connection; the IP address is not stored.
- With usage sharing on, the items above are stored against the random install number.
- Each download of the installer is recorded with the time, country, city, browser name, the page that linked to it, and a visitor code. The visitor code is a one-way hash of the IP address that changes every month; the IP address itself is not stored.

## Updates

When a newer version exists the app asks before updating. It downloads the zip from `reef.technology83.com`, checks its SHA-256 against the published value, and only then replaces its own files. Your settings are not touched.
