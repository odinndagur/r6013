if(!self.define){let e,s={};const i=(i,r)=>(i=new URL(i+".js",r).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(r,d)=>{const n=e||("document"in self?document.currentScript.src:"")||location.href;if(s[n])return;let a={};const c=e=>i(e,n),l={module:{uri:n},exports:a,require:c};s[n]=Promise.all(r.map((e=>l[e]||c(e)))).then((e=>(d(...e),a)))}}define(["./workbox-3625d7b0"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"404.html",revision:"f9e7dc10c98db5ceed66d971a124ca78"},{url:"assets/index-68ab5f1e.js",revision:null},{url:"assets/index-d153200c.css",revision:null},{url:"assets/index.worker-94100cdd.js",revision:null},{url:"assets/indexeddb-main-thread-worker-e59fee74-e13ff922.js",revision:null},{url:"assets/sql-wasm-debug.js",revision:"552b43611a2413481fd5d4cd4ba3d0d1"},{url:"assets/sql-wasm.js",revision:"dc3b00ac3781d7229d3227fd958546d6"},{url:"assets/worker.sql-wasm-debug.js",revision:"d6ed95da10fa9547c66a943559cb03e5"},{url:"assets/worker.sql-wasm.js",revision:"87be2b7d7c125f3e73c7788bdc42a923"},{url:"dark.css",revision:"83e4653f58321cd47b3461efaec2b853"},{url:"index.html",revision:"f526869e2708b481427cf606333e4165"},{url:"light.css",revision:"808eb3a90c283f41ac3bd0b5019d28a4"},{url:"registerSW.js",revision:"1872c500de691dce40960bb85481de07"},{url:"assets/images/android-chrome-512x512.png",revision:"01bc1e5cff0cbe1acf9af35fa4dd1ffc"},{url:"assets/images/manifest-icon-192.maskable.png",revision:"7d23b9b3c6408daec81483d24025fb8d"},{url:"assets/images/manifest-icon-512.maskable.png",revision:"7abc165ef6367d114b08d049b095632d"},{url:"manifest.webmanifest",revision:"6f4beccacb895cfa04aba0d713867593"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
