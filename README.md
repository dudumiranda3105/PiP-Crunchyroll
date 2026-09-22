<p align="center"><img src="icons/icon-128.png" width="96" alt="Crunchyroll PiP"></p>

# Crunchyroll PiP

A simple Chrome extension for watching Crunchyroll in a floating window. It adds a Picture-in-Picture button to the video controls, so you can open the window right from the player.

Built for desktop Chrome. No data collection. Not affiliated with Crunchyroll.

**[Download v1.1.2](https://github.com/dudumiranda3105/PiP-Crunchyroll/releases/download/v1.1.2/crunchyroll-pip-1.1.2.zip)** · [All releases](https://github.com/dudumiranda3105/PiP-Crunchyroll/releases)

## Installation

1. Download the ZIP above and extract it.
2. Keep the extracted folder somewhere permanent, such as your Documents folder.
3. Open `chrome://extensions` in Chrome.
4. Turn on **Developer mode**.
5. Click **Load unpacked** and select the folder containing `manifest.json`.
6. Refresh the Crunchyroll page, play an episode, and click the new PiP button in the player.

You can also pin the extension from Chrome's puzzle-piece menu and use its toolbar icon.

Keep the extracted folder after installation: Chrome needs those files. You don't need Node.js or the **Pack extension** button. On the Releases page, download `crunchyroll-pip-1.1.2.zip`; the automatically generated Source code archives are not needed for installation.

## Usage

Click the button to open or close the floating window. You can move and resize it, but keep the episode's browser tab open.

The button sits alongside the player controls. If the extension cannot find those controls, it appears in the top-right corner of the video instead.

The extension's tooltips are currently in Portuguese. Look for the small window icon to toggle PiP.

## Updates

Download the new version, extract it into the same folder, and click **Reload** in `chrome://extensions`. Then refresh the episode page.

GitHub installations do not update automatically. To uninstall, click **Remove** on Chrome's extensions page.

## Privacy

Everything runs in your browser. The extension does not store data, read cookies, or make network requests. It has no ads or analytics.

It requests access to Crunchyroll pages to find the video and add the button. The `scripting` permission lets the toolbar icon activate PiP. This is why Chrome displays a site-access notice during installation.

See [PRIVACY.md](PRIVACY.md) for the full privacy policy, currently available in Portuguese.

## Known limitations

- Subtitles and controls drawn over the video may not appear in the floating window.
- Changes to Crunchyroll's player may affect the button.
- Players hosted outside `crunchyroll.com` and its subdomains are not accessed.
- The extension does not bypass DRM or unlock subscription content.

If something stops working, try reloading the extension and refreshing the episode page. If the problem persists, open an Issue with your browser version and steps to reproduce it. Do not share account information.

## Development

Plain JavaScript and Manifest V3, with no external runtime dependencies. With Node.js 22 or later:

```sh
npm run build
npm test
```

PiP logic lives in `pip.js`, the player button in `player-button.js`, and the toolbar action in `background.js`. The build combines the required code into `content.js`, which is already included for users who only want to install the extension.

The unit tests cover opening, closing, and selecting a video. The browser test uses a sample video to check the button and its alignment. With Playwright CLI installed:

```sh
node scripts/prepare-browser-test.js
playwright-cli -s=crunchyroll-pip open about:blank
playwright-cli -s=crunchyroll-pip run-code --filename=.playwright-cli/player-check.js
playwright-cli -s=crunchyroll-pip close
```

The preparation script uses the current extension code. Temporary files go into `.playwright-cli/`, which is excluded from Git.

To build the distribution ZIP on Windows:

```powershell
powershell -NoProfile -File scripts/package.ps1
```

The package and its SHA-256 checksum are written to `dist`.

## License

[MIT](LICENSE). Crunchyroll trademarks belong to their respective owners. This is an unofficial project.
