/* eslint-disable no-console */

import { register } from 'register-service-worker'
let green = 'background-color:darkgreen;border:1px solid black; font-weight: 800';
let orange = 'background-color:darkorange;border:1px solid black; font-weight: 800';
let red = 'background-color:darkred;border:1px solid black; font-weight: 800';
if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('%c ' + new Date() + ' %c App is being served from cache by a service worker.', green, '');
    },
    registered() {
      // console.log('%c ' + new Date() + ' %c Service worker has been registered.', green, '');
    },
    cached() {
      // console.log('%c ' + new Date() + ' %c Content has been cached for offline use.', green, '');
    },
    updatefound() {
      if (confirm('5 Minute Math has been updated.  Restart now to use the latest version.')) {
        // new content clear cache so user gets the new version
        caches.keys().then(cacheNames => {
          cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
          });
        });
        console.clear();
        console.log('%c ' + new Date() + ' %c New content will be loaded.', green, '');
        location.reload();
      } else {
        console.log('%c ' + new Date() + ' %c Update will be delayed.', orange, '');
      }

    },
    updated() {
      console.log('%c ' + new Date() + ' %c New content is available; please refresh.', green, '');
    },
    offline() {
      console.log('%c ' + new Date() + ' %c No internet connection found. App is running in offline mode.', red, '');
    },
    error(error) {
      console.error('Error during service worker registration:', error);
    }
  })
}
