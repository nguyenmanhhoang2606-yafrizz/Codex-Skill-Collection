// Adapted from teardown sims/v8-shared/stage.js (MIT): gradient backdrop,
// studio softboxes, shadow catcher, spherical camera and project() contract.
import * as THREE from 'three';
import {warmUp} from 'teardown-kit/warm.js';
import {buildModel} from './model.js';
export function createStage(canvas){
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});
 renderer.toneMapping=THREE.NeutralToneMapping;renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFShadowMap;
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,16/9,.1,100),model=buildModel();scene.add(model.root);
 const bg=document.createElement('canvas');bg.width=4;bg.height=512;const ctx=bg.getContext('2d'),gradient=ctx.createLinearGradient(0,0,0,512);gradient.addColorStop(0,'#f3f3f4');gradient.addColorStop(.55,'#e9eaec');gradient.addColorStop(1,'#e3e4e6');ctx.fillStyle=gradient;ctx.fillRect(0,0,4,512);scene.background=new THREE.CanvasTexture(bg);
 const env=new THREE.Scene();env.background=new THREE.Color('#d9dadd');
 const box=(w,h,pos,k)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color:new THREE.Color(1,1,1).multiplyScalar(k),side:THREE.DoubleSide}));m.position.set(...pos);m.lookAt(0,0,0);env.add(m);};
 box(12,12,[0,14,2],2.6);box(3,14,[-12,4,6],3.4);box(3,14,[12,4,-4],2.2);box(18,2,[0,2,14],1.6);
 const pm=new THREE.PMREMGenerator(renderer);scene.environment=pm.fromScene(env,.02).texture;pm.dispose();
 const sun=new THREE.DirectionalLight('#ffffff',2.2);sun.position.set(-3,7,5);sun.castShadow=true;Object.assign(sun.shadow.camera,{left:-5,right:5,top:5,bottom:-5,near:.5,far:30});sun.shadow.mapSize.set(1024,1024);sun.shadow.bias=-.0004;sun.shadow.normalBias=.015;sun.shadow.radius=3;scene.add(sun,sun.target);scene.add(new THREE.HemisphereLight('#ffffff','#cfd0d3',.9));
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.ShadowMaterial({color:'#5d636c',opacity:.2,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-8}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.43;floor.receiveShadow=true;scene.add(floor);
 let W=1600,H=900;const target=new THREE.Vector3(0,.12,0);
 function resize(w,h){W=w;H=h;renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
 function frame(state){
  model.metal.color.set(state.finish==='silver'?0xa4a9ac:0x354047);model.upper.material.color.copy(model.metal.color);model.bright.color.set(state.finish==='silver'?0xc3c7c9:0x59666e);
  model.metal.roughness=state.roughness;model.upper.material.roughness=state.roughness;renderer.toneMappingExposure=state.light;
  camera.position.set(state.d*Math.cos(state.el)*Math.sin(state.az),target.y+state.d*Math.sin(state.el),state.d*Math.cos(state.el)*Math.cos(state.az));camera.lookAt(target);camera.updateMatrixWorld();renderer.render(scene,camera);
 }
 const project=point=>{const p=model.root.localToWorld(new THREE.Vector3(...point)).project(camera);return [(p.x*.5+.5)*W,(-p.y*.5+.5)*H];};
 return {renderer,scene,camera,frame,resize,project,warm:()=>warmUp(renderer,camera,[{scene}])};
}
