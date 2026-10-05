'use strict';
const $=id=>document.getElementById(id), KEY='velorne.private.visit.v1';
const fresh=()=>({scene:'exterior',started:false,seen:[],clues:[],doorTried:false,finished:false,rainHeard:false,exploreMs:0,inspected:[],compartmentOpen:false,keyOwned:false,keyTried:false,entryUnlocked:false,arrivalSeen:[],rainCueVersion:2,rainWindowSeen:false,receptionDone:false,cautious:[],candlePosition:0,lightRevealed:false,drawerReleased:false,candleHeld:false,entryChecked:false,sealReturned:false,corridorAsked:false,keyNoteRead:false,storyLog:[],seenStories:[],viewedActions:[],beastHeard:false,galleryHeard:false,visits:{},objectVisits:{},drawerOpened:false,rainLooks:0,beastRepeatHeard:false});let state=fresh();try{const saved=JSON.parse(localStorage.getItem(KEY));if(saved&&Array.isArray(saved.clues)&&Array.isArray(saved.seen))state={...state,...saved,rainCueVersion:saved.rainCueVersion||0}}catch{}
if(state.rainCueVersion!==2){state.rainHeard=false;state.rainWindowSeen=false;state.rainCueVersion=2}
if(state.receptionDone){state.candleHeld=true;state.entryChecked=true;}
const scenes={
 northdoor:{title:'北側玻璃門',en:'THE NORTHERN DOOR',caption:'你停在北側玻璃門前。',spots:[['north-lock','查看北側門鎖',61,56],['north-plaque','看清北側銘牌',78,36]],nav:[['north-lock','查看北側門鎖'],['room','沿拱門退回書房']]},
 glasswalk:{title:'北側玻璃廊',en:'THE NORTHERN GLASS WALK',caption:'雨輕輕落在玻璃頂上。',spots:[['light-shelf','燈下的新燭與短箋',87,64],['glass-rain','看看雨中的玻璃',26,39],['garden-door','玻璃廊盡頭的門',55,49]],nav:[['light-shelf','靠近燈下'],['garden-door','看看走廊盡頭'],['northdoor','沿來路退回北側門']]},
 exterior:{title:'宅邸門前',en:'THE ARRIVAL',caption:'鐵門已經敞開。\n窗裡的燈光，像是一直在等人。',spots:[['enter','靠近大門',62.8,67],['stone-lion','門前的石獅',17,32],['lit-window','亮著的高窗',62,27],['invitation-check','查看手中的邀請函',42,84]],nav:[]},
 foyer:{title:'緊閉的玄關',en:'BEHIND THE DOOR',caption:'厚門已經合上。月光落在門邊的矮桌上。',spots:[['entry-lock','查看門把與門鎖',40,48],['entry-console','看看門邊的矮桌',84,58]],nav:[['entry-lock','回頭查看大門'],['entry-console','環顧門邊']]},
 hall:{title:'前廳',en:'THE VESTIBULE',caption:'門在身後合上。\n屋裡很靜，只有你的腳步聲。',spots:[['room','循燭光找人',44,49],['door','右側走廊',77,52],['stairs','樓梯',24,47]],nav:[['room','循燭光找人'],['door','側廊']]},
 room:{title:'主人的書房',en:'THE PRIVATE STUDY',caption:'書桌邊緣閃過一點微光。\n這些收藏，似乎都被仔細照料著。',spots:[['desk','桌邊的一點反光',62,61],['painting','牆上的畫',74,24],['window','走近窗邊',54,28],['cabinet','收藏櫃',29,31],['northdoor','書房左側拱門',11,43]],nav:[['northdoor','看看左側拱門'],['desk','靠近書桌'],['hall','返回前廳']]},
 desk:{title:'主人的書桌',en:'THE WRITING DESK',caption:'信紙攤開，茶杯留在原處。\n主人似乎只是暫時離開。',spots:[['letter','淺色信封',60,62],['book','皮革封面的簿冊',70,71],['lion','左側獅像',11,66],['globe','天球儀',84,53],['candle','華麗的燭台',28,57],['seal','書桌正面的八芒紋',52,87],['window','書桌後方的窗子',8,18]],nav:[['room','退回書房'],['door','前往側廊']]},
 door:{title:'側廊',en:'THE CLOSED DOOR',caption:'腳步聲在這裡停住了。\n門後很安靜。',spots:[['lock','靠近房門，先敲門詢問',56,59]],nav:[['hall','返回前廳'],['desk','回到書桌']]},
 window:{title:'雨落的窗',en:'RAIN ON THE GLASS',caption:'玻璃上，一滴水正慢慢滑落。\n你靠近了，才發覺窗外在下雨。',spots:[['watch-rain','看著窗上的雨',52,43],['window-mark','窗框上的細小刻痕',38,70]],nav:[['room','離開窗邊']]},
 stairwell:{title:'燭光到不了的樓梯',en:'BEYOND THE LAST STEP',caption:'你舉起燭台。光只能照見腳邊的幾級台階。',spots:[['stair-depth','抬高快熄滅的燭台，望向樓梯深處',58,24]],nav:[['gallery','退回肖像長廊']]},
 gallery:{title:'肖像長廊',en:'BEYOND THE LAMPLIGHT',caption:'燭光掠過一排肖像。\n長廊裡暫時沒有動靜。',spots:[['ending','看看樓梯、房門或前廳',72,56]],nav:[['ending','看看黑暗深處'],['hall','返回前廳']]}
};if(!scenes[state.scene])state.scene='exterior';
const notes={letter:['未收起的家務便函','「那間房仍照舊打理。」\n下面還留著大片空白。沒有稱呼，也沒有落款。\n你原想找個能呼喚的名字，目光卻只碰到這句話。這像是一封尚未寫完的家務便函；你沒有再往下翻找。'],book:['宅邸記事簿上的備註','「西廊照舊留燈。琴上的譜，請留在原來那頁。」\n幾行字被劃去，又在旁邊補寫。這本簿冊顯然常有人翻動。'],lion:['獅像底座的便箋','「花每日更換。窗不要打開。\n主人晚歸時，燈也照常留著。」\n原來，那扇門後的房間一直有人照料。']};
notes.seal=['印章底部的刻字','八芒紋下方，刻著很淺的「VII」。\n它像是一個編號。用途仍不明。'];
notes.ledger=['第 VII 號房的交班次序','西廊房間。先閉窗，再留燈，最後歸鑰。\n抽屜內的歸鑰匣，依房號與交班次序開啟。'];
notes.key=['一把不合鎖孔的鑰匙','鑰匙沒有轉動。這不是側廊房門的鑰匙。\n磨舊的標籤背面寫著：玻璃廊 · 北側。'];
notes.northKey=['鑰匙找到的門','細長的鑰匙打開了北側玻璃門。門留著一道縫，鑰匙暫時收好，等待歸還主人。'];
notes.borrowFlame=['燈下的許可','給我們的訪客。取一支蠟燭，借一點火。'];
notes.newLight=['接過來的燭火','你依短箋所說換上一支新燭。換下的短蠟留在托盤裡，壁燈依然亮著。'];
notes.answeringKnock=['玻璃另一側的三聲','雨夜的玻璃門外傳來三聲輕叩。你敲回同樣的三聲。對方似乎正在等待。'];
notes.windowMark=['窗框內側的刻痕','三道短刻線，旁邊刻著一彎月牙。\n下緣的小字是：「借夜色三分，照見未言之處。」'];
notes.lightTrace=['燭光照出的接縫','燭台朝窗的方向轉過三格後，斜光落在書桌正面的八芒紋。\n紋章中央有一處可以按下的凹痕。'];
// Existing discoveries remain usable after adding the new introductory puzzle.
if(state.clues.includes('seal')||state.compartmentOpen||state.keyOwned)state.drawerReleased=true;
state.candlePosition=Number.isInteger(state.candlePosition)?Math.max(-3,Math.min(3,state.candlePosition)):0;
state.clues=state.clues.filter(id=>Object.hasOwn(notes,id));
let beatEpoch=0,beatTimer=null;
let sceneEpoch=0,lockBusy=false,sealViewer=null,moving=false,walkToken=0;
state.arrivalSeen=Array.isArray(state.arrivalSeen)?state.arrivalSeen:[];
state.inspected=Array.isArray(state.inspected)?state.inspected:[];state.exploreMs=Number.isFinite(state.exploreMs)?state.exploreMs:0;
let lastInteraction=Date.now(),lastNarration=0;
const reducedMotion=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
let toastTimer,captionTimer,lastFocus;let soundOn=true,ctx,ambience;function save(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch{$('save').textContent='此瀏覽器無法保存進度'}$('count').textContent=String(state.clues.length).padStart(2,'0');$('resume').hidden=!state.started;$('inventory').textContent='隨身物品 '+String(Number(state.keyOwned)+Number(state.candleHeld)).padStart(2,'0')}
function toast(t){$('toast').textContent=t;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2800)}
function caption(t){lastNarration=Date.now();clearTimeout(captionTimer);$('caption').textContent=t;rememberLine(scenes[state.scene]?.title||'來訪',t);if(/反光|微光|閃/.test(t)){for(const b of $('hotspots').children){if(!explored(b.dataset.action)&&b.dataset.action===(state.scene==='window'?'window-mark':'desk')){b.classList.remove('glint-now');void b.offsetWidth;b.classList.add('glint-now')}}}}
let master,wet,musicBus,musicTimer=null,musicOn=true,musicVolume=.20,musicVoices=[],musicReverb,musicBar=0;let volume=.38;
try{const stored=localStorage.getItem('velorne.quietVolume');if(stored!==null&&Number.isFinite(Number(stored)))volume=Math.max(0,Math.min(1,Number(stored)))}catch{}
function audioInit(){if(!ctx){const A=window.AudioContext||window.webkitAudioContext;if(!A)return false;try{ctx=new A();master=ctx.createGain();master.gain.value=soundOn?volume:0;master.connect(ctx.destination);musicBus=ctx.createGain();musicBus.gain.value=0;musicBus.connect(ctx.destination);wet=ctx.createConvolver();const impulse=ctx.createBuffer(2,ctx.sampleRate*2.7,ctx.sampleRate);for(let c=0;c<2;c++){const d=impulse.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3)*.4}wet.buffer=impulse;musicReverb=ctx.createConvolver();musicReverb.buffer=impulse;const mg=ctx.createGain();mg.gain.value=.20;musicBus.connect(musicReverb).connect(mg).connect(ctx.destination);const wg=ctx.createGain();wg.gain.value=.24;wet.connect(wg).connect(master)}catch{ctx=null;return false}}ctx.resume().catch(()=>{});return true}
function route(node,pan=0,echo=false){
 if(echo&&ctx.createDelay){
  // Soft, filtered reflections arrive from different wall distances, not two hard repeats.
  for(const [t,a]of [[.047,.14],[.089,.105],[.143,.078],[.207,.054],[.291,.035],[.381,.021]]){
   const d=ctx.createDelay(.5),g=ctx.createGain(),f=ctx.createBiquadFilter();d.delayTime.value=t;g.gain.value=a;f.type='lowpass';f.frequency.value=2000-t*2900;node.connect(d).connect(f).connect(g).connect(master);setTimeout(()=>{d.disconnect();f.disconnect();g.disconnect()},2200);
  }
 }
 if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=pan;node.connect(p);p.connect(master);p.connect(wet)}else{node.connect(master);node.connect(wet)}
}
function tone(freq,duration=.3,volume=.08,type='sine',pan=0){if(!soundOn||!ctx)return;const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(freq*.72,ctx.currentTime+duration);g.gain.setValueAtTime(.0001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(Math.max(volume,.001),ctx.currentTime+.02);g.gain.exponentialRampToValueAtTime(.0001,ctx.currentTime+duration);o.connect(g);route(g,pan);o.start();o.stop(ctx.currentTime+duration)}
function noise(duration=.15,volume=.1,filter=1200,pan=0){if(!soundOn||!ctx)return;const b=ctx.createBuffer(1,Math.ceil(ctx.sampleRate*duration),ctx.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,1.8);const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=b;f.type='lowpass';f.frequency.value=filter;g.gain.value=volume;src.connect(f).connect(g);route(g,pan);src.start()}
function later(fn,ms){const epoch=sceneEpoch;return setTimeout(()=>{if(epoch===sceneEpoch&&!document.hidden)fn()},ms)}
function footsteps(surface=state.scene){
 const carpet=false; // These rooms share the same marble floor.
 [180,1050+Math.random()*70,1930+Math.random()*70,2800+Math.random()*70,3650+Math.random()*70].forEach((ms,i)=>later(()=>{if(!moving)return;sfx(carpet?'step-soft':'step-stone',i%2?.22:-.22)},ms/pace));
}
function growl(){quietFoley('beast',.09,.55)}
function ambient(){
 if(ambience){ambience.stop();ambience=null}
 if(!soundOn||!ctx||!state.rainWindowSeen||$('exploration').hidden||!['window','room','glasswalk'].includes(state.scene))return;
 const b=recordedFoley.rain;
 if(!b){loadFoley();const epoch=sceneEpoch,beat=beatEpoch;foleyLoads.rain?.then(buffer=>{if(buffer&&epoch===sceneEpoch)ambient()});return;}
 const src=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=b;src.loop=true;f.type='lowpass';f.frequency.value=3400;g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(state.scene==='glasswalk'?.045:state.scene==='window'?.075:.015,ctx.currentTime+4);src.connect(f).connect(g).connect(master);src.start();src.onended=()=>{src.disconnect();f.disconnect();g.disconnect()};let stopped=false;ambience={stop(){if(stopped)return;stopped=true;g.gain.cancelScheduledValues(ctx.currentTime);g.gain.setTargetAtTime(0,ctx.currentTime,.3);src.stop(ctx.currentTime+1.5)}};
}
function seeRainWindow(){
 if(state.scene!=='window'||moving||!$('scene').complete||!$('scene').naturalWidth)return;
 if(!state.rainWindowSeen){state.rainWindowSeen=true;state.rainHeard=true;save();ambient();caption('你看著細小的水痕，才聽見雨點輕碰玻璃。\n來的時候，石階明明還是乾的。')}
}
function setSound(){if(!audioInit()){toast('這個瀏覽器暫時無法播放環境音。');return}soundOn=!soundOn;$('sound').textContent='環境音 '+(soundOn?'開':'關');$('sound').setAttribute('aria-pressed',soundOn);$('volume-control').hidden=!soundOn;if(master){master.gain.cancelScheduledValues(ctx.currentTime);master.gain.setTargetAtTime(soundOn?volume:0,ctx.currentTime,.12)}ambient();syncMusic()}
$('volume').value=Math.round(volume*100);$('volume').oninput=e=>{volume=Number(e.target.value)/100;if(master&&soundOn)master.gain.setTargetAtTime(volume,ctx.currentTime,.08);try{localStorage.setItem('velorne.quietVolume',String(volume))}catch{}};
function disposeSeal(){if(sealViewer){sealViewer.dispose();sealViewer=null}$('detail').classList.remove('seal-dialog')}
function showDialog(html,letter=false){cancelBeat();$('detail').classList.remove('beat-dialog','candle-dialog');disposeSeal();if(!$('detail').open)lastFocus=document.activeElement;$('detail').classList.toggle('letter-dialog',letter);$('detail-body').innerHTML=html;if(!$('detail').open)$('detail').showModal();$('close').focus()}
function closeDialog(){cancelBeat();disposeSeal();$('detail').close();if(lastFocus?.isConnected)lastFocus.focus();if(state.started&&['desk','room','door','gallery'].includes(state.scene))caption(sceneCopy(state.scene,state.scene,true))}
$('detail').addEventListener('close',()=>{if(!$('detail').open){cancelBeat();disposeSeal()}});$('detail').addEventListener('cancel',cancelBeat);$('close').onclick=closeDialog;$('detail').addEventListener('click',e=>{if(e.target===$('detail')){const r=$('detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog()}});
function record(id){markExplored(id==='windowMark'?'window-mark':id);if(!state.clues.includes(id)){state.clues.push(id);save();toast('已記入手記 · '+notes[id][0])}}
function note(id){sfx(id==='letter'?'envelope':'paper');record(id);rememberLine(notes[id][0],notes[id][1]);showDialog(`<p class="eyebrow">A TRACE LEFT BEHIND</p><h2>${notes[id][0]}</h2>${id==='letter'?clueImage('letter-v25','未封口的信封與英文回信'):''}<p>${notes[id][1]}</p><button class="primary" id="putback">收好手記</button>`);$('putback').onclick=closeDialog}
function go(id){if(!scenes[id])return;const from=state.scene,revisited=state.seen.includes(id);if(from!==id||!revisited)state.visits[id]=(state.visits[id]||0)+1;cancelBeat();sceneEpoch++;lockBusy=false;state.scene=id;state.started=true;$('entry-door').hidden=true;$('entry-door').classList.remove('opening');$('revisit').hidden=id==='exterior';$('stage').classList.toggle('indoors',id!=='exterior');$('world').style.filter='';$('world').style.animation='';$('world').style.transform='';$('world').style.transition='';resetLight();$('rain-glass').hidden=id!=='window';$('invitation').hidden=true;$('exploration').hidden=false;$('room-en').textContent=scenes[id].en;$('room-name').textContent=scenes[id].title;$('scene').src=sceneImage(id);$('scene').alt=scenes[id].title;$('scene').className='';void $('scene').offsetWidth;$('scene').className='arrive';$('hotspots').replaceChildren();for(const [action,label,x,y] of scenes[id].spots){const b=document.createElement('button');b.className='hotspot'+(state.clues.includes(action)?' done':'');b.style.left=x+'%';b.style.top=y+'%';b.setAttribute('aria-label',action==='stair-depth'&&state.candleRenewed?'抬高新燭，望向樓梯深處':label);if(['desk','letter','book','seal','candle','window-mark','watch-rain','window','lion','entry-console','entry-lock','lock','stairs','ending','stair-depth','northdoor','north-lock','north-plaque','light-shelf','glass-rain','garden-door'].includes(action)&&!explored(action)){b.classList.add('clue-glint');b.style.setProperty('--glint-delay',String(-((x+y)%4))+'s');}b.dataset.x=x;b.dataset.y=y;b.dataset.action=action;b.addEventListener('focus',()=>aimLight(x,y));const s=document.createElement('span');s.textContent=action==='stair-depth'&&state.candleRenewed?'抬高新燭，望向樓梯深處':label;b.append(s);b.onclick=e=>{if(action==='stair-depth'&&e.detail!==0&&stairDragged)return;act(action)};$('hotspots').append(b)}$('nav').classList.toggle('study-navigation',(['room','desk','window','northdoor','glasswalk'].includes(id)||(id==='hall'&&northReady())));$('nav').classList.toggle('branch-navigation',state.finished&&['door','gallery'].includes(id));$('nav').replaceChildren();for(const [action,label]of sceneNavigation(id)){const b=document.createElement('button');b.textContent=action==='ending'&&!state.finished?'看看聲音傳來的方向':label;b.onclick=()=>act(action);$('nav').append(b)}$('back').hidden=id==='exterior'||id==='hall'||(id==='foyer'&&!state.receptionDone);$('back').textContent=id==='stairwell'?'退回肖像長廊':id==='glasswalk'?'退回北側門':['desk','window','northdoor'].includes(id)?'退回書房':'返回前廳';$('doorlight').hidden=id!=='door';updatePuzzleLight();staggerGlints();caption(sceneCopy(id,from,revisited));if(!state.seen.includes(id))state.seen.push(id);if(id==='room'&&!['desk','window','northdoor'].includes(from))queueBeastCue();setupStairSurvey(id);save();ambient();syncMusic();arrivalContinuity(id)}
let opening=false,sealRemoved=false;
async function openInvitation(){
 if(opening)return;opening=true;const token=sceneEpoch;audioInit();syncMusic();$('open').disabled=true;$('envelope').disabled=true;
 const finish=()=>{opening=false;$('open').disabled=false;$('envelope').disabled=false};
 if(!sealRemoved){
  loadFoley();if(foleyLoads.wax)await Promise.race([foleyLoads.wax,new Promise(r=>setTimeout(r,1800))]);if(token!==sceneEpoch){finish();return;}sfx('wax');$('envelope').classList.add('unsealing');
  setTimeout(()=>{finish();if(token!==sceneEpoch){$('envelope').classList.remove('unsealing');return}sealRemoved=true;$('envelope').classList.add('unsealed');$('envelope').classList.remove('unsealing');$('open').innerHTML='掀開信封，取出邀請函';$('envelope').setAttribute('aria-label','封蠟已取下，打開信封');$('seal-caption').textContent='封蠟已取下 · 點擊開信';toast('封蠟從紙面鬆開。現在可以掀起信封蓋。')},reducedMotion()?50:1100);return;
 }
 sfx('envelope');$('envelope').classList.add('unfolding');
 setTimeout(()=>{finish();$('envelope').classList.remove('unfolding');if(token!==sceneEpoch)return;
 showDialog('<p class="eyebrow">VELORNE · PRIVATE RESIDENCE</p><h2>私人邀請</h2><p>邀請您今夜造訪私人宅邸。<br>部分收藏室將為您開放。<br><br>抵達後，請叩門三次，在前廳稍候。<br>若無人應答，請勿急於離開。</p><p class="signature">Sylas Velorne</p><button class="primary" id="accept">收好邀請函，前往宅邸</button>',true);
 $('accept').onclick=()=>{closeDialog();go('exterior');caption('你停在石階前。手中的邀請函，還留著摺痕。\n鐵門雖然敞開，宅邸的大門卻緊閉著。')};
 },reducedMotion()?80:2800);
}
function ending(){galleryChoices();}
function galleryChoices(){
 showDialog('<p class="eyebrow">BEYOND THE CANDLELIGHT</p><h2>回頭，沒有任何人</h2>'+'<div class="gallery-depth">'+photoView('assets/gallery.webp','燭光照不到的肖像長廊深處')+'</div>'+'<p>蠟燭已經快燒完了，融蠟積在托盤裡。<br>你屏住呼吸。剛才的衣料摩擦聲，已經停了。</p><button id="gallery-stairs" class="primary">樓梯上方……是不是有什麼？</button><button id="gallery-footsteps" class="primary">前廳好像傳來細微的腳步聲</button>');
 $('gallery-stairs').onclick=()=>{closeDialog();go('stairwell');};
 $('gallery-footsteps').onclick=()=>{
 showDialog('<p class="eyebrow">SOMEWHERE BEHIND YOU</p><h2>前廳的腳步聲</h2><p>一下……又一下。<br>很輕，像有人刻意放慢腳步。聲音從來時的方向傳來。</p><button id="hall-confirm" class="primary">回前廳看看</button><button id="branch-back" class="quiet">先留在原處聽</button>');distantSteps();$('branch-back').onclick=galleryChoices;$('hall-confirm').onclick=()=>{state.galleryChoice='hall';save();closeDialog();walk('hall')};};
}

function act(a){if(moving)return;if(a==='door'){state.corridorNoticed=true;save();}if(northAction(a))return;if((state.scene==='hall'||state.scene==='foyer')&&!state.receptionDone&&a!=='entry-lock'&&a!=='entry-console')return reception();if(cautiousLook(a))return;state.objectVisits[a]=(state.objectVisits[a]||0)+1;markExplored(a);lastInteraction=Date.now();if(['letter','book','lion','globe','painting','cabinet','seal'].includes(a)&&!state.inspected.includes(a)){state.inspected.push(a);save()}if(scenes[a])return requestVisit(a);switch(a){case'study-exit':closeDialog();walk('hall',true);break;case'entry-lock':inspectEntryLock();break;case'entry-console':surveyEntry();break;case'window-mark':inspectWindowMark();break;case'candle':inspectCandle();break;case'watch-rain':approachRain();break;case'seal':approachDrawer();break;case'enter':approachEntrance();break;case'stone-lion':arrivalLook('lion');break;case'lit-window':arrivalLook('window');break;case'invitation-check':arrivalLook('invitation');break;case'letter':inspectLetter();break;case'book':ledgerCover();break;case'lion':inspectLion();break;case'stair-depth':finishStairSurvey();break;case'painting':showDialog('<p class="eyebrow">THE PAINTING</p><h2>沒有銘牌的畫</h2><p>畫中人的輪廓藏在厚重筆觸裡。<br>畫框下方留著兩個小孔，像是曾經釘過一塊銘牌。</p>');break;case'cabinet':showDialog('<p class="eyebrow">THE COLLECTION</p><h2>玻璃後的收藏</h2><p>金屬器皿、雕像與小巧的容器排列得一絲不亂。<br>玻璃沒有積灰。這裡一直有人打理。</p>');break;case'globe':showDialog('<p class="eyebrow">THE ARMILLARY SPHERE</p><h2>靜止的星軌</h2><p>黃銅圓環彼此交錯。<br>你沒有碰它，先把目光移回桌上的紙張。</p>');break;case'stairs':caption('樓上沒有亮燈。\n邀請函說，先在前廳稍候。');break;case'lock':inspectDoor();break;case'ending':if(state.finished)galleryChoices();else showDialog('<h2>聲音消失的地方</h2><p>畫框之間沒有動靜。<br>你握緊燭台。也許書房裡還留著能找到主人的線索。</p><button id="gallery-return" class="primary">先回書房看看</button>'),$('gallery-return').onclick=()=>{closeDialog();walk('desk')};break}}
$('open').onclick=openInvitation;$('envelope').onclick=openInvitation;$('sound').onclick=setSound;$('hint').onclick=()=>{const on=$('app').classList.toggle('show-hints');$('hint').setAttribute('aria-pressed',on);if($('exploration').hidden)toast('進入宅邸後，提示會標出可查看的地方')};$('back').onclick=()=>walk(state.scene==='stairwell'?'gallery':state.scene==='glasswalk'?'northdoor':['desk','window','northdoor'].includes(state.scene)?'room':'hall');$('resume').onclick=()=>{go(state.scene);if((state.scene==='hall'||state.scene==='foyer')&&!state.receptionDone)reception()};$('home').onclick=e=>{e.preventDefault();closeDialog();$('entry-door').hidden=true;sceneEpoch++;walkToken++;moving=false;$('stage').classList.remove('walking');$('stage').removeAttribute('aria-busy');$('walk-veil').classList.remove('closed');$('walk-veil').style.transitionDuration='';$('world').style.filter='';$('world').style.animation='';$('world').style.transform='';$('world').style.transition='';clearTimeout(captionTimer);$('invitation').hidden=false;$('exploration').hidden=true;if(ambience){ambience.stop();ambience=null}save()};
$('journal').onclick=()=>{showDialog('<p class="eyebrow">NOTES OF A VISITOR</p><h2>來訪手記</h2>'+(state.clues.length?state.clues.map(id=>`<article class="journal-item"><h3>${notes[id][0]}</h3><p>${notes[id][1]}</p>${id==='windowMark'?clueImage('clue-window-v16','窗框刻痕'):id==='lightTrace'?clueImage('clue-desk-lit-v16','照亮後的書桌機關'):''}</article>`).join(''):'<p>還沒有記下什麼。<br>書桌上的信件與簿冊，或許值得看看。</p>')+'<p class="hint-note">進度只保存在目前的瀏覽器。</p><button class="reset" id="reset">重新開始來訪</button>');$('reset').onclick=askRestart};
$('scene').onload=()=>{if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(seeRainWindow));else seeRainWindow()};$('scene').onerror=()=>caption('這個場景未能載入。請重新整理頁面再試一次。');document.addEventListener('visibilitychange',()=>{if(ctx){if(document.hidden){ctx.suspend();stopMusic()}else {if(soundOn||musicOn)ctx.resume();syncMusic()}}});save();
// Scene images load on demand to reduce mobile memory and bandwidth.
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'read_visit_progress',description:'Read this browser’s VELORNE visit progress and currently available interactions.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({scene:state.scene,started:state.started,clues:state.clues,finished:state.finished,actions:state.started?scenes[state.scene].spots.map(s=>({action:s[0],label:s[1]})):[]})})).catch(()=>{})}catch{}}

function openSeal(){
 showDialog('<p class="eyebrow">OBJECT STUDY · 01</p><h2>黑金印章</h2><p class="object-intro">印章沉沉地落在掌心。你托穩它，慢慢轉動，看看底部藏著什麼。</p><div class="seal-stage"><canvas id="seal-canvas" tabindex="0" role="img" aria-label="可旋轉的黑金印章；拖曳或用方向鍵旋轉，也可使用下方按鈕翻看底部。"></canvas><span class="object-caption">EBONY & BRASS</span></div><div class="seal-controls"><button id="seal-flip">翻看底部</button><button id="seal-reset">轉回正面</button><button id="seal-plus" aria-label="放大印章">＋</button><button id="seal-minus" aria-label="縮小印章">−</button></div><p id="seal-status" class="object-status" role="status">拖曳旋轉 · 方向鍵也能查看</p><button class="quiet" id="seal-putback">放回抽屜</button>');
 $('detail').classList.add('seal-dialog');
 const discover=()=>{record('seal');$('seal-status').textContent='底部的八芒紋下，刻著很淺的「VII」。已記入手記。';noise(.2,.025,1200)};
 try{sealViewer=window.createSealViewer($('seal-canvas'),discover);$('seal-flip').onclick=()=>sealViewer?.flip();$('seal-reset').onclick=()=>sealViewer?.reset();$('seal-plus').onclick=()=>sealViewer?.zoom(-.4);$('seal-minus').onclick=()=>sealViewer?.zoom(.4)}catch{if(sealViewer)disposeSeal();$('seal-canvas').hidden=true;$('seal-status').textContent='此裝置無法顯示立體物件，可直接查看底部刻字。';$('seal-flip').textContent='查看底部刻字';$('seal-flip').onclick=discover;for(const id of ['seal-reset','seal-plus','seal-minus'])$(id).hidden=true}
 $('seal-putback').onclick=()=>storyBeats('還是放回去吧',[{text:'……這樣好像不太禮貌。\n你把印章轉回原來的方向，沿著軟布上的凹痕輕輕放下，又理好碰皺的一角。',action:'鬆開手，退開一點',wait:1300}],()=>{state.sealReturned=true;save();openDrawer();toast('印章已放回原處；發現的刻字留在手記裡。')});
}

// Walking uses the selected doorway as the vanishing point; no image regeneration.
function studyReady(){return state.finished||(state.keyOwned&&state.clues.includes('book')&&state.clues.includes('lion'));}
function guideToStudy(){
 const visited=state.seen.includes('room'),target=visited?'desk':'room';
 showDialog('<p class="eyebrow">BEFORE GOING FURTHER</p><h2>先在亮處找找人</h2><p>'+(visited?'你望向右側幽暗的通道，又停下腳步。書房裡還有沒看清的地方，也許主人只是剛離開。先把眼前的線索理一理，再往深處走吧。':'右側通道藏在暗處。前方的開口卻透著暖光，也許那裡有人。')+'</p><button id="guide-study" class="primary">'+(visited?'回亮著燈的地方看看':'循著暖光走近')+'</button><button id="guide-stay" class="quiet">先留在這裡</button>');$('guide-study').onclick=()=>{closeDialog();if(state.scene===target)caption('你讓燭光慢慢掠過桌面，留意剛才沒有看清的地方。');else walk(target)};$('guide-stay').onclick=closeDialog;
}
async function walk(target,direct=false){
 if(moving)return;
 if(['northdoor','glasswalk'].includes(target)&&!northReady()){archPause();return;}
 if(target==='glasswalk'&&!state.northUnlocked){inspectNorthLock();return;}
 if(['foyer','hall'].includes(state.scene)&&!state.receptionDone&&target!=='exterior'){reception();return;}
 if(['door','gallery','stairwell'].includes(target)&&!studyReady()){guideToStudy();return;}

 if(moving||!scenes[target]||target===state.scene)return;
 const token=++walkToken,from=state.scene;moving=true;sceneEpoch++;clearTimeout(captionTimer);$('stage').classList.add('walking');$('stage').setAttribute('aria-busy','true');
 const fallback={hall:[50,52],room:[44,49],desk:[62,61],door:[77,52],gallery:[45,50]};
 const spot=scenes[from].spots.find(s=>s[0]===target||(s[0]==='enter'&&target==='hall'));
 const point=spot?[spot[2],spot[3]]:(fallback[target]||[50,50]);const turning=(from==='stairwell'&&['gallery','door'].includes(target))||(from==='gallery'&&target==='door')||(from==='door'&&['gallery','stairwell'].includes(target));const retreat=(from==='window'&&target==='desk')||(from==='northdoor'&&target==='room')||(from==='glasswalk'&&target==='northdoor')||turning||((from==='desk'||from==='window')&&target==='room')||(target==='hall'&&from!=='exterior')||(from==='door'&&target==='desk');
 caption(travelCopy(from,target,turning,retreat));
 try{
  const next=new Image();next.src=sceneImage(target);const imageReady=next.decode?next.decode():Promise.resolve();imageReady.catch(()=>{});if(token!==walkToken)return;
  const duration=reducedMotion()?80:(direct?1800:turning?1800:4200)/pace;const world=$('world');world.style.transformOrigin=point[0]+'% '+point[1]+'%';world.style.transition=`transform ${duration}ms cubic-bezier(.45,.05,.3,1)`;
  world.style.transform=reducedMotion()||direct?'none':turning?'translateX(-5%) scale(1.08)':`scale(${retreat?.92:1.65})`;if(!reducedMotion()&&!retreat&&!direct)world.style.animation=`walk-approach ${duration}ms linear both`;caption(travelCopy(from,target,turning,retreat));if(!turning)footsteps(from);if(direct){$('walk-veil').style.transitionDuration=(reducedMotion()?0:1800/pace)+'ms';$('walk-veil').classList.add('closed');}
  await new Promise(r=>setTimeout(r,Math.max(40,duration-210)));if(token!==walkToken)return;$('walk-veil').classList.add('closed');
  await new Promise(r=>setTimeout(r,reducedMotion()?40:230));if(token!==walkToken)return;await imageReady;if(token!==walkToken)return;go(target);if(target==='glasswalk'){state.rainWindowSeen=true;save();ambient();}$('scene').classList.remove('arrive');world.style.transition='none';world.style.transform=reducedMotion()||direct?'none':turning?'translateX(5%) scale(1.08)':'scale(1.06)';world.style.transformOrigin='50% 55%';void world.offsetWidth;
  $('walk-veil').classList.remove('closed');world.style.transition=reducedMotion()?'none':`transform ${1000/pace}ms ease-out`;world.style.transform='scale(1)';
  await new Promise(r=>setTimeout(r,reducedMotion()?0:(direct?1800:1000)/pace));
 }catch{if(token===walkToken)caption('前方的畫面暫時未能載入。請再試一次。')}
 finally{if(token===walkToken){moving=false;$('stage').classList.remove('walking');$('stage').removeAttribute('aria-busy');$('walk-veil').classList.remove('closed');$('walk-veil').style.transitionDuration='';$('world').style.filter='';$('world').style.animation='';$('world').style.transform='';$('world').style.transition='';lastInteraction=Date.now();seeRainWindow()}}
}
function aimLight(x,y){
 if(moving||state.candleOut&&!state.candleRenewed)return;const stage=$('stage');stage.style.setProperty('--beam-x',x+'%');stage.style.setProperty('--beam-y',y+'%');stage.classList.add('beam-on');
 const rect=stage.getBoundingClientRect();for(const b of $('hotspots').children){const dx=(Number(b.dataset.x)-x)*rect.width/100,dy=(Number(b.dataset.y)-y)*rect.height/100;b.classList.toggle('near',Math.hypot(dx,dy)<Math.max(65,rect.width*.095))}
}
function resetLight(){$('stage').classList.remove('beam-on');for(const b of $('hotspots').children)b.classList.remove('near')}
function pointLight(e){if($('exploration').hidden||moving||$('detail').open)return;const r=$('stage').getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100));aimLight(x,y);noteStairSweep(x,y)}
$('stage').addEventListener('pointermove',pointLight);$('stage').addEventListener('pointerdown',pointLight);$('stage').addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')resetLight()});
// Rain is a visual discovery; elapsed time never turns it on.
function explorationTick(){}

function tryHandle(){
 if(!studyReady()){guideToStudy();return;}
 if(state.finished){revisitDoor();return;}
 if(state.corridorAsked&&!state.keyTried&&!state.finished){state.corridorHandleTried=true;save();
 storyBeats('門把沒有鬆開',[{text:'你小心壓下門把。鎖仍然扣著。\n你收回手，想起口袋裡那把暫借的鑰匙。',action:'看看手中的鑰匙',wait:1500}],()=>{showDialog('<h2>這把鑰匙，是開這扇門的嗎？</h2><p>你望了望門下的光，又低頭看著手裡的鑰匙。<br>試試看……應該沒關係吧？如果不合，就立刻收手。</p><button id="compare-key" class="primary">遲疑片刻，輕輕試試鑰匙</button><button id="compare-later" class="quiet">暫時收好</button>');$('compare-key').onclick=tryKey;$('compare-later').onclick=closeDialog;});return;}

 if(!state.corridorAsked){inspectDoor();return;}if(lockBusy)return;lockBusy=true;state.doorTried=true;save();
 const ready=state.finished||(state.clues.includes('lion')&&state.keyTried);
 storyBeats('門的另一側',[
 {text:'你小心壓下門把，只試了一點點力氣。\n門沒有打開。鎖住了。',action:'立刻鬆開手',wait:1300},
 {text:'……這樣是不是太失禮了？\n你收回手，低聲補了一句：「抱歉，我只是想找人幫忙。」',action:'退開半步，等候',wait:1800},
 {text:'就在你準備離開時，身後傳來衣料擦過地面的聲音。\n很近。你停住了呼吸。',action:'轉頭看向身後',wait:1300,sound:()=>{if(!state.galleryHeard){state.galleryHeard=true;save();quietFoley('cloth',.11,.55)}}}
 ],()=>{if(ready){state.finished=true;save()}lockBusy=false;closeDialog();turnToGallery()});
}
async function turnToGallery(){
 if(!studyReady()||(!state.keyTried&&!state.finished)){guideToStudy();return;}
 if(moving)return;
 await walk('gallery');
 if(state.scene==='gallery'&&!moving)caption('你回頭，卻沒有任何人。\n蠟燭已經快燒完了。衣料擦過地面的聲音，消失在黑暗裡。');
}

// The numbered return box is a small, replayable puzzle; collected items persist.
function openDrawer(){state.drawerOpened=true;save();
 showDialog('<p class="eyebrow">THE DESK DRAWER</p><h2>物歸原處</h2>'+'<div class="drawer-items"><img src="assets/drawer-open-v18.webp" alt="印章躺在左側軟布上，右側是歸鑰匣"><button id="drawer-seal-picture" aria-label="拿起軟布上的印章"><span class="sr-only">查看印章</span></button><button id="drawer-box-picture" aria-label="查看右側歸鑰匣"><span class="sr-only">查看小匣</span></button></div>'+'<p>抽屜拉開了一小段。黑色軟布的褶皺裡，躺著一枚黑金印章；內側嵌著一只狹長的歸鑰匣。<br>印章底緣露出一點刻紋。你忍不住想看清楚，卻又怕弄亂主人的東西。<br>黃銅邊緣刻著：依房號，循交班次序。</p><div class="puzzle-actions"><button class="primary" id="drawer-seal">小心拿起，只看一下</button><button class="primary" id="drawer-box">'+(state.compartmentOpen?'查看已開啟的歸鑰匣':'查看歸鑰匣')+'</button></div><p class="hint-note">印章、宅邸記事簿與歸鑰匣，似乎屬於同一套規矩。</p>');
 if(state.sealReturned)$('drawer-seal-picture').classList.add('read');if(state.compartmentOpen)$('drawer-box-picture').classList.add('read');
 $('drawer-seal-picture').onclick=$('drawer-seal').onclick=()=>storyBeats('只看一下就放回去',[{text:'你先朝門口看了一眼。\n沒有動靜。你用指尖托住印章，輕輕將它從軟布裡拿起。',action:'在掌心裡仔細看看',wait:1100}],openSeal);$('drawer-box-picture').onclick=$('drawer-box').onclick=openBox;
}
function openLedger(page='VII',turn=true){
 if(turn)sfx('book');
 record('book');
 const entries={V:['東側書庫','先歸鑰，再閉窗，最後熄燈。','借出的書留在桌邊，不必替主人收回。'],VI:['音樂室','先熄燈，再歸鑰，最後閉窗。','琴蓋合上即可。譜架上的那一頁不要翻動。'],VII:['西廊房間','先閉窗，再留燈，最後歸鑰。','花每日更換。主人晚歸時，燈也照常留著。']};
 showDialog('<p class="eyebrow">THE NIGHT LEDGER</p><h2>宅邸記事簿</h2>'+ledgerSurface(page)+'<p>編號旁寫著房間的名字。墨色深淺不一，有些是每日照料的事項，有些像主人臨時添上的話。</p><div class="puzzle-tabs" role="group" aria-label="選擇房號">'+Object.keys(entries).map(n=>'<button id="ledger-'+n+'" aria-pressed="'+(page===n)+'">'+n+'</button>').join('')+'</div><article class="ledger-page"><p class="eyebrow">ROOM '+page+'</p><h3>'+entries[page][0]+'</h3><p>'+entries[page][1]+'</p><p>'+entries[page][2]+'</p></article><p class="hint-note">頁角沾著一點蠟，幾個字被反覆描過。這本簿冊應該常在夜裡使用。</p><button id="ledger-done" class="primary">合上簿冊</button>');
 mountLedger(page);
 if(page==='VII')record('ledger');
 for(const n of Object.keys(entries))$('ledger-'+n).onclick=()=>{if(n!==page)turnLedger(page,n)};
 rememberLine('宅邸記事簿 · '+page,entries[page].join('\n'));$('ledger-done').onclick=()=>{sfx('book-close');closeDialog()};
}
function openBox(){
 if(state.compartmentOpen){
  showDialog('<p class="eyebrow">THE RETURN BOX</p><h2>留給找到路的人</h2>'+(state.keyOwned?'<p>絨布上留著一道淺痕。鑰匙已經在你身上；攤開的短箋仍留在匣子裡。</p>':'<div class="key-discovery"><img src="assets/key-note-v23.webp" alt="黑絨匣內的黃銅鑰匙與攤開的短箋"><button id="key-note-picture" aria-label="讀鑰匙旁的短箋"><span class="sr-only">讀短箋</span></button></div><p>一把細長的鑰匙，旁邊壓著一張攤開的短箋。<br>紙上寫著：「致找到路的訪客。」<br>你停住伸向鑰匙的手，先看看主人留下的話。</p>')+'<button class="primary" id="box-take">'+(state.keyOwned?'查看隨身物品':'讀鑰匙旁的短箋')+'</button><button class="quiet" id="box-back">退回抽屜</button>');
  const keyPeek=document.createElement('button');keyPeek.className='quiet';keyPeek.textContent='俯身查看黃銅鑰匙';keyPeek.onclick=()=>{showDialog('<h2>暫借的鑰匙</h2>'+clueImage('key-close-v27','黑絨布上的黃銅鑰匙特寫')+'<p>你沒有立刻拿起它。先讀一讀主人留下的短箋。</p><button id=key-peek-back class=primary>回到匣子旁</button>');$('key-peek-back').onclick=openBox;};if(!state.keyOwned)$('detail-body').append(keyPeek);$('box-take').onclick=state.keyOwned?openInventory:openGuestNote;if(!state.keyOwned)$('key-note-picture').onclick=openGuestNote;$('box-back').onclick=openDrawer;return;
 }
 let room='V',sequence=[],checking=false;
 showDialog('<p class="eyebrow">THE RETURN BOX</p><h2>主人的規矩</h2><p>先選房號，再依序按下三枚刻字片。<br>黃銅扣上的八芒紋，和抽屜裡的印章很像。</p><label class="room-select">房號 <select id="box-room"><option>V</option><option>VI</option><option>VII</option></select></label><div class="puzzle-actions" role="group" aria-label="依序按下刻字片"><button id="piece-window">窗</button><button id="piece-lamp">燈</button><button id="piece-key">鑰</button></div><p id="box-sequence" class="sequence-readout" aria-live="polite">尚未按下刻字片</p><p id="box-status" role="status">宅邸記事簿記著各房的交班次序。</p><div class="puzzle-actions"><button class="primary" id="box-submit">試著開啟</button><button id="box-clear">重排次序</button></div><button class="quiet" id="box-back">退回抽屜</button>');
 const pieces=[['window','窗'],['lamp','燈'],['key','鑰']];
 $('box-room').onchange=e=>{room=e.target.value};
 for(const [id,label]of pieces)$('piece-'+id).onclick=()=>{if(checking||sequence.includes(label))return;sequence.push(label);$('piece-'+id).disabled=true;$('box-sequence').textContent=sequence.join(' → ');sfx('button')};
 $('box-clear').onclick=()=>{if(checking)return;sequence=[];for(const[id]of pieces)$('piece-'+id).disabled=false;$('box-sequence').textContent='尚未按下刻字片';$('box-status').textContent='可以重新排列。'};
 $('box-submit').onclick=()=>{
  if(checking)return;
  if(sequence.length<3){$('box-status').textContent='還有刻字片沒有按下。';return}
  checking=true;for(const id of ['box-submit','box-clear','box-room'])$(id).disabled=true;
  $('box-status').textContent='你按住扣環。內側的齒輪，正一格一格咬合。';sfx('gear');
  beatAfter(()=>{
   if(room==='VII'&&sequence.join('')==='窗燈鑰'){
    playBoxReveal();
   }else{checking=false;for(const id of ['box-submit','box-clear','box-room'])$(id).disabled=false;$('box-status').textContent='齒輪退回了原處。扣環沒有鬆開。再核對房號與交班次序。';sfx('wood')}
  },1400);
 };

 $('box-back').onclick=openDrawer;
}
function readKeyNote(){
 state.keyNoteRead=true;save();
 showDialog('<p class="eyebrow">FOR THE GUEST WHO FOUND THE WAY</p><h2>鑰匙旁的短箋</h2>'+clueImage('guest-note-v27','留給訪客的英文短箋特寫','key-borrow','依短箋所說，暫借鑰匙')+'<blockquote class="guest-note">循窗、燈、鑰而至的訪客，請攜此鑰續行。<br><br>它不屬於收藏它的人，<br>而屬於尚未找到歸路的人。<br><br>待門開啟，再將它歸還。</blockquote><p>窗、燈、鑰……正是你剛才解開匣子的次序。<br>這張紙，似乎真的是留給找到這裡的人。<br>你還不知道怎麼出去。也許，可以暫時借用它。</p><button id="key-borrow" class="primary">照短箋所說，暫借鑰匙</button><button id="key-leave" class="quiet">先放著，退回抽屜</button>');
 $('key-leave').onclick=openDrawer;$('key-borrow').onclick=()=>storyBeats('暫借一條歸路',[{text:'你讓短箋留在原處，才拿起鑰匙。\n金屬比想像中沉，繫著的舊標牌貼在鑰匙背面，字跡藏在陰影裡。\n找到主人，再親手歸還吧。',action:'小心收進口袋',wait:1100,sound:()=>sfx('key')}],()=>{state.keyOwned=true;save();toast('暫借 · 細長的鑰匙');caption('鑰匙、短箋、特意留下的次序……是在玩什麼遊戲嗎？\n右側走廊那道光，也許能讓你找到人問清楚。');openInventory()});
}
function stairsPicture(id){return '<button id="'+id+'" class="stairs-picture" aria-label="往樓梯那邊看看"><img src="assets/stairs-dark-v23.webp" alt="只有近處台階被燭光照亮，樓梯上方消失在黑暗裡"><span class="sr-only">往樓梯那邊看看</span></button>'}
function openInventory(){
 showDialog('<p class="eyebrow">WHAT YOU CARRY</p><h2>隨身物品</h2>'+(state.candleHeld?'<p>'+(state.candleRenewed?'新燭火穩穩亮著。':state.candleOut?'燭台裡只剩冷卻的短蠟，燭芯已經熄了。':'從玄關暫借的手燭，正一點點變短。')+'</p>':'')+(state.keyOwned?heldKeyArt(state.keyTagRead)+'<p>依短箋所說暫借的鑰匙。找到主人後，記得歸還。</p><p>'+(state.keyTagRead?'標牌背面寫著「北側玻璃廊」。書房左側拱門裡，或許就是通往那裡的路。':'舊標牌垂在鑰匙背面。先去亮著燈的側廊找人問問。')+'</p>':'<p>口袋裡還沒有東西。</p>')+(state.keyOwned&&state.stairSurveyDone?'<button id="inventory-tag" class="primary">把鑰匙轉過來，仔細看看</button>':'')+(state.keyOwned&&state.scene==='door'?'<button id="inventory-use" class="primary">比對側廊門鎖</button>':'')+'<button id="inventory-close" class="quiet">收好物品</button>');
 if(state.keyOwned&&state.stairSurveyDone)$('inventory-tag').onclick=inspectKeyTag;
 if(state.keyOwned&&state.scene==='door')$('inventory-use').onclick=tryKey;$('inventory-close').onclick=closeDialog;
}
function inspectDoor(){
 if(!studyReady()){guideToStudy();return;}
 if(state.finished){revisitDoor();return;}
 if(!state.corridorAsked){
 showDialog('<p class="eyebrow">LIGHT UNDER THE DOOR</p><h2>裡面有人嗎？</h2>'+photoView('assets/door.webp','靠近側廊房門，先敲門詢問','corridor-knock','輕輕叩門')+'<p>門縫下透著暖光。你在門前停下，沒有碰門把。</p><button class="primary" id="corridor-knock">輕輕敲門，詢問裡面的人</button><button id="corridor-leave" class="quiet">先退開</button>');
 $('corridor-leave').onclick=closeDialog;$('corridor-knock').onclick=()=>storyBeats('向門後的人求助',[
 {text:'你屈起指節，輕叩門板。',action:'等敲門聲散去',wait:4100,sound:knockThree},
 {text:'「請問……有人在嗎？」',action:'再說明來意',wait:1700},
 {text:'「不好意思，入口的門好像鎖住了……我出不去。\n可以請您幫個忙嗎？」',action:'靜靜等候回答',wait:2100},
 {text:'門後沒有回答。那道暖光仍在。\n你遲疑著，低頭看向門把。',action:'靠近看看門把',wait:2400}
 ],()=>{state.corridorAsked=true;save();inspectDoor()});return;}
 showDialog('<p class="eyebrow">THE QUIET HANDLE</p><h2>試一下……應該沒關係吧？</h2>'+handlePicture('corridor-handle-v21','側廊門把：慢慢壓下，盡量不發出聲音')+'<p>剛才的敲門與詢問都沒有得到回應。<br>你伸出手，又停了一下。</p><div class="puzzle-actions"><button id="door-handle" class="primary">小心試一下門把</button>'+(state.keyOwned&&state.corridorHandleTried?'<button id="door-key" class="primary">再看看手中的鑰匙</button>':'')+'</div>');
 if(state.keyOwned&&state.corridorHandleTried)$('door-key').onclick=tryKey;$('door-handle').onclick=$('handle-picture').onclick=()=>playHandleMotion('careful',tryHandle);
}
function tryKey(){
 if(!studyReady()){guideToStudy();return;}if(!state.keyOwned||state.scene!=='door')return;if(!state.corridorAsked||!state.corridorHandleTried){inspectDoor();return;}
 storyBeats('比對門鎖',[
  {visual:()=>heldKeyArt(false),text:'你取出那把細長的鑰匙，將齒尖靠近鎖孔。',action:'輕輕試探',wait:550},
  {visual:()=>heldKeyArt(false),text:'金屬碰在一起，發出一聲細響。\n齒口太寬，進不去。你停了手。',action:'收回鑰匙',wait:850,sound:()=>sfx('key')},
  {text:'這把鑰匙不屬於眼前的鎖。\n你先把它收好。門後仍然沒有回應。',action:'收好鑰匙',wait:500,enter:()=>{state.keyTried=true;record('key');save()}}
 ],afterWrongKey);
}
$('inventory').onclick=openInventory;

// Each beat is reader-controlled; timers belong only to the current dialog.
function cancelBeat(){beatEpoch++;clearTimeout(beatTimer);beatTimer=null;lockBusy=false}
function beatAfter(fn,ms){const token=beatEpoch;clearTimeout(beatTimer);beatTimer=setTimeout(()=>{if(token===beatEpoch&&$('detail').open)fn()},reducedMotion()?0:ms)}
function storyBeats(title,beats,done){return runNarrative(title,beats,done)}

function knockThree(){
 const epoch=beatEpoch;
 [0,1450,3100].forEach((ms,i)=>setTimeout(()=>{if(epoch!==beatEpoch||!$('detail').open)return;sfx('knock');const copy=$('beat-copy');if(copy)copy.textContent=['你屈起指節，輕叩了一下。','第二下。門後仍然安靜。','你遲疑了一瞬，才叩下第三聲。'][i]},ms/pace));
}
function reception(){
 if(state.receptionDone)return;
 if(state.scene!=='foyer')go('foyer');
 if(state.entryChecked){if(state.candleHeld)finishArrival();else surveyEntry();return;}if(state.candleHeld){inspectEntryLock();return;}
 storyBeats('門在身後關上了',[
 {text:'沉重的關門聲讓你肩膀一縮。\n你立刻回過頭。剛才敞開的門，此刻已嚴絲合縫。',action:'走近門把，看清楚一點',wait:1500}
 ],inspectEntryLock);
}
function handlePicture(file,alt){return '<button id="handle-picture" class="handle-picture" style="--cue-x:'+(file.startsWith('entry')?'30%':'42%')+'" aria-label="'+alt+'"><img src="assets/'+file+'.webp" alt="'+alt+'"><canvas id="handle-canvas" aria-hidden="true"></canvas><span>點門把，或使用下方按鈕</span></button>'}
async function playHandleMotion(mode,done){
 const picture=$('handle-picture');if(picture.disabled)return;picture.disabled=true;const epoch=beatEpoch,scene=sceneEpoch;
 const active=()=>picture.isConnected&&$('detail').open&&epoch===beatEpoch&&scene===sceneEpoch;
 for(const id of ['entry-try','door-handle','door-key']){const b=$(id);if(b)b.disabled=true;}
 sfx('handle');if(mode==='urgent')setTimeout(()=>{if(active())sfx('handle')},430);
 const src='assets/'+(mode==='urgent'?'entry-handle-v21':'corridor-handle-v21')+'.webp';
 const ok=typeof animateDoorHandle==='function'?await animateDoorHandle($('handle-canvas'),src,mode,active):await new Promise(r=>setTimeout(()=>r(active()),mode==='urgent'?1050:1950));
 if(ok&&active())done();
}
function inspectEntryLock(){
 if(state.scene!=='foyer')go('foyer');
 showDialog('<p class="eyebrow">THE CLOSED ENTRANCE</p><h2>怎麼關起來了……？</h2>'+handlePicture('entry-handle-v21','入口大門的黃銅門把：急促地試轉')+'<p>你摸向微涼的黃銅門把，又低頭找了找門鎖。<br>門邊沒有你熟悉的開門按鈕。</p><button id="entry-try" class="primary">急著試轉門把</button>');
 const afterHandle=()=>storyBeats('先確認退路',[
 {text:'你急急地左右扭了幾下門把。\n每次都只動了一點便卡住。門還是打不開。',action:'鬆手，看看門框四周',wait:1500},
 {text:'……該不會是自動門，或者有什麼感應裝置吧？\n剛才也是自己打開的。你找不到開關，心裡不免有些發緊。',action:'回過頭，試著叫人',wait:1600},
 {text:'「……您好？我是收到邀請來的。」\n你仍站在門邊，將邀請函攥在掌心。',action:'再問一句',wait:1700},
 {text:'「請問……有人在家嗎？」\n你的聲音在高挑的前廳裡散開。',action:'等候回答',wait:1900},
 {text:'沒有回答。\n先找主人問問怎麼開門好了。你吸了口氣，慢慢轉過身。',action:'藉著月光，環顧四周',wait:2200}
 ],()=>{state.entryChecked=true;save();if(state.candleHeld)finishArrival();else surveyEntry()});$('entry-try').onclick=$('handle-picture').onclick=()=>playHandleMotion('urgent',afterHandle);
}
function surveyEntry(){
 if(state.candleHeld){if(state.entryChecked)finishArrival();else inspectEntryLock();return;}
 showDialog('<p class="eyebrow">A LITTLE BORROWED LIGHT</p><h2>門邊的一點暖光</h2>'+clueImage('entry-closed-v18','玄關大門旁，月光映出雕花矮桌與一盞燭火','entry-candle-look','靠近燭台')+'<p>月光勾出門邊矮桌的輪廓。黑色石面下，是纏著葉紋的雕花桌腳。<br>桌上擱著一盞小燭台。那點火光，剛才幾乎被門柱擋住了。<br>有了它，至少能看清腳下。</p><button id="entry-candle-look" class="primary">靠近，看看那盞燭台</button>');
 $('entry-candle-look').onclick=()=>{
 showDialog('<p class="eyebrow">THE CANDLE BY THE DOOR</p><h2>先借一點光</h2>'+clueImage('entry-candle-v18','玄關矮桌上的手持黃銅燭台，蠟燭安靜燃燒','take-entry-candle','小心拿起燭台')+'<p>燭台有一道方便握住的提環，底下的黃銅托盤映著一圈暖光。<br>你猶豫了一下，小聲說：「借一下……找到人就還回來。」</p><button id="take-entry-candle" class="primary">握住提環，小心拿起燭台</button>');
 $('take-entry-candle').onclick=()=>{if(state.candleHeld)return;state.candleHeld=true;save();if(!state.entryChecked){storyBeats('先借一點光',[{text:'這裡太暗了。你先借起燭台，照向剛剛合上的門。\n還是先確認一下，待會兒該怎麼出去。',action:'提著燭台，查看門把',wait:1400}],inspectEntryLock);return;}finishArrival()};};
}
function finishArrival(){
 if(!state.entryChecked){inspectEntryLock();return;}if(!state.candleHeld){surveyEntry();return;}state.receptionDone=true;save();storyBeats('沿著微光找人',[
 {text:'黃銅的重量落進掌心。你把燭台端穩，火焰輕輕晃了一下。\n邀請函仍留在另一隻手裡——至少能向主人說明來意。',action:'抬起燭光，看向前廳',wait:1500}
 ],()=>{closeDialog();go('hall');caption('你提著借來的燭台，站在前廳入口。\n前方只有一處透著暖光。先循著亮光，去找找主人吧。')});
}
function cautiousLook(a){
 const lines={
 letter:['信封上的紋章','淺色信封沒有封口，紙角露在外面。上面的八芒紋，和你手中的邀請函一樣。\n紙角那句話提到了房間，封口也沒有黏上。會是接待的指引嗎？\n你先輕聲說了句「不好意思」，只打算確認收件人；如果是私信，就立刻放回。','小心抽出信紙'],
 book:['露出的編號籤','皮革封面旁露出幾枚編號籤，紙角映著燭光。\n封面寫著 NIGHT LEDGER。值夜紀錄……也許能找到今晚接待人的名字。\n門打不開、呼喊又沒有回應。你只想查清楚該向誰求助。','輕輕翻開封面'],
 seal:['抽屜縫裡的光','燭光掠過書桌正面，八芒紋中央有一處顏色稍淺。\n你俯身看看，沒有急著拉動它。','查看紋章邊緣'],
 lion:['壓住的紙角','獅像底座露出一截字跡。\n紙角朝向桌外，像是刻意留給人查看的提醒。你側過頭，試著不搬動雕像就讀清楚。','查看露出的便箋']};
 state.cautious=Array.isArray(state.cautious)?state.cautious:[];
 if(!lines[a]||state.cautious.includes(a)||state.clues.includes(a))return false;
 const [title,copy,label]=lines[a];
 showDialog('<p class="eyebrow">A SECOND LOOK</p><h2>'+title+'</h2>'+(['letter','book','lion'].includes(a)?clueImage(a==='letter'?'letter-v25':a==='book'?'ledger-cover-v25':'lion-base-v27',title,'careful-touch',label):'')+'<p>'+copy.replaceAll('\n','<br>')+'</p><button class="primary" id="careful-touch">'+label+'</button><button class="quiet" id="leave-object">先不碰，退開一步</button>');
 $('careful-touch').onclick=()=>{state.cautious.push(a);save();if(a==='book'){markExplored(a);openBookMotion();}else act(a)};
 $('leave-object').onclick=closeDialog;return true;
}


function updatePuzzleLight(){
 $('stage').classList.toggle('raking-light',state.scene==='desk'&&state.candlePosition===-3);
}
function photoView(src,alt,action='',label=''){
 const tag=action?'button':'div',attrs=action?' type="button" data-photo-action="'+action+'" aria-label="'+label+'"':'';
 return '<div class="photo-object"><'+tag+' class="clue-photo'+(action?' photo-action':'')+'"'+attrs+'><img src="'+src+'" alt="'+alt+'">'+(action?'<span class="photo-action-label">'+label+'</span>':'')+'</'+tag+'><button class="photo-enlarge" data-photo-source="'+src+'" data-photo-alt="'+alt+'" data-photo-action-target="'+action+'" aria-label="放大查看：'+alt+'">放大查看</button></div>';
}
function rainDrops(){return '<span class="close-rain" aria-hidden="true">'+[14,22,31,69,77,86].map((x,i)=>'<i style="left:'+x+'%;top:'+(12+i%3*10)+'%;--drop-time:'+(8+i)+'s;--drop-delay:-'+(i*2)+'s"></i>').join('')+'</span>'}
function rainPhoto(file,alt){return '<div class="rain-photo">'+clueImage(file,alt,state.clues.includes('windowMark')?'mark-next':'read-mark',state.clues.includes('windowMark')?'回書房看看':'辨認窗框刻痕')+rainDrops()+'</div>'}
async function approachRain(){
 if(moving)return;const rainAgain=state.rainLooks>0;state.rainLooks++;save();moving=true;const token=++walkToken,world=$('world');$('stage').classList.add('walking');world.style.transformOrigin='57% 42%';world.style.transition=reducedMotion()?'none':'transform 2400ms ease-in-out';world.style.transform='scale(1.6)';caption('你又靠近玻璃一些。\n一顆水珠聚起來，沿著窗面慢慢滑下。');sfx('step-stone',-.08);
 await new Promise(r=>setTimeout(r,reducedMotion()?0:2400));if(token!==walkToken)return;moving=false;$('stage').classList.remove('walking');
 showDialog('<p class="eyebrow">RAIN AGAINST THE GLASS</p><h2>'+(rainAgain?'雨比剛才密了一些':'……什麼時候開始下雨的？')+'</h2><div class="rain-photo rain-close">'+photoView('assets/window.webp','近看窗上的水珠緩緩滑落','rain-mark','查看窗框刻痕')+rainDrops()+'</div><p>'+(rainAgain?'細密的水痕接連滑下，窗外更模糊了。<br>你望向庭院，仍沒有看見前來應門的人。':'剛才站在門外，明明還沒有下雨。<br>你看著水珠相遇、滑下，手中的燭火映在玻璃上。')+'</p><button id="rain-mark" class="primary">看看左下方窗框上的刻痕</button><button id="rain-back" class="quiet">退開一點，繼續看窗邊</button>');
 $('rain-mark').onclick=inspectWindowMark;$('rain-back').onclick=()=>{closeDialog();world.style.transition=reducedMotion()?'none':'transform 1400ms ease-out';world.style.transform='scale(1)'};
}
function clueImage(file,alt,action='',label=''){return photoView('assets/'+file+'.webp',alt,action,label)}
let imageReturnFocus=null,imageZoom=1,imageAction=null;
function useImageAction(){const action=imageAction;if(!action||action.epoch!==beatEpoch||!$('detail').open)return;const button=$(action.id);if(!button||button.disabled)return;$('image-viewer').close();imageAction=null;button.click();}
function setImageZoom(value){imageZoom=Math.max(1,Math.min(3,value));$('image-full').style.width='100%';$('image-surface').style.width=imageZoom===1?'100%':String(imageZoom*100)+'%';$('image-full').style.maxHeight=imageZoom===1?'calc(90svh - 100px)':'none';$('image-zoom-label').textContent=Math.round(imageZoom*100)+'%';$('image-less').disabled=imageZoom===1;$('image-more').disabled=imageZoom===3;}
function openImageViewer(img,origin){imageReturnFocus=origin;const action=origin?.dataset?.photoActionTarget;imageAction=action?{id:action,epoch:beatEpoch}:null;$('image-action').hidden=!action;$('image-action').textContent=action?($(action)?.textContent||'繼續探索'):'';$('image-full').style.cursor=action?'pointer':'default';$('image-full').src=img.src;$('image-viewer').classList.toggle('rain-image',/window/.test(img.src));$('image-viewer').classList.toggle('dark-depth-image',/gallery|stairs-dark/.test(img.src));$('image-full').alt=img.alt;$('image-title').textContent=img.alt;setImageZoom(1);$('image-viewer').showModal();$('image-scroll').scrollTop=0;$('image-scroll').scrollLeft=0;$('image-close').focus();}
document.addEventListener('click',e=>{const enlarge=e.target.closest?.('.photo-enlarge');if(enlarge){openImageViewer({src:enlarge.dataset.photoSource,alt:enlarge.dataset.photoAlt},enlarge);return;}const action=e.target.closest?.('[data-photo-action]');if(action){const button=$(action.dataset.photoAction);if(button&&!button.disabled)button.click();}});
$('image-action').onclick=useImageAction;$('image-full').onclick=useImageAction;
$('image-close').onclick=()=>$('image-viewer').close();$('image-more').onclick=()=>setImageZoom(imageZoom+.5);$('image-less').onclick=()=>setImageZoom(imageZoom-.5);$('image-fit').onclick=()=>setImageZoom(1);
$('image-viewer').addEventListener('close',()=>{if(imageReturnFocus?.isConnected)imageReturnFocus.focus()});

function inspectWindowMark(){
 const known=state.clues.includes('windowMark');
 showDialog('<p class="eyebrow">AT THE WINDOW</p><h2>藏在窗框內側</h2>'+rainPhoto('clue-window-v16','雨窗木框上刻著三道短線和月牙')+'<p>'+(known?'你再次側身看向刻痕。三道短線旁，是一彎月牙。':'窗沒有打開。你只是側過身，讓玻璃透進的微光掠過窗框。<br>一道像是刮痕的線，還有兩道更淺的……')+'</p>'+(known?'<p class="etched-mark" aria-label="三道刻線與月牙">Ⅲ　☾</p><p>「借夜色三分，照見未言之處。」</p><p>刻痕已經記下了。去其他地方看看吧。<br>'+windowLead()+'</p><button id="mark-next" class="primary">離開窗邊，回書房看看</button>':'')+'<button class="primary" id="read-mark">'+(known?'回看手記中的刻痕':'靠近，辨認刻痕')+'</button><button class="quiet" id="leave-mark">退回窗邊</button>');
 $('read-mark').onclick=()=>{if(!known){record('windowMark');inspectWindowMark()}else note('windowMark')};$('leave-mark').onclick=()=>{closeDialog();if(known)caption('刻痕已經記下了。去其他地方看看吧。\n'+windowLead()+'')};if(known)$('mark-next').onclick=()=>{closeDialog();walk('room')};
}
function inspectCandle(){
 if(!state.candleExamined){
 showDialog('<p class="eyebrow">BRASS IN CANDLELIGHT</p><h2>華麗的燭台</h2>'+clueImage('clue-candle-v16','燭光映著黃銅葉紋')+'<p>黃銅葉紋沿著燭身攀起，常被觸碰的地方磨得更亮。<br>底部有一道細縫。是接合處，還是另有用途？</p><button id="candle-examine" class="primary">俯身看看底部</button><button id="candle-first-leave" class="quiet">先不碰，退回書桌</button>');
 $('candle-examine').onclick=()=>{state.candleExamined=true;save();inspectCandle()};$('candle-first-leave').onclick=closeDialog;return;
 }
 showDialog('<p class="eyebrow">LIGHT AND SHADOW</p><h2>燭台下的活動底座</h2><section class="candle-workbench" aria-label="轉動燭台"><div class="candle-motion"><img src="assets/clue-candle-v16.webp" alt="黃銅燭台的活動上座與固定刻度"><canvas id="candle-turning" aria-hidden="true"></canvas></div><div class="puzzle-actions candle-controls"><button id="candle-left">朝窗轉一格</button><button id="candle-center">回到中央</button><button id="candle-right">朝門轉一格</button></div><p id="candle-status" role="status"></p></section><p id="candle-discovery" class="candle-discovery" hidden>光停住了。書桌紋章中央浮出一點凹痕。你可以先鬆開燭台，再俯身查看。</p><button id="candle-inspect" class="primary" hidden>俯身查看被照亮的紋章</button><div id="candle-result" class="light-preview" hidden aria-label="轉對後，斜光照出書桌上的機關"><img src="assets/clue-desk-dark-v16.webp" alt="暗處的書桌紋章"><img id="study-light" src="assets/clue-desk-lit-v16.webp" alt="側光照出紋章中央凹痕與細縫"></div><p class="candle-instructions">底座周圍有幾道細刻線，邊緣磨得光滑。你輕扶黃銅上座，它竟能轉動；斜光也跟著掠過桌面的紋章。也許，只是還沒照對角度。</p><button id="candle-note" class="primary">回想已看過的線索</button><button id="candle-leave" class="primary">放開底座，退回書桌</button>');
 $('detail').classList.add('candle-dialog');$('detail').scrollTop=0;
 let turning=false;const panel=$('candle-turning');
 const motion=typeof createCandleMotion==='function'?createCandleMotion($('candle-turning'),state.candlePosition):null;
 const update=()=>{const pos=state.candlePosition,found=pos===-3;
 $('candle-status').textContent=turning?'你扶住黃銅邊緣，慢慢轉動……':pos===0?'刻度停在中央。':(pos<0?'朝窗':'朝門')+' · '+Math.abs(pos)+' 格';
 $('candle-left').disabled=turning||pos===-3;$('candle-right').disabled=turning||pos===3;$('candle-center').disabled=turning;
 $('candle-result').hidden=!found||turning;$('candle-result').classList.toggle('revealing',found&&!turning);$('study-light').style.opacity=found&&!turning?'1':'0';
 $('candle-discovery').hidden=!found||turning;$('candle-inspect').hidden=!found||turning;
 $('candle-inspect').textContent=state.drawerReleased?'查看已經鬆開的抽屜':'俯身查看被照亮的紋章';
 updatePuzzleLight();};
 const turn=async pos=>{if(turning||pos===state.candlePosition)return;turning=true;update();sfx('handle');
 if(motion)await motion.turnTo(pos);
 if(!panel.isConnected||!$('detail').open)return;
 state.candlePosition=pos;turning=false;
 if(pos===-3&&!state.lightRevealed){state.lightRevealed=true;record('lightTrace');}save();
 if(!panel.isConnected||!$('detail').open)return;
 update();if(pos===-3)$('candle-status').textContent='底座停入第三格。光掠過木頭，紋章中央浮出一點凹痕。';};
 $('candle-left').onclick=()=>turn(Math.max(-3,state.candlePosition-1));$('candle-right').onclick=()=>turn(Math.min(3,state.candlePosition+1));$('candle-center').onclick=()=>turn(0);
 $('candle-inspect').onclick=()=>{if(!turning&&state.candlePosition===-3)approachDrawer()};
 $('candle-note').onclick=()=>{if(state.clues.includes('windowMark')){$('candle-status').textContent='你記得窗框上的刻痕：Ⅲ　☾。下緣寫著「借夜色三分」。'}else $('candle-status').textContent='暫時想不起能對上的線索。先看看房間裡其他地方吧。'};
 $('candle-leave').onclick=()=>{closeDialog();caption(state.candlePosition===-3?'燭光斜斜落在八芒紋中央。\n那一點凹痕，現在看得很清楚。':'光線重新落回桌面。\n你鬆開手，讓燭台停在原處。')};update();
}
function inspectDeskSeam(){
 if(state.candlePosition!==-3){showDialog('<p class="eyebrow">A HIDDEN SEAM</p><h2>沒有把手的抽屜</h2>'+clueImage('clue-desk-dark-v16','陰影裡的八芒紋與木桌正面','seam-light','看看旁邊的燭台')+'<p>八芒紋嵌在木頭裡，摸不出可以施力的位置。<br>你沒有硬拉。旁邊的燭台映著微光，底部留著一道很細的接縫。</p><button id="seam-light" class="primary">看看燭台底座</button><button id="seam-leave" class="quiet">先鬆開手</button>');$('seam-light').onclick=inspectCandle;$('seam-leave').onclick=closeDialog;return;}
 showDialog('<p class="eyebrow">WHERE THE LIGHT FALLS</p><h2>紋章中央的凹痕</h2>'+'<div id="drawer-mechanism" class="drawer-mechanism"><img class="drawer-front" src="assets/clue-desk-lit-v16.webp" alt="八芒紋中央可以輕按"><img class="drawer-plunger" src="assets/clue-desk-lit-v16.webp" alt="" aria-hidden="true"><img class="drawer-reveal" src="assets/drawer-open-v18.webp" alt="鬆開的抽屜裡，印章躺在軟布上"><button id="press-emblem" aria-label="輕按紋章中央的凹痕"></button></div><p id="press-status" role="status">中央的金屬圓片似乎能按下去。</p>'+'<p>側光把一道細細的接縫照了出來。<br>你沿著邊緣移動指尖，碰到中央略微下陷的位置。</p><button class="primary" id="release-drawer">輕輕按下凹痕</button><button class="quiet" id="seam-leave">暫時不碰</button>');
 $('seam-leave').onclick=closeDialog;const press=()=>{const button=$('release-drawer');if(button.disabled)return;button.disabled=true;$('press-emblem').disabled=true;const panel=$('drawer-mechanism'),epoch=beatEpoch;panel.classList.add('pressing');$('press-status').textContent='圓片緩緩陷下去……裡面的扣榫鬆開了。';sfx('handle');setTimeout(()=>{if(!panel.isConnected||!$('detail').open||epoch!==beatEpoch)return;panel.classList.add('released');$('press-status').textContent='一道暗縫張開，抽屜只鬆開了一道暗縫。';sfx('wood')},reducedMotion()?0:700);setTimeout(()=>{if(!panel.isConnected||!$('detail').open||epoch!==beatEpoch)return;state.drawerReleased=true;save();storyBeats('書桌鬆開了一道縫',[{text:'抽屜向外移了一點。\n裡面有一點金屬反光，看不清是什麼。\n也許能找到打開入口的方法？',action:'小心查看抽屜',wait:1000}],()=>{showDrawerPull();$('drawer-pull').click()})},reducedMotion()?0:2100)};$('release-drawer').onclick=press;$('press-emblem').onclick=press;
}

function approachDrawer(){if(!state.drawerReleased){inspectDeskSeam();return;}if(state.drawerOpened){openDrawer();return;}showDrawerPull();}
function showDrawerPull(){
 showDialog('<p class="eyebrow">THE UNLATCHED DRAWER</p><h2>抽屜已經鬆開了</h2><button id="drawer-pull-picture" class="drawer-pull-picture" aria-label="慢慢拉開抽屜"><img class="pull-front" src="assets/clue-desk-lit-v16.webp" alt="點抽屜的正面，慢慢拉開"><img class="pull-inside" src="assets/drawer-open-v18.webp" alt="抽屜裡的黑金印章與歸鑰匣"><span>點抽屜，慢慢拉開</span></button><p id="drawer-pull-status" role="status">接縫已鬆開。你可以用指尖輕輕拉住邊緣。</p><button id="drawer-pull" class="primary">慢慢拉開抽屜</button>');
 const pull=()=>{const picture=$('drawer-pull-picture');if(picture.disabled)return;picture.disabled=true;$('drawer-pull').disabled=true;const epoch=beatEpoch;picture.classList.add('pulling');$('drawer-pull-status').textContent='木軌低低擦過。黑色軟布從縫隙裡慢慢露出來。';sfx('wood');setTimeout(()=>{if(picture.isConnected&&$('detail').open&&epoch===beatEpoch)openDrawer()},reducedMotion()?0:1800)};
 $('drawer-pull-picture').onclick=$('drawer-pull').onclick=pull;
}
function ledgerCover(){
 showDialog('<p class="eyebrow">THE NIGHT LEDGER</p><h2>'+(state.clues.includes('book')?'剛才翻過的宅邸記事簿':'皮革封面的簿冊')+'</h2>'+clueImage('ledger-cover-v25','NIGHT LEDGER，編號籤 V、VI、VII','ledger-open','輕輕翻開簿冊')+'<p>書脊被翻得柔軟。側邊露出三枚編號籤：V、VI、VII。<br>'+(state.clues.includes('book')?'剛才的交班次序仍在這裡。可以再核對一次，不必重新找起。':'這像是宅邸的工作紀錄。也許能找到接待人，或門鎖的使用方法。')+'</p><button class="primary" id="ledger-open">翻開簿冊</button>');
 $('ledger-open').onclick=openBookMotion;
}

function arrivalLook(id){
 const lines={lion:['石階旁的守衛','石獅的背上落著灰，前爪卻磨得光滑。\n你走近時，自己的影子越過它的眼睛。'],window:['樓上的燈','高窗裡有一盞燈。\n你抬頭看了一會兒，沒有看見人影。\n風停了，窗簾卻像是動了一下。'],invitation:['帶給你的邀請','信上的八芒紋，與大門中央的紋章相同。\n「請叩門三次。若無人應答，請勿急於離開。」\n你確定自己沒有走錯地方。']};
 if(!state.arrivalSeen.includes(id)){state.arrivalSeen.push(id);save()}
 storyBeats(lines[id][0],[{text:lines[id][1],action:'望向大門',wait:400,sound:id==='invitation'?()=>sfx('paper'):undefined}],closeDialog);
}
function approachEntrance(){
 if(state.entryUnlocked){entranceReady();return}
 storyBeats('邀請函上的規矩',[
  {text:'你走到石階上。\n大門緊閉，門上的八芒紋與信封上的封印一致。',action:'照信上所寫，叩門三次',wait:500},
  {text:'三聲叩響消失在門後。\n你把邀請函握在手裡，等著。',action:'再等一會兒',wait:4100,sound:knockThree},
  {text:'沒有人問你的名字。\n門的另一側，卻傳來鎖舌慢慢退開的聲音。',action:'注視門縫',wait:900,sound:()=>sfx('handle'),enter:()=>{state.entryUnlocked=true;save()}}
 ],entranceReady);
}
function entranceReady(){
 showDialog('<p class="eyebrow">AT THE THRESHOLD</p><h2>門已經解鎖。</h2><p>你還沒有伸手。<br>門縫裡的暖光，卻自己變寬了一點。<br>風停了，兩扇沉重的門仍在向內移動。</p><button class="primary" id="push-entry">站在原處，看著門打開</button><button class="quiet" id="stay-outside">先留在門前</button>');$('push-entry').onclick=enterHouse;$('stay-outside').onclick=closeDialog;
}
async function enterHouse(){
 if(moving)return;closeDialog();const token=++walkToken;moving=true;sceneEpoch++;const world=$('world');$('stage').classList.add('walking');$('stage').setAttribute('aria-busy','true');$('entry-door').hidden=false;
 try{
  const next=new Image();next.src='assets/hall.webp';if(next.decode)await next.decode();if(token!==walkToken)return;
  $('entry-door').style.setProperty('--door-depth',Math.max(18,$('stage').getBoundingClientRect().width*.058*.72)+'px');world.style.transformOrigin='62.8% 68%';world.style.transition=reducedMotion()?'none':'transform 4800ms ease-in-out';world.style.transform=reducedMotion()?'none':'scale(2.8)';caption('你沒有碰門。\n兩扇門卻向內慢慢退開，門後看不見人。');sfx('creak');
  void $('entry-door').offsetWidth;$('entry-door').classList.add('opening');
  await new Promise(r=>setTimeout(r,reducedMotion()?80:5400));if(token!==walkToken)return;
  $('walk-veil').classList.add('closed');await new Promise(r=>setTimeout(r,reducedMotion()?30:300));if(token!==walkToken)return;
  go('hall');$('walk-veil').classList.remove('closed');sfx('step-stone',-.12);caption('你跨過門檻。\n替你開門的人，並不在門後。');
  await new Promise(r=>setTimeout(r,3400));if(token!==walkToken)return;loadFoley();if(foleyLoads['door-close'])await Promise.race([foleyLoads['door-close'],new Promise(r=>setTimeout(r,1800))]);if(token!==walkToken)return;sfx('door-close');go('foyer');caption('你停住腳步。\n身後的厚門緩緩合攏，門舌落進鎖孔。');await new Promise(r=>setTimeout(r,4300));if(token!==walkToken)return;reception();
 }catch{if(token===walkToken)caption('門後的畫面暫時未能載入。請再查看大門。')}
 finally{if(token===walkToken){moving=false;$('stage').classList.remove('walking');$('stage').removeAttribute('aria-busy');$('entry-door').hidden=true;$('entry-door').classList.remove('opening');$('walk-veil').classList.remove('closed');world.style.transform='';world.style.transition='';lastInteraction=Date.now();seeRainWindow()}}
}
$('revisit').onclick=()=>{if(moving)return;state.receptionDone=false;state.entryChecked=false;state.candleHeld=false;save();closeDialog();go('exterior')};

// Material-specific synthesized Foley, with varying attacks and resonances.
const recordedFoley = {}, foleyLoads = {};
let marbleStep = 0;
const foleyFiles = {creak:'heavy-door',paper:'paper',envelope:'envelope',book:'book','book-open':'book-open','book-close':'book-close',handle:'handle',knock:'knock-soft','door-close':'door-close-full',wax:'wax-peel',rain:'rain-window',cloth:'cloth-drag-v38','glass-outside':'glass-outside-v37','glass-reply':'knock-soft',thunder:'thunder-reserve-v22',beast:'tiger-distant-v41','metal-touch':'metal-touch-v42','key-insert':'key-insert-v40', ...Object.fromEntries(Array.from({length:5},(_,i)=>['marble-'+i,'marble-'+i]))};
const foleyBytes=Object.fromEntries(Object.entries(foleyFiles).map(([key,file])=>[key,fetch('assets/audio/'+file+'.mp3').then(r=>{if(!r.ok)throw Error('Audio unavailable');return r.arrayBuffer()}).catch(()=>null)]));
function loadFoley(){
 if(!ctx)return;
 for(const [key,file]of Object.entries(foleyFiles)){
  if(foleyLoads[key])continue;
  foleyLoads[key]=foleyBytes[key].then(b=>{if(!b)throw Error('Audio unavailable');return ctx.decodeAudioData(b.slice(0))}).then(b=>recordedFoley[key]=b).catch(()=>{delete foleyLoads[key];return null});
 }
}
document.addEventListener('pointerdown',()=>{if(audioInit())loadFoley()},{capture:true});
document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&audioInit())loadFoley()},{capture:true});
function quietFoley(key,level=.1,pan=.4,onStart){
 if(!soundOn||document.hidden||!audioInit())return;loadFoley();const epoch=sceneEpoch,beat=beatEpoch;
 const play=buffer=>{if(!buffer||ctx.state==='suspended'||epoch!==sceneEpoch||beat!==beatEpoch||!soundOn||document.hidden)return;const src=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();src.buffer=buffer;gain.gain.value=level;filter.type='lowpass';filter.frequency.value=key==='cloth'?6200:key==='glass-reply'?6500:2100;src.connect(filter).connect(gain);if(key==='cloth'){if(ctx.createStereoPanner){const p=ctx.createStereoPanner();p.pan.value=pan;gain.connect(p).connect(master);src.onended=()=>p.disconnect()}else gain.connect(master)}else route(gain,pan,!['beast','glass-reply','metal-touch'].includes(key));src.start();onStart?.();const clean=src.onended;src.onended=()=>{clean?.();src.disconnect();gain.disconnect();filter.disconnect()};};
 if(recordedFoley[key])play(recordedFoley[key]);else foleyLoads[key]?.then(play);
}
function distantSteps(){const epoch=sceneEpoch,beat=beatEpoch;[0,950,2100].forEach((ms,i)=>setTimeout(()=>{if(epoch===sceneEpoch&&beat===beatEpoch&&$('detail').open)quietFoley('marble-'+i,.055,-.65)},ms));}
function recordedEffect(kind,pan){
 const step=kind.startsWith('step-'),key=step?'marble-'+(marbleStep++%5):kind;
 const buffer=recordedFoley[key];
 if(!buffer){loadFoley();const epoch=sceneEpoch,started=Date.now();foleyLoads[key]?.then(b=>{if(b&&soundOn&&!document.hidden&&epoch===sceneEpoch&&Date.now()-started<800)recordedEffect(kind,pan)});return;}
 const src=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();
 src.buffer=buffer;src.playbackRate.value=step?.99+Math.random()*.02:1;
 gain.gain.value=step?.32:({paper:.30,envelope:.26,book:.28,'book-open':.30,'book-close':.25,handle:.38,wax:.24,knock:.32,'door-close':.72}[kind]??.48);
 filter.type='lowpass';filter.frequency.value=kind==='step-soft'?1100:6500;
 src.connect(filter).connect(gain);route(gain,pan,false);src.start();
 // The marble recording already carries the hall's real reflections.
 src.onended=()=>{src.disconnect();filter.disconnect();gain.disconnect()};
}
function sfx(kind,pan=0){
 if(!soundOn||!ctx||document.hidden)return;
 if(Object.hasOwn(foleyFiles,kind)||kind.startsWith('step-')){recordedEffect(kind,pan);return;}
 const profiles={paper:[.7,.11,1400],wax:[.16,.13,2500],wood:[.65,.1,450],key:[.65,.09,3000],button:[.085,.08,850],gear:[1.15,.075,1300],latch:[.48,.13,1600],knock:[1.5,.22,400],creak:[5.15,.105,1600],'door-close':[1.05,.20,650],'step-stone':[.55,.13,2300],'step-soft':[.42,.042,900]};
 const [dur,amp,cut]=profiles[kind]||profiles.wood,sr=ctx.sampleRate,b=ctx.createBuffer(1,Math.ceil(sr*dur),sr),d=b.getChannelData(0),variation=.88+Math.random()*.24;let soleNoise=0,grain=0,hingePhase=0;const heelPitch=.94+Math.random()*.12,soleAt=.09+Math.random()*.025;const hingePulses=[.08,.39,.87,1.18,1.71,2.29,2.51,3.16,3.79,4.24,4.71].map(t=>[t+Math.random()*.07,.07+Math.random()*.15]);
 for(let i=0;i<d.length;i++){
  const t=i/sr,u=t/dur,w=Math.random()*2-1;let v=0;
  if(kind==='paper')v=w*(Math.sin(Math.PI*u)**2)*(.22+.78*Math.sin(t*37)**4);
  else if(kind==='creak'){
   grain=.993*grain+.007*w;soleNoise=.83*soleNoise+.17*w;
   let friction=0;for(const [at,width]of hingePulses)friction+=Math.exp(-(((t-at)/width)**2));
   const pressure=Math.sin(Math.PI*u)**.7;
   // Irregular sticking hinges and broad wood vibration; no rising electronic sweep.
   hingePhase+=6.283*(78+grain*240)/sr;
   const strain=(Math.sin(hingePhase)+.23*Math.sin(hingePhase*2.31))*.12;
   v=pressure*(soleNoise*(.38+friction*1.15)+w*friction*.12+strain*friction);
  }
  else if(kind==='key')v=(Math.sin(t*6.283*2710)+.45*Math.sin(t*6.283*4147))*Math.exp(-t*13)*.35;
  else if(kind==='knock'){for(const at of [0,.49,1.04])if(t>=at){const x=t-at;v+=(Math.sin(x*6.283*142)*.7+w*.25)*Math.exp(-x*27)}}
  else if(kind==='gear')v=w*.65*Math.exp(-(t%.135)*65)*Math.sin(Math.PI*u);
  else if(kind==='step-stone'){
   soleNoise=.79*soleNoise+.21*w;
   const heel=Math.exp(-(((t-.025)/.013)**2)),x=Math.max(0,t-soleAt),sole=t<soleAt?0:(1-Math.exp(-x*180))*Math.exp(-x*24),roll=Math.exp(-(((t-.20)/.075)**2)),lift=Math.exp(-(((t-.35)/.055)**2));
   const weight=Math.sin(t*6.283*83*heelPitch)*(1-Math.exp(-t*160))*Math.exp(-t*28);
   v=w*heel*.22+soleNoise*(heel*.7+sole*1.1+roll*.35+lift*.10)+weight*.15;
  }
  else if(kind==='step-soft'){soleNoise=.68*soleNoise+.32*w;const heel=Math.exp(-(((t-.075)/.044)**2)),roll=Math.exp(-(((t-.19)/.10)**2)),toe=Math.exp(-(((t-.31)/.065)**2));v=soleNoise*(heel*.75+roll*.42+toe*.18)+Math.sin(t*6.283*53)*heel*.025;}
  else if(kind==='wood')v=w*Math.sin(Math.PI*u)*(.28+.3*Math.sin(t*45)**2)+Math.sin(t*6.283*92)*.08;
  else if(kind==='door-close'){
   soleNoise=.90*soleNoise+.10*w;
   const landing=(1-Math.exp(-t*150))*Math.exp(-t*12),rattle=t>.12?Math.exp(-(t-.12)*27):0;
   v=landing*(soleNoise*1.3+Math.sin(t*6.283*51)*.30+Math.sin(t*6.283*93)*.12)+w*rattle*.055;
  }
  else v=(w*.75+Math.sin(t*6.283*330)*.25)*Math.exp(-t*(kind==='latch'?19:45));
  d[i]=v*amp*variation;
 }
 const src=ctx.createBufferSource(),f=ctx.createBiquadFilter();src.buffer=b;f.type=kind==='paper'?'highpass':'lowpass';f.frequency.value=cut;src.connect(f);route(f,pan,kind.startsWith('step-'));src.start();src.onended=()=>{src.disconnect();f.disconnect()};
}
function stopMusic(){clearTimeout(musicTimer);musicTimer=null;for(const v of musicVoices){try{v.stop()}catch{}}musicVoices=[];if(musicBus&&ctx)musicBus.gain.setTargetAtTime(0,ctx.currentTime,.25)}
// Soft stopped pipes and a subdued pedal, with slow attacks and overlapping releases.
function organVoice(midi,start,hold,level,articulation=false){
 const f=440*Math.pow(2,(midi-69)/12),attack=articulation?.22:1.05,release=articulation?1.25:2.8;
 for(const [ratio,strength]of [[1,.70],[2,.15],[3,.065],[4,.025]]){
  const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.value=f*ratio;
  g.gain.setValueAtTime(0,start);g.gain.linearRampToValueAtTime(level*strength,start+attack);g.gain.setValueAtTime(level*strength*.94,start+hold);g.gain.linearRampToValueAtTime(0,start+hold+release);
  o.connect(g).connect(musicBus);o.start(start);o.stop(start+hold+release+.1);musicVoices.push(o);o.onended=()=>{o.disconnect();g.disconnect();musicVoices=musicVoices.filter(v=>v!==o)};
 }
}
function syncMusic(){
 if(!musicOn||!ctx||document.hidden){stopMusic();return}if(musicTimer!==null)return;
 musicBus.gain.setTargetAtTime(musicVolume*.20,ctx.currentTime,1.4);
 const harmony=[[38,50,57,65],[34,53,58,62],[41,53,60,65],[36,52,55,64],[43,50,58,65],[38,53,57,62],[33,52,57,61],[33,55,61,64],[38,50,57,65],[41,53,57,60],[34,50,58,65],[43,55,58,62],[36,52,60,67],[34,53,58,62],[33,52,57,61],[38,50,57,62]];
 // Written phrases: theme, answering voice, upper-register development, quiet return.
 const melody=[[69,65,64,62,65],[65,62,60,58,62],[69,72,69,67,65],[67,64,62,60,64],[70,69,67,65,62],[69,65,64,62,57],[64,65,64,61,57],[67,64,61,59,61],[74,72,69,65,64],[72,69,67,65,60],[70,69,65,62,65],[74,70,69,67,65],[72,67,64,62,60],[70,65,62,60,58],[64,65,64,61,57],[65,64,62,57,62]];
 function play(){
  if(!musicOn||document.hidden)return;
  const bar=musicBar++%64,index=bar%16,section=Math.floor(bar/16),ch=harmony[index],at=ctx.currentTime+.04,space=index%4===3?13:11;
  organVoice(ch[0]-12,at,space-2,.072);
  organVoice(ch[1],at+.4,space-3,.062);organVoice(ch[2],at+1.0,space-3,.047);
  const timings=section===1?[.5,2.25,4.3,6.7,8.8]:[.8,2.8,4.9,7.1,9.0];
  melody[index].forEach((note,i)=>{
   if(section===3&&i===3)return;
   const upper=section===2&&index>=8?12:0;
   organVoice(note+upper,at+timings[i],i===4?1.5:1.7,.14-(i%2)*.015,true);
  });
  // A lower answer unfolds between melody notes instead of another sustained chord.
  if(section!==0||index%2===1){
   organVoice(ch[3]-12,at+3.6,1.25,.058,true);organVoice(ch[2],at+6.1,1.35,.05,true);
  }
  // Sparing grace figures at phrase endings keep the ornamentation delicate.
  if(section===1&&index%4===2){organVoice(melody[index][3]+2,at+6.8,.32,.055,true)}
  musicTimer=setTimeout(play,space*1000);
 }
 play();
}
function soundLabels(){
 $('sound').textContent='環境音 '+(soundOn?'開':'關');$('sound').setAttribute('aria-pressed',soundOn);$('music').textContent='音樂 '+(musicOn?'開':'關');$('music').setAttribute('aria-pressed',musicOn);$('music-control').hidden=!musicOn;$('volume-control').hidden=!soundOn;
}
function startAudioFromGesture(e){
 if(e?.target?.id==='music'||e?.target?.id==='sound')return;
 if(e?.type==='keydown'&&!['Enter',' '].includes(e.key))return;
 if((soundOn||musicOn)&&audioInit()){syncMusic();if(!ambience)ambient()}
}
document.addEventListener('pointerdown',startAudioFromGesture,{capture:true});document.addEventListener('keydown',startAudioFromGesture,{capture:true});
$('music').onclick=()=>{musicOn=!musicOn;if(musicOn&&!audioInit()){musicOn=false;toast('此裝置暫時無法播放音樂。')}soundLabels();syncMusic();try{localStorage.setItem('velorne.musicEnabled',String(musicOn))}catch{}};
try{const v=localStorage.getItem('velorne.organVolume');if(v!==null&&Number.isFinite(Number(v)))musicVolume=Math.max(0,Math.min(1,Number(v)));if(localStorage.getItem('velorne.musicEnabled')==='false')musicOn=false}catch{}
$('music-volume').value=Math.round(musicVolume*100);$('music-volume').oninput=e=>{musicVolume=Number(e.target.value)/100;if(musicBus&&musicOn)musicBus.gain.setTargetAtTime(musicVolume*.20,ctx.currentTime,.3);try{localStorage.setItem('velorne.organVolume',String(musicVolume))}catch{}};soundLabels();

