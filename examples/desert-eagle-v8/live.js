// V8 live shell, quality tiers and control semantics adapted for the exterior study.
import {warmComposer} from 'teardown-kit/warm.js';
import {createConsole,CAMS,CUTS,OVERLAYS} from './console.js';
import {createV8Stage} from './stage.js';
import {stateAt,VIEWS,FEATURES,DURATION,makeCursor,drawFrame,inspectCamera,blendCamera,smooth} from './film.js';
const W=1600,H=900;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const CSS = (top) => `
html,body{background:#ecedef;overflow:hidden}
#app{position:absolute!important;inset:auto!important;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0}
#gl{touch-action:none;cursor:grab}
#gl.drag{cursor:grabbing}
.tb{pointer-events:auto;cursor:pointer}
.tb:hover{filter:brightness(.95)}
.hit{position:absolute;pointer-events:auto;cursor:pointer}
.hit.ew{cursor:ew-resize}
.tourchip{position:absolute;left:800px;top:62px;transform:translateX(-50%);display:flex;align-items:center;gap:7px;height:21px;padding:0 11px;border:1px solid #e1e3e6;background:rgba(255,255,255,.95);color:#16181b;font:600 8.8px Inter,sans-serif;letter-spacing:1.3px;white-space:nowrap;cursor:pointer;pointer-events:auto}
.tourchip i{display:block;width:6px;height:6px;border-radius:50%;background:#d6182b}
.tourchip.on i{animation:blink 1.2s steps(2) infinite}
@keyframes blink{50%{opacity:.15}}
.turn{position:fixed;left:0;right:0;bottom:18px;text-align:center;font:600 12px/1.4 'JetBrains Mono',monospace;letter-spacing:1px;color:#8b8f95;text-transform:uppercase;display:none}
@media (orientation:portrait) and (max-width:820px){.turn{display:block}}
`;

