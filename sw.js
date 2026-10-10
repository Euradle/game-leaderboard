const V="euradle-2.0.0";
const SHELL=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  const u=new URL(r.url);if(u.hostname.endsWith("supabase.co"))return;
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{
      if(res&&(res.status===200||res.type==="opaque")&&(u.origin===location.origin||/jsdelivr\.net$/.test(u.hostname))){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
      return res}).catch(()=>hit);
    return hit||net}))});
