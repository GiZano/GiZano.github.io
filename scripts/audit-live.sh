#!/usr/bin/env bash
# scripts/audit-live.sh - Post-deploy production verification on live domain
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

BASE_URL="https://giovanni-zanotti.is-a.dev"
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

ERRORS=0
echo "=== Running Post-Deploy Production Audit ($BASE_URL) ==="

# 1. Wait for deployment by matching <meta name="build" content="...">
EXPECTED_BUILD=$(grep -oE '<meta name="build" content="[^"]+"' index.html 2>/dev/null | cut -d'"' -f4 || true)
echo "[1/5] Verifying live deployment matches local build ($EXPECTED_BUILD)..."

MAX_ATTEMPTS=12
DEPLOYED=false

for ((i=1; i<=MAX_ATTEMPTS; i++)); do
    TIMESTAMP=$(date +%s)
    if curl -sSL -f "${BASE_URL}/?nocache=${TIMESTAMP}" > "$TMP_DIR/home.html" 2>/dev/null; then
        LIVE_BUILD=$(grep -oE '<meta name="build" content="[^"]+"' "$TMP_DIR/home.html" 2>/dev/null | cut -d'"' -f4 || true)
        if [ -n "$EXPECTED_BUILD" ] && [ "$LIVE_BUILD" = "$EXPECTED_BUILD" ]; then
            echo "  [PASS] Live site build '$LIVE_BUILD' matches expected commit build '$EXPECTED_BUILD' (attempt $i)."
            DEPLOYED=true
            break
        elif [ -z "$EXPECTED_BUILD" ]; then
            echo "  [INFO] No local <meta name=\"build\"> set; proceeding with live checks."
            DEPLOYED=true
            break
        else
            echo "  [WAIT] Live site build is '${LIVE_BUILD:-legacy}' (waiting for '$EXPECTED_BUILD', attempt $i/$MAX_ATTEMPTS)..."
            sleep 5
        fi
    else
        echo "  [WAIT] Connection to $BASE_URL failed, retrying in 5s..."
        sleep 5
    fi
done

if [ "$DEPLOYED" = false ]; then
    echo "  [FAIL] Live site deployment timeout: still serving build '${LIVE_BUILD:-unknown}' instead of '$EXPECTED_BUILD'."
    ERRORS=$((ERRORS + 1))
fi

# 2. Check Home page required content
echo "[2/5] Checking Home page key strings..."
if ! grep -qi "B2 First" "$TMP_DIR/home.html"; then
    echo "  [FAIL] Live home missing expected certification string: 'B2 First'"
    ERRORS=$((ERRORS + 1))
else
    echo "  [PASS] 'B2 First' confirmed live on Home."
fi

# 3. Check QuakeGuard page required content
echo "[3/5] Checking QuakeGuard page live content..."
TIMESTAMP=$(date +%s)
if ! curl -sSL -f "${BASE_URL}/projects/quakeguard.html?nocache=${TIMESTAMP}" > "$TMP_DIR/qg.html" 2>/dev/null; then
    echo "  [FAIL] Could not fetch live QuakeGuard page"
    ERRORS=$((ERRORS + 1))
else
    if ! grep -qi "Synthetic benchmark" "$TMP_DIR/qg.html"; then
        echo "  [FAIL] Live QuakeGuard missing expected string: 'Synthetic benchmark'"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [PASS] 'Synthetic benchmark' confirmed live on QuakeGuard."
    fi
fi

# 4. Check for absolute absence of SYSTEM CERTIFIED across all 20 sitemap HTML pages
echo "[4/5] Checking absence of 'SYSTEM CERTIFIED' across all sitemap HTML pages..."
PAGES=$(grep -oE '<loc>https://giovanni-zanotti\.is-a\.dev/[^<]*</loc>' sitemap.xml | sed -E 's/<\/?loc>//g' | grep -v '\.pdf$' || true)

PAGE_FAILURES=0
while read -r url; do
    [ -z "$url" ] && continue
    TIMESTAMP=$(date +%s)
    PAGE_CONTENT=$(curl -sSL -f "${url}?nocache=${TIMESTAMP}" 2>/dev/null || true)
    if echo "$PAGE_CONTENT" | grep -qi "SYSTEM CERTIFIED"; then
        echo "  [FAIL] Prohibited 'SYSTEM CERTIFIED' found at $url"
        PAGE_FAILURES=$((PAGE_FAILURES + 1))
    fi
done <<< "$PAGES"

if [ "$PAGE_FAILURES" -eq 0 ]; then
    echo "  [PASS] 'SYSTEM CERTIFIED' is 100% absent across all sitemap pages."
else
    echo "  [FAIL] Found $PAGE_FAILURES page(s) containing 'SYSTEM CERTIFIED'."
    ERRORS=$((ERRORS + PAGE_FAILURES))
fi

# 5. Check Content-Security-Policy meta tag and HTTP status
echo "[5/5] Checking CSP meta tag and HTTP response status..."
if grep -qi '<meta http-equiv="Content-Security-Policy"' "$TMP_DIR/home.html"; then
    echo "  [PASS] <meta http-equiv=\"Content-Security-Policy\"> is present on live Home."
else
    echo "  [FAIL] <meta http-equiv=\"Content-Security-Policy\"> missing from live Home."
    ERRORS=$((ERRORS + 1))
fi

LIVE_STATUS=$(curl -sI "${BASE_URL}/?nocache=$(date +%s)" 2>/dev/null | head -n 1 || true)
echo "  [INFO] Live HTTP Status: $LIVE_STATUS"

echo "--------------------------------------------------------"
if [ "$ERRORS" -eq 0 ]; then
    echo " [PASS] All post-deploy live checks passed successfully!"
    exit 0
else
    echo " [FAIL] Post-deploy audit failed with $ERRORS error(s)."
    exit 1
fi