export async function runLive(){
 const params=new URLSearchParams(location.search),capture=params.has('capture');
 document.title='Desert Eagle · V8 Reference Edition';
 const style=document.createElement('style');style.textContent=CSS(0)+'\n.tb:focus-visible,.hit:focus-visible{outline:2px solid #d6182b;outline-offset:3px}';document.head.append(style);
 const app=document.getElementById('app'),canvas=document.createElement('canvas');canvas.id='gl';app.append(canvas);
 const loading=document.createElement('div');loading.textContent='Preparing studio…';loading.style.cssText='position:fixed;left:45%;top:48%;font:14px Inter;background:#fff;padding:16px;z-index:90';document.body.append(loading);
 try{
 const st=createV8Stage({canvas}),ui=createConsole(app),cursor=makeCursor(ui);
 const TIERS=[{samples:8,ao:true,shadow:4096,pr:2},{samples:4,ao:false,shadow:2048,pr:1.5},{samples:2,ao:false,shadow:1024,pr:1}];
 let tier=params.has('quality')?clamp(Number(params.get('quality')),0,2):(matchMedia('(pointer:coarse)').matches||Math.min(innerWidth,innerHeight)<700?2:0),scale=1;
 const fit=()=>{scale=Math.min(innerWidth/W,innerHeight/H);app.style.transform=`translate(${(innerWidth-W*scale)/2}px,${(innerHeight-H*scale)/2}px) scale(${scale})`;st.resize(W,H,clamp((devicePixelRatio||1)*scale,.75,TIERS[tier].pr));};
 const quality=()=>{const {pr,...q}=TIERS[tier];st.setQuality(q);fit();};quality();addEventListener('resize',fit);
 const chip=document.createElement('div');chip.className='tourchip';chip.setAttribute('role','button');chip.tabIndex=0;ui.root.append(chip);
 const note=document.createElement('div');note.className='turn';note.textContent='Turn your phone sideways for the full console';document.body.append(note);
 const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let time=0,playbackSpeed=1,current=stateAt(0),manual=structuredClone(current);
 let auto=!reduce,explicitPause=reduce,drag=null,scrubPointer=null,transition=null;
 let lastInput=performance.now(),last=lastInput,hidden=false;
 manual.paused=true;
 const idleCursor={x:-99,y:-99,press:false,ring:0,ringX:0,ringY:0};
 function render(s,cur=idleCursor){
  current=structuredClone({...s,speed:playbackSpeed,transitioning:!!transition});
  drawFrame(st,ui,current,cur);
  chip.classList.toggle('on',auto&&!reduce);
  chip.innerHTML=auto?'<i></i>AUTO TOUR · CLICK TO TAKE OVER':'▶ RESUME TOUR';
  chip.setAttribute('aria-label',auto?'Pause tour':'Resume tour');
  for(const [k,b] of Object.entries(ui.btn)){
   const pressed=CAMS.includes(k)?current.cam===k:CUTS.includes(k)?current.cut===k:k==='pause'?current.paused:!!current.overlays[k];
   if(!['reset','save'].includes(k))b.setAttribute('aria-pressed',String(pressed));
  }
 }
 function takeover(){
  manual=structuredClone(current);time=current.time;auto=false;manual.paused=true;
  transition=null;lastInput=performance.now();explicitPause=false;return manual;
 }
 function beginTransition(target){
  if(reduce){manual.camera={...target};transition=null;}
  else transition={from:{...current.camera},to:{...target},elapsed:0,duration:.85};
 }
 function start(){
  time=current.time>=DURATION?0:current.time;auto=true;explicitPause=false;last=performance.now();
  beginTransition(stateAt(time).camera);
  const s=stateAt(time);if(transition)s.camera={...current.camera};render(s,cursor(time));
 }
 function pause(){const s=takeover();explicitPause=true;render(s);}
 function toggle(){if(auto)pause();else start();}
 function activateWithKeyboard(e){if((e.key==='Enter'||e.key===' ')&&!e.repeat){e.preventDefault();e.stopPropagation();e.currentTarget.click();}}
 chip.onclick=toggle;chip.onkeydown=activateWithKeyboard;
 for(const [k,b]of Object.entries(ui.btn)){
  b.id='control-'+k;b.setAttribute('role','button');b.tabIndex=0;b.onkeydown=activateWithKeyboard;
 }
 for(const k of CAMS)ui.btn[k].onclick=()=>{
  const s=takeover();s.cam=k;s.stepLabel='Manual camera';beginTransition(VIEWS[k]);render(s);
 };
 for(const k of CUTS)ui.btn[k].onclick=()=>{
  const s=takeover();s.cut=k;s.roughness=k==='clay'?.8:.47;s.stepLabel='Finish inspection';render(s);
 };
 for(const k of OVERLAYS)ui.btn[k].onclick=()=>{
  if(k==='reset'){
   takeover();time=0;manual=stateAt(0);manual.paused=true;explicitPause=true;render(manual);return;
  }
  if(k==='save'){
   const s=takeover();render(s);
   canvas.toBlob(blob=>{if(!blob)return;const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='desert-eagle-v8.png';a.click();setTimeout(()=>URL.revokeObjectURL(u),10000);});return;
  }
  const s=takeover();s.overlays[k]=!s.overlays[k];render(s);
 };
 ui.btn.pause.onclick=toggle;
 for(const [k,delta]of [['back',-15],['fwd',15]])ui.btn[k].onclick=()=>{
  const s=takeover();s.camera.az+=delta;s.cam='free';s.stepLabel='Manual orbit';explicitPause=true;render(s);
 };
 for(let i=0;i<FEATURES.length;i++){
  const [x,y]=ui.foSpot(i),b=document.createElement('div');b.className='hit';b.id='feature-'+i;
  b.setAttribute('role','button');b.setAttribute('aria-label',FEATURES[i].name);b.tabIndex=0;
  Object.assign(b.style,{left:x-15+'px',top:y-15+'px',width:'30px',height:'30px',borderRadius:'50%'});
  b.onclick=()=>{const s=takeover();s.feature=i;s.cam='detail';s.stepLabel=FEATURES[i].name;s.overlays.focus=true;beginTransition(inspectCamera(i));render(s);};
  b.onkeydown=activateWithKeyboard;ui.root.append(b);
 }
 const slider=(id,y,min,max,step,value,fn)=>{
  const el=document.createElement('input');el.type='range';el.id=id;el.min=min;el.max=max;el.step=step;el.value=value;
  el.setAttribute('aria-label',id);el.style.cssText=`position:absolute;left:38px;top:${y-11}px;width:254px;height:22px;opacity:0;pointer-events:auto;cursor:ew-resize;margin:0`;
  el.oninput=()=>fn(Number(el.value));
  el.onfocus=()=>{el.style.opacity='.65';};el.onblur=()=>{el.style.opacity='0';};
  ui.root.append(el);return el;
 };
 function seekTo(v){
  takeover();time=clamp(v,0,DURATION);manual=stateAt(time);manual.paused=true;explicitPause=true;render(manual);
 }
 const seek=slider('tour-position',836,0,DURATION,.01,0,seekTo);
 const speed=slider('tour-speed',869,.25,2,.05,1,v=>{playbackSpeed=v;lastInput=performance.now();render(current,auto?cursor(time):idleCursor);});
 ui.plot.style.pointerEvents='auto';ui.plot.style.cursor='ew-resize';ui.plot.style.touchAction='none';
 const scrub=e=>{const r=ui.plot.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*232;seekTo((x-16)/208*DURATION);};
 ui.plot.onpointerdown=e=>{scrubPointer=e.pointerId;ui.plot.setPointerCapture(e.pointerId);scrub(e);};
 ui.plot.onpointermove=e=>{if(e.pointerId===scrubPointer)scrub(e);};
 ui.plot.onpointerup=ui.plot.onpointercancel=e=>{if(ui.plot.hasPointerCapture(e.pointerId))ui.plot.releasePointerCapture(e.pointerId);scrubPointer=null;lastInput=performance.now();};
 canvas.onpointerdown=e=>{takeover();drag={x:e.clientX,y:e.clientY,az:manual.camera.az,el:manual.camera.el};canvas.setPointerCapture(e.pointerId);};
 canvas.onpointermove=e=>{
  if(!drag)return;manual.camera.az=drag.az+(e.clientX-drag.x)/scale*.3;
  manual.camera.el=clamp(drag.el+(e.clientY-drag.y)/scale*.2,-15,80);manual.cam='free';manual.stepLabel='Manual orbit';lastInput=performance.now();render(manual);
 };
 canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;lastInput=performance.now();};
 canvas.addEventListener('wheel',e=>{e.preventDefault();const s=takeover();s.camera.d=clamp(s.camera.d*Math.exp(e.deltaY*.0012),1,3);render(s);},{passive:false});
 addEventListener('keydown',e=>{
  if(e.defaultPrevented||e.target instanceof HTMLInputElement||e.altKey||e.ctrlKey||e.metaKey)return;
  const key=e.key.toLowerCase();
  if(key==='h'){hidden=!hidden;ui.root.style.visibility=hidden?'hidden':'';}
  else if(key===' '){toggle();e.preventDefault();}
  else if('12345'.includes(key)&&key.length===1)ui.btn[CAMS[Number(key)-1]].click();
  else if(key==='arrowleft')ui.btn.back.click();else if(key==='arrowright')ui.btn.fwd.click();
 });
 render(reduce?manual:current);await warmComposer(st.renderer,st.composer,st.scene,st.camera);loading.remove();
 const captureAt=t=>{transition=null;auto=true;time=t;playbackSpeed=1;render(stateAt(t),cursor(t));};
 window.SIM={ready:true,duration:DURATION,fps:60,render:captureAt};
 window.DEMO={state:()=>structuredClone(current),tier:()=>tier,stats:()=>({calls:st.renderer.info.render.calls,triangles:st.renderer.info.render.triangles}),start,takeover,ui,stage:st};
 if(capture){captureAt(0);return;}
 const perf={n:0,sum:0,age:0};
 function frame(now){
  const dt=Math.min(.1,Math.max(0,(now-last)/1000));last=now;
  if(tier<2&&!params.has('quality')){perf.age+=dt;perf.n++;perf.sum+=dt;if(perf.age>1&&perf.n>=10&&perf.sum/perf.n>.026){tier++;quality();perf.age=perf.n=perf.sum=0;}}
  if(!auto&&!explicitPause&&!reduce&&!drag&&scrubPointer===null&&now-lastInput>25000)start();
  if(auto)time=(time+dt*playbackSpeed)%DURATION;
  if(auto||transition){
   const s=auto?stateAt(time):manual;
   if(transition){
    transition.elapsed+=dt;const k=smooth(transition.elapsed/transition.duration);
    s.camera=blendCamera(transition.from,auto?s.camera:transition.to,k);
    if(k>=1)transition=null;
   }
   render(s,auto?cursor(time):idleCursor);
  }
  seek.value=current.time;speed.value=playbackSpeed;requestAnimationFrame(frame);
 }
 requestAnimationFrame(frame);
 }catch(e){console.error(e);loading.textContent='WebGL could not start. Try a browser with hardware acceleration.';}
}
