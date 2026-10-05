'use strict';
// The key tag is the route clue; older saves can continue without replaying the prologue.
function northReady(){return !!(state.northUnlocked||(state.keyOwned&&state.rainWindowSeen&&state.corridorAsked&&state.keyTried&&state.stairSurveyDone&&state.keyTagRead));}
function northCopy(id,revisited){
 if(id==='northdoor')return state.northUnlocked?'北側的鎖已經打開，門留著一道縫。\n玻璃廊裡那盞燈仍亮著。':state.keyOwned?'你停在書房拱門後的北側門前。\n銘牌上的字，和鑰匙標牌上的「北側玻璃廊」一樣。':revisited?'你再次走過書房左側的拱門。\n北側門仍鎖著。先回書房找找主人留下的指引吧。':'穿過書房左側的拱門，一道窄門擋住去路。\n銘牌寫著「北側玻璃廊」。門後很靜。';
 if(id==='glasswalk'&&state.candleOut&&!state.candleRenewed)return '手中的燭芯已經熄了。你停在門內，等眼睛適應暗處。\n右側有一點固定的燈光，照著桌上的東西。';
 if(id==='glasswalk')return state.northAnswered?'玻璃另一側又安靜下來。你沒有再敲。\n新燭火照著來路，那道門仍在等人開啟。':state.candleRenewed?'新燭火穩穩亮著。雨水沿拱形玻璃滑下。\n走廊盡頭還有一道門。現在，至少看得清腳下了。':revisited?'你回到玻璃廊。油燈仍亮著，手裡的短蠟只剩一點。\n先看看右邊燈下，主人似乎留了東西。':'門沒有在身後關上。你刻意留了一道縫。\n雨輕輕落在玻璃頂上，右側燈下，似乎還放著什麼。';
 return null;
}
function northAction(a){
 const actions={'north-lock':inspectNorthLock,'north-plaque':readNorthPlaque,'light-shelf':inspectLightShelf,'glass-rain':inspectGlassRain,'garden-door':inspectGardenDoor};
 if(!actions[a])return false;if(!['north-lock','north-plaque'].includes(a)&&!state.northUnlocked){inspectNorthLock();return true;}actions[a]();return true;
}
function readNorthPlaque(){
 showDialog('<p class="eyebrow">NORTHERN GLASS WALK</p><h2>標牌上的方向</h2>'+clueImage('north-door-v32','北側玻璃門與黃銅銘牌','north-plaque-next','看清銘牌，查看門鎖')+'<p>銘牌被擦得很亮。「北側玻璃廊」。<br>'+(state.keyOwned?'你翻看鑰匙的舊標牌。是同一個地方。':'門後看起來通向另一條走廊。你記住這個名字，暫時沒有推門。')+'</p><button id="north-plaque-next" class="primary">看看這道門的鎖</button><button id="north-close" class="quiet">先退開</button>');$('north-plaque-next').onclick=inspectNorthLock;$('north-close').onclick=closeDialog;markExplored('north-plaque');
}
function inspectNorthLock(){
 if(!northReady()){archPause();return;}
 if(!state.northUnlocked&&!state.keyOwned){showDialog('<p class="eyebrow">A DOOR TO REMEMBER</p><h2>拱門後，還有一道門</h2>'+clueImage('north-door-v32','書房左側拱門後鎖著的北側門')+'<p>你輕聲問了句：「有人在嗎？」等了一會兒，沒有回應。<br>手指試探地壓下門把，鎖舌卻沒有退開。你沒有用力。</p><p>先回書房看看吧。桌上留著紙張，也許能找到主人的指引。</p><button id="north-locked-back" class="primary">沿拱門退回書房</button><button id="north-close" class="quiet">先留在門前</button>');$('north-locked-back').onclick=()=>{closeDialog();walk('room')};$('north-close').onclick=closeDialog;return;}
 if(state.northUnlocked){showDialog('<h2>門留著一道縫</h2>'+clueImage('north-door-v32','已解鎖的北側門','north-enter','沿門縫進入玻璃廊')+'<p>你先前轉開的鎖沒有再扣上。鑰匙還收在口袋裡。</p><button id="north-enter" class="primary">進入玻璃廊</button><button id="north-close" class="quiet">先留在門外</button>');$('north-enter').onclick=enterGlassWalk;$('north-close').onclick=closeDialog;return;}
 showDialog('<p class="eyebrow">THE KEY FINDS ITS DOOR</p><h2>這一次，鎖孔對上了</h2>'+clueImage('north-door-v32','北側門的細長黃銅鎖孔','north-key','小心插入借來的鑰匙')+'<p>裡面看起來是一條通道，並非臥房。<br>短箋准許你攜鑰續行。你仍先輕聲問了一句：「不好意思……有人在嗎？」</p><button id="north-key" class="primary">等一會兒，再試鑰匙</button><button id="north-close" class="quiet">先不開，回頭看看</button>');
 $('north-close').onclick=closeDialog;$('north-key').onclick=animateNorthKey;
}

