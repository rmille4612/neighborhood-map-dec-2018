var loadFromCache = Boolean(window.location.hostname === 'localhost' || window.location.hostname === '[::1]' || window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));//Service Worker to allow offline access of content in cache

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    var urlCheck = new URL(process.env.PUBLIC_URL, window.location);
    if (urlCheck.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      var serviceWorkerAddress = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (loadFromCache) {
        serviceWorkerVerification(serviceWorkerAddress);
        navigator.serviceWorker.ready.then(() => {
          console.log('App loaded via service worker chace ');
        });
      } else {
        registerServiceWorker(serviceWorkerAddress);
      }
    });
  }
}

function registerServiceWorker(serviceWorkerAddress) {
  navigator.serviceWorker
    .register(serviceWorkerAddress)
    .then(registration => {
      registration.onupdatefound = () => {
        var buildServiceWorker = registration.installing;
        buildServiceWorker.onstatechange = () => {
          if (buildServiceWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Conent has changed and visible upon refresh.');
            } else {
              console.log('Content availabe in cache.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Service Worker Registration Error:', error);
    });
}

function serviceWorkerVerification(serviceWorkerAddress) {
  fetch(serviceWorkerAddress)
    .then(response => {
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.serviceWorkerUnregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerServiceWorker(serviceWorkerAddress);
      }
    })
    .catch(() => {
      console.log(
        'Running App Offline.  Content from cache.'
      );
    });
}

export function serviceWorkerUnregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.serviceWorkerUnregister();
    });
  }
}
