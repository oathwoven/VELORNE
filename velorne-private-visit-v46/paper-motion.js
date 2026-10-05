'use strict';
// Photographic paper textures are warped in narrow strips, so ink bends with the page.
function paperTriangle(g,img,src,dst){
 const [a,b,c]=src,[p,q,r]=dst,det=a.x*(b.y-c.y)+b.x*(c.y-a.y)+c.x*(a.y-b.y);if(Math.abs(det)<.001)return;
 const coef=(v)=>[(v[0]*(b.y-c.y)+v[1]*(c.y-a.y)+v[2]*(a.y-b.y))/det,(v[0]*(c.x-b.x)+v[1]*(a.x-c.x)+v[2]*(b.x-a.x))/det,(v[0]*(b.x*c.y-c.x*b.y)+v[1]*(c.x*a.y-a.x*c.y)+v[2]*(a.x*b.y-b.x*a.y))/det];
 const x=coef([p.x,q.x,r.x]),y=coef([p.y,q.y,r.y]);g.save();const cx=(p.x+q.x+r.x)/3,cy=(p.y+q.y+r.y)/3;const edge=v=>{const dx=v.x-cx,dy=v.y-cy,len=Math.hypot(dx,dy)||1;return{x:v.x+dx/len*.55,y:v.y+dy/len*.55}};const pp=edge(p),qq=edge(q),rr=edge(r);g.beginPath();g.moveTo(pp.x,pp.y);g.lineTo(qq.x,qq.y);g.lineTo(rr.x,rr.y);g.closePath();g.clip();g.transform(x[0],y[0],x[1],y[1],x[2],y[2]);g.drawImage(img,0,0);g.restore();
}
function paperQuad(g,img,s,d){paperTriangle(g,img,[s[0],s[1],s[2]],[d[0],d[1],d[2]]);paperTriangle(g,img,[s[0],s[2],s[3]],[d[0],d[2],d[3]]);}
const paperCorners=[{x:873,y:131},{x:1380,y:87},{x:1460,y:784},{x:897,y:814}];
function makePaperTexture(photo,page){
 const c=document.createElement('canvas');c.width=600;c.height=760;const g=c.getContext('2d');
 const src=paperCorners.map(p=>({x:p.x/1672*photo.width,y:p.y/941*photo.height}));paperQuad(g,photo,src,[{x:0,y:0},{x:600,y:0},{x:600,y:760},{x:0,y:760}]);
 if(page){
 const e=ledgerEnglish[page];g.fillStyle='#3f3020';g.textAlign='left';g.font='32px VelorneHand, cursive';g.fillText('Night watch — '+page,62,81);g.font='38px VelorneHand, cursive';g.fillText(e[0],61,138);
 const lines=[...e.slice(1,4),'',...e[4].match(/.{1,34}(?:\s|$)/g)||[e[4]],'', 'Checked after the evening bell.', 'No reply from the west rooms.', 'Keep the passage clear.', 'Leave this ledger on the desk.', '', 'Noted for the next watch.'];
 lines.forEach((line,i)=>{g.save();g.translate(62+(i%3)*3,204+i*37);g.rotate(Math.sin(i*2)*.008);g.globalAlpha=.82+(i%3)*.05;g.font=(i<3?'34':'29')+'px VelorneHand, cursive';g.fillText(line.trim(),0,0,478);g.restore();});
 }

 return c;
}
function paintLedgerFrame(g,photo,under,leaf,blank,t,page='V'){
 g.clearRect(0,0,1672,941);g.drawImage(photo,0,0,1672,941);paintLedgerLeft(g,blank,page);const rect=[{x:0,y:0},{x:600,y:0},{x:600,y:760},{x:0,y:760}];paperQuad(g,under,rect,paperCorners);
 if(!leaf||t>=1)return;
 const n=36,points=[];let x=0,z=0;const smooth=t*t*(3-2*t),curl=Math.sin(Math.PI*t)*.95;
 for(let i=0;i<=n;i++){const u=i/n;if(i){const mid=(i-.5)/n,angle=Math.PI*smooth+curl*(mid-.35);x+=Math.cos(angle)/n;z+=Math.sin(angle)/n;}const factor=1/(1-z*.12);const point=v=>{const sx=873+24*v,sy=131+683*v,ex=507+56*v,ey=-44+14*v;return{x:sx+x*ex*factor,y:sy+x*ey-z*40+(v-.5)*683*(factor-1)}};points.push({a:point(0),b:point(1),u});}
 g.save();g.globalAlpha=Math.min(1,(1-t)/.12);
 for(let i=0;i<n;i++){const a=points[i],b=points[i+1],angle=Math.PI*smooth+curl*((i+.5)/n-.35),back=Math.cos(angle)<0;const src=[{x:a.u*600,y:0},{x:b.u*600,y:0},{x:b.u*600,y:760},{x:a.u*600,y:760}],dst=[a.a,b.a,b.b,a.b];paperQuad(g,back?blank:leaf,src,dst);g.save();g.beginPath();g.moveTo(dst[0].x,dst[0].y);dst.slice(1).forEach(p=>g.lineTo(p.x,p.y));g.closePath();g.fillStyle='rgba(35,20,8,'+(Math.abs(Math.sin(angle))*.16)+')';g.fill();g.restore();}
 g.restore();
}
const paperPhotoCache={};
function loadPaperPhoto(src){if(!paperPhotoCache[src])paperPhotoCache[src]=new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=src;});return paperPhotoCache[src];}
async function mountLedger(page,previous=null,closed=false,onDone=()=>{}){
 const panel=$('ledger-stage'),canvas=$('ledger-canvas');if(!canvas||typeof canvas.getContext!=='function')return false;
 const epoch=beatEpoch,alive=()=>panel.isConnected&&$('detail').open&&epoch===beatEpoch;
 try{const photo=await loadPaperPhoto('assets/ledger-blank-v29.webp');if(document.fonts)await document.fonts.load('32px VelorneHand');if(!alive())return true;
 canvas.width=1672;canvas.height=941;const g=canvas.getContext('2d');if(!g)return false;
 const under=makePaperTexture(photo,page),blank=makePaperTexture(photo,null),leaf=previous?makePaperTexture(photo,previous):null;
 if(!previous&&!closed){paintLedgerFrame(g,photo,under,null,blank,1,page);panel.classList.add('canvas-ready');return true;}
 let cover=null;if(closed){cover=await loadPaperPhoto('assets/ledger-cover-v25.webp');if(!alive())return true;}
 if(cover)g.drawImage(cover,0,0,1672,941);else paintLedgerFrame(g,photo,under,leaf,blank,0,previous||page);panel.classList.add('canvas-ready');
 sfx(closed?'book-open':'book');const duration=reducedMotion()?0:(closed?1650:2050)/pace;let start=null;
 function frame(now){if(!alive())return;if(start===null)start=now;const t=duration?Math.min(1,(now-start)/duration):1;
 paintLedgerFrame(g,photo,under,leaf,blank,t,t<.5?(previous||page):page);
 if(cover&&t<1){const reveal=Math.max(0,Math.min(1,(t-.12)/.78));g.save();g.globalAlpha=1-reveal*reveal*(3-2*reveal);g.drawImage(cover,0,0,1672,941);g.restore();}
 if(t<1)requestAnimationFrame(frame);else onDone();}
 requestAnimationFrame(frame);return true;
 }catch{if(alive()){panel.classList.add('image-fallback');onDone();}return true;}
}

