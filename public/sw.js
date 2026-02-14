self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('message', (event) => {
  const { type, title, options } = event.data || {};
  if (type === 'show-notification') {
    self.registration.showNotification(title || 'Superoutine', options || {});
  }
});
