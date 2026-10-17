/* ITTENMON アプリ用（ホーム画面から開いたときに速く・電波が弱くても開けるようにする）
   ・画面（html/js/css）はネットから最新を取り、つながらないときだけ保存した物を使う
   ・画像は保存した物を先に使う
   ・注文の送信（Googleへの通信）や決済にはさわらない */
const CACHE = "ittenmon-v1018c";
const CORE = ["./", "index.html", "product.html", "gallery.html", "cart.html", "staff.html", "css/shop.css", "js/config.js", "js/common.js", "js/gallery.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).catch(() => {})); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== location.origin) return;
  if (/\.(jpe?g|png|svg|webp)$/i.test(url.pathname)) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); return res; })));
    return;
  }
  e.respondWith(fetch(req).then(res => { if (res.ok) { const c = res.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return res; })
    .catch(() => caches.match(req, { ignoreSearch: true }).then(hit => hit || caches.match("index.html"))));
});
