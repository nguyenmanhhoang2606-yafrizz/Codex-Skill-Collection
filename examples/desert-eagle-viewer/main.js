import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {runSim} from 'teardown-kit/runtime.js';
import {warmUp} from 'teardown-kit/warm.js';

// Stylized exterior sculpture in arbitrary scene units; no internal mechanism.
runSim({duration:120, theme:'light', hud:{enabled:false,title:'DESERT EAGLE',subtitle:'— Exterior study'},director:{enabled:false}}, async ({canvas,capture}) => {
  document.documentElement.lang='vi';
  document.querySelector('#app').insertAdjacentHTML('beforeend', `
    <header><a class="brand" href="#">FORM / STUDIES <span>01</span></a><div class="edition">TEARDOWN × CODEX<br>REFERENCE EDITION / 02</div></header>
    <section class="intro"><div class="eyebrow">BỘ SƯU TẬP HÌNH KHỐI / 001</div><h1>DESERT<br><span>EAGLE.</span></h1><p>Một biểu tượng, nhìn từ mọi góc.</p></section>
    <aside class="panel"><div class="panel-title"><span>ĐIỀU KHIỂN GÓC NHÌN</span><span class="dot"></span></div><div class="view-grid">
      <button data-view="hero" aria-pressed="true">01 / Phối cảnh</button><button data-view="side" aria-pressed="false">02 / Mặt bên</button><button data-view="top" aria-pressed="false">03 / Từ trên</button><button data-view="rear" aria-pressed="false">04 / Phía sau</button>
    </div><div class="divider"></div><div class="small-title">BỀ MẶT</div><div class="finish-row"><button data-finish="silver" aria-pressed="true"><i class="swatch silver"></i>Bạc satin</button><button data-finish="graphite" aria-pressed="false"><i class="swatch graphite"></i>Graphite</button></div>
    <div class="divider"></div><button id="tour" aria-pressed="true" class="tour"><span>Tự xoay</span><span id="tour-label">ĐANG BẬT ↗</span></button><p class="hint">Kéo để xoay · Cuộn để phóng to<br>Chạm hai ngón để thay đổi góc nhìn</p></aside>
    <nav class="toolbar" aria-label="Công cụ trình diễn"><button id="details" aria-pressed="false">＋ Chú thích</button><button id="reset">↺ Đặt lại</button><button id="export">↓ Lưu PNG</button><button id="fullscreen">⛶ Toàn màn hình</button><label>Chất lượng <select id="quality"><option value="high">Cao</option><option value="low">Nhẹ</option></select></label></nav>
    <div id="hotspots" hidden><button data-detail="profile" aria-label="Xem chú thích đường nét">01</button><button data-detail="finish" aria-label="Xem chú thích bề mặt">02</button><button data-detail="grip" aria-label="Xem chú thích tay cầm">03</button></div>
    <section id="detail-card" hidden aria-live="polite"><button id="detail-close" aria-label="Đóng chú thích">×</button><div class="eyebrow">GÓC NHÌN THIẾT KẾ</div><h2 id="detail-title"></h2><p id="detail-text"></p></section>
    <div id="toast" role="status" hidden></div><footer><div><span class="live-dot"></span><span id="status">ĐANG CHUẨN BỊ</span></div><p>Nghiên cứu ngoại hình theo ảnh · Tỷ lệ minh họa</p><span class="footer-index">01 — 04</span></footer>
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
  function silhouette(points,depth,material=metal){const shape=new THREE.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:true,bevelThickness:0.025,bevelSize:0.025,bevelSegments:4,steps:1});g.translate(0,0,-depth/2);return mesh(g,material);}
  // External visual study based on user-supplied side-view and concept images.
  // All coordinates are arbitrary illustration units. No operational internals.
  silhouette([[-1.65,.59],[-1.66,.98],[-1.48,1.16],[-.52,1.16],[-.44,1.03],[-.43,.92],[.12,.92],[.27,1.08],[1.94,1.08],[2.19,.97],[2.19,.61],[1.94,.52],[-1.43,.52]],.5,metal);
  // A rounded, faceted forward silhouette, formed as a single closed sculpture.
  const cross=[[-.16,1.18],[.16,1.18],[.28,1.04],[.28,.76],[.17,.61],[-.17,.61],[-.28,.76],[-.28,1.04]];
  const vertices=[];
  for(const x of [-.28,2.28])for(const [z,y] of cross)vertices.push(x,y,z);
  const faces=[];
  for(let i=0;i<8;i++){const j=(i+1)%8;faces.push(i,j,8+j,i,8+j,8+i);}
  for(let i=1;i<7;i++){faces.push(0,i+1,i,8,8+i,8+i+1);}
  const sculpted=new THREE.BufferGeometry();sculpted.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));sculpted.setIndex(faces);sculpted.computeVertexNormals();
  const upper=mesh(sculpted,metal);upper.material=metal.clone();upper.material.flatShading=true;
  // A shadowed exterior recess and thin visual ridge define the top line.
  box(-.16,1.16,0,.66,.025,.17,accent);
  box(1.03,1.22,0,2.5,.045,.12,bright);
  silhouette([[-1.94,.31],[-1.82,.47],[-1.56,.54],[1.6,.54],[1.73,.4],[1.53,.26],[.35,.23],[-.26,.18],[-.51,.1],[-1.31,.08],[-1.53,.2]],.44,bright);
  // Pronounced rearward rake in the grip, taken from the side silhouette.
  silhouette([[-1.25,.24],[-.48,.18],[-.42,-.1],[-.67,-.54],[-.99,-1.54],[-1.16,-1.63],[-2.04,-1.63],[-2.11,-1.5],[-1.92,-1.03],[-1.6,-.12]],.46,metal);
  silhouette([[-1.29,.08],[-.66,.05],[-.65,-.18],[-.94,-.77],[-1.13,-1.46],[-1.93,-1.46],[-1.72,-.89]],.53,dark);
  for(const z of [-.29,.29]){
    const stipple=new THREE.InstancedMesh(new THREE.SphereGeometry(.009,5,4),black,450);
    const matrix=new THREE.Object3D();let index=0;
    for(let row=0;row<30;row++)for(let col=0;col<15;col++){
      const fraction=row/29;
      matrix.position.set(-1.25-fraction*.61+col*.038,-.04-fraction*1.31,z);
      matrix.scale.set(1,1,.3);matrix.updateMatrix();stipple.setMatrixAt(index++,matrix.matrix);
    }
    stipple.receiveShadow=true;model.add(stipple);
    for(const [x,y] of [[-1.03,-.16],[-1.56,-1.28]]){
      const pin=mesh(new THREE.CylinderGeometry(.045,.045,.012,20),accent);pin.rotation.x=Math.PI/2;pin.position.set(x,y,z);
      box(x,y,z+.009*Math.sign(z),.04,.007,.003,black);
    }
    const badge=mesh(new THREE.CylinderGeometry(.12,.12,.008,32),dark);badge.rotation.x=Math.PI/2;badge.position.set(-1.3,-.7,z+.004*Math.sign(z));
  }
  const guard=new THREE.Shape();guard.moveTo(-.64,.23);guard.lineTo(.51,.23);guard.quadraticCurveTo(.69,.19,.66,-.2);guard.quadraticCurveTo(.59,-.48,.24,-.51);guard.lineTo(-.45,-.51);guard.lineTo(-.72,-.34);guard.closePath();
  const cut=new THREE.Path();cut.moveTo(-.45,.08);cut.lineTo(-.49,-.24);cut.quadraticCurveTo(-.4,-.36,-.18,-.36);cut.lineTo(.22,-.36);cut.quadraticCurveTo(.51,-.34,.51,-.12);cut.lineTo(.52,.08);cut.closePath();guard.holes.push(cut);
  const gg=new THREE.ExtrudeGeometry(guard,{depth:.23,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:4,curveSegments:20,steps:1});gg.translate(0,0,-.115);mesh(gg,metal);
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.27,.15,0),new THREE.Vector3(-.18,-.04,0),new THREE.Vector3(-.28,-.25,0)]);mesh(new THREE.TubeGeometry(curve,20,.044,12,false),accent);
  // Non-moving decorative exterior reliefs; no mechanical connections.
  silhouette([[-1.7,.96],[-1.89,1.05],[-1.94,.96],[-1.78,.72],[-1.66,.71]],.18,accent);
  box(-1.47,1.24,0,.22,.09,.32,black);
  silhouette([[1.95,1.23],[2.1,1.33],[2.17,1.33],[2.17,1.23]],.1,black);
  for(const z of [-.281,.281]){
    for(let i=0;i<8;i++){const groove=box(-1.25+i*.084,.88,z,.021,.33,.008,accent);groove.rotation.z=-.32;}
    box(.19,.57,z,3.68,.013,.005,accent);
    const round=mesh(new THREE.CylinderGeometry(.105,.105,.017,28),metal);round.rotation.x=Math.PI/2;round.position.set(-1.48,1.01,z);
    const detail=box(-1.37,.92,z,.21,.065,.032,accent);detail.rotation.z=.55;
    box(-.74,.4,z,.42,.068,.025,accent);
    const dot=mesh(new THREE.SphereGeometry(.018,8,8),new THREE.MeshBasicMaterial({color:0x9a3930}));dot.position.set(-1.33,.96,z+.024*Math.sign(z));
  }
  // A closed dark disk indicates the front face, without any interior geometry.
  const front=mesh(new THREE.CylinderGeometry(.105,.105,.005,40),black);front.rotation.z=Math.PI/2;front.position.set(2.284,.9,0);
  const inscription=document.createElement('canvas');inscription.width=1024;inscription.height=128;
  const ink=inscription.getContext('2d');ink.fillStyle='#364047';ink.font='500 48px sans-serif';ink.textAlign='center';ink.fillText('DESERT EAGLE',512,60);ink.font='22px sans-serif';ink.fillText('EXTERIOR STUDY  /  REFERENCE EDITION',512,105);
  const label=mesh(new THREE.PlaneGeometry(1.52,.16),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(inscription),transparent:true,depthWrite:false,opacity:.8}));label.position.set(1.12,.85,.288);label.castShadow=false;
  box(-1.58,-1.62,0,1.06,.09,.55,black);
  model.rotation.z=0;
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
  document.querySelectorAll('[data-finish]').forEach(b=>b.onclick=()=>{const silver=b.dataset.finish==='silver';metal.color.set(silver?0x89949a:0x303a40);bright.color.set(silver?0xb9c3c7:0x4c5962);upper.material.color.copy(metal.color);document.querySelectorAll('[data-finish]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));});
  document.querySelector('#tour').onclick=()=>{setTour(!auto);manuallyPaused=!auto;lastInteraction=performance.now();};
  controls.addEventListener('start',()=>{setTour(false);lastInteraction=performance.now();document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));});
  controls.addEventListener('end',()=>{lastInteraction=performance.now();});
  const detailData={
    profile:{point:new THREE.Vector3(1.4,1.4,.2),title:'01 / Đường nét hình khối',text:'Các mặt vát, đường ngang kéo dài và khối tay cầm tạo nên tương phản giữa chiều dài và chiều cao. Chọn góc mặt bên để quan sát silhouette.'},
    finish:{point:new THREE.Vector3(-.2,1.04,.35),title:'02 / Ánh sáng trên kim loại',text:'Bề mặt satin mang những vệt xước rất mảnh. Thử đổi giữa bạc và graphite, rồi xoay vật thể để quan sát cách ánh sáng chạy trên các cạnh vát.'},
    grip:{point:new THREE.Vector3(-1.4,-.55,.4),title:'03 / Bề mặt tay cầm',text:'Mảng tối và họa tiết nổi tạo điểm tựa thị giác cho tổng thể. Các đường chéo lặp lại đối lập với những mặt phẳng dài của phần thân.'}
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
