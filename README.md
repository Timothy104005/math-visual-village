# 圖解數學小鎮

高中數學「公式圖像推導」學習網站。內容依 108 課綱（高一共同必修、數學 A／B、選修數學甲），教學設計參考 Jo Boaler 的數學心態研究。

## 怎麼打開

- **直接雙擊** `index.html` 就能用（不需要安裝任何東西）。
- 要放上網：把整個 `site/` 資料夾上傳到任何靜態空間（GitHub Pages、Netlify、學校伺服器）。
- 開發時想用本機伺服器（不快取）：`python tools/serve.py`，再開 http://localhost:8765

字體從 Google Fonts 載入，沒有網路時會退回系統字體；公式排版用的 KaTeX 已經放在 `assets/vendor/katex/`，離線也能正常顯示。

## 檔案結構

```
index.html                 首頁：學習原則、小鎮地圖、已開放單元
assets/css/storybook.css   全站設計系統（色票、手繪外框、元件、上課模式）
assets/js/catalog.js       課程目錄：地區、單元、年級、課綱代碼、小路連結
assets/js/core.js          共用元件庫 SK：步驟播放器、選擇題、滑桿、拖曳、上課模式、mountUnit
assets/js/home.js          首頁
units/<slug>.js            每個單元的內容與互動圖（一個檔案一個單元）
units/<slug>.html          由 tools/make-unit-pages.js 產生的外殼，不用手改
tools/                     產生頁面、開發伺服器
```

## 新增一個單元

1. 在 `assets/js/catalog.js` 的 `units` 找到（或新增）那一筆，把 `ready` 改成 `true`，補上 `tex`（卡片上的代表公式），需要的話加進 `order`。
2. 複製任何一個 `units/*.js` 當範本，改成新的 `slug`。每個單元都是一次 `SK.mountUnit({...})`，六段依序是：
   `hook`（好奇入口）→ `guess`（選擇題預測，每個選項都有 `explain`）→ `derive`（`frames` 步驟 + `setup` 畫互動圖）→ `angles`（換個角度看）→ `challenges`（天花板挑戰）→ `where`（課綱代碼、考試、停止線）。
3. 執行 `node tools/make-unit-pages.js` 產生 HTML 外殼。

公式裡可以用和圖形同色的巨集：`\co{}` 橘、`\cb{}` 藍、`\cg{}` 綠、`\cp{}` 粉紅、`\cy{}` 金、`\cv{}` 紫。

## 上課模式

每個單元右上角的「上課模式」：全螢幕、放大字體、一次顯示一段；鍵盤 ← → 或簡報筆會先推進推導步驟，再換到下一段；按 Esc 離開。
