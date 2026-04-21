import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

// ── Real data ────────────────────────────────────────────────────
const MONTHLY = [
  { month:"25.07", sales:109,    units:1    },
  { month:"25.08", sales:10306,  units:130  },
  { month:"25.09", sales:39228,  units:418  },
  { month:"25.10", sales:113185, units:1109 },
  { month:"25.11", sales:229502, units:2489 },
  { month:"25.12", sales:143380, units:1519 },
  { month:"26.01", sales:196354, units:2129 },
  { month:"26.02", sales:141552, units:1479 },
  { month:"26.03", sales:88359,  units:817  },
  { month:"26.04", sales:79946,  units:805  },
];

const WEEKLY = [
  { week:"W06", sales:47592, units:540 },
  { week:"W07", sales:37198, units:404 },
  { week:"W08", sales:28263, units:259 },
  { week:"W09", sales:23221, units:213 },
  { week:"W10", sales:18642, units:171 },
  { week:"W11", sales:21259, units:195 },
  { week:"W12", sales:18533, units:170 },
  { week:"W13", sales:19297, units:177 },
  { week:"W14", sales:26650, units:267 },
  { week:"W15", sales:30134, units:303 },
  { week:"W16", sales:28371, units:286 },
];

const ASINS = [
  { asin:"B0F3HV1RXD", name:"Retinol Night Cream 50ml",      sessions:226555, bb:99.27, units:9379, cvr:4.14, sales:913812, share:88.0 },
  { asin:"B0D83DKM8C", name:"Collagen Overnight Mask 4pk",   sessions:26376,  bb:97.82, units:1418, cvr:5.38, sales:118675, share:11.4 },
  { asin:"B0FRFM7GJD", name:"Peptide Matrix Eye Cream 15ml", sessions:368,    bb:99.28, units:31,   cvr:8.42, sales:3360,   share:0.3  },
];

const AD_TYPES = [
  { type:"SB", spend:3973, sales:8337,  acos:47.7, roas:2.10, imp:425556, clicks:1554, ntb:70  },
  { type:"SP", spend:4395, sales:10684, acos:41.1, roas:2.43, imp:154740, clicks:1062, ntb:0   },
];
const CAMPAIGNS = [
  { name:"SB_AmazonBestSeller",      type:"SB", spend:1818, sales:3768, roas:2.07, purch:32 },
  { name:"SB_Latest",                type:"SB", spend:1257, sales:2982, roas:2.37, purch:27 },
  { name:"SP_UltimateKeywordsExact", type:"SP", spend:512,  sales:2494, roas:4.87, purch:19 },
  { name:"SP_LatestSuggestion",      type:"SP", spend:1026, sales:2479, roas:2.42, purch:25 },
  { name:"SP_Cream_Manual",          type:"SP", spend:761,  sales:1587, roas:2.09, purch:16 },
  { name:"SB_CrowsFeet",             type:"SB", spend:687,  sales:1388, roas:2.02, purch:13 },
];

// ── AI Comments (데이터 기반 · 2026.04.21 기준) ──────────────────
const AI = {
  monthly: [
    { text:"2025년 11월 AED 229,502로 최고 피크 달성 후 12월 -37.5% 급감 — 론칭 초기 수요 소진 및 시즌성 요인으로 판단", action:false },
    { text:"2026년 1월 AED 196,354로 반등 성공했으나 2~3월 연속 하락, 4월 현재 AED 79,946 (20일 기준)으로 피크 대비 -65% 수준", action:false },
    { text:"2~3월 하락 원인 확인: ① Mask OOS — Mar31·Apr20 스냅샷 모두 재고 0u로 확정. 최소 26.02 이전부터 OOS 지속 ② 이란-미국 지정학 갈등으로 UAE 소비 심리 위축 복합 작용", action:false },
    { text:"2025.01.01~2026.04.19 누적 AED 1,041,923(≈3.9억원) 달성 — 론칭 9개월 만의 수치로 성장 궤적 자체는 긍정적", action:false },
    { text:"→ W16 반등 모멘텀 유지 위해 4월 말~5월 초 타임딜/쿠폰 행사 기획 및 SP 예산 10% 증액으로 매출 하방 방어 필요", action:true },
  ],
  asin: [
    { text:"Retinol Night Cream 단일 ASIN이 전체 매출 88.0%(AED 913,812) 차지 — Hero 집중도 과다로 공급·경쟁 리스크 높음", action:false },
    { text:"Collagen Overnight Mask CVR 5.38%, 세션 26,376으로 안정적 2위 — 광고 예산 추가 배분 시 매출 비중 11% → 15% 확대 여지 충분", action:false },
    { text:"Eye Cream(B0FRFM7GJD) CVR 8.42%는 전 ASIN 최고 — 그러나 세션 368건으로 사실상 광고 미집행 상태, 전환 기회 사장되고 있음", action:false },
    { text:"전 ASIN 바이박스 97.8~99.9%로 우수 — BB 이슈 없이 안정적이나 Eye Cream 트래픽 확보가 최우선 과제", action:false },
    { text:"→ Eye Cream SP Auto 캠페인 즉시 신규 진행 (Auto ROAS 4.5x 이미 확인됨), Mask 제품 SB 추가로 Hero 의존도 단계적 완화", action:true },
  ],
  ad: [
    { text:"총 ACOS 44.0%로 UAE 뷰티 평균(~30%) 대비 약 14%p 초과 — 광고비 대비 수익성 즉각 개선 필요", action:false },
    { text:"SP_UltimateKeywordsExact ROAS 4.87x 압도적 최고 효율이나 예산 AED 512로 과소 집행 — 전체 SP 평균(ROAS 2.43)을 크게 상회", action:false },
    { text:"Auto 계열(251028_AUTO_6 ROAS 1.30, 250809_Auto_5 ROAS 1.43)이 전체 SP ACOS를 상승시키는 주범 — 저효율 키워드 즉시 네거티브 처리 필요", action:false },
    { text:"SB NTB 비율 41.4%(70건/169건) — 신규 고객 유입 채널로 SB 기능 정상 작동 중, ACOS 47.7%는 개선하되 NTB 기여는 유지", action:false },
    { text:"→ UltimateKeywordsExact 예산 2배 증액 + Auto 저효율 키워드 네거티브 처리로 2주 내 ACOS 35% 이하 달성 목표 설정", action:true },
  ],
  campaign: [
    { text:"SP_UltimateKeywordsExact ROAS 4.87x로 전체 1위 — Exact 매치 키워드로 구매 의도 높은 유입만 발생, 예산 AED 512는 성과 대비 현저히 과소 집행 상태", action:false },
    { text:"SB 3개 캠페인(AmazonBestSeller·Latest·CrowsFeet) ROAS 2.02~2.37x로 안정적 — 전체 Impression의 73.3% 차지하며 브랜드 노출 역할 수행 중", action:false },
    { text:"SP_LatestSuggestion(ROAS 2.42x, 25건)·SP_Cream_Manual(ROAS 2.09x, 16건)은 효율·구매건수 모두 준수 — 현 예산 유지하며 키워드 정교화 필요", action:false },
    { text:"SB_CrowsFeet ROAS 2.02x로 SB 중 최하위 — 광고 소재와 실구매층 간 미스매치 가능성, 소재 A/B 테스트 검토 필요", action:false },
    { text:"→ UltimateKeywordsExact 예산 즉시 2배 증액(AED 512 → 1,024+), SB_CrowsFeet 소재 교체 테스트로 Top 6 평균 ROAS 2.27x → 3.0x 목표", action:true },
  ],
  weekly: [
    { text:"W06(AED 47.6K) → W10(AED 18.6K) -60.8% 급락의 주요 원인 2가지 확인: ① Collagen Overnight Mask OOS(품절)로 2위 ASIN 매출 완전 이탈 ② 이란-미국 지정학적 긴장(2026 Q1) 영향으로 UAE 소비 심리 위축 및 플랫폼 전반 트래픽 감소", action:false },
    { text:"Mask OOS 영향 정량화: Mask는 전체 매출의 11.4%(BAU 기준 주 AED 3,300~3,800) 기여 — OOS 기간 동안 누적 손실 추정 AED 20,000~30,000, Night Cream 단일 의존 구조의 리스크가 실제로 현실화된 사례", action:false },
    { text:"지정학적 리스크: 이란-미국 갈등 고조 시 UAE 포함 중동 전역 소비자 구매 위축 패턴은 2019·2020년에도 반복된 바 있음 — 외부 변수로 광고 효율 하락과 트래픽 감소가 동반되어 ACOS 악화로 연결됨", action:false },
    { text:"W14~W16 반등(+61.6%)은 Mask 재입고 + 지정학적 긴장 완화 시점과 맞물린 것으로 판단 — 단순 광고 효과가 아닌 공급 정상화가 핵심 드라이버", action:false },
    { text:"→ Mask 재고 관리 최우선: OOS 1회로 월 AED 20K+ 손실 확인됨. FBA 안전재고 최소 6주치 상시 유지, 재고 임계치(2주치 이하) 알림 설정 필수. 지정학적 리스크 발생 시 광고비 일시 감축보다 SD Remarketing 유지가 효과적", action:true },
  ],
  bbcvr: [
    { text:"전 ASIN 바이박스 97.8~99.9% — UAE 마켓플레이스 기준 BB 90% 이상이면 안정권, Lepique는 사실상 BB 이슈 없는 최상위 수준 유지 중", action:false },
    { text:"Night Cream CVR 4.14%는 카테고리 평균 수준이나 Mask(5.38%)·Eye Cream(8.42%) 대비 낮음 — PDP 품질(이미지·A+ 콘텐츠·리뷰 수)이 전환율 병목으로 작용 중일 가능성", action:false },
    { text:"Eye Cream CVR 8.42%는 세션 368건 기준 — 소수 유입이지만 높은 구매 의도를 가진 트래픽만 도달 중, 광고 확장 시 CVR 희석 가능성 있으므로 타겟 키워드 정교화 필요", action:false },
    { text:"Mask CVR 5.38%·세션 26,376 — Hero 대비 세션 1/9 수준이나 단위 전환율 우수, 광고 예산 증액 대비 효과가 가장 예측 가능한 ASIN", action:false },
    { text:"→ Night Cream PDP 개선(A+ 리뉴얼·리뷰 100건 이상 목표)으로 CVR 4.1% → 5.5% 목표, Mask SP 예산 단계적 증액으로 세션 50K 돌파 시도", action:true },
  ],
  forecast: [
    { text:"2025 H2 실적(AED 523,487) 기반 + 행사 배율 적용 시 2026 Full Year AED 2,062,609(≈7.7억원) 전망 — 2025 H2 대비 약 3.9배 성장 시나리오", action:false },
    { text:"AMS 2026(W20-21, May 15-21): BAU AED 28K 기준 x3.0 보수적 적용 → 주 AED 84,000 목표. 2025 AMS 데이터 없어 시장 벤치마크 활용, 실제 딜 참여 여부에 따라 ±30% 변동 가능", action:false },
    { text:"Prime Day 2026(W26-27, end of June): 시장 벤치마크 +135% 적용 → 주 AED 82,250 목표. 2025 PD 당시 Lepique 론칭 직후(W28)로 실적 미미, 2026이 사실상 첫 번째 PD", action:false },
    { text:"11/11 2026(W45-46): 2025 실적(+65.5% WoW) 그대로 적용 → 주 AED 74,475. 브랜드 성숙으로 2025 대비 상승 여지 있으나 보수적 유지", action:false },
    { text:"→ 연간 목표 AED 2.0M(7.7억원) 달성 위해 AMS·PD·11/11 3대 행사 완벽 대비 필수 — 행사 불참 시 연간 AED 400~600K 손실 추정", action:true },
  ],
  adplan: [
    { text:"AMS(W20-21) 광고 전략: 행사 2주 전(W18)부터 SP 자동·수동 예산 1.5배 pre-warm, 행사 당일 UltimateKeywordsExact 예산 3배·SB_AmazonBestSeller 2배로 증액. 행사 종료 후 2주간 SD Remarketing으로 장바구니 이탈 유저 리타겟팅", action:false },
    { text:"PD(W26-27) 광고 전략: Top Deal/Lightning Deal 신청 병행, 행사 3주 전(W23)부터 SP Exact 키워드 비딩 강화로 BSR 순위 올린 뒤 행사 진입. PD 기간 ACOS 목표를 평시 35% → 50%로 상향 허용(매출 극대화 우선)", action:false },
    { text:"11/11(W45-46) 광고 전략: 2025 실적 기반 W43-44 BAU 대비 +65% 예산 증액 준비. SB NTB 캠페인 강화로 신규 고객 Pool 확대, 행사 후 W47 SD Remarketing으로 반복구매 전환", action:false },
    { text:"→ 행사별 광고 예산 캘린더: AMS 준비(W18 시작)→PD 준비(W23 시작)→11/11 준비(W43 시작). 각 행사 전 Seller Central 딜 신청 마감일 반드시 확인 후 역산하여 소재 준비", action:true },
  ],
  inventory: [
    { text:"AMS(W20-21) 재고: 피크 주 목표 판매량 약 1,053 units(AED 84K ÷ ASP 95.7 × 안전재고 1.2배). FBA 입고 리드타임 3~4주 감안 시 → 4월 24일(W17)까지 UAE FBA 입고 완료 필수", action:false },
    { text:"PD(W26-27) 재고: 피크 주 약 1,031 units 필요. 5월 PD 딜 신청 승인 후 물량 확정, 입고 마감 6월 5일(W23) 목표. Night Cream 단일 의존도 88%이므로 해당 ASIN 재고 2,500units 이상 확보 권장", action:false },
    { text:"11/11(W45-46) 재고: 933 units/wk 목표. 한국→UAE 해상 운임 기준 리드타임 5~6주 감안 시 → 9월 말(W40)까지 선적 완료 필요. 항공 대비 비용 절감 위해 해상 우선 검토", action:false },
    { text:"Mask OOS 전례 확인: W06→W10 -60.8% 낙폭의 핵심 원인이 Mask 품절 + 지정학적 리스크 복합 작용 — AMS 전 Mask 재고 소진 시 동일 패턴 재현 가능. 현재 판매 속도 292 units/wk 기준 AMS까지 4주 = 최소 1,168units + 행사 물량 필요", action:false },
    { text:"→ 즉시 FBA 재고 현황 확인 후 4월 24일 이내 AMS 대응 물량 긴급 발주 또는 항공편 발송 검토. PD·11/11은 선적 캘린더 지금 수립", action:true },
  ],
  action: [
    { text:"[긴급·광고] SP Auto 저효율 캠페인 정리 — AUTO_6(ROAS 1.30), Auto_5(ROAS 1.43) 저효율 키워드 네거티브 처리 후 절감 예산을 UltimateKeywordsExact(ROAS 4.87)로 즉시 이동", action:false },
    { text:"[긴급·광고] ACOS 44% → 35% 목표 — 고효율 캠페인 예산 집중 + SB ACOS 47.7% 개선 병행, 2주 내 목표 달성 가능 수준", action:false },
    { text:"[중요·ASIN] Eye Cream 트래픽 확대 — CVR 8.42% 강점을 살려 SP Auto 신규 런칭, 세션 목표 월 5,000건 이상으로 설정", action:false },
    { text:"[중요·셀렉션] Hero 의존도 분산 — Mask(CVR 5.38%) SB 캠페인 예산 10% 증액, Eye Cream PDP 개선(A+ 콘텐츠·영상)으로 매출 포트폴리오 다각화", action:false },
    { text:"→ 4월 말 종합 점검: ACOS 목표치 달성 여부 확인 + W16 반등세 유지 위한 5월 1주차 Lightning Deal 기획 착수", action:true },
  ],
};


