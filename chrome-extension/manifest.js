import fs from 'node:fs';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  default_locale: 'en',
  /**
   * if you want to support multiple languages, you can use the following reference
   * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
   */
  name: 'Poemtab',
  version: packageJson.version,
  description: '__MSG_extensionDescription__',
  permissions: ['storage'],
  host_permissions: ['https://artab-files.owenyoung.com/*', 'https://v1.jinrishici.com/*'],
  options_ui: {
    page: 'options/index.html',
    open_in_tab: false, // 改为false，使其在弹出窗口中打开
  },
  background: {
    service_worker: 'background.iife.js',
    type: 'module',
  },
  action: {
    default_icon: 'icon32.png',
  },
  chrome_url_overrides: {
    newtab: 'new-tab/index.html',
  },
  icons: {
    128: 'icon128.png',
    48: 'icon48.png',
    32: 'icon32.png',
    16: 'icon16.png',
  },
  web_accessible_resources: [
    {
      resources: ['*.js', '*.css', '*.svg', '*.png'],
      matches: ['*://*/*'],
    },
  ],
};

export default manifest;
