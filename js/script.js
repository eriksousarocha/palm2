/* ==============================================================
   PALM — Projetos de Alto Padrão
   Script principal do site (landing page)
   ============================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Porta: alinhamento pixel-perfect sobre o SVG (modo "slice"/cover) ---------- */
  const doorHero = document.getElementById('door-hero');
  const doorFrame = document.getElementById('door-frame');
  const doorCta = document.getElementById('door-cta');
  const body = document.body;
  const heroSvg = doorFrame.querySelector('svg');
  const leafWrap = document.getElementById('door-leaf-wrap');
  const glowL = document.querySelector('.sconce-glow.l');
  const glowR = document.querySelector('.sconce-glow.r');

  function svgPointToScreen(x, y) {
    const pt = heroSvg.createSVGPoint();
    pt.x = x; pt.y = y;
    return pt.matrixTransform(heroSvg.getScreenCTM());
  }

  function positionDoorOverlay() {
    const vao = document.getElementById('vao-porta');
    const heroBox = doorFrame.getBoundingClientRect();
    const x = parseFloat(vao.getAttribute('x'));
    const y = parseFloat(vao.getAttribute('y'));
    const w = parseFloat(vao.getAttribute('width'));
    const h = parseFloat(vao.getAttribute('height'));
    const p1 = svgPointToScreen(x, y);
    const p2 = svgPointToScreen(x + w, y + h);

    leafWrap.style.left = (p1.x - heroBox.left) + 'px';
    leafWrap.style.top = (p1.y - heroBox.top) + 'px';
    leafWrap.style.width = (p2.x - p1.x) + 'px';
    leafWrap.style.height = (p2.y - p1.y) + 'px';
    leafWrap.classList.add('ready');

    [['lanterna-esq', glowL], ['lanterna-dir', glowR]].forEach(([id, el]) => {
      const rect = document.getElementById(id);
      const cx = parseFloat(rect.getAttribute('x')) + parseFloat(rect.getAttribute('width')) / 2;
      const cy = parseFloat(rect.getAttribute('y')) + parseFloat(rect.getAttribute('height')) / 2;
      const p = svgPointToScreen(cx, cy);
      el.style.left = (p.x - heroBox.left) + 'px';
      el.style.top = (p.y - heroBox.top) + 'px';
      el.classList.add('ready');
    });
  }

  function updateFacadeFit() {
    // telas largas: mantém o enquadramento "fechado" original (corta o excesso, como projetado)
    // telas estreitas: mostra a fachada inteira, sem cortar nada, mesmo que fique menor
    if (window.innerWidth <= 640) {
      heroSvg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    } else {
      heroSvg.setAttribute('preserveAspectRatio', 'xMidYMax slice');
    }
  }

  updateFacadeFit();
  positionDoorOverlay();
  window.addEventListener('load', positionDoorOverlay);
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      updateFacadeFit();
      positionDoorOverlay();
    }, 80);
  });

  function openDoor() {
    if (doorHero.classList.contains('opening')) return;
    doorHero.classList.add('opening');
    setTimeout(() => {
      doorHero.classList.add('hidden');
      body.classList.remove('locked');
    }, 650);
  }
  leafWrap.addEventListener('click', openDoor);
  doorCta.addEventListener('click', openDoor);

  /* ---------- Menu mobile ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

  /* ---------- Reveal on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---------- Formulário (front-end apenas) ---------- */
  const form = document.getElementById('form-contato');
  const formMsg = document.getElementById('form-msg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formMsg.textContent = 'Mensagem pronta para envio. Conecte este formulário a um serviço de e-mail para receber os contatos automaticamente.';
  });

  document.getElementById('ano').textContent = new Date().getFullYear();

  /* ---------- Lightbox do portfólio (estilo Instagram) ----------
     Cada item de PROJETOS_FOTOS corresponde, na ordem, a um
     ".projeto-card" com data-projeto="0", "1", "2"... no HTML.
     Para adicionar mais fotos a um projeto, é só incluir o caminho
     no array correspondente abaixo. Projetos sem fotos reais
     (ainda como placeholder) não precisam de entrada aqui.
  ------------------------------------------------------------- */
  const PROJETOS_FOTOS = [
    { // Projeto 01
      nome: '[ Nome do projeto ]',
      meta: '[ Categoria — ex. Residencial ] · [ Cidade ]',
      fotos: ['assets/projetos/projeto-01-1.jpg', 'assets/projetos/projeto-01-2.jpg']
    },
    { // Projeto 02
      nome: '[ Nome do projeto ]',
      meta: '[ Categoria — ex. Comercial ] · [ Cidade ]',
      fotos: ['assets/projetos/projeto-02-1.jpg', 'assets/projetos/projeto-02-2.jpg', 'assets/projetos/projeto-02-3.jpg']
    },
    { // Projeto 03
      nome: '[ Nome do projeto ]',
      meta: '[ Categoria — ex. Interiores ] · [ Cidade ]',
      fotos: ['assets/projetos/projeto-03-1.jpg', 'assets/projetos/projeto-03-2.jpg', 'assets/projetos/projeto-03-3.jpg', 'assets/projetos/projeto-03-4.jpg']
    }
  ];

  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbDots = document.getElementById('lightbox-dots');
  const lbNome = document.getElementById('lightbox-nome');
  const lbMeta = document.getElementById('lightbox-meta');
  const lbCount = document.getElementById('lightbox-count');
  const lbPrev = document.getElementById('lightbox-prev');
  const lbNext = document.getElementById('lightbox-next');

  let lbProjetoIndex = 0;
  let lbFotoIndex = 0;

  function lbRender() {
    const projeto = PROJETOS_FOTOS[lbProjetoIndex];
    if (!projeto) return;
    const total = projeto.fotos.length;

    lbImg.src = projeto.fotos[lbFotoIndex];
    lbImg.alt = projeto.nome + ' — foto ' + (lbFotoIndex + 1) + ' de ' + total;
    lbNome.textContent = projeto.nome;
    lbMeta.textContent = projeto.meta;
    lbCount.textContent = total > 1 ? (lbFotoIndex + 1) + ' / ' + total : '';

    lbPrev.disabled = lbFotoIndex === 0;
    lbNext.disabled = lbFotoIndex === total - 1;

    lbDots.innerHTML = '';
    if (total > 1) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('span');
        if (i === lbFotoIndex) dot.classList.add('active');
        lbDots.appendChild(dot);
      }
    }
  }

  function lbOpen(projetoIndex) {
    const projeto = PROJETOS_FOTOS[projetoIndex];
    if (!projeto) return; // projeto ainda sem fotos cadastradas
    lbProjetoIndex = projetoIndex;
    lbFotoIndex = 0;
    lbRender();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-locked');
  }

  function lbClose() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-locked');
  }

  function lbGo(delta) {
    const projeto = PROJETOS_FOTOS[lbProjetoIndex];
    const novoIndex = lbFotoIndex + delta;
    if (novoIndex < 0 || novoIndex >= projeto.fotos.length) return;
    lbFotoIndex = novoIndex;
    lbRender();
  }

  document.querySelectorAll('.projeto-card[data-projeto]').forEach(card => {
    card.addEventListener('click', () => {
      lbOpen(parseInt(card.dataset.projeto, 10));
    });
  });

  document.getElementById('lightbox-close').addEventListener('click', lbClose);
  document.getElementById('lightbox-backdrop').addEventListener('click', lbClose);
  lbPrev.addEventListener('click', () => lbGo(-1));
  lbNext.addEventListener('click', () => lbGo(1));

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') lbClose();
    if (e.key === 'ArrowLeft') lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });

  // deslizar (swipe) no mobile para trocar de foto
  let lbTouchStartX = null;
  const lbFrame = document.querySelector('.lightbox-frame');
  lbFrame.addEventListener('touchstart', (e) => {
    lbTouchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lbFrame.addEventListener('touchend', (e) => {
    if (lbTouchStartX === null) return;
    const dx = e.changedTouches[0].clientX - lbTouchStartX;
    if (Math.abs(dx) > 40) lbGo(dx > 0 ? -1 : 1);
    lbTouchStartX = null;
  }, { passive: true });

});