"""Rakit Generator PH Mata Utama menjadi SATU file HTML yang bisa dibuka offline.
Pakai:  python3 build.py
Input :  src/index.html, src/style.css, src/templates.js (7 format PH), src/app.js, src/vendor/*.js, src/logo.datauri.txt,
         data/db_default.json (rate card bawaan), data/clients.json
Output:  dist/Generator_PH_Mata_Utama.html
"""
import json, pathlib, datetime
B = pathlib.Path(__file__).parent
src = B / 'src'
db = json.loads((B / 'data/db_default.json').read_text(encoding='utf-8'))
cl = json.loads((B / 'data/clients.json').read_text(encoding='utf-8'))
CATS = ['Floor Display - POSM','FSU - POSM','End Gondola - POSM','Wagon - POSM','CTA - POSM','Display - POSM','Store Build & Refurbish',
        'Booth & Event','Branding & Signage','Revisual & Repostering','Installasi','Dismantle','Maintenance','Maintenance & FSU - POSM',
        'Maintenance & End Gondola - POSM','Survey','Operasional & Jasa']
data = {'db': db, 'clients': cl['clients'], 'pics': cl['pics'], 'cats': CATS}
js = json.dumps(data, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/')
vendor = ''.join(f'<script>{(src / "vendor" / n).read_text(encoding="utf-8")}</script>\n'
                 for n in ['jspdf.umd.min.js', 'jspdf.plugin.autotable.min.js', 'exceljs.min.js'])
html = (src / 'index.html').read_text(encoding='utf-8')
for k, v in {'/*@@STYLE@@*/': (src / 'style.css').read_text(encoding='utf-8'),
             '/*@@LOGO@@*/': (src / 'logo.datauri.txt').read_text(encoding='utf-8').strip(),
             '/*@@DATA@@*/': js,
             '<!--@@VENDOR@@-->': vendor,
             '/*@@APP@@*/': (src / 'templates.js').read_text(encoding='utf-8') + '\n' + (src / 'app.js').read_text(encoding='utf-8')}.items():
    assert k in html, k
    a, b = html.split(k, 1)
    html = a + v + b   # split/gabung, supaya isi file tidak diubah sama sekali
out = B / 'dist' / 'Generator_PH_Mata_Utama.html'
out.parent.mkdir(exist_ok=True); out.write_text(html, encoding='utf-8')
print(f'OK {out} {out.stat().st_size/1e6:.2f} MB · {len(db["rows"])} item rate card · {datetime.date.today()}')
