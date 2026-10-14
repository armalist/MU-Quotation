/* =====================================================================
   templates.js — 7 format PH yang dipakai di data quotation 2025–2026.
   Cara kerja: setiap format = daftar KOLOM + model HEADER + model TANDA TANGAN.
   buildDoc() menyusun "model dokumen" netral, lalu 3 fungsi mencetaknya:
     docHTML()  -> pratinjau di layar
     docPDF()   -> file PDF (jsPDF + autoTable)
     docXLSX()  -> file Excel (ExcelJS)
   Jadi menambah format baru cukup menambah satu entri di TPL.
   ===================================================================== */
const col = (key, label, w, xw, al = 'l', o = {}) => ({key, label, w, xw, al, ...o});
const TPL = {
  surat: {
    name:'Surat Resmi Mata Utama', orient:'p', header:'letter', head:'FFFF00', headInk:'000000', totals:'box', sign:'mu',
    hint:'Format surat resmi MU. Dipakai untuk tabel sederhana (No | Item | Description | Qty | Unit | Harga) — ±380 PH 2025–2026: Tower Media, Global Teknologi, Mitracomm, Djojonegoro, klien umum.',
    lokLabel:'Lokasi', fields:['lok','dim','trans'],
    cols:[col('no','No',8,5,'c'), col('lok','Lokasi',22,16,'c',{merge:1}), col('nama','Item',0,32), col('desc','Description',0,30),
          col('qty','Qty',10,7,'c'), col('sat','Unit',12,8,'c'), col('price','Total Cost',26,17,'r',{money:1}), col('total','Total',28,19,'r',{money:1})]},
  surat_desain: {
    name:'Surat + Desain & Dimensi', orient:'p', header:'letter', head:'FFFF00', headInk:'000000', totals:'box', sign:'mu',
    hint:'Surat resmi dengan kolom gambar desain + ukuran P × L dan luas m². Seperti PH Otri, Ultima/Ultima Asia, Akasha, BTN, Tangkas Cipta (sticker chiller, wall branding, signage).',
    lokLabel:'Lokasi', fields:['lok','dim','foto','trans'],
    cols:[col('no','No',7,5,'c'), col('lok','Lokasi',20,15,'c',{merge:1}), col('desc2','Description',0,30), col('img','Design',28,18,'c',{img:1}),
          col('size','Ukuran',20,14,'c'), col('m2','Luas m²',12,8,'c'), col('qty','Qty',9,6,'c'), col('sat','Unit',10,7,'c'),
          col('price','Unit Price',22,15,'r',{money:1}), col('total','Total',24,17,'r',{money:1})]},
  foto: {
    name:'Ringkas + Foto Item', orient:'p', header:'box', head:'8EA9DB', headInk:'000000', totals:'box', sign:'mu+client',
    hint:'Tabel ringkas dengan foto item / bahan material per baris. Seperti PH Sony, Xiaomi, Jakarana Tama, Djojonegoro (display base, acrylic stand, price tag) — ±108 PH.',
    lokLabel:'Site name', fields:['lok','dim','foto','trans'],
    cols:[col('no','NO',8,5,'c'), col('lok','SITE NAME',22,15,'c',{merge:1}), col('img','ITEMS',28,18,'c',{img:1}), col('nama','NAME ITEMS',0,24,'c'),
          col('size','SIZE',18,12,'c'), col('qty','QTY',10,6,'c'), col('desk','SPEC',0,20), col('price','PRICE',22,15,'r',{money:1}), col('total','TOTAL PRICE ALL',25,17,'r',{money:1})]},
  rollout: {
    name:'Rollout Multi-Store (Cheil)', orient:'l', header:'rollout', head:'D9D9D9', headInk:'000000', totals:'summary', sign:'approved',
    hint:'Banyak toko sekaligus: halaman SUMMARY per toko (channel code, kota, provinsi, amount) + detail per toko dengan visual, dimensi, m², transport. Seperti PH Cheil / Samsung SES & MBS maintenance, Intan Media — ±254 PH.',
    lokLabel:'Nama store', fields:['lok','kode','kota','prov','action','dim','foto','trans'], group:'store',
    cols:[col('no','NO',8,5,'c'), col('kode','CHANNEL CODE',18,13,'c'), col('lok','SITE NAME',30,22,'l',{merge:1}), col('kota','CITY',20,13,'c'), col('prov','PROVINCE',20,13,'c'),
          col('namaAct','ACTION / MATERIAL',0,30), col('img','VISUAL',22,15,'c',{img:1}), col('size','DIMENSION',20,13,'c'), col('m2','M²',10,7,'c'),
          col('qty','QTY',9,6,'c'), col('sat','UNIT',10,7,'c'), col('price','UNIT PRICE',22,14,'r',{money:1}), col('trans','TRANSPORT',19,13,'r',{money:1}), col('total','TOTAL PRICE',24,16,'r',{money:1})],
    sumCols:[col('no','NO',10,1,'c'), col('kode','CHANNEL CODE',28,1,'c'), col('lok','NAMA STORE',0,4), col('kota','KOTA',40,2,'c'), col('prov','PROVINCE',40,2,'c'), col('amount','AMOUNT',40,4,'r',{money:1})]},
  indicia: {
    name:'Format Indicia', orient:'l', header:'indicia', head:'000000', headInk:'FFFFFF', totals:'inline', sign:'mu', totalLabel:'Total Project',
    hint:'Format permintaan ADM Indicia (End Gondola, glorifier, maintenance Unilever): judul kuning, kotak STORE NAME / TOTAL VALUE / NO QUOTATION, header hitam, baris "Total Project" — ±123 PH.',
    lokLabel:'Nama toko', fields:['lok','brand','dim','trans'],
    cols:[col('nama','ITEM VISIBILITY (Detail)',46,28), col('brand','BRAND / KV',28,16,'c'), col('lok','Nama Toko',32,18,'c',{merge:1}), col('p','P',12,7,'c'), col('l','L',12,7,'c'),
          col('material','Material',0,34), col('qty','Qty',10,6,'c'), col('sat','Satuan',14,8,'c'), col('price','Price/unit',25,15,'r',{money:1}), col('total','Total Price',28,17,'r',{money:1})]},
  bq: {
    name:'BQ / RAB Store Build', orient:'p', header:'bq', head:'D9D9D9', headInk:'000000', totals:'inline', sign:'mu', group:'section',
    hint:'Rencana Anggaran Biaya untuk renovasi / store build: bagian pekerjaan (I. Persiapan, II. Sipil, III. MEP …) dengan subtotal dan persentase. Seperti PH Global Teknologi (Blibli), Erafone, Global Digital Niaga — ±39 PH.',
    lokLabel:'Bagian pekerjaan', fields:['lok','kode','dim','trans'],
    cols:[col('no','NO',11,6,'c'), col('kode','KODE',14,9,'c'), col('uraian','URAIAN PEKERJAAN',0,44), col('qty','VOL',11,7,'c'), col('sat','SAT',11,7,'c'),
          col('price','HARGA SATUAN',26,16,'r',{money:1}), col('total','JUMLAH (Rp)',28,18,'r',{money:1}), col('pct','%',11,7,'c')]},
  manpower: {
    name:'Jasa / Manpower Harian', orient:'l', header:'manpower', head:'8EA9DB', headInk:'000000', totals:'box', sign:'mu',
    hint:'Jasa tenaga kerja per tanggal: install / takeout hoarding, frame, event (man power + jam kerja). Seperti PH Sinar Cahaya Merdeka & Bapak Wilton — ±46 PH.',
    lokLabel:'Lokasi', fields:['brand','tglk','person','action','jam','trans'],
    cols:[col('tglk','TANGGAL',22,11,'c'), col('brand','BRAND NAME',34,18,'c'), col('nama','KERJAAN',0,26), col('person','PERSON',34,18,'c'), col('action','ACTION',40,22,'c'),
          col('qty','QTY',12,6,'c'), col('jam','TIME/JAM',16,9,'c'), col('price','COST',25,14,'r',{money:1}), col('total','TOTAL PRICE ALL',28,17,'r',{money:1})]}
};
const TPL_ORDER = ['surat','surat_desain','foto','rollout','indicia','bq','manpower'];
const ROMAN = n => ['','I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'][n] || String(n);

