// The four-stroke explorer's overlay: title and the rev counter top left, the slider-crank and cross-plane panels,
// the transport bottom left, the charge legend top centre, the cylinder state, valve timing and indicator diagram on
// the right, camera / cutaway / overlay toggles bottom right, the firing order bottom centre, and callouts with thin
// leaders into the engine. Fixed 1600 x 900 CSS layout; update(s) redraws every live part from the frame's state.
import {FEATURES, SCRIPT, DURATION} from './film.js';
const ORDER = FEATURES.map((_,i)=>i+1);

export const C = {ink: '#16181b', mute: '#8b8f95', faint: '#c9ccd0', line: '#e1e3e6', panel: 'rgba(248,248,249,.94)', red: '#d6182b', blue: '#3d8fe0', grey: '#5d6670', orange: '#f05a23', exh: '#8b8f95'};
export const CAMS = ['hero', 'front', 'side', 'top', 'detail'];
export const CUTS = ['silver', 'graphite', 'clay'];
export const OVERLAYS = ['callouts', 'edges', 'focus', 'charts', 'reset', 'save'];
const CSS = `
#app{font-family:Inter,system-ui,sans-serif;color:${C.ink};-webkit-font-smoothing:antialiased;font-variant-numeric:tabular-nums}
.ui{position:absolute;inset:0;pointer-events:none}
.pn{position:absolute;background:${C.panel};border:1px solid ${C.line};box-shadow:0 1px 2px rgba(20,22,26,.04)}
.cp{font-size:9.6px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;white-space:nowrap}
.mu{color:${C.mute}}
.tb{position:absolute;height:19px;padding:0 7px;display:flex;align-items:center;justify-content:center;font-size:8.8px;font-weight:600;letter-spacing:.9px;text-transform:uppercase;border:1px solid ${C.line};background:#fff;color:${C.ink};white-space:nowrap}
.call{position:absolute;white-space:nowrap}
.call b{display:block;font-size:11.5px;font-weight:600;letter-spacing:.1px}
.call span{display:block;font-size:8.6px;font-weight:500;letter-spacing:1.4px;color:${C.mute};text-transform:uppercase;margin-top:2px}
.cur{position:absolute;left:0;top:0;z-index:50;filter:drop-shadow(0 1px 2px rgba(0,0,0,.3))}
.ring{position:absolute;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:1.5px solid ${C.red};opacity:0;z-index:49}
`;
const el = (h) => {
  const d = document.createElement('div');
  d.innerHTML = h.trim();
  return d.firstElementChild;
};
export const RPM_MAX = 360;

