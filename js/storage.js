(function () {
  const STORAGE_KEY = 'makeup_portfolio_data_v1';
  const AUTH_KEY = 'makeup_portfolio_auth_v1';

  const defaultData = {
    profile: {
      name: 'Aurora Beauty Studio',
      specialty: 'Bridal Makeup | Glam | Editorial',
      tagline: 'Realçando a sua beleza única com sofisticação e arte.',
      bio: 'Sou maquilhadora profissional com foco em noivas, eventos e produções editoriais. Cada look é desenhado para refletir personalidade, elegância e confiança.',
      style: 'Glow natural com acabamento premium',
      years: '8',
      location: 'Luanda, Angola',
      heroImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1600&q=80',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80',
      whatsappNumber: '244900000000',
      email: 'contato@aurorabeauty.studio',
      instagram: 'https://instagram.com',
      facebook: 'https://facebook.com',
      tiktok: 'https://tiktok.com'
    },
    services: [
      {
        id: 'svc_1',
        title: 'Maquilhagem para Noivas',
        description: 'Look resistente, elegante e personalizado para cerimónia e receção.',
        price: 'Sob consulta'
      },
      {
        id: 'svc_2',
        title: 'Eventos & Galas',
        description: 'Beleza de alto impacto para festas, premiações e momentos especiais.',
        price: 'A partir de 35.000 Kz'
      },
      {
        id: 'svc_3',
        title: 'Sessões Fotográficas',
        description: 'Preparação de pele e acabamento para editorial, moda e branding pessoal.',
        price: 'A partir de 45.000 Kz'
      },
      {
        id: 'svc_4',
        title: 'Produções Criativas',
        description: 'Direção de beleza para campanhas visuais, videoclipes e projetos autorais.',
        price: 'Orçamento personalizado'
      }
    ],
    portfolio: [
      {
        id: 'prt_1',
        title: 'Bridal Glow Soft',
        category: 'Bridal',
        description: 'Pele iluminada com olhos neutros e acabamento de longa duração.',
        image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'prt_2',
        title: 'Glam Bronze Night',
        category: 'Glam',
        description: 'Tom bronze com cílios dramáticos para eventos noturnos.',
        image: 'https://images.unsplash.com/photo-1526045478516-99145907023c?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'prt_3',
        title: 'Editorial Lines',
        category: 'Editorial',
        description: 'Linhas gráficas e acabamento artístico para fotografia de moda.',
        image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'prt_4',
        title: 'Natural Skin Prep',
        category: 'Natural',
        description: 'Cobertura leve com ênfase em textura saudável e luminosa.',
        image: 'https://images.unsplash.com/photo-1541534401786-2077eed87a72?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'prt_5',
        title: 'Classic Red Lips',
        category: 'Glam',
        description: 'Olhar definido e batom vermelho clássico para um look atemporal.',
        image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80'
      },
      {
        id: 'prt_6',
        title: 'Noiva Minimal Chic',
        category: 'Bridal',
        description: 'Look minimalista com pele glow e toque romântico.',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80'
      }
    ],
    formations: [
      {
        id: 'frm_1',
        course: 'Masterclass Bridal Techniques',
        institution: 'Lisbon Beauty Academy',
        year: '2024',
        certificateName: 'certificado-bridal.pdf',
        certificateData: '',
        certificateUrl: ''
      },
      {
        id: 'frm_2',
        course: 'Color Theory for Makeup',
        institution: 'Pro Makeup Institute',
        year: '2022',
        certificateName: 'certificado-color.pdf',
        certificateData: '',
        certificateUrl: ''
      }
    ],
    cv: {
      fileName: 'cv-makeup-artist.pdf',
      fileData: '',
      fileUrl: ''
    },
    experience: [
      {
        id: 'exp_1',
        company: 'Bella Bride Agency',
        role: 'Lead Bridal Makeup Artist',
        period: '2022 - Presente',
        description: 'Atendimento premium para noivas, incluindo provas, cronograma de dia do evento e acompanhamento de equipa.',
        logo: ''
      },
      {
        id: 'exp_2',
        company: 'Luz Editorial Studio',
        role: 'Makeup Artist Editorial',
        period: '2020 - 2022',
        description: 'Produção de beauty looks para campanhas, capas de revistas e sessões de moda.',
        logo: ''
      }
    ],
    skills: {
      technical: [
        { id: 'sk_t_1', name: 'Contouring', level: 92 },
        { id: 'sk_t_2', name: 'Skin Prep', level: 96 },
        { id: 'sk_t_3', name: 'Color Matching', level: 89 }
      ],
      soft: [
        { id: 'sk_s_1', name: 'Criatividade', level: 94 },
        { id: 'sk_s_2', name: 'Comunicação', level: 90 },
        { id: 'sk_s_3', name: 'Atendimento ao cliente', level: 97 }
      ]
    },
    testimonials: [
      {
        id: 'tst_1',
        name: 'Mariana Costa',
        role: 'Noiva',
        text: 'Senti-me linda e confiante do início ao fim. O resultado ficou impecável nas fotos.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'tst_2',
        name: 'Sara Gomes',
        role: 'Empreendedora',
        text: 'Profissional super cuidadosa e pontual. O look valorizou totalmente a minha identidade.',
        rating: 5,
        avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=300&q=80'
      }
    ],
    instagram: [
      {
        id: 'ig_1',
        image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=500&q=80',
        link: 'https://instagram.com'
      },
      {
        id: 'ig_2',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
        link: 'https://instagram.com'
      },
      {
        id: 'ig_3',
        image: 'https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=500&q=80',
        link: 'https://instagram.com'
      }
    ]
  };

  function deepClone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function deepMerge(base, custom) {
    if (Array.isArray(base)) {
      return Array.isArray(custom) ? custom : deepClone(base);
    }
    if (typeof base !== 'object' || base === null) {
      return custom === undefined ? base : custom;
    }

    const merged = {};
    Object.keys(base).forEach((key) => {
      merged[key] = deepMerge(base[key], custom ? custom[key] : undefined);
    });

    if (custom && typeof custom === 'object') {
      Object.keys(custom).forEach((key) => {
        if (!(key in merged)) {
          merged[key] = custom[key];
        }
      });
    }
    return merged;
  }

  function normalize(data) {
    const merged = deepMerge(defaultData, data || {});
    const arrayKeys = ['services', 'portfolio', 'formations', 'experience', 'testimonials', 'instagram'];
    arrayKeys.forEach((key) => {
      if (!Array.isArray(merged[key])) {
        merged[key] = [];
      }
    });
    if (!merged.skills || typeof merged.skills !== 'object') {
      merged.skills = deepClone(defaultData.skills);
    }
    if (!Array.isArray(merged.skills.technical)) merged.skills.technical = [];
    if (!Array.isArray(merged.skills.soft)) merged.skills.soft = [];
    return merged;
  }

  function loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return deepClone(defaultData);
      return normalize(JSON.parse(raw));
    } catch (_error) {
      return deepClone(defaultData);
    }
  }

  function saveData(nextData) {
    const finalData = normalize(nextData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(finalData));
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: finalData }));
    return finalData;
  }

  function resetData() {
    localStorage.removeItem(STORAGE_KEY);
    const fresh = deepClone(defaultData);
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: fresh }));
    return fresh;
  }

  function generateId(prefix) {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function getAuth() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) {
        return { isLoggedIn: false, lastLoginAt: null };
      }
      return JSON.parse(raw);
    } catch (_error) {
      return { isLoggedIn: false, lastLoginAt: null };
    }
  }

  function setAuth(isLoggedIn) {
    const value = {
      isLoggedIn: Boolean(isLoggedIn),
      lastLoginAt: new Date().toISOString()
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(value));
    return value;
  }

  window.PortfolioStore = {
    STORAGE_KEY,
    AUTH_KEY,
    defaultData: deepClone(defaultData),
    loadData,
    saveData,
    resetData,
    generateId,
    getAuth,
    setAuth
  };
})();
