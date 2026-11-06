// Exterior tour; follows V8's pure-time camera/script/operator-cursor contract.
export const DURATION=26;
export const FEATURES=[
 {name:'Upper contour',lines:['SATIN METAL','CHAMFERED PROFILE','CLOSED EXTERIOR SHELL'],at:[1.1,1.1,.28]},
 {name:'Rear texture',lines:['DIRECTIONAL GROOVES','BEVELLED EDGES','SURFACE DETAIL'],at:[-1,.9,.3]},
 {name:'Grip surface',lines:['DARK RUBBER','FINE STIPPLE','SOFT EDGE PROFILE'],at:[-1.38,-.72,.32]},
 {name:'Guard profile',lines:['CURVED SILHOUETTE','ROUNDED TRANSITIONS','EXTERIOR DETAIL'],at:[.5,-.24,.13]},
 {name:'Sight silhouette',lines:['DARK ACCENT','UPPER OUTLINE','EXTERIOR DETAIL'],at:[2.1,1.32,.04]},
 {name:'Side relief',lines:['SATIN METAL','LAYERED CONTOURS','EXTERIOR DETAIL'],at:[-.8,.39,.27]},
 {name:'Surface marking',lines:['TYPOGRAPHIC DETAIL','SATIN METAL','REFERENCE STUDY'],at:[1.1,.9,.28]},
 {name:'Base trim',lines:['DARK ACCENT','LOWER SILHOUETTE','CLOSED EXTERIOR SHELL'],at:[-1.5,-1.62,.26]},
];
export const VIEWS={hero:{tx:0,ty:-.005,tz:0,az:24,el:15,d:1.75,sx:-20,sy:0},side:{tx:0,ty:-.005,tz:0,az:0,el:2,d:1.78,sx:-20,sy:0},front:{tx:0,ty:0,tz:0,az:64,el:15,d:1.7,sx:-20,sy:0},top:{tx:0,ty:0,tz:0,az:12,el:65,d:1.8,sx:-20,sy:0},detail:{tx:-.06,ty:-.005,tz:0,az:-27,el:14,d:1.7,sx:-20,sy:0}};
export const SCRIPT=[{t:0,cam:'hero',feature:0,cut:'silver'},{t:4,cam:'side',feature:1},{t:8,cam:'detail',feature:2},{t:12,cam:'top',feature:4},{t:16,cam:'front',feature:0,cut:'graphite'},{t:20,cam:'hero',feature:6,cut:'silver'},{t:24,cam:'hero',feature:0}];
export const smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*u*(u*(u*6-15)+10);};
export function stateAt(time){
 const t=Math.max(0,Math.min(DURATION,time));let i=0;while(i<SCRIPT.length-1&&SCRIPT[i+1].t<=t)i++;
 const e=SCRIPT[i],a=VIEWS[SCRIPT[Math.max(0,i-1)].cam],b=VIEWS[e.cam],k=i?smooth((t-e.t)/1.6):1;
 const camera={};for(const key in b)camera[key]=a[key]+(b[key]-a[key])*k;
 const cut=SCRIPT.filter(e=>e.t<=t&&e.cut).at(-1).cut;
 return {time:t,camera,cam:e.cam,feature:e.feature,cut,roughness:cut==='clay'?.8:.47,speed:1,paused:false,overlays:{callouts:1,edges:0,focus:0,charts:1,reset:0,save:0}};
}
export function makeCursor(ui){
 const ev=SCRIPT.slice(1).map(e=>({t:e.t,spot:ui.spots[e.cam]}));const wp=[[0,980,640]];
 ev.forEach((e,i)=>wp.push([e.t-.18,...e.spot],[e.t+.25,...e.spot],[e.t+1.7,...[[820,470],[700,430],[900,520],[760,380]][i%4]]));wp.push([26,980,640]);wp.sort((a,b)=>a[0]-b[0]);
 return t=>{let i=0;while(i<wp.length-2&&t>wp[i+1][0])i++;const a=wp[i],b=wp[i+1],k=smooth((t-a[0])/(b[0]-a[0]));const e=ev.find(e=>t>=e.t&&t<e.t+.55);return {x:a[1]+(b[1]-a[1])*k,y:a[2]+(b[2]-a[2])*k,press:!!e&&t-e.t<.1,ring:e?1-(t-e.t)/.55:0,ringX:e?.spot[0]||0,ringY:e?.spot[1]||0};};
}
export function drawFrame(st,ui,s,cursor){
 const c={...s.camera,az:s.camera.az*Math.PI/180,el:s.camera.el*Math.PI/180};st.frame(s,c);
 const f=FEATURES[s.feature],at=st.project(...f.at.map(v=>v*.135));
 const callouts=s.overlays.callouts?[{name:f.name,sub:f.lines[0],at,label:s.cam==='detail'?[340,700]:[970,180],w:165,o:1},{name:'',sub:'',at:st.project(0,.1,0),label:[282,152],w:0,o:.65}]:[];
 ui.update({...s,callouts,cursor});for(const n of ui.root.querySelectorAll('[data-g="charts"]'))n.style.visibility=s.overlays.charts?'':'hidden';
}
