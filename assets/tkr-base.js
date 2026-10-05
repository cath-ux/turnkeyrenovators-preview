(function(){
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,root=document.documentElement;
  if(!reduce)root.classList.add('mo');

  var head=document.querySelector('.site-head'),mb=document.querySelector('.menu-btn'),tt=document.querySelector('.to-top'),sd=document.querySelector('.side-tab');
  function onScroll(){var y=scrollY;head.classList.toggle('solid',y>40);if(tt)tt.classList.toggle('show',y>800);if(sd)sd.classList.toggle('show',y>800)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();
  mb.addEventListener('click',function(){var o=head.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  document.querySelectorAll('.nav .dt').forEach(function(b){b.addEventListener('click',function(){var li=b.parentNode,o=li.classList.toggle('open');b.setAttribute('aria-expanded',o)})});
  if(tt)tt.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'})});

  function split(el){var idx=0;el.innerHTML=el.innerHTML.replace(/(<[^>]+>)|([^<\s]+)/g,function(m,tag,word){if(tag)return tag;return '<span class="w"><span style="--w:'+(idx++)+'">'+word+'</span></span>'})}
  document.querySelectorAll('h2.split, .hsplit').forEach(split);

  /* reveals: clipped curtains are watched through their parent; a timer sweep backs up the observer */
  var targets=document.querySelectorAll('[data-rv], h2.split');
  if(reduce||!('IntersectionObserver' in window)){targets.forEach(function(e){e.classList.add('in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target._rv||[]).forEach(function(x){x.classList.add('in')});io.unobserve(e.target)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
    var proxies=[];
    targets.forEach(function(el){var p=el.getAttribute('data-rv')==='curtain'?el.parentElement:el;if(!p._rv){p._rv=[];io.observe(p);proxies.push(p)}p._rv.push(el)});
    var ticking=false;
    function sweep(){ticking=false;if(!proxies.length)return;var lim=innerHeight*.94;proxies=proxies.filter(function(p){if(p.getBoundingClientRect().top<lim){p._rv.forEach(function(x){x.classList.add('in')});io.unobserve(p);return false}return true})}
    addEventListener('scroll',function(){if(!ticking){ticking=true;setTimeout(sweep,50)}},{passive:true});
    addEventListener('load',sweep);setTimeout(sweep,300);
    var iv=setInterval(function(){try{sweep()}catch(e){ticking=false}if(!proxies.length)clearInterval(iv)},400);
  }

  /* count-up */
  if(!reduce&&'IntersectionObserver' in window){var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=e.target,t=+n.dataset.to,s0=null;
    function run(ts){if(!s0)s0=ts;var p=Math.min((ts-s0)/1600,1),v=p===1?1:1-Math.pow(2,-10*p);n.textContent=Math.round(v*t).toLocaleString('en-US');if(p<1)requestAnimationFrame(run)}
    n.textContent='0';requestAnimationFrame(run);cio.unobserve(n)})},{threshold:.5});document.querySelectorAll('.cnt').forEach(function(n){cio.observe(n)})}

  /* sticky subnav scroll spy with sliding indicator */
  var sn=document.querySelector('.subnav');
  if(sn){var links=[].slice.call(sn.querySelectorAll('ul a')),ind=sn.querySelector('.ind'),ul=sn.querySelector('ul');
    function mark(a){links.forEach(function(l){l.classList.toggle('on',l===a)});if(a&&ind){ind.style.left=a.offsetLeft+'px';ind.style.width=a.offsetWidth+'px';if(ul.scrollWidth>ul.clientWidth)ul.scrollTo({left:a.offsetLeft-40,behavior:'smooth'})}}
    var spyT=false;function spy(){spyT=false;var cur=null;links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s&&s.getBoundingClientRect().top<180)cur=a});mark(cur||links[0])}
    addEventListener('scroll',function(){if(!spyT){spyT=true;setTimeout(spy,60)}},{passive:true});addEventListener('resize',spy);spy()}

  /* tabs (role=tablist) */
  document.querySelectorAll('[role="tablist"]').forEach(function(tl){var tabs=[].slice.call(tl.querySelectorAll('[role="tab"]'));
    function sel(i,f){tabs.forEach(function(t,j){var on=j===i;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;var p=document.getElementById(t.getAttribute('aria-controls'));if(p){p.hidden=!on;if(on&&!reduce){p.classList.remove('swap');void p.offsetWidth;p.classList.add('swap')}}});if(f)tabs[i].focus()}
    tabs.forEach(function(t,i){t.addEventListener('click',function(){sel(i)});t.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();sel((i+1)%tabs.length,1)}if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();sel((i-1+tabs.length)%tabs.length,1)}})})});

  /* faq topic filter */
  var tb=document.querySelectorAll('.topics button');
  tb.forEach(function(b){b.addEventListener('click',function(){var t=b.dataset.topic;tb.forEach(function(x){x.setAttribute('aria-pressed',x===b)});document.querySelectorAll('.qa details').forEach(function(d){d.hidden=!(t==='all'||d.dataset.topic===t)})})});

  /* city switcher */
  var cs=document.querySelector('.cityswitch select');
  if(cs)document.querySelector('.cityswitch').addEventListener('submit',function(e){e.preventDefault();if(cs.value)location.href=cs.value});

  /* closing video band plays only in view */
  var fv=document.querySelector('.fv');
  if(fv&&!reduce&&'IntersectionObserver' in window){var fio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fv.preload='auto';var q=fv.play();if(q&&q.catch)q.catch(function(){})}else fv.pause()})},{threshold:.2});fio.observe(fv)}
})();
