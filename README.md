# 圖解數學小鎮 · math-visual-village

Traditional Chinese interactive high-school learning materials, maintained by [Timothy104005](https://github.com/Timothy104005).

開源版 v0.1.0，發布日期 2026-10-21。包含 **89 個互動單元**。原創程式採 MIT，原創教材採 CC BY 4.0。既有[線上網站](https://math-visual-village.pages.dev/)包含其他功能與素材，與本開源版的散布範圍不同。

我們希望學生能提出反例與看不懂的地方、教師能審校觀念與適用範圍、開發者能改善模型與操作體驗。目前沒有可據以宣稱已形成教師審校社群或學校採用的證據；這是開放共學的起點。

## 在自己的電腦執行

需要 Node.js 22 以上。啟動還需要 Python 3；瀏覽教材不需安裝 Python 相依套件。

```sh
npm start
```

開啟 http://127.0.0.1:8765/ 。預設無雲端帳號，核心單元可在本機使用；進度存於瀏覽器。公式渲染檔案隨附，部分外部字型與來源連結仍需網路。本專案沒有宣稱每個頁面完全離線。

## 驗證

```sh
npm run check
npm run check:seo
npm run coverage
```

重建單元練習另需 Python 的 sympy（requirements-build.txt），執行 npm run build:practice；首版每單元題數依現有原創題目而定，不固定五題。

## 修改單元

`site/assets/js/catalog.js` 是目錄；`site/units/<slug>.js` 定義內容／互動，對應 HTML 是入口。共用元件在 `site/assets/js/core.js`，樣式在 `site/assets/css/`。npm run build:seo 重建可供搜尋引擎讀取的靜態內容。

先讀 [貢獻指南](CONTRIBUTING.md)、[教材／模型審查流程](docs/REVIEW.md)、[來源與首版範圍](docs/PROVENANCE.md)。課綱代碼有對應單元，僅代表「已認領」，不等於學習效果或內容品質保證。

## 授權與維護

原創程式 MIT、原創教材 CC BY 4.0；詳見 [授權範圍](LICENSING.md) 與 [第三方聲明](THIRD_PARTY_NOTICES.md)。回報時不需提供姓名、學校、成績或帳號資料；請附單元名稱、重現步驟、預期結果及可公開的來源。

## 完整單元載入檢查（選用）

需另裝 Playwright 1.62.1 並有 Chrome，或用 PLAYWRIGHT_MODULE 指向既有模組。啟動本機伺服器，將 SMOKE_URL 設為該本機網址後執行 `npm run test:browser`。這項檢查阻擋外部網路，逐頁確認單元初始化、標題、JavaScript 錯誤與帳號停用狀態，不等於逐個操作所有控制項，也不是學科正確性認證。

首版網站輸出目錄是 `site/`，不是倉庫根目錄。自行部署時須設定輸出目錄，並保留自己的網域／canonical 設定；本版不會自動更新現有正式站。

Software: MIT. Original educational content: CC BY 4.0. Contributions, corrections, counterexamples and model checks are welcome; see CONTRIBUTING.md.