// ── Currency & Monthly ASIN data ─────────────────────────────────
const R = 0.2723; // AED → USD rate (Apr 2026)
const aed = (n) => `AED ${Number(n).toLocaleString("en",{maximumFractionDigits:0})}`;
const usd = (n) => `$${Number(n*R).toLocaleString("en",{maximumFractionDigits:0})}`;
const dual = (n) => `${aed(n)} / ${usd(n)}`;

const MONTHLY_ASIN = [
  // month, nc_sales, nc_units, mask_sales, mask_units, eye_sales, eye_units, total_sales, total_units, asp_aed, oos_suspect
  { m:"25.07", nc:96,      ncu:1,    mask:12,      msku:0,   eye:0,   eyeu:0, total:109,    tu:1,    asp:109.5, oos:false },
  { m:"25.08", nc:9069,    ncu:93,   mask:1175,    msku:14,  eye:0,   eyeu:0, total:10306,  tu:130,  asp:79.3,  oos:false },
  { m:"25.09", nc:34521,   ncu:354,  mask:4472,    msku:53,  eye:0,   eyeu:0, total:39228,  tu:418,  asp:93.8,  oos:false },
  { m:"25.10", nc:99603,   ncu:1021, mask:12903,   msku:154, eye:0,   eyeu:0, total:113185, tu:1109, asp:102.1, oos:false },
  { m:"25.11", nc:201962,  ncu:2071, mask:26163,   msku:312, eye:0,   eyeu:0, total:229502, tu:2489, asp:92.2,  oos:false },
  { m:"25.12", nc:126174,  ncu:1294, mask:16345,   msku:195, eye:0,   eyeu:0, total:143380, tu:1519, asp:94.4,  oos:false },
  { m:"26.01", nc:172792,  ncu:1772, mask:22384,   msku:267, eye:0,   eyeu:0, total:196354, tu:2129, asp:92.2,  oos:false },
  { m:"26.02", nc:124566,  ncu:1277, mask:16137,   msku:192, eye:0,   eyeu:0, total:141552, tu:1479, asp:95.7,  oos:false },
  { m:"26.03", nc:77756,   ncu:797,  mask:10073,   msku:120, eye:0,   eyeu:0, total:88359,  tu:817,  asp:108.2, oos:true  },
  { m:"26.04", nc:70353,   ncu:721,  mask:9114,    msku:108, eye:480, eyeu:4, total:79946,  tu:805,  asp:99.3,  oos:false },
];


// ── FBA Inventory Snapshots (Mar31 + Apr20) ──────────────────────
const INV_SNAPSHOTS = {
  "26.03 (Mar 31)": {
    nc_sellable: 3628,
    nc_unsellable: { defective:70, customer_damaged:90, carrier_damaged:10, total:170 },
    nc_wh: [
      {wh:"DXB6",units:70},{wh:"DXB5",units:918},{wh:"DXB3",units:40},
      {wh:"DUF7",units:260},{wh:"DUF5",units:300},{wh:"DUF2",units:350},
      {wh:"DUF1",units:190},{wh:"AUH4",units:80},{wh:"AUH2",units:60},{wh:"AUH1",units:1360}
    ],
    mask_sellable: 0, mask_oos: true,
    eye_sellable: 1048,
    eye_wh: [{wh:"DXB6",units:600},{wh:"DXB5",units:448}],
    note: "Mask OOS 3월 내내 지속 확인. NC 3,628u는 Feb/Mar 재입고 물량 포함."
  },
  "26.04 (Apr 20)": {
    nc_sellable: 2237,
    nc_unsellable: { defective:80, customer_damaged:100, warehouse_damaged:10, total:190 },
    nc_wh: [
      {wh:"DXB5",units:207},{wh:"DXB3",units:30},{wh:"DUF7",units:260},
      {wh:"DUF5",units:160},{wh:"DUF2",units:60},{wh:"DUF1",units:80},
      {wh:"AUH4",units:70},{wh:"AUH2",units:10},{wh:"AUH1",units:1360}
    ],
    mask_sellable: 0, mask_oos: true,
    eye_sellable: 1019,
    eye_wh: [{wh:"DXB6",units:595},{wh:"DXB5",units:424}],
    note: "NC Mar31→Apr20: -1,391u (출고 -808 + 기타 조정 -583). 추가 입고 없음."
  },
};

// Current (Apr20) snapshot for calculations
const INV_SNAPSHOT = {
  date: "2026-04-20",
  asins: [
    {
      name:"Night Cream", asin:"B0F3HV1RXD", sku:"NightCreamV2",
      sellable: 2237,
      unsellable: { defective:80, customer_damaged:100, warehouse_damaged:10, total:190 },
      total: 2427,
      daily_velocity: 40.4,
      asp: 97.5,
      warehouses: [
        {wh:"DXB5",units:207},{wh:"DXB3",units:30},{wh:"DUF7",units:260},
        {wh:"DUF5",units:160},{wh:"DUF2",units:60},{wh:"DUF1",units:80},
        {wh:"AUH4",units:70},{wh:"AUH2",units:10},{wh:"AUH1",units:1360},
      ].map(w=>({wh:w.wh,sellable:w.units})),
      runway_days: Math.round(2237/40.4),
      ams_entry_stock: Math.round(2237 - 40.4*25),
      ams_needed: 1547,
      ams_gap: Math.round(2237 - 40.4*25) - 1547,
    },
    {
      name:"Collagen Mask", asin:"B0D83DKM8C", sku:"QI-S1OQ-DUAV",
      sellable: 0, unsellable: { total:0 }, total:0,
      daily_velocity: 4.9,
      asp: 83.7,
      warehouses: [],
      runway_days: 0,
      ams_entry_stock: 0,
      ams_needed: 200,
      ams_gap: -200,
      oos: true,
      oos_since: "2026년 3월 이전 (Mar31 스냅샷에서도 0u 확인)",
      oct25_daily: 12.8,
    },
    {
      name:"Eye Cream", asin:"B0FRFM7GJD", sku:"EyecreamV1",
      sellable: 1019,
      unsellable: { total:0 }, total:1019,
      daily_velocity: 0.1,
      asp: 108.4,
      warehouses: [{wh:"DXB6",sellable:595},{wh:"DXB5",sellable:424}],
      runway_days: 9999,
      ams_entry_stock: 1019,
      ams_needed: 15,
      ams_gap: 1004,
    },
  ]
};

// ── Palette ───────────────────────────────────────────────────────
const NAVY="#1B2B4B", TEAL="#0A9396", TEAL_L="#94D2BD", ORANGE="#EE9B00", RED="#AE2012", BG="#F4F7FA";
const fmt = (n, d=0) => Number(n).toLocaleString("en", { minimumFractionDigits:d, maximumFractionDigits:d });

// ── Shared UI ─────────────────────────────────────────────────────
function KPIBox({ label, value, sub, color=NAVY }) {
  return (
    <div style={{ background:color, borderRadius:10, padding:"14px 16px", textAlign:"center" }}>
      <div style={{ fontSize:11, color:"rgba(255,255,255,0.6)", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:800, color:"#fff", lineHeight:1.1 }}>{value}</div>
      {sub && <div style={{ fontSize:11, color:"rgba(255,255,255,0.5)", marginTop:3 }}>{sub}</div>}
    </div>
  );
}

function Card({ children, style={} }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"22px 24px",
      boxShadow:"0 2px 12px rgba(27,43,75,0.07)", marginBottom:20, ...style }}>
      {children}
    </div>
  );
}

function STitle({ children }) {
  return (
    <div style={{ fontSize:15, fontWeight:800, color:NAVY, marginBottom:14,
      paddingBottom:8, borderBottom:`2.5px solid ${TEAL}` }}>
      {children}
    </div>
  );
}

