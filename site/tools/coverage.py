# 產生 site/COVERAGE.md：官方學習內容代碼 → 網站單元 的對照表
import io, re, json, subprocess, os, sys
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SITE = os.path.join(ROOT, 'site')

# 1) 從研究筆記抽出官方代碼與條目名稱
official = {}   # code -> (title, group)
def add(code, title, group):
    official.setdefault(code, (title.strip(), group))

src1 = io.open(os.path.join(ROOT, 'research', 'official_math_ab_curriculum.md'), encoding='utf-8').read()
for m in re.finditer(r'^\|\s*([NSGAFD]-1[01][AB]?-\d+)\s*\|\s*([^|]+)\|', src1, re.M):
    code = m.group(1)
    grp = '10 年級共同必修' if '-10-' in code else ('11 年級數學 A' if '11A' in code else '11 年級數學 B')
    add(code, m.group(2), grp)

src2 = io.open(os.path.join(ROOT, 'research', 'taiwan-high-school-math-curriculum.md'), encoding='utf-8').read()
for m in re.finditer(r'`([NSGAFD]-12[甲乙]-\d+)`\s*\|\s*([^|]+)\|', src2):
    code = m.group(1)
    add(code, m.group(2), '12 年級數學甲' if '甲' in code else '12 年級數學乙')

# 2) 讀 catalog
node = subprocess.run(['node', '-e', "global.window={};require('./assets/js/catalog.js');console.log(JSON.stringify(window.CATALOG.units))"],
                      cwd=SITE, capture_output=True, text=True, encoding='utf-8')
units = json.loads(node.stdout)
by_code = {}
for u in units:
    for c in u['codes']:
        by_code.setdefault(c, []).append(u)

ORDER = ['10 年級共同必修', '11 年級數學 A', '11 年級數學 B', '12 年級數學甲', '12 年級數學乙']
def key(code):
    g = official[code][1]
    return (ORDER.index(g), code.split('-')[0], int(code.split('-')[-1]))

out = ['# 課綱代碼對照表', '',
       '這份表由 `assets/js/catalog.js` 自動產生（`tools/coverage.py`），列出 108 課綱每一條學習內容對應到哪些單元。',
       '「補充」軌道的單元是課綱外的延伸，不算涵蓋。', '']
summary = {}
for grp in ORDER:
    codes = sorted([c for c in official if official[c][1] == grp], key=key)
    have = 0
    rows = []
    for c in codes:
        us = [u for u in by_code.get(c, []) if 'X' not in u['tracks']]
        if us: have += 1
        rows.append('| `%s` | %s | %s |' % (c, official[c][0],
                    '、'.join('[%s](units/%s.html)' % (u['title'], u['slug']) for u in us) or '**尚未涵蓋**'))
    summary[grp] = (have, len(codes))
    out += ['## %s（%d / %d）' % (grp, have, len(codes)), '', '| 代碼 | 學習內容 | 對應單元 |', '|---|---|---|'] + rows + ['']

tot_have = sum(v[0] for v in summary.values())
tot_all = sum(v[1] for v in summary.values())
out.insert(4, '| 學程 | 條目數 | 有對應單元 |\n|---|---:|---:|\n' +
           '\n'.join('| %s | %d | %d |' % (g, summary[g][1], summary[g][0]) for g in ORDER) +
           '\n| **合計** | **%d** | **%d** |\n' % (tot_all, tot_have))

io.open(os.path.join(SITE, 'COVERAGE.md'), 'w', encoding='utf-8').write('\n'.join(out))
print('total %d/%d' % (tot_have, tot_all))
for g in ORDER:
    print(' ', g, summary[g])
missing = [c for c in official if not [u for u in by_code.get(c, []) if 'X' not in u['tracks']]]
print('missing:', sorted(missing, key=key))
extra = sorted(set(by_code) - set(official))
print('catalog codes not in official list:', extra)
