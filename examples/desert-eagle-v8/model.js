import * as T from 'three';
// Artistic exterior shell. Arbitrary proportions, no functional internal parts.
export function buildModel(){
 const root=new T.Group();root.scale.setScalar(.135);
 const groups=Array.from({length:8},()=>{const g=new T.Group();root.add(g);return g;});
 const texture=(w,h,draw)=>{const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.anisotropy=4;return t;};
 const grain=texture(512,256,(c,w,h)=>{c.fillStyle='#888';c.fillRect(0,0,w,h);for(let y=0;y<h;y++){const v=118+Math.round(15*Math.sin(y*17.19));c.fillStyle=`rgb(${v},${v},${v})`;c.fillRect(0,y,w,1);}});
 const rubber=texture(512,512,(c,w,h)=>{c.fillStyle='#686868';c.fillRect(0,0,w,h);for(let y=0;y<64;y++)for(let x=0;x<64;x++){const v=60+((x*73+y*193)%75);c.fillStyle=`rgb(${v},${v},${v})`;c.beginPath();c.arc(x*8+(y%2)*4,y*8,1.8,0,Math.PI*2);c.fill();}});rubber.wrapS=rubber.wrapT=T.RepeatWrapping;
 const metal=new T.MeshStandardMaterial({color:'#9ea5ad',metalness:.85,roughness:.47,envMapIntensity:.65,bumpMap:grain,bumpScale:.001});
 const trim=new T.MeshStandardMaterial({color:'#c3c8cc',metalness:.8,roughness:.46,envMapIntensity:.65});
 const dark=new T.MeshStandardMaterial({color:'#272a2c',metalness:.08,roughness:.82,bumpMap:rubber,bumpScale:.025});
 const graphite=new T.MeshStandardMaterial({color:'#41484f',metalness:.75,roughness:.5});
 const black=new T.MeshStandardMaterial({color:'#080b0d',roughness:.72});
 const meshes=[];
 function mesh(g,m,group=0){const mat=m.clone();const o=new T.Mesh(g,mat);o.castShadow=true;o.receiveShadow=true;groups[group].add(o);meshes.push({o,base:mat.color.clone(),metal:m===metal||m===trim,group});return o;}
 function outline(points,depth,mat=metal,group=0,bevel=.025){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();return extrude(s,depth,mat,group,bevel);}
 function extrude(s,depth,mat,group,bevel=.025){const g=new T.ExtrudeGeometry(s,{depth,steps:1,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:4,curveSegments:32});g.translate(0,0,-depth/2);return mesh(g,mat,group);}
 function box(x,y,z,w,h,d,mat=metal,group=0){const s=new T.Shape();const r=Math.min(w,h)*.12;s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const o=extrude(s,d,mat,group,.006);o.position.set(x,y,z);return o;}
 // Rounded rear shell, short bevelled forebody; all closed meshes.
 const rear=new T.Shape();rear.moveTo(-1.72,.57);rear.lineTo(-1.72,1.03);rear.quadraticCurveTo(-1.7,1.17,-1.52,1.19);rear.lineTo(-.33,1.19);rear.lineTo(-.21,1.06);rear.lineTo(.2,1.06);rear.lineTo(.26,.66);rear.lineTo(-.12,.56);rear.closePath();extrude(rear,.51,metal,1,.035);
 const cross=[[-.16,1.2],[.16,1.2],[.275,1.08],[.275,.78],[.18,.63],[-.18,.63],[-.275,.78],[-.275,1.08]];
 const positions=[],indices=[];for(const x of [-.18,2.28])for(const [z,y]of cross)positions.push(x,y,z);
 for(let i=0;i<8;i++){const j=(i+1)%8;indices.push(i,j,8+j,i,8+j,8+i);}for(let i=1;i<7;i++)indices.push(0,i+1,i,8,8+i,8+i+1);
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);const flat=g.toNonIndexed();flat.computeVertexNormals();mesh(flat,metal,0);
 box(1.12,1.225,0,2.28,.025,.18,trim,0);
 outline([[-.2,.65],[1.59,.65],[1.59,.55],[-.2,.55]],.43,metal,5,.012);
 // Sculpted external frame with a curved transition into the grip.
 const frame=new T.Shape();frame.moveTo(-1.83,.46);frame.quadraticCurveTo(-1.75,.56,-1.53,.55);frame.lineTo(1.61,.55);frame.lineTo(1.65,.42);frame.quadraticCurveTo(1.6,.33,1.38,.32);frame.lineTo(.3,.31);frame.quadraticCurveTo(-.3,.29,-.57,.12);frame.lineTo(-.94,-1.48);frame.quadraticCurveTo(-1,-1.61,-1.18,-1.61);frame.lineTo(-1.99,-1.61);frame.quadraticCurveTo(-2.12,-1.59,-2.04,-1.34);frame.lineTo(-1.61,.04);frame.quadraticCurveTo(-1.52,.25,-1.72,.33);frame.lineTo(-1.92,.36);frame.closePath();extrude(frame,.43,metal,5,.035);
 // Continuous rounded grip panels with fine stipple and recessed badge.
 for(const sign of [-1,1]){
 const s=new T.Shape();s.moveTo(-1.37,.08);s.quadraticCurveTo(-1.15,.12,-.75,.05);s.lineTo(-.76,-.1);s.lineTo(-1.13,-1.43);s.quadraticCurveTo(-1.45,-1.51,-1.91,-1.44);s.lineTo(-1.86,-1.24);s.lineTo(-1.51,-.03);s.quadraticCurveTo(-1.48,.08,-1.37,.08);s.closePath();const panel=extrude(s,.06,dark,2,.025);panel.position.z=sign*.258;
 for(const [x,y] of [[-1.11,-.15],[-1.6,-1.24]]){const o=mesh(new T.CylinderGeometry(.046,.046,.016,32),graphite,2);o.rotation.x=Math.PI/2;o.position.set(x,y,sign*.307);box(x,y,sign*.317,.048,.006,.004,black,2);}
 const badge=mesh(new T.CylinderGeometry(.128,.128,.009,48),dark,2);badge.rotation.x=Math.PI/2;badge.position.set(-1.36,-.72,sign*.309);
 const rim=mesh(new T.TorusGeometry(.123,.004,6,48),graphite,2);rim.position.set(-1.36,-.72,sign*.316);
 // Restrained embossed abstract mark, decorative only.
 const mark=outline([[-.075,0],[-.018,.024],[0,.062],[.018,.024],[.075,0],[.02,.008],[0,-.04],[-.02,.008]],.005,graphite,2,.001);mark.position.set(-1.36,-.72,sign*.319);
 }
 // Fine stipple follows the exterior grip contour; one instanced draw per side.
 for(const sign of [-1,1]){
  const dots=new T.InstancedMesh(new T.SphereGeometry(.006,5,4),graphite,720),obj=new T.Object3D();let n=0;
  for(let row=0;row<40;row++)for(let col=0;col<18;col++){
   const f=row/39;obj.position.set(-1.4-.4*f+col*.029,-.06-f*1.3,sign*.315);obj.scale.set(1,1,.3);obj.updateMatrix();dots.setMatrixAt(n++,obj.matrix);
  }groups[2].add(dots);
 }
 const guard=new T.Shape();guard.moveTo(-.63,.3);guard.lineTo(.62,.3);guard.quadraticCurveTo(.77,.22,.7,-.13);guard.quadraticCurveTo(.64,-.45,.26,-.47);guard.lineTo(-.48,-.47);guard.lineTo(-.69,-.27);guard.closePath();
 const hole=new T.Path();hole.moveTo(-.46,.16);hole.lineTo(-.48,-.21);hole.quadraticCurveTo(-.42,-.32,-.2,-.32);hole.lineTo(.25,-.32);hole.quadraticCurveTo(.57,-.32,.56,-.05);hole.lineTo(.55,.16);hole.closePath();guard.holes.push(hole);extrude(guard,.2,trim,3,.025);
 const curve=new T.CatmullRomCurve3([new T.Vector3(-.2,.17,0),new T.Vector3(-.1,-.02,0),new T.Vector3(-.23,-.22,0)]);mesh(new T.TubeGeometry(curve,28,.038,12,false),graphite,3);
 outline([[-1.71,1.01],[-1.89,1.11],[-1.94,1.06],[-1.8,.78],[-1.7,.76]],.16,graphite,1,.015);
 box(-1.48,1.265,0,.23,.085,.31,black,4);
 outline([[1.98,1.24],[2.12,1.37],[2.2,1.37],[2.2,1.24]],.085,black,4,.009);
 for(const sign of [-1,1]){
 for(let i=0;i<10;i++){const o=box(-1.32+i*.081,.88,sign*.292,.017,.34,.005,graphite,1);o.rotation.z=-.29;}
 box(-.91,.565,sign*.258,1.55,.012,.005,graphite,5);
 const disk=mesh(new T.CylinderGeometry(.098,.098,.017,40),trim,5);disk.rotation.x=Math.PI/2;disk.position.set(-1.5,1.01,sign*.287);
 const lever=box(-1.39,.95,sign*.305,.22,.05,.022,graphite,5);lever.rotation.z=.5;
 box(-.73,.39,sign*.245,.37,.045,.025,graphite,5);
 const dot=mesh(new T.SphereGeometry(.013,12,8),new T.MeshStandardMaterial({color:'#98282c',roughness:.65}),5);dot.position.set(-1.35,1.01,sign*.31);
 }
 const front=mesh(new T.CylinderGeometry(.103,.103,.004,48),black,0);front.rotation.z=Math.PI/2;front.position.set(2.283,.93,0);
 const ring=mesh(new T.TorusGeometry(.108,.008,8,48),trim,0);ring.rotation.y=Math.PI/2;ring.position.set(2.285,.93,0);
 box(-1.53,-1.62,0,1.02,.065,.52,black,7);
 const writing=texture(1024,128,(c)=>{c.fillStyle='#353b42';c.textAlign='center';c.font='500 44px sans-serif';c.fillText('DESERT EAGLE',512,50);c.font='18px sans-serif';c.fillText('REFERENCE STUDY  ·  SATIN FINISH',512,88);});
 const decal=new T.Mesh(new T.PlaneGeometry(1.28,.16),new T.MeshBasicMaterial({map:writing,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-1}));decal.position.set(1.12,.91,.277);groups[6].add(decal);
 const edges=new T.Group();for(const {o}of meshes){const e=new T.LineSegments(new T.EdgesGeometry(o.geometry,32),new T.LineBasicMaterial({color:'#59616a',transparent:true,opacity:.24}));e.position.copy(o.position);e.rotation.copy(o.rotation);e.scale.copy(o.scale);edges.add(e);}root.add(edges);
 function update(s){
  for(const m of meshes){m.o.material.color.copy(m.base);if(m.metal){m.o.material.roughness=s.roughness;if(s.cut==='graphite')m.o.material.color.multiplyScalar(.34);if(s.cut==='clay'){m.o.material.color.set('#b4b3ae');m.o.material.metalness=0;}else m.o.material.metalness=.85;}
   m.o.material.emissive.set(s.overlays.focus&&m.group===s.feature?'#3d0609':'#000');
  }
  edges.visible=!!s.overlays.edges;
 }
 return {root,update,groups,setCut(){},setRefract(){}};
}
