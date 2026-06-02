// ─── GAS エンドポイント ───────────────────────────────
// Phase D-4-β: 営業エンジン dev URL に切替。本番切替は Phase D-4-δ で実施。
const GAS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbys570cuMyrN26KstaUvY9J_1lrWS1C_S3G9XTSlAgmae2bn14w_UQIykyd7Hcg-Hx2Jg/exec';

// ─── ?lid= から lead_id 受信 ─────────────────────────
// 営業メール経由訪問者の lead_id を hidden field に自動セット
// UI 上の可視サインは出さない（清水判断）
const leadIdInput = document.getElementById('lead_id');
if (leadIdInput) {
  const params = new URLSearchParams(window.location.search);
  const lid = params.get('lid');
  if (lid) {
    leadIdInput.value = lid;
  }
}

// ─── ?src= から流入チャネル受信 ───────────────────────
// チラシQR等のキャンペーン流入元（例: post_omiya_202607）を捕捉。
// 判別ロジック本体（EMAIL/CAMPAIGN/ORGANIC）はGAS側②。LPは src 値を渡すのみ。
const src = new URLSearchParams(window.location.search).get('src') || '';

// ─── GA4：流入チャネル別イベント（訪問の可視化） ──────
// <head> のGA4スニペットで gtag が定義済み（form.js は body末尾で後に読まれる）。
if (typeof gtag === 'function') {
  if (src) {
    gtag('event', 'campaign_visit', { campaign_id: src });   // チラシ等キャンペーン経由
  } else if (leadIdInput && leadIdInput.value) {
    gtag('event', 'email_visit');                            // 営業メール（lid）経由
  }
  // 上記いずれでもなければオーガニック（page_view のみ）
}

// ─── フォーム送信 ────────────────────────────────────
const form      = document.getElementById('requestForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const company = document.getElementById('company').value.trim();
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const plan    = document.getElementById('plan').value;
    const areas   = Array.from(
      document.querySelectorAll('input[name="areas"]:checked')
    ).map(el => el.value);
    const lead_id = leadIdInput ? leadIdInput.value : '';

    if (!company || !name || !email) {
      alert('会社名・氏名・メールアドレスは必須です。');
      return;
    }
    if (!isValidEmail(email)) {
      alert('正しいメールアドレスを入力してください。');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    try {
      await fetch(GAS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, name, email, plan, areas, lead_id, src }),
      });
      form.style.display = 'none';
      formSuccess.style.display = 'block';
    } catch (err) {
      alert('送信に失敗しました。時間をおいて再度お試しください。');
      submitBtn.disabled = false;
      submitBtn.textContent = '資料を無料で受け取る';
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ─── Rippleエフェクト ────────────────────────────────
document.querySelectorAll('.btn-hero, .btn-primary, .btn-submit, .header-cta').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width  = ripple.style.height = size + 'px';
    ripple.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ─── スクロール入場（Intersection Observer） ─────────
document.body.classList.add('js-ready');
const revealEls = document.querySelectorAll('.reveal');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// ─── カウントアップ ──────────────────────────────────
const statNums = document.querySelectorAll('.stat-num');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el       = entry.target;
    const unit     = el.querySelector('.stat-unit');
    const unitText = unit ? unit.outerHTML : '';
    const rawText  = el.textContent.trim();
    const target   = parseFloat(rawText);
    if (isNaN(target)) return;

    const isDecimal = rawText.includes('.');
    const duration  = 1200;
    const start     = performance.now();

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;
      el.innerHTML   = (isDecimal ? current.toFixed(1) : Math.floor(current)) + unitText;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });

statNums.forEach(el => countObserver.observe(el));
