// Adapted from v8-shared/live.js: fixed virtual canvas, 25s idle hand-back,
// shared frame state, direct orbit/zoom, tour chip and overlay visibility.
import {createStage} from './stage.js';
import {createConsole} from './console.js';
import {FEATURES,VIEWS,stateAt} from './film.js';
export async function runLive(){
 document.documentElement.lang='vi';document.title='Desert Eagle · Reference Console';
 const app=document.querySelector('#app'),canvas=document.createElement('canvas');canvas.id='gl';app.append(canvas);
 const loading=document.createElement('div');loading.id='loading';loading.textContent='Đang chuẩn bị cảnh 3D…';document.body.append(loading);
 const hint=document.createElement('div');hint.id='rotate-hint';hint.textContent='Xoay ngang điện thoại để xem đầy đủ bảng điều khiển';document.body.append(hint);
 try{
  const stage=createStage(canvas),ui=createConsole(app);let scale=1;
  const fit=()=>{scale=Math.min(innerWidth/1600,innerHeight/900);app.style.transform=`translate(${(innerWidth-1600*scale)/2}px,${(innerHeight-900*scale)/2}px) scale(${scale})`;stage.resize(1600,900);};fit();addEventListener('resize',fit);
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let time=0,last=performance.now(),auto=!reduce,explicitPause=reduce,lastInput=last,manual={...stateAt(0),auto:false},current=stateAt(0),drag=null;
  function draw(s){current={...s};stage.frame(current);ui.update(current,stage.project(FEATURES[current.feature].point));}
  function takeOver(){if(auto)manual={...current};auto=false;manual.auto=false;lastInput=performance.now();return manual;}
  function tour(){auto=true;explicitPause=false;last=performance.now();}
  const toggle=()=>{if(auto){takeOver();explicitPause=true;}else tour();};
  ui.$('#tour').onclick=toggle;ui.$('#pause').onclick=toggle;
  ui.$('#back').onclick=()=>{const s=takeOver();s.az-=Math.PI/12;s.view='free';};
  ui.$('#forward').onclick=()=>{const s=takeOver();s.az+=Math.PI/12;s.view='free';};
  for(const b of ui.root.querySelectorAll('[data-view]'))b.onclick=()=>Object.assign(takeOver(),VIEWS[b.dataset.view],{view:b.dataset.view});
  for(const b of ui.root.querySelectorAll('[data-finish]'))b.onclick=()=>{takeOver().finish=b.dataset.finish;};
  for(const b of ui.root.querySelectorAll('[data-feature]'))b.onclick=()=>{const feature=Number(b.dataset.feature),view=['hero','side','rear'][feature];Object.assign(takeOver(),VIEWS[view],{feature,view});};
  ui.$('#labels').onclick=()=>{const s=takeOver();s.labels=!s.labels;};
  for(const k of ['roughness','light'])ui.$('#'+k).oninput=e=>{takeOver()[k]=Number(e.target.value);};
  ui.$('#seek').oninput=e=>{time=Number(e.target.value);auto=false;explicitPause=true;manual={...stateAt(time),auto:false};lastInput=performance.now();draw(manual);};
  ui.$('#reset').onclick=()=>{time=0;manual={...stateAt(0),auto:false};auto=false;explicitPause=true;draw(manual);};
  ui.$('#export').onclick=()=>{stage.frame(current);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='desert-eagle-console.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);},'image/png');};
  ui.$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{ui.$('#notice').textContent='Trình duyệt chưa cho phép toàn màn hình.';}};
  canvas.onpointerdown=e=>{takeOver();drag={x:e.clientX,y:e.clientY,az:manual.az,el:manual.el};canvas.setPointerCapture(e.pointerId);};
  canvas.onpointermove=e=>{if(!drag)return;manual.az=drag.az-(e.clientX-drag.x)/scale*.005;manual.el=Math.max(-.2,Math.min(1.35,drag.el+(e.clientY-drag.y)/scale*.004));manual.view='free';lastInput=performance.now();};
  canvas.onpointerup=canvas.onpointercancel=()=>{drag=null;lastInput=performance.now();};
  canvas.addEventListener('wheel',e=>{e.preventDefault();const s=takeOver();s.d=Math.max(7.5,Math.min(14,s.d*Math.exp(e.deltaY*.001)));},{passive:false});
  addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement)return;if(e.key.toLowerCase()==='h')ui.root.hidden=!ui.root.hidden;if(e.code==='Space'){e.preventDefault();toggle();}});
  draw(current);await stage.warm();loading.remove();
  window.SIM={ready:true,duration:24,fps:60,render:t=>{time=t;draw(stateAt(t));}};
  window.CONSOLE_DEMO={state:()=>({...current}),stats:()=>({calls:stage.renderer.info.render.calls,triangles:stage.renderer.info.render.triangles}),project:()=>stage.project(FEATURES[current.feature].point)};
  if(new URLSearchParams(location.search).has('capture'))return;
  function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;if(!auto&&!explicitPause&&!reduce&&!drag&&now-lastInput>25000)tour();if(auto){time=(time+dt)%24;draw(stateAt(time));}else if(JSON.stringify(current)!==JSON.stringify(manual))draw(manual);requestAnimationFrame(frame);}
  requestAnimationFrame(frame);
 }catch(e){console.error(e);loading.textContent='Không khởi tạo được WebGL. Hãy thử trình duyệt có tăng tốc đồ họa.';}
}
