const CACHE_NAME = "privacy-badger-sw-fixture-cache";

function log() {
  let args = [].slice.call(arguments);
  args.unshift("sw.js:");
  console.info.apply(console, args);
}

self.addEventListener('install', function (ev) {
  log("installed");
  ev.waitUntil(caches.open(CACHE_NAME).then(function (cache) {
    log("cache.addAll");
    return cache.addAll(['./service_workers.html']);
  }).then(function () {
    log("sending message back to page");
    const channel = new BroadcastChannel('sw-messages');
    channel.postMessage({name: "Hello!"});
  }).catch(e => console.error(e)));
});

self.addEventListener('fetch', function (ev) {
  log("---- fetch for", ev.request.url);

  ev.respondWith(caches.match(ev.request).then(function (response) {
    if (response) {
      log("responding with cached response for", ev.request.url);
      return response;
    } else {
      log("no cached response, fetching", ev.request.url);
      return fetch(ev.request);
    }
  }).catch(e => console.error(e)));

  //if (navigator.onLine) {
  //  log("\tonline");
  //  return fetch(ev.request.clone()).then(function (response) {
  //    if (!response || !response.ok || response.status !== 200) {
  //      console.error("oh oh missing response or not ok or bad status for", ev.request.url);
  //      return response;
  //    }

  //    caches.open(CACHE_NAME).then(function (cache) {
  //      log("caching response for", ev.request.url);
  //      cache.put(ev.request, response.clone());
  //    });

  //    return response;

  //  }).catch(function (err) {
  //    console.error("oh oh server down?", err);
  //    throw err;
  //  });

  //} else {
  //  log("\toffline");
  //  ev.respondWith(caches.match(ev.request).then(function (response) {
  //    if (response) {
  //      log("responding with cached response for", ev.request.url);
  //      return response;
  //    } else {
  //      log("no cached response, fetching", ev.request.url);
  //      return fetch(ev.request);
  //    }
  //  }));
  //}
});
