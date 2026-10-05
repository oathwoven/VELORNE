'use strict';
let stairDragged=false,stairPointer=null;
$('stage').addEventListener('pointerdown',e=>{stairDragged=false;stairPointer={x:e.clientX,y:e.clientY};});
$('stage').addEventListener('pointermove',e=>{if(stairPointer&&Math.hypot(e.clientX-stairPointer.x,e.clientY-stairPointer.y)>12)stairDragged=true;});
$('stage').addEventListener('pointerup',()=>{stairPointer=null;});
$('stage').addEventListener('pointercancel',()=>{stairPointer=null;stairDragged=true;});
state.visits=state.visits&&typeof state.visits==='object'?state.visits:{};
state.objectVisits=state.objectVisits&&typeof state.objectVisits==='object'?state.objectVisits:{};
for(const id of state.seen)state.visits[id]=Math.max(1,Number(state.visits[id])||0);
state.rainLooks=Number(state.rainLooks)||0;
if(state.clues.includes('seal')||state.compartmentOpen||state.keyOwned)state.drawerOpened=true;

function candleKnown(){return !!(state.candleExamined||state.lightRevealed||state.drawerReleased);}
function windowLead(){return candleKnown()?'去其他地方看看吧。三道刻痕……會不會和書桌上能轉動的燭台有關？':'這三道刻痕是誰留下的？先記住它，去其他地方看看吧。';}
function studyKeyLead46(){
 if(state.northUnlocked)return '左側拱門裡的玻璃門已經打開，油燈仍照著來路。\n你在桌前停了一下。還有什麼想確認的，也可以再看一眼。';
 if(state.keyTagRead)return '你想起鑰匙標牌上的字：「玻璃廊・北側」。\n書房左側的拱門後，還有一道門。提著燭台，過去看看吧。';
 if(state.keyReviewSuggested||keyReviewReady())return '右側房門沒有回應，樓上的光也熄了，前廳仍不見人。\n你將燭台移近桌沿，摸到口袋裡的鑰匙。懸著的金屬標牌似乎有字……打開隨身物品，再看看吧。';
 if(state.keyTried)return state.stairSurveyDone?'那把鑰匙開不了右側的門，樓梯上也已經沒有光。\n長廊另一端曾傳來腳步；前廳那邊，還沒去看清楚。':'右側的門沒有回應，鑰匙也插不進去。\n長廊另一頭還有樓梯，也許能在那裡找到人。';
 if(state.corridorAsked)return '剛才右側房門裡沒有人回答。\n你摸到口袋裡的鑰匙。它會不會正好能打開那道門？';
 return '主人還是沒有回來。\n鑰匙、短箋、窗燈鑰的次序……是在玩什麼遊戲嗎？右側走廊似乎還有一點光，去那邊找人問清楚吧。';
}
function sceneCopy(id,from,revisited){
 const north=northCopy(id,revisited);if(north)return north;
 if(state.candleOut&&!state.candleRenewed)return '你端著已經熄滅的燭台，循著來路停下。\n先回北側玻璃廊的油燈旁看看吧，黑暗裡不宜走得太遠。';
 if(state.candleRenewed&&id==='gallery')return '你提著換好的新燭，回到肖像長廊。\n衣料聲沒有再響起。現在，你知道北側還有一條玻璃廊。';
 if(id==='hall'&&northReady())return state.northAnswered?'你回到前廳。玻璃廊那三聲輕叩，還留在腦海裡。\n新燭火映著掌心。主人，真的在那道門後嗎？':'你回到前廳，翻看鑰匙標牌上的方向。\n玻璃廊・北側。回書房看看左側的拱門吧。';
 if(state.keyOwned&&['room','desk'].includes(id))return studyKeyLead46();
 const has=k=>state.clues.includes(k);
 if(id==='room'){
  if(from==='northdoor'&&!state.keyOwned)return '你沿拱門退回書房。北側的門鎖著，也沒有人回答。\n先看看桌上尚未收起的紙張，或許能找到主人的名字。';
  if(state.keyTagRead&&!state.northUnlocked)return '主人依然沒有回來。鑰匙的標牌寫著「玻璃廊・北側」。\n左側拱門裡還有一道門。提著燭台，去比對看看吧。';
  if(state.northUnlocked)return '你沿來路退回書房。左側拱門裡，仍透著玻璃廊油燈的光。\n'+(state.northAnswered?'玻璃廊傳來的三聲輕叩，還留在腦海裡。':'燭光映著來路。可以回玻璃廊，也可以再看看桌上的線索。');
  if(state.keyOwned&&state.finished)return '你再回到書房。主人依然不在，右側的房門也沒有人回應。\n鑰匙還在口袋裡。也許長廊與樓梯附近，還留著線索。';
  if(state.keyOwned)return '書房仍然空著。主人到底去了哪裡？\n口袋裡的鑰匙碰著指節。短箋像是在引你往前……去右側走廊找人問清楚吧。';
  if(from==='window')return '你退離雨窗，燭光重新照到桌邊。\n'+(has('windowMark')?'三道刻痕已經記下。'+windowLead()+'':'先找主人要緊。桌上的宅邸記事簿，也許記著接待人的名字。');
  if(from==='desk')return '你退回書房中央，先朝門口看了一眼。還是沒有人。\n'+(has('book')?'宅邸記事簿、獅像旁的便箋……這些提醒似乎彼此呼應。':'桌上還留著沒收好的紙張。主人會不會只是暫時離開？');
  if(revisited)return '你再次探頭看向書房。「不好意思……有人回來了嗎？」\n沒有人回答。桌椅仍在原處，只有燭火輕輕晃動。';
  return '書桌邊緣閃過一點微光。\n門打不開，又找不到人。桌上像是留著接待的紙張，也許能找到主人的去向。';
 }
 if(id==='desk'){
  if(state.keyOwned)return '主人還是沒有回來。\n鑰匙、短箋、窗燈鑰的次序……是在玩什麼遊戲嗎？右側走廊似乎還有一點光，去那邊找人問清楚吧。';
  if(state.compartmentOpen)return '匣子已經打開。黑絨布裡的鑰匙旁，留著一張給訪客的短箋。\n先看清楚主人留下的話，再決定能不能拿。';
  if(state.drawerOpened)return '抽屜還留著剛才拉開的縫。你沒有再拉一次。\n印章、房號和交班次序……應該能對上那只歸鑰匣。';
  if(has('letter')||has('book'))return '你放下剛才看過的紙張，朝門口等了一會兒。主人仍沒出現。\n那些隨手留下的字句，像是某種日常的片段。這間屋子並沒有被遺忘。';
  return revisited?'茶杯和未封口的信仍在原處。\n你把燭光移向桌上尚未看清的東西。':'你先輕聲道了歉，沒有立刻碰桌上的東西。\n未封口的信上有熟悉的紋章。也許露出的紙角上，寫著主人的名字。';
 }
 if(id==='door')return state.corridorAsked||state.finished?'門縫下的光依然溫暖，但裡面依然沒有人回應。\n還要再敲一次嗎？也可以轉向長廊，或回前廳找人。':'門縫下透著一線暖光。\n也許有人在裡面。先敲門，說明自己被鎖在屋內了。';
 if(id==='gallery')return from==='stairwell'?'你轉過身，護著快熄滅的燭火，回到肖像長廊。\n衣料聲沒有再響起。房門下還有光，另一頭通往前廳。':revisited?'你再次回到肖像之間。剛才的聲音沒有再出現。\n再看看樓梯，還是去那扇亮著燈的門前等一等？':'你回頭，肖像之間卻沒有人。\n燭台裡的蠟已經不多了。樓梯和前廳，都藏在安靜的暗處。';
 if(id==='hall'&&state.receptionDone){
  if(!studyReady())return state.seen.includes('room')?'前廳仍然沒有人。書房的紙張還沒看完，也許能找到主人的去向。':'前方的開口透著暖光。你提穩燭台，決定先去書房找人。';
  if(!state.corridorAsked)return '書房裡沒有找到主人。右側走廊深處，似乎也有一點光。\n提著燭火，往那邊看看吧。';
  if(!state.keyTried)return '右側房門裡仍沒有回應。你還沒弄清那扇門能不能打開。\n再回走廊看看，或先留在前廳聽一聽。';
  if(!state.stairSurveyDone)return '前廳依然空著。右側房門沒有回應，長廊另一頭的樓梯還沒看清。\n也許主人在樓上？';
  return '前廳沒有看見人。房門鎖著，樓上的光也熄了。\n口袋裡的鑰匙碰著指節。回書房的燈下，再看看它有沒有留下線索吧。';
 }
 if(id==='window'&&has('windowMark'))return '窗框上的三道刻痕，和剛才一樣。\n雨痕似乎更密了，外面仍看不見人。'+windowLead()+'';
 if(id==='window'&&revisited)return '你再次停在玻璃前。雨點比剛才密了一些。\n你用燭光照過窗框，沒有擅自打開窗子。';
 return scenes[id].caption;
}
function sceneNavigation(id){
 if(id==='hall'&&northReady())return scenes.hall.nav.map(([a,label])=>[a,a==='room'?'回書房，查看左側拱門':label]);
 if(['room','desk','window'].includes(id))return [...scenes[id].nav.filter(([a])=>a!=='hall'),['study-exit','回到大廳']];
 if(id==='gallery'&&state.finished)return [['stairwell',state.galleryChoice==='stairs'?'再看看樓梯深處':'用燭光照向樓梯'],['door','看看亮著燈的房門'],['hall','返回前廳']];
 if(id==='door'&&state.corridorAsked)return [['lock','門後仍沒回應……再看看'],...(state.finished?[['stairwell','看看樓梯深處'],['gallery','轉回肖像長廊']]:[]),['hall','返回前廳']];
 return scenes[id].nav.map(([a,label])=>[a,state.seen.includes(a)&&a==='room'?'再去書房找找人':state.seen.includes(a)&&a==='door'?'再看看右側走廊':label]);
}
function travelCopy(from,to,turning,retreat){
 if(state.candleRenewed&&from==='stairwell'&&to==='gallery')return '你護住新點的火焰，轉過身，沿台階前的來路返回長廊。';
 if(state.candleRenewed&&to==='stairwell')return '你舉起換好的新燭，再次走向黑暗的樓梯。';
 if(to==='northdoor')return from==='glasswalk'?'你轉身沿著來路，退回留著縫的北側門。':'你提穩燭台，穿過書房左側的拱門，慢慢靠近裡面的窄門。';
 if(from==='northdoor'&&to==='room')return '你轉身離開北側門，沿著拱門裡的來路，慢慢退回書房。';
 if(to==='glasswalk')return '你扶住玻璃門，留一道縫，才提著燭台走進通道。';
 if(from==='stairwell'&&to==='gallery')return '蠟燭快燒光了。你護住火焰，轉過身。\n背對樓梯，沿著來時的方向返回長廊。';
 if(turning)return to==='gallery'?'你從緊閉的房門前轉身，望向身後的肖像長廊。':'你轉向那扇仍漏著暖光的門。這次，先聽聽裡面有沒有動靜。';
 if(from==='window'&&to==='room')return '你離開玻璃，慢慢退回書房。';
 if(retreat)return to==='room'?'你鬆開手，退回書房中央。':to==='desk'?'你循著來路，回到剛才的書桌旁。':'你轉回來時的方向，慢慢返回前廳。';
 if(state.seen.includes(to))return to==='room'?'你再次走向書房，留意著門內有沒有腳步。':to==='stairwell'?'你提著快熄滅的燭台，再次靠近樓梯。':'你沿著已經走過的路，想再確認一次。';
 return to==='desk'?'你放輕腳步，靠近留著紙張的書桌。':to==='door'?'你循著門縫下的暖光，慢慢靠近右側走廊。':'你端穩燭台，朝尚未看清的地方走去。';
}
function requestVisit(target){
 if(['door','gallery','stairwell'].includes(target)&&!studyReady()){guideToStudy();return;}
 if((target==='door'&&!state.corridorAsked)||(target==='stairwell'&&!state.stairSurveyDone)||!state.seen.includes(target)||!['room','door','stairwell'].includes(target)||['desk','window'].includes(state.scene)){walk(target);return;}
 const copy=target==='room'?'那間書房已經去過了。主人會不會剛好回來？':target==='door'?'那扇門下仍透著光。再過去聽聽，或許這次會有人回應。':state.candleRenewed?'已經換好了新燭。再看看樓梯深處，是否留下什麼？':'樓梯深處，剛才看過了。燭火又短了一截，還想再確認一次嗎？';
 showDialog('<h2>再去看看？</h2><p>'+copy+'</p><button class="primary" id="visit-again">'+(target==='room'?'再找找有沒有人':'再去確認一次')+'</button><button class="quiet" id="visit-stay">先留在這裡</button>');
 $('visit-again').onclick=()=>{closeDialog();walk(target)};$('visit-stay').onclick=closeDialog;
}
function revisitDoor(){
 showDialog('<p class="eyebrow">THE LIGHT REMAINS</p><h2>暖光仍在，門也仍然鎖著</h2>'+photoView('assets/door.webp','依然透著暖光的房門')+'<p>剛才敲過，也試過門把了。裡面始終沒有回答。<br>你把手收回來。也許，該找另一條路。</p><button id="door-again" class="quiet">再輕輕敲一次</button><button id="door-to-stairs" class="primary">往樓梯那邊看看</button><button id="return-gallery" class="quiet">轉回肖像長廊</button><button id="door-to-hall" class="quiet">回前廳找人</button>');
 $('door-again').onclick=()=>storyBeats('再問一次',[{text:'你又輕叩三下，低聲問：「有人在嗎？我還在外面……」',action:'等候回應',wait:4100,sound:knockThree},{text:'暖光沒有熄滅。也沒有腳步向門口靠近。',action:'收回手',wait:1200}],revisitDoor);
 $('door-to-stairs').onclick=()=>{closeDialog();walk('stairwell')};$('return-gallery').onclick=()=>{closeDialog();walk('gallery')};$('door-to-hall').onclick=()=>{closeDialog();walk('hall')};
}
function galleryChoices(){
 const returned=!!state.galleryChoice;
 showDialog('<p class="eyebrow">BEYOND THE CANDLELIGHT</p><h2>'+(returned?'仍然空著的長廊':'回頭，沒有任何人')+'</h2><div class="gallery-depth">'+photoView('assets/gallery.webp','燭光照不到的肖像長廊深處')+'</div><p>'+(state.candleRenewed?'新燭火照亮近處的畫框。剛才那道衣料聲，沒有再出現。':returned?'你回到這裡，卻仍找不到剛才發出聲音的人。燭台裡的蠟，又矮了一截。':'蠟燭已經快燒完了。你回頭看過，肖像之間沒有人。')+'</p><div class="gallery-options" role="group" aria-label="接下來往哪裡找人"><button id="gallery-stairs" class="primary">'+(state.galleryChoice==='stairs'?'再看看樓梯深處':'樓梯上方……是不是有什麼？')+'</button><button id="gallery-door" class="quiet">看看那扇亮著燈的房門</button><button id="gallery-footsteps" class="quiet">'+(state.hallFootstepsHeard?'再回前廳找找人':'前廳好像傳來細微的腳步聲')+'</button></div>');
 if(state.stairSurveyDone&&state.keyOwned){const k=document.createElement('button');k.className='quiet';k.textContent=state.keyTagRead?'回書房，去左側拱門看看':'再看看鑰匙，有沒有其他線索';k.onclick=state.keyTagRead?()=>{closeDialog();walk('room',true)}:inspectKeyTag;$('detail-body').append(k);}
 $('gallery-stairs').onclick=()=>{closeDialog();go('stairwell')};$('gallery-door').onclick=()=>{closeDialog();walk('door')};
 $('gallery-footsteps').onclick=()=>{const heard=state.hallFootstepsHeard;state.hallFootstepsHeard=true;save();showDialog('<h2>'+(heard?'前廳的方向':'前廳的腳步聲')+'</h2><p>'+(heard?'剛才似乎有人往那邊走。現在安靜了，再去確認一下嗎？':'一下……又一下。很輕，像有人刻意放慢腳步。聲音從來時的方向傳來。')+'</p><button id="hall-confirm" class="primary">回前廳看看</button><button id="branch-back" class="quiet">先留在原處</button>');if(!heard)distantSteps();$('branch-back').onclick=galleryChoices;$('hall-confirm').onclick=()=>{state.galleryChoice='hall';save();closeDialog();walk('hall')};};
}

