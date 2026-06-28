/**
 * share.js — 分享功能模块
 * 使用 html2canvas 截图生成分享图片
 */

window.SoulShare = {

  /**
   * 生成分享图片并触发下载
   */
  async captureReport() {
    const el = document.getElementById('report-container');
    if (!el) return;

    // 显示加载提示
    const tip = this.showTip('正在生成分享图片...');

    try {
      // 动态加载 html2canvas（带超时 + 备用 CDN）
      if (!window.html2canvas) {
        const CDNS = [
          'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
          'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        ];
        let loaded = false;
        for (const url of CDNS) {
          try {
            await this.loadScript(url, 8000);
            loaded = true;
            break;
          } catch (e) {
            console.warn('[SoulShare] CDN 加载失败，尝试备用源:', url, e.message);
          }
        }
        if (!loaded) throw new Error('所有 CDN 加载失败');
      }

      const canvas = await html2canvas(el, {
        backgroundColor: '#0a0a2e',
        scale: 2,
        useCORS: true,
        logging: false,
        width: el.scrollWidth,
        height: el.scrollHeight
      });

      // 添加水印
      this.addWatermark(canvas);

      // 下载
      const link = document.createElement('a');
      link.download = `灵魂解码_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      this.updateTip(tip, '✅ 图片已保存');
      setTimeout(() => tip.remove(), 2000);

    } catch (e) {
      console.error('截图失败:', e);
      this.updateTip(tip, '📱 截图生成失败，请使用系统截屏功能（音量键+电源键）');
      setTimeout(() => tip.remove(), 4000);
    }
  },

  /**
   * 添加水印
   */
  addWatermark(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#ffffff';
    ctx.font = `${canvas.width * 0.025}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('灵魂解码 · 仅供娱乐', canvas.width / 2, canvas.height - canvas.width * 0.04);
    ctx.restore();
  },

  /**
   * 生成链接签名
   */
  _signData(data) {
    // 简单 HMAC 风格签名：内容 + 固定密钥的 SHA-256 模拟
    // 注意：这是前端防篡改，非加密安全
    const str = JSON.stringify(data) + 'soul_secret_2026';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  /**
   * 复制结果链接（使用 URL hash 存储关键数据）
   */
  copyShareLink(scores, enneagram) {
    const data = {
      s: [scores.openness, scores.conscientiousness, scores.extraversion, scores.agreeableness, scores.neuroticism],
      e: enneagram.type
    };
    data.k = this._signData(data);
    const hash = btoa(JSON.stringify(data));
    const url = `${location.origin}${location.pathname}#r=${hash}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        this.showTemporaryTip('✅ 链接已复制');
      });
    } else {
      // fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.showTemporaryTip('✅ 链接已复制');
    }
  },

  /**
   * 解析分享链接
   */
  parseShareLink() {
    const hash = location.hash;
    if (!hash.startsWith('#r=')) return null;
    try {
      const data = JSON.parse(atob(hash.slice(3)));
      // 验证签名
      const expected = this._signData(data);
      if (data.k !== expected) return null;
      return {
        scores: {
          openness: data.s[0],
          conscientiousness: data.s[1],
          extraversion: data.s[2],
          agreeableness: data.s[3],
          neuroticism: data.s[4]
        },
        enneagramType: data.e
      };
    } catch {
      return null;
    }
  },

  /**
   * 动态加载外部脚本（带超时）
   */
  loadScript(src, timeoutMs = 10000) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('加载超时')), timeoutMs);
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); reject(new Error('加载失败')); };
      document.head.appendChild(script);
    });
  },

  showTip(text) {
    const tip = document.createElement('div');
    tip.className = 'share-tip';
    tip.textContent = text;
    document.body.appendChild(tip);
    return tip;
  },

  updateTip(el, text) {
    if (el) el.textContent = text;
  },

  showTemporaryTip(text) {
    const tip = this.showTip(text);
    setTimeout(() => tip.remove(), 2500);
  }
};
