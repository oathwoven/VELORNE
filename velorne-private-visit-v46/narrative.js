'use strict';
let pace=1;
try{pace=Number(localStorage.getItem('velorne.pace'))||1;}catch{}
if(![1,2.5,8].includes(pace))pace=1;
state.storyLog=Array.isArray(state.storyLog)?state.storyLog:[];
state.seenStories=Array.isArray(state.seenStories)?state.seenStories:[];
state.viewedActions=Array.isArray(state.viewedActions)?state.viewedActions:[];
// Older saves did not track dialogue; infer only scenes whose completion flags prove they were reached.
if(!state.storyHistoryVersion){
 const completed=[[state.entryUnlocked,'邀請函上的規矩'],[state.entryChecked,'先確認退路'],[state.receptionDone,'門在身後關上了'],[state.receptionDone,'沿著微光找人'],[state.sealReturned,'只看一下就放回去'],[state.sealReturned,'還是放回去吧'],[state.keyOwned,'暫借一條歸路'],[state.keyTried,'比對門鎖'],[state.keyTried,'向門後的人求助'],[state.finished,'門的另一側'],[state.galleryChoice==='stairs','朝樓梯望去']];
 for(const [read,title]of completed)if(read&&!state.seenStories.includes(title))state.seenStories.push(title);
 state.storyHistoryVersion=1;save();
}
let currentNarrative=null;
const htmlText=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let beastSessionAt=0,beastCueToken=0;
function queueBeastCue(){
 const token=++beastCueToken;
 const attempt=()=>{
  if(token!==beastCueToken||!['room','desk','window'].includes(state.scene))return;
  if(beastSessionAt&&Date.now()-beastSessionAt<120000)return;
  if(moving||document.hidden||!soundOn){setTimeout(attempt,200);return;}
  if(!audioInit()){setTimeout(attempt,1200);return;}
  loadFoley();if(!recordedFoley.beast){setTimeout(attempt,1200);return;}
  quietFoley('beast',state.beastHeard?.09:.30,.55,()=>{const repeat=!!state.beastHeard;beastSessionAt=Date.now();state.beastHeard=true;save();if(!$('detail').open)caption(repeat?'又來了……是狗的聲音嗎？\n聲音很低，隔著空蕩的房間傳來。':'……剛才，是野獸的低鳴？\n聲音像是從很深的地方，穿過空蕩的房間傳來。');
   setTimeout(()=>{if(token===beastCueToken&&['room','desk','window'].includes(state.scene))quietFoley('beast',.065,-.35)},3400);
  });
  if(!beastSessionAt||Date.now()-beastSessionAt>=120000)setTimeout(attempt,400);
 };
 setTimeout(attempt,1100);
}
function rememberLine(title,text){
 if(!text)return;const key=title+'|'+text;
 if(state.storyLog.some(x=>x.key===key))return;
 state.storyLog.push({key,title,text});state.storyLog=state.storyLog.slice(-240);save();
}
function runNarrative(title,beats,done){
 let index=0,completed=false,entered=new Set(),ready=false,epoch;
 const read=state.seenStories.includes(title);
 const finish=()=>{if(completed)return;completed=true;currentNarrative=null;if(!state.seenStories.includes(title))state.seenStories.push(title);save();done();};
 const unlock=()=>{if(epoch!==beatEpoch||!$('detail').open)return;clearTimeout(beatTimer);ready=true;$('beat-next').disabled=false;$('beat-faster').hidden=true;};
 function render(){
  const beat=beats[index];ready=false;
  showDialog('<p class="eyebrow">VELORNE · '+(index+1)+' / '+beats.length+'</p><h2>'+title+'</h2>'+(beat.visual?beat.visual():'')+'<div class="beat-copy" id="beat-copy" tabindex="0" role="button" aria-label="加速顯示這段對話">'+htmlText(beat.text).replaceAll('\n','<br>')+'</div><button class="primary" id="beat-next">'+beat.action+'</button><div class="story-controls"><button id="beat-prev" '+(index===0?'disabled':'')+'>上一段</button><button id="beat-faster">立即繼續</button><button id="beat-log">劇情回顧</button>'+(read?'<button id="beat-skip">跳過已讀段落</button>':'')+'</div><p class="hint-note">點文字可取消這一段的等待 · 回看不會重複觸發事件</p>');
  epoch=beatEpoch;currentNarrative={render,epoch};$('detail').classList.add('beat-dialog');
  if(!entered.has(index)){entered.add(index);beat.enter?.();beat.sound?.();rememberLine(title,beat.text);}
  const next=$('beat-next');next.disabled=true;beatAfter(unlock,(beat.wait??350)/pace);
  next.onclick=()=>{if(!ready||completed||epoch!==beatEpoch)return;if(++index<beats.length)render();else finish();};
  $('beat-prev').onclick=()=>{if(index>0&&!completed){index--;render();}};
  $('beat-copy').onclick=$('beat-faster').onclick=unlock;
  $('beat-copy').onkeydown=e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();unlock();}};
  $('beat-log').onclick=()=>openStoryLog(render);
  if(read)$('beat-skip').onclick=()=>{if(completed)return;cancelBeat();for(let i=0;i<beats.length;i++){if(!entered.has(i)){entered.add(i);beats[i].enter?.();rememberLine(title,beats[i].text);}}finish();};
 }
 render();
}
function openStoryLog(resume){
 showDialog('<p class="eyebrow">MEMORIES OF THIS VISIT</p><h2>剛才發生的事</h2><p class="hint-note">只重讀已經看過的文字，不會改變物品、線索或重播音效。</p>'+(state.storyLog.length?state.storyLog.slice().reverse().map(x=>'<article class="journal-item"><h3>'+htmlText(x.title)+'</h3><p>'+htmlText(x.text)+'</p></article>').join(''):'<p>這次來訪，還沒有留下敘事紀錄。</p>')+'<button id="history-return" class="primary">'+(resume?'回到剛才的對話':'回到探索')+'</button>');$('history-return').onclick=resume||closeDialog;
}
function askRestart(){
 showDialog('<h2>重新開始這次來訪？</h2><p>本次物品、線索與解謎進度會清除，所有機關都可以重新體驗。<br>已讀劇情紀錄會保留，重玩時可以快速跳過。</p><button id="restart-confirm" class="primary">確認，從邀請函重新開始</button><button id="restart-cancel" class="quiet">保留進度，繼續探索</button>');
 $('restart-cancel').onclick=closeDialog;$('restart-confirm').onclick=()=>{const seen=state.seenStories.slice(),log=state.storyLog.slice();state=fresh();state.seenStories=seen;state.storyLog=log;state.viewedActions=[];opening=false;sealRemoved=false;walkToken++;sceneEpoch++;moving=false;currentNarrative=null;closeDialog();if($('image-viewer').open)$('image-viewer').close();save();originalHome({preventDefault(){}});$('open').disabled=false;$('envelope').disabled=false;$('envelope').classList.remove('breaking','unsealed','unsealing','unfolding');$('open').innerHTML='拆下封蠟 <span>✧</span>';$('seal-caption').textContent='先拆下封蠟';$('envelope').setAttribute('aria-label','觸碰火漆，拆開邀請函');};
}
function explored(action){if(action==='window')return state.clues.includes('windowMark');return state.viewedActions.includes(action)||state.clues.includes(action==='window-mark'?'windowMark':action);}
function markExplored(action){if(!state.viewedActions.includes(action)){state.viewedActions.push(action);save();}for(const b of $('hotspots').children)if(b.dataset.action===action){b.classList.remove('clue-glint','glint-now');b.classList.add('done');}}
function staggerGlints(){const items=[...$('hotspots').children].filter(b=>b.classList.contains('clue-glint'));items.forEach((b,i)=>{b.style.setProperty('--glint-delay',(i*1.1+.2)+'s');b.style.setProperty('--glint-period',(4.9+i*1.17)+'s');});}
function playBoxReveal(){
 showDialog('<p class="eyebrow">THE LAST TUMBLER</p><h2>扣環鬆開了</h2><div id="box-reveal" class="box-reveal"><img class="box-before" src="assets/drawer-open-v18.webp" alt="歸鑰匣的黃銅扣鬆開"><img class="box-after" src="assets/key-note-v23.webp" alt="掀開匣蓋，黑絨布中的鑰匙與短箋逐漸顯露"></div><p id="box-reveal-status" role="status">喀噠。你扶住匣蓋，慢慢往上抬。</p><button id="box-reveal-next" class="primary" disabled>仔細看看鑰匙與短箋</button>');
 const panel=$('box-reveal'),epoch=beatEpoch;const alive=()=>epoch===beatEpoch&&panel.isConnected&&$('detail').open;sfx('handle');
 panel.style.setProperty('--reveal-time',(2.1/pace)+'s');setTimeout(()=>{if(alive())panel.classList.add('opening');},30);
 setTimeout(()=>{if(!alive())return;state.compartmentOpen=true;save();rememberLine('扣環鬆開了','你慢慢掀開匣蓋。黑絨布裡，躺著一把黃銅鑰匙和一張摺起的短箋。');$('box-reveal-status').textContent='燭光照進絨布的褶皺。鑰匙旁，還有一張留給訪客的短箋。';$('box-reveal-next').disabled=false;},reducedMotion()?0:2200/pace);
 $('box-reveal-next').onclick=()=>{if(!$('box-reveal-next').disabled)openBox();};
}
const originalHome=$('home').onclick;
$('home').onclick=e=>{if(moving){e.preventDefault();toast('等這一步走完，再暫停來訪。');return;}if(state.started&&state.scene!=='exterior'){e.preventDefault();showDialog('<h2>暫停來訪</h2><p>厚門仍然鎖著。你還在宅邸裡。<br>目前探索進度已保留。</p><button id="pause-resume" class="primary">繼續探索</button><button id="pause-restart" class="quiet">重新開始故事</button>');$('pause-resume').onclick=closeDialog;$('pause-restart').onclick=askRestart;}else originalHome(e);};
$('revisit').onclick=()=>{if(moving){toast('等這一步走完，就可以重新開始。');return;}askRestart();};$('story-history').onclick=()=>openStoryLog(currentNarrative?.epoch===beatEpoch?currentNarrative.render:undefined);
$('story-pace').value=String(pace);$('story-pace').onchange=e=>{pace=Number(e.target.value);try{localStorage.setItem('velorne.pace',String(pace));}catch{}toast(pace===1?'沉浸節奏 · 保留原本的停頓':pace===2.5?'俐落節奏 · 對話與走動加快':'快速節奏 · 縮短等待');};
// A failed image retains its layout and offers an explicit retry; never traps the narrative.
document.addEventListener('error',e=>{const img=e.target;if(img?.tagName!=='IMG'||img.dataset.failed)return;img.dataset.failed='1';img.classList.add('image-failed');const retry=document.createElement('button');retry.type='button';retry.className='image-retry';retry.textContent='圖片尚未載入 · 點此重試';retry.onclick=ev=>{ev.stopPropagation();delete img.dataset.failed;img.classList.remove('image-failed');const src=img.src.split('?')[0];retry.remove();img.src=src+'?retry='+Date.now();};img.parentElement?.insertAdjacentElement('afterend',retry);},true);
