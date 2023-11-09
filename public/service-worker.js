const MAX_IMAGE = 20;
const CACHE_NAME = "cache-v1"
class ImageCache {
  constructor() {
    this.cacheName =CACHE_NAME;
  }

  async putInCache(request, response) {
    const cache = await caches.open(this.cacheName);
    await cache.put(request, response);
  }

  async checkCache(request) {
    const responseFromCache = await caches.match(request);
    return responseFromCache || null;
  }

  async fetchAndCache(request) {
    const responseFromNetwork = await fetch(request);
    this.putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  }

  async fetchImage(request) {
    const currImageNum = this.getIndex(request);
    const cachedArr = this.getCachedData(currImageNum);

    let res = "";
    for (const val of cachedArr) {
      if (currImageNum === val) {
        res = await this.fetchImageFromCacheOrNetwork(request);
      } else {
        await this.fetchImageFromCacheOrNetwork(request.replace(`image${currImageNum}`, `image${val}`));
      }
    }
    await this.deleteCacheItemsNotInList(cachedArr);
    return res;
  }

  async fetchImageFromCacheOrNetwork(request) {
    const responseFromCache = await this.checkCache(request);
    return responseFromCache || this.fetchAndCache(request);
  }

  async deleteCacheItemsNotInList(allowedIndexes) {
    const cache = await caches.open(this.cacheName);
    const cacheKeys = await cache.keys();

    for (const cacheKey of cacheKeys) {
      const cachedImageIndex = this.getIndex(cacheKey.url);

      if (!allowedIndexes.includes(cachedImageIndex)) {
        await cache.delete(cacheKey);
      }
    }
  }

  getIndex(url) {
    return parseInt(url.split('/').pop().replace("image", "").replace(".jpg", ""), 10);
  }

  getCachedData(currImageNum) {
    const cachedArr = [];
    for (let i = currImageNum - 4; i <= currImageNum + 4; i++) {
      let current = i;
      if (i > MAX_IMAGE) {
        current = Math.floor(i % MAX_IMAGE);
      }
      if (i < 1) {
        current = MAX_IMAGE + i;
      }
      cachedArr.push(current);
    }
    return cachedArr;
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.url.includes(`/models/image`)) {
    const imageCache = new ImageCache();
    event.respondWith(imageCache.fetchImage(event.request.url));
  } else {
    event.respondWith(fetch(event.request));
  }
});


// const putInCache = async (request, response) => {
//   const cache = await caches.open("v1");
//   await cache.put(request, response);
// };

// const checkCache = async (request) => {
//   const responseFromCache = await caches.match(request);
//   if (responseFromCache) {
//     console.log('caching');
//     return responseFromCache;
//   }
//   return null; // Indicates cache miss
// };

// const fetchAndCache = async (request) => {
//   const responseFromNetwork = await fetch(request);
//   putInCache(request, responseFromNetwork.clone());
//   console.log('fetching');
//   return responseFromNetwork;
// };

// const fetchCatch = async (request) => {
//   const responseFromCache = await checkCache(request);
//   if (responseFromCache) {
//     return responseFromCache;
//   } else {
//     return fetchAndCache(request);
//   }

// };

// const fetchimage = (request) => {
//   let currImageNum = parseInt(request.split('/').pop().replace("image", "").replace(".jpg", ""), 10);
//   let arr = cahceData(currImageNum);
//   let res;
//   arr.forEach((val) => {
//     if (currImageNum == val) {
//       res = fetchCatch(request);
//     } else {
//       fetchCatch(request.replace(`image${currImageNum}`, `image${val}`));
//     }
//   });
//   deleteFn(arr);
//   return res;
// };

// const deleteFn = async (arr) => {
//   const cache = await caches.open("v1");
//   const cacheKeys = await cache.keys();
//   cacheKeys.forEach(cacheKey => {
//     let cachedImageIndex = parseInt(cacheKey.url.split('/').pop().replace("image", "").replace(".jpg", ""), 10);
//     if (arr.indexOf(cachedImageIndex) === -1) {
//       console.log('Removing from cache: ', cacheKey);
//       cache.delete(cacheKey);
//     }
//   })
// }

// self.addEventListener("fetch", (event) => {
//   if (event.request.url.includes(`/models/image`)) {
//     event.respondWith(fetchimage(event.request.url));
//   } else {
//     event.respondWith(fetch(event.request));
//   }
// });

// const cahceData = (currImageNum) => {
//   let cachedArr = [];
//   for (let i = currImageNum - 4; i <= currImageNum + 4; i++) {
//     let curr = i;
//     if (i > 20) {
//       curr = Math.floor(i % 20);
//     }
//     if (i < 1) {
//       curr = 20 + i;
//     }
//     cachedArr.push(curr);
//   }
//   return cachedArr;
// };