function sceneImage(id){if(id==='northdoor')return 'assets/north-door-v32.webp';if(id==='glasswalk')return 'assets/glass-walk-v32.webp';if(id==='foyer')return 'assets/entry-closed-v18.webp';if(id==='stairwell')return 'assets/stairs-dark-v23.webp';return `assets/${id}.${'webp'}`}


// The stairwell remains an explorable scene before the final story beat.
let stairSweepOrigin=null,stairBeam={x:50,y:78};
function setupStairSurvey(id){
 const stage=$('stage'),active=id==='stairwell';
 stage.classList.toggle('stair-survey',active);$('nav').classList.toggle('stair-navigation',active);stairSweepOrigin=null;
 if(!active){stage.removeAttribute('tabindex');stage.removeAttribute('aria-label');return;}
 stage.setAttribute('tabindex','0');stage.setAttribute('aria-label','用燭光探照樓梯；可滑動手指、移動游標或使用方向鍵');
 stairBeam={x:50,y:78};aimLight(stairBeam.x,stairBeam.y);
 const next=document.createElement('button');next.id='stairs-finish';next.textContent='抬高燭台，望向樓梯盡頭';next.disabled=false;next.onclick=finishStairSurvey;$('nav').append(next);
 caption(state.candleRenewed?'你舉起換好的新燭，照向台階。\n樓梯上仍然沒有腳步聲。可以滑動探照，或抬頭再看看。':state.galleryChoice==='stairs'?'樓梯深處，剛才已經看過了。燭台裡的蠟又矮了一截。\n你再次照向暗處——會有人來了嗎？點暗處，可以抬高燭台再看。':'蠟燭快燒光了。你護著小小的火焰，慢慢照向台階。\n滑動手指探照四周，也可以直接點樓梯深處，抬高燭台。');
}
function noteStairSweep(x,y){
 if(state.scene!=='stairwell'||moving||$('detail').open)return;
 stairBeam={x,y};if(!stairSweepOrigin){stairSweepOrigin={x,y};return;}
 if(state.stairsExplored||Math.hypot(x-stairSweepOrigin.x,y-stairSweepOrigin.y)<12)return;
 state.stairsExplored=true;save();$('stairs-finish').disabled=false;
 caption('燭光掃過扶手，又落在台階的邊緣。\n上方似乎還有一點光……你可以繼續探照，再抬頭看清楚。');
}
function finishStairSurvey(){
 if(state.scene!=='stairwell'||moving)return;state.stairsExplored=true;save();markExplored('stair-depth');
 storyBeats('朝樓梯望去',[{text:state.candleRenewed?'你抬高新燭。樓梯上方仍看不清。':'你抬高快燃盡的燭台。台階上的光越來越薄，更上方仍看不清。',action:'再抬頭看一眼',wait:1800}],()=>{state.stairSurveyDone=true;state.galleryChoice='stairs';save();afterStairChoices();});
}
$('stage').addEventListener('keydown',e=>{
 if(state.scene!=='stairwell'||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)||$('detail').open)return;
 e.preventDefault();noteStairSweep(stairBeam.x,stairBeam.y);
 const x=Math.max(0,Math.min(100,stairBeam.x+(e.key==='ArrowRight'?14:e.key==='ArrowLeft'?-14:0))),y=Math.max(0,Math.min(100,stairBeam.y+(e.key==='ArrowDown'?14:e.key==='ArrowUp'?-14:0)));
 aimLight(x,y);noteStairSweep(x,y);
});
