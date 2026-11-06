// Adapted from teardown sims/v8-shared/console.js (MIT).
// Keeps the 1600×900 console grid, panel hierarchy, typography, red accent,
// top-centre tour indicator, bottom transport, selection row and leaders.
import {FEATURES} from './film.js';
export function createConsole(app){
 const ui=document.createElement('div');ui.className='ui';app.append(ui);
 ui.innerHTML=`
 <header><i></i><h1>Desert Eagle <span>·</span> Exterior Study</h1><p>THEO ẢNH THAM CHIẾU &nbsp;•&nbsp; STUDIO / 03</p><strong id="bearing">24°</strong><div class="meter"><b id="bearing-fill"></b></div><small>GÓC XOAY CAMERA</small></header>
 <div class="legend"><span>— KIM LOẠI SATIN</span><span>— CAO SU</span><span>— CHI TIẾT NGOẠI HÌNH</span></div>
 <button id="tour" class="tourchip">● TỰ TRÌNH DIỄN · NHẤN ĐỂ ĐIỀU KHIỂN</button>
 <section class="pn left first"><div class="cp">HƯỚNG QUAN SÁT <span id="view-name">PHỐI CẢNH</span></div><svg id="compass" viewBox="0 0 220 135"><circle cx="110" cy="67" r="48" fill="none" stroke="#c9ccd0"/><path d="M110 12V122M55 67H165" stroke="#e1e3e6"/><path id="sweep" d="" fill="#d6182b12"/><line id="needle" x1="110" y1="67" x2="110" y2="19" stroke="#d6182b" stroke-width="2"/><circle cx="110" cy="67" r="5" fill="#16181b"/><text x="110" y="10" text-anchor="middle">TRƯỚC</text><text x="110" y="133" text-anchor="middle">SAU</text></svg><p>Góc hiển thị cập nhật cùng camera.<br>Kéo trực tiếp để quan sát tự do.</p></section>
 <section class="pn left second"><div class="cp">THAM CHIẾU NGOẠI HÌNH</div><svg viewBox="0 0 240 110" class="outline"><path d="M30 18H219L225 27V45H125L115 54 99 95H59L77 51 56 47H28Z M125 47H155V66H111" fill="#e5e6e8" stroke="#5d6670" stroke-width="1.5"/><path d="M34 18H219M62 96H96" stroke="#d6182b" stroke-width="2"/></svg><p>Ảnh nhìn ngang: chuẩn đường bao.<br>Ảnh concept: gợi ý màu và vật liệu.</p></section>
 <section class="pn right first"><div class="cp">ĐIỂM QUAN SÁT <span id="feature-index">01 / 03</span></div><h2 id="feature-title"></h2><p id="feature-description"></p><div class="rule"></div><div class="cp">BỀ MẶT ĐANG HIỂN THỊ</div><strong id="finish-name">BẠC SATIN</strong><div class="swatches"><i></i><i></i><i></i></div></section>
 <section class="pn right second"><div class="cp">ÁNH SÁNG & BỀ MẶT</div><label>Độ nhám <output id="roughness-value">0.36</output><input id="roughness" aria-label="Độ nhám" type="range" min="0.18" max="0.8" step="0.01" value="0.36"></label><label>Ánh sáng <output id="light-value">1.00</output><input id="light" aria-label="Ánh sáng" type="range" min="0.55" max="1.5" step="0.05" value="1"></label><p>Thay đổi trực tiếp vật liệu và<br>ánh sáng của cảnh đang xem.</p></section>
 <section class="pn transport"><div class="buttons"><button id="pause" class="active">❚❚ DỪNG</button><button id="back">−15°</button><button id="forward">+15°</button></div><div class="cp">TRÌNH DIỄN <span id="progress-value">00 / 24 S</span></div><input id="seek" aria-label="Tiến trình trình diễn" type="range" min="0" max="23.99" step="0.01" value="0"><button id="reset">↺ ĐẶT LẠI</button><button id="export">↓ LƯU PNG</button></section>
 <section class="pn controls"><div class="cp">CAMERA</div><div class="buttons">${[['hero','PHỐI CẢNH'],['side','NGANG'],['rear','SAU'],['top','TRÊN']].map(([k,n])=>`<button data-view="${k}">${n}</button>`).join('')}</div><div class="cp">BỀ MẶT</div><div class="buttons"><button data-finish="silver">BẠC SATIN</button><button data-finish="graphite">GRAPHITE</button></div><div class="cp">HIỂN THỊ</div><div class="buttons"><button id="labels">CHÚ THÍCH</button><button id="fullscreen">TOÀN MÀN HÌNH</button></div></section>
 <div class="selection"><div class="cp">ĐIỂM QUAN SÁT &nbsp;—&nbsp; NHẤN ĐỂ XEM</div><div>${FEATURES.map((f,i)=>`<button data-feature="${i}" title="${f.title}">${i+1}</button>`).join('')}</div><p id="selection-title"></p></div>
 <svg class="leaders" viewBox="0 0 1600 900"><path id="leader-path" fill="none" stroke="#a9adb2" stroke-width="1"/><circle id="leader-dot" r="4" fill="#d6182b"/></svg><div id="callout" class="callout"></div>
 <div class="bottom-note">KÉO ĐỂ XOAY · CUỘN ĐỂ ZOOM · H ẨN BẢNG · NGHIÊN CỨU NGOẠI HÌNH</div>
 <div id="notice" role="status"></div>`;
 const $=selector=>ui.querySelector(selector);
 return {root:ui,$,update(s,point){
  const degrees=((s.az*180/Math.PI)%360+360)%360;
  $('#bearing').textContent=Math.round(degrees)+'°';$('#bearing-fill').style.width=(degrees/360*100)+'%';
  const x=110+Math.sin(s.az)*48,y=67-Math.cos(s.az)*48;$('#needle').setAttribute('x2',x);$('#needle').setAttribute('y2',y);
  $('#feature-index').textContent=`0${s.feature+1} / 03`;$('#feature-title').textContent=FEATURES[s.feature].title;$('#feature-description').textContent=FEATURES[s.feature].text;
  $('#finish-name').textContent=s.finish==='silver'?'BẠC SATIN':'GRAPHITE';$('#view-name').textContent=({hero:'PHỐI CẢNH',side:'NGANG',rear:'SAU',top:'TRÊN',free:'TỰ DO'})[s.view];
  for(const b of ui.querySelectorAll('[data-view]')){const active=b.dataset.view===s.view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);}
  for(const b of ui.querySelectorAll('[data-finish]')){const active=b.dataset.finish===s.finish;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);}
  for(const b of ui.querySelectorAll('[data-feature]'))b.classList.toggle('active',Number(b.dataset.feature)===s.feature);
  $('#selection-title').textContent=FEATURES[s.feature].short;
  $('#roughness-value').textContent=s.roughness.toFixed(2);$('#light-value').textContent=s.light.toFixed(2);$('#roughness').value=s.roughness;$('#light').value=s.light;
  $('#seek').value=s.progress*24;$('#progress-value').textContent=`${String(Math.floor(s.progress*24)).padStart(2,'0')} / 24 S`;
  $('#pause').textContent=s.auto?'❚❚ DỪNG':'▶ TRÌNH DIỄN';$('#tour').textContent=s.auto?'● TỰ TRÌNH DIỄN · NHẤN ĐỂ ĐIỀU KHIỂN':'○ ĐIỀU KHIỂN THỦ CÔNG · NHẤN ĐỂ TRÌNH DIỄN';
  $('#labels').classList.toggle('active',s.labels);$('.leaders').style.display=s.labels?'block':'none';$('#callout').style.display=s.labels?'block':'none';
  // Leader terminates at the projected exterior point, from a fixed sidebar label.
  if(point){$('#leader-path').setAttribute('d',`M282 220 H320 L${point[0]} ${point[1]}`);$('#leader-dot').setAttribute('cx',point[0]);$('#leader-dot').setAttribute('cy',point[1]);$('#callout').textContent=FEATURES[s.feature].short;}
 }};
}
