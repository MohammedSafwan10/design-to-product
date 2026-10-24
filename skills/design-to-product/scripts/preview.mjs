#!/usr/bin/env node
import {localSite} from './lib/local-site.mjs';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const site=await localSite(fileURLToPath(new URL('../examples/gallery/index.html',import.meta.url)),root);
console.log(`Design to Product catalog: ${site.url}`);
console.log('Loopback only. Ctrl+C stops the preview.');
for(const signal of ['SIGINT','SIGTERM'])process.once(signal,async()=>{await site.close();process.exit(0);});
