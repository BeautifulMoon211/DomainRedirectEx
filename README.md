# API-Based URL Redirector

A browser extension that redirects all URLs to a destination fetched from an API endpoint. No matter what link you type in the address bar, you'll be redirected to the URL returned by the API!

## Features

- Fetches redirect URL from API endpoint: `http://38.247.146.9:3120`
- Automatically redirects any URL you type to the URL returned by the API
- Caches the API response for 1 minute to reduce API calls
- Falls back to GitHub.com if API is unreachable
- Works with Chrome, Edge, and other Chromium-based browsers
- Lightweight and simple

## Installation

### For Chrome/Edge

1. Open your browser and navigate to the extensions page:
   - **Chrome**: `chrome://extensions/`
   - **Edge**: `edge://extensions/`

2. Enable **Developer mode** (toggle switch in the top right corner)

3. Click **Load unpacked**

4. Select the folder containing this extension (`e:\111\Extension`)

5. The extension should now be installed and active!

## How It Works

The extension uses the following workflow:

1. **Intercepts Navigation**: Uses `webNavigation` API and `tabs.onUpdated` to catch URL changes
2. **Fetches Redirect URL**: Makes a GET request to `http://38.247.146.9:3120`
3. **Parses Response**: Handles both plain text URLs and JSON responses (looks for `url` or `redirect` fields)
4. **Caches Result**: Stores the redirect URL for 1 minute to minimize API calls
5. **Redirects**: Automatically redirects you to the URL returned by the API

When you type any URL (except browser internal pages or the API endpoint itself), it will:
- Fetch the redirect URL from the API
- Redirect you to that URL
- If the API fails, fall back to https://github.com

## Files

- `manifest.json` - Extension configuration
- `background.js` - Background service worker that handles URL redirection
- `icon.png` - Extension icon
- `README.md` - This file

## Disabling the Extension

To temporarily disable or remove the extension:

1. Go to your browser's extensions page
2. Find "API-Based URL Redirector"
3. Toggle it off or click "Remove"

## Notes

- The extension will NOT redirect:
  - The API endpoint itself (38.247.146.9:3120)
  - Browser internal pages (chrome://, edge://, about:)
  - Extension pages

- **API Response Format**: The API can return:
  - Plain text URL: `https://example.com`
  - JSON with `url` field: `{"url": "https://example.com"}`
  - JSON with `redirect` field: `{"redirect": "https://example.com"}`

- **Caching**: The redirect URL is cached for 1 minute to reduce API load

- **Fallback**: If the API is unreachable or returns invalid data, the extension falls back to redirecting to https://github.com

## License

Free to use and modify as needed.

