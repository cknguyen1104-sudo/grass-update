/* Browser-only presentation and input adapter. Unity assets and physics are untouched. */
(function(){
  'use strict';
  const app=document.querySelector('main'), canvas=document.getElementById('game'), stage=document.querySelector('.stage');
  const mobile=matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints>0 && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  if(mobile)app.classList.add('compact');
  const actions=document.createElement('div'); actions.className='actions';
  const make=(label,fn)=>{const b=document.createElement('button'); b.type='button';b.textContent=label;b.addEventListener('click',fn);return b;};
  const toggle=make('Menu',()=>app.classList.toggle('menu-open'));
  const touch=make('Touch controls',()=>{releaseAll(); pad.classList.toggle('enabled');touch.setAttribute('aria-pressed',String(pad.classList.contains('enabled')));fit();});
  const full=make('Full screen',async()=>{
    if(document.fullscreenElement||document.webkitFullscreenElement){try{await (document.exitFullscreen?.()||document.webkitExitFullscreen?.());}catch(e){} app.classList.remove('immersive');}
    else {app.classList.add('immersive'); const el=document.documentElement;try{if(el.requestFullscreen)await el.requestFullscreen();else if(el.webkitRequestFullscreen)el.webkitRequestFullscreen();}catch(e){/* iOS and restricted browsers retain viewport-filling mode. */} }
    fit();canvas.focus({preventScroll:true});
  });
  const show=make('Exit full screen / menu',async()=>{if(document.fullscreenElement||document.webkitFullscreenElement){try{await (document.exitFullscreen?.()||document.webkitExitFullscreen?.());}catch(e){}}app.classList.remove('immersive');fit();});show.id='show-menu';stage.append(show);
  if(mobile)actions.append(toggle);actions.append(touch,full);document.querySelector('header').append(actions);
  const note=document.createElement('span');note.className='mobile-note';note.textContent='Touch: alternate L / R';document.querySelector('header').prepend(note);
  const pad=document.createElement('div');pad.className='touch-pad';pad.setAttribute('aria-label','Running controls');app.append(pad);
  const pointers=new Map(), active=new Map();
  function dispatch(type,code,keyCode){
    const ev=new KeyboardEvent(type,{key:code,code,bubbles:true,cancelable:true,composed:true,repeat:false,keyCode,which:keyCode});
    for(const k of ['keyCode','which'])if(ev[k]!==keyCode)Object.defineProperty(ev,k,{get:()=>keyCode});
    canvas.dispatchEvent(ev);
  }
  function release(id){const item=pointers.get(id);if(!item)return;pointers.delete(id);const n=(active.get(item.code)||1)-1;if(n<=0){active.delete(item.code);item.button.classList.remove('held');dispatch('keyup',item.code,item.keyCode);}else active.set(item.code,n);}
  function releaseAll(){for(const id of [...pointers.keys()])release(id);}
  for(const [label,sub,code,keyCode] of [['◀ L','Left step','ArrowLeft',37],['↑ JUMP','Hurdle','ArrowUp',38],['R ▶','Right step','ArrowRight',39]]){
    const button=document.createElement('button');button.type='button';button.textContent=label;const small=document.createElement('small');small.textContent=sub;button.append(small);if(keyCode===38)button.classList.add('jump');button.setAttribute('aria-label',sub);button.disabled=true;pad.append(button);
    button.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(button.disabled||pointers.has(e.pointerId))return;canvas.focus({preventScroll:true});pointers.set(e.pointerId,{button,code,keyCode});try{button.setPointerCapture(e.pointerId);}catch(_){}const n=active.get(code)||0;active.set(code,n+1);button.classList.add('held');if(!n)dispatch('keydown',code,keyCode);});
    for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,e=>{e.preventDefault();e.stopPropagation();release(e.pointerId);});
    button.addEventListener('contextmenu',e=>e.preventDefault());
  }
  // Prevent the original Unity touch listener from interpreting the separate control strip as a menu tap.
  for(const type of ['touchstart','touchmove','touchend','touchcancel'])pad.addEventListener(type,e=>e.stopPropagation(),{passive:true});
  if(mobile)pad.classList.add('enabled');touch.setAttribute('aria-pressed',String(pad.classList.contains('enabled')));
  window.addEventListener('pointerup',e=>release(e.pointerId));window.addEventListener('pointercancel',e=>release(e.pointerId));window.addEventListener('blur',releaseAll);window.addEventListener('pagehide',releaseAll);document.addEventListener('visibilitychange',()=>{if(document.hidden)releaseAll();});
  function fit(){const w=stage.clientWidth,h=stage.clientHeight;if(!w||!h)return;const width=Math.floor(Math.min(w,h*16/9));canvas.style.width=width+'px';canvas.style.height=Math.floor(width*9/16)+'px';}
  new ResizeObserver(fit).observe(stage);window.addEventListener('resize',fit);window.visualViewport?.addEventListener('resize',fit);document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)app.classList.remove('immersive');fit();});document.addEventListener('webkitfullscreenchange',fit);fit();
  // Preserve desktop rendering behavior. Mobile avoids expensive 2x/3x backing buffers; no FPS/timing changes.
  window.ssMobile={config:mobile?{devicePixelRatio:1}:{},ready(){for(const b of pad.querySelectorAll('button'))b.disabled=false;document.getElementById('status').classList.add('ready');fit();}};
})();
