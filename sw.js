// Push-only service worker: pages and apartment data are not cached.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('push',event=>{
 let data={};try{data=event.data?.json()||{}}catch{}
 event.waitUntil(self.registration.showNotification(data.title||'Моя квартира',{
 body:data.body||'У вас новое напоминание',icon:'/icon-192.png',badge:'/badge-96.png',
 tag:data.tag||'apartment-reminder',data:{url:'/?page=reminders'}
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 event.waitUntil((async()=>{
 const url=new URL('/?page=reminders',self.location.origin).href;
 const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of windows){if(new URL(client.url).origin===self.location.origin){await client.navigate(url);return client.focus();}}
 return self.clients.openWindow(url);
 })());
});
