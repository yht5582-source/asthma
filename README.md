<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>氣喘 (Asthma) 臨床最佳藥物決策推導系統 | GINA Guidelines</title>
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --bg-main: #FDFBF7;
            --bg-card: #FFFFFF;
            --bg-subtle: #F7F4EF;
            --border-color: #E8E2D8;
            --primary: #D97706; /* 暖琥珀色 */
            --primary-hover: #B45309;
            --secondary: #E06D53; /* 暖珊瑚色 */
            --text-main: #2D2522; /* 深暖棕色 */
            --text-muted: #6E665F;
            --accent-green: #2E7D32;
            --accent-orange: #E65100;
            --accent-orange-bg: #FFF3E0;
            --accent-red: #C62828;
            --accent-red-bg: #FFEBEE;
            --shadow-sm: 0 2px 8px rgba(45, 37, 34, 0.05);
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 16px;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans TC", sans-serif;
        }

        body {
            background-color: var(--bg-main);
            color: var(--text-main);
            line-height: 1.6;
            padding: 24px 16px;
        }

        .container {
            max-width: 1280px;
            margin: 0 auto;
        }

        header {
            background: linear-gradient(135deg, #FFF9F2 0%, #F7ECE1 100%);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 28px 32px;
            margin-bottom: 24px;
            box-shadow: var(--shadow-sm);
        }

        .header-title-container {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 8px;
        }

        .header-icon {
            width: 48px;
            height: 48px;
            background-color: var(--primary);
            color: white;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        h1 {
            font-size: 26px;
            font-weight: 700;
        }

        .subtitle {
            font-size: 15px;
            color: var(--text-muted);
            margin-left: 64px;
        }

        .sample-toolbar {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: 16px 20px;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px;
        }

        .btn {
            padding: 8px 16px;
            border-radius: var(--radius-sm);
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 1px solid transparent;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-outline {
            background-color: var(--bg-subtle);
            border-color: var(--border-color);
            color: var(--text-main);
        }

        .btn-outline:hover {
            background-color: #EFEBE4;
        }

        .btn-primary {
            background-color: var(--primary);
            color: white;
        }

        .main-grid {
            display: grid;
            grid-template-columns: 480px 1fr;
            gap: 24px;
        }

        @media (max-width: 1024px) {
            .main-grid {
                grid-template-columns: 1fr;
            }
        }

        .card {
            background-color: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: 24px;
            margin-bottom: 20px;
            box-shadow: var(--shadow-sm);
        }

        .card-header {
            border-bottom: 2px solid var(--bg-subtle);
            padding-bottom: 12px;
            margin-bottom: 20px;
        }

        .card-title {
            font-size: 18px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-title i {
            color: var(--primary);
        }

        .form-group {
            margin-bottom: 18px;
        }

        .form-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .radio-group, .checkbox-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .radio-option {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            background-color: var(--bg-card);
            cursor: pointer;
        }

        .radio-option:hover {
            background-color: var(--bg-subtle);
        }

        select.form-select {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-sm);
            font-size: 14px;
        }

        .result-header-card {
            background: linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%);
            border: 1px solid #FCD34D;
            border-radius: var(--radius-md);
            padding: 24px;
            margin-bottom: 20px;
        }

        .step-badge-large {
            background-color: var(--primary);
            color: white;
            font-size: 22px;
            font-weight: 800;
            padding: 12px 20px;
            border-radius: var(--radius-md);
            text-align: center;
        }

        .tracks-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
        }

        @media (max-width: 768px) {
            .tracks-grid {
                grid-template-columns: 1fr;
            }
        }

        .track-card {
            border: 2px solid var(--border-color);
            border-radius: var(--radius-md);
            background-color: var(--bg-card);
            padding: 20px;
            position: relative;
        }

        .track-card.preferred {
            border-color: var(--primary);
            background-color: #FFFCF5;
        }

        .drug-box {
            background-color: var(--bg-subtle);
            border-radius: var(--radius-sm);
            padding: 10px 12px;
            font-size: 13.5px;
            margin-bottom: 10px;
            border-left: 3px solid var(--primary);
        }

        .alert-box {
            padding: 16px;
            border-radius: var(--radius-sm);
            margin-bottom: 20px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background-color: #E0F2FE;
            border: 1px solid #7DD3FC;
            color: #0369A1;
        }
    </style>
</head>
<body>
<div class="container">
    <header>
        <div class="header-title-container">
            <div class="header-icon"><i class="fa-solid fa-lungs"></i></div>
            <div>
                <h1>氣喘 (Asthma) 臨床最佳藥物決策推導系統</h1>
            </div>
        </div>
        <p class="subtitle">根據 GINA 2024 指引演算法，即時推導首選與替代治療階梯處方</p>
    </header>

    <div class="sample-toolbar">
        <div style="font-size: 14px; font-weight: 600;">
            <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> 快速載入案例：
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" onclick="loadPreset('case1')">案例 1: 輕度間歇初診</button>
            <button type="button" class="btn btn-outline" onclick="loadPreset('case2')">案例 2: 中度控制不佳</button>
            <button type="button" class="btn btn-outline" onclick="loadPreset('case3')">案例 3: 重度難治型</button>
            <button type="button" class="btn btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> 列印 / 匯出</button>
        </div>
    </div>

    <div class="main-grid">
        <div class="left-col">
            <div class="card">
                <div class="card-header">
                    <div class="card-title"><i class="fa-solid fa-sliders"></i> 病人必要評估參數</div>
                </div>
                <form id="asthmaForm">
                    <div class="form-group">
                        <label class="form-label">1. 病人年齡分組</label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="ageGroup" value="adult" checked onchange="calculateTherapy()"> 成人與青少年 (≥ 12 歲)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="ageGroup" value="child611" onchange="calculateTherapy()"> 學齡兒童 (6 – 11 歲)
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">2. 評估情境</label>
                        <select class="form-select" id="evalContext" onchange="calculateTherapy()">
                            <option value="initial">初診未使用控制藥物</option>
                            <option value="maintenance">現正接受控制藥物，評估控制度</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">3. 日間症狀頻率</label>
                        <div class="radio-group">
                            <label class="radio-option">
                                <input type="radio" name="daytimeSym" value="less_2_month" checked onchange="calculateTherapy()"> 每月少於 2 次 (< 2 times/month)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="daytimeSym" value="two_month_to_weekly" onchange="calculateTherapy()"> 每月 ≥ 2 次，但非每天
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="daytimeSym" value="most_days" onchange="calculateTherapy()"> 幾乎每天有症狀 (Most days)
                            </label>
                            <label class="radio-option">
                                <input type="radio" name="daytimeSym" value="severe_daily" onchange="calculateTherapy()"> 每日持續症狀，且嚴重影響生活/肺功能低
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">4. 夜間甦醒頻率</label>
                        <div class="radio-group">
                            <label class="radio-option"><input type="radio" name="nightWaking" value="none" checked onchange="calculateTherapy()"> 無夜間甦醒</label>
                            <label class="radio-option"><input type="radio" name="nightWaking" value="less_weekly" onchange="calculateTherapy()"> < 1 次/週</label>
                            <label class="radio-option"><input type="radio" name="nightWaking" value="weekly_plus" onchange="calculateTherapy()"> ≥ 1 次/週</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">5. 過去 12 個月急性發作史</label>
                        <select class="form-select" id="exacerbations" onchange="calculateTherapy()">
                            <option value="0">0 次</option>
                            <option value="1">1 次 (需口服類固醇 OCS)</option>
                            <option value="2+">≥ 2 次 (重度發作/急診/住院)</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">6. 肺功能測試 (FEV1 % Predicted)</label>
                        <select class="form-select" id="fev1" onchange="calculateTherapy()">
                            <option value="normal">正常或 > 80% predicted</option>
                            <option value="mild_low">60% – 80% predicted</option>
                            <option value="severe_low">< 60% predicted</option>
                        </select>
                    </div>
                </form>
            </div>
        </div>

        <div class="right-col">
            <div class="result-header-card">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <div class="step-badge-large" id="stepBadge">Step 1-2</div>
                        <div>
                            <h2 id="stepTitle" style="font-size: 20px; color: #78350F;">建議處方階梯：Step 1 – 2</h2>
                            <p id="stepSubtitle" style="font-size: 14px; color: #92400E;">每月症狀 <2 次或偶有症狀，低急性發作風險</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="alert-box">
                <i class="fa-solid fa-circle-info" style="font-size: 18px;"></i>
                <div>
                    <strong>GINA 安全指引提醒：</strong>
                    <p style="font-size: 13px;">最新指引不再推薦單獨使用 SABA (Ventolin)，建議均應搭配含有抗發炎成分之 ICS。</p>
                </div>
            </div>

            <div class="tracks-grid">
                <div class="track-card preferred">
                    <div style="font-size: 16px; font-weight: 700; color: var(--primary); margin-bottom: 8px;">
                        <i class="fa-solid fa-star"></i> Track 1: ICS-Formoterol (首選)
                    </div>
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">以抗發炎鎮痛劑為緩解劑 (MART)，發作時直接兼具抗發炎與擴張效果。</div>
                    <div class="drug-box" id="t1Reliever">按需要使用低劑量 ICS-Formoterol (160/4.5 mcg 1 口 PRN)。</div>
                    <div class="drug-box" id="t1Controller">不需要每日固定保養用藥，發作時按需吸入。</div>
                </div>

                <div class="track-card">
                    <div style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">
                        <i class="fa-solid fa-notes-medical"></i> Track 2: SABA + ICS (替代)
                    </div>
                    <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 12px;">需每日固定使用 ICS，發作時吸入 SABA。</div>
                    <div class="drug-box" id="t2Reliever">按需要使用 SABA (Salbutamol 100 mcg PRN)。</div>
                    <div class="drug-box" id="t2Controller">每日固定吸入低劑量 ICS。</div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function calculateTherapy() {
        const ageGroup = document.querySelector('input[name="ageGroup"]:checked').value;
        const daytimeSym = document.querySelector('input[name="daytimeSym"]:checked').value;
        const nightWaking = document.querySelector('input[name="nightWaking"]:checked').value;
        const exacerbations = document.getElementById('exacerbations').value;
        const fev1 = document.getElementById('fev1').value;

        let step = 1;
        if (daytimeSym === 'severe_daily' || exacerbations === '2+') {
            step = (fev1 === 'severe_low') ? 5 : 4;
        } else if (daytimeSym === 'most_days' || nightWaking === 'weekly_plus' || exacerbations === '1') {
            step = 3;
        } else if (daytimeSym === 'two_month_to_weekly') {
            step = 2;
        }

        document.getElementById('stepBadge').innerText = (step <= 2) ? "Step 1-2" : `Step ${step}`;
        document.getElementById('stepTitle').innerText = `建議處方階梯：Step ${step} (${ageGroup === 'adult' ? '成人/青少年' : '6-11歲兒童'})`;
    }

    function loadPreset(c) {
        if (c === 'case1') {
            document.querySelector('input[name="daytimeSym"][value="less_2_month"]').checked = true;
            document.getElementById('exacerbations').value = '0';
        } else if (c === 'case2') {
            document.querySelector('input[name="daytimeSym"][value="most_days"]').checked = true;
            document.getElementById('exacerbations').value = '1';
        } else if (c === 'case3') {
            document.querySelector('input[name="daytimeSym"][value="severe_daily"]').checked = true;
            document.getElementById('exacerbations').value = '2+';
            document.getElementById('fev1').value = 'severe_low';
        }
        calculateTherapy();
    }
</script>
</body>
</html>
