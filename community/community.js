// ─── COMMUNITY フォームの送信先 ───────────────────────
// COMMUNITY 専用の軽量 doPost（別リポ・未実装）。差し替えはこの1行のみで完結する。
// 'PENDING_DEPLOYMENT' の間は送信せず、メールでの問い合わせ案内を表示する。
const COMMUNITY_FORM_ENDPOINT = 'PENDING_DEPLOYMENT'; // TODO: バックエンド構築後に差し替え

// 法人版の送信機構（../assets/js/form.js）は #requestForm 等の id にのみ結び付いている。
// 本ページはそれらの id を持たないため、form.js はここでは送信を行わない（reveal・Ripple のみ働く）。
// form.js の top-level 宣言（form / src 等）と衝突しないよう、以下は即時関数に閉じる。
(() => {
  const cmForm    = document.getElementById('communityForm');
  const cmSubmit  = document.getElementById('cmSubmit');
  const cmSuccess = document.getElementById('cmSuccess');
  const cmPending = document.getElementById('cmPending');
  if (!cmForm) return;

  const showPending = () => {
    cmPending.hidden = false;
    cmPending.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // honeypot：人間には見えない入力欄。値が入っていれば受付側が破棄する（受付側は成功を装って応答する）。
  // 欄の名前は法人版と別にする（v6-B 2-4）。LP 側の変更を本ファイルに限るため、欄は本ファイルで生成する。
  const HONEYPOT_NAME = 'homepage';
  const hpWrap = document.createElement('div');
  hpWrap.setAttribute('aria-hidden', 'true');
  hpWrap.style.cssText = 'position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;';
  const hpInput = document.createElement('input');
  hpInput.type = 'text';
  hpInput.name = HONEYPOT_NAME;
  hpInput.tabIndex = -1;
  hpInput.autocomplete = 'off';
  hpWrap.appendChild(hpInput);
  cmForm.appendChild(hpWrap);

  cmForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!cmForm.reportValidity()) return;

    if (!COMMUNITY_FORM_ENDPOINT || COMMUNITY_FORM_ENDPOINT === 'PENDING_DEPLOYMENT') {
      showPending();
      return;
    }

    const value = (id) => document.getElementById(id).value.trim();
    const payload = {
      name:    value('cm-name'),
      email:   value('cm-email'),
      team:    value('cm-team'),
      area:    value('cm-area'),
      members: value('cm-members'),
      message: value('cm-message'),
      [HONEYPOT_NAME]: hpInput.value,
    };

    // 送信方式：法人版 form.js と同じく GAS の doPost へ JSON を POST する。
    // ただし法人版の mode:'no-cors' では応答を読めず、受付側の {"ok":false} を検出できない（v6-B 2-7）。
    // text/plain の単純リクエスト（プリフライトなし）を CORS で送り、応答の JSON を読む。
    // 応答が読めない・ok が true でない場合はすべて失敗として扱う（fail-closed）。
    cmSubmit.disabled = true;
    cmPending.hidden = true;
    let ok = false;
    try {
      const res = await fetch(COMMUNITY_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      ok = res.ok && data !== null && typeof data === 'object' && data.ok === true;
    } catch (err) {
      ok = false;
    }
    if (ok) {
      cmForm.hidden = true;
      cmSuccess.hidden = false;
    } else {
      cmSubmit.disabled = false;
      showPending();
    }
  });
})();
