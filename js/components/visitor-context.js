function initVisitorContext(root = document) {
  const parameters = new URLSearchParams(window.location.search);
  const connection = navigator.connection
    || navigator.mozConnection
    || navigator.webkitConnection;

  const context = {
    page: {
      title: root.title,
      url: window.location.href,
      path: window.location.pathname,
      referrer: root.referrer || 'Direct visit',
    },
    campaign: {
      source: parameters.get('utm_source'),
      medium: parameters.get('utm_medium'),
      campaign: parameters.get('utm_campaign'),
      content: parameters.get('utm_content'),
      term: parameters.get('utm_term'),
    },
    locale: {
      language: navigator.language,
      languages: navigator.languages,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    display: {
      viewport: `${window.innerWidth} × ${window.innerHeight}`,
      screen: `${window.screen.width} × ${window.screen.height}`,
      pixelRatio: window.devicePixelRatio,
      colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light',
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      touchCapable: navigator.maxTouchPoints > 0,
    },
    browser: {
      platform: navigator.userAgentData?.platform || navigator.platform || 'Unknown',
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack === '1',
    },
    network: connection
      ? {
          effectiveType: connection.effectiveType,
          downlinkMbps: connection.downlink,
          saveData: connection.saveData,
        }
      : { available: false },
    capturedAt: new Date().toISOString(),
  };

  // Local diagnostic only: no fetch, beacon, cookies, or persistent storage.
  window.WellBalance.visitorContext = context;
  console.groupCollapsed('[WellBalance] Local visitor context');
  console.log(context);
  console.info('This information remains in this browser and is not transmitted.');
  console.groupEnd();
}

window.WellBalance.register('initVisitorContext', initVisitorContext);