function enterGlassWalk(){if(!state.northUnlocked)return;closeDialog();walk('glasswalk',true);}
function inspectGlassRain(){
 state.glassRainSeen=true;state.rainWindowSeen=true;save();ambient();markExplored('glass-rain');
 showDialog('<p class="eyebrow">RAIN ABOVE YOU</p><h2>雨聲，到了頭頂</h2><div class="rain-photo">'+clueImage('glass-walk-v32','雨滴沿北側玻璃廊的拱窗滑落')+rainDrops()+'</div><p>雨很細。水珠從玻璃頂緩緩滑到窗沿。<br>你把燭台移離窗邊，沒有碰窗扣。書房的便箋說過，窗不要打開。</p><button id="glass-rain-back" class="primary">回身看看燈下</button>');$('glass-rain-back').onclick=inspectLightShelf;
}
function inspectLightShelf(){
 const ready=state.candleRenewed,permission=state.lightPermission;
 showDialog('<p class="eyebrow">A LIGHT LEFT FOR YOU</p><h2>'+(ready?'借來的火，還亮著':'燈下留著一支蠟燭')+'</h2>'+clueImage(state.candleRenewed?'light-shelf-used-v45':'light-shelf-v32',state.candleRenewed?'油燈旁留下的短蠟與訪客短箋':'油燈旁的備用蠟燭與留給訪客的短箋','shelf-action',ready?'再看一眼主人留下的短箋':permission?'依照短箋，借一支蠟燭':'先讀燈下的短箋')+'<p>'+(ready?'你只借了一支，沒有帶走燈。換下的短蠟留在托盤裡。<br>手中的新火苗已經站穩，現在可以繼續往前。':permission?'「給我們的訪客。取一支蠟燭，借一點火。」<br>你看了看已經熄滅的燭芯。至少，這次不用擔心自己擅自拿東西。':'新蠟燭旁壓著一張小紙。你先把手收回來。<br>也許應該看清楚，再決定能不能借。')+'</p><button id="shelf-action" class="primary">'+(ready?'讀一讀短箋':permission?'換上新燭，借油燈點燃':'靠近閱讀短箋')+'</button>'+(ready?'<button id="shelf-forward" class="primary">看看玻璃廊盡頭</button>':'')+'<button id="shelf-close" class="quiet">退回玻璃廊</button>');
 $('shelf-close').onclick=closeDialog;$('shelf-action').onclick=ready||!permission?readLightPermission:renewCandle;if(ready)$('shelf-forward').onclick=inspectGardenDoor;
}
function readLightPermission(){
 state.lightPermission=true;record('borrowFlame');save();
 showDialog('<p class="eyebrow">FOR OUR GUEST</p><h2>這盞燈，是留給來客的</h2>'+clueImage(state.candleRenewed?'light-shelf-used-v45':'light-shelf-v32','短箋：For our guest. Take one candle. Borrow the flame.')+'<blockquote class="guest-note">給我們的訪客。<br>取一支蠟燭，借一點火。</blockquote><p>你又看了眼「訪客」那個詞。<br>這間屋子明明一直在準備接待，為什麼卻找不到人？</p><button id="permission-next" class="primary">'+(state.candleRenewed?'回到燈下':'照短箋所說，借一支蠟燭')+'</button><button id="permission-close" class="quiet">先記下來</button>');$('permission-next').onclick=state.candleRenewed?inspectLightShelf:renewCandle;$('permission-close').onclick=closeDialog;
}
function renewCandle(){
 if(!state.lightPermission){readLightPermission();return;}if(state.candleRenewed){inspectLightShelf();return;}
 showDialog('<p class="eyebrow">BORROWING THE FLAME</p><h2>讓火苗慢慢接過來</h2><div id="flame-transfer" class="flame-transfer">'+clueImage('light-shelf-v32','燭芯靠近受玻璃罩保護的油燈')+'</div><p id="flame-copy">你先扶穩油燈，小心提起燈罩，再讓新燭芯靠近火苗。<br>掌心護住微弱的氣流，等它亮起來。</p><button id="flame-start" class="primary">護住燭芯，借一點火</button><button id="flame-leave" class="quiet">先停下來</button>');
 const epoch=beatEpoch;let started=false;$('flame-leave').onclick=closeDialog;
 $('flame-start').onclick=()=>{if(started||epoch!==beatEpoch)return;started=true;$('flame-start').disabled=true;$('flame-copy').textContent='燭芯先紅了一點。你穩住手，等火苗慢慢站起來。';$('flame-transfer').classList.add('kindling');
 beatAfter(()=>{state.candleRenewed=true;state.candleOut=false;state.candleHeld=true;$('stage').classList.remove('candle-out');record('newLight');markExplored('light-shelf');save();$('flame-copy').textContent='亮了。你將新燭插穩，把換下的短蠟留在托盤裡。你放好燈罩，把油燈留給下一個人。';$('flame-start').disabled=false;$('flame-start').textContent='提起新燭，繼續探索';$('flame-start').onclick=()=>{closeDialog();caption(northCopy('glasswalk',true));};$('flame-leave').textContent='再看看短箋';$('flame-leave').onclick=readLightPermission;
 },2400/pace);};
}
function inspectGardenDoor(){
 if(!state.candleRenewed){showDialog('<h2>先保住手裡這點光</h2><p>走廊盡頭很暗，手裡的燭芯已經熄了。<br>右側油燈下似乎備著新燭。先看清那張紙，再往前走。</p><button id="garden-light" class="primary">回到燈下看看</button><button id="garden-wait" class="quiet">留在原處</button>');$('garden-light').onclick=inspectLightShelf;$('garden-wait').onclick=closeDialog;return;}
 if(state.northAnswered){northChapterEnd();return;}
 showDialog('<p class="eyebrow">AT THE FAR END</p><h2>玻璃另一側</h2>'+clueImage('glass-walk-v32','玻璃廊盡頭通往庭院的門','garden-listen','靠近一點，靜靜聽')+'<p>你提穩剛點好的燭台，沿著玻璃廊走到盡頭。<br>門外只有雨。你正想開口，卻聽見了很輕的一聲。</p><button id="garden-listen" class="primary">停下來，聽清楚</button><button id="garden-back" class="quiet">先退回燈下</button>');$('garden-back').onclick=inspectLightShelf;
 $('garden-listen').onclick=()=>storyBeats('這一次，聲音在等你',[
 {text:'叩。\n你沒有動。',action:'屏住呼吸，聽下一聲',wait:1800,sound:()=>sfx('knock')},
 {text:'第二下。隔了一會兒，才是第三下。\n三聲，和邀請函上寫的一樣。',action:'望向被雨模糊的玻璃',wait:3300,sound:()=>{sfx('knock');const epoch=beatEpoch;setTimeout(()=>{if(epoch===beatEpoch&&$('detail').open)sfx('knock');},1800/pace)}},
 {text:'玻璃太暗，你看不清外面。\n但那三聲停下以後，對面也沒有離開的腳步。',action:'輕輕敲回三下',wait:1900},
 {text:'你屈起指節，把同樣的三聲送回去。\n「……請問，是這裡的主人嗎？」',action:'等候玻璃另一側的回應',wait:4200,sound:knockThree}
 ],()=>{state.northAnswered=true;record('answeringKnock');markExplored('garden-door');save();northChapterEnd(true);});
}
function northChapterEnd(freshEvent=false){
 showDialog('<p class="eyebrow">THE NORTHERN GLASS WALK</p><h2>'+(freshEvent?'有人聽見了':'門後又安靜下來')+'</h2>'+clueImage('glass-walk-v32','燭火照亮雨夜的玻璃廊')+'<p>'+(freshEvent?'你沒有再敲。<br>門另一側，傳來極輕的金屬擦碰聲。你握穩燭台，等著。':'你還記得剛才門另一側傳來的金屬擦碰聲。<br>你沒有再敲，只把燭台握穩，留意門後的動靜。')+'</p><p class="end-mark">未完待續。</p><p class="hint-note">北側玻璃廊的探索已記下。你仍可以回頭查看宅邸。</p><button id="north-end-back" class="primary">回到玻璃廊</button><button id="north-end-hall" class="quiet">先回前廳</button>');$('north-end-back').onclick=closeDialog;$('north-end-hall').onclick=()=>{closeDialog();walk('hall',true);};
}
