/**
 * Gio's Chronology — Learning Tracker
 * Frontend controller: curriculum data, Firebase auth, UI rendering,
 * client-side state, and sync with the Apps Script backend.
 */
(function () {
  'use strict';

  // =========================================================================
  // CURRICULUM DATA
  // Each topic's `id` must be stable — it is the primary key used when
  // syncing progress to the Google Sheet (Module ID + Topic ID).
  // =========================================================================
  const CURRICULUM = [
    {
      id: 'M1',
      title: 'Client Success Management',
      description: 'Build the foundation for owning client relationships, retention, and value delivery.',
      topics: [
        {
          id: 'M1T1',
          title: 'Fundamentals of Client Success vs. Customer Support',
          description: 'Understand how CS differs from reactive support: proactive value delivery, health scoring, and outcome ownership.',
          youtubeQuery: 'Client Success Manager fundamentals vs customer support'
        },
        {
          id: 'M1T2',
          title: 'Onboarding & Time-to-Value',
          description: 'Design onboarding plans that get clients to their first meaningful outcome as fast as possible.',
          youtubeQuery: 'customer onboarding time to value best practices'
        },
        {
          id: 'M1T3',
          title: 'Customer Health Scoring & Churn Signals',
          description: 'Build a health score model combining usage, engagement, sentiment, and support signals to predict churn.',
          youtubeQuery: 'customer health score churn prediction SaaS'
        },
        {
          id: 'M1T4',
          title: 'Quarterly Business Reviews (QBRs)',
          description: 'Structure and deliver QBRs that tie product usage to business outcomes and uncover expansion opportunities.',
          youtubeQuery: 'how to run a quarterly business review QBR'
        },
        {
          id: 'M1T5',
          title: 'Renewals, Upsell & Expansion Playbooks',
          description: 'Learn renewal forecasting, negotiation basics, and how to spot expansion/cross-sell signals.',
          youtubeQuery: 'customer success renewal and upsell playbook'
        },
        {
          id: 'M1T6',
          title: 'Difficult Conversations & Escalation Management',
          description: 'Frameworks for de-escalating unhappy clients and turning at-risk accounts around.',
          youtubeQuery: 'customer success escalation management difficult conversations'
        }
      ]
    },
    {
      id: 'M2',
      title: 'Technical Project Management',
      description: 'Learn the delivery frameworks and tools used to plan, run, and ship technical projects.',
      topics: [
        {
          id: 'M2T1',
          title: 'Agile & Scrum Fundamentals',
          description: 'Sprints, backlogs, standups, retros — the core rituals and roles of Scrum-based delivery.',
          youtubeQuery: 'Agile Scrum fundamentals for project managers'
        },
        {
          id: 'M2T2',
          title: 'Project Charters, Scope & Requirements Gathering',
          description: 'Translate stakeholder needs into a scoped project charter with clear success criteria.',
          youtubeQuery: 'project charter scope requirements gathering technical PM'
        },
        {
          id: 'M2T3',
          title: 'Risk, Dependency & Timeline Management',
          description: 'Identify risks and cross-team dependencies early, and build realistic timelines with buffer.',
          youtubeQuery: 'project risk management dependencies timeline planning'
        },
        {
          id: 'M2T4',
          title: 'Jira, Confluence & Roadmapping Tools',
          description: 'Hands-on with Jira boards/epics, Confluence documentation, and roadmap visualization tools.',
          youtubeQuery: 'Jira and Confluence tutorial for project managers'
        },
        {
          id: 'M2T5',
          title: 'Stakeholder Communication & Status Reporting',
          description: 'Build a communication cadence and status reports that keep execs and engineers aligned.',
          youtubeQuery: 'stakeholder communication status reporting project management'
        },
        {
          id: 'M2T6',
          title: 'Reading Technical Specs & Working with Engineers',
          description: 'Build enough technical fluency to read API docs, architecture diagrams, and speak the engineering language.',
          youtubeQuery: 'technical project manager how to work with engineers API basics'
        }
      ]
    },
    {
      id: 'M3',
      title: 'Voice & Data / VoIP Networking',
      description: 'Understand the telecom and networking fundamentals behind voice, data, and unified communications.',
      topics: [
        {
          id: 'M3T1',
          title: 'Networking Basics: OSI Model, IP, DNS, DHCP',
          description: 'The core building blocks of any network: OSI layers, IP addressing, DNS resolution, and DHCP.',
          youtubeQuery: 'networking basics OSI model IP DNS DHCP explained'
        },
        {
          id: 'M3T2',
          title: 'VoIP Fundamentals: SIP, RTP & Codecs',
          description: 'How voice traffic becomes packets: SIP signaling, RTP media streams, and codec tradeoffs.',
          youtubeQuery: 'VoIP fundamentals SIP RTP codecs explained'
        },
        {
          id: 'M3T3',
          title: 'QoS, Bandwidth & Jitter for Voice Traffic',
          description: 'Why voice quality breaks under network load, and how QoS, jitter buffers, and bandwidth planning fix it.',
          youtubeQuery: 'QoS bandwidth jitter VoIP call quality'
        },
        {
          id: 'M3T4',
          title: 'PBX, SBCs & Carrier Trunking',
          description: 'How on-prem/cloud PBX systems, session border controllers, and SIP trunks connect a business to the PSTN.',
          youtubeQuery: 'PBX SBC SIP trunking explained'
        },
        {
          id: 'M3T5',
          title: 'Troubleshooting Common Voice/Data Issues',
          description: 'Diagnose one-way audio, dropped calls, latency, and packet loss using traceroute, ping, and packet captures.',
          youtubeQuery: 'troubleshooting VoIP call quality issues wireshark'
        },
        {
          id: 'M3T6',
          title: 'UCaaS Platforms Overview (RingCentral, Zoom, Teams)',
          description: 'Survey the major Unified Communications as a Service platforms and how enterprises evaluate/migrate between them.',
          youtubeQuery: 'UCaaS platforms overview RingCentral Zoom Phone Teams'
        }
      ]
    },
    {
      id: 'M4',
      title: 'IT Operations & Inventory Management',
      description: 'Manage the operational backbone: hardware lifecycle, ticketing, and IT asset inventory.',
      topics: [
        {
          id: 'M4T1',
          title: 'IT Asset Management (ITAM) Fundamentals',
          description: 'Track hardware/software assets through their full lifecycle: procurement, deployment, maintenance, retirement.',
          youtubeQuery: 'IT asset management fundamentals ITAM lifecycle'
        },
        {
          id: 'M4T2',
          title: 'Inventory Systems & Barcode/Asset Tagging',
          description: 'Set up an inventory tracking system with asset tags, barcodes, and location/assignment records.',
          youtubeQuery: 'IT inventory management barcode asset tagging system'
        },
        {
          id: 'M4T3',
          title: 'Ticketing Systems & ITIL Basics',
          description: 'Incident, problem, and change management fundamentals using ITIL-aligned ticketing workflows.',
          youtubeQuery: 'ITIL basics ticketing system incident management'
        },
        {
          id: 'M4T4',
          title: 'Vendor & License Management',
          description: 'Track software licenses, renewal dates, and vendor contracts to avoid compliance gaps and overspend.',
          youtubeQuery: 'software license management vendor contract tracking IT'
        },
        {
          id: 'M4T5',
          title: 'Procurement Workflows & Budgeting',
          description: 'Build a repeatable procurement process from purchase request through approval and receiving.',
          youtubeQuery: 'IT procurement process workflow budgeting'
        },
        {
          id: 'M4T6',
          title: 'Basic Security & Compliance for IT Ops',
          description: 'Asset-level security hygiene: patching cadence, device encryption, access reviews, and audit readiness.',
          youtubeQuery: 'IT operations security compliance basics asset management'
        }
      ]
    },
    {
      id: 'M5',
      title: 'Analytics & Power BI',
      description: 'Turn raw data into decisions: data modeling, DAX, and dashboard storytelling in Power BI.',
      topics: [
        {
          id: 'M5T1',
          title: 'Power BI Desktop Basics & Data Import',
          description: 'Install Power BI Desktop, connect to data sources (Excel, SQL, APIs), and understand the query editor.',
          youtubeQuery: 'Power BI Desktop tutorial for beginners'
        },
        {
          id: 'M5T2',
          title: 'Data Modeling & Relationships',
          description: 'Build a star schema, define table relationships, and understand cardinality and filter direction.',
          youtubeQuery: 'Power BI data modeling relationships star schema'
        },
        {
          id: 'M5T3',
          title: 'DAX Fundamentals: Measures & Calculated Columns',
          description: 'Write your first DAX measures — SUM, CALCULATE, filter context — and know when to use columns vs measures.',
          youtubeQuery: 'DAX fundamentals Power BI measures calculated columns'
        },
        {
          id: 'M5T4',
          title: 'Building Dashboards & Report Design',
          description: 'Design clear, decision-driving dashboards: layout, visual selection, and interactivity (slicers, drill-through).',
          youtubeQuery: 'Power BI dashboard design best practices'
        },
        {
          id: 'M5T5',
          title: 'Power Query & ETL Basics',
          description: 'Clean and transform messy source data using Power Query M language before it hits your model.',
          youtubeQuery: 'Power Query ETL basics Power BI'
        },
        {
          id: 'M5T6',
          title: 'Sharing, Row-Level Security & Scheduled Refresh',
          description: 'Publish reports to the Power BI Service, configure row-level security, and schedule data refreshes.',
          youtubeQuery: 'Power BI service row level security scheduled refresh'
        }
      ]
    }
  ];

  const STATUS = {
    NOT_STARTED: 'Not Started',
    IN_PROGRESS: 'In Progress',
    COMPLETED: 'Completed'
  };

  // =========================================================================
  // STATE
  // =========================================================================
  const state = {
    user: null,               // Firebase user object
    progress: {},              // key `${moduleId}__${topicId}` -> { status, notes, lastUpdated }
    expandedModules: new Set([CURRICULUM[0].id]), // first module expanded by default
    activeTopicKey: null       // topic currently open in the notes modal
  };

  function progressKey(moduleId, topicId) {
    return moduleId + '__' + topicId;
  }

  function getTopicProgress(moduleId, topicId) {
    return state.progress[progressKey(moduleId, topicId)] || {
      status: STATUS.NOT_STARTED,
      notes: '',
      lastUpdated: null
    };
  }

  // =========================================================================
  // DOM REFERENCES
  // =========================================================================
  const el = {
    authScreen: document.getElementById('authScreen'),
    appShell: document.getElementById('appShell'),
    userBadge: document.getElementById('userBadge'),
    userEmailLabel: document.getElementById('userEmailLabel'),
    signOutBtn: document.getElementById('signOutBtn'),

    themeToggleBtn: document.getElementById('themeToggleBtn'),
    iconSun: document.getElementById('iconSun'),
    iconMoon: document.getElementById('iconMoon'),

    authError: document.getElementById('authError'),
    authInfo: document.getElementById('authInfo'),
    emailAuthForm: document.getElementById('emailAuthForm'),
    authEmail: document.getElementById('authEmail'),
    authPassword: document.getElementById('authPassword'),
    signInBtn: document.getElementById('signInBtn'),
    signUpBtn: document.getElementById('signUpBtn'),

    overviewSubtitle: document.getElementById('overviewSubtitle'),
    statCompleted: document.getElementById('statCompleted'),
    statInProgress: document.getElementById('statInProgress'),
    statTotal: document.getElementById('statTotal'),
    overallProgressBar: document.getElementById('overallProgressBar'),

    syncBanner: document.getElementById('syncBanner'),
    syncBannerText: document.getElementById('syncBannerText'),

    modulesContainer: document.getElementById('modulesContainer'),

    notesModalOverlay: document.getElementById('notesModalOverlay'),
    notesModalTitle: document.getElementById('notesModalTitle'),
    notesModalSubtitle: document.getElementById('notesModalSubtitle'),
    notesModalCloseBtn: document.getElementById('notesModalCloseBtn'),
    notesStatusSelect: document.getElementById('notesStatusSelect'),
    notesTextarea: document.getElementById('notesTextarea'),
    notesYoutubeLink: document.getElementById('notesYoutubeLink'),
    notesSavedLabel: document.getElementById('notesSavedLabel'),
    notesCancelBtn: document.getElementById('notesCancelBtn'),
    notesSaveBtn: document.getElementById('notesSaveBtn'),

    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // THEME
  // =========================================================================
  function initTheme() {
    const saved = safeLocalStorageGet('gc_theme');
    if (saved === 'dark' || saved === 'light') {
      document.documentElement.setAttribute('data-theme', saved);
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark' ||
      (!current && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    el.iconSun.classList.toggle('hidden', isDark);
    el.iconMoon.classList.toggle('hidden', !isDark);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const isDark = current === 'dark' ||
      (!current && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    safeLocalStorageSet('gc_theme', next);
    updateThemeIcon();
  }

  function safeLocalStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (err) { return null; }
  }
  function safeLocalStorageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (err) { /* ignore */ }
  }

  // =========================================================================
  // TOASTS
  // =========================================================================
  function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = 'toast' + (type ? ' toast-' + type : '');
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(function () {
      toast.remove();
    }, 3200);
  }

  // =========================================================================
  // BACKEND BRIDGE (google.script.run)
  // Wraps google.script.run in a Promise and attaches the caller's live
  // Firebase ID token as the first argument to every call — Code.gs verifies
  // it server-side and never trusts a client-claimed email. Falls back to a
  // local shim when previewed outside the Apps Script environment so the UI
  // stays testable.
  // =========================================================================
  const hasAppsScriptBridge = typeof google !== 'undefined' && !!google.script && !!google.script.run;

  if (!hasAppsScriptBridge) {
    console.warn('[Gio\'s Chronology] google.script.run is not available — running with a local-only fallback. Deploy inside Google Apps Script for real Sheet sync.');
  }

  function getAuthToken_() {
    if (!fb || !fb.auth || !fb.auth.currentUser) {
      return Promise.reject(new Error('Not signed in.'));
    }
    return fb.getIdToken(fb.auth.currentUser);
  }

  function callServer(fnName, ...args) {
    return getAuthToken_().then(function (idToken) {
      const fullArgs = [idToken].concat(args);

      if (hasAppsScriptBridge) {
        return new Promise(function (resolve, reject) {
          google.script.run
            .withSuccessHandler(resolve)
            .withFailureHandler(function (err) { reject(err); })
            [fnName].apply(google.script.run, fullArgs);
        });
      }
      return localFallback(fnName, fullArgs);
    });
  }

  // Local-only fallback (used only when not running inside Apps Script).
  // Real token verification only happens server-side in Code.gs, so this
  // shim just keys off the current signed-in user for local preview/testing.
  function localFallback(fnName, args) {
    const STORE_KEY = 'gc_local_progress_store';
    function readStore() {
      try { return JSON.parse(safeLocalStorageGet(STORE_KEY) || '{}'); } catch (e) { return {}; }
    }
    function writeStore(store) {
      safeLocalStorageSet(STORE_KEY, JSON.stringify(store));
    }

    return new Promise(function (resolve) {
      const store = readStore();
      const email = state.user && state.user.email;

      if (fnName === 'getProgressForUser') {
        const records = Object.values(store[email] || {});
        resolve(records);
        return;
      }

      if (fnName === 'saveProgress') {
        const record = args[1];
        store[email] = store[email] || {};
        const key = record.moduleId + '__' + record.topicId;
        const saved = {
          moduleId: record.moduleId,
          topicId: record.topicId,
          status: record.status || STATUS.NOT_STARTED,
          notes: record.notes || '',
          lastUpdated: new Date().toISOString()
        };
        store[email][key] = saved;
        writeStore(store);
        resolve(saved);
        return;
      }

      resolve(null);
    });
  }

  // =========================================================================
  // AUTH
  // =========================================================================
  let fb = null; // populated once Firebase is ready

  function initFirebaseAuth() {
    fb = window.__firebase;

    fb.onAuthStateChanged(fb.auth, function (user) {
      state.user = user;
      if (user) {
        onSignedIn(user);
      } else {
        onSignedOut();
      }
    });
  }

  // The Firebase bootstrap <script type="module"> in index.html may finish
  // (and dispatch 'firebase-ready') before this script even attaches its
  // listener, since module scripts execute out of order relative to classic
  // scripts. Checking the flag first avoids missing that event entirely.
  if (window.__firebaseReady) {
    initFirebaseAuth();
  } else {
    window.addEventListener('firebase-ready', initFirebaseAuth);
  }

  function onSignedIn(user) {
    el.authScreen.classList.add('hidden');
    el.appShell.classList.remove('hidden');
    el.userBadge.classList.remove('hidden');
    el.userEmailLabel.textContent = user.email || 'Signed in';
    clearAuthAlerts();
    loadProgress();
  }

  function onSignedOut() {
    state.user = null;
    state.progress = {};
    el.appShell.classList.add('hidden');
    el.userBadge.classList.add('hidden');
    el.authScreen.classList.remove('hidden');
  }

  function clearAuthAlerts() {
    el.authError.classList.add('hidden');
    el.authInfo.classList.add('hidden');
  }

  function showAuthError(message) {
    el.authInfo.classList.add('hidden');
    el.authError.textContent = message;
    el.authError.classList.remove('hidden');
  }

  function showAuthInfo(message) {
    el.authError.classList.add('hidden');
    el.authInfo.textContent = message;
    el.authInfo.classList.remove('hidden');
  }

  function friendlyAuthError(err) {
    const code = err && err.code ? err.code : '';
    const map = {
      'auth/invalid-email': 'That email address looks invalid.',
      'auth/user-not-found': 'No account found with that email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-credential': 'Incorrect email or password.',
      'auth/email-already-in-use': 'An account already exists with that email. Try signing in instead.',
      'auth/weak-password': 'Password should be at least 6 characters.'
    };
    return map[code] || (err && err.message) || 'Something went wrong. Please try again.';
  }

  el.emailAuthForm.addEventListener('submit', function (e) {
    e.preventDefault();
    handleSignIn();
  });

  el.signInBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handleSignIn();
  });

  el.signUpBtn.addEventListener('click', function (e) {
    e.preventDefault();
    handleSignUp();
  });

  function handleSignIn() {
    if (!fb) return;
    clearAuthAlerts();
    const email = el.authEmail.value.trim();
    const password = el.authPassword.value;
    setAuthButtonsDisabled(true);

    fb.signInWithEmailAndPassword(fb.auth, email, password)
      .catch(function (err) { showAuthError(friendlyAuthError(err)); })
      .finally(function () { setAuthButtonsDisabled(false); });
  }

  function handleSignUp() {
    if (!fb) return;
    clearAuthAlerts();
    const email = el.authEmail.value.trim();
    const password = el.authPassword.value;

    if (!email || password.length < 6) {
      showAuthError('Enter a valid email and a password with at least 6 characters.');
      return;
    }

    setAuthButtonsDisabled(true);
    fb.createUserWithEmailAndPassword(fb.auth, email, password)
      .then(function () { showAuthInfo('Account created! You are now signed in.'); })
      .catch(function (err) { showAuthError(friendlyAuthError(err)); })
      .finally(function () { setAuthButtonsDisabled(false); });
  }

  el.signOutBtn.addEventListener('click', function () {
    if (!fb) return;
    fb.signOut(fb.auth);
  });

  function setAuthButtonsDisabled(disabled) {
    el.signInBtn.disabled = disabled;
    el.signUpBtn.disabled = disabled;
  }

  // =========================================================================
  // THEME TOGGLE WIRING
  // =========================================================================
  el.themeToggleBtn.addEventListener('click', toggleTheme);

  // =========================================================================
  // PROGRESS LOADING / SYNC
  // =========================================================================
  function setSyncBanner(text) {
    if (!text) {
      el.syncBanner.classList.add('hidden');
      return;
    }
    el.syncBannerText.textContent = text;
    el.syncBanner.classList.remove('hidden');
  }

  function loadProgress() {
    if (!state.user) return;
    setSyncBanner('Loading your progress…');

    callServer('getProgressForUser')
      .then(function (records) {
        state.progress = {};
        (records || []).forEach(function (r) {
          state.progress[progressKey(r.moduleId, r.topicId)] = {
            status: r.status || STATUS.NOT_STARTED,
            notes: r.notes || '',
            lastUpdated: r.lastUpdated || null
          };
        });
        setSyncBanner(null);
        renderModules();
        renderOverview();
      })
      .catch(function (err) {
        console.error(err);
        setSyncBanner(null);
        showToast('Could not load saved progress. Showing a fresh tracker.', 'error');
        renderModules();
        renderOverview();
      });
  }

  function persistProgress(moduleId, topicId, status, notes) {
    const key = progressKey(moduleId, topicId);
    const optimisticPrev = state.progress[key];

    state.progress[key] = {
      status: status,
      notes: notes !== undefined ? notes : (optimisticPrev ? optimisticPrev.notes : ''),
      lastUpdated: new Date().toISOString()
    };
    renderOverview();

    setSyncBanner('Saving…');
    return callServer('saveProgress', {
      moduleId: moduleId,
      topicId: topicId,
      status: state.progress[key].status,
      notes: state.progress[key].notes
    })
      .then(function (saved) {
        state.progress[key] = {
          status: saved.status,
          notes: saved.notes,
          lastUpdated: saved.lastUpdated
        };
        setSyncBanner(null);
        return saved;
      })
      .catch(function (err) {
        console.error(err);
        setSyncBanner(null);
        showToast('Failed to save. Check your connection and try again.', 'error');
        if (optimisticPrev) state.progress[key] = optimisticPrev;
        renderModules();
        renderOverview();
        throw err;
      });
  }

  // =========================================================================
  // RENDERING — OVERVIEW
  // =========================================================================
  function renderOverview() {
    let total = 0, completed = 0, inProgress = 0;

    CURRICULUM.forEach(function (module) {
      module.topics.forEach(function (topic) {
        total++;
        const p = getTopicProgress(module.id, topic.id);
        if (p.status === STATUS.COMPLETED) completed++;
        else if (p.status === STATUS.IN_PROGRESS) inProgress++;
      });
    });

    el.statCompleted.textContent = completed;
    el.statInProgress.textContent = inProgress;
    el.statTotal.textContent = total;

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    el.overallProgressBar.style.width = pct + '%';
    el.overviewSubtitle.textContent = total > 0
      ? pct + '% complete across ' + CURRICULUM.length + ' modules (' + completed + ' of ' + total + ' topics)'
      : 'No topics yet.';
  }

  // =========================================================================
  // RENDERING — MODULES & TOPICS
  // =========================================================================
  function renderModules() {
    el.modulesContainer.innerHTML = '';

    CURRICULUM.forEach(function (module, moduleIndex) {
      const moduleStats = computeModuleStats(module);
      const isExpanded = state.expandedModules.has(module.id);

      const card = document.createElement('div');
      card.className = 'module-card card' + (isExpanded ? ' expanded' : '');
      card.dataset.moduleId = module.id;

      card.innerHTML =
        '<div class="module-header" role="button" tabindex="0" aria-expanded="' + isExpanded + '">' +
          '<span class="module-index">' + (moduleIndex + 1) + '</span>' +
          '<div class="module-header-text">' +
            '<h3>' + escapeHtml(module.title) + '</h3>' +
            '<p>' + escapeHtml(module.description) + '</p>' +
          '</div>' +
          '<div class="module-progress-mini">' +
            '<div class="progress-bar-track"><div class="progress-bar-fill" style="width:' + moduleStats.pct + '%"></div></div>' +
            '<span class="module-progress-label">' + moduleStats.completed + '/' + moduleStats.total + '</span>' +
          '</div>' +
          '<svg class="icon module-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"></path></svg>' +
        '</div>' +
        '<div class="module-topics"></div>';

      const header = card.querySelector('.module-header');
      header.addEventListener('click', function () { toggleModule(module.id); });
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleModule(module.id);
        }
      });

      const topicsWrap = card.querySelector('.module-topics');
      module.topics.forEach(function (topic) {
        topicsWrap.appendChild(renderTopicRow(module, topic));
      });

      el.modulesContainer.appendChild(card);
    });
  }

  function computeModuleStats(module) {
    let completed = 0;
    const total = module.topics.length;
    module.topics.forEach(function (topic) {
      if (getTopicProgress(module.id, topic.id).status === STATUS.COMPLETED) completed++;
    });
    return { completed: completed, total: total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }

  function toggleModule(moduleId) {
    if (state.expandedModules.has(moduleId)) {
      state.expandedModules.delete(moduleId);
    } else {
      state.expandedModules.add(moduleId);
    }
    renderModules();
  }

  function renderTopicRow(module, topic) {
    const progress = getTopicProgress(module.id, topic.id);
    const row = document.createElement('div');
    row.className = 'topic-row' + (progress.status === STATUS.COMPLETED ? ' is-completed' : '');
    row.dataset.topicId = topic.id;

    const statusClass = 'status-' + progress.status.toLowerCase().replace(/\s+/g, '-');
    const youtubeUrl = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(topic.youtubeQuery);

    row.innerHTML =
      '<input type="checkbox" class="topic-checkbox" ' + (progress.status === STATUS.COMPLETED ? 'checked' : '') + ' aria-label="Mark ' + escapeHtml(topic.title) + ' as completed" />' +
      '<div class="topic-main">' +
        '<div class="topic-title-row">' +
          '<p class="topic-title">' + escapeHtml(topic.title) + '</p>' +
          '<span class="status-badge ' + statusClass + '">' + escapeHtml(progress.status) + '</span>' +
          (progress.notes ? '<span class="notes-indicator">Has notes</span>' : '') +
        '</div>' +
        '<p class="topic-desc">' + escapeHtml(topic.description) + '</p>' +
        '<div class="topic-actions">' +
          '<select class="status-select">' +
            [STATUS.NOT_STARTED, STATUS.IN_PROGRESS, STATUS.COMPLETED].map(function (s) {
              return '<option value="' + s + '"' + (s === progress.status ? ' selected' : '') + '>' + s + '</option>';
            }).join('') +
          '</select>' +
          '<button type="button" class="link-btn notes-btn">Notes &amp; details</button>' +
          '<a class="link-btn" href="' + youtubeUrl + '" target="_blank" rel="noopener noreferrer">Watch on YouTube ↗</a>' +
        '</div>' +
      '</div>';

    const checkbox = row.querySelector('.topic-checkbox');
    checkbox.addEventListener('change', function () {
      const newStatus = checkbox.checked ? STATUS.COMPLETED : STATUS.NOT_STARTED;
      applyStatusChange(module, topic, newStatus, row);
    });

    const select = row.querySelector('.status-select');
    select.addEventListener('change', function () {
      applyStatusChange(module, topic, select.value, row);
    });

    row.querySelector('.notes-btn').addEventListener('click', function () {
      openNotesModal(module, topic);
    });

    return row;
  }

  function applyStatusChange(module, topic, newStatus, row) {
    persistProgress(module.id, topic.id, newStatus)
      .then(function () {
        renderModules();
      })
      .catch(function () { /* error toast already shown */ });
  }

  // =========================================================================
  // NOTES MODAL
  // =========================================================================
  function openNotesModal(module, topic) {
    const progress = getTopicProgress(module.id, topic.id);
    state.activeTopicKey = { moduleId: module.id, topicId: topic.id };

    el.notesModalTitle.textContent = topic.title;
    el.notesModalSubtitle.textContent = module.title;
    el.notesStatusSelect.value = progress.status;
    el.notesTextarea.value = progress.notes || '';
    el.notesYoutubeLink.href = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(topic.youtubeQuery);
    el.notesSavedLabel.classList.add('hidden');

    el.notesModalOverlay.classList.remove('hidden');
    el.notesTextarea.focus();
  }

  function closeNotesModal() {
    el.notesModalOverlay.classList.add('hidden');
    state.activeTopicKey = null;
  }

  el.notesModalCloseBtn.addEventListener('click', closeNotesModal);
  el.notesCancelBtn.addEventListener('click', closeNotesModal);
  el.notesModalOverlay.addEventListener('click', function (e) {
    if (e.target === el.notesModalOverlay) closeNotesModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !el.notesModalOverlay.classList.contains('hidden')) {
      closeNotesModal();
    }
  });

  el.notesSaveBtn.addEventListener('click', function () {
    if (!state.activeTopicKey) return;
    const { moduleId, topicId } = state.activeTopicKey;
    const status = el.notesStatusSelect.value;
    const notes = el.notesTextarea.value;

    el.notesSaveBtn.disabled = true;
    persistProgress(moduleId, topicId, status, notes)
      .then(function () {
        el.notesSaveBtn.disabled = false;
        el.notesSavedLabel.classList.remove('hidden');
        renderModules();
        setTimeout(closeNotesModal, 500);
      })
      .catch(function () {
        el.notesSaveBtn.disabled = false;
      });
  });

  // =========================================================================
  // UTIL
  // =========================================================================
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  // =========================================================================
  // BOOT
  // =========================================================================
  initTheme();
  renderModules();
  renderOverview();
})();
