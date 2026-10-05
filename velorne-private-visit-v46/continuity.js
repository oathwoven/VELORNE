'use strict';
// V34: discovery order is explicit and survives revisits, interruption and reload.
if(state.northUnlocked){state.keyTagRead=true;state.stairSurveyDone=true;}
notes.key=['暫借的鑰匙','側廊的鎖孔太窄，這把鑰匙無法插入。它仍收在你口袋裡，等待找到合適的門。'];
notes.northTag=['標牌背面的字','北側玻璃廊。書房左側那道暗拱門，也許通往這個方向。'];
function archPause(){
 const text=!state.rainWindowSeen?'左側拱門裡沒有燈。你在書房這一側停住，沒有貿然走入。<br>先借窗邊透進來的微光，看清這間房吧。':!state.keyOwned?'拱門深處很暗，裡面也沒有回應。<br>書桌上還攤著紙張，也許能找到主人的名字。':!state.stairSurveyDone?'暗拱門後不像有人活動。你摸了摸口袋裡的鑰匙。<br>右側走廊那扇房門下還有光，先去那裡找人幫忙吧。':'燭光太弱，看不清暗處。你想起口袋裡的鑰匙——或許上面還有沒看清的地方。';
 showDialog('<h2>先留在有光的地方</h2><p>'+text+'</p><button id="arch-back" class="primary">先看看其他地方</button>'+(state.keyReviewSuggested&&state.keyOwned?'<button id="arch-key" class="quiet">再看看手中的鑰匙</button>':''));$('arch-back').onclick=closeDialog;if(state.keyReviewSuggested&&state.keyOwned)$('arch-key').onclick=inspectKeyTag;
}
function heldKeyArt(read=false){return '<div class="held-key"><img src="assets/key-held-v34.png" alt="從口袋取出的黃銅鑰匙，繫著舊標牌">'+(read?'<span class="key-tag-ink">Northern<br>Glass Walk</span>':'')+'</div>';}
function inspectKeyTag(){
 if(!state.keyOwned||!state.stairSurveyDone)return;
 if(state.keyTagRead){showKnownKeyTag();return;}
 showDialog('<p class="eyebrow">A MARK ON THE REVERSE</p><h2>還有沒看清楚的地方嗎？</h2>'+heldKeyArt(false)+'<p>你從口袋取出鑰匙，扶住垂在提環下的金屬標牌，將它翻向燭光。</p><button id="tag-turn" class="primary">慢慢翻過標牌</button><button id="tag-put" class="quiet">先收好</button>');$('tag-put').onclick=closeDialog;
 $('tag-turn').onclick=()=>{state.keyTagRead=true;state.viewedActions=state.viewedActions.filter(a=>a!=='northdoor');record('northTag');save();showDialog('<p class="eyebrow">NORTHERN GLASS WALK</p><h2>燭光裡浮出的字</h2><div class="key-reveal">'+heldKeyArt(true)+'</div><p>「北側玻璃廊」。<br>你又讀了一次，想起書房左側那道暗拱門。會是那裡嗎？</p><button id="tag-study" class="primary">回書房，去左側拱門看看</button><button id="tag-branches" class="quiet">先看看長廊的其他地方</button>');$('tag-study').onclick=()=>{closeDialog();walk('room',true)};$('tag-branches').onclick=afterStairChoices;};
}
function afterStairChoices(){
 showDialog('<p class="eyebrow">BEYOND THE LAST STEP</p><h2>上方的光，熄了</h2><div class="stairs-study light-extinguished">'+photoView('assets/stairs-dark-v23.webp','上方光線熄滅的樓梯')+'</div><p>'+(state.candleRenewed?'新燭仍然亮著，但轉角上方沒有回答。':'你護住最後一點燭火。樓梯上看不清楚，先別冒險往上走。')+'</p><button id="stairs-again" class="quiet">再用燭光探照樓梯深處</button><button id="stairs-door" class="quiet">看看長廊裡那扇亮著燈的房門</button><button id="stairs-hall" class="quiet">'+(state.hallFootstepsHeard?'回前廳確認剛才的腳步聲':'前廳好像有細微的腳步聲')+'</button>'+(state.keyOwned?'<button id="stairs-key" class="primary">再看看鑰匙，有沒有其他線索</button>':'')+(state.keyTagRead?'<button id="stairs-north" class="quiet">回書房，去左側拱門看看</button>':'')+'<button id="branch-return" class="quiet">退回肖像長廊</button>');
 $('stairs-again').onclick=()=>{closeDialog();if(state.scene!=='stairwell')walk('stairwell');};$('stairs-door').onclick=()=>{closeDialog();walk('door')};$('branch-return').onclick=()=>{closeDialog();walk('gallery')};
 $('stairs-hall').onclick=()=>{const first=!state.hallFootstepsHeard;state.hallFootstepsHeard=true;save();showDialog('<h2>前廳的方向</h2><p>'+(first?'很輕的兩三步，隔著長廊傳來。有人經過了嗎？':'剛才的聲音沒有再響起。再回去看看嗎？')+'</p><button id="hall-confirm" class="primary">回前廳看看</button><button id="hall-stay" class="quiet">先留在長廊</button>');if(first)distantSteps();$('hall-confirm').onclick=()=>{closeDialog();walk('hall')};$('hall-stay').onclick=afterStairChoices;};
 if(state.keyOwned)$('stairs-key').onclick=inspectKeyTag;if(state.keyTagRead)$('stairs-north').onclick=()=>{closeDialog();walk('room',true)};
}
function arrivalContinuity(id){
 const stage=$('stage');stage.classList.remove('candle-falter');stage.classList.toggle('candle-out',!!(state.candleOut&&!state.candleRenewed));
 if(id!=='glasswalk'||state.candleRenewed||state.candleOut)return;
 const epoch=sceneEpoch;
 const alive=()=>epoch===sceneEpoch&&state.scene==='glasswalk'&&!state.candleRenewed&&!state.candleOut;
 const fade=()=>{if(!alive())return;if(moving||$('detail').open||document.hidden){setTimeout(fade,400);return;}stage.classList.add('candle-falter');caption('掌心的光忽然晃了一下。你低頭，燭芯只剩一點小小的火。');setTimeout(()=>{if(!alive()){stage.classList.remove('candle-falter');return;}state.candleOut=true;save();resetLight();stage.classList.remove('candle-falter');stage.classList.add('candle-out');caption('燭芯顫了一下，熄了。四周慢慢沉進黑暗。\n你停住腳步。右側油燈還亮著，桌面偶爾閃過一點光。');},1400);};
 setTimeout(fade,2800);
}
function approachLionNote(){
 showDialog('<p class="eyebrow">A NOTE BENEATH THE LION</p><h2>把燭光移近一點</h2><div class="lion-approach"><img src="assets/lion-base-v27.webp" alt="逐漸靠近獅像旁的便箋，沒有移動紙張"></div><p>你俯下身，讓燭光照向紙上的字。</p><button id="lion-read" class="primary">讀清紙上的提醒</button>');$('lion-read').onclick=()=>note('lion');
}
function animateNorthKey(){
 if(!northReady()||state.northUnlocked)return;
 showDialog('<p class="eyebrow">THE KEY FINDS ITS DOOR</p><h2>慢慢試進鎖孔</h2><div id="key-lock-motion" class="key-lock-motion"><img class="lock-background" src="assets/north-door-v32.webp" alt="北側玻璃門的黃銅鎖孔"><img class="turning-key" src="assets/key-held-v34.png" alt="黃銅鑰匙靠近鎖孔並轉動"></div><p id="key-motion-copy">你扶穩鑰匙，讓齒尖對準鎖孔。這一次，沒有卡住。</p><button id="key-motion-start" class="primary">輕輕插入，再轉動</button><button id="key-motion-cancel" class="quiet">先收回鑰匙</button>');
 $('key-motion-cancel').onclick=closeDialog;let busy=false;const epoch=beatEpoch;
 $('key-motion-start').onclick=()=>{if(busy||epoch!==beatEpoch)return;busy=true;$('key-motion-start').disabled=true;$('key-lock-motion').classList.add('turning');sfx('key');beatAfter(()=>sfx('handle'),1500/pace);beatAfter(()=>{state.northUnlocked=true;record('northKey');markExplored('north-lock');save();$('key-motion-copy').textContent='喀噠。鎖舌退開了。你抽回鑰匙，先聽了片刻，才準備推門。';$('key-motion-start').disabled=false;$('key-motion-start').textContent='收好鑰匙，推門走進去';$('key-motion-start').onclick=()=>{sfx('creak');enterGlassWalk()};$('key-motion-cancel').textContent='先留在門前';},reducedMotion()?0:3400/pace);};
}

function showKnownKeyTag(){
 showDialog('<p class="eyebrow">NORTHERN GLASS WALK</p><h2>標牌上的方向</h2>'+heldKeyArt(true)+'<p>金屬標牌懸在鑰匙的提環下。你扶住它，再讀一遍：<br>「北側玻璃廊」。這是剛才看清的方向。</p><button id="known-tag-go" class="primary">回書房，看看左側拱門</button><button id="known-tag-put" class="quiet">收好鑰匙</button>');$('known-tag-go').onclick=()=>{closeDialog();if(state.scene!=='room')walk('room',true);else caption('左側的拱門仍在暗處。北側玻璃廊……去那裡看看吧。');};$('known-tag-put').onclick=closeDialog;
}
