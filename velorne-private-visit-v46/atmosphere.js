'use strict';
// V37: spatial continuity and free-order conservatory exploration.
const navBefore37=sceneNavigation;
sceneNavigation=function(id){return navBefore37(id).map(([a,label])=>[a,a==='door'&&['room','desk','window'].includes(id)?'穿過前廳，前往右側走廊':label]);};
const travelBefore37=travelCopy;
travelCopy=function(from,to,turning,retreat){
 if(from==='hall'&&to==='door')return '右側走廊深處似乎有一點光。你護著燭火，摸黑向那裡走去。';
 if(from==='stairwell'&&to==='door')return '你放低燭台，背對樓梯轉過身。\n長廊另一端，那扇門下仍留著一線暖光。';
 if(from==='door'&&to==='stairwell')return '你離開緊閉的門，回頭望向樓梯的方向。';
 if(to==='door'&&['room','desk','window'].includes(from))return '你循著來路穿過前廳，再轉向右側走廊。';
 return travelBefore37(from,to,turning,retreat);
};
const choicesBefore37=galleryChoices;
galleryChoices=function(){choicesBefore37();const area=$('detail-body').querySelector?.('.gallery-depth img');if(area){area.src=sceneImage(state.scene);area.alt=state.scene==='stairwell'?'眼前的黑暗樓梯':state.scene==='door'?'眼前緊閉的房門':'眼前的肖像長廊';}if(state.scene==='stairwell')$('gallery-stairs').textContent='留在這裡，再照一照樓梯';$('gallery-door').textContent=state.scene==='door'?'再看看眼前的房門':'回頭看看亮著燈的房門';};
const arrivalBefore37=arrivalLook;
arrivalLook=function(id){if(id!=='invitation'){arrivalBefore37(id);return;}if(!state.arrivalSeen.includes(id)){state.arrivalSeen.push(id);save();}sfx('paper');showDialog('<p class="eyebrow">VELORNE · PRIVATE RESIDENCE</p><h2>私人邀請</h2><p>邀請您今夜造訪私人宅邸。<br>部分收藏室將為您開放。<br><br>抵達後，請叩門三次，在前廳稍候。<br>若無人應答，請勿急於離開。</p><p class="signature">Sylas Velorne</p><button id="invitation-put" class="primary">收好邀請函</button>',true);$('invitation-put').onclick=closeDialog;};
function candleIsLow(){return !!((state.finished||state.stairSurveyDone||state.candleOut)&&!state.candleRenewed);}
candleArt=function(lit=true,freshWax=false){const low=!freshWax&&candleIsLow();return '<div class="held-candle '+(low?'candle-stub ':'')+(lit?'is-lit':'is-out')+'"><img src="assets/'+(low?'hand-candle-stub-v37.png':(freshWax||state.candleRenewed||state.keyOwned)?'hand-candle-renewed-v43.png':'hand-candle-v36.png')+'" alt="'+(low?'只剩短短一截、融蠟積滿托盤的手燭':'隨身的黃銅手燭')+'"><canvas class="wick-flame" width="96" height="150" aria-hidden="true"></canvas></div>';};
scenes.glasswalk.spots=scenes.glasswalk.spots.map(s=>s[0]==='light-shelf'?[s[0],'一盞微微發亮的油燈',s[2],s[3]]:s);
const northCopyBefore37=northCopy;
northCopy=function(id,revisited){if(id==='glasswalk'&&state.glassRainSeen)return state.candleRenewed?'新燭照亮玻璃上的水痕。窗外的石像仍望著雨中的庭院。\n你轉回走廊。盡頭那道門，還沒有打開。':'庭院裡沒有看見人影。雨水沿玻璃滑落。\n你退回走廊中央，右側那盞油燈仍安靜地亮著。';return northCopyBefore37(id,revisited);};
inspectGlassRain=function(){const again=!!state.glassRainSeen;state.glassRainSeen=true;state.rainWindowSeen=true;save();ambient();markExplored('glass-rain');const copy=again?'水痕又換了路徑。你沿著石徑望向庭院盡頭，雕像和石像鬼仍一動不動。\n剛才以為是人影的地方，只剩樹枝在雨裡輕晃。':state.candleRenewed?'你舉起新燭，卻發現玻璃映著自己的光。稍微移開燭台，庭院才清楚起來。\n石徑通向噴泉，雕像立在修剪整齊的樹籬間。兩尊石像鬼守著階前，雨水從翅尖滴下。':'你靠近落地玻璃，等月光慢慢照清外面。\n庭院比想像中大。石徑、噴泉、雕像與石像鬼沉在雨裡，卻沒有一個正在走動的人。';showDialog('<p class="eyebrow">THE GARDEN IN THE RAIN</p><h2>'+(again?'再望一眼庭院':'玻璃後的庭院')+'</h2><div class="rain-photo garden-window">'+clueImage('garden-window-v38','正對落地窗，看見雨中的庭院、雕像與石像鬼')+rainDrops()+'</div><p>'+copy+'</p><button id="glass-rain-back" class="primary">離開窗邊，回到玻璃廊</button><button id="glass-rain-lamp" class="quiet">轉向右側的微光</button>');$('glass-rain-back').onclick=closeDialog;$('glass-rain-lamp').onclick=inspectLightShelf;};
const shelfBefore37=inspectLightShelf;
inspectLightShelf=function(){const again=!!state.shelfSeen;state.shelfSeen=true;save();shelfBefore37();const body=$('detail-body');if(document.createElement){const p=document.createElement('p');p.className='shelf-arrival';p.textContent=again?(state.lightPermission?'油燈還在原處。你讀過的短箋，在燈罩旁投下一道細影。':'短箋仍壓在燈罩旁。你剛才還沒有讀清上面的字。'):state.glassRainSeen?'庭院裡沒有看見人。你離開窗邊，這才靠近走廊右側的油燈。':'你先循著這點暖光走近。原來，燈旁備著蠟燭，還壓著一張短箋。';body.append(p);}};
function glassTriplet(who,onStart){const epoch=beatEpoch;const gaps=who==='outside'?[0,780,1620]:[0,670,1450];gaps.forEach((ms,i)=>setTimeout(()=>{if(epoch!==beatEpoch||!$('detail').open)return;if(who==='reply'){quietFoley('glass-reply',.42,-.12);if(i===0)onStart?.();}else quietFoley('glass-outside',.32*(i===1?.91:1),.2,i===0?onStart:undefined);},who==='outside'?ms:ms/pace));}
let gardenFocus37=false;
const closeBefore37=closeDialog;
closeDialog=function(){closeBefore37();if(gardenFocus37){gardenFocus37=false;$('world').style.transition=reducedMotion()?'none':'transform 900ms ease-out';$('world').style.transform='scale(1)';}};
async function approachGarden37(){
 if(moving)return;if(state.scene!=='glasswalk'){showGardenClose37();return;}
 closeDialog();const token=++walkToken;moving=true;sceneEpoch++;$('stage').classList.add('walking');$('stage').setAttribute('aria-busy','true');caption(state.gardenApproached?'你再次走向玻璃廊盡頭，放輕腳步。':'你提穩燭台，沿著雨聲慢慢走向玻璃廊盡頭。');const duration=reducedMotion()?30:3400/pace;$('world').style.transformOrigin='55% 49%';$('world').style.transition='transform '+duration+'ms ease-in-out';$('world').style.transform=reducedMotion()?'none':'scale(1.85)';footsteps('glasswalk');await new Promise(r=>setTimeout(r,duration));if(token!==walkToken)return;moving=false;$('stage').classList.remove('walking');$('stage').removeAttribute('aria-busy');state.gardenApproached=true;save();gardenFocus37=true;showGardenClose37();
}
function gardenClosePhoto37(){return '<div class="garden-door-close"><img src="assets/garden-door-close-v37.webp" alt="走近玻璃廊盡頭，看向雨中的玻璃門"></div>';}
function showGardenClose37(){
 if(state.northAnswered){northChapterEnd();return;}
 const heard=!!state.gardenKnockPlayed38;showDialog('<p class="eyebrow">AT THE FAR END</p><h2>玻璃另一側</h2>'+gardenClosePhoto37()+'<p id="garden-heard">'+(heard?(state.gardenReplySent?'你站回門前。自己敲過的位置，還留著一小片指印。\n門後仍沒有腳步。再問一聲嗎？':'你站回門前。剛才那三聲已經停了。\n自己的手還沒有碰過玻璃。'):'門外只有雨。你停下腳步，正要開口……')+'</p><button id="garden-listen" class="primary" '+(heard?'':'disabled')+'>輕輕敲回三下</button><button id="garden-back" class="quiet">先退回玻璃廊</button>');$('garden-back').onclick=closeDialog;const epoch=beatEpoch;$('garden-listen').disabled=!heard;
 if(!heard){let retries=0;const beginKnock=()=>{if(epoch!==beatEpoch||!$('detail').open)return;if(soundOn&&(!audioInit()||!recordedFoley['glass-outside'])&&retries++<25){loadFoley();setTimeout(beginKnock,200);return;}glassTriplet('outside',()=>{state.gardenKnockHeard=true;state.gardenKnockPlayed38=true;save();});$('garden-heard').textContent='叩、叩、叩。聲音來自玻璃另一側。\n沉穩的三下過後，沒有離開的腳步。';setTimeout(()=>{if(epoch===beatEpoch&&$('detail').open)$('garden-listen').disabled=false;},2050);};setTimeout(beginKnock,500);}
 $('garden-listen').onclick=()=>{if($('garden-listen').disabled)return;storyBeats('這一次，聲音在等你',[{text:'你屈起指節，輕輕碰上冰涼的玻璃。\n三下，比對面的聲音輕一些，最後一下稍稍遲疑。',action:'輕聲詢問',wait:2100,sound:()=>{state.gardenReplySent=true;save();glassTriplet('reply')}},{text:'「……請問，是這裡的主人嗎？」\n你收回手，護住燭火。',action:'等候玻璃另一側的回應',wait:1600}],()=>{state.northAnswered=true;record('answeringKnock');markExplored('garden-door');save();northChapterEnd(true);});};
}
inspectGardenDoor=function(){if(!state.candleRenewed){showDialog('<h2>遠處那道門</h2><p>燭芯只剩一點暗紅。走廊盡頭的輪廓藏在雨影裡。<br>你停在原地，先沒有走進那片黑暗。</p><button id="garden-light" class="primary">看看右側的微光</button><button id="garden-wait" class="quiet">留在玻璃廊，再看看</button>');$('garden-light').onclick=inspectLightShelf;$('garden-wait').onclick=closeDialog;return;}approachGarden37();};
const chapterBefore37=northChapterEnd;
northChapterEnd=function(freshEvent=false){chapterBefore37(freshEvent);if(freshEvent)quietFoley('metal-touch',.16,.35);const p=$('detail-body').querySelector?.('.photo-object');if(p)p.outerHTML=gardenClosePhoto37();};
async function enterGlassWalk(){
 if(!state.northUnlocked||moving)return;const epoch=beatEpoch;const img=new Image();img.src=sceneImage('glasswalk');try{if(img.decode)await img.decode();}catch{toast('雨廊畫面尚未載入，請再試一次。');return;}if(epoch!==beatEpoch)return;
 closeDialog();const token=++walkToken;moving=true;const overlay=document.createElement('img');overlay.id='threshold-view37';overlay.src=sceneImage(state.scene);overlay.alt='';overlay.setAttribute('aria-hidden','true');overlay.style.transitionDuration=(1600/pace)+'ms';$('stage').append(overlay);go('glasswalk');$('scene').classList.remove('arrive');$('stage').classList.add('walking');$('stage').setAttribute('aria-busy','true');$('world').style.transform='scale(1.06)';$('world').style.transition='transform 1600ms ease-out';footsteps('glasswalk');void overlay.offsetWidth;overlay.style.opacity='0';$('world').style.transform='scale(1)';await new Promise(r=>setTimeout(r,reducedMotion()?20:1600/pace));overlay.remove?.();if(token!==walkToken)return;moving=false;$('stage').classList.remove('walking');$('stage').removeAttribute('aria-busy');$('world').style.transform='';state.rainWindowSeen=true;save();ambient();
}
// Rotate a photographic key cutout over a clean lock plate: door geometry stays still.
function keySilhouette37(g){
 g.beginPath();g.moveTo(833,414);g.lineTo(835,391);g.bezierCurveTo(842,371,866,374,877,387);g.lineTo(870,414);g.bezierCurveTo(896,427,937,434,954,471);g.bezierCurveTo(978,517,947,563,900,574);g.bezierCurveTo(874,580,855,592,838,587);g.bezierCurveTo(822,578,788,578,766,562);g.bezierCurveTo(727,541,716,512,729,477);g.bezierCurveTo(742,438,792,425,833,414);g.closePath();
 g.moveTo(783,472);g.bezierCurveTo(750,480,750,510,771,529);g.bezierCurveTo(791,548,818,539,824,520);g.lineTo(825,477);g.bezierCurveTo(812,458,798,462,783,472);g.closePath();
 g.moveTo(869,479);g.bezierCurveTo(884,456,915,469,925,485);g.bezierCurveTo(941,512,917,535,895,539);g.bezierCurveTo(879,539,869,530,868,516);g.closePath();
}
function tagSwing43(p){return reducedMotion()?0:.23*Math.sin(p*22)*Math.sin(Math.PI*p);}
function drawKeyTurn37(g,plate,key,angle,swing=0){
 g.clearRect(0,0,1672,941);g.drawImage(plate,0,0,1672,941);g.save();g.fillStyle='#100b07';g.strokeStyle='#957047';g.lineWidth=2;g.beginPath();g.arc(853,405,19,0,Math.PI*2);g.fill();g.stroke();g.beginPath();g.moveTo(846,417);g.lineTo(841,489);g.lineTo(865,489);g.lineTo(860,417);g.closePath();g.fill();g.stroke();
 g.translate(853,405);g.rotate(angle);g.filter='brightness(0.75)';g.drawImage(key,0,0,500,1536,-68.4,-136.08,90,276.48);
 g.translate(-21.6,113.58);g.rotate(-angle+swing);g.drawImage(key,510,0,514,1536,-40.64,-18.4,82.24,245.76);g.restore();
}
async function lockPhotos43(){return Promise.all([loadPaperPhoto('assets/key-layers-v43.png'),loadPaperPhoto('assets/north-lock-plate-v40.webp')]);}
async function animateLock37(active){const canvas=$('north-key-canvas'),g=canvas?.getContext?.('2d'),duration=reducedMotion()?20:3200/pace;if(!g){await new Promise(r=>setTimeout(r,duration));return active();}try{const [key,plate]=await lockPhotos43();if(!active())return false;canvas.width=1672;canvas.height=941;const start=performance.now();return await new Promise(resolve=>{const frame=t=>{if(!active()){resolve(false);return;}const p=Math.min(1,(t-start)/duration),a=Math.min(1,p/.55);drawKeyTurn37(g,plate,key,.7854*a*a*(3-2*a),tagSwing43(p));canvas.classList.add('ready');if(p<1)requestAnimationFrame(frame);else resolve(true)};requestAnimationFrame(frame);});}catch{toast('鑰匙特寫尚未載入，請關閉後再試一次。');return false;}}
const keyBefore43=animateNorthKey;
animateNorthKey=function(){keyBefore43();const canvas=$('north-key-canvas'),g=canvas?.getContext?.('2d');if(!g)return;const epoch=beatEpoch;const start=$('key-motion-start');if(start)start.disabled=true;lockPhotos43().then(([key,plate])=>{if(epoch!==beatEpoch||!$('detail').open)return;canvas.width=1672;canvas.height=941;drawKeyTurn37(g,plate,key,0);canvas.classList.add('ready');if(start)start.disabled=false;}).catch(()=>{if(epoch===beatEpoch&&start)start.disabled=false;});};

