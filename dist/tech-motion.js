(() => {
  const section = document.querySelector('#tecnologia');
  if (!section) return;
  const feature = section.querySelector('.tech-feature');
  const track = document.createElement('div');
  track.className = 'tech-story';
  feature.before(track); track.append(feature);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 900px) and (min-height: 680px)');
  const imageBox = feature.querySelector('.tech-image');
  const original = feature.querySelector('#tech-photo');
  const keys = ['ondas', 'magneto', 'ultrassom'];
  const pictures = keys.map((key, i) => {
    const img = i === 0 ? original : original.cloneNode();
    img.removeAttribute('id'); img.src = '/assets/' + key + '.webp'; img.srcset = '/assets/' + key + '-600.webp 600w, /assets/' + key + '.webp 1000w'; img.sizes = '(max-width: 899px) 90vw, 48vw';
    img.alt = techs[key].alt; img.loading = 'eager';
    img.className = 'tech-frame' + (i === 0 ? ' active' : '');
    img.setAttribute('aria-hidden', String(i !== 0));
    if (i) imageBox.append(img);
    return img;
  });
  const panel = feature.querySelector('#tech-panel');
  const controls = [...feature.querySelectorAll('[data-tech]')].map(button => {
    const fresh = button.cloneNode(true); button.replaceWith(fresh); return fresh;
  });
  const progress = document.createElement('div');
  progress.className = 'tech-progress'; progress.setAttribute('aria-hidden','true');
  progress.innerHTML = '<span></span>';
  feature.querySelector('.tech-picker').after(progress);
  const hint = document.createElement('p'); hint.className = 'tech-scroll-hint';
  hint.textContent = 'Role para explorar as tecnologias ↓'; track.append(hint);
  let active = 0, framePending = false;
  function pinned() { return desktop.matches && !reduced.matches && !track.classList.contains('content-tall'); }
  function show(index) {
    if (active === index) return;
    const direction = index > active ? 1 : -1;
    active = index;
    const data = techs[keys[index]];
    pictures.forEach((img, i) => {
      img.classList.toggle('active', i === index);
      img.setAttribute('aria-hidden', String(i !== index));
    });
    controls.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index)); button.tabIndex = i === index ? 0 : -1;
    });
    panel.querySelector('#tech-title').textContent = data.title;
    panel.querySelector('#tech-description').textContent = data.description;
    panel.querySelector('#tech-counter').textContent = '0' + (index + 1) + ' / 03';
    panel.querySelector('#tech-source').href = '/procedimentos/' + data.link + '.html';
    panel.setAttribute('aria-labelledby', controls[index].id);
    if (!reduced.matches) {
      panel.getAnimations().forEach(animation => animation.cancel());
      panel.animate([{opacity:0,transform:`translateY(${direction*22}px)`},{opacity:1,transform:'translateY(0)'}],
        {duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
    }
    progress.style.setProperty('--progress', (index + 1) / 3);
  }
  function update() {
    framePending = false;
    if (!pinned()) return;
    const rect = track.getBoundingClientRect();
    const distance = track.offsetHeight - feature.offsetHeight;
    const amount = Math.max(0,Math.min(1,(92 - rect.top) / distance));
    show(Math.min(2, Math.floor(amount * 3)));
    progress.style.setProperty('--progress', amount);
    feature.style.setProperty('--photo-scale', 1.045 - (amount * 3 % 1) * .045);
  }
  function schedule() { if (!framePending) { framePending = true; requestAnimationFrame(update); } }
  function choose(index) {
    if (pinned()) {
      const start = scrollY + track.getBoundingClientRect().top - 92;
      const distance = track.offsetHeight - feature.offsetHeight;
      window.scrollTo({top:start + distance * ((index + .15) / 3),behavior:'smooth'});
    } else show(index);
  }
  controls.forEach((button,index) => {
    button.addEventListener('click', () => choose(index));
    button.addEventListener('keydown', event => {
      let next;
      if(event.key==='ArrowRight') next=(index+1)%3;
      else if(event.key==='ArrowLeft') next=(index+2)%3;
      else if(event.key==='Home') next=0;
      else if(event.key==='End') next=2;
      else return;
      event.preventDefault(); controls[next].focus(); choose(next);
    });
  });
  function measure() {
    track.classList.remove('content-tall');
    track.classList.toggle('is-pinned',desktop.matches && !reduced.matches);
    if (desktop.matches && feature.querySelector('.tech-content').scrollHeight > innerHeight - 150) {
      track.classList.add('content-tall'); track.classList.remove('is-pinned');
    }
    if (!pinned()) { feature.style.setProperty('--photo-scale',1); progress.style.setProperty('--progress',(active+1)/3); }
    schedule();
  }
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',measure); reduced.addEventListener('change',measure);
  measure();
})();
