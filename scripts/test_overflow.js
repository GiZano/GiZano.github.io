const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

async function findChrome() {
    const candidates = [
        process.env.CHROME_PATH,
        '/opt/google/chrome/chrome',
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser'
    ].filter(Boolean);

    for (const c of candidates) {
        if (fs.existsSync(c)) return c;
    }
    throw new Error('Chrome/Chromium binary not found.');
}

async function main() {
    const chromePath = await findChrome();
    const chrome = spawn(chromePath, [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--remote-debugging-port=9222'
    ]);

    let stderr = '';
    chrome.stderr?.on('data', d => stderr += d.toString());

    let versionRes = null;
    for (let i = 0; i < 25; i++) {
        try {
            versionRes = await new Promise((resolve, reject) => {
                const req = http.get('http://127.0.0.1:9222/json/version', res => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
                    });
                });
                req.on('error', reject);
                req.setTimeout(1000, () => { req.destroy(); reject(new Error('timeout')); });
            });
            if (versionRes && versionRes.webSocketDebuggerUrl) break;
        } catch (e) {
            await new Promise(r => setTimeout(r, 400));
        }
    }

    if (!versionRes || !versionRes.webSocketDebuggerUrl) {
        console.error('Failed to connect to headless Chrome on port 9222. Stderr:', stderr);
        throw new Error('Chrome DevTools port not ready');
    }

    const ws = new WebSocket(versionRes.webSocketDebuggerUrl);
    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
        }
    };

    await new Promise(resolve => ws.onopen = resolve);

    function send(method, params = {}) {
        const msgId = id++;
        return new Promise((resolve, reject) => {
            pending.set(msgId, { resolve, reject });
            ws.send(JSON.stringify({ id: msgId, method, params }));
        });
    }

    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
        const msgId = id++;
        return new Promise((resolve, reject) => {
            pending.set(msgId, { resolve, reject });
            ws.send(JSON.stringify({ id: msgId, sessionId, method, params }));
        });
    }

    await sendSession('Page.enable');
    await sendSession('DOM.enable');

    const sitemap = fs.readFileSync(path.join(__dirname, '../sitemap.xml'), 'utf8');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map(m => m[1])
        .filter(u => !u.endsWith('.pdf'));

    const pages = locs.map(u => {
        let p = u.replace('https://giovanni-zanotti.is-a.dev/', '');
        if (p === '' || p === '/') return 'index.html';
        if (p.endsWith('/')) return p + 'index.html';
        return p + '.html';
    });

    const widths = [320, 360, 390];
    let totalErrors = 0;
    const results = [];

    for (const page of pages) {
        const fullPath = path.resolve(__dirname, '..', page);
        if (!fs.existsSync(fullPath)) {
            console.error(`[ERROR] File missing: ${fullPath}`);
            totalErrors++;
            continue;
        }

        for (const w of widths) {
            await sendSession('Emulation.setDeviceMetricsOverride', {
                width: w,
                height: 800,
                deviceScaleFactor: 1,
                mobile: true
            });

            await sendSession('Page.navigate', { url: `file://${fullPath}` });
            await new Promise(r => setTimeout(r, 400));

            const check = await sendSession('Runtime.evaluate', {
                expression: `(() => {
                    const overflowing = [...document.querySelectorAll('*')]
                        .filter(e => {
                            // Ignore reveal.js presentation slide container which scales via transform
                            if (e.classList.contains('slides') || e.closest('.reveal')) return false;
                            const r = e.getBoundingClientRect();
                            return r.right > window.innerWidth + 1;
                        })
                        .map(e => ({
                            tag: e.tagName,
                            className: (e.className || '').toString().slice(0, 40),
                            right: Math.round(e.getBoundingClientRect().right)
                        }));

                    return {
                        scrollWidth: document.documentElement.scrollWidth,
                        innerWidth: window.innerWidth,
                        overflowing
                    };
                })()`,
                returnByValue: true
            });

            const res = check.result.value;
            const hasProblem = res.overflowing.length > 0;
            if (hasProblem) {
                totalErrors++;
                console.log(`[FAIL] ${page} @ ${w}px - ${res.overflowing.length} elements overflowing:`, res.overflowing);
            }
        }
    }

    ws.close();
    chrome.kill();

    if (totalErrors === 0) {
        console.log(`[PASS] All ${pages.length} sitemap pages tested at 320/360/390px: ZERO overflow!`);
        process.exit(0);
    } else {
        console.error(`[FAIL] Found ${totalErrors} overflow issue(s) across sitemap pages.`);
        process.exit(1);
    }
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