const pushBefore37=pushGlassDoor;
pushGlassDoor=async function(){if(!state.northUnlocked)return;const epoch=beatEpoch;try{if(typeof Image!=='undefined'){const im=new Image();im.src='assets/glass-walk-v32.webp';if(im.decode)await im.decode();}}catch{toast('門後的畫面尚未載入，請再試一次。');return;}if(epoch!==beatEpoch)return;pushBefore37();};
const copyBefore37=sceneCopy;
sceneCopy=function(id,from,revisited){const text=copyBefore37(id,from,revisited);return id==='room'&&candleIsLow()?text+'\n你低頭護住只剩一截的燭芯，融蠟已經積滿托盤。':text;};

// Irregular storms remain local to the open window.
const rainBefore39=inspectGlassRain;
inspectGlassRain=function(){rainBefore39();const epoch=beatEpoch;const alive=()=>epoch===beatEpoch&&$('detail').open;const storm=()=>{if(!alive())return;if(!document.hidden){const photo=$('detail-body').querySelector?.('.garden-window');if(photo&&!reducedMotion()){photo.classList.remove('lightning39');void photo.offsetWidth;photo.classList.add('lightning39');}setTimeout(()=>{if(alive()&&!document.hidden)quietFoley('thunder',.18,-.2);},950);}setTimeout(storm,30000+Math.random()*25000);};setTimeout(storm,3200);};

