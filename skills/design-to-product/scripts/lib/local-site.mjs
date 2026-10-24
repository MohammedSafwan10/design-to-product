import {createServer} from 'node:http';
import {realpath,readFile,stat} from 'node:fs/promises';
import {dirname,resolve,relative,sep,extname} from 'node:path';

const contentTypes={'.html':'text/html; charset=utf-8','.htm':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.avif':'image/avif','.svg':'image/svg+xml','.ico':'image/x-icon','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4','.webm':'video/webm'};
const within=(base,path)=>path===base||path.startsWith(base+sep);
export async function localSite(target,root){
 const file=await realpath(resolve(target));
 const base=await realpath(resolve(root||dirname(file)));
 if(!within(base,file))throw Error('The inspected file must be within the selected static root.');
 const server=createServer(async(request,response)=>{
  if(!['GET','HEAD'].includes(request.method)){response.writeHead(405);response.end();return;}
  try{
   const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
   if(path.split('/').some(part=>part.startsWith('.'))){response.writeHead(403);response.end();return;}
   let candidate=resolve(base,'.'+path);
   if(!within(base,candidate)){response.writeHead(403);response.end();return;}
   candidate=await realpath(candidate);
   if(!within(base,candidate)){response.writeHead(403);response.end();return;}
   if((await stat(candidate)).isDirectory())candidate=await realpath(resolve(candidate,'index.html'));
   if(!within(base,candidate)||!contentTypes[extname(candidate).toLowerCase()]){response.writeHead(403);response.end();return;}
   const data=await readFile(candidate);
   response.writeHead(200,{'content-type':contentTypes[extname(candidate).toLowerCase()],'cache-control':'no-store'});
   response.end(request.method==='HEAD'?undefined:data);
  }catch{response.writeHead(404);response.end();}
 });
 await new Promise((done,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',done);});
 const address=`http://127.0.0.1:${server.address().port}`;
 return {url:address+'/'+relative(base,file).split(sep).map(encodeURIComponent).join('/'),close:()=>new Promise(done=>{server.closeAllConnections();server.close(done);})};
}
