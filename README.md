# Artab

Display the greatest artworks of all time in your new tab

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
