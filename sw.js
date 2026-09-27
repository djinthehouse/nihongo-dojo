/* 네트워크 먼저 — 온라인이면 새 배포, 끊기면 저장본 */
const V='app-202609270803';
const CORE=['/','/manifest.webmanifest','/icon-192.png','/icon-512.png'];
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener('activate', e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e=>{
  const r=e.request;
  if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin) return;      /* 파이어베이스·글꼴 등은 건드리지 않습니다 */
  e.respondWith(
    fetch(r).then(res=>{
      if(res && res.ok){ const cp=res.clone(); caches.open(V).then(c=>c.put(r, cp)); }
      return res;
    }).catch(()=>caches.match(r).then(m=>m || caches.match('/')))
  );
});