// The candle belongs to the player, including in this closer window view.
const rainBefore41=inspectGlassRain;
inspectGlassRain=function(){rainBefore41();const photo=$('detail-body').querySelector?.('.garden-window');if(!photo)return;photo.classList.add('candle-window41');if(!state.candleRenewed){photo.classList.add('unlit-window41');return;}photo.classList.add('lit-window41');photo.style.setProperty('--rain-light-x','50%');photo.style.setProperty('--rain-light-y','55%');const aim=e=>{const r=photo.getBoundingClientRect();photo.style.setProperty('--rain-light-x',Math.max(0,Math.min(100,(e.clientX-r.left)/r.width*100))+'%');photo.style.setProperty('--rain-light-y',Math.max(0,Math.min(100,(e.clientY-r.top)/r.height*100))+'%');};photo.onpointermove=aim;photo.onpointerdown=e=>{aim(e);photo.setPointerCapture?.(e.pointerId);};};
const travelBefore41=travelCopy;
travelCopy=function(from,to,turning,retreat){if(from==='window'&&to==='desk')return '你退離窗邊，轉身回到書桌前。燭光重新落在桌面。';return travelBefore41(from,to,turning,retreat);};
function firstCloth41(){const epoch=beatEpoch;quietFoley('cloth',.13,.35);setTimeout(()=>{if(epoch===beatEpoch&&$('detail').open)quietFoley('cloth',.105,.05);},620);}