/* ---- nilai per kolom untuk satu item ---- */
const dimsTxt = i => { const d = ['p','l','t'].map(k => num(i[k])).filter(v => v > 0); return d.length ? d.map(fq).join(' x ') + ' cm' : ''; };
const sizeOf = i => norm(i.uk) || dimsTxt(i);
const deskOf = i => String(i.desk ?? '').split('\n').map(norm).filter(Boolean).join('\n');   // deskripsi boleh beberapa baris
function itemVal(key, i, ctx){
  const T = ctx.T;
  switch (key) {
    case 'no': return ctx.no;
    case 'namaAct': return [norm(i.action), norm(i.nama)].filter(Boolean).join(' – ');
    case 'desc': return [deskOf(i), sizeOf(i)].filter(Boolean).join('\n');
    case 'desc2': return [norm(i.nama), deskOf(i)].filter(Boolean).join('\n');
    case 'uraian': return [norm(i.nama), [deskOf(i).replace(/\n/g, ' · '), sizeOf(i)].filter(Boolean).join(' · ')].filter(Boolean).join('\n');
    case 'material': return [deskOf(i), (num(i.p) > 0 ? '' : norm(i.uk))].filter(Boolean).join('\n');
    case 'size': return sizeOf(i);
    case 'p': case 'l': return num(i[key]) > 0 ? fq(i[key]) : '';
    case 'm2': return m2Of(i) ? fq(m2Of(i)) : '';
    case 'qty': return fq(qtyOf(i));
    case 'price': return {money:i.price};
    case 'trans': return num(i.trans) ? {money:num(i.trans)} : '';
    case 'total': return {money: ctx.transCol ? i.total : i.total - num(i.trans)};
    case 'img': return i.photo ? {img:i.photo, pw:i.pw, ph:i.ph} : '';
    case 'pct': return '';
    case 'desk': return deskOf(i);
    default: return norm(i[key] ?? '');
  }
}
const C = (v, o = {}) => {             // satu sel: {v:teks} | {m:angka Rp} | {img} | {fin}
  if (v && typeof v === 'object' && v.money != null) return {m:v.money, ...o};
  if (v && typeof v === 'object') return {...v, ...o};
  return {v, ...o};
};

