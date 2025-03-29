# Poemtab

Display one poem when you open a new tab



## Download

- [Chrome Web Store](https://chromewebstore.google.com/detail/artab-new-tab-new-art/cphdjiacoelggmgfopmgmljdnhmlhici)
- [Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/artab/)
- [Microsoft Edge Add-ons](https://microsoftedge.microsoft.com/addons/detail/artab-new-tab-with-art/cioaigkjcjchlohhapcdnldoggnmpmih)



## Development

```bash
# Install dependencies
pnpm install

# Development mode
pnpm run dev

# Build project
pnpm run build
```

## Local Testing

1. Run `pnpm run build` to build the project
2. Open Chrome extensions management page (`chrome://extensions/`)
3. Enable Developer Mode
4. Click "Load unpacked extension"
5. Select the `dist` directory of the project

## Project Structure

```bash
.
├── packages/                # Shared packages
│   └── storage/            # Storage module
├── pages/                  # Extension pages
│   ├── options/           # Options page
│   └── new-tab/           # New tab page
└── chrome-extension/       # Extension background
```

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
