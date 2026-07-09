# bull-don.lp

> **層：運用層（operations）｜事実変化はAIが差分提示→承認後に更新可。**

## このリポジトリについて
ブルドン合同会社のLP（ランディングページ）。
GitHub Pagesで lp.bull-don.com に公開中。

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

- 詳細仕様: `../_shared/`
- 資料請求フォームのバックエンドGAS: `../bull-don.lp-backend/`（rshimizu-lang/bull-don.lp-backend）
  - `assets/js/form.js` の `GAS_ENDPOINT` がそのWebアプリのデプロイURL

## 上位ルール

ワークスペース `../.claude/rules/`（bulldon-workspace）を継承（commit-style / _meta-rules / brand-design）。
GAS リポジトリではないため `gas-architecture.md` / `b-pass-design.md` は対象外。全体の正本は `../AGENTS.md`。
