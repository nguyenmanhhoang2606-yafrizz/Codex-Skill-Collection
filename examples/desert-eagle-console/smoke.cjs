const path=require('node:path'),os=require('node:os'),fs=require('node:fs'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const skill=process.env.TEARDOWN_SKILL_DIR||path.join(os.homedir(),'.agents/skills/teardown');
const {chromium}=require(path.join(skill,'node_modules/playwright'));
const output=process.env.TEARDOWN_TEST_OUTPUT||path.join(os.tmpdir(),'teardown-console-test');
(async()=>{
 fs.mkdirSync(output,{recursive:true});const browser=await chromium.launch({headless:true,args:['--enable-webgl','--ignore-gpu-blocklist','--enable-unsafe-swiftshader']});
 try{
 const page=await browser.newPage({viewport:{width:1600,height:900}});const errors=[],network=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await page.route(/^https?:\/\//,r=>{network.push(r.request().url());return r.abort()});
 const url=pathToFileURL(path.join(__dirname,'demo.html')).href;
 await page.goto(url+'?capture');await page.waitForFunction(()=>window.SIM?.ready,null,{timeout:60000});
 console.log('capture frames');for(const t of [0,6,12,18]){await page.evaluate(t=>window.SIM.render(t),t);await page.screenshot({path:path.join(output,`frame-${t}.png`)});const state=await page.evaluate(()=>window.CONSOLE_DEMO.state());assert.equal(state.progress,t/24);}
 await page.evaluate(()=>window.SIM.render(6));const first=await page.evaluate(()=>document.querySelector('#gl').toDataURL());const firstState=await page.evaluate(()=>window.CONSOLE_DEMO.state());
 await page.evaluate(()=>{window.SIM.render(19);window.SIM.render(6)});assert.deepEqual(await page.evaluate(()=>window.CONSOLE_DEMO.state()),firstState);assert.equal(await page.evaluate(()=>document.querySelector('#gl').toDataURL()),first,'3D capture must repeat exactly');
 console.log('live controls');await page.goto(url);await page.waitForFunction(()=>window.SIM?.ready,null,{timeout:60000});
 await page.click('#pause');await page.waitForFunction(()=>!window.CONSOLE_DEMO.state().auto);
 await page.click('[data-view="side"]');await page.waitForFunction(()=>window.CONSOLE_DEMO.state().view==='side');
 await page.click('[data-finish="graphite"]');await page.waitForFunction(()=>window.CONSOLE_DEMO.state().finish==='graphite');
 await page.locator('#roughness').fill('0.6');await page.waitForFunction(()=>window.CONSOLE_DEMO.state().roughness===.6);assert.equal(await page.locator('#roughness-value').textContent(),'0.60');
 await page.locator('#light').fill('1.2');await page.waitForFunction(()=>window.CONSOLE_DEMO.state().light===1.2);
 await page.click('[data-feature="2"]');await page.waitForFunction(()=>window.CONSOLE_DEMO.state().feature===2);assert.ok((await page.locator('#feature-title').textContent()).includes('tay cầm'));
 await page.click('#labels');await page.waitForFunction(()=>!window.CONSOLE_DEMO.state().labels);assert.equal(await page.locator('.leaders').isVisible(),false);
 await page.click('#reset');await page.waitForFunction(()=>window.CONSOLE_DEMO.state().view==='hero');
 const before=await page.evaluate(()=>window.CONSOLE_DEMO.state().az);await page.mouse.move(800,420);await page.mouse.down();await page.mouse.move(920,460,{steps:6});await page.mouse.up();await page.waitForFunction(a=>Math.abs(window.CONSOLE_DEMO.state().az-a)>.1,before);
 const distance=await page.evaluate(()=>window.CONSOLE_DEMO.state().d);await page.mouse.wheel(0,120);await page.waitForFunction(d=>window.CONSOLE_DEMO.state().d>d,distance);
 await page.locator('#seek').fill('12');await page.waitForFunction(()=>Math.abs(window.CONSOLE_DEMO.state().progress-.5)<.001);
 const downloading=page.waitForEvent('download');await page.click('#export');await (await downloading).saveAs(path.join(output,'export.png'));assert.equal(fs.readFileSync(path.join(output,'export.png')).subarray(1,4).toString(),'PNG');
 await page.click('#reset');await page.setViewportSize({width:960,height:540});await page.screenshot({path:path.join(output,'landscape.png')});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);assert.equal(overflow,false);
 await page.setViewportSize({width:390,height:844});assert.equal(await page.locator('#rotate-hint').isVisible(),true);await page.screenshot({path:path.join(output,'portrait.png')});
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);await page.waitForFunction(()=>window.SIM?.ready,null,{timeout:60000});await page.waitForFunction(()=>!window.CONSOLE_DEMO.state().auto);
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);
 const result={passed:true,errors,network,overflow,pureCapture:true,checks:['tour frames','pixel-identical repeated 3D canvas','pause','camera','finish','roughness','light','feature','labels','reset','drag','zoom','scrub','PNG export','landscape','portrait hint','reduced motion'],stats:await page.evaluate(()=>window.CONSOLE_DEMO.stats())};
 fs.writeFileSync(path.join(output,'result.json'),JSON.stringify(result,null,2));console.log(result);
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
