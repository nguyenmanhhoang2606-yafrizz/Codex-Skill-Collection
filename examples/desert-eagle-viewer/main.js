import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {runSim} from 'teardown-kit/runtime.js';
import {warmUp} from 'teardown-kit/warm.js';

// Stylized exterior sculpture in arbitrary scene units; no internal mechanism.
runSim({duration:120, theme:'light', hud:{enabled:false,title:'DESERT EAGLE',subtitle:'— Exterior study'},director:{enabled:false}}, async ({canvas,capture}) => {
  document.documentElement.lang='vi';
  document.querySelector('#app').insertAdjacentHTML('beforeend', `
    <header><a class="brand" href="#">FORM / STUDIES <span>01</span></a><div class="edition">TEARDOWN × CODEX<br>SIGNATURE / OBJECT COLLECTION</div></header>
    <section class="intro"><div class="eyebrow">BỘ SƯU TẬP HÌNH KHỐI / 001</div><h1>DESERT<br><span>EAGLE.</span></h1><p>Một biểu tượng, nhìn từ mọi góc.</p></section>
    <aside class="panel"><div class="panel-title"><span>ĐIỀU KHIỂN GÓC NHÌN</span><span class="dot"></span></div><div class="view-grid">
      <button data-view="hero" aria-pressed="true">01 / Phối cảnh</button><button data-view="side" aria-pressed="false">02 / Mặt bên</button><button data-view="top" aria-pressed="false">03 / Từ trên</button><button data-view="rear" aria-pressed="false">04 / Phía sau</button>
    </div><div class="divider"></div><div class="small-title">BỀ MẶT</div><div class="finish-row"><button data-finish="silver" aria-pressed="true"><i class="swatch silver"></i>Bạc satin</button><button data-finish="graphite" aria-pressed="false"><i class="swatch graphite"></i>Graphite</button></div>
    <div class="divider"></div><button id="tour" aria-pressed="true" class="tour"><span>Tự xoay</span><span id="tour-label">ĐANG BẬT ↗</span></button><p class="hint">Kéo để xoay · Cuộn để phóng to<br>Chạm hai ngón để thay đổi góc nhìn</p></aside>
    <nav class="toolbar" aria-label="Công cụ trình diễn"><button id="details" aria-pressed="false">＋ Chú thích</button><button id="reset">↺ Đặt lại</button><button id="export">↓ Lưu PNG</button><button id="fullscreen">⛶ Toàn màn hình</button><label>Chất lượng <select id="quality"><option value="high">Cao</option><option value="low">Nhẹ</option></select></label></nav>
    <div id="hotspots" hidden><button data-detail="profile" aria-label="Xem chú thích đường nét">01</button><button data-detail="finish" aria-label="Xem chú thích bề mặt">02</button><button data-detail="grip" aria-label="Xem chú thích tay cầm">03</button></div>
    <section id="detail-card" hidden aria-live="polite"><button id="detail-close" aria-label="Đóng chú thích">×</button><div class="eyebrow">GÓC NHÌN THIẾT KẾ</div><h2 id="detail-title"></h2><p id="detail-text"></p></section>
    <div id="toast" role="status" hidden></div><footer><div><span class="live-dot"></span><span id="status">ĐANG CHUẨN BỊ</span></div><p>Nghiên cứu ngoại hình cách điệu · Tỷ lệ minh họa</p><span class="footer-index">01 — 04</span></footer>
    <div id="loading">Đang dựng mô hình…</div>`);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setClearColor(0xf1f0eb,0);
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFShadowMap;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.05;
  const scene=new THREE.Scene();
  const pmrem=new THREE.PMREMGenerator(renderer);
  const environment=new RoomEnvironment();
  scene.environment=pmrem.fromScene(environment,0.05).texture;
  environment.dispose();pmrem.dispose();
  const camera=new THREE.PerspectiveCamera(32,innerWidth/innerHeight,0.1,100);
  const target=new THREE.Vector3(0,0.05,0);
  const controls=new OrbitControls(camera,canvas);
  controls.target.copy(target); controls.enableDamping=true;
  controls.enablePan=false;controls.minDistance=5;controls.maxDistance=13;
  controls.maxPolarAngle=Math.PI*0.84;
  const grain=document.createElement('canvas');grain.width=256;grain.height=128;
  const brush=grain.getContext('2d');brush.fillStyle='#969696';brush.fillRect(0,0,256,128);
  for(let y=0;y<128;y++){const v=110+Math.round(45*Math.sin(y*13.73));brush.fillStyle=`rgb(${v},${v},${v})`;brush.fillRect(0,y,256,1);}
  const brushed=new THREE.CanvasTexture(grain);brushed.wrapS=brushed.wrapT=THREE.RepeatWrapping;brushed.repeat.set(2,2);
  const metal=new THREE.MeshStandardMaterial({color:0x89949a,metalness:0.9,roughness:0.3,bumpMap:brushed,bumpScale:0.0015});
  const bright=new THREE.MeshStandardMaterial({color:0xb9c3c7,metalness:0.7,roughness:0.3});
  const dark=new THREE.MeshStandardMaterial({color:0x202426,roughness:0.65,metalness:0.08});
  const black=new THREE.MeshStandardMaterial({color:0x101415,roughness:0.9});
  const accent=new THREE.MeshStandardMaterial({color:0x676e70,metalness:0.8,roughness:0.4});
  const model=new THREE.Group();scene.add(model);
  function mesh(geometry,material,parent=model){const m=new THREE.Mesh(geometry,material);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
  function box(x,y,z,w,h,d,material=metal,parent=model){const m=mesh(new THREE.BoxGeometry(w,h,d),material,parent);m.position.set(x,y,z);return m;}
  function silhouette(points,depth,material=metal){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:0.025,bevelSize:0.025,bevelSegments:2,steps:1});g.translate(0,0,-depth/2);return mesh(g,material);}
  // Broad, faceted upper profile and a tall angled grip give the visual silhouette.
  silhouette([[-1.75,.57],[-1.77,1.01],[-1.48,1.22],[.32,1.22],[.45,1.05],[.45,.57],[-1.55,.52]],.54,metal);
  silhouette([[.47,.58],[.47,1.05],[.62,1.21],[1.94,1.21],[2.12,1.07],[2.12,.66],[1.88,.53]],.46,metal);
  // Sculpted exterior bevels and edge accents are visual only.
  for(const side of [-1,1]){
    const bevel=box(1.27,1.16,side*.19,1.43,.075,.08,bright);bevel.rotation.x=side*.65;
    box(.46,.84,side*.25,.022,.38,.018,accent);
  }
  silhouette([[-1.72,.48],[-1.64,.66],[.85,.66],[.96,.38],[.83,.23],[-.55,.23],[-.76,-.02],[-1.5,-.12]],.47,bright);
  silhouette([[-1.57,.24],[-.77,.2],[-.53,-1.61],[-1.42,-1.69],[-1.82,-1.48],[-1.9,-1.29]],.49,metal);
  silhouette([[-1.57,.03],[-.93,-.01],[-.73,-1.42],[-1.41,-1.49],[-1.66,-1.31]],.54,dark);
  // Shallow decorative hatching on the exterior grip panels.
  for(const z of [-.29,.29]){
    const texture=new THREE.InstancedMesh(new THREE.BoxGeometry(.017,.028,.009),black,130);
    const matrix=new THREE.Object3D();let index=0;
    for(let row=0;row<26;row++)for(let col=0;col<5;col++){
      matrix.position.set(-1.48+col*.1+row*.011,-.15-row*.045,z);
      matrix.rotation.z=.55;matrix.updateMatrix();texture.setMatrixAt(index++,matrix.matrix);
    }
    texture.castShadow=true;texture.receiveShadow=true;model.add(texture);
    for(const y of [-.1,-1.27]){
      const m=mesh(new THREE.CylinderGeometry(.055,.055,.016,16),accent);m.rotation.x=Math.PI/2;m.position.set(y===-.1?-1.28:-1.06,y,z+.012*Math.sign(z));
    }
  }
  // Decorative outer guard contour, static and nonfunctional.
  const guard=new THREE.Shape();guard.moveTo(-.86,.28);guard.lineTo(.55,.28);guard.quadraticCurveTo(.83,.22,.75,-.23);guard.quadraticCurveTo(.65,-.55,.1,-.55);guard.lineTo(-.66,-.51);guard.closePath();
  const cut=new THREE.Path();cut.moveTo(-.59,.13);cut.lineTo(-.48,-.34);cut.lineTo(.08,-.37);cut.quadraticCurveTo(.51,-.38,.54,-.12);cut.lineTo(.56,.11);cut.closePath();guard.holes.push(cut);
  const gg=new THREE.ExtrudeGeometry(guard,{depth:.23,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:2,steps:1});gg.translate(0,0,-.115);mesh(gg,metal);
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.5,.17,0),new THREE.Vector3(-.36,-.03,0),new THREE.Vector3(-.4,-.25,0)]);mesh(new THREE.TubeGeometry(curve,12,.045,8,false),accent);
  // Exterior seams and raised ridge; no chamber or internal geometry.
  box(.32,1.25,0,3.16,.075,.18,bright);
  box(-1.5,1.32,0,.22,.14,.38,black);
  box(1.82,1.34,0,.16,.16,.12,black);
  for(const z of [-.275,.275]){
    for(let i=0;i<9;i++){const m=box(-1.5+i*.072,.83,z,.026,.26,.016,accent);m.rotation.z=-.2;}
    box(.18,.61,z,3.5,.018,.012,accent);
    box(.75,1.1,z,1.8,.018,.012,bright);
    const medallion=mesh(new THREE.CylinderGeometry(.085,.085,.025,24),accent);medallion.rotation.x=Math.PI/2;medallion.position.set(-1.17,-.66,z*1.12);
  }
  // Flat dark inset suggests the front face without an open bore.
  const front=mesh(new THREE.CylinderGeometry(.115,.115,.006,32),black);front.rotation.z=Math.PI/2;front.position.set(2.148,.86,0);
  const inscription=document.createElement('canvas');inscription.width=1024;inscription.height=128;
  const ink=inscription.getContext('2d');ink.fillStyle='#364047';ink.font='500 56px sans-serif';ink.textAlign='center';ink.fillText('DESERT EAGLE',512,65);ink.font='23px sans-serif';ink.fillText('FORM STUDY   /   SIGNATURE SERIES',512,108);
  const label=mesh(new THREE.PlaneGeometry(1.42,.18),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(inscription),transparent:true,depthWrite:false,opacity:.7}));label.position.set(-.25,.88,.297);label.castShadow=false;

  box(-1.04,-1.64,0,.95,.11,.58,black);
  model.rotation.z=-.055;
  model.position.y=.25;
  const floor=mesh(new THREE.CircleGeometry(18,96),new THREE.ShadowMaterial({opacity:.15}),scene);
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.55;floor.castShadow=false;
  const key=new THREE.DirectionalLight(0xfff8eb,2.5);key.position.set(3,7,5);key.castShadow=true;key.shadow.mapSize.set(1536,1536);key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;key.shadow.radius=3;key.shadow.bias=-.0005;scene.add(key);
  const fill=new THREE.DirectionalLight(0xd9eaff,1.2);fill.position.set(-4,2,-5);scene.add(fill);
  scene.add(new THREE.HemisphereLight(0xffffff,0xb6aea0,1.4));
  const views={hero:[5,3.1,8.8],side:[.05,1,10],top:[.1,10,.05],rear:[-6.5,2,7]};
  const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let auto=!reducedMotion,lastInteraction=performance.now(),manuallyPaused=reducedMotion;
  let annotations=false,lowQuality=false;
  function setTour(value){auto=value;document.querySelector('#tour').setAttribute('aria-pressed',String(value));document.querySelector('#tour-label').textContent=value?'ĐANG BẬT ↗':'TẠM DỪNG ↗';}
  function view(name){camera.position.set(...views[name]);controls.target.copy(target);controls.update();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===name)));}
  view('hero');setTour(auto);
  document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{setTour(false);lastInteraction=performance.now();view(b.dataset.view);});
  document.querySelectorAll('[data-finish]').forEach(b=>b.onclick=()=>{const silver=b.dataset.finish==='silver';metal.color.set(silver?0x89949a:0x303a40);bright.color.set(silver?0xb9c3c7:0x4c5962);document.querySelectorAll('[data-finish]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));});
  document.querySelector('#tour').onclick=()=>{setTour(!auto);manuallyPaused=!auto;lastInteraction=performance.now();};
  controls.addEventListener('start',()=>{setTour(false);lastInteraction=performance.now();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));});
  controls.addEventListener('end',()=>{lastInteraction=performance.now();});
  const detailData={
    profile:{point:new THREE.Vector3(1.4,1.4,.2),title:'01 / Đường nét hình khối',text:'Các mặt vát, đường ngang kéo dài và khối tay cầm tạo nên tương phản giữa chiều dài và chiều cao. Chọn góc mặt bên để quan sát silhouette.'},
    finish:{point:new THREE.Vector3(-.2,1.04,.35),title:'02 / Ánh sáng trên kim loại',text:'Bề mặt satin mang những vệt xước rất mảnh. Thử đổi giữa bạc và graphite, rồi xoay vật thể để quan sát cách ánh sáng chạy trên các cạnh vát.'},
    grip:{point:new THREE.Vector3(-1.25,-.45,.4),title:'03 / Bề mặt tay cầm',text:'Mảng tối và họa tiết nổi tạo điểm tựa thị giác cho tổng thể. Các đường chéo lặp lại đối lập với những mặt phẳng dài của phần thân.'}
  };
  document.querySelector('#details').onclick=()=>{annotations=!annotations;document.querySelector('#hotspots').hidden=!annotations;document.querySelector('#details').setAttribute('aria-pressed',String(annotations));if(!annotations)document.querySelector('#detail-card').hidden=true;};
  document.querySelectorAll('[data-detail]').forEach(button=>button.onclick=()=>{const detail=detailData[button.dataset.detail];setTour(false);lastInteraction=performance.now();document.querySelector('#detail-title').textContent=detail.title;document.querySelector('#detail-text').textContent=detail.text;document.querySelector('#detail-card').hidden=false;});
  document.querySelector('#detail-close').onclick=()=>document.querySelector('#detail-card').hidden=true;
  const toast=message=>{const el=document.querySelector('#toast');el.textContent=message;el.hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.hidden=true,3500);};
  document.querySelector('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Trình duyệt chưa cho phép toàn màn hình.');}};
  document.querySelector('#export').onclick=()=>{renderer.render(scene,camera);canvas.toBlob(blob=>{if(!blob){toast('Không xuất được ảnh. Hãy thử lại.');return;}const url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='desert-eagle-study.png';link.click();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Đã lưu ảnh mô hình PNG.');},'image/png');};
  document.querySelector('#reset').onclick=()=>{const quality=document.querySelector('#quality');quality.value='high';quality.dispatchEvent(new Event('change'));document.querySelector('[data-finish="silver"]').click();view('hero');manuallyPaused=true;setTour(false);if(annotations)document.querySelector('#details').click();toast('Đã trở về góc nhìn ban đầu.');};
  document.querySelector('#quality').onchange=e=>{lowQuality=e.target.value==='low';renderer.setPixelRatio(lowQuality?1:Math.min(devicePixelRatio,1.5));renderer.shadowMap.enabled=!lowQuality;resize();};
  const positionHotspots=()=>{if(!annotations)return;model.updateMatrixWorld();for(const button of document.querySelectorAll('[data-detail]')){const point=model.localToWorld(detailData[button.dataset.detail].point.clone()).project(camera);button.style.left=`${(point.x+1)*innerWidth/2}px`;button.style.top=`${(1-point.y)*innerHeight/2}px`;button.style.visibility=point.z>1||point.z< -1?'hidden':'visible';}};
  const resize=()=>{const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w<700?61:32;camera.updateProjectionMatrix();};
  resize();
  const render=(t)=>{if(!capture&&!auto&&!manuallyPaused&&!reducedMotion&&performance.now()-lastInteraction>25000)setTour(true);if(auto){const angle=.38+Math.sin(t*.12)*1.4;camera.position.set(Math.sin(angle)*10,3,Math.cos(angle)*10);controls.update();}else controls.update();renderer.render(scene,camera);positionHotspots();};
  window.VIEWER={getState:()=>({auto,annotations,lowQuality,finish:document.querySelector('[data-finish][aria-pressed="true"]').dataset.finish,camera:camera.position.toArray(),meshes:renderer.info.render.calls,triangles:renderer.info.render.triangles}),setView:view};
  canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();toast('Đồ họa bị gián đoạn. Hãy tải lại trang để khôi phục.');});
  const ready=()=>{document.querySelector('#loading').remove();document.querySelector('#status').textContent='MÔ HÌNH 3D / SẴN SÀNG';};
  if(capture)ready();
  return {render,resize,warm:async()=>{await warmUp(renderer,camera,[{scene}]);ready();}};
}).catch(error=>{console.error(error);const el=document.querySelector('#loading');if(el)el.textContent='Không khởi tạo được WebGL. Hãy thử trình duyệt hỗ trợ tăng tốc đồ họa.';});
