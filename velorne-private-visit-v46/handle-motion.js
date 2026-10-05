/* A tight lever envelope keeps every frame, molding and lock plate pixel fixed. */
const handleEnvelopes={
 urgent:{pivot:[.410,.409],outline:[[.176,.386],[.182,.361],[.196,.351],[.207,.355],[.223,.373],[.263,.379],[.325,.379],[.374,.376],[.395,.363],[.414,.37],[.423,.394],[.421,.425],[.406,.44],[.384,.444],[.342,.438],[.291,.444],[.251,.45],[.218,.46],[.197,.457],[.183,.441],[.176,.417]]},
 careful:{pivot:[.564,.423],outline:[[.261,.416],[.269,.394],[.288,.373],[.309,.369],[.329,.36],[.345,.38],[.397,.39],[.454,.395],[.504,.386],[.519,.387],[.525,.398],[.542,.405],[.56,.408],[.575,.419],[.57,.442],[.543,.446],[.525,.449],[.509,.45],[.454,.455],[.394,.459],[.347,.469],[.334,.49],[.317,.488],[.292,.481],[.278,.463],[.266,.447]]}
};
function handleWeights(w,h,mode){
 const polygon=handleEnvelopes[mode].outline.map(([x,y])=>[x*w,y*h]),weights=new Float32Array(w*h);
 const minX=Math.floor(Math.min(...polygon.map(p=>p[0]))),maxX=Math.ceil(Math.max(...polygon.map(p=>p[0]))),minY=Math.floor(Math.min(...polygon.map(p=>p[1]))),maxY=Math.ceil(Math.max(...polygon.map(p=>p[1])));
 for(let y=minY;y<=maxY;y++)for(let x=minX;x<=maxX;x++){
  let inside=false,distance=Infinity;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
   const [ax,ay]=polygon[i],[bx,by]=polygon[j];if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
   const dx=bx-ax,dy=by-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy)));
   distance=Math.min(distance,Math.hypot(x-ax-t*dx,y-ay-t*dy));
  }
  if(inside){const t=Math.min(1,distance/(w*.006));weights[y*w+x]=t*t*(3-2*t);}
 }
 return {weights,minX,maxX,minY,maxY};
}
function drawHandleFrame(base,out,w,h,mode,angle,mask){
 out.data.set(base.data);const [px,py]=handleEnvelopes[mode].pivot;
 for(let y=mask.minY;y<=mask.maxY;y++)for(let x=mask.minX;x<=mask.maxX;x++){
  const weight=mask.weights[y*w+x];if(!weight)continue;
  const sy=Math.max(0,Math.min(h-1,y-(x-w*px)*Math.tan(angle)*weight)),low=Math.floor(sy),high=Math.min(h-1,low+1),blend=sy-low;
  const i=(y*w+x)*4,j=(low*w+x)*4,k=(high*w+x)*4;
  for(let c=0;c<3;c++)out.data[i+c]=base.data[j+c]*(1-blend)+base.data[k+c]*blend;
 }
}
function animateDoorHandle(canvas,src,mode,active){
 const ctx=canvas?.getContext?.('2d'),urgent=mode==='urgent',duration=urgent?1050:1950;
 return new Promise(resolve=>{
 if(!ctx){setTimeout(()=>resolve(active()),duration);return;}
 const image=new Image();let settled=false;const finish=ok=>{if(!settled){settled=true;resolve(ok)}};
 const timeout=setTimeout(()=>finish(active()),duration+1800);
 image.onerror=()=>{clearTimeout(timeout);finish(active())};
 image.onload=()=>{if(settled||!active()){clearTimeout(timeout);finish(false);return;}const w=Math.min(1200,image.width),h=Math.round(w*image.height/image.width);canvas.width=w;canvas.height=h;ctx.drawImage(image,0,0,w,h);const base=ctx.getImageData(0,0,w,h),out=ctx.createImageData(w,h),mask=handleWeights(w,h,mode),start=performance.now();canvas.classList.add('ready');
 function tick(now){if(settled)return;if(!active()){clearTimeout(timeout);finish(false);return;}const t=Math.min(1,(now-start)/duration);let angle=0;
 if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){if(urgent)angle=Math.sin(t*Math.PI*8)*.032*Math.sin(Math.PI*t);else{const p=t<.55?t/.55:t<.72?1:(1-t)/.28;angle=-.036*(p*p*(3-2*p));}}
 drawHandleFrame(base,out,w,h,mode,angle,mask);ctx.putImageData(out,0,0);if(t<1)requestAnimationFrame(tick);else{clearTimeout(timeout);finish(true)}}requestAnimationFrame(tick);};image.src=src;
 });
}
