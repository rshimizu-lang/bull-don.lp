# bull-don.lp

> **層：運用層（operations）｜事実変化はAIが差分提示→承認後に更新可。**

## このリポジトリについて
ブルドン合同会社のLP（ランディングページ）。
GitHub Pagesで lp.bull-don.com に公開中。

**publicリポジトリ**（GitHub Pages・履歴含め全公開）。禁止物は法律層 `../.claude/rules/public-repo-guard.md` を正本とする。

FORM_TOKENは公開前提のbot対策トークン（機密ではない）。値変更時は受信側GASのScriptPropertyも同時更新すること。

## 技術スタック
- 静的HTML/CSS/JS
- GitHub Pages（CNAME: lp.bull-don.com）

## ファイル構成
- index.html : LP本体
- privacy.html : プライバシーポリシー
- assets/css/style.css
- assets/js/form.js
- assets/images/ : ロゴ・スクリーンショット等

## 開発ルール
- ファイルは assets/ 配下に整理する（ルート直下にCSSやJSを置かない）
- mainブランチへのpushで自動デプロイされる
- HTTPSは強制設定済み

## 関連

- 資料請求フォームの送信先（Production デプロイURL）は `assets/js/form.js` の `GAS_ENDPOINT` を参照。現在の受け口は別プロジェクトへ移管済み（詳細は private リポ側のガバナンス文書を参照）。
  - 旧受け口: `../bull-don.lp-backend/`（rshimizu-lang/bull-don.lp-backend）・2026-06-04停止

## 上位ルール

ワークスペース `../.claude/rules/`（bulldon-workspace）を継承（commit-style / _meta-rules / brand-design / public-repo-guard）。
GAS リポジトリではないため `gas-architecture.md` / `b-pass-design.md` は対象外。全体の正本は `../AGENTS.md`。
