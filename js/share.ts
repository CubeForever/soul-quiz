/**
 * share.ts — 分享功能模块
 * 使用 html2canvas 截图生成分享图片
 */

export const SoulShare = {

  /**
   * 生成分享图片并触发下载
   */
  async captureReport(): Promise<void> {
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
          } catch (err) {
            console.warn('[SoulShare] CDN 加载失败，尝试备用源:', url, (err as Error).message);
          }
        }
        if (!loaded) throw new Error('所有 CDN 加载失败');
      }

      const canvas = await window.html2canvas!(el, {
        backgroundColor: window.SoulUtils.readCSSVar('--bg-deep') || '#0a0a2e',
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
  addWatermark(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
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
   * 简单 DJB2 哈希防篡改
   * ⚠️ 安全限制：纯前端签名可被逆向。真正的安全需要服务端签名。
   *    当前方案足以阻止普通用户随意修改 URL 参数。
   */
  _signData(data: Record<string, unknown>): string {
    // 简单 HMAC 风格签名：内容 + 固定密钥的 DJB2 哈希
    const SECRET_PARTS = [
      'soul_decoder_v1_',
      '7f3a9c2e_',
      'b8d45f1a',
      '_sign_key_2026'
    ];
    const str = JSON.stringify(data) + SECRET_PARTS.join('');
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) + hash) + chr;
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  },

  /**
   * 复制结果链接（使用 URL hash 存储关键数据）
   */
  copyShareLink(scores: NormalizedScores, enneagram: { type: number }): void {
    const data: Record<string, unknown> = {
      s: [scores.openness, scores.conscientiousness, scores.extraversion, scores.agreeableness, scores.neuroticism],
      e: enneagram.type
    };
    data.k = this._signData(data);
    const hash = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}#r=${hash}`;

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
  parseShareLink(): SharedReportData | null {
    const hash = window.location.hash;
    if (!hash.startsWith('#r=')) return null;
    try {
      const raw = JSON.parse(atob(hash.slice(3))) as Record<string, unknown>;
      const sig = raw.k as string;
      delete raw.k;
      const expected = this._signData(raw);
      if (sig !== expected) return null;
      const s = raw.s as number[];
      return {
        scores: {
          openness: s[0],
          conscientiousness: s[1],
          extraversion: s[2],
          agreeableness: s[3],
          neuroticism: s[4]
        },
        enneagramType: raw.e as number
      };
    } catch {
      return null;
    }
  },

  /**
   * 动态加载外部脚本（带超时）
   */
  loadScript(src: string, timeoutMs: number = 10000): Promise<void> {
    return new Promise<void>(function(resolve, reject) {
      const timer = setTimeout(() => reject(new Error('加载超时')), timeoutMs);
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); reject(new Error('加载失败')); };
      document.head.appendChild(script);
    });
  },

  showTip(text: string): HTMLElement {
    const tip = document.createElement('div');
    tip.className = 'share-tip';
    tip.textContent = text;
    document.body.appendChild(tip);
    return tip;
  },

  updateTip(el: HTMLElement, text: string): void {
    if (el) el.textContent = text;
  },

  showTemporaryTip(text: string): void {
    const tip = this.showTip(text);
    setTimeout(() => tip.remove(), 2500);
  }
};

// Backward compatibility bridge
window.SoulShare = SoulShare;