function AIBox({ lines }) {
  return (
    <div style={{ marginTop:16, background:"#EDF7F8", borderRadius:10,
      border:`1.5px solid ${TEAL_L}`, padding:"14px 16px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
        <span style={{ fontSize:12, fontWeight:700, color:TEAL }}>💡 인사이트</span>
        <span style={{ fontSize:10, background:TEAL, color:"#fff",
          padding:"2px 8px", borderRadius:20, fontWeight:600 }}>
          데이터 기반 · 2026.04.21
        </span>
      </div>
      {lines.map((l, i) => (
        <div key={i} style={{
          display:"flex", gap:8,
          marginBottom: i < lines.length - 1 ? 8 : 0,
          padding: l.action ? "8px 10px" : "2px 0",
          background: l.action ? "rgba(10,147,150,0.09)" : "transparent",
          borderRadius: l.action ? 7 : 0,
          borderLeft: l.action ? `3px solid ${TEAL}` : "none",
          paddingLeft: l.action ? 10 : 0,
        }}>
          <span style={{ fontSize:12, color: l.action ? TEAL : "#999",
            flexShrink:0, marginTop:2, fontWeight:700 }}>
            {l.action ? "→" : "•"}
          </span>
          <span style={{ fontSize:12.5, lineHeight:1.75,
            color: l.action ? TEAL : "#1a1a2e",
            fontWeight: l.action ? 700 : 400 }}>
            {l.text}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────
const TABS = [
  { id:"biz",    label:"📊 비즈니스 퍼포먼스" },
  { id:"asin",   label:"📦 ASIN 분석" },
  { id:"ad",     label:"📣 광고 퍼포먼스" },
  { id:"forecast",  label:"📈 Forecast & 행사 대비" },
  { id:"inventory", label:"🏭 재고 현황" },
  { id:"action",    label:"✅ 액션 플랜" },
];

export default function App() {
  const [tab, setTab] = useState("biz");
  const mom = (((79946 - 88359) / 88359) * 100).toFixed(1);

  return (
    <div style={{ fontFamily:"'Apple SD Gothic Neo','Noto Sans KR',sans-serif",
      background:BG, minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ background:NAVY, padding:"0 32px", borderBottom:`3px solid ${TEAL}`,
        display:"flex", alignItems:"stretch" }}>
        <div style={{ padding:"16px 0", marginRight:36,
          borderRight:`1px solid rgba(148,210,189,0.2)`, paddingRight:32 }}>
          <div style={{ fontSize:10, color:TEAL_L, letterSpacing:"0.12em",
            textTransform:"uppercase", marginBottom:2 }}>
            Business Review · Amazon UAE
          </div>
          <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>Lepique Beauty</div>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.38)", marginTop:1 }}>
            as of Apr 21, 2026 (Sales: ~Apr 19 | Ad: Apr 14–20)
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"stretch", marginLeft:8 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"0 18px", fontSize:12, fontWeight: tab===t.id ? 700 : 400,
              background:"transparent", border:"none", cursor:"pointer",
              fontFamily:"inherit",
              color: tab===t.id ? "#fff" : "rgba(255,255,255,0.42)",
              borderBottom: tab===t.id ? `3px solid ${TEAL}` : "3px solid transparent",
              transition:"all 0.15s", marginBottom:-3,
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ marginLeft:"auto", display:"flex", gap:28,
          alignItems:"center", paddingRight:4 }}>
          {[
            { l:"누적 매출",  v:"AED 1,042K / $284K" },
            { l:"누적 주문",  v:"10,326건" },
            { l:"4월 MoM",   v:`${mom}%`,   warn:true },
            { l:"ACOS 주간", v:"44.0%",     warn:true },
          ].map((k, i) => (
            <div key={i} style={{ textAlign:"center" }}>
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.38)", marginBottom:1 }}>{k.l}</div>
              <div style={{ fontSize:14, fontWeight:700,
                color: k.warn ? "#FF8A80" : TEAL_L }}>{k.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"28px 32px", maxWidth:1200, margin:"0 auto" }}>
        {tab === "biz"    && <BizTab    mom={mom} />}
        {tab === "asin"   && <AsinTab   />}
        {tab === "ad"     && <AdTab     />}
        {tab === "forecast"  && <ForecastTab />}
        {tab === "inventory" && <InventoryTab />}
        {tab === "action"    && <ActionTab />}
      </div>
    </div>
  );
}

// ── BIZ TAB ───────────────────────────────────────────────────────
function BizTab({ mom }) {
  return (
    <>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        <KPIBox label="누적 매출 (~Apr 19)"  value="AED 1,042K" sub="$284K · 약 3.9억원" color={NAVY}     />
        <KPIBox label="누적 주문량 (~Apr 19)" value="10,326"      sub="10,896 units"   color={TEAL}     />
        <KPIBox label="4월 MTD 매출" value="AED 79.9K / $21.8K" sub={`MoM ${mom}%`}  color={RED}      />
        <KPIBox label="환불률"        value="2.8%"        sub="306 units"      color={ORANGE}   />
        <KPIBox label="평균 ASP"      value="AED 95.7 / $26.1" sub="per unit"  color="#2E4057"  />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1.6fr 1fr", gap:20 }}>
        <Card>
          <STitle>월별 매출 추이 (AED)</STitle>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={MONTHLY} margin={{ top:4, right:8, bottom:0, left:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize:11 }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}K`} tick={{ fontSize:10 }} />
              <Tooltip formatter={v => [`${aed(v)} / ${usd(v)}`, "매출"]} />
              <Bar dataKey="sales" radius={[4,4,0,0]}>
                {MONTHLY.map((e, i) => (
                  <Cell key={i}
                    fill={e.month==="25.11" ? ORANGE : e.month.startsWith("26") ? TEAL : "#BDE0E3"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <AIBox lines={AI.monthly} />
        </Card>

        <Card>
          <STitle>최근 주간 매출 (2026)</STitle>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={WEEKLY} margin={{ top:4, right:10, bottom:0, left:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize:11 }} />
              <YAxis tickFormatter={v => `${(v/1000).toFixed(0)}K`} tick={{ fontSize:10 }} />
              <Tooltip formatter={v => [`${aed(v)} / ${usd(v)}`, "매출"]} />
              <Line type="monotone" dataKey="sales" stroke={TEAL} strokeWidth={2.5}
                dot={(p) => {
                  const isMin = p.payload.week==="W10";
                  const isMax = p.payload.week==="W06";
                  return (
                    <circle key={p.index} cx={p.cx} cy={p.cy}
                      r={isMin||isMax ? 6 : 3.5}
                      fill={isMin ? RED : isMax ? ORANGE : TEAL}
                      stroke="#fff" strokeWidth={1.5} />
                  );
                }} />
            </LineChart>
          </ResponsiveContainer>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
            <div style={{ background:"#FFF3F3", borderRadius:8, padding:"8px 12px" }}>
              <div style={{ fontSize:10, color:"#888" }}>W06→W10 낙폭</div>
              <div style={{ fontWeight:800, color:RED, fontSize:13 }}>-60.8% ↓</div>
              <div style={{ fontSize:10, color:"#aaa" }}>AED 47.6K ($13.0K) → AED 18.6K ($5.1K)</div>
            </div>
            <div style={{ background:"#E6F7F0", borderRadius:8, padding:"8px 12px" }}>
              <div style={{ fontSize:10, color:"#888" }}>W10→W15 반등</div>
              <div style={{ fontWeight:800, color:"#0A6640", fontSize:13 }}>+61.6% ↑</div>
              <div style={{ fontSize:10, color:"#aaa" }}>AED 18.6K ($5.1K) → AED 30.1K ($8.2K)</div>
            </div>
          </div>
          <AIBox lines={AI.weekly} />
        </Card>
      </div>
    </>
  );
}

// ── ASIN TAB ──────────────────────────────────────────────────────
function AsinTab() {
  const [selMonth, setSelMonth] = useState("all");
  const [chartMetric, setChartMetric] = useState("sales");
  const COLORS = [TEAL, NAVY, ORANGE];

  // Filter monthly data
  const mData = selMonth === "all" ? MONTHLY_ASIN : MONTHLY_ASIN.filter(d => d.m === selMonth);
  const agg = mData.reduce((acc,d) => ({
    nc:  acc.nc  + d.nc,   ncu:  acc.ncu  + d.ncu,
    mask:acc.mask+ d.mask, msku: acc.msku + d.msku,
    eye: acc.eye + d.eye,  eyeu: acc.eyeu + d.eyeu,
    total:acc.total+d.total, tu: acc.tu+d.tu
  }), {nc:0,ncu:0,mask:0,msku:0,eye:0,eyeu:0,total:0,tu:0});

  const PIE = [
    {name:"Night Cream", value: agg.nc},
    {name:"Collagen Mask", value: agg.mask},
    {name:"Eye Cream", value: agg.eye},
  ].filter(p => p.value > 0);

  // Summary stats for selected period
  const asp = agg.tu > 0 ? agg.total / agg.tu : 0;
  const selLabel = selMonth === "all" ? "전체 기간" : selMonth;

  return (
    <>
      {/* Month selector */}
      <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap"}}>
        <span style={{fontSize:12, fontWeight:700, color:NAVY, marginRight:4}}>📅 기간 선택</span>
        {["all",...MONTHLY_ASIN.map(d=>d.m)].map(m => (
          <button key={m} onClick={()=>setSelMonth(m)} style={{
            padding:"6px 14px", fontSize:11, fontWeight: selMonth===m?700:400,
            borderRadius:20, border:"none", cursor:"pointer", fontFamily:"inherit",
            background: selMonth===m ? NAVY : "#fff",
            color:       selMonth===m ? "#fff" : "#555",
            boxShadow:   selMonth===m ? "0 2px 6px rgba(27,43,75,0.2)" : "0 1px 3px rgba(0,0,0,0.08)",
            transition:"all 0.15s",
          }}>
            {m==="all" ? "전체" : m}
            {MONTHLY_ASIN.find(d=>d.m===m)?.oos && m!=="all"
              ? <span style={{marginLeft:4,fontSize:9,color:"#AE2012"}}>⚠️OOS</span> : null}
          </button>
        ))}
      </div>

      {/* ASIN summary cards */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginBottom:20}}>
        {[
          {name:"Night Cream 50ml",  asin:"B0F3HV1RXD", sales:agg.nc,   units:agg.ncu,  bb:99.27, cvr:4.14, color:TEAL  },
          {name:"Collagen Mask 4pk", asin:"B0D83DKM8C", sales:agg.mask, units:agg.msku, bb:97.82, cvr:5.38, color:NAVY  },
          {name:"Eye Cream 15ml",    asin:"B0FRFM7GJD", sales:agg.eye,  units:agg.eyeu, bb:99.28, cvr:8.42, color:ORANGE},
        ].map((a,i)=>(
          <Card key={i} style={{marginBottom:0, borderTop:`3px solid ${a.color}`}}>
            <div style={{fontSize:10, fontWeight:700, color:a.color, marginBottom:2}}>{a.asin}</div>
            <div style={{fontSize:12, color:NAVY, fontWeight:700, marginBottom:10,
              borderBottom:"1px solid #F0F4F8", paddingBottom:8}}>{a.name}</div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:6}}>
              {[
                {l:"매출 (AED)", v: aed(a.sales)},
                {l:"매출 (USD)", v: usd(a.sales), sub:true},
                {l:"판매량",    v:`${fmt(a.units)} units`},
                {l:"ASP",       v:`${aed(a.units>0?a.sales/a.units:0)} / ${usd(a.units>0?a.sales/a.units:0)}`},
                {l:"바이박스",  v:`${a.bb}%`, hi:true},
                {l:"전환율",    v:`${a.cvr}%`, hi:a.cvr>7},
              ].map((kv,j)=>(
                <div key={j} style={{
                  background: kv.hi?"#E6F7F0":kv.sub?"#F0F8FF":"#F7FAFD",
                  borderRadius:6, padding:"6px 8px",
                }}>
                  <div style={{fontSize:9, color:"#888"}}>{kv.l}</div>
                  <div style={{fontSize:11, fontWeight:700,
                    color:kv.hi?"#0A6640":kv.sub?TEAL:NAVY, lineHeight:1.3}}>{kv.v}</div>
                </div>
              ))}
            </div>
            {i===1 && selMonth!=="all" && MONTHLY_ASIN.find(d=>d.m===selMonth)?.oos && (
              <div style={{marginTop:8, background:"#FFF0EF", borderRadius:6, padding:"6px 8px",
                fontSize:11, color:RED, fontWeight:700}}>
                ⚠️ 이 월 Mask OOS(품절) 의심 — ASP 이상 상승 확인
              </div>
            )}
            {i===2 && agg.eye===0 && (
              <div style={{marginTop:8, background:"#FFF8E1", borderRadius:6, padding:"6px 8px",
                fontSize:11, color:"#856404", fontWeight:600}}>
                {selMonth==="all"?"⚡ CVR 8.42% 최고이나 세션 368건 — 광고 미집행 기간 포함":"📅 해당 월 판매 데이터 없음"}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Period summary strip */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:10, marginBottom:20}}>
        {[
          {l:"기간 총 매출",     v: dual(agg.total)},
          {l:"기간 총 판매량",   v:`${fmt(agg.tu)} units`},
          {l:"블렌드 ASP",       v: dual(asp)},
          {l:"Night Cream 비중", v:`${agg.total>0?(agg.nc/agg.total*100).toFixed(1):0}%`},
          {l:"Mask 비중",        v:`${agg.total>0?(agg.mask/agg.total*100).toFixed(1):0}%`},
        ].map((k,i)=>(
          <div key={i} style={{background:"#fff", borderRadius:10, padding:"12px 14px",
            boxShadow:"0 1px 6px rgba(27,43,75,0.07)"}}>
            <div style={{fontSize:10, color:"#888", marginBottom:3}}>{k.l} ({selLabel})</div>
            <div style={{fontSize:12, fontWeight:800, color:NAVY, lineHeight:1.4}}>{k.v}</div>
          </div>
        ))}
      </div>

      {/* Monthly trend charts */}
      <Card>
        <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12}}>
          <STitle style={{marginBottom:0, borderBottom:"none", paddingBottom:0}}>ASIN별 월별 추이</STitle>
          <div style={{display:"flex", gap:6}}>
            {[["sales","매출(AED)"],["units","판매량"]].map(([v,l])=>(
              <button key={v} onClick={()=>setChartMetric(v)} style={{
                padding:"5px 12px", fontSize:11, fontWeight:chartMetric===v?700:400,
                borderRadius:6, border:`1.5px solid ${chartMetric===v?TEAL:"#ddd"}`,
                background:chartMetric===v?"#EDF7F8":"#fff", color:chartMetric===v?TEAL:"#888",
                cursor:"pointer", fontFamily:"inherit"
              }}>{l}</button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={MONTHLY_ASIN} margin={{top:4,right:10,bottom:0,left:10}}
            onClick={(d)=>{ if(d?.activeLabel) setSelMonth(d.activeLabel); }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
            <XAxis dataKey="m" tick={{fontSize:11}}/>
            <YAxis tickFormatter={v=> chartMetric==="sales" ? `${(v/1000).toFixed(0)}K` : `${v}`} tick={{fontSize:10}}/>
            <Tooltip
              formatter={(v,name)=>{
                if(chartMetric==="sales") return [`${aed(v)} / ${usd(v)}`, name];
                return [`${v} units`, name];
              }}
              labelFormatter={l=>{
                const d=MONTHLY_ASIN.find(x=>x.m===l);
                return d?.oos ? `${l} ⚠️ Mask OOS 의심` : l;
              }}
            />
            <Legend wrapperStyle={{fontSize:11}}/>
            <Bar dataKey={chartMetric==="sales"?"nc":"ncu"} name="Night Cream" stackId="a" fill={TEAL}>
              {MONTHLY_ASIN.map((e,i)=>(
                <Cell key={i} fill={e.oos ? "#FF8A80" : TEAL} fillOpacity={selMonth==="all"||e.m===selMonth?1:0.3}/>
              ))}
            </Bar>
            <Bar dataKey={chartMetric==="sales"?"mask":"msku"} name="Collagen Mask" stackId="a" fill={NAVY}>
              {MONTHLY_ASIN.map((e,i)=>(
                <Cell key={i} fill={e.oos ? "#BBDEFB" : NAVY} fillOpacity={selMonth==="all"||e.m===selMonth?1:0.3}/>
              ))}
            </Bar>
            <Bar dataKey={chartMetric==="sales"?"eye":"eyeu"} name="Eye Cream" stackId="a" fill={ORANGE} radius={[3,3,0,0]}>
              {MONTHLY_ASIN.map((e,i)=>(
                <Cell key={i} fill={ORANGE} fillOpacity={selMonth==="all"||e.m===selMonth?1:0.3}/>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:"#888",marginTop:6}}>
          💡 막대 클릭 시 해당 월로 필터링됩니다. <span style={{color:RED,fontWeight:700}}>붉은 막대 = OOS 의심 월(ASP 이상 상승)</span>
        </div>
      </Card>

      {/* ASP trend line */}
      <Card>
        <STitle>월별 ASP 추이 (AED / USD) — OOS 감지 지표</STitle>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={MONTHLY_ASIN.filter(d=>d.total>0)} margin={{top:4,right:20,bottom:0,left:10}}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
            <XAxis dataKey="m" tick={{fontSize:11}}/>
            <YAxis yAxisId="aed" tick={{fontSize:10}} tickFormatter={v=>`${v}`} domain={[70,120]}/>
            <YAxis yAxisId="usd" orientation="right" tick={{fontSize:10}} tickFormatter={v=>`$${v.toFixed(0)}`} domain={[19,33]}/>
            <Tooltip formatter={(v,name)=>[`${name==="ASP(AED)"?aed(v):usd(v)}`, name]}/>
            <Legend wrapperStyle={{fontSize:11}}/>
            <Line yAxisId="aed" type="monotone" dataKey="asp" name="ASP(AED)" stroke={TEAL} strokeWidth={2.5}
              dot={(p)=>{
                const isOos=p.payload.oos;
                return <circle key={p.index} cx={p.cx} cy={p.cy} r={isOos?7:4}
                  fill={isOos?RED:TEAL} stroke="#fff" strokeWidth={1.5}/>;
              }}/>
            <Line yAxisId="usd" type="monotone"
              data={MONTHLY_ASIN.filter(d=>d.total>0).map(d=>({...d,asp_usd:d.asp*R}))}
              dataKey="asp_usd" name="ASP(USD)" stroke={ORANGE} strokeWidth={1.5} strokeDasharray="4 2"
              dot={false}/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{fontSize:11,color:"#888",marginTop:6}}>
          <span style={{color:RED,fontWeight:700}}>● 빨간 점 = ASP 100 AED 초과 → Mask OOS 의심</span>
          &nbsp;(Mask 낮은 ASP 빠지면 블렌드 ASP 상승)
        </div>
      </Card>

      {/* Pie + BB/CVR */}
      <div style={{display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:20}}>
        <Card>
          <STitle>ASIN별 매출 비중 ({selLabel})</STitle>
          <div style={{display:"flex", alignItems:"center"}}>
            <ResponsiveContainer width="50%" height={190}>
              <PieChart>
                <Pie data={PIE} cx="50%" cy="50%" innerRadius={48} outerRadius={80}
                  dataKey="value" paddingAngle={3}>
                  {PIE.map((_,i)=><Cell key={i} fill={COLORS[i]}/>)}
                </Pie>
                <Tooltip formatter={v=>[`${aed(v)} / ${usd(v)}`]}/>
              </PieChart>
            </ResponsiveContainer>
            <div style={{flex:1, paddingLeft:8}}>
              {[
                {name:"Night Cream", sales:agg.nc,   units:agg.ncu,  color:TEAL},
                {name:"Collagen Mask",sales:agg.mask, units:agg.msku, color:NAVY},
                {name:"Eye Cream",   sales:agg.eye,  units:agg.eyeu, color:ORANGE},
              ].map((a,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:a.color,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:11,color:NAVY,fontWeight:600}}>{a.name}</div>
                    <div style={{fontSize:13,fontWeight:800,color:a.color}}>
                      {agg.total>0?(a.sales/agg.total*100).toFixed(1):0}%
                    </div>
                    <div style={{fontSize:10,color:"#aaa"}}>{aed(a.sales)} / {usd(a.sales)}</div>
                    <div style={{fontSize:10,color:"#aaa"}}>{fmt(a.units)} units</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AIBox lines={AI.asin}/>
        </Card>

        <Card>
          <STitle>바이박스 & 전환율</STitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ASINS.map(a=>({name:a.name.split(" ")[0], bb:a.bb, cvr:a.cvr}))}
              margin={{top:4,right:10,bottom:0,left:0}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
              <XAxis dataKey="name" tick={{fontSize:10}}/>
              <YAxis domain={[0,110]} tick={{fontSize:10}}/>
              <Tooltip/>
              <Bar dataKey="bb"  name="바이박스%" fill={TEAL}   radius={[4,4,0,0]}/>
              <Bar dataKey="cvr" name="전환율%"   fill={ORANGE} radius={[4,4,0,0]}/>
              <Legend wrapperStyle={{fontSize:11}}/>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:10}}>
            {[
              {l:"누적 판매량",  v:`${fmt(agg.tu)} units`},
              {l:"블렌드 ASP",   v:`${aed(asp)} / ${usd(asp)}`},
              {l:"총 매출",      v:`${aed(agg.total)} / ${usd(agg.total)}`},
            ].map((r,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",
                padding:"5px 0",borderBottom:"1px solid #F0F4F8",fontSize:11}}>
                <span style={{color:"#666"}}>{r.l} ({selLabel})</span>
                <span style={{fontWeight:700,color:NAVY}}>{r.v}</span>
              </div>
            ))}
          </div>
          <AIBox lines={AI.bbcvr}/>
        </Card>
      </div>
    </>
  );
}

// ── AD TAB ────────────────────────────────────────────────────────
function AdTab() {
  return (
    <>
      <div style={{ fontSize:11, color:"#888", marginBottom:10 }}>
        📅 광고 데이터: Apr 14–20, 2026 (최근 1주) &nbsp;|&nbsp; ASIN·매출 데이터: 2025.01.01 ~ 2026.04.19 누적 &nbsp;|&nbsp; 일별 매출: SalesDashboard 2026.04.21 업데이트 기준
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20 }}>
        <KPIBox label="총 광고비"   value="AED 8,368 / $2,278" sub="주간 (Apr 14-20)"  color={NAVY}    />
        <KPIBox label="광고 매출"   value="AED 19,020 / $5,180" sub="주간 (Apr 14-20)" color={TEAL}    />
        <KPIBox label="ACOS"        value="44.0%"       sub="목표 ≤35% 초과" color={RED}     />
        <KPIBox label="ROAS"        value="2.27x"       sub="구매 169건"     color="#2E7D32" />
        <KPIBox label="NTB 비율"    value="41.4%"       sub="70건 신규 고객"  color="#5B2D8E" />
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <STitle>SP vs SB 광고 성과 비교</STitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={AD_TYPES} margin={{ top:4, right:10, bottom:0, left:10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
              <XAxis dataKey="type" tick={{ fontSize:12 }} />
              <YAxis tick={{ fontSize:10 }} />
              <Tooltip formatter={v => [`AED ${fmt(v)}`]} />
              <Bar dataKey="spend" name="광고비" fill="#BDE0E3" radius={[4,4,0,0]} />
              <Bar dataKey="sales" name="매출"   fill={TEAL}    radius={[4,4,0,0]} />
              <Legend wrapperStyle={{ fontSize:11 }} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
            {AD_TYPES.map((t, i) => (
              <div key={i} style={{ background:"#F7FAFD", borderRadius:8, padding:"10px 12px" }}>
                <div style={{ fontSize:12, fontWeight:800, color:TEAL, marginBottom:8 }}>{t.type}</div>
                {[
                  { l:"광고비",     v:`AED ${fmt(t.spend)}` },
                  { l:"광고매출",   v:`AED ${fmt(t.sales)}` },
                  { l:"ACOS",       v:`${t.acos}%`, warn:t.acos>45 },
                  { l:"ROAS",       v:`${t.roas}x` },
                  { l:"Impression", v:fmt(t.imp) },
                  { l:"NTB",        v:`${t.ntb}건` },
                ].map((kv, j) => (
                  <div key={j} style={{ display:"flex", justifyContent:"space-between",
                    padding:"3px 0", fontSize:11,
                    borderBottom: j < 5 ? "1px solid #EEF2F7" : "none" }}>
                    <span style={{ color:"#888" }}>{kv.l}</span>
                    <span style={{ fontWeight:700, color:kv.warn ? RED : NAVY }}>{kv.v}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <AIBox lines={AI.ad} />
        </Card>

        <Card>
          <STitle>캠페인별 ROAS 순위 (Top 6)</STitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[...CAMPAIGNS].sort((a, b) => b.roas - a.roas)}
              layout="vertical" margin={{ top:0, right:50, bottom:0, left:20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false} />
              <XAxis type="number" tick={{ fontSize:9 }} domain={[0, 6]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:9 }} width={140} />
              <Tooltip formatter={v => [`${v}x`, "ROAS"]} />
              <Bar dataKey="roas" radius={[0,4,4,0]}>
                {[...CAMPAIGNS].sort((a, b) => b.roas - a.roas).map((c, i) => (
                  <Cell key={i}
                    fill={c.roas >= 4 ? TEAL : c.roas >= 2 ? "#5BA7AA" : "#BDE0E3"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ marginTop:12, overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:11 }}>
              <thead>
                <tr style={{ background:NAVY }}>
                  {["캠페인","유형","광고비","매출","ROAS"].map(h => (
                    <th key={h} style={{ color:"#fff", padding:"5px 8px",
                      textAlign:"center", fontWeight:700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS.map((c, i) => (
                  <tr key={i} style={{ background:i%2===0?"#fff":"#F7FAFD" }}>
                    <td style={{ padding:"5px 8px", fontSize:10, color:NAVY }}>{c.name}</td>
                    <td style={{ padding:"5px 8px", textAlign:"center" }}>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 6px",
                        borderRadius:4,
                        background: c.type==="SB" ? "#E8F4FD" : "#E6F7F0",
                        color:       c.type==="SB" ? NAVY      : TEAL }}>
                        {c.type}
                      </span>
                    </td>
                    <td style={{ padding:"5px 8px", textAlign:"center", fontSize:10 }}>
                      {fmt(c.spend)}
                    </td>
                    <td style={{ padding:"5px 8px", textAlign:"center", fontSize:10 }}>
                      {fmt(c.sales)}
                    </td>
                    <td style={{ padding:"5px 8px", textAlign:"center", fontWeight:700,
                      color: c.roas>=4 ? TEAL : c.roas>=2 ? "#2E7D32" : RED }}>
                      {c.roas}x
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <AIBox lines={AI.campaign} />
        </Card>
      </div>
    </>
  );
}

// ── ACTION TAB ────────────────────────────────────────────────────
function ActionTab() {
  const [items, setItems] = useState([
    { cat:"광고",     pri:"High",   item:"SP Auto 저효율 캠페인 네거티브 처리 — AUTO_6(ROAS 1.30), Auto_5(ROAS 1.43) 절감 예산을 UltimateKeywordsExact(ROAS 4.87)로 이동", owner:"", due:"2026.04.25", status:"진행중" },
    { cat:"광고",     pri:"High",   item:"ACOS 44% → 35% 목표: UltimateKeywordsExact 예산 2배 즉시 증액", owner:"", due:"2026.04.25", status:"예정" },
    { cat:"광고",     pri:"Medium", item:"Eye Cream SP Auto 신규 캠페인 — CVR 8.42% 확인, 세션 확대 (현재 368건으로 극히 낮음)", owner:"", due:"2026.04.28", status:"예정" },
    { cat:"셀렉션",   pri:"High",   item:"Hero(Night Cream) 88% 집중 리스크 완화: Mask/Eye Cream 광고 예산 배분 확대, 각 15%/5% 매출 비중 목표", owner:"", due:"2026.05.15", status:"검토중" },
    { cat:"컨텐츠",   pri:"Medium", item:"Eye Cream PDP 개선(A+ 콘텐츠·영상) — CVR 8.42% 강점 살려 트래픽 유입 증가 시 레버리지", owner:"", due:"2026.05.10", status:"예정" },
    { cat:"재고관리", pri:"High",   item:"Mask OOS 재발 방지 — FBA 안전재고 최소 6주치 상시 유지 설정, 재고 임계치(2주치) 알림 구성. 지정학적 리스크 모니터링 채널 수립", owner:"", due:"2026.04.28", status:"진행중" },
  ]);

  const upd = (i, k, v) => setItems(p => { const a = [...p]; a[i] = { ...a[i], [k]:v }; return a; });
  const addRow = () => setItems(p => [...p, { cat:"", pri:"Medium", item:"", owner:"", due:"", status:"예정" }]);

  const priC = { High:RED, Medium:ORANGE, Low:TEAL };
  const stBg = { "진행중":"#D4EDDA","예정":"#FFF3CD","완료":"#CCE5FF","검토중":"#F8D7DA" };

  return (
    <>
      <Card>
        <STitle>💡 종합 인사이트</STitle>
        <AIBox lines={AI.action} />
      </Card>

      <Card>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:15, fontWeight:800, color:NAVY }}>액션 플랜 테이블</div>
          <button onClick={addRow} style={{ background:TEAL, color:"#fff", border:"none",
            borderRadius:6, padding:"7px 14px", fontSize:12, fontWeight:700,
            cursor:"pointer", fontFamily:"inherit" }}>
            + 추가
          </button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:900 }}>
            <thead>
              <tr style={{ background:NAVY }}>
                {["#","우선순위","카테고리","액션 항목","담당자","마감일","상태"].map(h => (
                  <th key={h} style={{ color:"#fff", padding:"8px 10px", fontSize:11,
                    textAlign: h==="액션 항목" ? "left" : "center", fontWeight:700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((a, i) => (
                <tr key={i} style={{ background:i%2===0?"#fff":"#F7FAFD",
                  borderBottom:"1px solid #E5EEF5" }}>
                  <td style={{ padding:"8px 10px", textAlign:"center",
                    fontSize:11, color:"#aaa" }}>{i+1}</td>
                  <td style={{ padding:"6px 8px", textAlign:"center" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:priC[a.pri]||NAVY,
                      background: a.pri==="High"?"#FFF0EF": a.pri==="Medium"?"#FFF8E1":"#E6F7F0",
                      padding:"3px 8px", borderRadius:12 }}>
                      {a.pri}
                    </span>
                  </td>
                  <td style={{ padding:"6px 8px", textAlign:"center" }}>
                    <input value={a.cat} onChange={e => upd(i,"cat",e.target.value)}
                      style={{ width:72, fontSize:11, border:"1px solid #ddd", borderRadius:4,
                        padding:"3px 6px", fontFamily:"inherit", textAlign:"center" }} />
                  </td>
                  <td style={{ padding:"6px 8px" }}>
                    <input value={a.item} onChange={e => upd(i,"item",e.target.value)}
                      style={{ width:"100%", minWidth:360, fontSize:11, border:"1px solid #ddd",
                        borderRadius:4, padding:"4px 6px", fontFamily:"inherit" }} />
                  </td>
                  <td style={{ padding:"6px 8px", textAlign:"center" }}>
                    <input value={a.owner} onChange={e => upd(i,"owner",e.target.value)}
                      placeholder="담당자" style={{ width:72, fontSize:11, border:"1px solid #ddd",
                        borderRadius:4, padding:"3px 6px", fontFamily:"inherit", textAlign:"center" }} />
                  </td>
                  <td style={{ padding:"6px 8px", textAlign:"center" }}>
                    <input value={a.due} onChange={e => upd(i,"due",e.target.value)}
                      style={{ width:96, fontSize:11, border:"1px solid #ddd", borderRadius:4,
                        padding:"3px 6px", fontFamily:"inherit", textAlign:"center" }} />
                  </td>
                  <td style={{ padding:"6px 8px", textAlign:"center" }}>
                    <select value={a.status} onChange={e => upd(i,"status",e.target.value)}
                      style={{ fontSize:11, background:stBg[a.status]||"#eee", border:"none",
                        borderRadius:6, padding:"4px 8px", fontWeight:700,
                        cursor:"pointer", fontFamily:"inherit" }}>
                      {["예정","진행중","검토중","완료"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display:"flex", gap:10, marginTop:16, flexWrap:"wrap" }}>
          {[
            { l:"🔴 High",  v:items.filter(a=>a.pri==="High").length+"건",    bg:"#FFF0EF", c:RED         },
            { l:"🟡 Medium",v:items.filter(a=>a.pri==="Medium").length+"건",   bg:"#FFF8E1", c:ORANGE      },
            { l:"⏳ 진행중", v:items.filter(a=>a.status==="진행중").length+"건",bg:"#D4EDDA", c:"#155724"  },
            { l:"📋 예정",   v:items.filter(a=>a.status==="예정").length+"건",  bg:"#FFF3CD", c:"#856404"  },
          ].map((ch, i) => (
            <div key={i} style={{ background:ch.bg, borderRadius:20,
              padding:"5px 14px", fontSize:12, fontWeight:700, color:ch.c }}>
              {ch.l}: {ch.v}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}


// ── FORECAST TAB ─────────────────────────────────────────────────
function ForecastTab() {
  const [activeEvent, setActiveEvent] = useState("AMS");

  // ── Data ────────────────────────────────────────────────────────
  const FORECAST_CHART = [
    {wk:"25-W39",s:21306,type:"2025실적",ev:null},
    {wk:"25-W42",s:32700,type:"2025실적",ev:null},
    {wk:"25-W43",s:32717,type:"2025실적",ev:null},
    {wk:"25-W44",s:38221,type:"2025실적",ev:null},
    {wk:"25-W45",s:57007,type:"2025행사",ev:"11/11"},
    {wk:"25-W46",s:60367,type:"2025행사",ev:"11/11"},
    {wk:"25-W47",s:45158,type:"2025실적",ev:null},
    {wk:"25-W48",s:53343,type:"2025행사",ev:"WFS"},
    {wk:"25-W49",s:36080,type:"2025행사",ev:"WFS"},
    {wk:"25-W52",s:38651,type:"2025실적",ev:"Xmas"},
    {wk:"26-W05",s:55234,type:"2026실적",ev:"RMD"},
    {wk:"26-W06",s:47592,type:"2026실적",ev:null},
    {wk:"26-W10",s:18642,type:"2026실적",ev:null},
    {wk:"26-W15",s:30134,type:"2026실적",ev:null},
    {wk:"26-W16",s:28371,type:"2026실적",ev:null},
    {wk:"26-W20",s:84000,type:"2026예측",ev:"AMS"},
    {wk:"26-W21",s:84000,type:"2026예측",ev:"AMS"},
    {wk:"26-W26",s:82250,type:"2026예측",ev:"PD"},
    {wk:"26-W27",s:82250,type:"2026예측",ev:"PD"},
    {wk:"26-W45",s:74475,type:"2026예측",ev:"11/11"},
    {wk:"26-W46",s:74475,type:"2026예측",ev:"11/11"},
    {wk:"26-W48",s:56700,type:"2026예측",ev:"WFS"},
    {wk:"26-W49",s:56700,type:"2026예측",ev:"WFS"},
  ];

  const QUARTERLY = [
    {q:"Q1 실적\n(W01-16)",  s:514759, type:"actual"},
    {q:"Q2 예측\n(AMS포함)", s:376000, type:"fc"},
    {q:"Q3 예측\n(PD포함)",  s:549500, type:"fc"},
    {q:"Q4 예측\n(11/11+WFS)",s:622350,type:"fc"},
  ];

  // ── ASIN-level inventory per event ───────────────────────────────
  const INVENTORY = {
    AMS: {
      date:"May 15–21 (W20-21)", urgency:"🔴 긴급", deadline:"4월 24일",
      weeklyPeak:879, bau:294,
      asins:[
        {name:"Night Cream", asin:"B0F3HV1RXD", asp:97.5,
         bau_wk:259, peak_wk:774, event_total:1548, safety:310, order:1858,
         ship:"항공 긴급 발송 (4/24까지 도착 필수)", note:"전체 매출 88% 의존 — 재고 부족 시 행사 전체 기회 손실"},
        {name:"Collagen Mask", asin:"B0D83DKM8C", asp:83.7,
         bau_wk:34, peak_wk:100, event_total:200, safety:40, order:240,
         ship:"항공 또는 익스프레스 해상", note:"CVR 5.38% — 행사 기간 SB 광고 병행 시 추가 수요 발생 가능"},
        {name:"Eye Cream", asin:"B0FRFM7GJD", asp:108.4,
         bau_wk:1, peak_wk:5, event_total:10, safety:5, order:15,
         ship:"현재 재고로 충분 가능성 높음", note:"광고 신규 집행 중 — 예상치 못한 spike 대비 15units 확보"},
      ]
    },
    PD: {
      date:"End of June (W26-27)", urgency:"🟡 요주의", deadline:"6월 5일",
      weeklyPeak:860, bau:366,
      asins:[
        {name:"Night Cream", asin:"B0F3HV1RXD", asp:97.5,
         bau_wk:322, peak_wk:860, event_total:1720, safety:344, order:2064,
         ship:"해상 5~6주 → 4/25 선적 또는 항공 6/5", note:"PD = Lepique 첫 번째 Prime Day (2025 W28 론칭) — 공격적 물량 확보 권장"},
        {name:"Collagen Mask", asin:"B0D83DKM8C", asp:83.7,
         bau_wk:42, peak_wk:98, event_total:196, safety:40, order:236,
         ship:"AMS 잔재고 활용 가능 여부 확인 후 결정", note:"PD 기간 Bundle 딜 신청 검토 (Cream + Mask 세트)"},
        {name:"Eye Cream", asin:"B0FRFM7GJD", asp:108.4,
         bau_wk:3, peak_wk:15, event_total:30, safety:10, order:40,
         ship:"항공편, 소량", note:"PD 전까지 광고 실적 쌓여 수요 예측 가능해질 것"},
      ]
    },
    "11/11": {
      date:"W45-46, Nov 7–12", urgency:"🟢 계획중", deadline:"10월 13일",
      weeklyPeak:777, bau:470,
      asins:[
        {name:"Night Cream", asin:"B0F3HV1RXD", asp:97.5,
         bau_wk:414, peak_wk:777, event_total:1554, safety:311, order:1865,
         ship:"해상 선적 9월 말 → 10/13 FBA 입고", note:"2025 실적: 주평균 AED 58,687 (+65.5% WoW) — 같은 배율 적용"},
        {name:"Collagen Mask", asin:"B0D83DKM8C", asp:83.7,
         bau_wk:54, peak_wk:100, event_total:200, safety:40, order:240,
         ship:"해상, 9월 말 선적", note:"11/11 특가 딜 신청 시 수요 추가 상승 가능"},
        {name:"Eye Cream", asin:"B0FRFM7GJD", asp:108.4,
         bau_wk:7, peak_wk:30, event_total:60, safety:15, order:75,
         ship:"항공 또는 해상", note:"H2에는 Eye Cream 세션이 성장해 있을 것으로 예상"},
      ]
    },
    WFS: {
      date:"W48-49, Nov 20–30", urgency:"🟢 계획중", deadline:"10월 20일",
      weeklyPeak:592, bau:470,
      asins:[
        {name:"Night Cream", asin:"B0F3HV1RXD", asp:97.5,
         bau_wk:414, peak_wk:592, event_total:1184, safety:237, order:1421,
         ship:"11/11 잔재고 활용 — 추가 발주 최소화", note:"2025 WFS 실적: +26.1% WoW, 11/11 직후라 재고 연속 대응"},
        {name:"Collagen Mask", asin:"B0D83DKM8C", asp:83.7,
         bau_wk:54, peak_wk:75, event_total:150, safety:30, order:180,
         ship:"11/11 잔재고 활용", note:"BF/Cyber 기간 글로벌 할인 트렌드 활용 가능"},
        {name:"Eye Cream", asin:"B0FRFM7GJD", asp:108.4,
         bau_wk:7, peak_wk:20, event_total:40, safety:10, order:50,
         ship:"11/11 잔재고 활용", note:"소량이므로 11/11 물량에 포함해 발주"},
      ]
    },
  };

  // ── Ad strategy per event ─────────────────────────────────────────
  const AD_STRATEGY = {
    AMS: {
      phase:[
        {label:"D-21 ~ D-14\n(W17~W18)", title:"Pre-warm", color:"#E8F4FD",
         items:[
           "UltimateKeywordsExact 예산 AED 512($139) → AED 800($218)으로 증액 (BAU 안정화)",
           "ProductsTarget (ROAS 20.4x) 예산 AED 15($4) → AED 100($27)으로 즉시 증액",
           "SB_AmazonBestSeller 일 예산 +30%로 상향 — Impression 148K 베이스 유지",
           "AUTO_6·Auto_5 저효율 캠페인 일시 중단 또는 예산 50% 감축 → 절감분 재배분",
           "Eye Cream Auto (ROAS 4.5x) 예산 AED 184($50) → AED 300($82)으로 증액",
         ]},
        {label:"D-7 ~ D-1\n(W19)", title:"Deal 신청·소재 준비", color:"#FFF8E1",
         items:[
           "AMS Lightning Deal / Prime Exclusive Discount 신청 (마감일 확인 필수)",
           "SB 배너 소재 AMS 테마로 교체 (프로모션 강조 카피)",
           "Night Cream 메인 이미지에 'AMS Deal' 뱃지 추가 A/B 테스트",
           "쿠폰 5~10% 설정 — 행사 당일 Search 결과 내 쿠폰 뱃지 노출",
           "UltimateKeywordsExact 예산 AED 800($218) → AED 1,500($408)으로 추가 증액",
         ]},
        {label:"D-Day\n(W20-21)", title:"행사 기간", color:"#E6F7F0",
         items:[
           "전체 캠페인 예산 평시 대비 3x 상향 — ACOS 목표 35% → 55%로 한시 완화",
           "UltimateKeywordsExact + ProductsTarget 최우선 예산 배분 (고효율 집중)",
           "SB_AmazonBestSeller NTB 94% — 신규 유입 극대화 위해 SB 예산 2x 유지",
           "SB_Turkeyneck (ROAS 0.94x) 행사 기간 일시 중단 — 예산 낭비 방지",
           "시간대별 매출 모니터링, 예산 소진 시 즉시 증액 (일 캡 제거 고려)",
         ]},
        {label:"D+3 ~ D+14\n(W22-23)", title:"Post-event Remarketing", color:"#F3E5F5",
         items:[
           "SD Remarketing — 행사 기간 PDP 방문자 대상 View Remarketing 2주 운영",
           "쿠폰 제거 후 SP 예산 정상화 (평시 대비 1.3x 수준으로 점진적 감축)",
           "전환 미완료 장바구니 유저 대상 SD Product Targeting 집중",
           "행사 데이터 분석: Search Term A등급 추출 → 수동 캠페인 키워드 추가",
         ]},
      ]
    },
    PD: {
      phase:[
        {label:"D-21 ~ D-14\n(W23~W24)", title:"BSR 순위 올리기", color:"#E8F4FD",
         items:[
           "SP Exact 주요 키워드 비딩 강화 — PD 전 BSR Top 10 진입 목표 (노출 유리)",
           "UltimateKeywordsExact 예산 AED 1,500($408) 유지, CPC 상한 소폭 상향",
           "ProductsTarget (ROAS 20.4x) 예산 AED 200($54)으로 증액 — 경쟁 PDP 트래픽 흡수",
           "SB 소재 PD 테마로 교체 (Prime Day 카피·배너)",
           "리뷰 수 확인 — PD 전 100건 이상 목표, Vine 활용 고려",
         ]},
        {label:"D-7 ~ D-1\n(W25)", title:"딜 세팅·최종 준비", color:"#FFF8E1",
         items:[
           "Prime Day Deal / Lightning Deal 신청 완료 확인",
           "Night Cream + Mask 세트 번들 딜 신청 검토",
           "PD 기간 ACOS 목표 50%로 상향 허용 (매출 극대화 우선)",
           "Eye Cream 전용 SP Auto 예산 AED 500($136) 이상으로 확대 — 첫 PD 노출 기회",
           "전 캠페인 일일 예산 캡 제거 또는 3x 상향 설정",
         ]},
        {label:"D-Day\n(W26-27)", title:"행사 기간", color:"#E6F7F0",
         items:[
           "실시간 모니터링: 시간당 매출·예산 소진율 확인, 조기 소진 시 즉시 증액",
           "UltimateKeywordsExact + ProductsTarget 최우선 (ROAS 4.87x·20.4x)",
           "SB_AmazonBestSeller NTB 94% 강점 — PD 신규 고객 유입 채널로 최대 활용",
           "Eye Cream 첫 번째 PD — Auto ROAS 4.5x 기반 예산 1,000 이상 투입",
           "Mask 전용 SB 소재 운영 — Hero 의존도 분산 기회",
         ]},
        {label:"D+3 ~ D+14\n(W28-29)", title:"Post-PD 전환 극대화", color:"#F3E5F5",
         items:[
           "SD Remarketing 2주 — PD 방문자 중 미구매자 재타겟",
           "PD에서 발굴된 고전환 Search Term 수동 캠페인에 즉시 추가",
           "리뷰 요청 자동화 확인 — PD 구매자 리뷰 유도로 BSR 유지",
           "예산 단계적 정상화 (3x → 2x → 1.5x → 1x, 2주에 걸쳐)",
         ]},
      ]
    },
    "11/11": {
      phase:[
        {label:"D-21 ~ D-14\n(W43~W44)", title:"Pre-warm & 소재", color:"#E8F4FD",
         items:[
           "2025 11/11 실적(주평균 AED 58,687 / $15,979, +65.5%) 기반 예산 계획 수립",
           "SP 전체 예산 평시 대비 1.5x pre-warm, UltimateKeywordsExact 우선",
           "SB 배너 11/11 테마 소재 준비 (카운트다운·특가 강조)",
           "Mask·Eye Cream 11/11 딜 신청 — Hero 외 품목 매출 비중 확대 기회",
           "리뷰 100건+ 유지 확인, 스토어 페이지 11/11 테마 업데이트",
         ]},
        {label:"D-7 ~ D-1\n(W44)", title:"딜·쿠폰 세팅", color:"#FFF8E1",
         items:[
           "Night Cream·Mask 7day Deal 또는 쿠폰 10~15% 설정",
           "SB_AmazonBestSeller·SB_Latest 예산 2x 상향",
           "Eye Cream Manual (ROAS 2.93x) 예산 증액 — 11/11 기간 첫 본격 노출",
           "AUTO_6·Auto_5 완전 중단 유지 — 행사 예산 고효율 캠페인 집중",
         ]},
        {label:"D-Day\n(W45-46)", title:"행사 2주", color:"#E6F7F0",
         items:[
           "전체 예산 2025 대비 +65.5% 증액 (실적 기반 정확한 배율 적용)",
           "UltimateKeywordsExact 예산 최우선 — ACOS 20.5% 목표 유지",
           "SB NTB 94% 캠페인(AmazonBestSeller·CrowsFeet) 집중 투자",
           "2주차(W46) 피크: 2025 W46이 W45보다 +5.9% 높았음 → 예산 추가 확보",
           "ACOS 목표 50~55%로 완화, 매출 볼륨 극대화 우선",
         ]},
        {label:"D+3 ~ D+14\n(W47-48)", title:"WFS 연계 대응", color:"#F3E5F5",
         items:[
           "11/11 종료 즉시 WFS 캠페인으로 전환 — 쿠폰 교체, 소재 BF/WFS 테마",
           "SD Remarketing 11/11 방문자 대상 2주 운영",
           "11/11 고전환 Search Term → 수동 추가, 저효율 키워드 네거티브",
           "예산 2주에 걸쳐 정상화 (2x → 1.5x → 1x)",
         ]},
      ]
    },
  };

  const ev = INVENTORY[activeEvent];
  const ad = AD_STRATEGY[activeEvent];

  const urgBg = {"🔴 긴급":"#FFF0EF","🟡 요주의":"#FFF8E1","🟢 계획중":"#E6F7F0"};
  const urgC  = {"🔴 긴급":RED,       "🟡 요주의":ORANGE,    "🟢 계획중":TEAL};
  const BAR_COLORS = {"2025실적":"#BDE0E3","2025행사":ORANGE,"2026실적":TEAL,"2026예측":"rgba(10,147,150,0.35)"};
  const phaseColor = ["#1B2B4B","#0A6640","#0A9396","#5B2D8E"];

  return (
    <>
      {/* Top KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <KPIBox label="2026 연간 Forecast" value="AED 2.06M / $561K" sub="≈ 7.7억원"  color={NAVY}    />
        <KPIBox label="2025 H2 실적"        value="AED 523K / $142K" sub="론칭 후 25주" color="#5B6E8E" />
        <KPIBox label="현재 주간 Run Rate"   value="AED 29K / $7.9K" sub="42u/day · 294u/wk" color={TEAL}    />
        <KPIBox label="AMS까지 남은 기간"    value="~4주"     sub="재고 마감 4월 24일"  color={RED}     />
      </div>

      {/* Forecast chart + quarterly */}
      <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:20,marginBottom:0}}>
        <Card>
          <STitle>2025 실적 vs 2026 행사 예측 (주간)</STitle>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={FORECAST_CHART} margin={{top:4,right:8,bottom:22,left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
              <XAxis dataKey="wk" tick={{fontSize:8}} angle={-45} textAnchor="end"/>
              <YAxis tickFormatter={v=>`${(v/1000).toFixed(0)}K`} tick={{fontSize:10}}/>
              <Tooltip formatter={v=>[`AED ${Number(v).toLocaleString()}`,"매출"]}
                labelFormatter={l=>{const r=FORECAST_CHART.find(x=>x.wk===l); return r?.ev?`${l} (${r.ev})`:l;}}/>
              <Bar dataKey="s" radius={[3,3,0,0]}>
                {FORECAST_CHART.map((e,i)=><Cell key={i} fill={BAR_COLORS[e.type]||"#ccc"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:10,marginTop:6,flexWrap:"wrap"}}>
            {Object.entries(BAR_COLORS).map(([k,v])=>(
              <div key={k} style={{display:"flex",alignItems:"center",gap:4,fontSize:10}}>
                <div style={{width:9,height:9,borderRadius:2,background:v,border:"1px solid #ddd"}}/>
                <span style={{color:"#777"}}>{k}</span>
              </div>
            ))}
          </div>
          <AIBox lines={AI.forecast}/>
        </Card>

        <Card>
          <STitle>분기별 Forecast</STitle>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={QUARTERLY} margin={{top:4,right:10,bottom:0,left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false}/>
              <XAxis dataKey="q" tick={{fontSize:9}}/>
              <YAxis tickFormatter={v=>`${(v/1000).toFixed(0)}K`} tick={{fontSize:10}}/>
              <Tooltip formatter={v=>[`AED ${Number(v).toLocaleString()}`]}/>
              <Bar dataKey="s" radius={[4,4,0,0]}>
                {QUARTERLY.map((e,i)=><Cell key={i} fill={e.type==="actual"?TEAL:"rgba(10,147,150,0.4)"}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:10}}>
            {QUARTERLY.map((q,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",
                padding:"4px 0",borderBottom:"1px solid #F0F4F8",fontSize:12}}>
                <span style={{color:q.type==="actual"?TEAL:"#888",fontWeight:q.type==="actual"?700:400}}>
                  {q.q.replace("\n"," ")} {q.type==="actual"?"✓":"(예측)"}
                </span>
                <span style={{fontWeight:700,color:NAVY}}>AED {(q.s/1000).toFixed(0)}K / ${(q.s*0.2723/1000).toFixed(0)}K</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",
              padding:"6px 0",fontSize:13,fontWeight:800,color:NAVY,marginTop:2}}>
              <span>Full Year 2026</span>
              <span style={{color:TEAL}}>AED 2,063K / $562K</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Event selector */}
      <div style={{display:"flex",gap:8,marginBottom:16,marginTop:4}}>
        <div style={{fontSize:13,fontWeight:700,color:NAVY,alignSelf:"center",marginRight:4}}>
          행사 선택 →
        </div>
        {["AMS","PD","11/11","WFS"].map(e=>(
          <button key={e} onClick={()=>setActiveEvent(e)} style={{
            padding:"8px 20px",fontSize:12,fontWeight:700,borderRadius:8,border:"none",
            cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",
            background: activeEvent===e ? NAVY : "#fff",
            color:       activeEvent===e ? "#fff" : NAVY,
            boxShadow:   activeEvent===e ? "0 2px 8px rgba(27,43,75,0.25)" : "0 1px 4px rgba(0,0,0,0.08)",
          }}>
            {e==="AMS"?"🔴 AMS":e==="PD"?"🟡 Prime Day":e==="11/11"?"🟢 11/11":"🟢 WFS/BF"}
          </button>
        ))}
        <div style={{marginLeft:"auto",alignSelf:"center"}}>
          <span style={{fontSize:12,background:urgBg[ev.urgency],color:urgC[ev.urgency],
            padding:"5px 14px",borderRadius:20,fontWeight:700}}>
            {ev.urgency} · {ev.date}
          </span>
        </div>
      </div>

      {/* Two column: inventory + ad strategy */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>

        {/* ── Inventory ── */}
        <Card>
          <STitle>📦 ASIN별 재고 보충 플랜 — {activeEvent}</STitle>
          <div style={{marginBottom:12,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <div style={{background:"#F7FAFD",borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:10,color:"#888"}}>피크 주 예측</div>
              <div style={{fontSize:16,fontWeight:800,color:TEAL}}>{ev.weeklyPeak.toLocaleString()} u/wk</div>
              <div style={{fontSize:10,color:TEAL,opacity:0.8}}>AED {(ev.weeklyPeak*95.7/1000).toFixed(0)}K / ${(ev.weeklyPeak*95.7*0.2723/1000).toFixed(0)}K</div>
            </div>
            <div style={{background:"#F7FAFD",borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:10,color:"#888"}}>현재 BAU</div>
              <div style={{fontSize:16,fontWeight:800,color:NAVY}}>{ev.bau.toLocaleString()} u/wk</div>
              <div style={{fontSize:10,color:"#888"}}>AED {(ev.bau*95.7/1000).toFixed(0)}K / ${(ev.bau*95.7*0.2723/1000).toFixed(0)}K</div>
            </div>
            <div style={{background:urgBg[ev.urgency],borderRadius:8,padding:"8px 12px"}}>
              <div style={{fontSize:10,color:"#888"}}>입고 마감</div>
              <div style={{fontSize:16,fontWeight:800,color:urgC[ev.urgency]}}>{ev.deadline}</div>
            </div>
          </div>

          {ev.asins.map((a,i)=>(
            <div key={i} style={{
              border:`1.5px solid ${i===0?"#0A9396":i===1?"#EE9B00":"#BDE0E3"}`,
              borderRadius:10,padding:"14px 16px",marginBottom:10
            }}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div>
                  <span style={{fontSize:13,fontWeight:800,color:NAVY}}>{a.name}</span>
                  <span style={{fontSize:10,color:"#999",marginLeft:8}}>{a.asin}</span>
                </div>
                <span style={{fontSize:11,color:"#888"}}>ASP AED {a.asp}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:10}}>
                {[
                  {l:"BAU 속도", v:`${a.bau_wk}u · AED ${(a.bau_wk*a.asp).toLocaleString("en",{maximumFractionDigits:0})} / $${(a.bau_wk*a.asp*0.2723).toFixed(0)}`},
                  {l:"피크 속도", v:`${a.peak_wk}u · AED ${(a.peak_wk*a.asp).toLocaleString("en",{maximumFractionDigits:0})} / $${(a.peak_wk*a.asp*0.2723).toFixed(0)}`, hi:true},
                  {l:"행사 합계", v:`${a.event_total}u · AED ${(a.event_total*a.asp/1000).toFixed(1)}K`},
                  {l:"안전재고",  v:`+${a.safety}u`},
                  {l:"총 발주량", v:`${a.order}u · AED ${(a.order*a.asp/1000).toFixed(1)}K / $${(a.order*a.asp*0.2723/1000).toFixed(1)}K`, bold:true},
                ].map((kv,j)=>(
                  <div key={j} style={{
                    background: kv.bold?"#1B2B4B":kv.hi?"#E6F7F0":"#F7FAFD",
                    borderRadius:6,padding:"6px 8px",textAlign:"center"
                  }}>
                    <div style={{fontSize:9,color:kv.bold?"rgba(255,255,255,0.6)":"#888"}}>{kv.l}</div>
                    <div style={{fontSize:13,fontWeight:800,
                      color:kv.bold?"#fff":kv.hi?"#0A6640":NAVY}}>{kv.v}</div>
                  </div>
                ))}
              </div>
              <div style={{fontSize:11,background:"#F7FAFD",borderRadius:6,padding:"7px 10px",
                display:"flex",gap:6,alignItems:"flex-start"}}>
                <span style={{fontSize:12,flexShrink:0}}>🚚</span>
                <span style={{color:"#555"}}><strong>운송:</strong> {a.ship}</span>
              </div>
              <div style={{fontSize:11,color:"#666",marginTop:6,padding:"0 2px"}}>
                💡 {a.note}
              </div>
            </div>
          ))}

          <AIBox lines={AI.inventory}/>
        </Card>

        {/* ── Ad Strategy ── */}
        <Card>
          <STitle>📣 행사별 광고 전략 — {activeEvent}</STitle>

          {/* Campaign tier summary */}
          <div style={{marginBottom:14}}>
            <div style={{fontSize:11,fontWeight:700,color:"#888",marginBottom:8,
              textTransform:"uppercase",letterSpacing:"0.07em"}}>
              현재 캠페인 액션 티어
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr",gap:5}}>
              {[
                {tier:"🟢 SCALE",  bg:"#E6F7F0", c:"#0A6640",
                 camps:["ProductsTarget (ROAS 20.4x)","UltimateKeywordsExact (ROAS 4.87x)","EyeCream_Auto (ROAS 4.50x)","Coverage_0.8_Max4AED (ROAS 6.05x)"]},
                {tier:"🟡 OPTIMIZE", bg:"#FFF8E1", c:"#856404",
                 camps:["EyeCream_Manual (ROAS 2.93x)","SB_Latest (ROAS 2.37x)","LatestSuggestion (ROAS 2.42x)","SB_AmazonBestSeller (ROAS 2.07x, NTB 94%)","SB_CrowsFeet (NTB 100%)"]},
                {tier:"🔴 CUT / PAUSE", bg:"#FFF0EF", c:RED,
                 camps:["AUTO_6 (ROAS 1.30x)","Auto_5 (ROAS 1.43x)","SB_Turkeyneck (ROAS 0.94x)","Coverage_Amazon*1 (ROAS 1.20x)"]},
              ].map((t,i)=>(
                <div key={i} style={{background:t.bg,borderRadius:7,padding:"8px 12px"}}>
                  <div style={{fontSize:11,fontWeight:700,color:t.c,marginBottom:4}}>{t.tier}</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                    {t.camps.map((c,j)=>(
                      <span key={j} style={{fontSize:10,background:"rgba(255,255,255,0.7)",
                        padding:"2px 7px",borderRadius:10,color:"#333"}}>{c}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase timeline */}
          {ad && ad.phase.map((p,i)=>(
            <div key={i} style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                  background:phaseColor[i],display:"flex",alignItems:"center",
                  justifyContent:"center",fontSize:11,fontWeight:800,color:"#fff"}}>
                  {i+1}
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:800,color:NAVY}}>{p.title}</div>
                  <div style={{fontSize:10,color:"#888"}}>{p.label.replace("\n"," ")}</div>
                </div>
              </div>
              <div style={{background:p.color,borderRadius:8,padding:"10px 14px",
                marginLeft:36}}>
                {p.items.map((item,j)=>(
                  <div key={j} style={{display:"flex",gap:7,marginBottom: j<p.items.length-1?6:0}}>
                    <span style={{fontSize:11,color:TEAL,flexShrink:0,marginTop:1}}>•</span>
                    <span style={{fontSize:11.5,color:"#1a1a2e",lineHeight:1.6}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {!ad && (
            <div style={{padding:"16px",background:"#F7FAFD",borderRadius:8,
              fontSize:12,color:"#888",textAlign:"center"}}>
              WFS는 11/11 직후 연계 대응 — 11/11 광고 전략 참고
            </div>
          )}

          <AIBox lines={AI.adplan}/>
        </Card>
      </div>
    </>
  );
}

// ── INVENTORY TAB ─────────────────────────────────────────────────
function InventoryTab() {
  const [snapDate, setSnapDate] = useState("26.04 (Apr 20)");
  const R = 0.2723;
  const aed = n => `AED ${Number(n).toLocaleString("en",{maximumFractionDigits:0})}`;
  const usd = n => `$${Number(n*R).toLocaleString("en",{maximumFractionDigits:0})}`;

  const dispColors = {
    SELLABLE:"#0A9396", DEFECTIVE:"#EE9B00",
    CUSTOMER_DAMAGED:"#AE2012", WAREHOUSE_DAMAGED:"#5B6E8E"
  };

  // Warehouse bar data for Night Cream
  const whData = INV_SNAPSHOT.asins[0].warehouses.map(w=>({name:w.wh, units:w.sellable}))
    .sort((a,b)=>b.units-a.units);

  // OOS evidence
  const oosEvidence = [
    {point:"재고 스냅샷 직접 증거 (확정)", 
     detail:"Mar31 + Apr20 두 스냅샷 모두 Mask(B0D83DKM8C) 행 자체 없음 — 최소 3월 이전부터 FBA 재고 0 상태. 가장 직접적·확정적 증거.",
     strength:"확실"},
    {point:"26.03 ASP 이상 급등 (OOS 간접 증거)", 
     detail:"정상 블렌드 ASP = AED 92~95. 26.03 ASP 108.2로 사상 최고 → Mask(ASP 83.7)가 빠지면 Night Cream(97.5)만 남아 블렌드 ASP 상승하는 구조. 재고 스냅샷과 일치.",
     strength:"강함"},
    {point:"26.04 ASP 부분 회복",
     detail:"26.04 ASP 99.3으로 하락 — Mask 재입고는 아직 없으나(스냅샷 0u), ASP 하락 이유는 Night Cream 가격 조정 또는 Eye Cream 판매 시작으로 추정.",
     strength:"중간"},
    {point:"25.10 ASP 102.1 — 재수정 (Mask OOS 아님)",
     detail:"25.10 레저 데이터 확인 결과, Mask는 10/11~14 기간 일평균 12.8u/day로 정상 판매 중(DXB6 재고 716u). 25.10 ASP 상승은 Night Cream 가격 인상 또는 고가 SKU 판매 비중 증가로 인한 것으로 수정. 25.10을 Mask OOS 근거로 사용하는 것은 부적절.",
     strength:"수정"},
    {point:"한계 및 불확실성",
     detail:"일별 ASIN별 판매 breakdown 없어 Mask 기여 매출을 정확히 분리 불가. 26.03 하락에서 OOS vs 이란-미국 지정학 갈등 각각의 기여도는 정량화 불가.",
     strength:"한계"},
  ];

  const strengthStyle = {
    "확실":{bg:"#E6F7F0",c:"#0A6640"},
    "강함": {bg:"#EDF7F8",c:TEAL},
    "중간": {bg:"#FFF8E1",c:"#856404"},
    "수정": {bg:"#FFF3E0",c:"#E65100"},
    "한계": {bg:"#F8D7DA",c:RED},
  };

  return (
    <>
      {/* Snapshot comparison header */}
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        <span style={{fontSize:12,fontWeight:700,color:NAVY}}>📅 스냅샷 비교</span>
        {Object.keys(INV_SNAPSHOTS).map(k=>(
          <button key={k} onClick={()=>setSnapDate(k)} style={{
            padding:"6px 16px",fontSize:11,fontWeight:snapDate===k?700:400,
            borderRadius:20,border:"none",cursor:"pointer",fontFamily:"inherit",
            background:snapDate===k?NAVY:"#fff",
            color:snapDate===k?"#fff":"#555",
            boxShadow:snapDate===k?"0 2px 6px rgba(27,43,75,0.2)":"0 1px 3px rgba(0,0,0,0.08)",
          }}>
            {k}
          </button>
        ))}
        <span style={{marginLeft:"auto",fontSize:11,color:"#555",
          background:"#FFF0EF",padding:"4px 12px",borderRadius:20}}>
          Mask: <strong style={{color:RED}}>OOS (Mar31·Apr20 모두 확인)</strong>
        </span>
      </div>

      {/* Snapshot summary comparison row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}>
        {[
          {l:"Night Cream SELLABLE", v26m:"3,628u", v26a:"2,237u", delta:"-1,391u", warn:false},
          {l:"Mask SELLABLE",        v26m:"0u (OOS)", v26a:"0u (OOS)", delta:"OOS 지속", warn:true},
          {l:"Eye Cream SELLABLE",   v26m:"1,048u", v26a:"1,019u", delta:"-29u", warn:false},
          {l:"NC Mar31→Apr20 변화",  v26m:"3,628u",v26a:"출고 -808u
조정 -583u",delta:"재입고 없음",warn:false},
        ].map((k,i)=>(
          <div key={i} style={{background:"#fff",borderRadius:10,padding:"12px 14px",
            boxShadow:"0 1px 6px rgba(27,43,75,0.07)",
            border:k.warn?`1.5px solid ${RED}`:"1px solid #E5EEF5"}}>
            <div style={{fontSize:10,color:"#888",marginBottom:4}}>{k.l}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:TEAL,fontWeight:700,marginBottom:2}}>Mar 31</div>
                <div style={{fontSize:12,fontWeight:800,color:NAVY}}>{k.v26m}</div>
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:9,color:NAVY,fontWeight:700,marginBottom:2}}>Apr 20</div>
                <div style={{fontSize:12,fontWeight:800,color:k.warn?RED:NAVY}}>{k.v26a}</div>
              </div>
            </div>
            <div style={{marginTop:6,fontSize:10,fontWeight:700,textAlign:"center",
              color:k.warn?RED:k.delta.startsWith("-")?ORANGE:TEAL}}>{k.delta}</div>
          </div>
        ))}
      </div>

      <div style={{background:"#EDF7F8",borderRadius:8,padding:"10px 14px",marginBottom:20,fontSize:12,color:NAVY}}>
        {INV_SNAPSHOTS[snapDate]?.note}
      </div>

      {/* ASIN inventory cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginBottom:20}}>
        {INV_SNAPSHOT.asins.map((a,i)=>{
          const runwayColor = a.oos?"#FFF0EF":a.runway_days<21?"#FFF3F3":a.runway_days<42?"#FFF8E1":"#E6F7F0";
          const runwayTextColor = a.oos?RED:a.runway_days<21?RED:a.runway_days<42?ORANGE:TEAL;
          const gapColor = a.ams_gap >= 0 ? TEAL : RED;
          const borderColor = a.oos ? RED : i===0 ? TEAL : ORANGE;
          return (
            <Card key={i} style={{marginBottom:0, borderTop:`3px solid ${borderColor}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:10,fontWeight:700,color:borderColor}}>{a.asin}</div>
                  <div style={{fontSize:13,fontWeight:800,color:NAVY}}>{a.name}</div>
                </div>
                {a.oos && (
                  <span style={{background:"#FFF0EF",color:RED,fontSize:11,fontWeight:800,
                    padding:"3px 10px",borderRadius:20}}>OOS ⚠️</span>
                )}
              </div>

              {/* Sellable highlight */}
              <div style={{background: a.oos?"#FFF0EF":"#EDF7F8",borderRadius:8,
                padding:"10px 12px",marginBottom:10,textAlign:"center"}}>
                <div style={{fontSize:10,color:"#888",marginBottom:2}}>SELLABLE 재고</div>
                <div style={{fontSize:28,fontWeight:800,color:a.oos?RED:TEAL}}>
                  {a.sellable.toLocaleString()}
                </div>
                <div style={{fontSize:11,color:"#888"}}>units</div>
                {!a.oos && (
                  <div style={{fontSize:11,color:TEAL,marginTop:2}}>
                    {aed(a.sellable*a.asp)} / {usd(a.sellable*a.asp)}
                  </div>
                )}
              </div>

              {/* Stats grid */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:8}}>
                {[
                  {l:"Unsellable",  v:`${a.unsellable.total}u`, warn:a.unsellable.total>50},
                  {l:"일 판매속도",  v:a.oos?"N/A":`${a.daily_velocity}u/day`},
                  {l:"재고 Runway",  v:a.oos?"0일":a.runway_days>365?"충분":`${a.runway_days}일 (${(a.runway_days/7).toFixed(0)}주)`,
                    style:{background:runwayColor}},
                  {l:"ASP",         v:`${aed(a.asp)} / ${usd(a.asp)}`},
                ].map((kv,j)=>(
                  <div key={j} style={{background:kv.style?.background||"#F7FAFD",
                    borderRadius:6,padding:"6px 8px"}}>
                    <div style={{fontSize:9,color:"#888"}}>{kv.l}</div>
                    <div style={{fontSize:11,fontWeight:700,
                      color:kv.warn?RED:runwayTextColor&&kv.l==="재고 Runway"?runwayTextColor:NAVY}}>
                      {kv.v}
                    </div>
                  </div>
                ))}
              </div>

              {/* AMS gap */}
              <div style={{background: a.ams_gap>=0?"#E6F7F0":"#FFF0EF",
                borderRadius:8,padding:"8px 10px"}}>
                <div style={{fontSize:10,color:"#888",marginBottom:2}}>AMS 대비 재고 Gap</div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:11,color:"#555"}}>
                    진입 예상 재고 <strong>{a.ams_entry_stock < 0 ? 0 : a.ams_entry_stock}u</strong>
                    {" vs "} 필요 <strong>{a.ams_needed}u</strong>
                  </div>
                  <div style={{fontSize:14,fontWeight:800,color:gapColor}}>
                    {a.ams_gap >= 0 ? `+${a.ams_gap}u ✅` : `${a.ams_gap}u ❌`}
                  </div>
                </div>
              </div>

              {/* Unsellable breakdown */}
              {a.unsellable.total > 0 && (
                <div style={{marginTop:8,fontSize:10,color:"#888"}}>
                  Unsellable 내역:
                  {a.unsellable.defective ? ` DEFECTIVE ${a.unsellable.defective}u` : ""}
                  {a.unsellable.customer_damaged ? ` / CUST_DAMAGED ${a.unsellable.customer_damaged}u` : ""}
                  {a.unsellable.warehouse_damaged ? ` / WH_DAMAGED ${a.unsellable.warehouse_damaged}u` : ""}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Warehouse distribution + AMS timeline */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:0}}>
        <Card>
          <STitle>Night Cream 창고별 재고 분포</STitle>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={whData} layout="vertical"
              margin={{top:0,right:60,bottom:0,left:50}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" horizontal={false}/>
              <XAxis type="number" tick={{fontSize:10}}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:11}} width={50}/>
              <Tooltip formatter={v=>[`${v} units / ${aed(v*97.5)} / ${usd(v*97.5)}`,"재고"]}/>
              <Bar dataKey="units" radius={[0,4,4,0]}>
                {whData.map((e,i)=>(
                  <Cell key={i} fill={e.units>=300?TEAL:e.units>=100?TEAL_L:"#BDE0E3"}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{marginTop:10,fontSize:11,color:"#555"}}>
            <strong>AUH1 집중 주의:</strong> 1,360u로 전체의 61% — AUH1 단독 병목 시
            전체 가용 재고 급감. 창고 분산 필요.
          </div>
          <div style={{marginTop:6,display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
            {[
              {l:"총 SELLABLE",  v:"2,237u"},
              {l:"총 UNSELLABLE",v:"190u"},
              {l:"전체 보유",    v:"2,427u"},
            ].map((k,i)=>(
              <div key={i} style={{background:"#F7FAFD",borderRadius:6,padding:"6px 8px",textAlign:"center"}}>
                <div style={{fontSize:9,color:"#888"}}>{k.l}</div>
                <div style={{fontSize:13,fontWeight:800,color:NAVY}}>{k.v}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <STitle>AMS 재고 대비 타임라인 (4/20 기준)</STitle>
          {[
            {label:"현재 (Apr 20)", days:0,  nc:2237, mask:0,   eye:1019, note:"Mask OOS 확인"},
            {label:"AMS 진입 (May 15)", days:25, nc:1300, mask:0,   eye:1019, note:"Night Cream -938u 소진 예상"},
            {label:"AMS 필요량",    days:25, nc:1547, mask:200, eye:15,  note:"Night Cream -247u 부족"},
            {label:"PD 진입 (Jun 26)", days:67, nc:87,  mask:0,   eye:1012, note:"Night Cream 위험 — 즉시 발주 필요"},
          ].map((row,i)=>(
            <div key={i} style={{
              display:"flex",alignItems:"center",gap:10,
              padding:"10px 12px",marginBottom:6,
              background: row.label.includes("필요") ? "#FFF0EF" : row.label.includes("PD") ? "#FFF3F3" : "#F7FAFD",
              borderRadius:8,
              border: row.label.includes("필요") ? `1.5px solid ${RED}` : "1px solid #E5EEF5"
            }}>
              <div style={{width:28,height:28,borderRadius:"50%",flexShrink:0,
                background: i===0?TEAL:i===2?RED:i===3?RED:NAVY,
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:10,fontWeight:800,color:"#fff"}}>{i+1}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:700,color:NAVY}}>{row.label}</div>
                <div style={{fontSize:10,color:"#888",marginTop:1}}>
                  NC: <strong style={{color:row.nc<1000?RED:TEAL}}>{row.nc.toLocaleString()}u</strong>
                  {" | "}Mask: <strong style={{color:row.mask===0?RED:TEAL}}>{row.mask===0?"OOS":row.mask+"u"}</strong>
                  {" | "}Eye: <strong style={{color:NAVY}}>{row.eye}u</strong>
                </div>
                <div style={{fontSize:10,color:row.label.includes("필요")||row.label.includes("PD")?RED:"#999",
                  marginTop:1,fontStyle:"italic"}}>{row.note}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* OOS evidence box */}
      <Card style={{marginTop:20}}>
        <STitle>🔍 Mask OOS 판단 근거 — 데이터 기반 분석</STitle>
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:8}}>
          {oosEvidence.map((e,i)=>{
            const s = strengthStyle[e.strength] || {bg:"#F7FAFD",c:NAVY};
            return (
              <div key={i} style={{display:"flex",gap:12,padding:"10px 14px",
                background:s.bg,borderRadius:8,alignItems:"flex-start"}}>
                <div style={{flexShrink:0,width:60,textAlign:"center"}}>
                  <span style={{fontSize:10,fontWeight:700,color:s.c,background:"rgba(255,255,255,0.7)",
                    padding:"2px 6px",borderRadius:10}}>{e.strength}</span>
                </div>
                <div>
                  <div style={{fontSize:12,fontWeight:700,color:NAVY,marginBottom:2}}>{e.point}</div>
                  <div style={{fontSize:11.5,color:"#444",lineHeight:1.6}}>{e.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:14,background:"#F0F8FF",borderRadius:8,padding:"10px 14px",
          fontSize:12,color:NAVY,lineHeight:1.7}}>
          <strong>결론:</strong> 4/20 재고 데이터에서 Mask 재고 행 자체가 없는 것이
          가장 직접적·확정적 증거입니다. Mar31·Apr20 두 스냅샷 모두 Mask 재고 0u로 <strong style={{color:RED}}>OOS 사실 확정</strong>됩니다.
          단, <strong>25.10 ASP 이상(102.1)은 Mask OOS 근거가 아님</strong>으로 수정 —
          25.10 레저 데이터상 Mask는 일평균 12.8u/day 정상 판매 중이었으며,
          ASP 상승은 Night Cream 가격 변동 요인으로 판단됩니다.
          확정 OOS 기간: <strong>26.03 이전(정확한 시작일은 레저 데이터 추가 확인 필요)</strong>
        </div>
      </Card>

      {/* Updated action items */}
      <Card>
        <STitle>🚨 즉시 액션 (재고 기준)</STitle>
        {[
          {pri:"🔴 긴급",  bg:"#FFF0EF", c:RED,
           title:"Mask 재발주 즉시 실행",
           detail:`현재 OOS 확인. AMS(May 15) 전 입고 불가능 → 항공 긴급 발송 검토 필수. AMS 대비 최소 200u + BAU 6주치(~200u) = 400u 발주 목표. 항공 리드타임 7~10일 기준 5월 5일 이내 출고 필요.`},
          {pri:"🔴 긴급",  bg:"#FFF0EF", c:RED,
           title:"Night Cream AMS Gap -247u 해소",
           detail:`AMS 진입 시 잔여 1,300u → 피크 2주 필요량 1,547u 대비 -247u 부족. 추가 247u 이상 항공 발송 또는 AMS 기간 광고 예산 조정으로 피크 판매속도 완화 필요.`},
          {pri:"🟡 요주의", bg:"#FFF8E1", c:ORANGE,
           title:"AUH1 창고 집중 리스크",
           detail:`Night Cream 전체의 61%(1,360u)이 AUH1 단독 창고에 집중. AUH1 입출고 지연 시 전체 가용 재고 급감. 신규 입고분은 DXB 계열로 분산 지정 권고.`},
          {pri:"🟡 요주의", bg:"#FFF8E1", c:ORANGE,
           title:"Night Cream PD(Jun 26) 재고 위기 예방",
           detail:`현재 속도 유지 시 PD 진입 시점 잔여 ~87u — 완전 OOS 위험. 5월 초 Night Cream 추가 발주(해상 선적) 착수 필요. 필요량: PD 2주 1,547u + BAU 완충 500u = 2,047u.`},
          {pri:"🟢 정상",   bg:"#E6F7F0", c:TEAL,
           title:"Eye Cream 재고 충분",
           detail:`1,019u 보유, 일 판매속도 0.1u/day로 사실상 무한대 runway. 광고 확대 후 수요 급증 시에도 AMS·PD까지 충분. 단, 광고 효과로 CVR→트래픽 증가 시 소진 가속화 모니터링 필요.`},
        ].map((item,i)=>(
          <div key={i} style={{display:"flex",gap:10,padding:"10px 14px",
            background:item.bg,borderRadius:8,marginBottom:8,
            border:`1px solid ${item.c}22`}}>
            <span style={{fontWeight:700,color:item.c,fontSize:12,flexShrink:0,
              alignSelf:"flex-start",paddingTop:1}}>{item.pri}</span>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:NAVY,marginBottom:3}}>{item.title}</div>
              <div style={{fontSize:11.5,color:"#444",lineHeight:1.65}}>{item.detail}</div>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}
