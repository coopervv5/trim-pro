/* Trim-Pro shared scripts: before/after sliders (auto-moving), copy buttons,
   brand logo fallback, work carousel and review carousel. Cached across all pages. */
(function(){
  'use strict';
  var reduceMotion=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $$=function(sel,root){return [].slice.call((root||document).querySelectorAll(sel))};

  /* ---------- Before/after sliders ---------- */
  var CENTER=50,AMP=36,PERIOD=9000,RESUME_AFTER=5000;
  var sliders=$$('[data-ba]');
  var io='IntersectionObserver' in window?new IntersectionObserver(function(entries){
    entries.forEach(function(e){var c=e.target._ba;if(!c)return;c.visible=e.isIntersecting;c.update()});
  },{threshold:.35}):null;

  sliders.forEach(function(ba,idx){
    var h=ba.querySelector('.ba-handle');
    var c={visible:!io,held:false,timer:0,raf:0,last:0,pos:50,phase:(idx%2)*Math.PI,started:false};
    ba._ba=c;
    function paint(p,aria){
      c.pos=Math.max(0,Math.min(100,p));
      ba.style.setProperty('--pos',c.pos+'%');
      if(aria)h.setAttribute('aria-valuenow',Math.round(c.pos));
    }
    function tick(ts){
      if(!c.raf)return;
      var dt=Math.min(64,ts-c.last);c.last=ts;
      c.phase+=dt/PERIOD*Math.PI*2;
      paint(CENTER+AMP*Math.sin(c.phase),false);
      c.raf=requestAnimationFrame(tick);
    }
    function play(){
      if(c.raf||reduceMotion)return;
      if(c.started){ /* continue smoothly from wherever the visitor left it */
        var x=Math.max(-1,Math.min(1,(c.pos-CENTER)/AMP));
        c.phase=x>0.6?Math.PI-Math.asin(x):Math.asin(x);
      }
      c.started=true;c.last=performance.now();
      c.raf=requestAnimationFrame(tick);
    }
    function stop(){if(c.raf){cancelAnimationFrame(c.raf);c.raf=0}}
    c.update=function(){
      if(c.visible&&!c.held&&!document.hidden)play();else stop();
    };
    function hold(){c.held=true;clearTimeout(c.timer);stop();h.setAttribute('aria-valuenow',Math.round(c.pos))}
    function release(ms){clearTimeout(c.timer);c.timer=setTimeout(function(){c.held=false;c.update()},ms)}
    function at(e){var r=ba.getBoundingClientRect();paint((e.clientX-r.left)/r.width*100,true)}
    var drag=false;
    ba.addEventListener('pointerdown',function(e){drag=true;hold();try{ba.setPointerCapture(e.pointerId)}catch(x){}at(e)});
    ba.addEventListener('pointermove',function(e){if(drag)at(e)});
    function end(){if(drag){drag=false;release(RESUME_AFTER)}}
    ba.addEventListener('pointerup',end);ba.addEventListener('pointercancel',end);
    ba.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hold()}});
    ba.addEventListener('pointerleave',function(e){if(e.pointerType==='mouse'&&!drag)release(1500)});
    h.addEventListener('focus',function(){hold()});
    h.addEventListener('blur',function(){release(RESUME_AFTER)});
    h.addEventListener('keydown',function(e){
      var k=e.key,p=c.pos;
      if(k==='ArrowLeft'||k==='ArrowDown')p-=5;
      else if(k==='ArrowRight'||k==='ArrowUp')p+=5;
      else if(k==='Home')p=0;else if(k==='End')p=100;else return;
      hold();paint(p,true);e.preventDefault();
    });
    paint(50,true);
    if(io)io.observe(ba);else c.update();
  });
  document.addEventListener('visibilitychange',function(){sliders.forEach(function(b){b._ba&&b._ba.update()})});

  /* ---------- Copy buttons ---------- */
  function sel(b){
    var el=b.previousElementSibling,r=document.createRange();r.selectNodeContents(el);
    var s=window.getSelection();s.removeAllRanges();s.addRange(r);
  }
  $$('.copy').forEach(function(b){
    b.addEventListener('click',function(){
      var t=b.getAttribute('data-copy'),old=b.textContent;
      function done(){b.textContent='Copied';setTimeout(function(){b.textContent=old},1400)}
      try{navigator.clipboard.writeText(t).then(done,function(){sel(b)})}catch(e){sel(b)}
    });
  });

  /* ---------- Brand logo fallback ---------- */
  $$('.logo img').forEach(function(i){
    function ok(){i.parentNode.classList.add('has-img')}
    function bad(){i.remove()}
    if(i.complete){if(i.naturalWidth>0)ok();else bad()}else{i.addEventListener('load',ok);i.addEventListener('error',bad)}
  });

  /* ---------- Work carousel (home) ---------- */
  var track=document.getElementById('car-track');
  if(track){
    var step=function(d){track.scrollBy({left:d*Math.max(280,track.clientWidth*.8),behavior:reduceMotion?'auto':'smooth'})};
    document.getElementById('car-prev').addEventListener('click',function(){step(-1)});
    document.getElementById('car-next').addEventListener('click',function(){step(1)});
  }

  /* ---------- Review carousel (home) ---------- */
  var box=document.getElementById('rvc');
  if(box){
    var cs=[].slice.call(box.children),n=cs.length,dots=document.getElementById('rv-dots'),cur=0,sx=null,moved=false;
    var ds=cs.map(function(_,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Show review '+(i+1));b.addEventListener('click',function(){go(i)});dots.appendChild(b);return b});
    var rstep=function(){return Math.min(600,box.clientWidth*.78)};
    var render=function(){
      var st=rstep();
      cs.forEach(function(c,i){
        var d=((i-cur+n+n/2)%n+n)%n-n/2; if(d===-n/2&&n%2===0)d=n/2;
        var a=Math.abs(d),on=d===0;
        c.classList.toggle('on',on);
        c.style.transform='translateX('+(d*st)+'px) scale('+(on?1:.8)+')';
        c.style.opacity=on?1:(a===1?.32:0);
        c.style.pointerEvents=a<=1?'auto':'none';
        c.style.zIndex=10-a;
        c.setAttribute('aria-hidden',on?'false':'true');
        var l=c.querySelector('a');if(l)l.tabIndex=on?0:-1;
      });
      ds.forEach(function(b,i){b.classList.toggle('on',i===cur);if(i===cur)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current')});
    };
    var size=function(){var h=0;cs.forEach(function(c){h=Math.max(h,c.offsetHeight)});box.style.height=(h+6)+'px'};
    var go=function(i){cur=((i%n)+n)%n;render()};
    document.getElementById('rv-prev').addEventListener('click',function(){go(cur-1)});
    document.getElementById('rv-next').addEventListener('click',function(){go(cur+1)});
    box.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){go(cur+1);e.preventDefault()}else if(e.key==='ArrowLeft'){go(cur-1);e.preventDefault()}});
    box.addEventListener('pointerdown',function(e){sx=e.clientX;moved=false});
    box.addEventListener('pointermove',function(e){if(sx!==null&&Math.abs(e.clientX-sx)>8)moved=true});
    box.addEventListener('pointerup',function(e){if(sx===null)return;var dx=e.clientX-sx;sx=null;if(Math.abs(dx)>45){go(cur+(dx<0?1:-1))}});
    box.addEventListener('pointercancel',function(){sx=null});
    cs.forEach(function(c,i){c.addEventListener('click',function(e){if(moved){e.preventDefault();return}if(i!==cur&&!e.target.closest('a'))go(i)})});
    window.addEventListener('resize',function(){size();render()});
    size();render();
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){size()});
  }
})();
