/* =====================================================================
   Generator PH Mata Utama — app.js
   Alur harga per item:  Harga Manual  >  Modal/HPP x (1 + margin)  >  Harga Acuan rate card
   Database rate card bisa diganti/diperbarui dengan upload file .xlsx / .csv
   ===================================================================== */
const D = JSON.parse(document.getElementById('data').textContent);
const LOGO = document.getElementById('logo').src;
const $ = id => document.getElementById(id);
const BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const COLS = ['kat','sub','nama','uk','sat','mn','md','mx','modal','nph','last','tgl','klien','noph'];
const HDR  = ['Kategori','Sub Kategori','Nama Item','Ukuran','Satuan','Harga Min','Harga Acuan','Harga Maks','Modal/HPP','Jumlah PH','Harga Terakhir','Tgl Terakhir','Klien Terakhir','No PH Terakhir'];
const NUMCOLS = new Set(['mn','md','mx','modal','nph','last']);
const DB_KEY = 'mu-ratecard-v1', DRAFT_KEY = 'mu-ph-draft-v1';

const fmt = n => (Math.round(n)||0).toLocaleString('id-ID');
const num = v => { if (typeof v === 'number') return isFinite(v) ? v : 0; const n = parseFloat(String(v??'').replace(/[^\d,.-]/g,'').replace(/\./g,'').replace(',','.')); return isFinite(n) ? n : 0; };
const esc = s => String(s??'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const norm = s => String(s??'').trim().replace(/\s+/g,' ');
const keyOf = r => [r.kat, r.sub, r.nama, r.uk, r.sat].map(x => norm(x).toLowerCase()).join('|');
const fq = v => (num(v)||0).toLocaleString('id-ID', {maximumFractionDigits:2});
const pct = v => (v*100).toLocaleString('id-ID', {maximumFractionDigits:1}) + '%';
const status = (msg, cls, el='status') => { const s=$(el); s.textContent=msg; s.className='status '+(cls||''); };

/* ---------------------------------------------------------------------
   1. DATABASE RATE CARD
   --------------------------------------------------------------------- */
let RC;                         // {rows:[obj], source, updated, asof}
let IDX = {};                   // indeks untuk dropdown
let UPMODE = 'merge';

const fromArr = a => { const o = {}; COLS.forEach((c,i) => o[c] = NUMCOLS.has(c) ? (Number(a[i])||0) : norm(a[i])); o.id = keyOf(o); return o; };
const toArr = o => COLS.map(c => o[c] ?? (NUMCOLS.has(c) ? 0 : ''));

function loadDB(){
  try {
    const s = JSON.parse(localStorage.getItem(DB_KEY) || 'null');
    if (s && Array.isArray(s.rows) && s.rows.length) return {rows:s.rows.map(fromArr), source:s.source, updated:s.updated, asof:s.asof, custom:true};
  } catch(e) {}
  return {rows:D.db.rows.map(fromArr), source:D.db.source, updated:'', asof:D.db.asof, custom:false};
}
function saveDB(){
  try { localStorage.setItem(DB_KEY, JSON.stringify({rows:RC.rows.map(toArr), source:RC.source, updated:RC.updated, asof:RC.asof})); return true; }
  catch(e) { return false; }
}
function buildIndex(){
  const std = D.cats; const set = new Set(RC.rows.map(r => r.kat));
  const cats = std.filter(c => set.has(c)).concat([...set].filter(c => !std.includes(c)).sort((a,b)=>a.localeCompare(b)));
  const subs = new Map(), items = new Map(), byId = new Map(), label = new Map();
  RC.rows.forEach(r => {
    if (!r.sub) r.sub = 'Lainnya';
    byId.set(r.id, r);
    if (!subs.has(r.kat)) subs.set(r.kat, new Set()); subs.get(r.kat).add(r.sub);
    const k = r.kat+'|'+r.sub; if (!items.has(k)) items.set(k, []); items.get(k).push(r);
  });
  subs.forEach((v,k) => subs.set(k, [...v].sort((a,b)=>a.localeCompare(b))));
  items.forEach(v => v.sort((a,b) => (b.nph-a.nph) || a.nama.localeCompare(b.nama)));
  const dl = $('dl-rc'); dl.innerHTML = ''; const fr = document.createDocumentFragment();
  RC.rows.forEach(r => { const l = rcLabel(r) + ' — ' + r.sub + ' (' + r.kat + ')'; if (!label.has(l)) { label.set(l, r.id); const o=document.createElement('option'); o.value=l; fr.appendChild(o); } });
  dl.appendChild(fr);
  IDX = {cats, subs, items, byId, label};
  fillList('dl-kat', cats);
  renderDBInfo();
}
const rcLabel = r => r.nama + (r.uk ? ' | '+r.uk : '') + (r.sat ? ' | '+r.sat : '');
function renderDBInfo(){
  const n = RC.rows.length, withModal = RC.rows.filter(r => r.modal>0).length;
  $('dbinfo').innerHTML = `<b>${n.toLocaleString('id-ID')}</b> item · <b>${IDX.cats.length}</b> kategori · <b>${[...IDX.subs.values()].reduce((a,s)=>a+s.length,0)}</b> sub kategori`
    + (withModal ? ` · <b>${withModal.toLocaleString('id-ID')}</b> item punya Modal/HPP` : ` · <span class="hint">belum ada Modal/HPP (harga = acuan historis)</span>`)
    + `<br><span class="hint">${esc(RC.source||'')}${RC.asof ? ' · data s/d '+esc(tglIndo(RC.asof)) : ''}${RC.updated ? ' · diupload '+esc(RC.updated) : ''}</span>`;
  $('db-src').textContent = RC.custom ? 'Database upload' : 'Database bawaan';
  $('asof').textContent = `Akun Tower Media Group & klien lain · rate card ${n.toLocaleString('id-ID')} item jadi acuan harga. Draf & database tersimpan di browser ini.`;
}

/* ---- baca file upload ---- */
const HALIAS = {
  kat:['kategori','category','kategoriitem'], sub:['subkategori','sub','subcategory'],
  nama:['namaitem','item','namabarang','nama','itemname','namaitempilihandibuatph'],
  uk:['ukuran','ukuranspek','size','dimensi','spek','spesifikasi'], sat:['satuan','unit','uom'],
  mn:['hargamin','min','minimum','hargaminimum'], md:['hargaacuan','acuan','median','hargajual','harga','price','hargasatuan'],
  mx:['hargamaks','maks','max','hargamax','maksimum','hargamaksimum'], modal:['modalhpp','modal','hpp','cost','hargamodal','hargapokok'],
  nph:['jumlahph','nph','frekuensi'], last:['hargaterakhir'], tgl:['tglterakhir','tanggalterakhir','tanggal','tgl'],
  klien:['klienterakhir','klien','client'], noph:['nophterakhir','noph']
};
const hnorm = h => String(h??'').toLowerCase().replace(/\(.*?\)/g,'').replace(/[^a-z0-9]/g,'');
function mapHeader(cells){
  const m = {}; const used = new Set();
  Object.entries(HALIAS).forEach(([k, al]) => {
    for (const a of al) { const i = cells.findIndex((c,j) => !used.has(j) && hnorm(c) === a); if (i >= 0) { m[k] = i; used.add(i); break; } }
  });
  return (m.kat != null && m.nama != null) ? m : null;
}
function upNum(v){
  if (typeof v === 'number') return v;
  let s = String(v??'').replace(/rp/gi,'').replace(/\s/g,''); if (!s || s==='-') return 0;
  if (/^-?\d{1,3}(\.\d{3})+(,\d+)?$/.test(s)) s = s.replace(/\./g,'').replace(',','.');
  else if (/^-?\d{1,3}(,\d{3})+(\.\d+)?$/.test(s)) s = s.replace(/,/g,'');
  else s = s.replace(',','.');
  const n = parseFloat(s); return isFinite(n) ? n : 0;
}
function cellVal(v){
  if (v == null) return '';
  if (v instanceof Date) return v.toISOString().slice(0,10);
  if (typeof v === 'object') {
    if ('result' in v) return cellVal(v.result);
    if (v.richText) return v.richText.map(t => t.text).join('');
    if ('text' in v) return v.text;
    if (v.error) return '';
    return '';
  }
  return v;
}
function parseCSV(text){
  text = text.replace(/^﻿/, '');
  const first = text.split(/\r?\n/)[0] || '';
  const dlm = (first.match(/;/g)||[]).length > (first.match(/,/g)||[]).length ? ';' : (first.includes('\t') ? '\t' : ',');
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i+1] === '"') { cur += '"'; i++; } else q = false; } else cur += ch; }
    else if (ch === '"') q = true;
    else if (ch === dlm) { row.push(cur); cur = ''; }
    else if (ch === '\n' || ch === '\r') { if (ch === '\r' && text[i+1] === '\n') i++; row.push(cur); rows.push(row); row = []; cur = ''; }
    else cur += ch;
  }
  if (cur !== '' || row.length) { row.push(cur); rows.push(row); }
  return rows;
}
async function readTable(file){
  const name = file.name.toLowerCase();
  if (name.endsWith('.xlsx')) {
    if (!window.ExcelJS) throw new Error('Pembaca Excel belum termuat.');
    const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await file.arrayBuffer());
    for (const ws of wb.worksheets) {
      const grid = [];
      ws.eachRow({includeEmpty:true}, (row, rn) => { const a = []; row.eachCell({includeEmpty:true}, (c, cn) => { a[cn-1] = cellVal(c.value); }); grid[rn-1] = a; });
      for (let i = 0; i < Math.min(15, grid.length); i++) {
        const m = grid[i] && mapHeader(grid[i]); if (m) return {sheet:ws.name, map:m, rows:grid.slice(i+1).filter(Boolean)};
      }
    }
    throw new Error('Tidak ketemu sheet dengan kolom "Kategori" dan "Nama Item".');
  }
  if (name.endsWith('.xls')) throw new Error('Format .xls lama belum didukung. Simpan ulang sebagai .xlsx atau .csv.');
  const grid = parseCSV(await file.text());
  for (let i = 0; i < Math.min(15, grid.length); i++) { const m = mapHeader(grid[i]); if (m) return {sheet:'CSV', map:m, rows:grid.slice(i+1)}; }
  throw new Error('Baris judul kolom tidak dikenali. Pastikan ada kolom "Kategori" dan "Nama Item".');
}
function tableToRows(t){
  const out = [], skipped = []; const present = new Set(Object.keys(t.map));
  t.rows.forEach((a, i) => {
    const g = k => t.map[k] == null ? '' : a[t.map[k]];
    if (!a || a.every(v => v === '' || v == null)) return;
    const r = {kat:norm(g('kat')), sub:norm(g('sub')) || 'Lainnya', nama:norm(g('nama')), uk:norm(g('uk')), sat:norm(g('sat')),
      mn:upNum(g('mn')), md:upNum(g('md')), mx:upNum(g('mx')), modal:upNum(g('modal')), nph:Math.round(upNum(g('nph'))), last:upNum(g('last')),
      tgl:normDate(g('tgl')), klien:norm(g('klien')), noph:norm(g('noph'))};
    if (r.uk === '-') r.uk = ''; if (r.sat === '-') r.sat = '';
    if (!r.kat || !r.nama) { skipped.push(i); return; }
    if (!r.md) r.md = r.mn && r.mx ? Math.round((r.mn + r.mx)/2) : (r.mn || r.mx || r.last);
    if (!r.md && !r.modal) { skipped.push(i); return; }
    if (!r.mn) r.mn = r.md; if (!r.mx) r.mx = Math.max(r.md, r.mn);
    r.id = keyOf(r); out.push(r);
  });
  return {rows:out, skipped, present};
}
function normDate(v){
  if (!v) return '';
  if (typeof v === 'number' && v > 20000 && v < 80000) return new Date(Math.round((v - 25569) * 864e5)).toISOString().slice(0,10);
  const s = String(v).trim(); let m;
  if ((m = s.match(/^(\d{4})-(\d{2})-(\d{2})/))) return m[0];
  if ((m = s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/))) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
  return s;
}
function ask(html){
  return new Promise(res => {
    const d = $('dlg'); $('dlg-body').innerHTML = html;
    const done = v => { d.close(); $('dlg-yes').onclick = $('dlg-no').onclick = null; res(v); };
    $('dlg-yes').onclick = () => done(true); $('dlg-no').onclick = () => done(false);
    d.oncancel = () => done(false);
    if (d.showModal) d.showModal(); else res(true);
  });
}
async function handleUpload(file){
  if (!file) return;
  status('Membaca '+file.name+' …', '', 'db-status');
  try {
    const t = await readTable(file); const r = tableToRows(t);
    if (!r.rows.length) throw new Error('Tidak ada baris valid. Cek kolom Kategori, Nama Item dan Harga Acuan / Modal.');
    const seen = new Map(); r.rows.forEach(x => seen.set(x.id, x)); const up = [...seen.values()];
    const dup = r.rows.length - up.length;
    let nNew = 0, nUpd = 0; up.forEach(x => IDX.byId.has(x.id) ? nUpd++ : nNew++);
    const modeTxt = UPMODE === 'replace'
      ? `<b>Ganti semua</b>: database sekarang (${RC.rows.length.toLocaleString('id-ID')} item) diganti <b>${up.length.toLocaleString('id-ID')}</b> item dari file ini.`
      : `<b>Update</b>: <b>${nUpd.toLocaleString('id-ID')}</b> item diperbarui, <b>${nNew.toLocaleString('id-ID')}</b> item baru ditambahkan. Item lain tetap.`;
    const missing = ['md','modal','mn','mx'].filter(k => !r.present.has(k)).map(k => ({md:'Harga Acuan',modal:'Modal/HPP',mn:'Harga Min',mx:'Harga Maks'}[k]));
    const ok = await ask(`<h3 style="margin:0 0 8px;font-size:16px">Upload database rate card</h3>
      <p style="margin:0 0 8px">File <b>${esc(file.name)}</b> (sheet ${esc(t.sheet)}) terbaca <b>${up.length.toLocaleString('id-ID')}</b> item.</p>
      <p style="margin:0 0 8px">${modeTxt}</p>
      ${r.skipped.length ? `<p class="hint" style="margin:0 0 6px">${r.skipped.length} baris dilewati (Kategori / Nama Item / harga kosong).</p>` : ''}
      ${dup ? `<p class="hint" style="margin:0 0 6px">${dup} baris dobel (kunci sama) — dipakai yang terakhir.</p>` : ''}
      ${missing.length ? `<p class="hint" style="margin:0">Kolom tidak ada di file: ${missing.join(', ')}.</p>` : ''}`);
    if (!ok) { status('Upload dibatalkan. Database tidak berubah.', '', 'db-status'); return; }
    let rows;
    if (UPMODE === 'replace') rows = up;
    else {
      const m = new Map(RC.rows.map(x => [x.id, x]));
      up.forEach(x => { const old = m.get(x.id); if (old) { r.present.forEach(k => old[k] = x[k]); ['mn','md','mx'].forEach(k => old[k] = x[k]); } else m.set(x.id, x); });
      rows = [...m.values()];
    }
    const d = new Date();
    RC = {rows, source:'Upload: ' + file.name, updated: d.getDate()+' '+BULAN[d.getMonth()].slice(0,3)+' '+d.getFullYear()+' '+String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0'),
          asof: rows.reduce((a,x) => x.tgl > a ? x.tgl : a, ''), custom:true};
    buildIndex(); renderItems(); update();
    const saved = saveDB();
    status(saved ? `Database diperbarui: ${rows.length.toLocaleString('id-ID')} item. Tersimpan di browser ini.` : 'Database dipakai, TAPI tidak bisa disimpan di browser (penyimpanan penuh/diblokir). Upload ulang setiap membuka file ini.', saved ? 'ok' : 'err', 'db-status');
  } catch(e) { status('Gagal membaca file: ' + (e?.message || e), 'err', 'db-status'); }
}
$('dbfile').onchange = e => { handleUpload(e.target.files[0]); e.target.value = ''; };
const drop = $('drop');
['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('on'); }));
['dragleave','drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('on'); }));
drop.addEventListener('drop', e => handleUpload(e.dataTransfer.files[0]));
$('mode-merge').onclick = () => { UPMODE='merge'; $('mode-merge').setAttribute('aria-pressed',true); $('mode-replace').setAttribute('aria-pressed',false); };
$('mode-replace').onclick = () => { UPMODE='replace'; $('mode-merge').setAttribute('aria-pressed',false); $('mode-replace').setAttribute('aria-pressed',true); };
$('db-reset').onclick = async () => {
  if (!RC.custom) return status('Sudah memakai database bawaan.', '', 'db-status');
  if (!await ask('<p style="margin:0">Kembalikan ke database bawaan (rate card historis)? Database hasil upload di browser ini akan dihapus.</p>')) return;
  try { localStorage.removeItem(DB_KEY); } catch(e) {}
  RC = loadDB(); buildIndex(); renderItems(); update(); status('Database bawaan dipakai lagi.', 'ok', 'db-status');
};
async function dbWorkbook(rows, sample){
  const wb = new ExcelJS.Workbook(); const ws = wb.addWorksheet('Rate Card', {views:[{state:'frozen', xSplit:3, ySplit:1}]});
  const W = [24,32,60,18,9,14,14,14,13,10,14,12,34,20];
  ws.columns = HDR.map((h,i) => ({header:h, width:W[i]}));
  ws.getRow(1).eachCell((c,i) => { c.font = {name:'Calibri', bold:true, color:{argb:'FFFFFFFF'}}; c.fill = {type:'pattern', pattern:'solid', fgColor:{argb: i===9 ? 'FFC55A11' : 'FF1F3864'}}; c.alignment = {horizontal:'center', vertical:'middle', wrapText:true}; });
  ws.getRow(1).height = 30;
  rows.forEach(r => ws.addRow(COLS.map(c => c==='tgl' && /^\d{4}-\d{2}-\d{2}$/.test(r.tgl) ? new Date(r.tgl+'T00:00:00Z') : (NUMCOLS.has(c) && !r[c] ? null : r[c]))));
  [6,7,8,9,11].forEach(i => ws.getColumn(i).numFmt = '#,##0'); ws.getColumn(12).numFmt = 'd mmm yyyy';
  ws.autoFilter = {from:'A1', to:'N1'};
  const g = wb.addWorksheet('Petunjuk'); g.getColumn(1).width = 22; g.getColumn(2).width = 95;
  [['PETUNJUK DATABASE RATE CARD',''],['',''],
   ['Wajib diisi','Kategori, Nama Item, dan minimal salah satu: Harga Acuan atau Modal/HPP.'],
   ['Harga Min/Acuan/Maks','Harga JUAL ke klien sebelum PPN, per satuan. Acuan = harga patokan (median historis).'],
   ['Modal/HPP','Opsional (kolom oranye). Kalau diisi, harga di PH = Modal x (1 + margin).'],
   ['Kunci item','Kategori + Sub Kategori + Nama Item + Ukuran + Satuan. Mode Update menimpa item dengan kunci sama dan menambah item baru.'],
   ['Upload','Generator PH > 1 · Database Rate Card > Upload database. Bisa .xlsx atau .csv dengan judul kolom yang sama.'],
   sample ? ['Template','Hapus baris contoh, isi item mulai baris 2. Jangan ubah judul kolom di baris 1.'] : ['Sumber', RC.source + (RC.asof ? ' · data s/d ' + RC.asof : '')]
  ].forEach(r => { const x = g.addRow(r); x.getCell(2).alignment = {wrapText:true, vertical:'top'}; x.getCell(1).font = {bold:true}; });
  g.getCell('A1').font = {bold:true, size:14};
  return new Blob([await wb.xlsx.writeBuffer()], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
$('db-export').onclick = async () => { if (!window.ExcelJS) return; const d = new Date(); await saveFile(await dbWorkbook(RC.rows), `Ratecard_Database_MU_${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.xlsx`); status('Database diunduh. Edit di Excel lalu upload lagi untuk memperbarui.', 'ok', 'db-status'); };
$('db-template').onclick = async () => {
  if (!window.ExcelJS) return;
  const s = [{kat:'End Gondola - POSM',sub:'End Gondola',nama:'Contoh: Produksi End Gondola Multiplek 15mm',uk:'120 x 40 x 200 cm',sat:'unit',mn:0,md:8500000,mx:0,modal:6200000},
             {kat:'Branding & Signage',sub:'Neon Box / Lightbox',nama:'Contoh: Neon Box PVC 8mm + LED',uk:'94 x 99 cm',sat:'unit',mn:1800000,md:2000000,mx:2300000,modal:0},
             {kat:'Installasi',sub:'Instalasi',nama:'Contoh: Biaya Install & Transport Jabodetabek',uk:'',sat:'toko',mn:600000,md:650000,mx:750000,modal:0}];
  await saveFile(await dbWorkbook(s, true), 'Template_Upload_Ratecard.xlsx'); status('Template diunduh.', 'ok', 'db-status');
};

/* ---------------------------------------------------------------------
   2. STATE PH
   --------------------------------------------------------------------- */
const CLIENT = new Map(Object.entries(D.clients).map(([k,v]) => [k.toLowerCase(), {name:k, area:v[0], pic:v[1], sales:v[2]}]));
function fillList(id, arr){ const dl=$(id); dl.innerHTML=''; const fr=document.createDocumentFragment(); arr.forEach(v=>{const o=document.createElement('option'); o.value=v; fr.appendChild(o);}); dl.appendChild(fr); }
fillList('dl-client', Object.keys(D.clients));
fillList('dl-pic', D.pics);

const blankItem = () => ({lok:'', kat:'', sub:'', rid:'', nama:'', desk:'', uk:'', qty:1, sat:'', modal:'', mg:'', manual:'',
  kode:'', kota:'', prov:'', brand:'', action:'', p:'', l:'', t:'', trans:'', tglk:'', person:'', jam:'', photo:'', pw:0, ph:0});
const BASE = {tpl:'surat', tgl:'', nomor:'', client:'', alamat1:'', alamat2:'', up:'', sales:'', perihal:'', proj:'', periode:'', area:'', desk:'', kat:'',
  ppn:true, margin:'25', disc:'', kalimat:'sebagai berikut', catatan:'', ttd:'Berley Angga Putra', jab:'Direktur', ppnRate:11,
  logoMode:'mu', clientLogo:'', clw:0, clh:0, principal:'', principalPic:'', items:[]};
const pickRow = (re, kat) => RC.rows.find(r => (!kat || r.kat === kat) && re.test(r.nama + ' ' + r.sub)) || null;
const fromRow = (r, extra = {}) => r ? {...blankItem(), kat:r.kat, sub:r.sub, rid:r.id, nama:r.nama.replace(/ #\d+$/,''), uk:r.uk, sat:r.sat, modal:r.modal||'', ...extra}
                                      : {...blankItem(), ...extra};
/* contoh isi per format — tombol "Muat contoh format ini" */
function example(tpl = 'surat'){
  const B = {...structuredClone(BASE), tpl, periode:'Oktober 2026'};
  const eg = pickRow(/end gondola/i, 'End Gondola - POSM'), ins = pickRow(/install/i, 'Installasi');
  switch (tpl) {
    case 'surat_desain': return {...B, client:'Tower Media Group', proj:'Sticker Chiller & Wall Branding', area:'Jakarta Selatan', desk:'Produksi dan Installasi', kat:'Branding & Signage',
      items:[fromRow(null, {lok:'Superindo Semanggi', nama:'Sticker Chiller', desk:'Sticker vinyl + laminasi doff', p:60, l:180, qty:4, sat:'m2', modal:95000}),
             fromRow(null, {lok:'Superindo Semanggi', nama:'Wall Branding', desk:'Sticker one way vision', p:300, l:200, qty:1, sat:'m2', modal:110000}),
             fromRow(ins, {lok:'Superindo Semanggi', qty:1})]};
    case 'foto': return {...B, logoMode:'mu', client:'SONY INDONESIA', proj:'Display Base Sony Depo Pelita', area:'Jakarta', desk:'Produksi dan Pengiriman', kat:'Display - POSM',
      items:[fromRow(null, {lok:'SONY DEPO PELITA', nama:'Base Stand Headphone', desk:'Acrylic 5 mm + sticker', uk:'20 x 15 x 25 cm', qty:2, sat:'pcs', modal:250000}),
             fromRow(null, {lok:'SONY DEPO PELITA', nama:'Price Tag', desk:'Acrylic 3 mm', uk:'10 x 5 cm', qty:8, sat:'pcs', modal:15000}),
             fromRow(null, {lok:'SONY DEPO PELITA', nama:'Delivery', qty:1, sat:'ls', modal:300000})]};
    case 'rollout': return {...B, client:'CHEIL WORLDWIDE INDONESIA', up:'William Souw', principal:'PT. SAMSUNG ELECTRONICS INDONESIA', principalPic:'', proj:'SES Partner Maintenance 3 Store', area:'Sumatera', desk:'Maintenance',
      kat:'Maintenance', items:[
        fromRow(null, {lok:'ERAFONE MEGASTORE KARTINI MALL', kode:'C0781745', kota:'Bandar Lampung', prov:'Lampung', action:'Refurbish', nama:'Fabric KV Image', p:202, l:297, qty:1, sat:'m2', modal:580000, trans:1500000}),
        fromRow(null, {lok:'ERAFONE MEGASTORE KARTINI MALL', action:'Install', nama:'Installation KV Image', qty:1, sat:'unit', modal:150000}),
        fromRow(null, {lok:'ERAFONE PALEMBANG TRADE CENTER', kode:'C0779012', kota:'Palembang', prov:'Sumatera Selatan', action:'Replace', nama:'LED Strip mata besar', qty:12, sat:'batang', modal:60000, trans:500000})]};
    case 'indicia': return {...B, logoMode:'klien', client:'ADM INDICIA MARKETING SERVICES INDONESIA', proj:'Produksi Glorifier Zwitsal 10 Pcs', area:'Multiple', desk:'Produksi', kat:'Display - POSM',
      items:[fromRow(null, {lok:'Superindo', brand:'ZWITSAL', nama:'Produksi Glorifier Zwitsal', desk:'Bottom based: acrylic kuning 5 mm\nMiddle based: acrylic susu 10 mm\nKV: sticker printing laminating matt', qty:10, sat:'pcs', modal:1850000}),
             fromRow(ins, {lok:'Superindo', brand:'ZWITSAL', qty:10})]};
    case 'bq': return {...B, client:'GLOBAL TEKNOLOGI NIAGA', proj:'Renovasi Blibli Mall Kelapa Gading', area:'Mall Kelapa Gading (Jakarta)', desk:'Produksi dan Installasi', kat:'Store Build & Refurbish',
      items:[fromRow(null, {lok:'Pekerjaan Persiapan', nama:'Mobilisasi dan kebutuhan project sipil & furniture', qty:1, sat:'ls', modal:8500000}),
             fromRow(null, {lok:'Pekerjaan Persiapan', nama:'Hoarding & pembongkaran', qty:24, sat:'m2', modal:95000}),
             fromRow(null, {lok:'Pekerjaan Sipil & Interior', nama:'Partisi gypsum 2 muka rangka hollow', qty:40, sat:'m2', modal:210000}),
             fromRow(null, {lok:'Pekerjaan Sipil & Interior', nama:'Cat dinding interior', qty:120, sat:'m2', modal:35000}),
             fromRow(null, {lok:'Pekerjaan Furniture', nama:'Meja display HPL', uk:'240 x 60 x 90 cm', qty:2, sat:'unit', modal:4200000})]};
    case 'manpower': return {...B, client:'SINAR CAHAYA MERDEKA', proj:'Install & Takeout Hoarding Masari Pacific Place', area:'Jakarta', desk:'Install dan Take Out', kat:'Operasional & Jasa',
      items:[fromRow(null, {tglk:'28-Jul-26', brand:'Masari', nama:'Install Hoarding Masari', person:'Budi, Oppi, Yani', action:'MAN POWER (22.00 - 03.00)', qty:3, jam:'5', sat:'orang', modal:300000}),
             fromRow(null, {tglk:'10-Agu-26', brand:'Masari', nama:'Takeout Hoarding Masari', person:'Budi, Oppi, Yani', action:'MAN POWER (22.00 - 03.00)', qty:3, jam:'5', sat:'orang', modal:300000}),
             fromRow(null, {nama:'Transport Install + Takeout', qty:1, sat:'ls', modal:720000})]};
    default: return {...B, client:'Tower Media Group', proj:'Contoh: Revisual End Gondola 10 toko', area:'Jabodetabek', desk:'Produksi dan Installasi', kat:'End Gondola - POSM',
      items:[fromRow(eg, {lok:'Jabodetabek', qty:10, desk:'Multiplek 15mm + sticker + LED'}), fromRow(ins, {qty:10}),
             fromRow(null, {nama:'Transportation Pick Up', desk:'Jabodetabek', qty:1, sat:'rit', modal:1200000})]};
  }
}
let S;
RC = loadDB(); buildIndex();
try { S = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null'); } catch(e) { S = null; }
if (!S || !Array.isArray(S.items)) S = example(); else S = {...structuredClone(BASE), ...S};
S.items = S.items.map(i => ({...blankItem(), ...i}));
if (!S.items.length) S.items.push(blankItem());
const save = () => {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(S)); }
  catch(e) { try { localStorage.setItem(DRAFT_KEY, JSON.stringify({...S, clientLogo:'', items:S.items.map(i => ({...i, photo:''}))})); } catch(e2) {} }
};

/* ---- harga ---- */
const marginOf = it => { const m = it.mg === '' || it.mg == null ? num(S.margin) : num(it.mg); return Math.min(200, Math.max(0, m)); };
const marginBad = it => { const raw = it.mg === '' || it.mg == null ? S.margin : it.mg; const m = parseFloat(raw); return isFinite(m) && (m < 0 || m > 200); };
const qtyOf = it => num(it.qty) || 0;
const isM2 = s => /^(m2|m²|meter persegi|sqm)$/i.test(norm(s));
const m2Of = it => (num(it.p) > 0 && num(it.l) > 0) ? num(it.p) * num(it.l) / 10000 : 0;      // P × L dalam cm -> m²
const qtyEff = it => qtyOf(it) * (isM2(it.sat) && m2Of(it) ? m2Of(it) : 1);                   // satuan m² + ukuran diisi -> qty × luas
const lineTotal = (it, p) => qtyEff(it) * p + num(it.trans);
function priceOf(it){
  if (String(it.manual??'').trim() !== '') return {p:num(it.manual), src:'Harga manual', cls:'man'};
  const r = IDX.byId.get(it.rid);
  if (num(it.modal) > 0) { const m = marginOf(it); return {p:Math.round(num(it.modal) * (1 + m/100)), src:'Modal + margin ' + m.toLocaleString('id-ID') + '%', cls:''}; }
  if (r && r.md > 0) return {p:r.md, src:'Acuan rate card', cls:''};
  return {p:0, src:'Item baru — isi Modal atau harga manual', cls:'bad'};
}
function rangeOf(it, p){
  const r = IDX.byId.get(it.rid);
  if (!it.rid) return null;
  if (!r) return {txt:'Item tidak ada di database aktif', cls:'amb'};
  if (!p) return null;
  if (r.mn > 0 && p < r.mn) return {txt:'Di bawah min historis (−' + pct(1 - p/r.mn) + ')', cls:'bad'};
  if (r.mx > 0 && p > r.mx) return {txt:'Di atas maks historis (+' + pct(p/r.mx - 1) + ')', cls:'amb'};
  return {txt:'Dalam range historis', cls:'ok'};
}
function totals(){
  const rows = S.items.filter(i => norm(i.nama));
  const calc = rows.map(i => { const pr = priceOf(i); return {...i, price:pr.p, total:lineTotal(i, pr.p)}; });
  const sub = calc.reduce((a,i) => a + i.total, 0);
  const disc = num(S.disc); const dpp = sub - disc; const rate = num(S.ppnRate) || 0;
  const ppn = S.ppn ? Math.round(dpp * rate / 100) : 0;
  const lines = [['TOTAL', sub]];
  if (disc) { lines.push(['DISKON', disc]); lines.push(['TOTAL SETELAH DISKON', dpp]); }
  if (S.ppn) lines.push(['PPN ' + rate.toLocaleString('id-ID') + '%', ppn]);
  lines.push(['GRAND TOTAL', dpp + ppn]);
  return {rows:calc, sub, disc, dpp, ppn, gt:dpp+ppn, lines, rate};
}

/* ---- form header ---- */
const HF = ['principal','principalPic','tgl','nomor','client','alamat1','alamat2','up','sales','perihal','proj','periode','area','desk','kat','margin','disc','kalimat','catatan','ttd','jab'];
function syncForm(){
  HF.forEach(k => { const el=$(k); if (document.activeElement!==el) el.value = S[k]??''; });
  $('ppn-y').setAttribute('aria-pressed', !!S.ppn); $('ppn-n').setAttribute('aria-pressed', !S.ppn);
  $('ppn-y').textContent = 'PPN ' + (num(S.ppnRate)||0).toLocaleString('id-ID') + '%';
  $('set-ppn').value = S.ppnRate;
  $('tpl').value = S.tpl; $('tpl-hint').textContent = (TPL[S.tpl] || TPL.surat).hint;
  document.querySelectorAll('[data-tpl]').forEach(el => el.hidden = !el.dataset.tpl.split(' ').includes(S.tpl));
  ['mu','klien','none'].forEach(m => $('logo-' + m).setAttribute('aria-pressed', S.logoMode === m));
  $('cl-prev').innerHTML = S.clientLogo ? `<img src="${S.clientLogo}" alt="">` : '';
  fillList('dl-lok', [...new Set(S.items.map(i => norm(i.lok)).filter(Boolean))]);
}
function suggestions(){
  const c = CLIENT.get(norm(S.client).toLowerCase());
  const set = (id, key, val) => { const sp=$(id); sp.innerHTML=''; if (c && val && val!==S[key]) { const b=document.createElement('button'); b.type='button'; b.className='chip'; b.textContent='Saran: '+val; b.onclick=()=>{S[key]=val; syncForm(); update();}; sp.appendChild(b);} };
  set('sar-up','up', c?.pic); set('sar-area','area', c?.area); set('sar-sales','sales', c?.sales);
}
HF.forEach(k => $(k).addEventListener('input', e => { S[k] = e.target.value; if (k==='margin' || k==='disc') refreshItems(); update(); }));
$('disc').addEventListener('blur', e => { if (S.disc !== '') e.target.value = fmt(num(S.disc)); });
$('ppn-y').onclick = () => { S.ppn=true; syncForm(); update(); };
$('ppn-n').onclick = () => { S.ppn=false; syncForm(); update(); };
$('set-ppn').oninput = e => { S.ppnRate = parseFloat(e.target.value) || 0; syncForm(); update(); };
$('tpl').onchange = e => { S.tpl = e.target.value; syncForm(); renderItems(); update(); };
$('tpl-example').onclick = async () => { if (!await ask(`<p style="margin:0">Ganti isi form dengan contoh format <b>${esc(TPL[S.tpl].name)}</b>? Draf sekarang akan tertimpa (simpan draf dulu kalau perlu).</p>`)) return;
  const keep = {ttd:S.ttd, jab:S.jab, margin:S.margin, ppnRate:S.ppnRate, clientLogo:S.clientLogo, clw:S.clw, clh:S.clh};
  S = {...example(S.tpl), ...keep}; if (S.logoMode === 'klien' && !S.clientLogo) S.logoMode = 'mu'; syncForm(); renderItems(); update(); status('Contoh format ' + TPL[S.tpl].name + ' dimuat.', 'ok'); };
['mu','klien','none'].forEach(m => $('logo-' + m).onclick = () => { S.logoMode = m; syncForm(); update(); });
$('cl-file').onchange = e => { readImage(e.target.files[0], 500, (src, w, h) => { S.clientLogo = src; S.clw = w; S.clh = h; S.logoMode = 'klien'; syncForm(); update(); }, true); e.target.value = ''; };

/* ---------------------------------------------------------------------
   3. ITEM
   --------------------------------------------------------------------- */
const opt = (v, t, sel) => `<option value="${esc(v)}"${sel ? ' selected' : ''}>${esc(t)}</option>`;
function itemHTML(it, idx){
  const r = IDX.byId.get(it.rid);
  const cats = IDX.cats.includes(it.kat) || !it.kat ? IDX.cats : [it.kat, ...IDX.cats];
  const subs = IDX.subs.get(it.kat) || []; const subs2 = subs.includes(it.sub) || !it.sub ? subs : [it.sub, ...subs];
  const list = IDX.items.get(it.kat + '|' + it.sub) || [];
  const T = TPL[S.tpl] || TPL.surat; const F = new Set(T.fields);
  const fld = (k, label, cls, o = '') => `<div class="f ${cls}"><label for="i${idx}-${k}">${label}</label><input id="i${idx}-${k}" data-k="${k}" value="${esc(it[k] ?? '')}" ${o}></div>`;
  const extra = [
    F.has('kode') ? fld('kode', T.group === 'section' ? 'Kode gambar' : 'Channel code', 'c3') : '',
    F.has('kota') ? fld('kota', 'Kota', 'c3') : '', F.has('prov') ? fld('prov', 'Provinsi', 'c3') : '',
    F.has('brand') ? fld('brand', 'Brand / KV', 'c3') : '', F.has('action') ? fld('action', 'Action', 'c3') : '',
    F.has('tglk') ? fld('tglk', 'Tanggal kerja', 'c3', 'placeholder="28-Jul-26"') : '', F.has('person') ? fld('person', 'Person / tim', 'c4') : '', F.has('jam') ? fld('jam', 'Jam', 'c2') : '',
    F.has('dim') ? fld('p', 'P (cm)', 'c2', 'inputmode="decimal"') + fld('l', 'L (cm)', 'c2', 'inputmode="decimal"') + fld('t', 'T (cm)', 'c2', 'inputmode="decimal"') : '',
    F.has('trans') ? `<div class="f c3"><label for="i${idx}-trans">Transport (Rp) <span class="hint">per baris</span></label><input id="i${idx}-trans" data-k="trans" data-money inputmode="numeric" value="${String(it.trans??'')===''?'':fmt(it.trans)}"></div>` : ''
  ].join('');
  return `<div class="no">${idx+1}</div>
    <div class="g">
      ${F.has('lok') ? `<div class="f c3"><label for="i${idx}-lok">${esc(T.lokLabel)}</label><input id="i${idx}-lok" data-k="lok" value="${esc(it.lok)}"${T.group ? ' list="dl-lok"' : ''}></div>` : ''}
      <div class="f ${F.has('lok') ? 'c9' : 'c12'}"><label for="i${idx}-q">Cari rate card <span class="hint">(ketik nama item)</span></label><input id="i${idx}-q" data-q list="dl-rc" autocomplete="off" placeholder="mis. sticker header, neon box, install…"></div>
      <div class="f c4"><label for="i${idx}-kat">Kategori</label><select id="i${idx}-kat" data-s="kat">${opt('', '— pilih —')}${cats.map(c => opt(c, c, c===it.kat)).join('')}</select></div>
      <div class="f c4"><label for="i${idx}-sub">Sub Kategori</label><select id="i${idx}-sub" data-s="sub" ${it.kat?'':'disabled'}>${opt('', it.kat ? '— pilih —' : 'pilih kategori dulu')}${subs2.map(c => opt(c, c, c===it.sub)).join('')}</select></div>
      <div class="f c4"><label for="i${idx}-rid">Item rate card <span class="hint">${list.length ? '('+list.length+')' : ''}</span></label><select id="i${idx}-rid" data-s="rid" ${it.sub?'':'disabled'}>${opt('', it.sub ? '— pilih / item baru —' : '—')}${!r && it.rid ? opt(it.rid, '(tidak ada di database)', true) : ''}${list.map(x => opt(x.id, rcLabel(x) + ' — Rp ' + fmt(x.md), x.id===it.rid)).join('')}</select></div>
      <div class="f c6"><label for="i${idx}-nama">Item (tercetak di PH)</label><input id="i${idx}-nama" data-k="nama" value="${esc(it.nama)}"></div>
      <div class="f c6"><label for="i${idx}-desk">Description / Material <span class="hint">(Enter = baris baru)</span></label><textarea id="i${idx}-desk" data-k="desk" rows="1" style="resize:vertical">${esc(it.desk)}</textarea></div>
      ${extra}
      <div class="f c3"><label for="i${idx}-uk">Ukuran</label><input id="i${idx}-uk" data-k="uk" value="${esc(it.uk)}"></div>
      <div class="f c2"><label for="i${idx}-qty">Qty</label><input id="i${idx}-qty" data-k="qty" inputmode="decimal" value="${esc(it.qty)}"></div>
      <div class="f c2"><label for="i${idx}-sat">Unit</label><input id="i${idx}-sat" data-k="sat" value="${esc(it.sat)}" placeholder="pcs"></div>
      <div class="f c3"><label for="i${idx}-modal">Modal / HPP <span class="hint">per unit</span></label><input id="i${idx}-modal" data-k="modal" data-money inputmode="numeric" value="${it.modal===''?'':fmt(it.modal)}"></div>
      <div class="f c2"><label for="i${idx}-mg">Margin %</label><input id="i${idx}-mg" data-k="mg" type="number" min="0" max="200" inputmode="decimal" value="${esc(it.mg)}" placeholder="${esc(S.margin)}"></div>
      <div class="f c4"><label for="i${idx}-manual">Harga manual <span class="hint">(timpa semua)</span></label><input id="i${idx}-manual" data-k="manual" data-money inputmode="numeric" value="${String(it.manual??'')===''?'':fmt(it.manual)}"></div>
      <div class="final c4"><span class="hint">Harga satuan (Total Cost)</span><span class="tot" data-price></span></div>
      <div class="final c4"><span class="hint">Total</span><span class="tot" data-tot></span></div>
      <div class="ref" data-ref></div>
    </div>
    <div class="foot">
      <span class="row-inline" data-badges></span>
      <span class="row-inline">
        ${F.has('foto') ? `<label class="photo btn small ghost" for="i${idx}-photo">${it.photo ? `<img src="${it.photo}" alt="">Ganti gambar` : '+ Gambar / foto bahan'}<input type="file" accept="image/*" id="i${idx}-photo"></label>${it.photo ? '<button type="button" class="btn x" data-unphoto>Hapus gambar</button>' : ''}` : ''}
        <button type="button" class="btn x" data-up aria-label="Naikkan item ${idx+1}">↑</button>
        <button type="button" class="btn x" data-down aria-label="Turunkan item ${idx+1}">↓</button>
        <button type="button" class="btn x" data-dup>Duplikat</button>
        <button type="button" class="btn x" data-del aria-label="Hapus item ${idx+1}">Hapus</button>
      </span>
    </div>`;
}
function refreshItem(el, it){
  const pr = priceOf(it); const r = IDX.byId.get(it.rid);
  el.querySelector('[data-price]').textContent = 'Rp ' + fmt(pr.p);
  el.querySelector('[data-tot]').textContent = 'Rp ' + fmt(lineTotal(it, pr.p));
  const ref = el.querySelector('[data-ref]');
  if (r) ref.innerHTML = `<span>Min <b>${fmt(r.mn)}</b></span><span>Acuan <b>${fmt(r.md)}</b></span><span>Maks <b>${fmt(r.mx)}</b></span>`
      + (r.modal ? `<span>Modal DB <b>${fmt(r.modal)}</b></span>` : '')
      + (r.nph ? `<span>${r.nph}× di PH</span>` : '')
      + (r.last ? `<span>Terakhir <b>${fmt(r.last)}</b>${r.klien ? ' · '+esc(r.klien) : ''}${r.tgl ? ' · '+esc(r.tgl) : ''}${r.noph ? ' · '+esc(r.noph) : ''}</span>` : '');
  else ref.innerHTML = '<span>Belum terhubung ke rate card — pilih item atau isi Modal/HPP / harga manual.</span>';
  const b = [];
  b.push(`<span class="badge ${pr.cls}">${esc(pr.src)}</span>`);
  const rg = rangeOf(it, pr.p); if (rg) b.push(`<span class="badge ${rg.cls}">${esc(rg.txt)}</span>`);
  if (num(it.modal) > 0 && pr.p) { const m = (pr.p - num(it.modal)) / num(it.modal); b.push(`<span class="badge ${m < 0 ? 'bad' : ''}">Margin aktual ${pct(m)}</span>`); }
  if (marginBad(it)) b.push('<span class="badge bad">Margin dibatasi 0–200%</span>');
  if (isM2(it.sat) && m2Of(it)) b.push(`<span class="badge">Luas ${fq(m2Of(it))} m² × qty ${fq(qtyOf(it))}</span>`);
  else if (m2Of(it) && !isM2(it.sat)) b.push(`<span class="badge man">Luas ${fq(m2Of(it))} m² (tulis Unit "m2" agar harga dihitung per m²)</span>`);
  if (num(it.trans)) b.push(`<span class="badge man">+ transport Rp ${fmt(num(it.trans))}</span>`);
  el.querySelector('[data-badges]').innerHTML = b.join('');
}
function refreshItems(){ document.querySelectorAll('#items .item').forEach((el, i) => S.items[i] && refreshItem(el, S.items[i])); }
function selectRow(it, r){
  it.rid = r.id; it.kat = r.kat; it.sub = r.sub; it.nama = r.nama.replace(/ #\d+$/,''); it.uk = r.uk; it.sat = r.sat;
  it.modal = r.modal || ''; it.manual = '';
}
function renderItems(){
  const box = $('items'); box.innerHTML = '';
  S.items.forEach((it, idx) => {
    const el = document.createElement('div'); el.className = 'item'; el.innerHTML = itemHTML(it, idx);
    el.querySelectorAll('input[data-k],textarea[data-k]').forEach(inp => {
      inp.addEventListener('input', () => {
        const k = inp.dataset.k;
        if (inp.dataset.money !== undefined) it[k] = inp.value.trim() === '' ? '' : num(inp.value);
        else it[k] = inp.value;
        refreshItem(el, it); update();
      });
      if (inp.dataset.money !== undefined) inp.addEventListener('blur', () => { inp.value = String(it[inp.dataset.k]??'') === '' ? '' : fmt(it[inp.dataset.k]); });
    });
    el.querySelectorAll('select[data-s]').forEach(sel => sel.addEventListener('change', () => {
      const k = sel.dataset.s;
      if (k === 'kat') { it.kat = sel.value; it.sub = ''; it.rid = ''; }
      if (k === 'sub') { it.sub = sel.value; it.rid = ''; }
      if (k === 'rid') { const r = IDX.byId.get(sel.value); if (r) selectRow(it, r); else it.rid = ''; }
      renderItems(); update(); $(`i${idx}-${k}`)?.focus();
    }));
    const q = el.querySelector('[data-q]');
    q.addEventListener('change', () => { const id = IDX.label.get(q.value); if (id) { selectRow(it, IDX.byId.get(id)); renderItems(); update(); $(`i${idx}-qty`)?.focus(); } });
    const move = d => { const j = idx + d; if (j < 0 || j >= S.items.length) return; [S.items[idx], S.items[j]] = [S.items[j], S.items[idx]]; renderItems(); update(); };
    el.querySelector('[data-up]').onclick = () => move(-1);
    el.querySelector('[data-down]').onclick = () => move(1);
    el.querySelector('[data-dup]').onclick = () => { S.items.splice(idx+1, 0, structuredClone(it)); renderItems(); update(); };
    el.querySelector('[data-del]').onclick = () => { S.items.splice(idx,1); if (!S.items.length) S.items.push(blankItem()); renderItems(); update(); };
    const ph = el.querySelector('input[type=file]');
    if (ph) ph.onchange = () => readImage(ph.files[0], 640, (src, w, h) => { it.photo = src; it.pw = w; it.ph = h; renderItems(); update(); });
    const un = el.querySelector('[data-unphoto]'); if (un) un.onclick = () => { it.photo = ''; renderItems(); update(); };
    refreshItem(el, it);
    box.appendChild(el);
  });
}
/* gambar diperkecil (maks 640 px) & diubah ke JPEG supaya file PH tetap ringan */
function readImage(f, max, cb, keepPng){
  if (!f) return; const rd = new FileReader();
  rd.onload = () => { const img = new Image(); img.onload = () => { const s = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas');
    c.width = Math.round(img.width * s); c.height = Math.round(img.height * s); const x = c.getContext('2d');
    if (!keepPng) { x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); }
    x.drawImage(img, 0, 0, c.width, c.height); cb(keepPng ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.85), c.width, c.height); };
    img.onerror = () => status('Gambar tidak bisa dibaca.', 'err'); img.src = rd.result; };
  rd.readAsDataURL(f);
}
$('add').onclick = () => { const last = S.items[S.items.length-1]; S.items.push({...blankItem(), lok: last?.lok || '', kode: last?.kode || '', kota: last?.kota || '', prov: last?.prov || '', brand: last?.brand || '', kat: last?.kat || '', sub: last?.sub || ''}); renderItems(); update(); $(`i${S.items.length-1}-q`).focus(); };

/* ---------------------------------------------------------------------
   4. PRATINJAU — memakai format yang dipilih (lihat templates.js)
   --------------------------------------------------------------------- */
function tglIndo(iso){ const s = iso ?? S.tgl; if (!s || !/^\d{4}-\d{2}-\d{2}/.test(s)) return s || ''; const d = new Date(s.slice(0,10)+'T00:00'); return d.getDate()+' '+BULAN[d.getMonth()]+' '+d.getFullYear(); }
const perihal = () => norm(S.perihal) || ('Penawaran Harga ' + norm(S.proj)).trim();
const kalimat = () => `Sehubungan dengan hal tersebut diatas maka bersama ini kami mengajukan penawaran harga untuk pekerjaan ${S.kalimat || 'sebagai berikut'} :`;
function renderPaper(){
  const d = buildDoc(); const p = $('paper'); const land = d.orient === 'l';
  p.style.width = (land ? 1123 : 794) + 'px'; p.style.minHeight = (land ? 794 : 1123) + 'px';
  p.innerHTML = docHTML(d);
  document.getElementById('page-style').textContent = `@media print{@page{size:A4 ${land ? 'landscape' : 'portrait'};margin:10mm}}`;
  scalePaper();
}
function scalePaper(){ const p = $('paper'); const w = $('pvwrap').clientWidth - 24; const s = Math.min(1, w / p.offsetWidth); p.style.transform = `scale(${s})`; $('pvwrap').style.height = (p.offsetHeight * s + 24) + 'px'; }
new ResizeObserver(scalePaper).observe($('pvwrap'));

function renderInternal(t){
  const withModal = t.rows.filter(i => num(i.modal) > 0);
  const modal = withModal.reduce((a,i) => a + qtyEff(i) * num(i.modal), 0);
  const jual = withModal.reduce((a,i) => a + qtyEff(i) * i.price, 0);
  const withRef = t.rows.filter(i => IDX.byId.get(i.rid)?.md > 0);
  const refSum = withRef.reduce((a,i) => a + qtyEff(i) * IDX.byId.get(i.rid).md, 0), refJual = withRef.reduce((a,i) => a + qtyEff(i) * i.price, 0);
  const out = t.rows.filter(i => { const r = rangeOf(i, i.price); return r && r.cls !== 'ok'; }).length;
  const zero = t.rows.filter(i => !i.price).length;
  const rows = [['Item terisi', t.rows.length]];
  if (modal) { rows.push(['Total modal (' + withModal.length + ' item)', 'Rp ' + fmt(modal)]); rows.push(['Laba kotor sebelum diskon', 'Rp ' + fmt(jual - modal)]);
    rows.push(['Markup atas modal', pct((jual - modal) / modal)]); if (jual) rows.push(['Gross margin (laba ÷ jual)', pct((jual - modal) / jual)]);
    if (t.disc) rows.push(['Laba setelah diskon', 'Rp ' + fmt(jual - modal - t.disc)]); }
  if (refSum) rows.push(['Harga vs acuan rate card', (refJual >= refSum ? '+' : '−') + pct(Math.abs(refJual / refSum - 1))]);
  rows.push(['Di luar range historis', out]); if (zero) rows.push(['Belum ada harga', zero]);
  $('internal').innerHTML = `<div class="t">Cek internal (tidak tercetak)</div><dl>${rows.map(([a,b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl>`;
}
function update(){
  suggestions();
  const t = totals();
  $('sum').innerHTML = [['Subtotal', t.sub]].concat(t.lines.slice(1)).map(([l,v]) => `<span${l==='GRAND TOTAL'?' class="gt"':''}>${l}</span><span${l==='GRAND TOTAL'?' class="gt"':''}>Rp ${fmt(v)}</span>`).join('');
  renderInternal(t); renderPaper(); save();
}

/* ---------------------------------------------------------------------
   5. EKSPOR: PDF, Excel, cetak, salin baris, draf
   --------------------------------------------------------------------- */
async function makePDF(){ return docPDF(buildDoc()); }
async function makeXLSX(){
  const t = totals(); const wb = await docXLSX(buildDoc());
  if ($('withint').checked) {
    const wi = wb.addWorksheet('Internal (jangan dikirim)', {views:[{state:'frozen', ySplit:1}]});
    const hd = ['No','Kategori','Sub Kategori','Item','Ukuran','Unit','Qty','Qty efektif (m²)','Harga Min','Harga Acuan','Harga Maks','Modal/HPP','Margin %','Harga PH','Transport','Total','Sumber harga','Cek range','Margin aktual'];
    wi.columns = hd.map((h,i) => ({header:h, width:[5,22,26,40,16,8,7,10,13,13,13,13,9,14,12,15,24,30,12][i]}));
    wi.getRow(1).eachCell(c => { c.font = {bold:true, color:{argb:'FFFFFFFF'}}; c.fill = {type:'pattern', pattern:'solid', fgColor:{argb:'FF1F3864'}}; c.alignment = {horizontal:'center', vertical:'middle', wrapText:true}; });
    t.rows.forEach((it, n) => { const rr = IDX.byId.get(it.rid) || {}; const pr = priceOf(it); const rg = rangeOf(it, it.price); const md = num(it.modal);
      wi.addRow([n+1, it.kat, it.sub, it.nama, sizeOf(it), it.sat, qtyOf(it), qtyEff(it), rr.mn||null, rr.md||null, rr.mx||null, md||null, md ? marginOf(it)/100 : null, it.price, num(it.trans)||null, it.total, pr.src, rg ? rg.txt : '', md && it.price ? (it.price - md)/md : null]); });
    [9,10,11,12,14,15,16].forEach(i => wi.getColumn(i).numFmt = '#,##0'); [13,19].forEach(i => wi.getColumn(i).numFmt = '0.0%');
  }
  return new Blob([await wb.xlsx.writeBuffer()], {type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
async function saveFile(blob, fname){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = fname; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
function baseName(){
  const parts = [norm(S.client || 'Client').split(' ').slice(0,3).join(' '), norm(S.proj) || 'Penawaran Harga'];
  if (norm(S.nomor)) parts.push(S.nomor.replace(/\//g,'-'));
  return parts.join(' - ').replace(/[\\/:*?"<>|]/g,'').trim();
}
function checkReady(){
  const t = totals();
  if (!t.rows.length) { status('Isi minimal satu item dulu.', 'err'); return false; }
  if (t.rows.some(i => !i.price)) { status('Ada item dengan harga 0. Pilih dari rate card, isi Modal/HPP, atau isi harga manual.', 'err'); return false; }
  return true;
}
async function runSave(kind, make){
  if (!checkReady()) return;
  try { const blob = await make(); const fname = baseName() + '.' + kind; await saveFile(blob, fname); status(fname + ' diunduh (cek folder Downloads).', 'ok'); }
  catch(e) { status('File gagal dibuat: ' + (e?.message || e), 'err'); }
}
$('pdf').onclick = () => { if (!window.jspdf) return status('Pembuat PDF belum termuat. Muat ulang halaman.', 'err'); runSave('pdf', makePDF); };
$('xlsx').onclick = () => { if (!window.ExcelJS) return status('Pembuat Excel belum termuat. Muat ulang halaman.', 'err'); runSave('xlsx', makeXLSX); };
$('print').onclick = () => { if (checkReady()) window.print(); };
function dmy(){ if (!S.tgl) return ''; const d = new Date(S.tgl+'T00:00'); return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear(); }
async function copyText(txt, label){
  try { await navigator.clipboard.writeText(txt); $('fallback').hidden = true; status(label + ' tersalin. Tempel di baris kosong pertama sheet tujuan (kolom A).', 'ok'); }
  catch(e) { const f = $('fallback'); f.hidden = false; f.value = txt; f.focus(); f.select(); status('Salin otomatis diblokir. Teks sudah diblok di kotak bawah, tekan ⌘C / Ctrl+C.', 'err'); }
}
$('cp-master').onclick = () => { const t = totals(); copyText([dmy(), S.nomor, S.proj, S.client, S.sales, S.area, S.desk, S.kat, t.sub, t.disc, t.dpp, S.ppn ? 'PPN ' + t.rate + '%' : 'NON PPN', t.ppn, t.gt, 'On Process'].join('\t'), 'Baris PH-MU2026'); };
$('cp-unit').onclick = () => { const t = totals(); copyText(t.rows.map(i => [dmy(), S.nomor, S.proj, S.client, S.sales, i.kat || S.kat, i.nama, qtyEff(i), i.price, i.total].join('\t')).join('\n'), t.rows.length + ' baris Unit Price'); };
$('draft-save').onclick = () => { saveFile(new Blob([JSON.stringify({app:'generator-ph-mu', v:1, ph:S}, null, 1)], {type:'application/json'}), 'Draf PH - ' + baseName() + '.json'); status('Draf disimpan sebagai file .json — buka lagi lewat "Buka draf…".', 'ok'); };
$('draft-file').onchange = async e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f) return;
  try { const j = JSON.parse(await f.text()); const ph = j.ph || j; if (!Array.isArray(ph.items)) throw new Error('bukan file draf PH');
    S = {...structuredClone(BASE), ...ph}; S.items = S.items.map(i => ({...blankItem(), ...i})); syncForm(); renderItems(); update(); status('Draf ' + f.name + ' dibuka.', 'ok'); }
  catch(err) { status('Draf gagal dibuka: ' + (err?.message || err), 'err'); }
};
$('clear').onclick = () => { const keep = {tpl:S.tpl, ttd:S.ttd, jab:S.jab, sales:S.sales, margin:S.margin, ppnRate:S.ppnRate, logoMode:S.logoMode, clientLogo:S.clientLogo, clw:S.clw, clh:S.clh};
  S = {...structuredClone(BASE), ...keep, items:[blankItem()]}; syncForm(); renderItems(); update(); status('Form dikosongkan untuk PH baru.'); };

syncForm(); renderItems(); update();
