/* Cylindrical reprojection of the existing photograph: the stationary marble,
   engraved scale and lower plinth stay fixed while the upper assembly turns. */
function createCandleMotion(canvas,initialPosition){
 const ctx=canvas.getContext('2d');if(!ctx)return null;
 const source=new Image();let pixels,frame,w=836,h=470,position=initialPosition;
 canvas.width=w;canvas.height=h;
 const profile=[[0,.101],[.075,.107],[.105,.093],[.15,.090],[.20,.114],[.335,.139],[.391,.139]];
 function radius(y){for(let i=1;i<profile.length;i++){if(y<=profile[i][0]){const a=profile[i-1],b=profile[i];return(a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0]))*w}}return .139*w}
 function draw(pos){if(!pixels)return;frame.data.set(pixels.data);const dst=frame.data,src=pixels.data,angle=pos*14*Math.PI/180;
 // Erase the original moving pointer with adjacent unmarked brass texture.
 for(let y=Math.floor(h*.383);y<h*.451;y++)for(let x=Math.floor(w*.484);x<w*.514;x++){
 const i=(y*w+x)*4,j=(y*w+x+Math.round(w*.034))*4;for(let c=0;c<3;c++)dst[i+c]=src[j+c];}
 for(let y=0;y<h*.389;y++){const r=radius(y/h),left=Math.ceil(w*.5-r),right=Math.floor(w*.5+r);
 for(let x=left;x<=right;x++){const t=Math.asin(Math.max(-1,Math.min(1,(x-w*.5)/r)))-angle;
 const sx=Math.round(w*.5+Math.sin(Math.max(-Math.PI/2,Math.min(Math.PI/2,t)))*r),i=(y*w+x)*4,j=(y*w+sx)*4;
 for(let c=0;c<3;c++)dst[i+c]=src[j+c];}}
 ctx.putImageData(frame,0,0);
 const shift=Math.sin(angle)*w*.139,lift=(1-Math.cos(angle))*h*.045;
 ctx.save();ctx.translate(shift,-lift);ctx.beginPath();ctx.moveTo(w*.489,h*.382);ctx.lineTo(w*.51,h*.382);ctx.lineTo(w*.514,h*.395);ctx.lineTo(w*.5,h*.452);ctx.lineTo(w*.486,h*.398);ctx.closePath();ctx.clip();ctx.drawImage(source,0,0,w,h);ctx.restore();
 canvas.classList.add('ready');}
 source.onload=()=>{ctx.drawImage(source,0,0,w,h);pixels=ctx.getImageData(0,0,w,h);frame=ctx.createImageData(w,h);draw(position)};
 source.src='assets/clue-candle-v16.webp';
 return{turnTo(target){const from=position,reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced){position=target;draw(target);return Promise.resolve()}
 return new Promise(resolve=>{const start=performance.now(),duration=1100+Math.abs(target-from)*120;function tick(now){const t=Math.min(1,(now-start)/duration),ease=t*t*(3-2*t);position=from+(target-from)*ease;if(canvas.isConnected)draw(position);if(t<1&&canvas.isConnected)requestAnimationFrame(tick);else{position=target;resolve()}}requestAnimationFrame(tick)});}};
}