/* ---- susun model dokumen ---- */
function buildDoc(){
  const T = TPL[S.tpl] || TPL.surat; const t = totals();
  const cols = T.cols; const N = cols.length;
  const ci = k => cols.findIndex(c => c.key === k);
  const transCol = ci('trans') >= 0; const totIdx = ci('total');
  const textIdx = ['nama','namaAct','uraian','desc2','desc','material'].map(ci).find(i => i >= 0);
  const al = c => c.al;
  const itemRow = (i, no) => cols.map(c => {
    let v = itemVal(c.key, i, {T, no, transCol});
    return C(v, {al:al(c)});
  });
  const transRow = i => cols.map((c, k) => {
    if (k === textIdx) return C('Transport' + (norm(i.lok) ? ' – ' + norm(i.lok) : ''), {al:'l'});
    if (c.key === 'qty') return C('1', {al:'c'}); if (c.key === 'sat') return C('ls', {al:'c'});
    if (c.key === 'price' || c.key === 'total') return C({money:num(i.trans)}, {al:'r'});
    return C('');
  });
  const span = (label, value, o = {}) => {        // baris label melebar + nilai di kolom total
    const r = new Array(N).fill(null);
    const end = totIdx >= 0 ? totIdx : N - 1;
    r[0] = C(label, {span:end, b:true, al:o.al || 'r', fill:o.fill}); for (let k = 1; k < end; k++) r[k] = null;
    r[end] = C({money:value}, {al:'r', b:true, fill:o.fill});
    for (let k = end + 1; k < N; k++) r[k] = C(o.after?.[k - end - 1] ?? '', {b:true, al:'c', fill:o.fill});
    return r;
  };
  const rows = []; const tables = [];
  const groups = [];
  if (T.group) {
    const m = new Map();
    t.rows.forEach(i => { const g = norm(i.lok) || (T.group === 'section' ? 'Pekerjaan' : 'Store'); if (!m.has(g)) { m.set(g, []); groups.push(g); } m.get(g).push(i); });
    let no = 0;
    groups.forEach((g, gi) => {
      const its = m.get(g); const sum = its.reduce((a, i) => a + i.total, 0); const f = its[0];
      if (T.group === 'section') {
        const r = new Array(N).fill(null); r[0] = C(ROMAN(gi + 1), {b:true, al:'c', fill:'FFF2CC'});
        r[1] = C(g.toUpperCase(), {span:N - 1, b:true, fill:'FFF2CC'}); rows.push({k:'group', cells:r});
        its.forEach((i, j) => { rows.push({k:'item', cells:itemRow(i, j + 1), img:!!i.photo, it:i}); if (num(i.trans) && !transCol) rows.push({k:'trans', cells:transRow(i)}); });
        rows.push({k:'sub', cells:span('Subtotal ' + ROMAN(gi + 1), sum, {after:[t.sub ? pct(sum / t.sub) : '']})});
      } else {
        its.forEach((i, j) => {
          const cells = itemRow(i, ++no);
          if (j > 0) ['kode','lok','kota','prov'].forEach(k => { const x = ci(k); if (x >= 0) cells[x] = C('', {al:'c'}); });
          rows.push({k:'item', cells, img:!!i.photo, it:i});
        });
        if (groups.length > 1) rows.push({k:'sub', cells:span('Subtotal ' + g, sum, {fill:'F2F2F2'})});
        groups[gi] = {name:g, kode:norm(f.kode), kota:norm(f.kota), prov:norm(f.prov), sum};
      }
    });
  } else {
    let prev = null;
    t.rows.forEach((i, n) => {
      const cells = itemRow(i, n + 1);
      cols.forEach((c, k) => { if (c.merge) { const l = norm(i.lok); cells[k] = C(l && l !== prev ? l : '', {al:c.al}); if (l) prev = l; } });
      rows.push({k:'item', cells, img:!!i.photo, it:i});
      if (num(i.trans) && !transCol) rows.push({k:'trans', cells:transRow(i)});
    });
  }
  const lines = t.lines.map(([l, v]) => [l === 'TOTAL' && T.totalLabel ? T.totalLabel : l, v]);
  const multi = T.totals === 'summary' && groups.length > 1;
  if (multi) {
    const sc = T.sumCols; const srows = groups.map((g, k) => ({k:'item', cells:sc.map(c => C(c.key === 'no' ? k + 1 : c.key === 'lok' ? g.name : c.key === 'amount' ? {money:g.sum} : g[c.key] || '', {al:c.al}))}));
    lines.forEach(([l, v]) => { const r = new Array(sc.length).fill(null); r[0] = C(l, {span:sc.length - 1, b:true, al:'r', fill:'FFFF00'}); r[sc.length - 1] = C({money:v}, {b:true, al:'r', fill:'FFFF00'}); srows.push({k:'tot', cells:r}); });
    tables.push({title:'SUMMARY', cols:sc, rows:srows, head:T.head, headInk:T.headInk});
  }
  if (T.totals === 'inline' || (T.totals === 'summary' && !multi)) lines.forEach(([l, v]) => rows.push({k:'tot', cells:span(l, v, {fill:'FFFF00', after: T.group === 'section' ? [l === lines[0][0] ? '100%' : ''] : []})}));
  tables.push({title: multi ? 'DETAIL PER STORE' : '', cols, rows, head:T.head, headInk:T.headInk});
  const finNo = {fin:'text', v:norm(S.nomor)}, finTgl = {fin:'date', v:S.tgl, txt:tglIndo()};
  return {T, orient:T.orient, header:buildHeader(T, t, finNo, finTgl), tables, totalsBox: T.totals === 'box' ? lines : null,
          note: norm(S.catatan), sign:buildSign(T), t, totIdx};
}
function logoInfo(){
  if (S.logoMode === 'none') return null;
  if (S.logoMode === 'klien' && S.clientLogo) return {src:S.clientLogo, pw:S.clw || 3, ph:S.clh || 1};
  return {src:LOGO, pw:607, ph:266};
}
function buildHeader(T, t, finNo, finTgl){
  const lg = logoInfo(); const kv = (rows, o = {}) => ({t:'kv', rows, ...o});
  const tx = (v, o = {}) => ({t:'text', v, ...o});
  switch (T.header) {
    case 'letter': {
      const below = [{t:'gap', h:6}, tx('Kepada Yth'), tx(S.client, {b:true})];
      if (S.alamat1) below.push(tx(S.alamat1)); if (S.alamat2) below.push(tx(S.alamat2));
      below.push({t:'gap', h:4}, kv([['UP', S.up, 1]], {labelB:true}), {t:'gap', h:2}, kv([['Perihal', perihal(), 1]]), {t:'gap', h:3},
        tx('Dengan hormat,'), tx(kalimat(), {wrap:0.75}), {t:'gap', h:2},
        kv([['Nama Proyek', S.proj, 1], ['Periode', S.periode, 1], ['Lokasi', S.area, 1], ['Detail Pekerjaan', S.desk, 1]]));
      return {logo:lg && {...lg, pos:'right', w:48}, beside:[{t:'gap', h:4}, kv([['No', finNo, 1], ['Tanggal', finTgl, 1]])], below};
    }
    case 'box':
      return {logo:lg && {...lg, pos:'left', w:40}, beside:[kv([['Project Name / Store Name', S.proj], ['Area / City / Mall', S.area], ['No PH', finNo, 1], ['Quotation Date', finTgl], ['Project Period', S.periode]], {boxed:true, labelW:48})], below:[{t:'gap', h:3}]};
    case 'indicia':
      return {logo:lg && {...lg, pos:'left', w:34}, beside:[], below:[{t:'gap', h:2}, {t:'bar', v:'Quotation ' + (norm(S.proj) || perihal()), fill:'FFFF00', ink:'000000'}, {t:'gap', h:3},
        kv([['STORE NAME', S.area, 1], ['TOTAL VALUE', {money:t.gt}, 1, 'FFC000'], ['', ''], ['NO QUOTATION', finNo, 1, 'FFFF99'], ['DD/MM/YY', finTgl, 1, 'FFFF99']], {boxed:true, labelW:34, width:0.36, labelB:true}), {t:'gap', h:4}]};
    case 'rollout':
      return {logo:lg && {...lg, pos:'right', w:46}, beside:[{t:'bar', v:'QUOTATION', fill:'BFBFBF', ink:'000000', size:15}, {t:'gap', h:2}, tx(perihal(), {b:true}),
        kv([['Client', S.client, 1], ['No PH', finNo, 1], ['Tanggal', finTgl, 1], ['Periode', S.periode], ['Area', S.area], ['Detail Pekerjaan', S.desk]])], below:[{t:'gap', h:3}]};
    case 'bq':
      return {logo:lg && {...lg, pos:'right', w:46}, beside:[tx('RENCANA ANGGARAN BIAYA (RAB)', {b:true, size:13}), {t:'gap', h:2},
        kv([['Nama Proyek', S.proj, 1], ['Periode', S.periode, 1], ['Lokasi Pemasangan', S.area, 1], ['Detail Pekerjaan', S.desk, 1], ['Client', S.client, 1], ['No PH', finNo, 1], ['Tanggal', finTgl, 1]], {labelW:36})], below:[{t:'gap', h:3}]};
    case 'manpower':
      return {logo:lg && {...lg, pos:'right', w:44}, beside:[kv([['PROJECT NAME / STORE NAME', S.proj, 1], ['AREA / CITY / MALL', S.area, 1], ['PROJECT PERIOD', S.periode, 1], ['QUOTATION DATE', finTgl, 1], ['QUOTATION NO', finNo, 1]], {labelW:52, labelB:true})],
        below:[{t:'gap', h:2}, {t:'bar', v:'', fill:'000000', ink:'FFFFFF', h:3}, {t:'gap', h:2}]};
  }
}
function buildSign(T){
  if (T.sign === 'approved') {
    const boxes = [['APPROVED BY :', S.ttd, 'PT. MATA UTAMA INDONESIA'], ['APPROVED BY :', S.up, S.client]];
    if (norm(S.principal)) boxes.push(['APPROVED BY :', S.principalPic, S.principal]);
    return {kind:'approved', boxes};
  }
  return {kind:T.sign, ttd:S.ttd, jab:S.jab, client:S.client, up:S.up};
}

