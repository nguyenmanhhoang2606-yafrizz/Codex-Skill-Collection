const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const skill=process.env.TEARDOWN_SKILL_DIR||'/home/agent/.agents/skills/teardown';
const {chromium}=require(path.join(skill,'node_modules/playwright'));
const dir=process.env.TEARDOWN_TEST_OUTPUT||'/tmp/de-v8-verification';fs.mkdirSync(dir,{recursive:true});
(async()=>{
 const b=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});
 try{
 const p=await b.newPage({viewport:{width:1600,height:900},hasTouch:true}),errors=[],network=[],checks=[];
 p.setDefaultTimeout(60000);
 p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text())});await p.route(/^https?:/,r=>{network.push(r.request().url());return r.abort();});
 const url=pathToFileURL(path.join(__dirname,'demo.html')).href;
 const state=()=>p.evaluate(()=>DEMO.state());const wait=fn=>p.waitForFunction(fn);
 await p.goto(url+'?capture&quality=2');await wait(()=>SIM?.ready);
 for(const t of [0,3.3,4.8,5.3,6.8,8.3,9.8,11.3,12.8,14.3,15.8,16.3,18.3,20.3,21.8,24.3,25.8]){await p.evaluate(t=>SIM.render(t),t);await p.screenshot({path:path.join(dir,`frame-${t}.png`)});assert.equal((await state()).time,t);}checks.push('all timeline beats and settled views captured');
 await p.evaluate(()=>SIM.render(5.8));const first=await state(),canvas=await p.evaluate(()=>document.querySelector('#gl').toDataURL());await p.evaluate(()=>{SIM.render(17.8);SIM.render(5.8)});assert.deepEqual(await state(),first);assert.ok(await p.evaluate(()=>document.querySelector('#gl').toDataURL())===canvas,'repeated 3D canvas differs');checks.push('pure state and pixel-identical 3D render at arbitrary time');
 const layout=()=>p.evaluate(()=>({panels:[...document.querySelectorAll('.pn')].map(n=>[n.style.left,n.style.top,n.style.width,n.style.height]),type:[...document.querySelectorAll('.cp')].slice(0,1).map(n=>{const c=getComputedStyle(n);return[c.fontFamily,c.fontSize,c.fontWeight,c.letterSpacing]}),buttons:[...document.querySelectorAll('.tb')].slice(0,3).map(n=>[n.style.left,n.style.top,n.style.width,n.style.height])}));
 console.log('capture checks passed');const actual=await layout();
 await p.goto(pathToFileURL(path.resolve(__dirname,'../../teardown-out/dist/v8-live.html')).href);await wait(()=>window.SIM_SHOWN);await p.evaluate(()=>{window.requestAnimationFrame=()=>0;LIVE.takeOver();});const canonical=await layout();assert.deepEqual(actual,canonical);await p.screenshot({path:path.join(dir,'v8-original.png')});checks.push('all 7 panel rectangles, title typography and transport geometry match original V8');
 console.log('canonical layout passed');await p.goto(url+'?quality=2');await wait(()=>SIM?.ready);await p.click('#control-pause');assert.equal((await state()).paused,true);
 console.log('live ready');for(const cam of ['front','side','top','detail','hero']){await p.click('#control-'+cam);assert.equal((await state()).cam,cam);}checks.push('all five camera controls');
 console.log('cameras passed');for(const cut of ['graphite','clay','silver']){await p.click('#control-'+cut);assert.equal((await state()).cut,cut);assert.equal(await p.evaluate(()=>DEMO.stage.eng.groups[0].children[0].material.roughness),cut==='clay'?.8:.47);}checks.push('all three finishes change actual material');
 console.log('finishes passed');for(const k of ['callouts','edges','focus','charts']){const before=(await state()).overlays[k];await p.click('#control-'+k);assert.equal(!!(await state()).overlays[k],!before);}checks.push('all four display toggles');
 console.log('toggles passed');await p.click('#feature-2');assert.equal((await state()).feature,2);assert.equal((await state()).overlays.focus,true);checks.push('surface selection and highlight');
 await p.locator('#tour-position').fill('13.8');assert.equal((await state()).time,13.8);await p.locator('#tour-speed').fill('1.5');assert.equal((await state()).speed,1.5);checks.push('timeline and speed sliders');
 await p.click('#control-reset');const az=(await state()).camera.az;await p.click('#control-fwd');assert.equal((await state()).camera.az,az+15);await p.click('#control-back');assert.equal((await state()).camera.az,az);checks.push('reset and angle stepping');
 await p.mouse.move(800,450);await p.mouse.down();await p.mouse.move(900,460);await p.mouse.up();assert.notEqual((await state()).camera.az,az);const d=(await state()).camera.d;await p.mouse.wheel(0,100);await p.waitForFunction(d=>DEMO.state().camera.d>d,d);checks.push('drag orbit and wheel zoom');
 console.log('interaction checks passed');const download=p.waitForEvent('download');await p.click('#control-save');await(await download).saveAs(path.join(dir,'export.png'));assert.equal(fs.readFileSync(path.join(dir,'export.png')).subarray(1,4).toString(),'PNG');checks.push('PNG download');
 await p.keyboard.press('h');assert.equal(await p.locator('.ui').evaluate(n=>n.style.visibility),'hidden');await p.keyboard.press('h');checks.push('overlay keyboard toggle');
 await p.setViewportSize({width:960,height:540});await p.click('#control-reset');await p.screenshot({path:path.join(dir,'landscape.png')});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.setViewportSize({width:390,height:844});assert.equal(await p.locator('.turn').isVisible(),true);await p.screenshot({path:path.join(dir,'portrait.png')});checks.push('landscape fit and portrait hint');
 await p.emulateMedia({reducedMotion:'reduce'});await p.goto(url+'?quality=2');await wait(()=>SIM?.ready);assert.equal((await state()).paused,true);checks.push('reduced motion');
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);assert.ok(fs.statSync(path.join(__dirname,'demo.html')).size<1000000);checks.push('offline, no browser errors, under 1 MB');
 const result={passed:true,checks,errors,network,canonicalLayout:canonical,renderer:'Chromium / SwiftShader',limits:['not an integrated-GPU benchmark','no firearm operation or internal mechanism','portrait uses original scaled console','no controlled reasoning-effort A/B test']};fs.writeFileSync(path.join(dir,'result.json'),JSON.stringify(result,null,2));console.log(result);
 }finally{await b.close();}
})().catch(e=>{console.error(e);process.exit(1)});
