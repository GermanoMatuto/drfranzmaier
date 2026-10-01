(() => {
  const carousel = document.querySelector('.treatment-showcase');
  if (!carousel) return;
  const cards = [...carousel.querySelectorAll('.treatment-card')];
  const dots = [...carousel.querySelectorAll('[data-treatment-dot]')];
  const pause = carousel.querySelector('.treatment-pause');
  const keys = ['ondas', 'magneto', 'ultrassom'];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let suppressClickUntil = 0;
  let active = 0, elapsed = 0, last = 0, frame = 0, visible = false;
  let paused = reduced.matches, hovered = false, focused = false, lock = 0;
  const duration = 6500;
  function show(index, announce = false, animate = true) {
    index = (index + cards.length) % cards.length;
    const before = cards.map(card => card.getBoundingClientRect());
    cards.forEach(card => card.getAnimations().forEach(animation => animation.cancel()));
    active = index;
    elapsed = 0;
    lock = performance.now() + 650;
    cards.forEach((card, i) => {
      card.style.order = i === active ? 1 : i === (active + 2) % 3 ? 0 : 2;
      card.classList.toggle('is-featured', i === active);
      card.querySelector('button').setAttribute('aria-pressed', String(i === active));
    });
    const after = cards.map(card => card.getBoundingClientRect());
    if (animate && !reduced.matches) cards.forEach((card, i) => {
      const a = before[i], b = after[i];
      card.animate([{transform:`translate(${a.left-b.left}px,${a.top-b.top}px) scale(${a.width/b.width},${a.height/b.height})`},{transform:'none'}],{duration:550,easing:'cubic-bezier(.22,1,.36,1)'});
    });
    dots.forEach((dot, i) => {
      dot.setAttribute('aria-current', String(i === active));
      dot.style.setProperty('--progress', '0');
    });
    const data = techs[keys[active]];
    carousel.querySelector('#treatment-description').textContent = data.description;
    carousel.querySelector('#treatment-source').href = '/procedimentos/' + data.link + '.html';
    if (announce) carousel.querySelector('.treatment-status').textContent = data.title;
  }
  function canPlay() { return visible && !paused && !hovered && !focused && !document.hidden; }
  function tick(time) {
    frame = 0;
    if (!canPlay()) { last = 0; return; }
    elapsed += last ? Math.min(time-last,100) : 0;
    last = time;
    if (elapsed >= duration) show(active+1);
    dots[active].style.setProperty('--progress', String(elapsed/duration));
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    if (!canPlay()) { cancelAnimationFrame(frame); frame = 0; last = 0; }
    else if (!frame) frame = requestAnimationFrame(tick);
  }
  function pauseLabel() {
    pause.setAttribute('aria-label', paused ? 'Iniciar apresentação automática' : 'Pausar apresentação automática');
    pause.firstElementChild.textContent = paused ? '▶' : 'Ⅱ';
  }
  pause.addEventListener('click', () => { paused = !paused; pauseLabel(); sync(); });
  dots.forEach((dot,i) => dot.addEventListener('click', () => show(i,true)));
  cards.forEach((card,i) => {
    card.querySelector('button').addEventListener('click', () => { if(performance.now()>suppressClickUntil)show(i,true); });
    card.addEventListener('pointerenter',event => {
      if(event.pointerType === 'mouse' && i !== active && performance.now() > lock && !focused) show(i,true);
    });
  });
  carousel.addEventListener('keydown',event => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 2 : (active+(event.key==='ArrowRight'?1:2))%3;
    show(next,true); dots[next].focus();
  });
  carousel.addEventListener('pointerenter',event => { if(event.pointerType==='mouse'){hovered=true;sync();} });
  carousel.addEventListener('pointerleave',()=>{hovered=false;sync();});
  carousel.addEventListener('focusin',()=>{focused=true;sync();});
  carousel.addEventListener('focusout',event=>{focused=carousel.contains(event.relatedTarget);sync();});
  let start = null;
  const viewport = carousel.querySelector('.treatment-viewport');
  viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='touch')start={x:event.clientX,y:event.clientY};});
  viewport.addEventListener('pointerup',event=>{
    if(start){const dx=event.clientX-start.x,dy=event.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){suppressClickUntil=performance.now()+400;show(active+(dx<0?1:2),true);}start=null;}
  });
  viewport.addEventListener('pointercancel',()=>start=null);
  document.addEventListener('visibilitychange',sync);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.25}).observe(carousel);
  reduced.addEventListener('change',()=>{if(reduced.matches){paused=true;cards.forEach(card=>card.getAnimations().forEach(a=>a.cancel()));}pauseLabel();sync();});
  show(0,false,false); pauseLabel();
})();