/* =====================================================================
   1) PRATINJAU HTML
   ===================================================================== */
const hx = c => '#' + c;
function cellHTML(c, tag = 'td'){
  if (!c) return '';
  const st = []; if (c.fill) st.push('background:' + hx(c.fill)); if (c.b) st.push('font-weight:700');
  st.push('text-align:' + ({l:'left', c:'center', r:'right'}[c.al] || 'left'));
  let inner;
  if (c.img) inner = `<img src="${c.img}" style="max-width:100%;max-height:74px;display:block;margin:auto" alt="">`;
  else if (c.m != null) inner = `<div class="rp"><span>Rp</span><span>${fmt(c.m)}</span></div>`;
  else if (c.fin) inner = c.fin === 'date' ? (c.txt || finPh()) : (c.v ? esc(c.v) : finPh());
  else inner = esc(c.v ?? '').replace(/\n/g, '<br>');
  return `<${tag}${c.span > 1 ? ` colspan="${c.span}"` : ''} style="${st.join(';')}">${inner}</${tag}>`;
}
const finPh = () => '<span style="color:#b08900;font-style:italic">(diisi Finance)</span>';
function valHTML(v){
  if (v && typeof v === 'object') { if (v.fin) return v.fin === 'date' ? (v.txt || finPh()) : (v.v ? esc(v.v) : finPh()); if (v.money != null) return 'Rp ' + fmt(v.money); }
  return esc(v ?? '');
}
function blockHTML(b){
  switch (b.t) {
    case 'gap': return `<div style="height:${b.h * 3.2}px"></div>`;
    case 'text': return `<div style="${b.b ? 'font-weight:700;' : ''}${b.size ? 'font-size:' + (b.size * 1.33) + 'px;' : ''}${b.wrap ? 'max-width:' + (b.wrap * 100) + '%;' : ''}">${esc(b.v)}</div>`;
    case 'bar': return `<div style="background:${hx(b.fill)};color:${hx(b.ink)};font-weight:700;text-align:center;padding:${b.h ? b.h : 4}px 6px;font-size:${(b.size || 11) * 1.25}px">${esc(b.v) || '&nbsp;'}</div>`;
    case 'kv': {
      const rows = b.rows.map(([k, v, bold, fill]) => b.boxed
        ? `<tr><td style="font-weight:700;${fill ? 'background:' + hx(fill) : ''}">${esc(k)}</td><td style="${bold ? 'font-weight:700;' : ''}${fill ? 'background:' + hx(fill) : ''}">${valHTML(v)}</td></tr>`
        : `<tr><td style="padding:1px 0;width:${(b.labelW || 30) * 3.4}px;${b.labelB ? 'font-weight:700' : ''}">${esc(k)}</td><td style="padding:1px 0;${bold ? 'font-weight:700' : ''}">: ${valHTML(v)}</td></tr>`).join('');
      return `<table class="${b.boxed ? 'bx' : ''}" style="${b.width ? 'width:' + (b.width * 100) + '%' : b.boxed ? 'width:100%' : ''};font-size:11px">${rows}</table>`;
    }
  }
  return '';
}
function docHTML(d){
  const h = d.header; const lg = h.logo;
  const img = lg ? `<img src="${lg.src}" style="width:${lg.w * 3.78}px;flex:none" alt="">` : '';
  const beside = `<div style="flex:1;min-width:0">${h.beside.map(blockHTML).join('')}</div>`;
  let html = `<div style="display:flex;gap:14px;align-items:flex-start;justify-content:space-between">${lg && lg.pos === 'left' ? img + beside : beside + img}</div>`;
  html += h.below.map(blockHTML).join('');
  d.tables.forEach(tb => {
    if (tb.title) html += `<div style="font-weight:700;margin:10px 0 4px">${tb.title}</div>`;
    html += `<table class="tbl" style="width:100%;font-size:10.5px;margin-top:4px"><tr class="bx">${tb.cols.map(c => `<th style="background:${hx(tb.head)};color:${hx(tb.headInk)};${c.w ? 'width:' + (c.w * 3.4) + 'px' : ''}">${esc(c.label)}</th>`).join('')}</tr>`
      + (tb.rows.length ? tb.rows.map(r => `<tr class="bx">${r.cells.map(c => cellHTML(c)).join('')}</tr>`).join('') : `<tr class="bx"><td colspan="${tb.cols.length}" style="text-align:center;color:#888">Belum ada item</td></tr>`)
      + '</table>';
  });
  if (d.totalsBox) html += `<table style="margin:10px 0 0 auto;font-size:11px;min-width:240px">${d.totalsBox.map(([l, v]) => `<tr class="bx"><td class="yl">${esc(l)}</td><td class="yl num" style="width:125px"><div class="rp"><span>Rp</span><span>${fmt(v)}</span></div></td></tr>`).join('')}</table>`;
  if (d.note) html += `<p style="margin:12px 0 0;font-size:11px"><b>Catatan:</b> ${esc(d.note)}</p>`;
  const s = d.sign;
  if (s.kind === 'approved') html += `<table class="bx" style="width:100%;margin-top:26px;font-size:11px;table-layout:fixed"><tr>${s.boxes.map(b => `<td style="font-weight:700">${esc(b[0])}</td>`).join('')}</tr><tr>${s.boxes.map(() => '<td style="height:70px"></td>').join('')}</tr><tr>${s.boxes.map(b => `<td style="font-weight:700">${esc(b[1] || '')}</td>`).join('')}</tr><tr>${s.boxes.map(b => `<td style="font-weight:700">${esc(b[2] || '')}</td>`).join('')}</tr></table>`;
  else html += `<div style="display:flex;justify-content:space-between;margin-top:30px;font-weight:700"><div>Hormat Kami,<br>PT. MATA UTAMA INDONESIA<div style="height:62px"></div>${esc(s.ttd)}<br><span style="font-weight:400">${esc(s.jab)}</span></div>${s.kind === 'mu+client' ? `<div style="min-width:230px">Client Approval<br>${esc(s.client)}<div style="height:62px"></div>${esc(s.up)}</div>` : ''}</div>`;
  return html;
}

