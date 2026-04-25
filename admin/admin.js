(function () {
  const store = window.PortfolioStore;
  const AUTH_USER = 'admin';
  const AUTH_PASS = 'makeup123';

  let data = store.loadData();

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    // Segurança: sincronizar com GitHub antes de qualquer edição
    if (window.initDatabase) window.initDatabase();

    bindAuth();
    bindProfile();
    bindServices();
    bindPortfolio();
    bindFormations();
    bindCV();
    bindExperience();
    bindSkills();
    bindTestimonials();
    bindSystemActions();
    bindGitHub();
    syncFromStorage();
    renderAll();
    applyProfileToForm();
    updateAuthView();
  }

  function bindAuth() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const username = valueOf('login-username');
      const password = valueOf('login-password');
      if (username === AUTH_USER && password === AUTH_PASS) {
        store.setAuth(true);
        setLoginStatus('Login efetuado com sucesso.', true);
        updateAuthView();
      } else {
        setLoginStatus('Credenciais inválidas. Tente novamente.', false);
      }
    });

    const logout = document.getElementById('logout');
    if (logout) {
      logout.addEventListener('click', () => {
        store.setAuth(false);
        updateAuthView();
      });
    }
  }

  function updateAuthView() {
    const auth = store.getAuth();
    const loginPanel = document.getElementById('login-panel');
    const dashboard = document.getElementById('dashboard');
    if (!loginPanel || !dashboard) return;
    if (auth.isLoggedIn) {
      loginPanel.classList.add('hidden');
      dashboard.classList.remove('hidden');
      showStatus('Sessão iniciada. Pode editar o conteúdo normalmente.', 'success');
    } else {
      loginPanel.classList.remove('hidden');
      dashboard.classList.add('hidden');
      showStatus('', 'neutral');
    }
  }

  function bindSystemActions() {
    const resetData = document.getElementById('reset-data');
    if (resetData) {
      resetData.addEventListener('click', () => {
        const confirmReset = confirm('Deseja repor todos os dados para o padrão?');
        if (!confirmReset) return;
        data = store.resetData();
        renderAll();
        applyProfileToForm();
        showStatus('Dados repostos para o padrão com sucesso.', 'success');
      });
    }
  }

  function bindProfile() {
    const form = document.getElementById('profile-form');
    if (!form) return;
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const heroImage = await resolveMediaInput('profile-hero-image', 'profile-hero-file', data.profile.heroImage);
      const profileImage = await resolveMediaInput('profile-image', 'profile-image-file', data.profile.profileImage);

      data.profile = {
        ...data.profile,
        name: valueOf('profile-name'),
        specialty: valueOf('profile-specialty'),
        tagline: valueOf('profile-tagline'),
        bio: valueOf('profile-bio'),
        style: valueOf('profile-style'),
        years: valueOf('profile-years'),
        location: valueOf('profile-location'),
        email: valueOf('profile-email'),
        whatsappNumber: valueOf('profile-whatsapp'),
        instagram: valueOf('profile-instagram'),
        facebook: valueOf('profile-facebook'),
        tiktok: valueOf('profile-tiktok'),
        heroImage,
        profileImage
      };

      persist('Informações pessoais atualizadas.');
      clearFileInput('profile-hero-file');
      clearFileInput('profile-image-file');
    });
  }

  function bindServices() {
    const form = document.getElementById('service-form');
    const list = document.getElementById('services-list');
    const cancel = document.getElementById('service-cancel');
    if (!form || !list || !cancel) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const id = valueOf('service-id');
      const payload = {
        id: id || store.generateId('svc'),
        title: valueOf('service-title'),
        price: valueOf('service-price'),
        description: valueOf('service-description')
      };
      if (id) {
        data.services = data.services.map((item) => item.id === id ? payload : item);
        persist('Serviço atualizado com sucesso.');
      } else {
        data.services.push(payload);
        persist('Serviço adicionado com sucesso.');
      }
      form.reset();
      setValue('service-id', '');
    });

    cancel.addEventListener('click', () => {
      form.reset();
      setValue('service-id', '');
    });

    list.addEventListener('click', (event) => {
      const action = event.target.closest('button[data-action]');
      if (!action) return;
      const id = action.dataset.id;
      if (!id) return;

      if (action.dataset.action === 'edit') {
        const item = data.services.find((service) => service.id === id);
        if (!item) return;
        setValue('service-id', item.id);
        setValue('service-title', item.title);
        setValue('service-price', item.price);
        setValue('service-description', item.description);
      }

      if (action.dataset.action === 'delete') {
        data.services = data.services.filter((service) => service.id !== id);
        persist('Serviço removido.');
      }
    });
  }

  function bindPortfolio() {
    const form = document.getElementById('portfolio-form');
    const list = document.getElementById('portfolio-list');
    const cancel = document.getElementById('portfolio-cancel');
    if (!form || !list || !cancel) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = valueOf('portfolio-id');
      const existing = data.portfolio.find((item) => item.id === id);
      const image = await resolveMediaInput('portfolio-image', 'portfolio-image-file', existing ? existing.image : '');

      const payload = {
        id: id || store.generateId('prt'),
        title: valueOf('portfolio-title'),
        category: valueOf('portfolio-category'),
        description: valueOf('portfolio-description'),
        image
      };

      if (!payload.image) {
        showStatus('Adicione uma imagem (URL ou upload) para o item do portfólio.', 'error');
        return;
      }

      if (id) {
        data.portfolio = data.portfolio.map((item) => item.id === id ? payload : item);
        persist('Item de portfólio atualizado.');
      } else {
        data.portfolio.push(payload);
        persist('Item de portfólio adicionado.');
      }

      form.reset();
      setValue('portfolio-id', '');
      clearFileInput('portfolio-image-file');
    });

    cancel.addEventListener('click', () => {
      form.reset();
      setValue('portfolio-id', '');
    });

    list.addEventListener('click', (event) => {
      const action = event.target.closest('button[data-action]');
      if (!action) return;
      const id = action.dataset.id;
      if (!id) return;

      if (action.dataset.action === 'edit') {
        const item = data.portfolio.find((entry) => entry.id === id);
        if (!item) return;
        setValue('portfolio-id', item.id);
        setValue('portfolio-title', item.title);
        setValue('portfolio-category', item.category);
        setValue('portfolio-description', item.description);
        setValue('portfolio-image', item.image);
      }

      if (action.dataset.action === 'delete') {
        data.portfolio = data.portfolio.filter((entry) => entry.id !== id);
        persist('Item de portfólio removido.');
      }
    });
  }

  function bindFormations() {
    const form = document.getElementById('formation-form');
    const list = document.getElementById('formations-list');
    const cancel = document.getElementById('formation-cancel');
    if (!form || !list || !cancel) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = valueOf('formation-id');
      const existing = data.formations.find((item) => item.id === id);
      const file = fileOf('formation-certificate-file');
      const certificateData = file ? await fileToDataURL(file) : (existing ? existing.certificateData : '');
      const certificateName = file ? file.name : (existing ? existing.certificateName : 'certificado.pdf');
      const certificateUrl = valueOf('formation-certificate-url') || (existing ? existing.certificateUrl : '');

      const payload = {
        id: id || store.generateId('frm'),
        course: valueOf('formation-course'),
        institution: valueOf('formation-institution'),
        year: valueOf('formation-year'),
        certificateData,
        certificateName,
        certificateUrl
      };

      if (id) {
        data.formations = data.formations.map((item) => item.id === id ? payload : item);
        persist('Formação atualizada.');
      } else {
        data.formations.push(payload);
        persist('Formação adicionada.');
      }

      form.reset();
      setValue('formation-id', '');
      clearFileInput('formation-certificate-file');
    });

    cancel.addEventListener('click', () => {
      form.reset();
      setValue('formation-id', '');
    });

    list.addEventListener('click', (event) => {
      const action = event.target.closest('button[data-action]');
      if (!action) return;
      const id = action.dataset.id;
      if (!id) return;

      if (action.dataset.action === 'edit') {
        const item = data.formations.find((entry) => entry.id === id);
        if (!item) return;
        setValue('formation-id', item.id);
        setValue('formation-course', item.course);
        setValue('formation-institution', item.institution);
        setValue('formation-year', item.year);
        setValue('formation-certificate-url', item.certificateUrl || '');
      }

      if (action.dataset.action === 'delete') {
        data.formations = data.formations.filter((entry) => entry.id !== id);
        persist('Formação removida.');
      }
    });
  }

  function bindCV() {
    const form = document.getElementById('cv-form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const file = fileOf('cv-file');
      const url = valueOf('cv-url');

      if (!file && !url) {
        showStatus('Anexe um PDF ou informe uma URL para o currículo.', 'error');
        return;
      }

      if (file) {
        data.cv.fileData = await fileToDataURL(file);
        data.cv.fileName = file.name;
        data.cv.fileUrl = '';
      } else if (url) {
        data.cv.fileUrl = url;
        if (!data.cv.fileName) data.cv.fileName = 'cv-makeup-artist.pdf';
      }

      persist('Currículo atualizado.');
      clearFileInput('cv-file');
      form.reset();
    });
  }

  function bindExperience() {
    const form = document.getElementById('experience-form');
    const list = document.getElementById('experience-list');
    const cancel = document.getElementById('experience-cancel');
    if (!form || !list || !cancel) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = valueOf('experience-id');
      const existing = data.experience.find((item) => item.id === id);
      const logo = await resolveMediaInput('experience-logo', 'experience-logo-file', existing ? existing.logo : '');

      const payload = {
        id: id || store.generateId('exp'),
        company: valueOf('experience-company'),
        role: valueOf('experience-role'),
        period: valueOf('experience-period'),
        description: valueOf('experience-description'),
        logo
      };

      if (id) {
        data.experience = data.experience.map((item) => item.id === id ? payload : item);
        persist('Experiência atualizada.');
      } else {
        data.experience.push(payload);
        persist('Experiência adicionada.');
      }

      form.reset();
      setValue('experience-id', '');
      clearFileInput('experience-logo-file');
    });

    cancel.addEventListener('click', () => {
      form.reset();
      setValue('experience-id', '');
    });

    list.addEventListener('click', (event) => {
      const action = event.target.closest('button[data-action]');
      if (!action) return;
      const id = action.dataset.id;
      if (!id) return;

      if (action.dataset.action === 'edit') {
        const item = data.experience.find((entry) => entry.id === id);
        if (!item) return;
        setValue('experience-id', item.id);
        setValue('experience-company', item.company);
        setValue('experience-role', item.role);
        setValue('experience-period', item.period);
        setValue('experience-description', item.description);
        setValue('experience-logo', item.logo || '');
      }

      if (action.dataset.action === 'delete') {
        data.experience = data.experience.filter((entry) => entry.id !== id);
        persist('Experiência removida.');
      }
    });
  }

  function bindSkills() {
    bindSkillType('tech', 'technical');
    bindSkillType('soft', 'soft');
  }

  function bindSkillType(prefix, key) {
    const form = document.getElementById(`skill-${prefix}-form`);
    const list = document.getElementById(`skills-${prefix}-list`);
    const cancel = document.getElementById(`skill-${prefix}-cancel`);
    if (!form || !list || !cancel) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const id = valueOf(`skill-${prefix}-id`);
      const payload = {
        id: id || store.generateId(`skill_${prefix}`),
        name: valueOf(`skill-${prefix}-name`),
        level: Math.min(100, Math.max(0, Number(valueOf(`skill-${prefix}-level`) || 0)))
      };

      const targetList = data.skills[key] || [];
      if (id) {
        data.skills[key] = targetList.map((item) => item.id === id ? payload : item);
        persist('Competência atualizada.');
      } else {
        targetList.push(payload);
        data.skills[key] = targetList;
        persist('Competência adicionada.');
      }

      form.reset();
      setValue(`skill-${prefix}-id`, '');
    });

    cancel.addEventListener('click', () => {
      form.reset();
      setValue(`skill-${prefix}-id`, '');
    });

    list.addEventListener('click', (event) => {
      const action = event.target.closest('button[data-action]');
      if (!action) return;
      const id = action.dataset.id;
      if (!id) return;

      const targetList = data.skills[key] || [];

      if (action.dataset.action === 'edit') {
        const item = targetList.find((entry) => entry.id === id);
        if (!item) return;
        setValue(`skill-${prefix}-id`, item.id);
        setValue(`skill-${prefix}-name`, item.name);
        setValue(`skill-${prefix}-level`, item.level);
      }

      if (action.dataset.action === 'delete') {
        data.skills[key] = targetList.filter((entry) => entry.id !== id);
        persist('Competência removida.');
      }
    });
  }

  function bindTestimonials() {
    const form = document.getElementById('testimonial-form');
    const list = document.getElementById('testimonials-list');
    const cancel = document.getElementById('testimonial-cancel');
    if (!form || !list || !cancel) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const id = valueOf('testimonial-id');
      const existing = data.testimonials.find((item) => item.id === id);
      const avatar = await resolveMediaInput('testimonial-avatar', 'testimonial-avatar-file', existing ? existing.avatar : data.profile.profileImage);

      const payload = {
        id: id || store.generateId('tst'),
        name: valueOf('testimonial-name'),
        role: valueOf('testimonial-role'),
        rating: Math.min(5, Math.max(1, Number(valueOf('testimonial-rating') || 5))),
        text: valueOf('testimonial-text'),
        avatar
      };

      if (id) {
        data.testimonials = data.testimonials.map((item) => item.id === id ? payload : item);
        persist('Testemunho atualizado.');
      } else {
        data.testimonials.push(payload);
        persist('Testemunho adicionado.');
      }

      form.reset();
      setValue('testimonial-id', '');
      clearFileInput('testimonial-avatar-file');
    });

    cancel.addEventListener('click', () => {
      form.reset();
      setValue('testimonial-id', '');
    });

    list.addEventListener('click', (event) => {
      const action = event.target.closest('button[data-action]');
      if (!action) return;
      const id = action.dataset.id;
      if (!id) return;

      if (action.dataset.action === 'edit') {
        const item = data.testimonials.find((entry) => entry.id === id);
        if (!item) return;
        setValue('testimonial-id', item.id);
        setValue('testimonial-name', item.name);
        setValue('testimonial-role', item.role || '');
        setValue('testimonial-rating', item.rating || 5);
        setValue('testimonial-text', item.text || '');
        setValue('testimonial-avatar', item.avatar || '');
      }

      if (action.dataset.action === 'delete') {
        data.testimonials = data.testimonials.filter((entry) => entry.id !== id);
        persist('Testemunho removido.');
      }
    });
  }

  function syncFromStorage() {
    window.addEventListener('storage', (event) => {
      if (event.key === store.STORAGE_KEY) {
        data = store.loadData();
        renderAll();
        applyProfileToForm();
      }
    });
  }

  function renderAll() {
    renderServices();
    renderPortfolio();
    renderFormations();
    renderCV();
    renderExperience();
    renderSkills();
    renderTestimonials();
  }

  function renderServices() {
    const list = document.getElementById('services-list');
    if (!list) return;
    list.innerHTML = data.services.map((item) => `
      <tr>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.price || '-')}</td>
        <td>${escapeHtml(item.description || '')}</td>
        <td>${actionButtons(item.id)}</td>
      </tr>
    `).join('');
  }

  function renderPortfolio() {
    const list = document.getElementById('portfolio-list');
    if (!list) return;
    list.innerHTML = data.portfolio.map((item) => `
      <tr>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.category || '-')}</td>
        <td><a href="${escapeHtml(item.image || '#')}" target="_blank" rel="noopener">Ver imagem</a></td>
        <td>${actionButtons(item.id)}</td>
      </tr>
    `).join('');
  }

  function renderFormations() {
    const list = document.getElementById('formations-list');
    if (!list) return;
    list.innerHTML = data.formations.map((item) => {
      const hasFile = item.certificateData || item.certificateUrl;
      return `
        <tr>
          <td>${escapeHtml(item.course)}</td>
          <td>${escapeHtml(item.institution)}</td>
          <td>${escapeHtml(item.year)}</td>
          <td>${hasFile ? 'Anexado' : 'Sem ficheiro'}</td>
          <td>${actionButtons(item.id)}</td>
        </tr>
      `;
    }).join('');
  }

  function renderCV() {
    const status = document.getElementById('cv-admin-status');
    if (!status) return;
    if (data.cv.fileData || data.cv.fileUrl) {
      status.textContent = `CV atual: ${data.cv.fileName || 'cv.pdf'}`;
    } else {
      status.textContent = 'Nenhum currículo anexado.';
    }
  }

  function renderExperience() {
    const list = document.getElementById('experience-list');
    if (!list) return;
    list.innerHTML = data.experience.map((item) => `
      <tr>
        <td>${escapeHtml(item.company)}</td>
        <td>${escapeHtml(item.role)}</td>
        <td>${escapeHtml(item.period)}</td>
        <td>${actionButtons(item.id)}</td>
      </tr>
    `).join('');
  }

  function renderSkills() {
    renderSkillList('skills-tech-list', data.skills.technical || []);
    renderSkillList('skills-soft-list', data.skills.soft || []);
  }

  function renderSkillList(id, items) {
    const list = document.getElementById(id);
    if (!list) return;
    list.innerHTML = items.map((item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.level)}%</td>
        <td>${actionButtons(item.id)}</td>
      </tr>
    `).join('');
  }

  function renderTestimonials() {
    const list = document.getElementById('testimonials-list');
    if (!list) return;
    list.innerHTML = data.testimonials.map((item) => `
      <tr>
        <td>${escapeHtml(item.name)}</td>
        <td>${escapeHtml(item.rating)}/5</td>
        <td>${escapeHtml(item.text)}</td>
        <td>${actionButtons(item.id)}</td>
      </tr>
    `).join('');
  }

  function applyProfileToForm() {
    setValue('profile-name', data.profile.name);
    setValue('profile-specialty', data.profile.specialty);
    setValue('profile-tagline', data.profile.tagline);
    setValue('profile-bio', data.profile.bio);
    setValue('profile-style', data.profile.style);
    setValue('profile-years', data.profile.years);
    setValue('profile-location', data.profile.location);
    setValue('profile-email', data.profile.email);
    setValue('profile-whatsapp', data.profile.whatsappNumber);
    setValue('profile-instagram', data.profile.instagram);
    setValue('profile-facebook', data.profile.facebook);
    setValue('profile-tiktok', data.profile.tiktok);
    setValue('profile-hero-image', data.profile.heroImage);
    setValue('profile-image', data.profile.profileImage);
  }

  function persist(message) {
    data = store.saveData(data);
    renderAll();
    showStatus(message, 'success');
  }

  function actionButtons(id) {
    return `
      <div class="flex gap-2">
        <button class="admin-btn-secondary" data-action="edit" data-id="${escapeHtml(id)}" type="button">Editar</button>
        <button class="admin-btn-danger" data-action="delete" data-id="${escapeHtml(id)}" type="button">Excluir</button>
      </div>
    `;
  }

  function valueOf(id) {
    const element = document.getElementById(id);
    return element ? element.value.trim() : '';
  }

  function setValue(id, value) {
    const element = document.getElementById(id);
    if (element) element.value = value || '';
  }

  function fileOf(id) {
    const element = document.getElementById(id);
    if (!element || !element.files || !element.files.length) return null;
    return element.files[0];
  }

  async function resolveMediaInput(urlInputId, fileInputId, fallback) {
    const file = fileOf(fileInputId);
    if (file) {
      return fileToDataURL(file);
    }
    const url = valueOf(urlInputId);
    return url || fallback || '';
  }

  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('Erro ao ler ficheiro'));
      reader.readAsDataURL(file);
    });
  }

  function clearFileInput(id) {
    const element = document.getElementById(id);
    if (element) element.value = '';
  }

  function setLoginStatus(message, ok) {
    const status = document.getElementById('login-status');
    if (!status) return;
    status.textContent = message;
    status.style.color = ok ? '#24613d' : '#a12525';
  }

  function showStatus(message, type) {
    const status = document.getElementById('admin-status');
    if (!status) return;
    status.textContent = message;
    if (type === 'success') status.style.color = '#24613d';
    else if (type === 'error') status.style.color = '#a12525';
    else status.style.color = '#1f1a1c';
  }

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  // ================================================================
  //  SINCRONIZAÇÃO GITHUB
  // ================================================================

  const GH_CONFIG_KEY = 'makeup_portfolio_github_config';

  function loadGitHubConfig() {
    try {
      const raw = localStorage.getItem(GH_CONFIG_KEY);
      const cfg = raw ? JSON.parse(raw) : {};
      return {
        owner: cfg.owner || '',
        repo: cfg.repo || '',
        branch: cfg.branch || 'main',
        token: cfg.token || ''
      };
    } catch (_) {
      return { owner: '', repo: '', branch: 'main', token: '' };
    }
  }

  function saveGitHubConfig(config) {
    localStorage.setItem(GH_CONFIG_KEY, JSON.stringify(config));
  }

  function bindGitHub() {
    const form = document.getElementById('github-config-form');
    const syncBtn = document.getElementById('github-sync-btn');
    const testBtn = document.getElementById('github-test-btn');
    if (!form || !syncBtn) return;

    // Preencher campos com configuração guardada
    const cfg = loadGitHubConfig();
    setValue('github-owner', cfg.owner);
    setValue('github-repo', cfg.repo);
    setValue('github-branch', cfg.branch || 'main');
    setValue('github-token', cfg.token);

    // Guardar configuração
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const config = {
        owner: valueOf('github-owner'),
        repo: valueOf('github-repo'),
        branch: valueOf('github-branch') || 'main',
        token: valueOf('github-token')
      };
      saveGitHubConfig(config);
      setGitHubStatus('✅ Configuração guardada com sucesso.', 'success');
    });

    // Testar ligação ao repositório
    if (testBtn) {
      testBtn.addEventListener('click', () => {
        testGitHubConnection();
      });
    }

    // Publicar no GitHub
    syncBtn.addEventListener('click', () => {
      syncToGitHub();
    });
  }

  async function testGitHubConnection() {
    const cfg = loadGitHubConfig();

    if (!cfg.owner || !cfg.repo || !cfg.token) {
      setGitHubStatus('⚠️ Preencha e guarde o Owner, Repositório, Branch e Token antes de testar.', 'error');
      return;
    }

    setGitHubStatus('⏳ A verificar ligação ao GitHub...', 'neutral');

    const headers = {
      'Authorization': `Bearer ${cfg.token}`,
      'Accept': 'application/vnd.github+json'
    };

    try {
      // Verificar se o repositório existe
      const repoResp = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}`, { headers });
      if (repoResp.status === 401) {
        setGitHubStatus('❌ Token inválido ou expirado. Gere um novo token com scope "repo".', 'error');
        return;
      }
      if (repoResp.status === 403) {
        setGitHubStatus('❌ Sem permissão. Certifique-se que o token tem o scope "repo".', 'error');
        return;
      }
      if (repoResp.status === 404) {
        setGitHubStatus(`❌ Repositório não encontrado: "${cfg.owner}/${cfg.repo}". Verifique o owner e o nome do repositório.`, 'error');
        return;
      }
      if (!repoResp.ok) {
        setGitHubStatus(`❌ Erro ao aceder ao repositório: ${repoResp.status}`, 'error');
        return;
      }

      const repoData = await repoResp.json();
      const defaultBranch = repoData.default_branch || 'main';

      // Verificar se a branch configurada existe
      const branchResp = await fetch(`https://api.github.com/repos/${cfg.owner}/${cfg.repo}/branches/${cfg.branch}`, { headers });
      if (branchResp.status === 404) {
        setGitHubStatus(
          `⚠️ Branch "${cfg.branch}" não encontrada. A branch principal deste repositório é "${defaultBranch}". Atualize o campo Branch e guarde.`,
          'error'
        );
        // Auto-sugerir branch correta no campo
        setValue('github-branch', defaultBranch);
        return;
      }

      setGitHubStatus(
        `✅ Ligação bem-sucedida! Repositório: ${repoData.full_name} | Branch: ${cfg.branch} | Visibilidade: ${repoData.private ? 'Privado' : 'Público'}`,
        'success'
      );
    } catch (err) {
      console.error('[testGitHubConnection]', err);
      setGitHubStatus(`❌ Erro de rede: ${err.message}`, 'error');
    }
  }

  async function syncToGitHub() {
    const cfg = loadGitHubConfig();

    if (!cfg.owner || !cfg.repo || !cfg.token) {
      setGitHubStatus('⚠️ Preencha e guarde o Owner, Repositório, Branch e Token antes de publicar.', 'error');
      return;
    }

    setGitHubStatus('⏳ A publicar no GitHub...', 'neutral');

    const lastUpdated = Date.now();

    // Snapshot dos dados atuais em memória
    const snapshot = {
      profile: JSON.stringify(data.profile, null, 2),
      services: JSON.stringify(data.services, null, 2),
      portfolio: JSON.stringify(data.portfolio, null, 2),
      formations: JSON.stringify(data.formations, null, 2),
      cv: JSON.stringify(data.cv, null, 2),
      experience: JSON.stringify(data.experience, null, 2),
      skills: JSON.stringify(data.skills, null, 2),
      testimonials: JSON.stringify(data.testimonials, null, 2),
      instagram: JSON.stringify(data.instagram, null, 2)
    };

    // Reconstrução programática do ficheiro data.js
    const fileContent =
`// =============================================================
//  js/data.js — Base de Dados Remota (GitHub)
//  Gerado automaticamente pelo painel admin em ${new Date(lastUpdated).toISOString()}
// =============================================================

const defaultData = {
  profile: ${snapshot.profile},
  services: ${snapshot.services},
  portfolio: ${snapshot.portfolio},
  formations: ${snapshot.formations},
  cv: ${snapshot.cv},
  experience: ${snapshot.experience},
  skills: ${snapshot.skills},
  testimonials: ${snapshot.testimonials},
  instagram: ${snapshot.instagram},
  lastUpdated: ${lastUpdated}
};

function initDatabase() {
  var STORAGE_KEY = 'makeup_portfolio_data_v1';
  var LAST_UPDATED_KEY = 'makeup_portfolio_last_updated';
  var localLastUpdated = parseInt(localStorage.getItem(LAST_UPDATED_KEY) || '0', 10);
  var remoteLastUpdated = defaultData.lastUpdated || 0;
  var hasLocalData = !!localStorage.getItem(STORAGE_KEY);
  if (!hasLocalData || remoteLastUpdated > localLastUpdated) {
    var syncData = {
      profile: defaultData.profile,
      services: defaultData.services,
      portfolio: defaultData.portfolio,
      formations: defaultData.formations,
      cv: defaultData.cv,
      experience: defaultData.experience,
      skills: defaultData.skills,
      testimonials: defaultData.testimonials,
      instagram: defaultData.instagram
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(syncData));
    localStorage.setItem(LAST_UPDATED_KEY, String(remoteLastUpdated));
    if (hasLocalData && localLastUpdated !== 0) {
      setTimeout(function () { window.location.reload(); }, 500);
    }
    console.log('[data.js] Sincronização concluída.');
  } else {
    console.log('[data.js] Dados locais já estão atualizados (v' + localLastUpdated + ').');
  }
}
window.initDatabase = initDatabase;
initDatabase();
`;

    const apiBase = `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/js/data.js`;
    const headers = {
      'Authorization': `Bearer ${cfg.token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json'
    };

    try {
      // 1. Obter SHA atual do ficheiro (necessário para o PUT)
      const branch = cfg.branch || 'main';
      let sha = null;
      const getResp = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}`, { headers });
      if (getResp.ok) {
        const fileInfo = await getResp.json();
        sha = fileInfo.sha || null;
      } else if (getResp.status === 401) {
        throw new Error('Token inválido ou expirado. Gere um novo token com scope "repo".');
      } else if (getResp.status === 403) {
        throw new Error('Sem permissão. Certifique-se que o token tem o scope "repo".');
      } else if (getResp.status === 404) {
        // Ficheiro não existe ainda — será criado pelo PUT (sha fica null)
        sha = null;
      } else {
        const errText = await getResp.text();
        throw new Error(`Erro ao obter SHA: ${getResp.status} — ${errText}`);
      }

      // 2. Codificar conteúdo em Base64
      const encoded = btoa(unescape(encodeURIComponent(fileContent)));

      // 3. Fazer PUT para criar/atualizar o ficheiro
      const body = {
        message: `chore: sync data.js via admin panel [${new Date(lastUpdated).toISOString()}]`,
        content: encoded,
        branch: cfg.branch || 'main'
      };
      if (sha) body.sha = sha;

      const putResp = await fetch(apiBase, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body)
      });

      if (!putResp.ok) {
        const errJson = await putResp.json().catch(() => ({}));
        let hint = '';
        if (putResp.status === 404) {
          hint = ` — Verifique se o owner "${cfg.owner}", o repositório "${cfg.repo}" e a branch "${cfg.branch || 'main'}" estão corretos. Use o botão "Testar Ligação" para diagnosticar.`;
        } else if (putResp.status === 401) {
          hint = ' — Token inválido ou expirado.';
        } else if (putResp.status === 403) {
          hint = ' — Sem permissão. O token precisa do scope "repo".';
        } else if (putResp.status === 422) {
          hint = ' — Conflito de SHA. Tente novamente.';
        }
        throw new Error(`GitHub API: ${putResp.status} — ${errJson.message || 'Erro desconhecido'}${hint}`);
      }

      // 4. Atualizar o timestamp local para refletir a versão publicada
      localStorage.setItem('makeup_portfolio_last_updated', String(lastUpdated));

      setGitHubStatus(
        `✅ Publicado com sucesso! Versão: ${new Date(lastUpdated).toLocaleString('pt-PT')}`,
        'success'
      );
    } catch (err) {
      console.error('[syncToGitHub]', err);
      setGitHubStatus(`❌ Falhou: ${err.message}`, 'error');
    }
  }

  function setGitHubStatus(message, type) {
    const el = document.getElementById('github-sync-status');
    if (!el) return;
    el.textContent = message;
    if (type === 'success') el.style.color = '#24613d';
    else if (type === 'error') el.style.color = '#a12525';
    else el.style.color = '#6b6058';
  }

})();
