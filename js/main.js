(function () {
  const store = window.PortfolioStore;
  const state = {
    data: store.loadData(),
    activeCategory: 'Todos'
  };

  let revealObserver;

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    bindStaticEvents();
    renderAll();
    setupRevealObserver();
    observeRevealElements();
    bindDataSyncEvents();
  }

  function bindDataSyncEvents() {
    window.addEventListener('storage', (event) => {
      if (event.key === store.STORAGE_KEY) {
        refreshData();
      }
    });

    window.addEventListener('portfolioDataUpdated', () => {
      refreshData();
    });

    window.addEventListener('focus', refreshData);
  }

  function refreshData() {
    state.data = store.loadData();
    renderAll();
    observeRevealElements();
  }

  function bindStaticEvents() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileLinks = document.getElementById('mobile-links');
    if (menuToggle && mobileLinks) {
      menuToggle.addEventListener('click', () => {
        mobileLinks.classList.toggle('hidden');
      });

      mobileLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => mobileLinks.classList.add('hidden'));
      });
    }

    const portfolioFilters = document.getElementById('portfolio-filters');
    if (portfolioFilters) {
      portfolioFilters.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-category]');
        if (!button) return;
        state.activeCategory = button.dataset.category || 'Todos';
        renderPortfolio();
      });
    }

    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) {
      portfolioGrid.addEventListener('click', (event) => {
        const trigger = event.target.closest('button[data-lightbox]');
        if (!trigger) return;
        openLightbox(trigger.dataset.image || '', trigger.dataset.title || '', trigger.dataset.description || '');
      });
    }

    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.getElementById('lightbox-close');
    if (lightbox && lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeLightbox();
      });
    }

    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });

      window.addEventListener('scroll', () => {
        if (window.scrollY > 380) {
          backToTop.classList.remove('hidden');
        } else {
          backToTop.classList.add('hidden');
        }
      });
    }

    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    if (contactForm && formStatus) {
      contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        formStatus.textContent = 'Mensagem enviada com sucesso. Obrigada pelo contacto!';
        contactForm.reset();
      });
    }
  }

  function renderAll() {
    renderHero();
    renderAbout();
    renderServices();
    renderPortfolio();
    renderFormations();
    renderCV();
    renderExperience();
    renderSkills();
    renderTestimonials();
    renderInstagram();
    renderContacts();
    renderFooter();
  }

  function renderHero() {
    const profile = state.data.profile;
    setText('brand-name', profile.name);
    setText('hero-name', profile.name);
    setText('hero-specialty', profile.specialty);
    setText('hero-tagline', profile.tagline);
    const heroBg = document.getElementById('hero-bg');
    if (heroBg) {
      heroBg.style.backgroundImage = `url('${profile.heroImage}')`;
    }
  }

  function renderAbout() {
    const profile = state.data.profile;
    setText('about-bio', profile.bio);
    setText('about-style', profile.style);
    setText('about-years', profile.years);
    setText('about-location', profile.location);
    const image = document.getElementById('about-image');
    if (image) {
      image.src = profile.profileImage || profile.heroImage;
    }
  }

  function renderServices() {
    const container = document.getElementById('services-grid');
    if (!container) return;
    if (!state.data.services.length) {
      container.innerHTML = '<p class="text-black/60">Sem serviços cadastrados.</p>';
      return;
    }
    container.innerHTML = state.data.services.map((service) => `
      <article class="service-card reveal">
        <h3 class="font-display text-2xl mb-2">${escapeHtml(service.title)}</h3>
        <p class="text-sm text-black/75 mb-4">${escapeHtml(service.description)}</p>
        <p class="text-xs uppercase tracking-[0.15em] text-gold font-bold">${escapeHtml(service.price || 'Sob consulta')}</p>
      </article>
    `).join('');
  }

  function renderPortfolio() {
    const filtersContainer = document.getElementById('portfolio-filters');
    const grid = document.getElementById('portfolio-grid');
    if (!filtersContainer || !grid) return;

    const categories = ['Todos', ...new Set(state.data.portfolio.map((item) => item.category || 'Outros'))];
    if (!categories.includes(state.activeCategory)) {
      state.activeCategory = 'Todos';
    }

    filtersContainer.innerHTML = categories.map((category) => `
      <button class="portfolio-filter ${category === state.activeCategory ? 'active' : ''}" data-category="${escapeHtml(category)}">
        ${escapeHtml(category)}
      </button>
    `).join('');

    const items = state.data.portfolio.filter((item) => {
      return state.activeCategory === 'Todos' || (item.category || 'Outros') === state.activeCategory;
    });

    if (!items.length) {
      grid.innerHTML = '<p class="text-black/60 col-span-full">Sem itens de portfólio para a categoria selecionada.</p>';
      return;
    }

    grid.innerHTML = items.map((item) => `
      <article class="portfolio-card reveal">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" />
        <div class="portfolio-overlay">
          <p class="text-xs uppercase tracking-[0.18em] text-gold mb-1">${escapeHtml(item.category || 'Outros')}</p>
          <h3 class="font-display text-2xl leading-none mb-1">${escapeHtml(item.title)}</h3>
          <p class="text-sm text-white/85 mb-3">${escapeHtml(item.description || '')}</p>
          <button class="btn-mini" data-lightbox="true" data-image="${escapeHtml(item.image)}" data-title="${escapeHtml(item.title)}" data-description="${escapeHtml(item.description || '')}">
            Ampliar
          </button>
        </div>
      </article>
    `).join('');
  }

  function renderFormations() {
    const container = document.getElementById('formations-list');
    if (!container) return;
    if (!state.data.formations.length) {
      container.innerHTML = '<p class="text-black/60">Sem formações cadastradas.</p>';
      return;
    }

    container.innerHTML = state.data.formations.map((formation) => {
      const certHref = formation.certificateData || formation.certificateUrl;
      const certButton = certHref
        ? `<a class="btn-mini" href="${escapeHtml(certHref)}" download="${escapeHtml(formation.certificateName || 'certificado.pdf')}" target="_blank" rel="noopener">Download Certificado</a>`
        : '<span class="text-xs text-black/50">Sem certificado anexado</span>';

      return `
        <article class="formation-card reveal">
          <p class="text-xs uppercase tracking-[0.2em] text-gold mb-1">${escapeHtml(formation.year || '')}</p>
          <h3 class="font-display text-2xl leading-none mb-2">${escapeHtml(formation.course)}</h3>
          <p class="text-sm text-black/70 mb-3">${escapeHtml(formation.institution)}</p>
          ${certButton}
        </article>
      `;
    }).join('');
  }

  function renderCV() {
    const cvDownload = document.getElementById('cv-download');
    const cvView = document.getElementById('cv-view');
    const cvStatus = document.getElementById('cv-status');
    if (!cvDownload || !cvView || !cvStatus) return;

    const cvHref = state.data.cv.fileData || state.data.cv.fileUrl;
    const cvName = state.data.cv.fileName || 'cv.pdf';
    if (cvHref) {
      cvDownload.href = cvHref;
      cvDownload.setAttribute('download', cvName);
      cvView.href = cvHref;
      cvStatus.textContent = `Arquivo pronto: ${cvName}`;
      cvDownload.classList.remove('opacity-50', 'pointer-events-none');
      cvView.classList.remove('opacity-50', 'pointer-events-none');
    } else {
      cvDownload.href = '#';
      cvView.href = '#';
      cvStatus.textContent = 'Currículo ainda não anexado no painel admin.';
      cvDownload.classList.add('opacity-50', 'pointer-events-none');
      cvView.classList.add('opacity-50', 'pointer-events-none');
    }
  }

  function renderExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;
    if (!state.data.experience.length) {
      container.innerHTML = '<p class="text-black/60">Sem experiências cadastradas.</p>';
      return;
    }

    container.innerHTML = state.data.experience.map((item) => `
      <article class="timeline-item reveal">
        <p class="text-xs uppercase tracking-[0.15em] text-gold mb-1">${escapeHtml(item.period || '')}</p>
        <h3 class="font-display text-2xl leading-none">${escapeHtml(item.company)}</h3>
        <p class="font-semibold text-sm text-black/75 mb-2">${escapeHtml(item.role || '')}</p>
        <p class="text-sm text-black/70">${escapeHtml(item.description || '')}</p>
      </article>
    `).join('');
  }

  function renderSkills() {
    renderSkillGroup('technical-skills', state.data.skills.technical || []);
    renderSkillGroup('soft-skills', state.data.skills.soft || []);
  }

  function renderSkillGroup(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!items.length) {
      container.innerHTML = '<p class="text-black/60">Sem competências cadastradas.</p>';
      return;
    }

    container.innerHTML = items.map((skill) => {
      const level = Math.min(100, Math.max(0, Number(skill.level || 0)));
      return `
        <div class="skill-line reveal">
          <div class="flex items-center justify-between text-sm">
            <span>${escapeHtml(skill.name)}</span>
            <span>${level}%</span>
          </div>
          <div class="skill-bar"><span style="width:${level}%"></span></div>
        </div>
      `;
    }).join('');
  }

  function renderTestimonials() {
    const container = document.getElementById('testimonials-grid');
    if (!container) return;
    if (!state.data.testimonials.length) {
      container.innerHTML = '<p class="text-black/60">Sem testemunhos cadastrados.</p>';
      return;
    }

    container.innerHTML = state.data.testimonials.map((item) => {
      const stars = '★'.repeat(Math.min(5, Math.max(1, Number(item.rating || 5))));
      return `
        <article class="testimonial-card reveal">
          <div class="flex items-center gap-3 mb-3">
            <img src="${escapeHtml(item.avatar || state.data.profile.profileImage)}" alt="${escapeHtml(item.name)}" class="w-12 h-12 object-cover rounded-full" loading="lazy" />
            <div>
              <h3 class="font-semibold">${escapeHtml(item.name)}</h3>
              <p class="text-xs text-black/60">${escapeHtml(item.role || 'Cliente')}</p>
            </div>
          </div>
          <p class="text-sm text-black/75 mb-2">"${escapeHtml(item.text || '')}"</p>
          <p class="text-gold">${stars}</p>
        </article>
      `;
    }).join('');
  }

  function renderInstagram() {
    const container = document.getElementById('instagram-grid');
    const instagramLink = document.getElementById('instagram-link');
    if (!container) return;

    const feed = state.data.instagram && state.data.instagram.length
      ? state.data.instagram
      : (state.data.portfolio || []).slice(0, 6).map((item, index) => ({
          id: `auto_ig_${index}`,
          image: item.image,
          link: state.data.profile.instagram || '#'
        }));

    container.innerHTML = feed.map((item) => `
      <a class="instagram-item reveal" href="${escapeHtml(item.link || '#')}" target="_blank" rel="noopener">
        <img src="${escapeHtml(item.image)}" alt="Instagram" loading="lazy" />
      </a>
    `).join('');

    if (instagramLink) {
      instagramLink.href = state.data.profile.instagram || '#';
    }
  }

  function renderContacts() {
    const profile = state.data.profile;
    const number = (profile.whatsappNumber || '').replace(/\D/g, '');
    const message = encodeURIComponent('Olá! Gostaria de agendar um serviço de maquilhagem.');
    const whatsapp = number ? `https://wa.me/${number}?text=${message}` : '#';
    setAnchor('contact-whatsapp', whatsapp);
    setAnchor('contact-email', `mailto:${profile.email || ''}`, profile.email || 'Email indisponível');
    setAnchor('contact-instagram', profile.instagram || '#');
    setAnchor('contact-facebook', profile.facebook || '#');
    setAnchor('contact-tiktok', profile.tiktok || '#');
  }

  function renderFooter() {
    const copy = document.getElementById('footer-copy');
    if (!copy) return;
    copy.textContent = `© ${new Date().getFullYear()} ${state.data.profile.name}. Todos os direitos reservados.`;
  }

  function setupRevealObserver() {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
  }

  function observeRevealElements() {
    if (!revealObserver) return;
    document.querySelectorAll('.reveal').forEach((element) => {
      revealObserver.observe(element);
    });
  }

  function openLightbox(image, title, description) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    if (!lightbox || !lightboxImage || !lightboxTitle || !lightboxDescription) return;
    lightboxImage.src = image;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text || '';
  }

  function setAnchor(id, href, text) {
    const element = document.getElementById(id);
    if (!element) return;
    element.href = href || '#';
    if (text) element.textContent = text;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }
})();
