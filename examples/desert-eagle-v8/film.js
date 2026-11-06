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
// Each beat performs one visible control action. The operator cursor uses this same list.
export const SCRIPT=[
 {t:0,action:'home',label:'Overall form'},
 {t:3,action:'camera',cam:'side',label:'Side silhouette'},
 {t:5,action:'surface',feature:1,label:'Rear grooves'},
 {t:8,action:'surface',feature:2,label:'Grip texture'},
 {t:11,action:'surface',feature:4,label:'Upper accents'},
 {t:14,action:'camera',cam:'front',label:'Front perspective'},
 {t:16,action:'finish',cut:'graphite',label:'Graphite finish'},
 {t:18,action:'finish',cut:'silver',label:'Satin finish'},
 {t:20,action:'surface',feature:6,label:'Surface marking'},
 {t:24,action:'home',label:'Return to overview'},
];
const NOTES=[
 ['Broad satin planes meet narrow bevels.','Watch the highlight follow the upper edge.'],
 ['Parallel grooves interrupt the rear panel.','The side view separates each dark recess.'],
 ['Fine stipple contrasts with the metal frame.','A soft border and two fasteners frame the badge.'],
 ['A continuous rounded outline surrounds the opening.','Look at the curved edge under the studio light.'],
 ['Dark upper accents punctuate the long silhouette.','Their contrast stays clear in the silver finish.'],
 ['Shallow reliefs add layers to the exterior.','Light catches their edges above the main surface.'],
 ['Small lettering sits on the satin side panel.','Focus traces the marking without hiding the text.'],
 ['Dark lower trim finishes the grip silhouette.','Its short bevel catches a narrow highlight.'],
];
FEATURES.forEach((f,i)=>{f.notes=NOTES[i];});
export const smooth=u=>{u=Math.max(0,Math.min(1,u));return u*u*u*(u*(u*6-15)+10);};
export function blendCamera(a,b,u){
 const c={};for(const k in b)c[k]=k==='az'?a[k]+(((b[k]-a[k]+540)%360)-180)*u:a[k]+(b[k]-a[k])*u;
 return c;
}
export function inspectCamera(i){
 const [x,y]=FEATURES[i].at;
 return {...VIEWS.detail,tx:x*.135*.25,ty:y*.135*.25,az:i===2?-18:12,el:i===4?28:9,d:i===2?1.6:1.72};
}
export function stateAt(time){
 const t=Math.max(0,Math.min(DURATION,time));
 let camera={...VIEWS.hero},from=camera,to=camera,at=-10,feature=0,cam='hero',cut='silver',focus=false,label=SCRIPT[0].label;
 for(const e of SCRIPT){if(e.t>t)break;
  camera=blendCamera(from,to,smooth((e.t-at)/1.4));
  if(e.action==='camera'||e.action==='surface'||e.action==='home'){
   from=camera;at=e.t;
   if(e.action==='surface'){feature=e.feature;cam='detail';focus=true;to=inspectCamera(feature);}
   else {cam=e.cam||'hero';to={...VIEWS[cam]};if(e.action==='home'){feature=0;focus=false;}}
  }
  if(e.action==='finish')cut=e.cut;
  label=e.label;
 }
 camera=blendCamera(from,to,smooth((t-at)/1.4));
 return {time:t,camera,cam,feature,cut,roughness:cut==='clay'?.8:.47,speed:1,paused:false,transitioning:false,stepLabel:label,overlays:{callouts:1,edges:0,focus,charts:1,reset:0,save:0}};
}
export function makeCursor(ui){
 const ev=SCRIPT.slice(1).map(e=>({t:e.t,spot:e.action==='surface'?ui.foSpot(e.feature):ui.spots[e.action==='finish'?e.cut:e.cam||'hero']}));
 const wp=[[0,980,640]];
 ev.forEach((e,i)=>wp.push([e.t-.18,...e.spot],[e.t+.25,...e.spot],[e.t+1.3,...[[820,470],[700,430],[900,520],[760,380]][i%4]]));wp.push([26,980,640]);wp.sort((a,b)=>a[0]-b[0]);
 return t=>{let i=0;while(i<wp.length-2&&t>wp[i+1][0])i++;const a=wp[i],b=wp[i+1],k=smooth((t-a[0])/(b[0]-a[0]));const e=ev.find(e=>t>=e.t&&t<e.t+.55);return {x:a[1]+(b[1]-a[1])*k,y:a[2]+(b[2]-a[2])*k,press:!!e&&t-e.t<.1,ring:e?1-(t-e.t)/.55:0,ringX:e?.spot[0]||0,ringY:e?.spot[1]||0};};
}
export function drawFrame(st,ui,s,cursor){
 const c={...s.camera,az:s.camera.az*Math.PI/180,el:s.camera.el*Math.PI/180};st.frame(s,c);
 const f=FEATURES[s.feature],at=st.project(...f.at.map(v=>v*.135));
 // Keep text in the top/bottom gutters, outside the central object and side panels.
 const callouts=s.overlays.callouts&&at&&at[0]>290&&at[0]<1300&&at[1]>85&&at[1]<775?
  [{name:f.name,sub:f.lines[0],at,label:[at[0]<800?325:1040,at[1]<450?154:729],w:165,o:1}]:[];
 ui.update({...s,callouts,cursor});for(const n of ui.root.querySelectorAll('[data-g="charts"]'))n.style.visibility=s.overlays.charts?'':'hidden';
}
