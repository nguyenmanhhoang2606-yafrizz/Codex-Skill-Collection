const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const skill=process.env.TEARDOWN_SKILL_DIR||path.join(require('node:os').homedir(),'.agents/skills/teardown');
const {chromium}=require(path.join(skill,'node_modules/playwright'));
(async()=>{const browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader','--ignore-gpu-blocklist']});const results=[];
 try{const p=await browser.newPage({viewport:{width:1600,height:900},hasTouch:true});p.setDefaultTimeout(60000);const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route(/^https?:/,r=>r.abort());
 await p.goto(pathToFileURL(path.join(__dirname,'demo.html')).href+'?quality=2');await p.waitForFunction(()=>window.SIM?.ready);
 const state=()=>p.evaluate(()=>DEMO.state()),reset=()=>p.click('#control-reset'),settled=()=>p.waitForFunction(()=>!DEMO.state().transitioning);
 const test=async(name,fn)=>{try{await reset();await fn();results.push({name,passed:true});}catch(e){results.push({name,passed:false,error:e.message.slice(0,350)});}console.log(results.at(-1));};
 await test('Focus changes the rendered marking, not just state',async()=>{await p.click('#feature-6');await settled();const a=await p.evaluate(()=>document.querySelector('#gl').toDataURL());await p.click('#control-focus');const b=await p.evaluate(()=>document.querySelector('#gl').toDataURL());assert.ok(a!==b,'marking canvas unchanged');});
 await test('Space on focused Pause toggles exactly once',async()=>{await p.focus('#control-pause');await p.keyboard.press('Space');assert.equal((await state()).paused,false);});
 await test('Chart scrubs continuously while dragging',async()=>{const r=await p.evaluate(()=>{const r=DEMO.ui.plot.getBoundingClientRect();return{x:r.x,y:r.y,w:r.width,h:r.height}});await p.mouse.move(r.x+r.w*.2,r.y+r.h*.5);await p.mouse.down();const down=(await state()).time;await p.mouse.move(r.x+r.w*.8,r.y+r.h*.5,{steps:5});await p.mouse.up();assert.ok((await state()).time>down+10,'time did not follow drag');});
 await test('Selecting a surface reframes its actual region',async()=>{const before=(await state()).camera;await p.click('#feature-2');await settled();assert.notDeepEqual((await state()).camera,before);});
 await test('Resume Tour retains chosen playback speed',async()=>{await p.locator('#tour-position').fill('8');await p.locator('#tour-speed').fill('1.5');await p.click('.tourchip');await p.waitForFunction(()=>DEMO.state().time>8.1);assert.equal((await state()).speed,1.5);});
 await test('Reduced-motion preference still allows explicit Play',async()=>{await p.emulateMedia({reducedMotion:'reduce'});await p.reload();await p.waitForFunction(()=>SIM?.ready);assert.equal((await state()).paused,true);await p.click('#control-pause');await p.waitForFunction(()=>DEMO.state().time>.01,null,{timeout:5000});});
 const reviewDir=process.env.REVIEW_OUTPUT||'/tmp/de-fix-review';fs.mkdirSync(reviewDir,{recursive:true});
 for(let i=0;i<8;i++)await test('Visible focus for surface '+(i+1),async()=>{
  await p.click('#feature-'+i);await settled();
  await p.screenshot({path:path.join(reviewDir,'surface-'+(i+1)+'.png')});
  const lit=await p.evaluate(()=>document.querySelector('#gl').toDataURL());
  await p.click('#control-focus');const unlit=await p.evaluate(()=>document.querySelector('#gl').toDataURL());
  assert.ok(lit!==unlit,'focus did not affect the 3D render');
 });
 assert.deepEqual(errors,[]);
 }finally{await browser.close();}
 const output=process.env.REGRESSION_OUTPUT||'/tmp/de-regressions.json';fs.writeFileSync(output,JSON.stringify({passed:results.every(r=>r.passed),results},null,2));if(results.some(r=>!r.passed))process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
