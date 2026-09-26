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
    };

    cmSubmit.disabled = true;
    try {
      await fetch(COMMUNITY_FORM_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      cmForm.hidden = true;
      cmSuccess.hidden = false;
    } catch (err) {
      cmSubmit.disabled = false;
      showPending();
    }
  });
})();