const travelBefore43=travelCopy;
travelCopy=function(from,to,turning,retreat){if(from==='desk'&&to==='window')return state.rainWindowSeen?'雨水還沿著玻璃滑落。你提起燭台，從桌旁走向窗邊。':'玻璃上似乎有細小的水痕。窗外……在下雨嗎？\n你提起燭台，走近看看。';return travelBefore43(from,to,turning,retreat);};
const arrivalBefore43=arrivalContinuity;
arrivalContinuity=function(id){arrivalBefore43(id);let holder=$('scene-candle43');if(!holder){holder=document.createElement('button');holder.id='scene-candle43';holder.className='scene-candle43';holder.type='button';holder.setAttribute('aria-label','低頭看看只剩一截的手燭');$('stage').append(holder);}holder.hidden=!(id==='room'&&candleIsLow()&&state.candleHeld);holder.innerHTML=holder.hidden?'':candleArt(!state.candleOut);holder.onclick=showHeldCandle;if(!holder.hidden)animateFlames();};

const deskTravelBefore44=travelCopy;
travelCopy=function(from,to,turning,retreat){if(from==='room'&&to==='desk')return state.seen.includes('desk')?'你重新靠近桌沿，把燭光移向還沒看清的地方。':'你放輕腳步，靠近留著紙張的書桌。';return deskTravelBefore44(from,to,turning,retreat);};
