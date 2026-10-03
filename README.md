# 氣喘治療決策台

繁體中文的氣喘臨床決策輔助工具，依 **GINA 2026 Strategy Report** 推導起始治療與升降階，並比對 **台灣健保藥品給付規定第六節（115.3.23 更新）**。單一靜態網頁，部署於 GitHub Pages：<https://yht5582-source.github.io/asthma/>

> 本工具用於臨床教育與決策輔助，不能取代醫師完整的病史詢問、理學檢查、肺功能判讀、吸入技巧確認、共病評估與個別化處方判斷。

## 分頁

1. **診斷確認**：BDR 計算（≥12% 且 ≥200 mL）、PEF 變異度粗估、已用 ICS 病人的確認方式、鑑別診斷。
2. **治療階梯推導**
   - 年齡層：≥18 歲、12–17 歲、6–11 歲（5 歲以下未涵蓋）。
   - 初診：依 GINA Box 4-4（成人與青少年）與 Box 4-10（6–11 歲）的症狀分級決定起始階梯，最高到 Step 4。
   - 治療中：以 Box 2-2 過去 4 週控制度（4 項）加上急性發作次數判斷；升階前檢查吸入技巧、順從性、暴露、共病與診斷；控制良好滿 3 個月才建議降階（Box 4-13），且不建議完全停用 ICS。
   - 成人與青少年並列 Track 1（ICS-formoterol 緩解）與 Track 2（ICS-SABA 或 SABA 緩解）處方；6–11 歲依 Box 4-12 列出首選與其他選項，劑量使用兒童劑型。
   - 急性發作風險因子提示、可複製的病歷摘要、列印。
3. **急性發作處置**（≥6 歲）：依 GINA Box 9-4（基層）與 Box 9-6（急診）判定輕度、中度、重度、危及生命；列出 salbutamol、ipratropium、氧氣、全身性類固醇（依體重計算）、靜脈鎂的用法；1 小時後依反應判斷出院、觀察、住院或轉送；出院安排依 Box 9-5／9-7；致死性氣喘高風險因子（Box 9-1）。
4. **重度氣喘與生物製劑**：難治型 vs 重度確認清單、Type 2 證據、Eos ≥300（寄生蟲篩檢）與 ≥1500（EGPA）警示、GINA Box 8-4 四類生物製劑的條件與反應預測因子，以及 omalizumab、mepolizumab、benralizumab、dupilumab、tezepelumab 的健保條件逐項比對。
5. **健保給付規定**：吸入劑、三合一、montelukast 與生物製劑條文摘要。
6. **劑量表與文獻**：ICS 低／中／高劑量、Track 1 ICS-formoterol 用法、參考文獻。

## 檔案

```text
.
├── index.html   # 頁面與推導 engine（/*ENGINE-START*/ … /*ENGINE-END*/）
├── tests.cjs    # 規則測試
├── README.md
└── .nojekyll
```

## 測試

推導規則集中在 `index.html` 的 engine 區塊，`tests.cjs` 會把它抽出來測試：

```bash
node tests.cjs
```

修改階梯邏輯、劑量文字或健保條件後請先跑測試。測試涵蓋：初診分級、初診不會到 Step 5、控制度與升降階、升階前檢查、兒童不出現成人劑型、生物製劑的 GINA 與健保條件、急性發作嚴重度分級、類固醇劑量上限與出院判斷。

## 本機預覽

```bash
python3 -m http.server 8000
```

開啟 <http://localhost:8000>。

## 更新來源

- GINA：<https://ginasthma.org/reports/>（每年 5 月左右更新）
- 健保藥品給付規定（分章節）：<https://www.nhi.gov.tw/ch/cp-7593-ad2a9-3397-1.html>，第六節 呼吸道藥物

更新版本時，請同步修改頁首來源標籤、第 4 頁條文、文獻與頁尾版本註記。

## 授權

目前未提供授權條款。若需公開再利用、改作或整合到其他系統，建議先補上 LICENSE。
