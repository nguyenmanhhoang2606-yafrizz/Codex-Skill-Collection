import * as THREE from 'three';
// Exterior sculpture from the user reference study; illustrative units only.
export function buildModel(){
  const grain=document.createElement('canvas');grain.width=256;grain.height=128;
  const brush=grain.getContext('2d');brush.fillStyle='#969696';brush.fillRect(0,0,256,128);
  for(let y=0;y<128;y++){const v=110+Math.round(45*Math.sin(y*13.73));brush.fillStyle=`rgb(${v},${v},${v})`;brush.fillRect(0,y,256,1);}
  const brushed=new THREE.CanvasTexture(grain);brushed.wrapS=brushed.wrapT=THREE.RepeatWrapping;brushed.repeat.set(2,2);
  const metal=new THREE.MeshStandardMaterial({color:0x89949a,metalness:0.9,roughness:0.3,bumpMap:brushed,bumpScale:0.0015});
  const bright=new THREE.MeshStandardMaterial({color:0xb9c3c7,metalness:0.7,roughness:0.3});
  const dark=new THREE.MeshStandardMaterial({color:0x202426,roughness:0.65,metalness:0.08});
  const black=new THREE.MeshStandardMaterial({color:0x101415,roughness:0.9});
  const accent=new THREE.MeshStandardMaterial({color:0x676e70,metalness:0.8,roughness:0.4});
  const model=new THREE.Group();
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

 return {root:model,metal,bright,upper,dark};
}