function ledgerAsset(page){return page==='VII'?'ledger-open-v25':page==='VI'?'ledger-vi-v27':'ledger-v-v27'}
function runClueMotion(kind,before,after,title,copy,done){
 showDialog('<p class="eyebrow">A CAREFUL TOUCH</p><h2>'+title+'</h2><div id="clue-motion" class="clue-motion '+kind+'"><img class="motion-plate" src="'+(kind==='letter-pull'?'assets/letter-plate-v29.webp':'assets/lion-plate-v29.webp')+'" alt="" aria-hidden="true"><img class="motion-base" src="assets/'+before+'.webp" alt="動作前的物件"><img class="motion-result" src="assets/'+after+'.webp" alt="'+title+'後的特寫"><canvas id="clue-paper" class="motion-piece" aria-hidden="true"></canvas>'+(kind==='letter-pull'?'<img class="motion-envelope" src="assets/'+before+'.webp" alt="" aria-hidden="true">':'')+'</div><p id="motion-copy">'+copy+'</p><button id="motion-read" class="primary" disabled>仔細讀一讀</button>');
 const epoch=beatEpoch,panel=$('clue-motion');let completed=false;$('motion-read').disabled=true;
 const alive=()=>epoch===beatEpoch&&$('detail').open&&panel.isConnected;
 $('motion-read').onclick=()=>{if(!alive()||completed||$('motion-read').disabled)return;completed=true;done()};
 const start=()=>{if(!alive())return;panel.style.setProperty('--motion-time',(2.1/pace)+'s');panel.classList.add('playing');sfx(kind.startsWith('book')?'book-open':kind==='page-turn'?'book':'paper');beatAfter(()=>{if(!alive())return;panel.classList.add('settled');$('motion-read').disabled=false;$('motion-copy').textContent='你停住動作，讓燭光落在字跡上。';},reducedMotion()?0:2200/pace);};
 const preview=new Image(),plate=new Image();preview.src='assets/'+after+'.webp';plate.src=kind==='letter-pull'?'assets/letter-plate-v29.webp':'assets/lion-plate-v29.webp';if(preview.decode)Promise.all([preview.decode(),plate.decode(),prepareCluePaper($('clue-paper'),kind)]).then(start).catch(()=>{if(alive()){$('motion-copy').textContent='特寫暫時未載入。你仍可以先讀下面的文字。';$('motion-read').disabled=false;}});else start();
}
function extractLetter(){runClueMotion('letter-pull','letter-v25','letter-open-v27','小心抽出信紙','你先托住信封，再捏住露出的紙角，慢慢抽出。你只想找找落款，紙上卻沒有名字，只有一行尚未寫完的便函。',()=>note('letter'));}
function inspectLetter(){
 if(!state.clues.includes('letter')){extractLetter();return;}
 showDialog('<h2>那封未寫完的便函</h2>'+clueImage('letter-open-v27','尚未寫完的家務便函')+'<p>「那間房仍照舊打理。」<br>下面仍是一片空白。是什麼讓寫信的人忽然離開？</p><button id="letter-again" class="primary">再抽出信紙，核對一次</button><button id="putback" class="quiet">放回原處</button>');$('letter-again').onclick=extractLetter;$('putback').onclick=closeDialog;
}
function inspectLion(){
 if(state.clues.includes('lion')){note('lion');return;}
 showDialog('<h2>一塵不染的小獅子</h2>'+clueImage('lion-base-v27','獅像底座旁露出的家務便箋','look-under','靠近看清便箋')+'<p>獅像的鬃毛被擦得光亮，沒有積灰。<br>'+(state.clues.includes('book')?'紙邊有幾道折痕，像是曾被人隨手夾在簿冊裡。':'一角紙露在底座外，燭光恰好照到上面的字。')+'你把燭光移近一點，俯身辨認紙上的字。</p><button id="look-under" class="primary">靠近閱讀便箋</button>');
 $('look-under').onclick=approachLionNote;
}
const ledgerEnglish={V:['East library','Return the key.','Close the window.','Extinguish the lamp.','Leave borrowed books on the desk.'],VI:['Music room','Extinguish the lamp.','Return the key.','Close the window.','Close the piano. Leave the score untouched.'],VII:['West rooms','Close the window.','Leave the lamp lit.','Return the key.','Fresh flowers daily. Leave a light for my late return.']};
function ledgerPaper(page){const e=ledgerEnglish[page];return '<div class="paper-ink"><small>THE NIGHT LEDGER</small><strong>'+page+'</strong><h3>'+e[0]+'</h3><p>'+e.slice(1,4).join('<br>')+'</p><em>'+e[4]+'</em></div>';}
function ledgerSurface(page,initial=page){return '<div id="ledger-stage" class="ledger-stage" data-page="'+page+'"><img class="ledger-ground" src="assets/'+(initial==='cover'?'ledger-cover-v25':ledgerAsset(initial))+'.webp" alt="宅邸記事簿第 '+page+' 頁"><canvas id="ledger-canvas" aria-label="宅邸記事簿第 '+page+' 頁的紙張與字跡"></canvas></div>';}
function bookMotion(from,to,closed=false){
 showDialog('<p class="eyebrow">THE NIGHT LEDGER</p><h2>'+(closed?'輕輕翻開宅邸記事簿':'翻到第 '+to+' 頁')+'</h2>'+ledgerSurface(to,closed?'cover':from||to)+'<p id="motion-copy">'+(closed?'你托著書脊，小心翻開皮革封面，循著編號找到值夜紀錄。':'紙角先輕輕抬起，再彎過書脊。你等薄薄的紙頁落定。')+'</p><button id="motion-read" class="primary" disabled>仔細讀一讀</button>');
 const epoch=beatEpoch;let completed=false;$('motion-read').disabled=true;
 const finish=()=>{if(epoch!==beatEpoch||!$('detail').open)return;$('motion-read').disabled=false;$('motion-copy').textContent='你讓燭光停在字跡上，讀下這一頁的值夜次序。';};
 $('motion-read').onclick=()=>{if(completed||epoch!==beatEpoch||!$('detail').open||$('motion-read').disabled)return;completed=true;openLedger(to,false)};
 mountLedger(to,from,closed,finish).then(handled=>{if(!handled&&epoch===beatEpoch)beatAfter(finish,reducedMotion()?0:2100/pace);});
}
function openBookMotion(){bookMotion(null,'V',true);}
function turnLedger(from,to){bookMotion(from,to);}
function openGuestNote(){readKeyNote();}
function note(id){
 const known=state.clues.includes(id);record(id);rememberLine(notes[id][0],notes[id][1]);
 const art=id==='letter'?'letter-open-v27':id==='lion'?'lion-base-v27':null;
 showDialog('<p class="eyebrow">A TRACE LEFT BEHIND</p><h2>'+notes[id][0]+'</h2>'+(art?clueImage(art,notes[id][0]):'')+(known?'<p class="hint-note">'+(id==='lion'?'剛才那隻一塵不染的獅子，仍守著同一張便箋。':'這個線索已經看過。你再核對一次。')+'</p>':'')+'<p>'+notes[id][1]+'</p><button class="primary" id="putback">'+(id==='lion'?'看清楚了，退開一點':art?'仔細放回原處':'收好手記')+'</button>');$('putback').onclick=closeDialog;
}
