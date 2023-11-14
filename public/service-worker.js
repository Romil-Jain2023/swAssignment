const MAX_IMAGE = 14;
const CACHE_NAME = "cache-v1";
class ImageCache {
  constructor() {
    this.cacheName = CACHE_NAME;
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
    res = await this.fetchImageFromCacheOrNetwork(request);
    for (const val of cachedArr) {
      if (currImageNum === val) {
        res = await this.fetchImageFromCacheOrNetwork(request);
      } else {
        await this.fetchImageFromCacheOrNetwork(URLArr[val]);
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
    // return parseInt(url.split('/').pop().replace("image", "").replace(".jpg", ""), 10);
    return URLArr.indexOf(url);
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
  if (event.request.url.includes(`https://`)) {
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


const URLArr = [
  "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Ym9va3xlbnwwfHwwfHx8MA%3D%3D",
  "https://images.unsplash.com/photo-1479660095429-2cf4e1360472?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D",
  "https://play-lh.googleusercontent.com/Go-5TT46qmkWYXnR4UbempZdve-FCxqsRS6naZO8k5yJXN4Ls9vfLNsgnsj5wVPINUjg",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfq5se8-6ecc8525-2f95-40c3-bcaa-35a4bf150073.png/v1/fill/w_970,h_647,q_80,strp/8k_ultra_hd___wallpaper___theming_arts_by_themingarts_dfq5se8-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NjQ3IiwicGF0aCI6IlwvZlwvMThhY2QzNjktZWE0NC00NzFiLWFlZWItOWU2ZThlM2VkOWQ1XC9kZnE1c2U4LTZlY2M4NTI1LTJmOTUtNDBjMy1iY2FhLTM1YTRiZjE1MDA3My5wbmciLCJ3aWR0aCI6Ijw9OTcwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.PItFhbXavyfwYuUGn37p8v30fHVh9NflcbjtYh4z584",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfo6puy-495f55a2-de2c-452e-b596-3c3b8ab29d88.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZvNnB1eS00OTVmNTVhMi1kZTJjLTQ1MmUtYjU5Ni0zYzNiOGFiMjlkODgucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.ntxOMz0UUCdoZ4gffheAOM47U6BcbqCV_-Swxqz-zuk",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfmk7kl-2665769f-f782-447f-b581-34c3d10d9a02.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZtazdrbC0yNjY1NzY5Zi1mNzgyLTQ0N2YtYjU4MS0zNGMzZDEwZDlhMDIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.jx3XWvh8kpL0j3OlZxa5oWyxiorOWKb__35Osd3xj_k",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfokdp9-a9feb645-be36-452a-9722-7a0137195270.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZva2RwOS1hOWZlYjY0NS1iZTM2LTQ1MmEtOTcyMi03YTAxMzcxOTUyNzAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.A7ML5Cs9GaYkd0lLWXx9wciW0f_qP-rZBTTKmJxaP3E",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfqytvj-c38198a9-c2f7-4dc5-aa9c-fad926b1f831.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZxeXR2ai1jMzgxOThhOS1jMmY3LTRkYzUtYWE5Yy1mYWQ5MjZiMWY4MzEucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.VPTTxKcgxblBIbb6XklsUmPZSpf3AFkHxwVgesvI9Ws",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfq2q6l-d8b0d0a9-e3b4-4604-a094-d2b598b8a7f0.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZxMnE2bC1kOGIwZDBhOS1lM2I0LTQ2MDQtYTA5NC1kMmI1OThiOGE3ZjAucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.dxatu0a9-LvUfs9dIi9CBl38rk7raPzuQ5OO3ol5uFU",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfp7t64-89a8a1d7-26be-4649-bd16-9ea7281572c9.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZwN3Q2NC04OWE4YTFkNy0yNmJlLTQ2NDktYmQxNi05ZWE3MjgxNTcyYzkucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.EItLzyd_06u-6nnM6ERzUgpd9hygOe0YwDFEIOCFHz8",
  "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/18acd369-ea44-471b-aeeb-9e6e8e3ed9d5/dfn7ibx-54224522-d5e2-4e36-accb-1183ecafd532.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzE4YWNkMzY5LWVhNDQtNDcxYi1hZWViLTllNmU4ZTNlZDlkNVwvZGZuN2lieC01NDIyNDUyMi1kNWUyLTRlMzYtYWNjYi0xMTgzZWNhZmQ1MzIucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.eJEKBTjUMCbNBnFKIJTfRTmZBWLLYxT7rmk2_6JsPHw",
  "https://play-lh.googleusercontent.com/V2DpngxVEcIEwQdVt60OxgRPpD2F2sYth4IcZ2MbPsDv0AzFmRqJPuWQWCQd4-us_8o",
  "https://images.pexels.com/photos/604671/pexels-photo-604671.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
];