// A complete paper surface, including the area originally hidden by its holder.
// Keep the table and envelope on stationary layers; never move a photo crop.
async function prepareCluePaper(canvas,kind){
 if(!canvas||typeof canvas.getContext!=='function')return false;
 const photo=await loadPaperPhoto('assets/ledger-blank-v29.webp');
 const texture=makePaperTexture(photo,null),ink=texture.getContext('2d');

 ink.fillStyle='#342719';ink.textAlign='center';ink.font='italic 55px Georgia';
 const letter=kind==='letter-pull';
 const lines=letter?['The room is still kept.']:['West wing','Flowers daily.','Keep the window closed.','Leave the lamp lit.'];
 if(!letter)lines.forEach((line,i)=>ink.fillText(line,300,letter?190:245+i*100,530));
 canvas.width=1672;canvas.height=941;const g=canvas.getContext('2d');
 const quad=letter?[[379,280],[1191,161],[1350,645],[431,774]]:[[830,418],[1436,387],[1558,796],[705,845]];
 g.clearRect(0,0,1672,941);g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=8;g.shadowOffsetY=5;
 paperQuad(g,texture,[{x:0,y:0},{x:600,y:0},{x:600,y:760},{x:0,y:760}],quad.map(([x,y])=>({x,y})));
 if(letter){
  const original=await loadPaperPhoto('assets/letter-sheet-v34.png');const sheet=document.createElement('canvas');sheet.width=original.width;sheet.height=original.height;const tone=sheet.getContext('2d');tone.drawImage(original,0,0);tone.globalCompositeOperation='multiply';tone.fillStyle='#d8bb91';tone.fillRect(0,0,sheet.width,sheet.height);g.clearRect(0,0,1672,941);g.shadowColor='rgba(0,0,0,.28)';
  paperQuad(g,sheet,[{x:60,y:62},{x:1480,y:62},{x:1480,y:970},{x:60,y:970}],quad.map(([x,y])=>({x,y})));
 }

 return true;
}

const ledgerLeftCache=new WeakMap();
const ledgerLeftNotes={
 V:['Library — loose notes','','The blue volume is still upstairs.','Do not mend the folded corner.','I have not finished that chapter.','','Move the reading chair back','beside the eastern window.','','The small atlas may stay open.','There is a name I must check.','','Ask about the missing plate—','','The rest can wait until morning.'],
 VI:['Music room — after supper','','The last phrase is too hurried.','Leave the score at this measure.','I shall try it again tonight.','','One candle on the piano is enough.','Keep the other beside the chair.','','The left pedal needs attention.','No tuning while I am working.','','A quieter ending, perhaps...','','The ink here has been rubbed away.'],
 VII:['West rooms — reminders','','Fresh flowers, as usual.','No lilies beside the writing desk.','Their scent lingers on the paper.','','Leave the lamp for my late return.','The curtains need not be drawn.','','The dark coat is still downstairs.','Have the torn lining attended to.','','The letter on my desk is unfinished.','I shall send it when—','']
};
function paintLedgerLeft(g,blank,page='V'){
 let pages=ledgerLeftCache.get(blank);if(!pages){pages={};ledgerLeftCache.set(blank,pages);}let sheet=pages[page];if(!sheet){sheet=document.createElement('canvas');sheet.width=600;sheet.height=760;const pen=sheet.getContext('2d');pen.fillStyle='#54432f';pen.font='30px VelorneHand, cursive';
 const lines=ledgerLeftNotes[page]||ledgerLeftNotes.V;
 lines.forEach((line,i)=>{pen.save();pen.translate(59+(i%3)*3,92+i*40);pen.rotate(Math.sin(i)*.008);pen.globalAlpha=.76;pen.fillText(line,0,0,475);pen.restore();});
 pages[page]=sheet;}
 paperQuad(g,sheet,[{x:0,y:0},{x:600,y:0},{x:600,y:760},{x:0,y:760}],[{x:354,y:164},{x:862,y:133},{x:887,y:813},{x:301,y:852}]);
}