/* =====================================================================
   2) PDF
   ===================================================================== */
const rgb = h => [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
const imgFmt = src => /^data:image\/png/i.test(src) ? 'PNG' : 'JPEG';
function docPDF(d){
  const { jsPDF } = window.jspdf; const land = d.orient === 'l';
  const doc = new jsPDF({unit:'mm', format:'a4', orientation: land ? 'landscape' : 'portrait'});
  const W = land ? 297 : 210, H = land ? 210 : 297, M = 12; const black = [0,0,0];
  const base = {theme:'grid', styles:{font:'helvetica', fontSize:land ? 7.5 : 8, textColor:black, lineColor:black, lineWidth:0.2, cellPadding:1.3, valign:'middle', overflow:'linebreak'}};
  const vtxt = v => (v && typeof v === 'object') ? (v.fin ? (v.fin === 'date' ? (v.txt || '(diisi Finance)') : (v.v || '(diisi Finance)')) : v.money != null ? 'Rp ' + fmt(v.money) : '') : String(v ?? '');
  const blocks = (list, x, w, y) => {
    list.forEach(b => {
      if (b.t === 'gap') { y += b.h; return; }
      if (b.t === 'text') { doc.setFont('helvetica', b.b ? 'bold' : 'normal'); doc.setFontSize(b.size || 9); const ln = doc.splitTextToSize(b.v || '', w * (b.wrap || 1)); doc.text(ln, x, y + 3); y += ln.length * (b.size || 9) * 0.42 + 1; return; }
      if (b.t === 'bar') { const hh = b.h || ((b.size || 10) * 0.55 + 2); doc.setFillColor(...rgb(b.fill)); doc.rect(x, y, w, hh, 'F'); if (b.v) { doc.setTextColor(...rgb(b.ink)); doc.setFont('helvetica','bold'); doc.setFontSize(b.size || 10); doc.text(b.v, x + w/2, y + hh/2, {align:'center', baseline:'middle'}); doc.setTextColor(0); } y += hh + 1; return; }
      if (b.t === 'kv') {
        if (b.boxed) {
          const bw = w * (b.width || 1);
          doc.autoTable({...base, startY:y, margin:{left:x, right:W - x - bw}, body:b.rows.map(([k, v, bold, fill]) => [{content:k, styles:{fontStyle:'bold', fillColor: fill ? rgb(fill) : false}}, {content:vtxt(v), styles:{fontStyle: bold ? 'bold' : 'normal', fillColor: fill ? rgb(fill) : false}}]),
            columnStyles:{0:{cellWidth:b.labelW || 40}}});
          y = doc.lastAutoTable.finalY + 1;
        } else {
          doc.setFontSize(8.5);
          b.rows.forEach(([k, v, bold]) => { doc.setFont('helvetica', b.labelB ? 'bold' : 'normal'); doc.text(k, x, y + 3); doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.text(': ' + vtxt(v), x + (b.labelW || 30), y + 3); y += 4.4; });
        }
      }
    });
    return y;
  };
  // header
  const h = d.header; let y = M; let lh = 0;
  if (h.logo) { const lw = h.logo.w; lh = lw * h.logo.ph / h.logo.pw; doc.addImage(h.logo.src, imgFmt(h.logo.src), h.logo.pos === 'left' ? M : W - M - lw, M, lw, lh); }
  const bx = h.logo && h.logo.pos === 'left' ? M + h.logo.w + 5 : M; const bw = W - 2 * M - (h.logo ? h.logo.w + 5 : 0);
  y = blocks(h.beside, bx, bw, M);
  y = Math.max(y, M + lh) + 1;
  y = blocks(h.below, M, W - 2 * M, y);
  // tabel
  d.tables.forEach(tb => {
    if (tb.title) { doc.setFont('helvetica','bold'); doc.setFontSize(10); doc.text(tb.title, M, y + 4); y += 6; }
    const body = tb.rows.map(r => r.cells.filter(c => c).map(c => {
      const content = c.img ? '' : c.m != null ? fmt(c.m) : c.fin ? vtxt(c) : String(c.v ?? '');
      return {content, colSpan:c.span || 1, _money:c.m != null, _img:c.img ? c : null,
        styles:{halign:({l:'left', c:'center', r:'right'}[c.al] || 'left'), fontStyle:c.b ? 'bold' : 'normal', fillColor:c.fill ? rgb(c.fill) : false, minCellHeight:c.img ? 22 : 0}};
    }));
    const cs = {}; const fixed = tb.cols.reduce((a, c) => a + (c.w || 0), 0); const avail = W - 2 * M;
    tb.cols.forEach((c, i) => { if (c.w) cs[i] = {cellWidth: fixed > avail ? c.w * avail / fixed : c.w}; });
    doc.autoTable({...base, startY:y, margin:{left:M, right:M}, head:[tb.cols.map(c => c.label.replace('²', '2'))], body, columnStyles:cs, rowPageBreak:'avoid',
      headStyles:{fillColor:rgb(tb.head), textColor:rgb(tb.headInk), fontStyle:'bold', halign:'center'},
      didDrawCell:x => {
        if (x.section !== 'body' || !x.cell.raw) return; const raw = x.cell.raw;
        if (raw._money && raw.content) { doc.setFontSize(base.styles.fontSize); doc.setFont('helvetica', raw.styles.fontStyle); doc.text('Rp', x.cell.x + 1.2, x.cell.y + x.cell.height / 2, {baseline:'middle'}); }
        if (raw._img) { const im = raw._img; const r = Math.min((x.cell.width - 2) / (im.pw || 1), (x.cell.height - 2) / (im.ph || 1)); const iw = (im.pw || 1) * r, ih = (im.ph || 1) * r;
          try { doc.addImage(im.img, imgFmt(im.img), x.cell.x + (x.cell.width - iw) / 2, x.cell.y + (x.cell.height - ih) / 2, iw, ih); } catch(e) {} }
      }});
    y = doc.lastAutoTable.finalY + 4;
  });
  if (d.totalsBox) {
    doc.autoTable({...base, startY:y, margin:{left:W - M - 74, right:M}, body:d.totalsBox.map(([l, v]) => [l, fmt(v)]), styles:{...base.styles, fillColor:[255,255,0], fontStyle:'bold'},
      columnStyles:{0:{cellWidth:40}, 1:{halign:'right'}}, didDrawCell:x => { if (x.column.index === 1) { doc.setFont('helvetica','bold'); doc.text('Rp', x.cell.x + 1.2, x.cell.y + x.cell.height / 2, {baseline:'middle'}); } }});
    y = doc.lastAutoTable.finalY + 6;
  }
  if (d.note) { doc.setFontSize(8.5); doc.setFont('helvetica','bold'); doc.text('Catatan:', M, y + 3); doc.setFont('helvetica','normal'); const c = doc.splitTextToSize(d.note, W - 2 * M - 16); doc.text(c, M + 15, y + 3); y += c.length * 4 + 4; }
  const s = d.sign;
  if (y > H - 48) { doc.addPage(); y = 20; }
  if (s.kind === 'approved') {
    doc.autoTable({...base, startY:y + 4, margin:{left:M, right:M}, styles:{...base.styles, fontStyle:'bold', fontSize:8.5},
      body:[s.boxes.map(b => b[0]), s.boxes.map(() => ({content:'', styles:{minCellHeight:24}})), s.boxes.map(b => b[1] || ''), s.boxes.map(b => b[2] || '')]});
  } else {
    doc.setFontSize(9); doc.setFont('helvetica','bold');
    doc.text('Hormat Kami,', M, y + 4); doc.text('PT. MATA UTAMA INDONESIA', M, y + 9); doc.text(s.ttd || '', M, y + 32);
    doc.setFont('helvetica','normal'); doc.text(s.jab || '', M, y + 37);
    if (s.kind === 'mu+client') { const x = W - M - 64; doc.setFont('helvetica','bold'); doc.text('Client Approval', x, y + 4); doc.text(doc.splitTextToSize(s.client || '', 64), x, y + 9); doc.text(s.up || '', x, y + 32); }
  }
  return doc.output('blob');
}

/* =====================================================================
   3) EXCEL
   ===================================================================== */
async function docXLSX(d){
  const land = d.orient === 'l'; const main = d.tables[d.tables.length - 1]; const N = main.cols.length;
  const wb = new ExcelJS.Workbook(); wb.creator = 'Generator PH Mata Utama';
  const ws = wb.addWorksheet('PH', {views:[{showGridLines:false}], pageSetup:{paperSize:9, orientation: land ? 'landscape' : 'portrait', fitToPage:true, fitToWidth:1, fitToHeight:0, horizontalCentered:true,
    margins:{left:0.35, right:0.35, top:0.45, bottom:0.45, header:0.3, footer:0.3}}});
  const thin = {style:'thin', color:{argb:'FF000000'}}; const BOX = {top:thin, left:thin, bottom:thin, right:thin};
  const ACC = '_("Rp"* #,##0_);_("Rp"* (#,##0);_("Rp"* "-"_);_(@_)';
  const F = (o = {}) => ({name:'Calibri', size:10, ...o});
  const fill = c => ({type:'pattern', pattern:'solid', fgColor:{argb:'FF' + c}});
  const AL = {l:'left', c:'center', r:'right'};
  main.cols.forEach((c, i) => ws.getColumn(i + 1).width = c.xw);
  const cell = (r, c) => ws.getCell(r, c);
  const put = (r, c, v, o = {}) => { const x = cell(r, c); x.value = v; x.font = F(o.font || {}); if (o.fmt) x.numFmt = o.fmt; if (o.fill) x.fill = fill(o.fill); x.alignment = {vertical:'middle', wrapText: !!o.wrap, horizontal:o.al ? AL[o.al] : undefined}; if (o.border) x.border = BOX; return x; };
  const finCell = (x, v, kind) => {
    ws.addConditionalFormatting({ref:x.address, rules:[{type:'expression', priority:1, formulae:[`LEN(${x.address})=0`], style:{fill:{type:'pattern', pattern:'solid', bgColor:{argb:'FFFFE699'}}}}]});
    x.note = kind === 'date' ? 'Diisi Finance: tanggal PH' : 'Diisi Finance: nomor PH';
    if (kind === 'date') { x.numFmt = '[$-421]d mmmm yyyy'; if (v && /^\d{4}-\d{2}-\d{2}$/.test(v)) { const [a, b, c] = v.split('-').map(Number); x.value = new Date(Date.UTC(a, b - 1, c)); } }
    else if (v) x.value = v;
  };
  const setVal = (x, v) => {
    if (v && typeof v === 'object') { if (v.fin) return finCell(x, v.v, v.fin); if (v.money != null) { x.value = v.money; x.numFmt = ACC; return; } }
    x.value = v ?? '';
  };
  const colPx = i => (main.cols[i]?.xw || 8) * 7;
  let r = 1;
  const blocks = (list, c0) => {
    list.forEach(b => {
      if (b.t === 'gap') { if (b.h >= 3) r++; return; }
      if (b.t === 'text') { const x = put(r, c0, b.v || '', {font:{bold:!!b.b, size:b.size ? b.size + 1 : 10}}); if (b.wrap) { ws.mergeCells(r, c0, r, Math.max(c0, Math.round(N * b.wrap))); x.alignment = {wrapText:true, vertical:'top'}; ws.getRow(r).height = 28; } r++; return; }
      if (b.t === 'bar') { ws.mergeCells(r, c0, r, N); put(r, c0, b.v || '', {font:{bold:true, size:b.size ? b.size + 2 : 11, color:{argb:'FF' + b.ink}}, fill:b.fill, al:'c'}); ws.getRow(r).height = b.h ? 8 : (b.size ? 24 : 18); r++; return; }
      if (b.t === 'kv') {
        b.rows.forEach(([k, v, bold, fl]) => {
          if (b.boxed) {
            const span = Math.max(2, Math.round((N - c0 + 1) * (b.width || 0.9)));
            const lc = Math.max(1, Math.floor(span / 2)); const vc0 = c0 + lc, vc1 = c0 + span - 1;
            if (lc > 1) ws.mergeCells(r, c0, r, c0 + lc - 1); if (vc1 > vc0) ws.mergeCells(r, vc0, r, vc1);
            for (let c = c0; c <= vc1; c++) { cell(r, c).border = BOX; if (fl) cell(r, c).fill = fill(fl); }
            put(r, c0, k, {font:{bold:true}, fill:fl, border:true}); const x = cell(r, vc0); x.font = F({bold:!!bold}); x.alignment = {horizontal:'left', vertical:'middle'}; setVal(x, v);
          } else {
            put(r, c0, k, {font:{bold:!!b.labelB}}); const vc = c0 + (b.labelW >= 45 ? 3 : 2); const x = cell(r, Math.min(vc, N)); x.font = F({bold:!!bold}); x.alignment = {horizontal:'left'};
            setVal(x, v); if (!(v && typeof v === 'object' && v.money != null)) x.numFmt = x.numFmt && x.numFmt.includes('mmmm') ? '[$-421]": "d mmmm yyyy' : '": "@';
          }
          r++;
        });
      }
    });
  };
  // header + logo
  const h = d.header; let c0 = 1; let logoRows = 0;
  if (h.logo) {
    const wpx = h.logo.w * 4, hpx = wpx * h.logo.ph / h.logo.pw; logoRows = Math.ceil(hpx / 20) + 1;
    let col = 0; if (h.logo.pos === 'right') { let acc = 0; col = N; while (col > 0 && acc < wpx) { col--; acc += colPx(col); } }
    else { let acc = 0; while (acc < wpx + 10 && c0 <= N) { acc += colPx(c0 - 1); c0++; } }
    ws.addImage(wb.addImage({base64:h.logo.src, extension: imgFmt(h.logo.src) === 'PNG' ? 'png' : 'jpeg'}), {tl:{col: h.logo.pos === 'right' ? col + 0.1 : 0.1, row:0.2}, ext:{width:wpx, height:hpx}});
  }
  blocks(h.beside, h.logo && h.logo.pos === 'left' ? c0 : 1);
  r = Math.max(r, logoRows + 1);
  blocks(h.below, 1);
  // tabel
  const itemCells = []; const totC = d.totIdx + 1;
  d.tables.forEach((tb, ti) => {
    const isMain = tb === main; r++;
    if (tb.title) { put(r, 1, tb.title, {font:{bold:true, size:11}}); r++; }
    // kolom tabel summary diregangkan ke N kolom memakai xw sebagai bobot
    const spans = isMain ? tb.cols.map(() => 1) : tb.cols.map(c => c.xw);
    const starts = []; let acc = 1; spans.forEach(s => { starts.push(acc); acc += s; });
    const headR = r;
    tb.cols.forEach((c, i) => { const s = starts[i], e = s + spans[i] - 1; if (e > s) ws.mergeCells(r, s, r, e); for (let k = s; k <= e; k++) cell(r, k).border = BOX;
      put(r, s, c.label, {font:{bold:true, color:{argb:'FF' + tb.headInk}}, fill:tb.head, al:'c', border:true, wrap:true}); for (let k = s; k <= e; k++) cell(r, k).fill = fill(tb.head); });
    ws.getRow(r).height = 28;
    tb.rows.forEach(row => {
      r++; let ci = 0;
      row.cells.forEach((c, i) => {
        if (!c) return;
        const s = starts[i], e = starts[Math.min(i + (c.span || 1), tb.cols.length) - 1] + spans[Math.min(i + (c.span || 1), tb.cols.length) - 1] - 1;
        if (e > s) ws.mergeCells(r, s, r, e);
        for (let k = s; k <= e; k++) { cell(r, k).border = BOX; if (c.fill) cell(r, k).fill = fill(c.fill); }
        const x = cell(r, s); x.font = F({bold:!!c.b}); x.alignment = {horizontal:AL[c.al] || 'left', vertical:'middle', wrapText:true};
        if (c.img) { const id = wb.addImage({base64:c.img, extension: imgFmt(c.img) === 'PNG' ? 'png' : 'jpeg'}); const hh = 70, ww = Math.min(colPx(s - 1) - 6, hh * (c.pw || 1) / (c.ph || 1));
          ws.addImage(id, {tl:{col:s - 1 + 0.06, row:r - 1 + 0.06}, ext:{width:ww, height:hh * Math.min(1, ww / (hh * (c.pw || 1) / (c.ph || 1)))}}); }
        else if (c.m != null) { x.value = c.m; x.numFmt = ACC; }
        else if (c.fin) finCell(x, c.v, c.fin);
        else { const v = c.v ?? ''; x.value = (typeof v === 'string' && /^-?[\d.]+(,\d+)?$/.test(v) && main.cols[i]?.key === 'qty') ? num(v) : v; }
      });
      const lines = Math.max(1, ...row.cells.map((c, i) => {           // perkiraan jumlah baris teks (termasuk teks panjang yang membungkus)
        if (!c || typeof c.v !== 'string' || !c.v) return 1;
        let w = 0; for (let k = i; k < Math.min(i + (c.span || 1), tb.cols.length); k++) w += (isMain ? main.cols[k].xw : tb.cols[k].xw * (main.cols.reduce((a, x) => a + x.xw, 0) / tb.cols.reduce((a, x) => a + x.xw, 0)));
        return c.v.split('\n').reduce((a, ln) => a + Math.max(1, Math.ceil(ln.length / Math.max(4, w * 1.05))), 0);
      }));
      ws.getRow(r).height = row.img ? 58 : Math.max(17, lines * 14);
      if (isMain && (row.k === 'item' || row.k === 'trans') && totC > 0) itemCells.push(cell(r, totC).address);
    });
  });
  // total
  const tl = d.totalsBox; const t = d.t;
  if (tl) {
    r++; const lc = totC - 1, vc = totC; let first = null, base = null, disc = null, ppnR = null;
    tl.forEach(([l, v]) => {
      r++; put(r, lc, l, {font:{bold:true}, fill:'FFFF00', border:true}); const x = put(r, vc, null, {font:{bold:true}, fill:'FFFF00', border:true, fmt:ACC});
      const ad = c => cell(c, vc).address;
      if (first == null) { first = r; x.value = itemCells.length && itemCells.length < 250 ? {formula:`SUM(${itemCells.join(',')})`, result:v} : v; base = r; }
      else if (l === 'DISKON') { x.value = v; disc = r; }
      else if (l.startsWith('TOTAL SETELAH') || l.startsWith('SETELAH')) { x.value = {formula:`${ad(first)}-${ad(disc)}`, result:v}; base = r; }
      else if (l.startsWith('PPN')) { x.value = {formula:`ROUND(${ad(base)}*${t.rate / 100},0)`, result:v}; ppnR = r; }
      else if (l === 'GRAND TOTAL') x.value = {formula: ppnR ? `${ad(base)}+${ad(ppnR)}` : ad(base), result:v};
      else x.value = v;
    });
  }
  if (d.note) { r += 2; put(r, 1, 'Catatan: ' + d.note, {font:{italic:true}}); }
  r += 3; const s = d.sign;
  if (s.kind === 'approved') {
    const k = s.boxes.length; const per = Math.floor(N / k);
    [0, 1, 2, 3].forEach(j => { s.boxes.forEach((b, bi) => { const a = bi * per + 1, e = bi === k - 1 ? N : a + per - 1; ws.mergeCells(r + j, a, r + j, e);
      for (let q = a; q <= e; q++) cell(r + j, q).border = BOX; put(r + j, a, j === 1 ? '' : b[j === 0 ? 0 : j - 1], {font:{bold:true}, border:true}); }); ws.getRow(r + j).height = j === 1 ? 70 : 18; });
    r += 4;
  } else {
    put(r, 1, 'Hormat Kami,', {font:{bold:true}}); put(r + 1, 1, 'PT. MATA UTAMA INDONESIA', {font:{bold:true}}); put(r + 6, 1, s.ttd || '', {font:{bold:true}}); put(r + 7, 1, s.jab || '');
    if (s.kind === 'mu+client') { const c = Math.max(1, N - 2); put(r, c, 'Client Approval', {font:{bold:true}}); put(r + 1, c, s.client || '', {font:{bold:true}}); put(r + 6, c, s.up || '', {font:{bold:true}}); }
    r += 8;
  }
  ws.pageSetup.printArea = `A1:${ws.getColumn(N).letter}${r}`;
  return wb;
}
