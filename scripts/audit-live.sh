#!/usr/bin/env bash
# scripts/audit-live.sh - Post-deploy production verification on live domain
set -euo pipefail

BASE_URL="https://giovanni-zanotti.is-a.dev"
TIMESTAMP=$(date +%s)
TMP_DIR=$(mktemp -d)
trap 'rm -rf "$TMP_DIR"' EXIT

ERRORS=0
echo "=== Running Post-Deploy Production Audit ($BASE_URL) ==="

# 1. Check Home page live
echo "[1/4] Checking Home page live..."
if ! curl -sSL -f "${BASE_URL}/?nocache=${TIMESTAMP}" > "$TMP_DIR/home.html"; then
    echo "  [FAIL] Could not fetch live home page from $BASE_URL"
    exit 1
fi

if grep -qi "SYSTEM CERTIFIED" "$TMP_DIR/home.html"; then
    echo "  [FAIL] Live home contains prohibited term: 'SYSTEM CERTIFIED'"
    ERRORS=$((ERRORS + 1))
else
    echo "  [PASS] 'SYSTEM CERTIFIED' absent from Home."
fi

if ! grep -qi "B2 First" "$TMP_DIR/home.html"; then
    echo "  [FAIL] Live home missing expected certification string: 'B2 First'"
    ERRORS=$((ERRORS + 1))
else
    echo "  [PASS] 'B2 First' confirmed live on Home."
fi

# 2. Check QuakeGuard page live
echo "[2/4] Checking QuakeGuard page live..."
if ! curl -sSL -f "${BASE_URL}/projects/quakeguard.html?nocache=${TIMESTAMP}" > "$TMP_DIR/qg.html"; then
    echo "  [FAIL] Could not fetch live QuakeGuard page"
    ERRORS=$((ERRORS + 1))
else
    if grep -qi "SYSTEM CERTIFIED" "$TMP_DIR/qg.html"; then
        echo "  [FAIL] Live QuakeGuard contains prohibited term: 'SYSTEM CERTIFIED'"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [PASS] 'SYSTEM CERTIFIED' absent from QuakeGuard."
    fi

    if ! grep -qi "Synthetic benchmark" "$TMP_DIR/qg.html"; then
        echo "  [FAIL] Live QuakeGuard missing expected string: 'Synthetic benchmark'"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [PASS] 'Synthetic benchmark' confirmed live on QuakeGuard."
    fi
fi

# 3. Check CSS live for absence of overflow hacks
echo "[3/4] Checking live stylesheets for layout integrity..."
if ! curl -sSL -f "${BASE_URL}/Style/globals.css?nocache=${TIMESTAMP}" > "$TMP_DIR/globals.css"; then
    echo "  [FAIL] Could not fetch live globals.css"
    ERRORS=$((ERRORS + 1))
else
    if grep -qE "overflow-x:\s*hidden" "$TMP_DIR/globals.css"; then
        echo "  [FAIL] Live globals.css contains legacy 'overflow-x: hidden' hack"
        ERRORS=$((ERRORS + 1))
    else
        echo "  [PASS] No global overflow-x hacks in live globals.css."
    fi
fi

# 4. Check live HTTP response
echo "[4/4] Checking live security headers..."
LIVE_HEADERS=$(curl -sI "${BASE_URL}/?nocache=${TIMESTAMP}" || true)
echo "  [INFO] HTTP response: $(echo "$LIVE_HEADERS" | head -n 1)"

echo "--------------------------------------------------------"
if [ "$ERRORS" -eq 0 ]; then
    echo " [PASS] All post-deploy live checks passed successfully!"
    exit 0
else
    echo " [FAIL] Post-deploy audit failed with $ERRORS error(s)."
    exit 1
fi
