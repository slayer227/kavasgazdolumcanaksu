// Gaz Dolum Hesaplayıcı: çevrimdışı çalışma için önbellek
const SURUM='gaz-dolum-v2';
const DOSYALAR=['./','index.html','manifest.webmanifest','simge-192.png','simge-512.png','simge-maskelenebilir-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(SURUM).then(c=>c.addAll(DOSYALAR)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==SURUM).map(x=>caches.delete(x)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin===location.origin){
    // Uygulama dosyaları: önce ağ (güncel sürüm), ağ yoksa önbellek
    e.respondWith(fetch(req).then(r=>{ const kopya=r.clone(); caches.open(SURUM).then(c=>c.put(req,kopya)); return r; }).catch(()=>caches.match(req).then(r=>r||caches.match('index.html'))));
  }else if(/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(req).then(r=>r||fetch(req).then(y=>{ const kopya=y.clone(); caches.open(SURUM).then(c=>c.put(req,kopya)); return y; })));
  }
});