export function createConsole(app) {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  const ui = el(`<div class="ui"></div>`);
  app.appendChild(ui);
  const add = (h) => {
    const n = el(h);
    ui.appendChild(n);
    return n;
  };

  // ------------------------------------------------------------ title and rev counter
  add(`<div style="position:absolute;left:35px;top:33px;width:43px;height:3px;background:${C.red}"></div>`);
  add(`<div style="position:absolute;left:35px;top:47px;font-size:24px;font-weight:700;letter-spacing:-.2px">Desert Eagle <span style="color:${C.red}">·</span> Surface Study</div>`);
  add(`<div class="cp" style="position:absolute;left:35px;top:81px;font-weight:500;letter-spacing:1.7px;font-size:9.4px">REFERENCE EDITION &nbsp;•&nbsp; EXTERIOR FORM &nbsp;•&nbsp; STUDIO / 03</div>`);
  const rpmBig = add(`<div style="position:absolute;left:33px;top:103px;font-size:56px;font-weight:800;letter-spacing:-3.2px;color:${C.red};line-height:1"></div>`);
  add(`<div style="position:absolute;left:255px;top:141px;font-size:11px;font-weight:500">360°</div>`);
  add(`<div style="position:absolute;left:35px;top:166px;width:247px;height:6px;border:1px solid ${C.faint};border-top:none"></div>`);
  add(`<div style="position:absolute;left:35px;top:174px;width:247px;height:9px;background:#e6e7e9"></div>`);
  const rpmFill = add(`<div style="position:absolute;left:35px;top:174px;height:9px;background:${C.red}"></div>`);
  add(`<div class="cp mu" style="position:absolute;left:35px;top:188px;font-size:9px;font-weight:500">0</div>`);
  add(`<div class="cp" style="position:absolute;left:212px;top:188px;font-size:9px;font-weight:500;color:${C.ink}">AZIMUTH / °</div>`);
  add(`<div style="position:absolute;left:35px;top:206px;width:247px;height:1px;background:${C.faint}"></div>`);
  add(`<div style="position:absolute;left:35px;top:213px;font-size:12.5px;font-weight:500">Camera orbit</div>`);

  // ------------------------------------------------------------ slider-crank
  add(`<div class="pn" style="left:35px;top:274px;width:247px;height:208px"></div>`);
  add(`<div class="cp" style="position:absolute;left:46px;top:286px;font-weight:700">CAMERA ORBIT</div>`);
  const scAng = add(`<div class="cp mu" style="position:absolute;right:${1600 - 271}px;top:286px;font-weight:500"></div>`);
  const sc = add(`<svg style="position:absolute;left:46px;top:303px" width="226" height="130"></svg>`);
  add(`<div style="position:absolute;left:46px;top:440px;width:226px;height:1px;background:${C.line}"></div>`);
  add(`<div style="position:absolute;left:46px;top:447px;font-size:9.5px;color:${C.mute};font-family:'JetBrains Mono',monospace">x = d·cos(el)·sin(az)</div>`);
  add(`<div style="position:absolute;left:46px;top:461px;font-size:9.5px;color:${C.mute}">Spherical camera · live projected position</div>`);

  // ------------------------------------------------------------ cross-plane crank
  add(`<div class="pn" style="left:35px;top:490px;width:247px;height:192px"></div>`);
  add(`<div class="cp" style="position:absolute;left:46px;top:502px;font-weight:700">SURFACE PROFILE</div>`);
  add(`<div class="cp mu" style="position:absolute;right:${1600 - 271}px;top:502px;font-weight:500">SIDE VIEW</div>`);
  add(`<div class="cp mu" style="position:absolute;left:46px;top:516px;font-size:8.6px;font-weight:500">SATIN METAL</div>`);
  add(`<div class="cp mu" style="position:absolute;right:${1600 - 271}px;top:516px;font-size:8.6px;font-weight:500">RUBBER GRIP</div>`);
  const cp = add(`<svg style="position:absolute;left:46px;top:526px" width="226" height="130"></svg>`);
  add(`<div style="position:absolute;left:46px;top:654px;width:226px;height:1px;background:${C.line}"></div>`);
  add(`<div style="position:absolute;left:46px;top:661px;font-size:9.5px;color:${C.mute}">Exterior silhouette · illustrative proportions</div>`);

  // ------------------------------------------------------------ transport
  add(`<div class="pn" style="left:35px;top:774px;width:259px;height:111px"></div>`);
  const btn = {};
  btn.pause = add(`<div class="tb" style="left:45px;top:782px;width:99px;height:26px;background:${C.red};color:#fff;border-color:${C.red};font-size:9.6px">❚❚ &nbsp;PAUSE</div>`);
  btn.back = add(`<div class="tb" style="left:149px;top:782px;width:66px;height:26px;font-size:9.6px">−15°</div>`);
  btn.fwd = add(`<div class="tb" style="left:219px;top:782px;width:66px;height:26px;font-size:9.6px">+15°</div>`);
  add(`<div class="cp" style="position:absolute;left:45px;top:818px;font-weight:500">TOUR POSITION</div>`);
  const speedVal = add(`<div class="cp" style="position:absolute;right:${1600 - 284}px;top:818px;font-weight:700"></div>`);
  const SL = {x: 46, w: 238};
  add(`<div style="position:absolute;left:${SL.x}px;top:836px;width:${SL.w}px;height:2px;background:#e1e3e6"></div>`);
  const speedKnob = add(`<div style="position:absolute;top:831px;width:9px;height:11px;margin-left:-4.5px;background:${C.red}"></div>`);
  add(`<div class="cp" style="position:absolute;left:45px;top:851px;font-weight:500">TOUR SPEED</div>`);
  const playVal = add(`<div class="cp" style="position:absolute;right:${1600 - 284}px;top:851px;font-weight:700"></div>`);
  add(`<div style="position:absolute;left:${SL.x}px;top:869px;width:${SL.w}px;height:2px;background:#e1e3e6"></div>`);
  const playKnob = add(`<div style="position:absolute;top:864px;width:9px;height:11px;margin-left:-4.5px;background:${C.red}"></div>`);

  // ------------------------------------------------------------ legend
  add(`<div class="cp" style="position:absolute;left:598px;top:36px;display:flex;gap:16px;font-weight:500;font-size:9.6px">
    ${[['SATIN METAL', C.grey], ['RUBBER', C.ink], ['SELECTED', C.red], ['EDGES', C.exh]].map(([n, c]) => `<span><i style="display:inline-block;width:15px;height:2.4px;background:${c};vertical-align:middle;margin-right:6px"></i>${n}</span>`).join('')}</div>`);

  // ------------------------------------------------------------ cylinder state
  add(`<div class="pn" style="left:1318px;top:36px;width:245px;height:209px"></div>`);
  const cylName = add(`<div class="cp" style="position:absolute;left:1329px;top:47px;font-weight:500"></div>`);
  const cylCrank = add(`<div class="cp mu" style="position:absolute;right:${1600 - 1552}px;top:47px;font-weight:500"></div>`);
  const strokeBig = add(`<div style="position:absolute;left:1329px;top:61px;font-size:24px;font-weight:700"></div>`);
  const strokeList = add(`<div style="position:absolute;left:1329px;top:97px"></div>`);
  add(`<div style="position:absolute;left:1329px;top:165px;width:224px;height:1px;background:${C.line}"></div>`);
  const barBig = add(`<div style="position:absolute;left:1328px;top:173px;font-size:36px;font-weight:800;letter-spacing:-1.6px;color:${C.red};line-height:1"></div>`);
  const barUnit = add(`<div style="position:absolute;top:197px;font-size:10.5px;font-weight:500;letter-spacing:1px;line-height:1.35">PBR<br><span style="color:${C.mute};letter-spacing:1.5px">METAL ROUGHNESS</span></div>`);
  add(`<div style="position:absolute;left:1329px;top:228px;width:224px;height:5px;background:#e6e7e9"></div>`);
  const barFill = add(`<div style="position:absolute;left:1329px;top:228px;height:5px;background:${C.red}"></div>`);

  // ------------------------------------------------------------ valve timing
  add(`<div class="pn" data-g="charts" style="left:1318px;top:252px;width:245px;height:184px"></div>`);
  add(`<div class="cp" data-g="charts" style="position:absolute;left:1329px;top:263px;font-weight:700">INSPECTION TOUR</div>`);
  add(`<div class="cp mu" data-g="charts" style="position:absolute;right:${1600 - 1552}px;top:263px;font-weight:500">DRAG TO SCRUB</div>`);
  const vtLeg = add(`<div class="cp" data-g="charts" style="position:absolute;left:1329px;top:280px;font-weight:500;font-size:9px"></div>`);
  const vt = add(`<svg data-g="charts" style="position:absolute;left:1326px;top:296px" width="232" height="135"></svg>`);

  // ------------------------------------------------------------ indicator diagram
  add(`<div class="pn" data-g="charts" style="left:1318px;top:443px;width:245px;height:150px"></div>`);
  add(`<div class="cp" data-g="charts" style="position:absolute;left:1329px;top:455px;font-weight:700">SURFACE NOTES</div>`);
  const idCyl = add(`<div class="cp mu" data-g="charts" style="position:absolute;right:${1600 - 1552}px;top:455px;font-weight:500"></div>`);
  const id = add(`<svg data-g="charts" style="position:absolute;left:1326px;top:470px" width="232" height="120"></svg>`);

  // ------------------------------------------------------------ camera, cutaway, overlays
  add(`<div class="pn" style="left:1296px;top:720px;width:268px;height:165px"></div>`);
  const group = (title, keys, y, labels) => {
    add(`<div class="cp mu" style="position:absolute;left:1305px;top:${y}px;font-weight:500">${title}</div>`);
    let x = 1305;
    let yy = y + 15;
    keys.forEach((k) => {
      const w = Math.round(labels[k].length * 6.2 + 14);
      if (x + w > 1556) {
        x = 1305;
        yy += 23;
      }
      btn[k] = add(`<div class="tb" style="left:${x}px;top:${yy}px;width:${w}px">${labels[k]}</div>`);
      x += w + 4;
    });
  };
  const L = Object.fromEntries([...CAMS, ...CUTS, ...OVERLAYS].map((k) => [k, k.toUpperCase()]));
  group('CAMERA', CAMS, 727, L);
  group('FINISH', CUTS, 771, L);
  group('OVERLAYS', OVERLAYS, 815, L);

  // ------------------------------------------------------------ firing order
  add(`<div class="cp mu" style="position:absolute;left:0;right:0;top:795px;text-align:center;font-weight:500"><span style="color:${C.ink}">SURFACE INDEX</span> &nbsp;— &nbsp;CLICK TO INSPECT</div>`);
  const fo = add(`<svg style="position:absolute;left:640px;top:815px" width="320" height="34"></svg>`);
  add(`<div class="cp mu" style="position:absolute;left:0;right:0;top:852px;text-align:center;font-weight:500">EXTERIOR STUDY · NO INTERNAL MECHANISM</div>`);
  add(`<div class="cp" style="position:absolute;left:0;right:0;top:874px;text-align:center;font-weight:500;color:${C.faint}">DRAG TO ORBIT &nbsp;·&nbsp; SCROLL TO ZOOM &nbsp;·&nbsp; H HIDES THE OVERLAY</div>`);

  // ------------------------------------------------------------ callouts, the pointer
  const callSvg = add(`<svg data-callouts style="position:absolute;inset:0;overflow:visible" width="1600" height="900"></svg>`);
  const callG = add(`<div data-callouts style="position:absolute;inset:0"></div>`);
  const ring = add(`<div class="ring"></div>`);
  const cur = add(`<div class="cur"><svg width="22" height="22" viewBox="0 0 34 34"><path d="M4 3 L30 13.5 L17.5 17.5 L13.5 30 Z" fill="#111" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/></svg></div>`);
  const centre = (n) => {
    const r = n.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };
  const foSpot = (i) => [640 + 20 + i * 40, 815 + 17];
  const spots = Object.fromEntries(Object.entries(btn).map(([k, n]) => [k, centre(n)]));
  const knobX = (v) => SL.x + v * SL.w;

  const pointer = (c) => {
    cur.style.display = c.x < 0 ? 'none' : 'block';
    cur.style.transform = `translate(${(c.x - 3).toFixed(2)}px, ${(c.y - 2).toFixed(2)}px) scale(${c.press ? 0.88 : 1})`;
    ring.style.left = `${c.ringX}px`;
    ring.style.top = `${c.ringY}px`;
    ring.style.opacity = String(c.ring * 0.85);
    ring.style.transform = `scale(${(0.35 + 0.9 * (1 - c.ring)).toFixed(3)})`;
  };

  return {
    spots,
    SL,
    plot: vt,
    foSpot,
    speedKnob: (v) => [knobX(v), 836],
    playKnob: (v) => [knobX(v), 869],
    btn,
    root: ui,
    update(s) {
      const az=((s.camera.az%360)+360)%360;
      rpmBig.textContent=Math.round(az)+'°';
      rpmFill.style.width=(az/360*247)+'px';
      speedVal.textContent=s.time.toFixed(1)+' / '+DURATION+' S';
      speedKnob.style.left=knobX(s.time/DURATION)+'px';
      playVal.textContent=s.speed.toFixed(2)+'× SPEED';
      playKnob.style.left=knobX((s.speed-.25)/1.75)+'px';
      btn.pause.innerHTML=s.paused?'▶ &nbsp;PLAY':'❚❚ &nbsp;PAUSE';
      scAng.textContent=Math.round(s.camera.el)+'° ELEV';
      const a=az*Math.PI/180, x=113+Math.sin(a)*48,y=66-Math.cos(a)*48;
      sc.innerHTML=`<circle cx="113" cy="66" r="48" fill="none" stroke="${C.faint}"/><path d="M113 10V122M57 66H169" stroke="${C.line}"/><path d="M113 66L${x} ${y}" stroke="${C.red}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="5" fill="${C.red}"/><circle cx="113" cy="66" r="4" fill="${C.ink}"/><text x="8" y="122" font-size="9" fill="${C.mute}">AZ ${az.toFixed(1)}° / EL ${s.camera.el.toFixed(1)}°</text>`;
      cp.innerHTML=`<path d="M19 20H203L211 28V48H108L93 64 72 116H32L48 62 29 56H16Z M108 49H136V71H91" fill="#dfe1e4" stroke="${C.grey}" stroke-width="1.2"/><path d="M50 66L87 65 69 108H39Z" fill="${C.ink}"/><path d="M23 20H202" stroke="${C.red}" stroke-width="2"/><circle cx="${[145,42,60,126,195,90,158,103][s.feature]}" cy="${[33,32,86,59,21,48,40,59][s.feature]}" r="4" fill="${C.red}"/>`;
      const feature=FEATURES[s.feature];
      cylName.textContent='SURFACE '+String(s.feature+1).padStart(2,'0');
      cylCrank.textContent=s.cam.toUpperCase();
      strokeBig.textContent=feature.name;
      strokeList.innerHTML=feature.lines.map((n,i)=>`<div class="cp" style="height:16.5px;display:flex;align-items:center;gap:10px;font-weight:500;color:${i?C.mute:C.ink}"><i style="width:31px;height:2px;background:${i?C.line:C.red}"></i>${n}</div>`).join('');
      barBig.textContent=s.roughness.toFixed(2);barUnit.style.left='1425px';barFill.style.width=s.roughness*224+'px';
      vtLeg.textContent=s.paused?'PAUSED · '+(s.stepLabel||feature.name).toUpperCase():(s.stepLabel||feature.name).toUpperCase();
      const X=t=>16+t/DURATION*208;
      const row={home:28,camera:28,surface:60,finish:92};
      let chapters='';
      for(let i=0;i<SCRIPT.length;i++){
        const e=SCRIPT[i],end=SCRIPT[i+1]?.t??DURATION,active=s.time>=e.t&&s.time<end;
        chapters+=`<rect x="${X(e.t)}" y="${row[e.action]}" width="${Math.max(2,X(end)-X(e.t)-2)}" height="10" fill="${active?C.red:C.faint}"/><text x="${X(e.t)+2}" y="${row[e.action]+8}" font-size="6.5" fill="${active?'#fff':C.ink}">${e.action==='surface'?e.feature+1:''}</text>`;
      }
      vt.innerHTML=`<text x="16" y="22" font-size="8" fill="${C.mute}">CAMERA</text><text x="16" y="54" font-size="8" fill="${C.mute}">SURFACE INDEX</text><text x="16" y="86" font-size="8" fill="${C.mute}">FINISH</text>${chapters}<path d="M${X(s.time)} 12V108" stroke="${C.ink}"/><text x="16" y="122" font-size="8" fill="${C.mute}">0</text><text x="198" y="122" font-size="8" fill="${C.mute}">${DURATION} S</text>`;
      idCyl.textContent=String(s.feature+1).padStart(2,'0')+' / 08';
      let noteY=17,notes='';
      for(const sentence of feature.notes){
        let line='';for(const word of sentence.split(' ')){if((line+word).length>35){notes+=`<text x="3" y="${noteY}" font-size="10.5" fill="${C.grey}">${line}</text>`;noteY+=15;line='';}line+=word+' ';}
        notes+=`<text x="3" y="${noteY}" font-size="10.5" fill="${C.grey}">${line}</text>`;noteY+=23;
      }
      id.innerHTML=notes;
      fo.innerHTML=ORDER.map((c,i)=>{const x=20+i*40,on=i===s.feature;return `<circle cx="${x}" cy="17" r="${on?15:11.5}" fill="${on?C.red:'#fff'}" stroke="${on?C.red:C.faint}"/><text x="${x}" y="20.5" text-anchor="middle" font-size="10" fill="${on?'#fff':C.ink}">${c}</text>`}).join('');

      // toggles
      for (const k of CAMS) {
        const on = s.cam === k;
        btn[k].style.background = on ? C.ink : '#fff';
        btn[k].style.color = on ? '#fff' : C.ink;
        btn[k].style.borderColor = on ? C.ink : C.line;
      }
      for (const k of CUTS) {
        const on = s.cut === k;
        btn[k].style.background = on ? C.ink : '#fff';
        btn[k].style.color = on ? '#fff' : C.ink;
        btn[k].style.borderColor = on ? C.ink : C.line;
      }
      for (const k of OVERLAYS) {
        const on = !!s.overlays[k];
        btn[k].style.background = on ? C.red : '#fff';
        btn[k].style.color = on ? '#fff' : C.ink;
        btn[k].style.borderColor = on ? C.red : C.line;
      }

      // callouts: a label, a thin leader to its point in the engine
      let lh = '';
      let ch = '';
      for (const c of s.callouts) {
        if (c.o < 0.02 || !c.at) continue;
        const [ax, ay] = c.at;
        const [lx, ly] = c.label;
        lh += `<polyline points="${ax.toFixed(1)},${ay.toFixed(1)} ${lx.toFixed(1)},${(ly + 16).toFixed(1)} ${(lx + c.w).toFixed(1)},${(ly + 16).toFixed(1)}" fill="none" stroke="${C.mute}" stroke-width=".8" opacity="${c.o.toFixed(2)}"/>`;
        ch += `<div class="call" style="left:${lx.toFixed(1)}px;top:${(ly - 10).toFixed(1)}px;opacity:${c.o.toFixed(2)}"><b>${c.name}</b><span>${c.sub}</span></div>`;
      }
      callSvg.innerHTML = lh;
      callG.innerHTML = ch;
      pointer(s.cursor);
    },
    pointer,
  };
}
