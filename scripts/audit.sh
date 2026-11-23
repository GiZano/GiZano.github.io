#!/usr/bin/env bash
# scripts/audit.sh - Strict pre-flight and CI compliance audit for GiZano.github.io
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

ERRORS=0
echo "=== Running Website Quality & Privacy Audit ==="

# 1. Prohibited terms check
echo "[1/6] Checking for prohibited legacy terminology..."
PROHIBITED=(
    "SYSTEM CERTIFIED"
    "Cloud Architecture projects"
    "STA/LTA ratio > 1.8"
    "api.web3forms.com"
)
for term in "${PROHIBITED[@]}"; do
    if git grep -qi "$term" -- '*.html' '*.js' ':!scripts/audit.sh' ':!scripts/audit-live.sh' 2>/dev/null; then
        echo "  [FAIL] Prohibited term found: '$term'"
        ERRORS=$((ERRORS + 1))
    fi
done

# 2. Check for live fetch calls to jsonplaceholder
echo "[2/6] Checking for live external fetch calls..."
if git grep -nE "fetch\([^)]*jsonplaceholder" -- '*.js' '*.html' 2>/dev/null; then
    echo "  [FAIL] Live fetch to jsonplaceholder detected!"
    ERRORS=$((ERRORS + 1))
fi

# 3. Remote asset check in HTML (scripts, links, iframes, images)
echo "[3/6] Checking for unauthorized external assets in HTML files..."
UNAUTHORIZED_ASSETS=$(git ls-files '*.html' ':!LevelUp/**' ':!projects/LevelUp/**' | while read -r f; do
    grep -oE '<(script|img|iframe|link)[^>]+(src|href)="https?://[^"]+"' "$f" 2>/dev/null \
        | grep -vE 'giovanni-zanotti\.is-a\.dev|rel="(me|canonical)"|googletagmanager\.com|youtube-nocookie\.com' \
        || true
done)
if [ -n "$UNAUTHORIZED_ASSETS" ]; then
    echo "  [FAIL] Unauthorized remote asset tags detected:"
    echo "$UNAUTHORIZED_ASSETS"
    ERRORS=$((ERRORS + 1))
fi

# 4. Strict check on QuakeGuard: zero inline script and zero inline event handlers
echo "[4/6] Checking QuakeGuard CSP & handler compliance..."
QG_INLINE=$(grep -n -E '<script[ >]' projects/quakeguard.html | grep -vE 'src=|type="application/ld\+json"' || true)
if [ -n "$QG_INLINE" ]; then
    echo "  [FAIL] QuakeGuard has inline script tag(s):"
    echo "$QG_INLINE"
    ERRORS=$((ERRORS + 1))
fi

QG_HANDLERS=$(grep -n -i -E '\bon(click|load|submit|change)=' projects/quakeguard.html || true)
if [ -n "$QG_HANDLERS" ]; then
    echo "  [FAIL] QuakeGuard has inline event handler(s):"
    echo "$QG_HANDLERS"
    ERRORS=$((ERRORS + 1))
fi

# 5. LevelUp redirect integrity check
echo "[5/6] Checking LevelUp redirect integrity..."
LEVELUP_FILES=$(git ls-files '*LevelUp*.html' '*levelup*.html')
for f in $LEVELUP_FILES; do
    if ! grep -q "climbstack.is-a.software" "$f"; then
        echo "  [FAIL] $f does not point to climbstack.is-a.software"
        ERRORS=$((ERRORS + 1))
    fi
done

# 6. Automated horizontal viewport overflow check (across all 20 sitemap pages)
echo "[6/6] Checking for horizontal viewport overflow (all 20 sitemap pages)..."
if command -v node >/dev/null 2>&1 && [ -f "$SCRIPT_DIR/test_overflow.js" ]; then
    if ! node "$SCRIPT_DIR/test_overflow.js"; then
        echo "  [FAIL] Viewport overflow detected on sitemap pages!"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo "  [SKIP] Node.js or test_overflow.js not available."
fi

# Optional: Run live post-deploy check if requested with --live
if [ "${1:-}" = "--live" ]; then
    "$SCRIPT_DIR/audit-live.sh"
fi

echo "-----------------------------------------------"
if [ "$ERRORS" -eq 0 ]; then
    echo " [PASS] All audit checks passed successfully!"
    exit 0
else
    echo " [FAIL] Audit failed with $ERRORS error(s)."
    exit 1
fi
