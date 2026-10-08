# 傳奇卡牌工坊 (Legendary Card Forge) · 3D 鐳射黑金浮雕專屬卡牌

> **No.001/001 ★★★★★★ SAR · `katee` (暗影魔女・星夜守護者)**  
> 專屬唯一 3D 全息鐳射卡牌互動系統 · 零依賴開箱即用 · 支援 GitHub Pages 一鍵部署

---

## 🌟 核心特色 (Key Features)

1. **3D 視差與多層全息雷射系統 (3D Holographic Shader)**
   - 採用 CSS 3D Transform（`perspective: 1000px`, `transform-style: preserve-3d`）。
   - 游標／手指觸控動態傾角連動，移開時平滑彈簧回正。
   - 支援行動裝置陀螺儀（`DeviceOrientationEvent`），傾斜手機即時折射全息光斑。
   - 內建 5 種鐳射箔膜風格：
     - 🏆 **Gold Ultra 黑金浮雕 (預設)**：曜石黑絲絨底紋 + 24K 燙金微立體雕紋
     - 🌌 **Cosmic Holo 幻彩星河**：多頻譜極光折射 + 漫天星辰霓虹光斑
     - 💎 **Secret Rare 碎鑽稜鏡**：幾何碎鑽切面 + 聚焦高光閃耀
     - 🔮 **Phantom Rainbow 幽暗虹彩**：魔導紫青干涉流光 + 暗月幽光漸變
     - ⚡ **Silver Sterling 白銀秘銀**：純銀立體浮雕 + 冷冽鏡面金屬光澤

2. **響應式佈局架構 (RWD Fluid Design)**
   - **桌面端（≥ 1024px）**：3D 卡牌舞台與磨砂玻璃控制台雙欄並排。
   - **平板端（768px - 1023px）**：自動等比自適應縮放。
   - **行動端（< 768px）**：垂直堆疊排版，上半部卡牌焦點、下半部控制面板收攏，優化單手觸控。
   - **TCG 標準比例**：嚴格鎖定 `aspect-ratio: 63 / 88` 與 `width: min(88vw, 380px)`，文字全面導入 `clamp()` 防止破版。

3. **零依賴與全單一檔案 (Single-File Zero Dependency)**
   - 所有 HTML、CSS、JS 與 Web Audio 合成音效均內建於 `index.html`。
   - 免 npm 安裝、免建置打包，雙擊即可直接執行或推上 GitHub Pages！

4. **圖文即時編輯與肖像替換**
   - 卡面所有文字（名稱、HP、招式說明、數值、簽名等）皆支援 `contenteditable="true"`，點選即可直接修改。
   - 整合 **FileReader API**，點擊插畫框即可從本機上傳圖片即時替換立繪，並可一鍵還原預設 Katee 原畫。

5. **3D 180° 卡背翻轉與防偽認證 (COA)**
   - 支援順暢 180° 翻牌，檢視官方防偽鑑定證書、獨立編號與認證 Hash。
   - 支援 PSA 10 評級磚、磁吸金邊盒與原畫裸卡切換。

6. **一鍵匯出高解析度 PNG**
   - 引入 CDN `html2canvas`，點擊按鈕時自動將卡面角度回平，以 3 倍解析度匯出透明無損卡牌圖檔。

---

## 🚀 部署至 GitHub Pages 步驟

1. 將本專案推送至 GitHub 儲存庫（Repository）。
2. 進入該專案的 **Settings** -> **Pages**。
3. 在 **Build and deployment** 下方的 **Source** 選擇 **Deploy from a branch**。
4. Branch 選擇 `main`（或 `master`），資料夾選擇 `/ (root)`，點擊 **Save**。
5. 數秒後即可獲得專屬公開網址（例如：`https://<你的帳號>.github.io/<儲存庫名稱>/`）！

---

## 📁 專案檔案結構

```
.
├── index.html        # 單一檔案主應用（含所有樣式、腳本與音訊合成）
├── assets/           # 原創卡牌美術素材
│   ├── katee_art.jpg # Katee 暗影魔女立繪原畫
│   └── card_back.jpg # 官方星辰圖騰卡背
├── server.js         # 本地零依賴測試伺服器（可選）
├── .gitignore        # Git 忽略配置
└── README.md         # 專案說明文件
```

---

## 📜 版權與認證

- **創作者**：MRs.lun
- **編號與稀有度**：No.001/001 ★★★★★★ SAR
- **年份**：2026/10/08
