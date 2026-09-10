#!/usr/bin/env bash
# VEY-910 acceptance harness. Offline: runs against a directory of HTML files,
# so QA does not need network access. Point it at the built `dist/` tree or at
# a directory of pages saved from the live site.
#
#   ./scripts/verify-vey-910.sh dist
#
# Every check prints its raw count. Zero-hit checks are paired with a positive
# control that MUST be non-zero, so an ASCII-stripped or otherwise broken
# pattern cannot fake a PASS (see VEY-904/VEY-907 lessons).
#
# Counting uses `grep -oE ... | wc -l`, never `grep -q`: on large blobs
# `grep -q` exits 141 under pipefail and reads as clean.

set -uo pipefail

ROOT="${1:-dist}"
if [ ! -d "$ROOT" ]; then
  echo "usage: $0 <dir-of-html>" >&2
  exit 2
fi

fail=0
ok()   { printf '  PASS  %s\n' "$1"; }
bad()  { printf '  FAIL  %s\n' "$1"; fail=1; }

# Astro wraps prose mid-phrase, so a phrase can straddle a newline in the
# emitted HTML. Normalize whitespace across the WHOLE concatenated corpus
# before matching anything.
BLOB="$(mktemp)"
trap 'rm -f "$BLOB"' EXIT
find "$ROOT" -name '*.html' -print0 \
  | xargs -0 cat \
  | tr '\n\t' '  ' \
  | tr -s ' ' > "$BLOB"

count() { grep -oiE "$1" "$BLOB" | wc -l | tr -d ' '; }

echo "corpus: $(find "$ROOT" -name '*.html' | wc -l | tr -d ' ') html files under $ROOT"

echo
echo "== control (must be non-zero, proves the corpus and matcher work) =="
for ctl in 'Holter' 'liječnik' 'ustanov'; do
  n=$(count "$ctl")
  printf '  %-26s %s\n' "$ctl" "$n"
  [ "$n" -gt 0 ] && ok "control '$ctl' non-zero" || bad "control '$ctl' is 0, matcher is broken"
done

echo
echo "== AC1 nav order, header and footer, every page =="
python3 - "$ROOT" <<'PY'
import sys, re, pathlib
want = ['Usluga','Za pacijente','Za partnere','Partneri','O nama','Projekt','Kontakt']
bad = 0
for f in sorted(pathlib.Path(sys.argv[1]).rglob('*.html')):
    h = f.read_text(encoding='utf-8', errors='replace')
    m = re.search(r'<nav aria-label="Glavna navigacija".*?</nav>', h, re.S)
    if not m:
        continue  # 404.html and probes have no nav
    hdr = re.findall(r'<a[^>]*>\s*([^<]+?)\s*</a>', m.group(0))
    fm = re.search(r'Stranice</p>\s*<ul[^>]*>(.*?)</ul>', h, re.S)
    ftr = re.findall(r'<a[^>]*>\s*([^<]+?)\s*</a>', fm.group(1)) if fm else []
    hok = hdr[:7] == want
    fok = ftr[:7] == want
    if not (hok and fok):
        bad = 1
        print(f'  FAIL  {f}')
        print(f'        header: {hdr}')
        print(f'        footer: {ftr}')
print('  PASS  nav order correct in header and footer on every page' if not bad else '  FAIL  nav order')
sys.exit(bad)
PY
[ $? -eq 0 ] || fail=1

echo
echo "== AC2 partner portal targets =="
for pat in 'app\.holterservice\.eu' 'poliklinika-obad\.hr/panel/'; do
  n=$(count "$pat")
  printf '  %-30s %s\n' "$pat" "$n"
  [ "$n" -gt 0 ] && ok "$pat present" || bad "$pat missing"
done
n=$(count 'rel="noopener noreferrer"')
printf '  %-30s %s\n' 'rel=noopener noreferrer' "$n"
[ "$n" -ge 2 ] && ok "both portal links carry rel=noopener noreferrer" \
                || bad "expected >=2 noopener noreferrer, got $n"

echo
echo "== AC3 Partnerski portal entry points =="
pages=$(find "$ROOT" -name '*.html' ! -name '404.html' ! -name 'probe*' | wc -l | tr -d ' ')
missing=0
while IFS= read -r f; do
  c=$(tr '\n\t' '  ' < "$f" | tr -s ' ' | grep -oE 'href="/partnerski-portal" class="btn btn-secondary nav-cta"' | wc -l | tr -d ' ')
  [ "$c" -ge 1 ] || { echo "  FAIL  no header portal CTA in $f"; missing=1; }
done < <(find "$ROOT" -name '*.html' ! -name '404.html' ! -name 'probe*')
[ "$missing" -eq 0 ] && ok "header CTA on all $pages content pages" || fail=1
zp=$(tr '\n\t' '  ' < "$ROOT/za-partnere/index.html" | grep -oE 'href="/partnerski-portal"' | wc -l | tr -d ' ')
printf '  %-30s %s\n' '/za-partnere -> portal links' "$zp"
[ "$zp" -ge 2 ] && ok "za-partnere links to the portal (nav CTA + in-page callout)" \
                || bad "za-partnere in-page portal link missing"

echo
echo "== AC5 VEY-907 regressions (all must be 0) =="
for pat in 'certifikat' 'po želji' 'onboarding'; do
  n=$(count "$pat")
  printf '  %-30s %s\n' "$pat" "$n"
  [ "$n" -eq 0 ] && ok "$pat is 0" || bad "$pat regressed to $n"
done
# "specijalist kardiologije" must always be preceded by "liječnik". Match the
# declension with a \w* stem and allow the wrapped-whitespace case.
bare=$(grep -oiE '(liječnik[a-zšđčćž]* )?specijalist[a-zšđčćž]* kardiologije' "$BLOB" \
        | grep -civE '^liječnik' || true)
printf '  %-30s %s\n' 'bare specijalist kardiologije' "$bare"
tot=$(count 'specijalist[a-zšđčćž]* kardiologije')
printf '  %-30s %s\n' '(total occurrences)' "$tot"
[ "$tot" -gt 0 ] || bad "control: zero 'specijalist kardiologije' at all, pattern is broken"
[ "$bare" -eq 0 ] && ok "every 'specijalist kardiologije' has 'liječnik' in front" \
                  || bad "$bare bare occurrences"

echo
echo "== AC7 no em dash / en dash in visible text =="
vis=$(python3 - "$ROOT" <<'PY'
import sys, re, pathlib
out = []
for f in sorted(pathlib.Path(sys.argv[1]).rglob('*.html')):
    h = f.read_text(encoding='utf-8', errors='replace')
    h = re.sub(r'(?is)<(script|style|svg)\b.*?</\1>', ' ', h)
    h = re.sub(r'(?s)<!--.*?-->', ' ', h)
    h = re.sub(r'(?s)<[^>]+>', ' ', h)
    for ch in ('—', '–'):
        for m in re.finditer(re.escape(ch), h):
            out.append(f'{f}: ...{h[max(0,m.start()-40):m.start()+40]}...')
print('\n'.join(out))
PY
)
n=$(printf '%s' "$vis" | grep -c . | tr -d ' ')
printf '  %-30s %s\n' 'em/en dashes in visible text' "$n"
[ "$n" -eq 0 ] && ok "no em/en dash in visible text" || { bad "$n dashes"; printf '%s\n' "$vis"; }

echo
[ "$fail" -eq 0 ] && echo "ALL CHECKS PASSED" || echo "SOME CHECKS FAILED"
exit "$fail"
