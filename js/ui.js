/**
 * ui.js — 灵魂解码 UI 控制模块
 * 页面状态管理、题目展示、动画控制
 */

// ═══ 安全 HTML 工具 ═══
// 替代 innerHTML，防止 XSS
function esc(str) {
  if (str == null) return '';
  return String(str).replace(/[&<>"']/g, function(c) {
    return '&#' + c.charCodeAt(0) + ';';
  });
}

// 安全创建 DOM 元素
function el(tag, attrs, ...children) {
  const e = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(function(_ref) {
      var k = _ref[0], v = _ref[1];
      if (k === 'className') { e.className = v; }
      else if (k === 'dataset') { Object.assign(e.dataset, v); }
      else if (k === 'style') { Object.assign(e.style, v); }
      else if (v != null) { e.setAttribute(k, v); }
    });
  }
  children.forEach(function(c) {
    if (c instanceof Node) e.appendChild(c);
    else if (c != null) e.appendChild(document.createTextNode(String(c)));
  });
  return e;
}

// 清空容器辅助
function empty(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

// 安全 HTML 标签模板：自动转义所有插值变量，防止 XSS
function html(strings) {
  var result = strings[0];
  for (var i = 1; i < arguments.length; i++) {
    var val = arguments[i];
    if (Array.isArray(val)) {
      // 数组（如 map 结果）拼接前整体转义
      result += val.map(function(v) { return esc(v); }).join('');
    } else {
      result += esc(val);
    }
    result += strings[i];
  }
  return result;
}

// ═══ 全局错误边界 ═══
window.addEventListener('error', function(e) {
  console.error('[SoulUI] 全局未捕获错误:', e.error || e.message || e);
  SoulUI.showError('页面遇到了一个意外错误，请刷新页面重试。如问题持续，请联系管理员。');
  return true;
});

window.addEventListener('unhandledrejection', function(e) {
  console.error('[SoulUI] 未处理的 Promise 拒绝:', e.reason);
  SoulUI.showError('页面请求失败，请检查网络后刷新重试。');
  return true;
});

window.SoulUI = (() => {

  // ═══ 状态 ═══
  const state = {
    currentQuestion: 0,
    answers: [],        // [{questionId, choice}]
    result: null,       // scoring result
    report: null,       // report object
    phase: 'welcome'    // welcome | quiz | loading | report
  };

  const STORAGE_KEY = 'soul_quiz_state';

  // ═══ DOM 引用（运行时绑定） ═══
  let els = {};

  /**
   * 初始化
   */
  function init() {
    cacheElements();
    bindEvents();
    drawStarfield();

    // 检查是否从分享链接进入
    const shared = window.SoulShare.parseShareLink();
    if (shared) {
      showSharedReport(shared);
      return;
    }

    // 恢复未完成的答题进度
    restoreProgress();
  }

  /**
   * 保存答题进度到 localStorage
   */
  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        currentQuestion: state.currentQuestion,
        answers: state.answers,
        phase: state.phase === 'quiz' ? 'quiz' : null
      }));
    } catch (e) { /* quota exceeded, ignore */ }
  }

  /**
   * 从 localStorage 恢复进度
   */
  function restoreProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.phase === 'quiz' && data.answers && data.answers.length > 0) {
        state.currentQuestion = data.currentQuestion || 0;
        state.answers = data.answers;
        showScreen('quiz');
        renderQuestion();
      }
    } catch (e) { /* corrupted data, ignore */ }
  }

  /**
   * 清除保存的进度
   */
  function clearSavedProgress() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function cacheElements() {
    els = {
      welcome: document.getElementById('welcome-screen'),
      quiz: document.getElementById('quiz-screen'),
      loading: document.getElementById('loading-screen'),
      report: document.getElementById('report-screen'),
      progressBar: document.getElementById('progress-bar'),
      progressText: document.getElementById('progress-text'),
      questionArea: document.getElementById('question-area'),
      btnStart: document.getElementById('btn-start'),
      btnBack: document.getElementById('btn-back'),
      btnRestart: document.getElementById('btn-restart'),
      btnShare: document.getElementById('btn-share'),
      btnSave: document.getElementById('btn-save'),
      reportContainer: document.getElementById('report-container'),
      canvas: document.getElementById('starfield')
    };
  }

  function bindEvents() {
    els.btnStart.addEventListener('click', startQuiz);
    els.btnBack.addEventListener('click', goBack);
    els.btnRestart.addEventListener('click', restart);
    els.btnShare.addEventListener('click', shareReport);
    els.btnSave.addEventListener('click', saveReport);

    // 触摸优化
    document.addEventListener('touchstart', () => {}, { passive: true });
  }

  // ═══ 页面切换 ═══

  function showScreen(phase) {
    state.phase = phase;
    ['welcome', 'quiz', 'loading', 'report'].forEach(s => {
      els[s].classList.toggle('active', s === phase);
    });
  }

  // ═══ 欢迎页 ═══

  function startQuiz() {
    state.currentQuestion = 0;
    state.answers = [];
    showScreen('quiz');
    renderQuestion();
  }

  // ═══ 答题页 ═══

  function renderQuestion() {
    const q = window.SOUL_QUESTIONS[state.currentQuestion];
    if (!q) return;

    // 更新进度
    const total = window.SOUL_QUESTIONS.length;
    const pct = Math.round((state.currentQuestion / total) * 100);
    els.progressBar.style.width = pct + '%';
    els.progressText.textContent = `${state.currentQuestion + 1} / ${total}`;
    // 更新无障碍进度值
    const track = els.progressBar.parentElement;
    if (track) track.setAttribute('aria-valuenow', pct);

    // 返回按钮可见性
    els.btnBack.style.visibility = state.currentQuestion > 0 ? 'visible' : 'hidden';

    // 渲染题目
    const area = els.questionArea;
    empty(area);

    const card = document.createElement('div');
    card.className = 'question-card fade-in';

    // 维度标签
    const dimLabel = document.createElement('div');
    dimLabel.className = 'dimension-badge';
    dimLabel.textContent = q.dimension;
    card.appendChild(dimLabel);

    // 题目文本
    const title = document.createElement('h2');
    title.className = 'question-text';
    title.textContent = q.text;
    card.appendChild(title);

    // 选项
    const optionsEl = document.createElement('div');

    if (q.type === 'scenario') {
      optionsEl.className = 'options-grid';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-card';
        btn.dataset.id = opt.id;
        btn.appendChild(el('span', {className:'option-id'}, opt.id));
        btn.appendChild(el('span', {className:'option-text'}, opt.text));
        btn.addEventListener('click', () => selectOption(q.id, opt.id));
        optionsEl.appendChild(btn);
      });
    } else if (q.type === 'likert') {
      optionsEl.className = 'options-likert';
      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-likert';
        btn.dataset.id = opt.id;
        btn.appendChild(el('span', {className:'likert-num'}, opt.id));
        btn.appendChild(el('span', {className:'likert-text'}, opt.text));
        btn.addEventListener('click', () => selectOption(q.id, opt.id));
        optionsEl.appendChild(btn);
      });
    } else if (q.type === 'ranking') {
      optionsEl.className = 'options-ranking';
      empty(optionsEl);
      optionsEl.appendChild(el('p', {className:'ranking-hint'}, '拖拽排列，最上面 = 最重要'));

      const list = document.createElement('div');
      list.className = 'ranking-list';
      list.id = 'ranking-list';
      list.setAttribute('role', 'listbox');
      list.setAttribute('aria-label', '拖拽排序，使用上下方向键调整顺序');

      q.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'ranking-item';
        item.draggable = true;
        item.dataset.id = opt.id;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-posinset', idx + 1);
        item.setAttribute('aria-setsize', q.options.length);
        item.tabIndex = 0;

        // 拖拽手柄
        item.appendChild(el('span', {className:'rank-handle', 'aria-hidden':'true'}, '☰'));
        item.appendChild(el('span', {className:'rank-text'}, opt.text));

        // 上移/下移按钮（无障碍替代操作）
        const btnUp = el('button', {
          className:'rank-btn-up', 'aria-label':'上移此项',
          type:'button', style:{background:'none', border:'none', color:'rgba(240,240,240,0.5)', cursor:'pointer', fontSize:'0.9rem', padding:'2px 6px'}
        }, '▲');
        const btnDown = el('button', {
          className:'rank-btn-down', 'aria-label':'下移此项',
          type:'button', style:{background:'none', border:'none', color:'rgba(240,240,240,0.5)', cursor:'pointer', fontSize:'0.9rem', padding:'2px 6px'}
        }, '▼');

        btnUp.addEventListener('click', function(e) { e.stopPropagation(); moveRankItem(item, -1, container); });
        btnDown.addEventListener('click', function(e) { e.stopPropagation(); moveRankItem(item, 1, container); });

        item.appendChild(btnUp);
        item.appendChild(btnDown);
        list.appendChild(item);
      });

      optionsEl.appendChild(list);

      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn-confirm-ranking';
      confirmBtn.textContent = '确认排序';
      confirmBtn.setAttribute('aria-label', '确认当前排序结果并进入下一题');
      confirmBtn.addEventListener('click', () => confirmRanking(q.id));
      optionsEl.appendChild(confirmBtn);

      // 等 DOM 渲染后再绑定拖拽
      requestAnimationFrame(() => initDragSort(list));
    }

    card.appendChild(optionsEl);
    area.appendChild(card);

    // 恢复之前的选择
    const existing = state.answers.find(a => a.questionId === q.id);
    if (existing) {
      if (q.type === 'ranking' && Array.isArray(existing.choice)) {
        // 恢复排序顺序
        requestAnimationFrame(() => {
          const list = document.getElementById('ranking-list');
          if (!list) return;
          existing.choice.forEach(optId => {
            const item = list.querySelector(`[data-id="${optId}"]`);
            if (item) list.appendChild(item);
          });
          updateRankNumbers(list);
        });
      } else if (q.type !== 'ranking') {
        const btn = area.querySelector(`[data-id="${existing.choice}"]`);
        if (btn) btn.classList.add('selected');
      }
    }
  }

  function selectOption(questionId, choice) {
    // 更新答案
    const idx = state.answers.findIndex(a => a.questionId === questionId);
    if (idx >= 0) {
      state.answers[idx].choice = choice;
    } else {
      state.answers.push({ questionId, choice });
    }

    // 视觉反馈
    const q = window.SOUL_QUESTIONS.find(q => q.id === questionId);
    const containerClass = q.type === 'scenario' ? '.option-card' : '.option-likert';
    document.querySelectorAll(containerClass).forEach(el => {
      el.classList.toggle('selected', String(el.dataset.id) === String(choice));
    });

    // 延迟跳转下一题
    setTimeout(() => {
      saveProgress();
      if (state.currentQuestion < window.SOUL_QUESTIONS.length - 1) {
        state.currentQuestion++;
        const card = document.querySelector('.question-card');
        if (card) {
          card.classList.remove('fade-in');
          card.classList.add('slide-out-left');
          setTimeout(() => renderQuestion(), 300);
        } else {
          renderQuestion();
        }
      } else {
        finishQuiz();
      }
    }, 400);
  }

  function confirmRanking(questionId) {
    const list = document.getElementById('ranking-list');
    if (!list) return;

    const order = Array.from(list.children).map(item => item.dataset.id);
    const idx = state.answers.findIndex(a => a.questionId === questionId);
    if (idx >= 0) {
      state.answers[idx].choice = order;
    } else {
      state.answers.push({ questionId, choice: order });
    }

    // 跳转
    saveProgress();
    if (state.currentQuestion < window.SOUL_QUESTIONS.length - 1) {
      state.currentQuestion++;
      renderQuestion();
    } else {
      finishQuiz();
    }
  }

  function goBack() {
    if (state.currentQuestion > 0) {
      state.currentQuestion--;
      renderQuestion();
      saveProgress();
    }
  }

  // ═══ 拖拽排序（PointerEvent 统一触屏/鼠标） ═══

  function initDragSort(container) {
    let dragItem = null;
    let isPointerDown = false;

    // 阻止页面在拖拽时滚动/缩放
    container.addEventListener('touchstart', e => {
      if (e.target.closest('.ranking-item')) {
        // iOS Safari 需要主动阻止默认行为才能抑制滚动
      }
    }, { passive: true });

    container.addEventListener('pointerdown', e => {
      const item = e.target.closest('.ranking-item');
      if (!item) return;
      dragItem = item;
      isPointerDown = true;
      item.classList.add('dragging');
      item.setPointerCapture(e.pointerId);
      // 阻止页面滑动
      container.style.touchAction = 'none';
    });

    container.addEventListener('pointermove', e => {
      if (!dragItem || !isPointerDown) return;
      e.preventDefault();
      const afterElement = getDragAfterElement(container, e.clientY);
      if (afterElement) {
        container.insertBefore(dragItem, afterElement);
      } else {
        container.appendChild(dragItem);
      }
    });

    container.addEventListener('pointerup', e => {
      if (!dragItem) return;
      dragItem.classList.remove('dragging');
      dragItem.releasePointerCapture(e.pointerId);
      updateRankNumbers(container);
      dragItem = null;
      isPointerDown = false;
      container.style.touchAction = '';
    });

    container.addEventListener('pointercancel', e => {
      if (!dragItem) return;
      dragItem.classList.remove('dragging');
      if (dragItem.releasePointerCapture) {
        dragItem.releasePointerCapture(e.pointerId);
      }
      updateRankNumbers(container);
      dragItem = null;
      isPointerDown = false;
      container.style.touchAction = '';
    });

    // 键盘操作：上下方向键调整排序
    container.addEventListener('keydown', e => {
      const item = e.target.closest('.ranking-item');
      if (!item) return;

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        moveRankItem(item, e.key === 'ArrowUp' ? -1 : 1, container);

        updateRankNumbers(container);
        item.focus();
        return;
      }

      // Home / End 移到最前 / 最后
      if (e.key === 'Home') {
        e.preventDefault();
        container.insertBefore(item, container.firstChild);
        updateRankNumbers(container);
        item.focus();
      }
      if (e.key === 'End') {
        e.preventDefault();
        container.appendChild(item);
        updateRankNumbers(container);
        item.focus();
      }
    });
  }

  function getDragAfterElement(container, y) {
    const items = [...container.querySelectorAll('.ranking-item:not(.dragging)')];
    return items.reduce((closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      }
      return closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
  }

  function updateRankNumbers(container) {
    container.querySelectorAll('.ranking-item').forEach((item, i) => {
      item.querySelector('.rank-handle').textContent = '' + (i + 1) + '.';
    });
  }

  // 移动排序项（供上下按钮和键盘操作使用）
  function moveRankItem(item, direction, container) {
    const items = [...container.querySelectorAll('.ranking-item')];
    const idx = items.indexOf(item);
    if (idx < 0) return;

    if (direction === -1 && idx > 0) {
      container.insertBefore(item, items[idx - 1]);
    } else if (direction === 1 && idx < items.length - 1) {
      container.insertBefore(item, items[idx + 1].nextSibling);
    } else {
      return;
    }
    updateRankNumbers(container);
  }

  // ═══ 完成答题 ═══

  function finishQuiz() {
    try {
      clearSavedProgress();
      showScreen('loading');
      startLoadingAnimation();

      // 记录开始时间，保证最短动画展示
      const loadStart = Date.now();
      const MIN_LOAD_MS = 800;

      // 延迟一小段时间让加载动画启动
      setTimeout(async () => {
        try {
          // 1. 评分
          state.result = window.SoulScoring.evaluate(state.answers);

          // 2. 生成报告
          state.report = window.SoulReport.generate(state.result.scores, state.result.enneagram);

          // 3. Webhook 推送（静默）
          window.SoulWebhook.send(state.result, state.report, state.answers);

          // 4. 确保最短动画时间，避免闪屏
          const elapsed = Date.now() - loadStart;
          if (elapsed < MIN_LOAD_MS) {
            await new Promise(r => setTimeout(r, MIN_LOAD_MS - elapsed));
          }

          // 5. 渲染报告
          stopLoadingAnimation();
          renderReport();
          showScreen('report');
        } catch (innerErr) {
          console.error('[SoulUI] 报告生成失败:', innerErr);
          stopLoadingAnimation();
          SoulUI.showError('报告生成失败，请刷新页面重试。');
          showScreen('welcome');
        }
      }, 300);
    } catch (err) {
      console.error('[SoulUI] finishQuiz 异常:', err);
      SoulUI.showError('答题提交失败，请刷新页面重试。');
      showScreen('welcome');
    }
  }

  // ═══ 加载动画 ═══

  let loadingAnimId = null;

  function startLoadingAnimation() {
    const canvas = document.getElementById('loading-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    const cx = w / 2;
    const cy = h / 2;
    const particles = [];

    for (let i = 0; i < 80; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 150;
      particles.push({
        angle,
        dist,
        speed: 0.005 + Math.random() * 0.01,
        radius: 1 + Math.random() * 2,
        shrink: 0.997,
        color: `hsla(${250 + Math.random() * 60}, 70%, 70%, ${0.3 + Math.random() * 0.5})`
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, w, h);

      particles.forEach(p => {
        p.dist *= p.shrink;
        if (p.dist < 5) {
          p.dist = 50 + Math.random() * 150;
          p.angle = Math.random() * Math.PI * 2;
        }
        p.angle += p.speed;

        const x = cx + Math.cos(p.angle) * p.dist;
        const y = cy + Math.sin(p.angle) * p.dist;

        ctx.beginPath();
        ctx.arc(x, y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // 中心光点
      const glowSize = 8 + Math.sin(frame * 0.05) * 3;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowSize * 3);
      gradient.addColorStop(0, 'rgba(240, 194, 127, 0.8)');
      gradient.addColorStop(0.5, 'rgba(161, 140, 209, 0.3)');
      gradient.addColorStop(1, 'rgba(161, 140, 209, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, glowSize * 3, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      frame++;
      loadingAnimId = requestAnimationFrame(animate);
    }
    animate();
  }

  function stopLoadingAnimation() {
    if (loadingAnimId) {
      cancelAnimationFrame(loadingAnimId);
      loadingAnimId = null;
    }
  }

  // ═══ 渲染报告 ═══

  function renderReport() {
    try {
      const report = state.report;
    const scores = state.result.scores;
    const container = els.reportContainer;
    container.innerHTML = '';

    // 1. 灵魂总览
    const overview = createSection('report-overview');
    overview.innerHTML = html`
      <div class="soul-type-header">
        <div class="soul-color-bar" style="background: linear-gradient(135deg, ${report.soulColor.from}, ${report.soulColor.to})"></div>
        <h1 class="soul-type-title">${report.soulType}</h1>
        <p class="soul-summary">${report.summary}</p>
      </div>
    `;
    container.appendChild(overview);

    // 2. 五维雷达图
    const radar = createSection('report-radar');
    radar.innerHTML = html`
      <h2 class="section-title">🌟 五维灵魂图谱</h2>
      <div class="radar-wrapper">
        <canvas id="radar-canvas" width="400" height="400"></canvas>
      </div>
      <div class="dimension-cards" id="dimension-cards"></div>
    `;
    container.appendChild(radar);

    // 渲染维度卡片
    const dimCards = radar.querySelector('#dimension-cards');
    Object.keys(report.dimensions).forEach(dim => {
      const d = report.dimensions[dim];
      const card = document.createElement('div');
      card.className = 'dim-card fade-in-up';
      card.innerHTML = html`
        <div class="dim-header">
          <span class="dim-icon">${d.icon}</span>
          <span class="dim-name">${d.name}</span>
          <span class="dim-score">${d.score}</span>
        </div>
        <div class="dim-bar"><div class="dim-bar-fill" style="width:0%; background: linear-gradient(90deg, ${report.soulColor.from}, ${report.soulColor.to})"></div></div>
        <p class="dim-text">${d.text}</p>
      `;
      dimCards.appendChild(card);
    });

    // 组合洞察
    const combo = document.createElement('div');
    combo.className = 'combination-insight fade-in-up';
    combo.innerHTML = html`<p class="insight-text">💎 ${report.combination}</p>`;
    dimCards.appendChild(combo);

    // 3. 九型人格
    const ennea = createSection('report-enneagram');
    ennea.innerHTML = html`
      <h2 class="section-title">🎭 灵魂深处</h2>
      <div class="enneagram-card">
        <div class="enneagram-icon">${report.enneagram.icon}</div>
        <h3 class="enneagram-name">${report.enneagram.name}</h3>
        <p class="enneagram-subtitle">九型人格 · 第${report.enneagram.type}型</p>
        <div class="enneagram-detail">
          <div class="enneagram-item">
            <span class="enneagram-label">🔥 核心动机</span>
            <p>${report.enneagram.motivation}</p>
          </div>
          <div class="enneagram-item">
            <span class="enneagram-label">💨 核心恐惧</span>
            <p>${report.enneagram.fear}</p>
          </div>
          <div class="enneagram-item">
            <span class="enneagram-label">🌱 成长方向</span>
            <p>${report.enneagram.growth}</p>
          </div>
          <div class="enneagram-item">
            <span class="enneagram-label">🤝 关系洞察</span>
            <p>${report.enneagram.relation}</p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(ennea);

    // 4. 灵魂暗面
    const shadow = createSection('report-shadow');
    shadow.innerHTML = html`
      <h2 class="section-title">🌑 灵魂暗面</h2>
      <div class="shadow-card">
        <p class="shadow-text">${report.shadow.text}</p>
        <div class="shadow-detail">
          <div class="shadow-item">
            <span class="shadow-label">⚡ 内在冲突</span>
            <p>${report.shadow.conflict}</p>
          </div>
          <div class="shadow-item">
            <span class="shadow-label">🌊 压力反应</span>
            <p>${report.shadow.stress}</p>
          </div>
        </div>
      </div>
    `;
    container.appendChild(shadow);

    // 5. 成长路径
    const growth = createSection('report-growth');
    const growthTitle = el('h2', {className:'section-title'}, '🌱 灵魂成长路径');
    const growthList = el('div', {className:'growth-list'});
    report.growth.forEach((g, i) => {
      const card = el('div', {className:'growth-card fade-in-up', style:{animationDelay: (i * 0.15) + 's'}});
      card.appendChild(el('h3', {className:'growth-title'}, g.title));
      card.appendChild(el('p', {className:'growth-text'}, g.text));
      card.appendChild(el('p', {className:'growth-psych'}, '📚 ', g.psychology));
      growthList.appendChild(card);
    });
    growth.appendChild(growthTitle);
    growth.appendChild(growthList);
    container.appendChild(growth);

    // 6. 灵魂共鸣
    const resonance = createSection('report-resonance');
    resonance.innerHTML = html`
      <h2 class="section-title">💫 灵魂共鸣</h2>
      <div class="resonance-card">
        <div class="resonance-compatible">
          <span class="resonance-label">🤝 最契合的灵魂类型</span>
          <div class="compatible-tags">
            ${report.resonance.compatible.map(function(t) { return html`<span class="compatible-tag">${t}</span>`; })}
          </div>
        </div>
        <p class="resonance-advice">${report.resonance.advice}</p>
        <div class="resonance-blessing">
          <p class="blessing-text">「${report.resonance.blessing}」</p>
        </div>
      </div>
      <div class="disclaimer">
        <p>📋 本报告基于大五人格模型（OCEAN）和九型人格理论生成，仅供娱乐参考。<br>
        心理学人格测评应由专业机构在规范环境下进行。<br>
        如有需要，请拨打全国心理援助热线：400-161-9995</p>
      </div>
    `;
    container.appendChild(resonance);

    // 绘制雷达图
    requestAnimationFrame(() => {
      drawRadarChart(scores, report.soulColor);
      animateDimensionBars();
    });
    } catch (err) {
      console.error('[SoulUI] 报告渲染失败:', err);
      SoulUI.showError('报告渲染失败，请刷新页面重试。');
    }
  }

  function createSection(id) {
    const section = document.createElement('section');
    section.id = id;
    section.className = 'report-section';
    return section;
  }

  // ═══ 雷达图绘制 ═══

  function drawRadarChart(scores, color) {
    const canvas = document.getElementById('radar-canvas');
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const size = 400;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;
    const radius = 150;
    const dims = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    const labels = ['开放性', '尽责性', '外向性', '宜人性', '神经质'];
    const icons = ['✨', '🏛️', '🌊', '💚', '🌙'];
    const n = dims.length;
    const angleStep = (Math.PI * 2) / n;
    const startAngle = -Math.PI / 2;

    const params = { ctx, cx, cy, radius, dims, labels, icons, n, angleStep, startAngle, scores, color };

    // 绘制静态元素（网格 + 轴线 + 标签）
    function drawStatic(p) {
      const { ctx, cx, cy, radius, dims, labels, icons, n, angleStep, startAngle, scores } = p;

      // 网格线
      for (let ring = 1; ring <= 5; ring++) {
        const r = (radius / 5) * ring;
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
          const angle = startAngle + angleStep * (i % n);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 轴线
      for (let i = 0; i < n; i++) {
        const angle = startAngle + angleStep * i;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 标签 + 分数
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < n; i++) {
        const angle = startAngle + angleStep * i;
        ctx.fillStyle = '#ccc';
        ctx.font = '14px sans-serif';
        ctx.fillText(icons[i] + ' ' + labels[i], cx + Math.cos(angle) * (radius + 28), cy + Math.sin(angle) * (radius + 28));
        ctx.fillStyle = '#f0c27f';
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(scores[dims[i]], cx + Math.cos(angle) * (radius + 46), cy + Math.sin(angle) * (radius + 46));
      }
    }

    // 动画绘制数据区域
    let progress = 0;
    const duration = 40;

    function frame() {
      progress++;
      const t = Math.min(progress / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);

      // 清除画布，重绘静态元素
      ctx.clearRect(0, 0, size, size);
      drawStatic(params);

      // 计算数据点
      const points = dims.map((dim, i) => {
        const angle = startAngle + angleStep * i;
        const value = (scores[dim] / 100) * radius * ease;
        return { x: cx + Math.cos(angle) * value, y: cy + Math.sin(angle) * value };
      });

      // 填充区域
      ctx.beginPath();
      points.forEach((p, i) => { if (i === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); });
      ctx.closePath();
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, color.from + '60');
      gradient.addColorStop(1, color.to + '30');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.strokeStyle = color.from;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 数据点
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color.from;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      if (t < 1) requestAnimationFrame(frame);
    }

    // 先画一帧静态的，延迟后启动动画
    drawStatic(params);
    setTimeout(() => { progress = 0; requestAnimationFrame(frame); }, 300);
  }

  function animateDimensionBars() {
    // 先设置目标宽度，再启动动画
    const cards = document.querySelectorAll('.dim-card');
    cards.forEach(card => {
      const score = card.querySelector('.dim-score');
      const bar = card.querySelector('.dim-bar-fill');
      if (score && bar) {
        bar.style.width = parseInt(score.textContent) + '%';
      }
    });
  }

  // ═══ 星空背景 ═══

  function drawStarfield() {
    const canvas = els.canvas;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const stars = [];
    const starCount = window.innerWidth < 768 ? 80 : 150;

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;
    function animate() {
      ctx.clearRect(0, 0, w, h);

      stars.forEach(star => {
        const alpha = star.alpha * (0.6 + 0.4 * Math.sin(time * star.speed + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      time++;
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      // 重算星星坐标
      const w = window.innerWidth;
      const h = window.innerHeight;
      stars.forEach(star => {
        star.x = Math.random() * w;
        star.y = Math.random() * h;
      });
    });
  }

  // ═══ 分享与重新开始 ═══

  function shareReport() {
    if (!state.result || !state.report) return;
    try {
      window.SoulShare.copyShareLink(state.result.scores, state.result.enneagram);
    } catch (err) {
      console.error('[SoulUI] 分享失败:', err);
      SoulUI.showError('链接复制失败，请手动复制页面地址。');
    }
  }

  function saveReport() {
    window.SoulShare.captureReport().catch(err => {
      console.error('[SoulUI] 保存图片失败:', err);
    });
  }

  async function restart() {
    // 如果已有报告，先弹窗确认
    if (state.result || state.report) {
      const confirmed = await SoulUI.showConfirm('重新测试', '当前报告将丢失，确认重新开始？');
      if (!confirmed) return;
    }
    clearSavedProgress();
    state.currentQuestion = 0;
    state.answers = [];
    state.result = null;
    state.report = null;
    showScreen('welcome');
  }

  // ═══ 共享链接报告 ═══

  function showSharedReport(shared) {
    showScreen('loading');
    startLoadingAnimation();

    setTimeout(() => {
      try {
        const enneagram = window.SoulScoring.matchEnneagram(shared.scores);
        state.result = { scores: shared.scores, enneagram };
        state.report = window.SoulReport.generate(shared.scores, enneagram);
        state.answers = [];

        stopLoadingAnimation();
        renderReport();
        showScreen('report');
      } catch (err) {
        console.error('[SoulUI] 共享报告生成失败:', err);
        stopLoadingAnimation();
        SoulUI.showError('报告加载失败，请重新测试。');
        showScreen('welcome');
      }
    }, 1500);
  }

  return {
    init,

    /**
     * 显示错误提示（静态方法，可在全局错误处理中调用）
     */
    showError(msg) {
      const toast = document.getElementById('error-toast');
      if (!toast) return;
      toast.textContent = msg;
      toast.style.display = 'block';
      toast.style.animation = 'none';
      // force reflow
      void toast.offsetHeight;
      toast.style.animation = 'fadeIn 0.3s';
      clearTimeout(toast._hideTimer);
      toast._hideTimer = setTimeout(() => { toast.style.display = 'none'; }, 6000);
    },

    /**
     * 显示确认弹窗
     * @param {string} title
     * @param {string} text
     * @returns {Promise<boolean>}
     */
    showConfirm(title, text) {
      return new Promise(resolve => {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.innerHTML = html`
          <div class="modal-box">
            <div class="modal-title">${title}</div>
            <div class="modal-text">${text}</div>
            <div class="modal-actions">
              <button class="modal-btn modal-btn-cancel">取消</button>
              <button class="modal-btn modal-btn-confirm">确认</button>
            </div>
          </div>
        `;
        document.body.appendChild(overlay);
        overlay.querySelector('.modal-btn-cancel').addEventListener('click', () => {
          overlay.remove();
          resolve(false);
        });
        overlay.querySelector('.modal-btn-confirm').addEventListener('click', () => {
          overlay.remove();
          resolve(true);
        });
      });
    }
  };
})();

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.SoulUI.init();

  // 注册 Service Worker（PWA 离线支持）
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.warn('[SoulUI] Service Worker 注册失败:', err);
    });
  }
});
