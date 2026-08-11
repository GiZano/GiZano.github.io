# TODO — GiZano.github.io

Everything that is still missing / pending.

> **Stato: quasi chiuso.** Restano solo task manuali (QA browser + Lighthouse).
> Completate di recente: migrazione `Media/` → `assets/` (kebab-case, zero riferimenti residui), PDF Bocconi aggiunto (`assets/home/finals-math.pdf`), rimozione `Script/quakeguard-i18n.js`, aggiornamento README + questo file.

## 8. Sicurezza — mitigazioni header (GitHub Pages)
- [x] `Referrer-Policy` via `<meta name="referrer" content="strict-origin-when-cross-origin">` su **18 pagine live** (10 principali + 8 app React)
- [x] CSP via `<meta http-equiv="Content-Security-Policy">`:
  - hardening delle 10 CSP esistenti con `object-src 'none'; base-uri 'self'`
  - fix bug esistenti: `;;` in web-presentations/telegram-bot/burrows-wheeler, `;` spurio in curious-traveler
  - aggiunta CSP `default-src 'self'` + referrer alle 8 app React `Projects/*presentation` e `be-more` (war-poets include Google Fonts)
- [x] Verifica: 1 CSP + 1 referrer per pagina, tag balance OK, nessun `;;` residuo
- [ ] **Limite piattaforma**: X-Frame-Options, HSTS, X-Content-Type-Options, Permissions-Policy e CSP `frame-ancestors` non sono impostabili su GitHub Pages (niente `_headers`/netlify.toml/vercel.json). Fix completo = solo migrazione host (Cloudflare Pages/Netlify/Vercel)
- [ ] Gli `index.html` delle app React sono build compilati: il fix va riapplicato ad ogni rebuild del sorgente

## 1. Footer social icons (pulizia parziale — completare)
- [x] index.html — rimossa icona **LeetCode** dal contatto
- [x] Projects/web-presentations.html — rimossa icona **LeetCode** dal footer
- [x] Rimosso asset orfano `Media/home/leetcode.svg` (ora `assets/home/`)
- [X] Nota: Credly e Kaggle erano già stati rimossi da tutti i footer; le URL nei blocchi JSON-LD `sameAs` sono state **volutamente mantenute** (SEO). Se si vuole rimuoverle anche da lì, aggiornare i 5 blocchi `application/ld+json` su index + le 8 pagine.

## 2. i18n EN/IT — dict
- [x] `Script/i18n/web-presentations.js` (38 chiavi) — creato, risolve il 404 della pagina
- [x] `Script/i18n/burrows-wheeler.js` (45 chiavi) — creato (+ stringa demo, chiave `demo_intro`)
- [x] `Script/i18n/private-chat.js` (40 chiavi) — creato (+ stringa protocollo, chiave `proto_intro`)
- [x] Script + pulsante `data-i18n-toggle` aggiunti a **burrows-wheeler.html** e **private-chat.html**
- [x] Traduzioni IT corrette in `curious-traveler.js` e `telegram-bot.js` (refusi/errori corretti)
- [x] Fix chiave `real_ttl` in `Script/i18n/bench.js` (blocco it)
- [x] Fix icona `nav_home` (`fab fa-arrow` → `fas fa-arrow-left`) in HTML + dict
- [x] `Script/quakeguard-i18n.js` — rimosso; `Script/i18n.js` espone `window.QuakeGuardI18n` per i demo interattivi
- [~] `Projects/be-more/` — app React **compilata** (niente i18n): il **sorgente non è più disponibile**, quindi il rebuild/re-i18n è definitivamente fuori scope

## 3. Verify i18n (dopo aver creato i dict)
- [x] `node -c Script/i18n/*.js` — validata sintassi
- [x] Controllo bilanciamento tag negli HTML annotati (tag-balance check)
- [x] Copertura chiavi: ogni `data-i18n` presente nell'HTML deve esistere sia in `en` che in `it`
  - aggiunte chiavi mancanti a `quakeguard.js` (`res_card_title`, `res_pool_t`, `road_1/11/12/13/20/21` e relative `label`)
- [ ] Check manuale: toggle IT → EN funziona su ogni pagina, `<title>` sincronizzato, `placeholder` via `data-i18n-attr` (QA manuale in browser — non automatizzato)

## 4. Cleanup minori
- [x] Dict `Script/i18n/index.js`: rimosse chiavi inutilizzate (`medium_badge`, `cert_aws_org`, `cert_hub_org`)
- [x] `fab fa-arrow` (non valida) sostituito con `fa-arrow-left` in nav_home (HTML + dict)

## 5. Accessibilità / ottimizzazione — fase D
- [x] Alt delle immagini: sistemati gli `alt` vuoti (era solo l'icona LeetCode rimossa)
- [ ] Lighthouse “after” su index-home, quakeguard, burrows-wheeler e confronto col “before” (manuale — serve run Lighthouse)
- [ ] Rimozione finale lista file + checklist manual QA (manuale)

## 6. Nuove voci checklist (aggiunte su richiesta)
- [X] Custom **404 page** (`404.html`) brandizzata con link a home + progetti
- [X] **Social share**: tag Open Graph (`og:image`) e Twitter Card su tutte le pagine + asset immagine
- [X] **Privacy policy** (`privacy.html`): documenta Google Analytics/cookie, link nel footer
- [X] N/D: FAQ, response-time promise, sticky mobile CTA (escluse su richiesta)

## 7. Wrap-up
- [x] Card **"Finale Nazionale Matematica"** nel portfolio (card "Giochi Matematici Bocconi"— sezione Eccellenza Accademica, chiavi `cert_bocconi`, `cert_bocconi_desc`, `cert_pdf` EN+IT). **PDF presente**: `assets/home/finals-math.pdf`, link da `index.html` a `./assets/home/finals-math.pdf`
- [X] Rigenerare `sitemap.xml` (nuovi file 404/privacy) (automatico da CI/CD)
- [x] Repository recap finale: vedi nota di commit — migrazione `Media/` → `assets/` (kebab-case), dict i18n (≈492 chiavi per lingua su 8 file: bench 40, burrows-wheeler 45, curious-traveler 32/33, index 78, private-chat 40, quakeguard 183, telegram-bot 34, web-presentations 40), 404.html, privacy.html
- [x] Aggiornare README e TODO mark (questo file)

- [x] Cambiare cartella da `Media` a `assets` e rendere tutto linux compliant (kebab-case e no maiuscole) — **migrazione completata**; restano solo i path `Media/` in git history