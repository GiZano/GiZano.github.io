/* QuakeGuard — EN/IT language switch
 * Applies translations to any element carrying [data-i18n] / [data-i18n-raw].
 * Preference: localStorage -> <html lang> -> browser language.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'quakeguard-lang';
    var current;
    var listeners = [];

    var I18N = {
        en: {
            navbar_sections: 'Sections', navbar_demo: 'Live Demo', navbar_mission: 'Mission',
            navbar_architecture: 'Architecture', navbar_resilience: 'Resilience',
            navbar_security: 'Security', navbar_zones: 'Geographic Zones', navbar_roadmap: 'Roadmap',
            navbar_health: 'Project Health', navbar_mentors: 'Mentors', navbar_github: 'GitHub', navbar_home: 'Home',

            hero_sub: 'Electro-Domestic Seismic Alarm System',
            hero_lead: 'A full-stack IoT architecture for real-time detection, analysis and reporting of seismic events. Everyday household appliances — washing machines, TVs, refrigerators — become a distributed earthquake early-warning network that alerts you <strong>before the shaking arrives</strong>. <strong>v1.2.0 AI</strong> generates emergency reports on-premise with Ollama — privacy-first, seismic telemetry never leaves the machine.',
            hero_trigger: 'Trigger an earthquake', hero_github: 'View on GitHub',
            hero_whitepaper: 'Whitepaper', hero_wiki: 'Wiki',

            mission_eyebrow: 'Mission', mission_title: 'Detection for everyone',
            mission_lead: 'We want to make earthquake detection available <strong>all around the world</strong>, with <strong>zero cost</strong> for the people and <strong>low cost</strong> for the enterprises. By embedding miniature IoT sensors inside the objects we already live with, we can grant P-wave detection <em>without anyone even knowing</em> — and give people time to evacuate or reach a safe location before it is too late.',
            stat_sample: 'Edge sampling', stat_mag: 'Magnitude threshold',
            stat_dedup: 'Zone dedup / anti-replay', stat_rate: 'Rate limit per IP',

            demo_eyebrow: 'Live Demo', demo_title: 'Trigger an earthquake',
            demo_sub: 'A faithful, client-only echo of the backend flow: pick one of the 8 geographic zones, set a magnitude >= 4.5 and watch the pipeline run from edge to mobile alert + AI report.',
            demo_notice: 'This is a <strong>client-side simulation</strong> — everything runs in your browser, no real request is sent. Try it below.',
            demo_zone: 'Geographic zone', demo_mag: 'Estimated magnitude',
            demo_mag_hint: 'M >= 4.5 triggers an alert', demo_msg: 'Message',
            demo_msg_ph: 'Simulated Critical Event', demo_trigger: 'Trigger Earthquake',
            demo_historic: 'Historically the backend bypasses the IoT pipeline and pushes straight to the Redis <code>quake_alerts</code> channel — the mobile app vibrates and fires a push notification within milliseconds.',
            demo_console_heading: 'Ingestion → Alert pipeline',
            demo_console_ready: 'Ready — select a zone and trigger an earthquake to watch the pipeline.',
            demo_feed_heading: 'Recent critical events (last 10)', demo_ai_heading: 'AI Emergency Report',

            arch_eyebrow: 'From vibration to alert', arch_title: 'System Architecture',
            arch_iot: 'IoT Edge Sensors',
            arch_iot_p: 'ESP32-C3 (RISC-V) + ADXL345 accelerometer. Runs a FreeRTOS DSP pipeline with ring-buffer STA/LTA and ECDSA signing on every payload.',
            arch_api: 'FastAPI Cloud',
            arch_api_p: 'Fully async Python 3.11 gateway. Sliding-window rate limiting, API-key auth, ECDSA verification and anti-replay.',
            arch_redis: 'Redis Queue + Pub/Sub',
            arch_redis_p: 'Decouples ingestion from processing. Queue offloading, 60 s per-zone dedup locks, a Dead Letter Queue on failure, plus a dedicated <code>ai_report_queue</code> for <code>ai_report_worker.py</code> decoupled from the alert engine.',
            arch_mqtt: 'MQTT Data Plane',
            arch_mqtt_p: 'HiveMQ Cloud broker over TLS. A dedicated bridge microservice forwards telemetry to the secure HTTP pipeline.',
            arch_pg: 'PostgreSQL + PostGIS',
            arch_pg_p: 'Spatial persistence. Sensors assigned to the smallest containing macro-region via <code>ST_Contains</code>.',
            arch_app: 'React Native App',
            arch_app_p: 'Three-tab app (Monitor, Sensor Map, Settings). WebSocket alerts with SOS haptics &amp; push, live seismograph, offline mode, last-10 alert history, plus the AI Report UI: latest-alert banner, summary feed cards and an "AI Report Unavailable" badge on FAILED.',

            pipe_1_t: 'Detect', pipe_1_d: 'ADXL345 at 100 Hz → HPF removes gravity → STA/LTA ratio &gt; 1.8 flags an event.',
            pipe_2_t: 'Sign', pipe_2_d: 'Firmware signs the payload with ECDSA NIST P-256 — the private key never leaves the device NVS.',
            pipe_3_t: 'Publish', pipe_3_d: 'MQTT publish to <code>quakeguard/telemetry</code> on HiveMQ Cloud (TLS, port 8883).',
            pipe_4_t: 'Verify', pipe_4_d: 'Bridge → <code>POST /readings/</code>. API key, sensor status, anti-replay (60 s) and signature are all validated.',
            pipe_5_t: 'Queue', pipe_5_d: 'Rate limit (50 req/s per IP) passes → event pushed to the Redis list; the API replies <code>202</code> instantly.',
            pipe_6_t: 'Process', pipe_6_d: 'Worker estimates <code>M = log10(PGA × 1.6) + 3.0</code>; if M ≥ 4.5 an Alert is triggered.',
            pipe_7_t: 'Persist &amp; dedup', pipe_7_d: 'Atomically saved to PostgreSQL + PostGIS; a 60 s Redis cooldown per zone prevents alert storms (outbox pattern).',
            pipe_8_t: 'Alert', pipe_8_d: 'WebSocket broadcast → mobile SOS haptic vibration + high-priority push notification, sub-second delivery.',
            pipe_9_t: 'AI Report', pipe_9_d: '<code>ai_report_queue</code> in Redis → worker → Ollama generates the emergency report on-premise; persisted and pushed on the <code>ai_reports</code> WebSocket channel.',

            dp_1: 'Reading captured at <b>100 Hz</b> (ADXL345 ±16G)',
            dp_2: '<b>STA/LTA = 2.11 &gt; 1.8</b> → seismic event',
            dp_3: 'Payload signed with <b>ECDSA NIST P-256</b>',
            dp_4: 'MQTT publish → <b>quakeguard/telemetry</b> (HiveMQ TLS)',
            dp_5: 'Bridge → <b>POST /readings/</b> → signature &amp; replay verified',
            dp_6: 'Rate limit OK → <b>Redis queue</b> (202 Accepted)',
            dp_7: 'Worker: <b>Magnitude estimated</b> (M = log10(PGA × 1.6) + 3.0)',
            dp_8: 'Zone cooldown acquired (<b>60s dedup outbox</b>)',
            dp_9: 'PostGIS zone assign → <b>WebSocket broadcast</b>',
            dp_10: 'Mobile: <b>SOS haptic</b> + push notification',
            dp_11: 'AI Report: <b>ai_report_queue</b> → Ollama → report on <b>ai_reports</b> WS channel',

            res_eyebrow: 'Built for the crowd', res_title: 'The Thundering Herd',
            res_lead1: 'Earthquakes do not knock on one door. When hundreds of sensors in the same zone detect the same event at once, the backend is hit by a <strong>massive synchronous traffic spike</strong>.',
            res_lead2: 'QuakeGuard is engineered for exactly that moment: ingestion is decoupled from processing, requests return <code>202</code> in milliseconds, connection pooling absorbs the load, and a per-zone Redis cooldown fires <strong>one clean alert</strong> — not a storm of duplicates.',
            res_queue_t: 'Producer-consumer queue', res_queue_p: 'ingestion never waits on the database; events offload to Redis instantly.',
            res_rate_p: '50 req/s per IP, backs off buggy nodes early.',
            res_pool_p: 'Aggressive SQLAlchemy pool for high concurrency.',
            res_cooldown_t: '60s zone cooldown', res_cooldown_p: 'Only the winning worker publishes the Alert (outbox pattern).',

            sec_eyebrow: 'Zero-Trust Edge', sec_title: 'Cryptographic Security',
            sec_lead: 'Data integrity is paramount in an emergency system. Every telemetry packet is <strong>cryptographically secured end-to-end</strong> against spoofing, replay and tampering.',
            sec_gates_title: 'The 4 validation gates',
            sec_gate_key_t: 'API key', sec_gate_key_p: 'Constant-time comparison to resist timing attacks.',
            sec_gate_status_t: 'Sensor status', sec_gate_status_p: 'Confirms the sensor exists and is active.',
            sec_gate_replay_t: 'Anti-replay', sec_gate_replay_p: 'Timestamps older than 60 s are rejected with <code>403</code>.',
            sec_gate_sig_t: 'ECDSA signature', sec_gate_sig_p: 'Payload verified against the device public key (DER and r||s).',
            sec_identity_title: 'Identity & threat coverage',
            sec_identity_p: 'Each ESP32-C3 generates its own <strong>NIST P-256 ECDSA</strong> keypair; the private key is sealed and <strong>never leaves the device</strong>. The public key becomes the commitment identity during <code>/devices/register</code>.',
            sec_mitm: 'MitM protected', sec_spoof: 'Spoofing blocked', sec_replay: 'Replay blocked',
            sec_brute: 'Brute force limited', sec_unauth: 'Unauthorized access blocked (fail-fast)',

            zones_eyebrow: 'Spatial intelligence', zones_title: 'Geographic Zones',
            zones_lead: '8 global regions are pre-seeded: sensors are auto-assigned to the smallest containing polygon with an <strong>Unknown Region</strong> fallback.',
            zones_unknown_sub: 'Fallback for unmapped coordinates',
            zone_1: 'Italy - North', zone_2: 'Italy - Center', zone_3: 'Italy - South & Islands',
            zone_4: 'Western Europe', zone_5: 'North America', zone_6: 'South America',
            zone_7: 'East Asia', zone_8: 'Unknown Region',

            roadmap_eyebrow: 'Where it is going', roadmap: 'Roadmap',

            health_eyebrow: 'Engineering rigor', health_title: 'Project Health',
            health_cd_title: 'CI/CD', health_cd_p: 'Five automated pipelines gate every change:',
            health_stress_title: 'Stress test',
            health_stress_p: 'Validates the full ingestion pipeline against a simulated massive event.',
            health_stress_cert: 'SYSTEM CERTIFIED',
            health_docs_title: 'Deep documentation',
            health_docs_p: 'A Typst-compiled whitepaper walks through architecture, hardware, security, backend, mobile and deployment.',
            health_docs_os: 'Open source under <strong>AGPL-3.0</strong>, with a DOI, contributing guide and security policy.',
            health_docs_read: 'Read the whitepaper', health_docs_star: 'Star on GitHub',

            exp_eyebrow: 'See it in action', exp_title: 'The experience',
            exp_note: 'The demo video is currently available only in Italian.',

            contact_title: 'Contribute or collaborate',
            contact_p: 'QuakeGuard is open source and community-driven. Ideas, issues and pull requests are always welcome.',
            contact_open: 'Open the repository', contact_email: 'Email me',
            footer_ttl: 'Get in touch', footer_email: 'Email Me'
        },
        it: {
            navbar_sections: 'Sezioni', navbar_demo: 'Demo', navbar_mission: 'Missione',
            navbar_architecture: 'Architettura', navbar_resilience: 'Resilienza',
            navbar_security: 'Sicurezza', navbar_zones: 'Zone Geografiche', navbar_roadmap: 'Roadmap',
            navbar_health: 'Stato del progetto', navbar_mentors: 'Mentor', navbar_github: 'GitHub', navbar_home: 'Home',

            hero_sub: 'Sistema di allarme sismico elettro-domestico',
            hero_lead: 'Un\u2019architettura IoT full-stack per la rilevazione, l\u2019analisi e il reporting in tempo reale di eventi sismici. Gli elettrodomestici di tutti i giorni — lavatrici, TV, frigoriferi — diventano una rete distribuita di early warning che ti avvisa <strong>prima dell\u2019arrivo della scossa</strong>. <strong>v1.2.0 AI</strong> genera report di emergenza on-premise con Ollama — privacy-first, la telemetria non lascia mai la macchina.',
            hero_trigger: 'Genera un terremoto', hero_github: 'Vedi su GitHub',
            hero_whitepaper: 'Whitepaper', hero_wiki: 'Wiki',

            mission_eyebrow: 'Missione', mission_title: 'Rilevazione per tutti',
            mission_lead: 'Vogliamo rendere la rilevazione dei terremoti disponibile <strong>in tutto il mondo</strong>, con <strong>costo zero</strong> per le persone e <strong>costo contenuto</strong> per le aziende. Grazie ai mini-sensori IoT integrati negli oggetti di uso quotidiano possiamo garantire la rilevazione delle onde P <em>senza che nessuno se ne accorga</em>, e dare alle persone il tempo di evacuare o mettersi in salvo prima che sia troppo tardi.',
            stat_sample: 'Campionamento edge', stat_mag: 'Soglia di magnitudo',
            stat_dedup: 'Dedup zona / anti-replay', stat_rate: 'Limite richieste per IP',

            demo_eyebrow: 'Live Demo', demo_title: 'Genera un terremoto',
            demo_sub: 'Un eco fedele, solo client-side, del flusso del backend: scegli una delle 8 zone geografiche, imposta una magnitudo e guarda la pipeline scorrere dall\u2019edge fino all\u2019allerta mobile + report AI.',
            demo_notice: 'Questa è una <strong>simulazione lato client</strong>: tutto avviene nel tuo browser, nessuna richiesta viene inviata. Provala qui sotto.',
            demo_zone: 'Zona geografica', demo_mag: 'Magnitudo stimata', demo_mag_hint: 'M >= 4.5 attiva un allerta',
            demo_msg: 'Messaggio', demo_msg_ph: 'Evento critico simulato', demo_trigger: 'Genera Terremoto',
            demo_historic: 'Storicamente il backend bypassa la pipeline IoT e pubblica direttamente sul canale Redis <code>quake_alerts</code>: l\u2019app mobile vibra e invia una notifica push in pochi millisecondi.',
            demo_console_heading: 'Ingestione \u2192 pipeline di allerta',
            demo_console_ready: 'Pronto: seleziona una zona e genera un terremoto per vedere la pipeline.',
            demo_feed_heading: 'Eventi critici recenti (ultimi 10)', demo_ai_heading: 'Report AI di emergenza',

            arch_eyebrow: 'Dalla vibrazione all\u2019allerta', arch_title: 'Architettura del sistema',
            arch_iot: 'Sensori IoT Edge',
            arch_iot_p: 'ESP32-C3 (RISC-V) + accelerometro ADXL345. Pipeline DSP FreeRTOS con STA/LTA a ring-buffer e firma ECDSA su ogni payload.',
            arch_api: 'FastAPI Cloud',
            arch_api_p: 'Gateway asincrono Python 3.11 con rate limiting a finestra scorrevole, autenticazione con API key, verifica ECDSA e anti-replay.',
            arch_redis: 'Redis Queue + Pub/Sub',
            arch_redis_p: 'Disaccoppia l\u2019ingestione dall\u2019elaborazione, con offloading della coda, lock di dedup per zona di 60s, Dead Letter Queue sui guasti e una <code>ai_report_queue</code> dedicata per <code>ai_report_worker.py</code>, disaccoppiato dal motore degli alert.',
            arch_mqtt: 'Data plane MQTT',
            arch_mqtt_p: 'Broker HiveMQ Cloud su TLS. Un bridge dedicato inoltra la telemetria alla pipeline HTTP sicura.',
            arch_pg: 'PostgreSQL + PostGIS',
            arch_pg_p: 'Persistenza spaziale: i sensori vengono assegnati alla più piccola macro-regione contenente via <code>ST_Contains</code>.',
            arch_app: 'App React Native',
            arch_app_p: 'App a tre tab (Monitoraggio, Mappa sensori, Impostazioni). Alert WebSocket con vibrazione SOS e push, sismografo live, modalità offline, cronologia degli ultimi 10 eventi, più la nuova UI dei Report AI: banner per l\u2019ultima allerta, card di riepilogo nel feed e badge "AI Report Unavailable" su FAILED.',

            pipe_1_t: 'Rileva', pipe_1_d: 'ADXL345 a 100 Hz → HPF elimina la gravità → la soglia STA/LTA &gt; 1.8 segnala un evento.',
            pipe_2_t: 'Firma', pipe_2_d: 'Il firmware firma il payload con ECDSA NIST P-256 — la chiave privata non lascia mai la NVS del dispositivo.',
            pipe_3_t: 'Pubblica', pipe_3_d: 'Pubblicazione MQTT su <code>quakeguard/telemetry</code> su HiveMQ Cloud (TLS, porta 8883).',
            pipe_4_t: 'Verifica', pipe_4_d: 'Bridge → <code>POST /readings/</code>. API key, stato del sensore, anti-replay (60 s) e firma vengono tutti validati.',
            pipe_5_t: 'Coda', pipe_5_d: 'Il rate limit (50 req/s per IP) passa → l\u2019evento viene accodato su Redis; l\u2019API risponde <code>202</code> istantaneamente.',
            pipe_6_t: 'Elabora', pipe_6_d: 'Il worker stima <code>M = log10(PGA × 1.6) + 3.0</code>; se M ≥ 4,5 viene attivato un Alert.',
            pipe_7_t: 'Salva &amp; dedup', pipe_7_d: 'Salvato atomicamente su PostgreSQL + PostGIS; un cooldown Redis di 60 s per zona previene le tempeste di alert (pattern outbox).',
            pipe_8_t: 'Allerta', pipe_8_d: 'Broadcast WebSocket → vibrazione aptica SOS + notifica push ad alta priorità sul mobile, consegna in meno di un secondo.',
            pipe_9_t: 'Report AI', pipe_9_d: '<code>ai_report_queue</code> su Redis → worker → Ollama genera il report di emergenza on-premise; persistito e inviato sul canale WebSocket <code>ai_reports</code>.',

            dp_1: 'Lettura catturata a <b>100 Hz</b> (ADXL345 ±16G)',
            dp_2: '<b>STA/LTA = 2.11 &gt; 1.8</b> → evento sismico',
            dp_3: 'Payload firmato con <b>ECDSA NIST P-256</b>',
            dp_4: 'Pubblicazione MQTT → <b>quakeguard/telemetry</b> (HiveMQ TLS)',
            dp_5: 'Bridge → <b>POST /readings/</b> → firma &amp; replay verificati',
            dp_6: 'Rate limit OK → <b>coda Redis</b> (202 Accepted)',
            dp_7: 'Worker: <b>Magnitudo stimata</b> (M = log10(PGA × 1.6) + 3.0)',
            dp_8: 'Cooldown zona acquisito (<b>dedup outbox 60s</b>)',
            dp_9: 'Assegnazione zona PostGIS → <b>broadcast WebSocket</b>',
            dp_10: 'Mobile: <b>vibrazione SOS</b> + notifica push',
            dp_11: 'Report AI: <b>ai_report_queue</b> → Ollama → report sul canale WS <b>ai_reports</b>',

            res_eyebrow: 'Pensato per la folla', res_title: 'La Mandria Tonante',
            res_lead1: 'I terremoti non bussano a una sola porta. Quando centinaia di sensori nella stessa zona rilevano lo stesso evento nello stesso istante, il backend viene colpito da un <strong>picco di traffico massiccio e sincrono</strong>.',
            res_lead2: 'QuakeGuard è progettato per quel momento: l\u2019ingestione è disaccoppiata dall\u2019elaborazione, le richieste rispondono <code>202</code> in millisecondi, il connection pooling assorbe il carico e un cooldown Redis per zona garantisce <strong>una sola allerta pulita</strong> — non una tempesta di duplicati.',
            res_queue_t: 'Coda producer-consumer', res_queue_p: 'L\u2019ingestione non aspetta mai il database: gli eventi scaricano su Redis istantaneamente.',
            res_rate_t: 'Rate limit control-plane', res_rate_p: '50 req/s per IP, blocca presto i nodi difettosi o malevoli.',
            res_pool_t: 'Connection pooling', res_pool_p: 'Pool SQLAlchemy aggressivo per alta concorrenza.',
            res_cooldown_t: 'Cooldown zona 60s', res_cooldown_p: 'Solo il worker vincitore pubblica l\u2019Alert (pattern outbox).',

            sec_eyebrow: 'Zero-Trust Edge', sec_title: 'Sicurezza Crittografica',
            sec_lead: 'L\u2019integrità dei dati è fondamentale in un sistema di emergenza. Ogni pacchetto di telemetria è <strong>protetto crittograficamente end-to-end</strong> contro spoofing, replay e manomissione.',
            sec_gates_title: 'Le 4 porte di validazione',
            sec_gate_key_t: 'API key', sec_gate_key_p: 'Confronto a tempo costante per resistere agli attacchi temporali.',
            sec_gate_status_t: 'Stato del sensore', sec_gate_status_p: 'Verifica che il sensore esista e sia attivo.',
            sec_gate_replay_t: 'Anti-replay', sec_gate_replay_p: 'Timestamp più vecchi di 60s respinti con <code>403</code>.',
            sec_gate_sig_t: 'Firma ECDSA', sec_gate_sig_p: 'Payload verificato contro la chiave pubblica del dispositivo (DER e r||s).',
            sec_identity_title: 'Identità e copertura delle minacce',
            sec_identity_p: 'Ogni ESP32-C3 genera la propria coppia di chiavi <strong>NIST P-256 ECDSA</strong>; la chiave privata è sigillata e <strong>non lascia mai il dispositivo</strong>. La chiave pubblica diventa l\u2019identità inamovibile durante <code>/devices/register</code>.',
            sec_mitm: 'MitM protetto', sec_spoof: 'Spoofing bloccato', sec_replay: 'Replay bloccato',
            sec_brute: 'Brute force limitata', sec_unauth: 'Accesso non autorizzato bloccato (fail-fast)',

            zones_eyebrow: 'Intelligenza spaziale', zones_title: 'Zone Geografiche',
            zones_lead: '8 regioni globali pre-caricate: i sensori vengono assegnati automaticamente al poligono contenente più piccolo tramite PostGIS, con fallback <strong>Unknown Region</strong> per le coordinate non mappate.',
            zones_unknown_sub: 'Fallback per coordinate non mappate',
            zone_1: 'Italia - Nord', zone_2: 'Italia - Centro', zone_3: 'Italia - Sud & Isole',
            zone_4: 'Europa Occidentale', zone_5: 'Nord America', zone_6: 'Sud America',
            zone_7: 'Asia Orientale', zone_8: 'Regione Sconosciuta',

            roadmap_eyebrow: 'Dove sta andando', roadmap: 'Roadmap',
            health_eyebrow: 'Rigore ingegneristico', health_title: 'Stato del progetto',
            health_cd_title: 'CI/CD', health_cd_p: 'Cinque pipeline automatiche verificano ogni modifica:',
            health_stress_title: 'Stress test',
            health_stress_p: 'Valida l\u2019intera pipeline di ingestione contro un evento massivo simulato.',
            health_stress_cert: 'SISTEMA CERTIFICATO',
            health_docs_title: 'Documentazione approfondita',
            health_docs_p: 'Un whitepaper compilato con Typst illustra architettura, hardware, sicurezza, backend, mobile e deployment.',
            health_docs_os: 'Open source sotto <strong>AGPL-3.0</strong>, con DOI, guida ai contributi e security policy.',
            health_docs_read: 'Leggi il whitepaper', health_docs_star: 'Metti una stella su GitHub',

            exp_eyebrow: 'Vedilo in azione', exp_title: 'L\u2019esperienza',
            exp_note: 'Il video demo è attualmente disponibile solo in italiano.',

            contact_title: 'Contribuisci o collabora',
            contact_p: 'QuakeGuard è open source e guidato dalla community: idee, segnalazioni e pull request sono sempre benvenute.',
            contact_open: 'Apri il repository', contact_email: 'Scrivimi',
            footer_ttl: 'Contattaci', footer_email: 'Email'
        }
    };

    function applyAll() {
        var dict = I18N[current] || {};
        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            var key = nodes[i].getAttribute('data-i18n');
            if (dict[key] != null) {
                var node = nodes[i];
                if (node.hasAttribute('data-i18n-raw')) node.textContent = dict[key];
                else node.innerHTML = dict[key];
            }
        }
        var attrs = document.querySelectorAll('[data-i18n-attr]');
        for (var j = 0; j < attrs.length; j++) {
            var aKey = attrs[j].getAttribute('data-i18n-attr');
            if (dict[aKey] != null) attrs[j].setAttribute('placeholder', dict[aKey]);
        }
    }

    function paintButton(btn) {
        btn.textContent = current === 'en' ? 'IT' : 'EN';
        btn.setAttribute('aria-label', current === 'en' ? 'Passa all\u2019italiano' : 'Switch to English');
        btn.setAttribute('title', current === 'en' ? 'Italiano' : 'English');
    }

    function initButton() {
        var btn = document.querySelector('[data-i18n-toggle]');
        if (!btn) return;
        btn.addEventListener('click', function () {
            setLang(current === 'en' ? 'it' : 'en', true);
            paint();
        });
        paint();
    }

    function paint() {
        var btn = document.querySelector('[data-i18n-toggle]');
        if (btn) paintButton(btn);
    }

    function setLang(lang, save) {
        current = I18N[lang] ? lang : 'en';
        if (save) { try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {} }
        document.documentElement.setAttribute('lang', current);
        applyAll();
        for (var i = 0; i < listeners.length; i++) listeners[i](current);
    }

    function boot() {
        var saved = null;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
        var start = saved || (navigator.language || 'en').slice(0, 2).toLowerCase();
        current = I18N[start] ? start : 'en';
        document.documentElement.setAttribute('lang', current);
        applyAll();
        initButton();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }

    window.QuakeGuardI18n = {
        get lang() { return current; },
        t: function (k) {
            var d = I18N[current];
            return (d && d[k] != null) ? d[k] : k;
        }
    };
})();