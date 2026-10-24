import {spawn} from 'node:child_process';
import {existsSync} from 'node:fs';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const pause=ms=>new Promise(done=>setTimeout(done,ms));
function executable(){
 const choices=[process.env.DESIGN_CHROME_PATH,
  ...['PROGRAMFILES','PROGRAMFILES(X86)','LOCALAPPDATA'].flatMap(key=>process.env[key]?[join(process.env[key],'Google/Chrome/Application/chrome.exe'),join(process.env[key],'Microsoft/Edge/Application/msedge.exe')]:[]),
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome','/Applications/Chromium.app/Contents/MacOS/Chromium','/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/chromium','/usr/bin/chromium-browser','/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/microsoft-edge'];
 const found=choices.find(path=>path&&existsSync(path));
 if(!found)throw Error('Chrome/Edge/Chromium not found. Set DESIGN_CHROME_PATH to an installed browser.');
 return found;
}

// This always creates a new isolated profile; it never attaches to a user's tabs.
export async function withChromium(work){
 if(typeof WebSocket!=='function')throw Error('Node 22+ with built-in WebSocket is required.');
 const base=resolve(tmpdir());
 const profile=await mkdtemp(join(base,'design-to-product-'));
 let processHandle,socket,browserCommand;
 const requests=new Map();
 const events=new Map();
 let serial=0;
 try{
  let startupError;
  processHandle=spawn(executable(),['--headless=new','--remote-debugging-port=0',`--user-data-dir=${profile}`,'--no-first-run','--no-default-browser-check','--disable-background-networking','--mute-audio','about:blank'],{stdio:'ignore',windowsHide:true});
  processHandle.once('error',error=>{startupError=error;});
  let endpoint;
  for(let attempt=0;attempt<200;attempt++){
   if(startupError)throw startupError;
   if(processHandle.exitCode!==null)throw Error(`Browser exited during startup (${processHandle.exitCode}).`);
   try{const [port,path]=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).trim().split(/\r?\n/);if(port&&path){endpoint=`ws://127.0.0.1:${port}${path}`;break;}}catch{}
   await pause(50);
  }
  if(!endpoint)throw Error('Browser did not expose its isolated debugging endpoint in 10 seconds.');
  socket=new WebSocket(endpoint);
  await new Promise((done,fail)=>{const deadline=setTimeout(()=>fail(Error('Browser socket timeout.')),10000);socket.addEventListener('open',()=>{clearTimeout(deadline);done();},{once:true});socket.addEventListener('error',()=>{clearTimeout(deadline);fail(Error('Browser socket failed.'));},{once:true});});
  socket.addEventListener('message',event=>{
   const response=JSON.parse(String(event.data));
   if(response.id){const pending=requests.get(response.id);if(pending){requests.delete(response.id);clearTimeout(pending.deadline);if(response.error)pending.fail(Error(response.error.message));else pending.done(response.result);}}
   else for(const callback of events.get(response.sessionId)||[])callback(response.method,response.params);
  });
  const command=(method,params={},sessionId)=>new Promise((done,fail)=>{
   const id=++serial;
   const deadline=setTimeout(()=>{requests.delete(id);fail(Error(`Browser command timed out: ${method}`));},20000);
   requests.set(id,{done,fail,deadline});
   socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
  });
  browserCommand=command;
  const browser={
   async page(width,height,reducedMotion=false){
    const {targetId}=await command('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await command('Target.attachToTarget',{targetId,flatten:true});
    const send=(method,params={})=>command(method,params,sessionId);
    const issues=[];
    const cleanURL=value=>{try{const url=new URL(value);return url.origin+url.pathname;}catch{return '<resource>';}};
    events.set(sessionId,[(method,params)=>{
     if(method==='Runtime.exceptionThrown')issues.push({type:'exception',message:params.exceptionDetails.exception?.description||params.exceptionDetails.text});
     if(method==='Runtime.consoleAPICalled'&&params.type==='error')issues.push({type:'console-error',message:params.args.map(a=>a.value??a.description??'').join(' ')});
     if(method==='Network.responseReceived'&&params.response.status>=400)issues.push({type:'http-error',status:params.response.status,url:cleanURL(params.response.url)});
     if(method==='Network.loadingFailed'&&!params.canceled)issues.push({type:'resource-error',message:params.errorText});
    }]);
    await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
    await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:reducedMotion?'reduce':'no-preference'}]});
    return {
     issues,send,
     async evaluate(fn,arg){const expression=typeof fn==='function'?`(${fn.toString()})(${JSON.stringify(arg)??''})`:fn;const reply=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(reply.exceptionDetails)throw Error(reply.exceptionDetails.exception?.description||reply.exceptionDetails.text);return reply.result.value;},
     async navigate(url){const result=await send('Page.navigate',{url});if(result.errorText)throw Error(result.errorText);for(let i=0;i<200;i++){if(await this.evaluate(()=>document.readyState==='complete')){await this.evaluate(()=>Promise.race([document.fonts.ready.then(()=>true),new Promise(done=>setTimeout(()=>done(false),5000))]));await pause(150);return;}await pause(50);}throw Error('Page loading timed out.');},
     async screenshot(fullPage=false){const params={format:'png',captureBeyondViewport:fullPage};if(fullPage){const layout=await send('Page.getLayoutMetrics');const bounds=layout.cssContentSize;params.clip={x:0,y:0,width:Math.ceil(bounds.width),height:Math.min(16000,Math.ceil(bounds.height)),scale:1};}return Buffer.from((await send('Page.captureScreenshot',params)).data,'base64');},
     async close(){events.delete(sessionId);await command('Target.closeTarget',{targetId});}
    };
   }
  };
  return await work(browser);
 }finally{
  if(socket?.readyState===WebSocket.OPEN&&browserCommand)await Promise.race([browserCommand('Browser.close').catch(()=>{}),pause(1000)]);
  socket?.close();
  if(processHandle&&processHandle.exitCode===null){const exited=new Promise(done=>processHandle.once('exit',done));processHandle.kill();await Promise.race([exited,pause(2000)]);}
  for(const pending of requests.values()){clearTimeout(pending.deadline);pending.fail(Error('Browser inspection closed.'));}
  // Delete only the uniquely created temporary profile, never a project/user path.
  if(resolve(profile).startsWith(join(base,'design-to-product-')))await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100}).catch(()=>{});
 }
}
