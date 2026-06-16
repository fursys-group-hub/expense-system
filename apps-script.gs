// ============================================================
// 에프스토리 지출결의 시스템 - Google Apps Script
// 3개 회사(에프스토리/바로서비스/하나물류) 통합 관리
// ============================================================

// ============================================================
// [1] JSONP 진입점 - GitHub Pages에서 직접 호출
// ============================================================
function doGet(e) {
  const params = e.parameter;

  // JSONP 데이터 제출 요청
  if (params.callback && params.data) {
    let result;
    try {
      const data = JSON.parse(decodeURIComponent(params.data));
      if      (data.type === 'mileage')   result = saveMileage(data);
      else if (data.type === 'corporate') result = saveCorporate(data);
      else if (data.type === 'personal')  result = savePersonal(data);
      else                                result = { success: false, error: '알 수 없는 type' };
    } catch (err) {
      result = { success: false, error: err.message };
    }
    return ContentService
      .createTextOutput(params.callback + '(' + JSON.stringify(result) + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput('OK');
}

// ============================================================
// [2] 회사별 시트 가져오기 (없으면 생성)
// ============================================================
function getSheet(company, sheetName, headers, headerColor) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const tabName = company + '_' + sheetName;
  let sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground(headerColor || '#1a3a6b')
      .setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// ============================================================
// [3] 자차비 저장
// ============================================================
function saveMileage(data) {
  const headers = [
    '제출일시','회사','작성자','운행일자','운행목적',
    '출발지','경유지','도착지',
    '총km','단가(원/km)','유류비','통행료','주차비','청구금액','상태'
  ];
  const sheet = getSheet(data.company || '에프스토리', '자차비', headers, '#1a3a6b');
  sheet.appendRow([
    new Date(),
    data.company || '에프스토리',
    data.writer || '',
    data.date || '',
    data.purpose || '',
    data.origin || '',
    data.waypoints || '',
    data.destination || '',
    data.km || 0,
    data.rate || 230,
    data.fuelCost || 0,
    data.toll || 0,
    data.parking || 0,
    data.totalAmount || 0,
    '검토중'
  ]);
  const lr = sheet.getLastRow();
  [11,12,13,14].forEach(c => sheet.getRange(lr, c).setNumberFormat('#,##0'));
  return { success: true };
}

// ============================================================
// [4] 법인카드 저장
// ============================================================
function saveCorporate(data) {
  const headers = [
    '제출일시','회사','작성자','결제일','사업자번호','사업자명',
    '공급가액','부가세','합계','적요','계정과목','상태'
  ];
  const sheet = getSheet(data.company || '에프스토리', '법인카드', headers, '#375623');
  sheet.appendRow([
    new Date(),
    data.company || '에프스토리',
    data.writer || '',
    data.date || '',
    data.bizNum || '',
    data.bizName || '',
    data.supply || 0,
    data.vat || 0,
    data.total || 0,
    data.memo || '',
    data.account || '',
    '검토중'
  ]);
  const lr = sheet.getLastRow();
  [7,8,9].forEach(c => sheet.getRange(lr, c).setNumberFormat('#,##0'));
  return { success: true };
}

// ============================================================
// [5] 개인미지급금 저장 (내역 1건 = 1행)
// ============================================================
function savePersonal(data) {
  const headers = [
    '제출일시','회사','작성자','지출일자','제목',
    '적요','금액','비고','합계금액','상태'
  ];
  const sheet = getSheet(data.company || '에프스토리', '개인미지급금', headers, '#1a3a6b');
  const rows = (data.rows || []).filter(r => r.summary || r.amount);
  const submitTime = new Date();
  rows.forEach((r, i) => {
    sheet.appendRow([
      submitTime,
      data.company || '에프스토리',
      data.name || '',
      data.date || '',
      data.title || '',
      r.summary || '',
      r.amount || 0,
      r.note || '',
      i === 0 ? (data.totalAmount || 0) : '',
      i === 0 ? '검토중' : ''
    ]);
    sheet.getRange(sheet.getLastRow(), 7).setNumberFormat('#,##0');
    if (i === 0) sheet.getRange(sheet.getLastRow(), 9).setNumberFormat('#,##0');
  });
  return { success: true };
}

// ============================================================
// [6] 스프레드시트 열릴 때 메뉴 등록
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('⚙️ 지출 관리')
    .addItem('📊 월별 집계 보기', 'showMonthlySummary')
    .addToUi();
}

// ============================================================
// [7] 월별 집계
// ============================================================
function showMonthlySummary() {
  SpreadsheetApp.getUi().alert('집계 기능은 추후 업데이트 예정입니다.');
}
