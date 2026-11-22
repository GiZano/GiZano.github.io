/**
 * Privacy-First Cookie Consent & Analytics Loader
 * Compliant with GDPR (Art. 6 & 7) & Italian Garante Privacy (Provv. 231/2021)
 *
 * Rule: NO Google Analytics script is loaded or executed before explicit consent (default: DENIED).
 * Closing or declining registers refusal; only explicit 'Accept' initializes GA4.
 */
(function() {
  'use strict';

  var GA_MEASUREMENT_ID = 'G-5JCG2NQS1Y';
  var STORAGE_KEY = 'gizano_analytics_consent';

  function isItalian() {
    var lang = (localStorage.getItem('gizano-site-lang') || document.documentElement.lang || navigator.language || 'en').toLowerCase();
    return lang.startsWith('it');
  }

  function loadGoogleAnalytics() {
    if (window._ga_loaded) return;
    window._ga_loaded = true;

    // Load gtag.js asynchronously
    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    function gtag(){ dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      cookie_flags: 'SameSite=None;Secure',
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      restricted_data_processing: true
    });
  }

  function getBannerHTML(it) {
    var text = it
      ? "Questo sito utilizza Google Analytics 4 per statistiche aggregate anonime. I cookie analitici sono <strong>disabilitati per impostazione predefinita</strong> e si attivano solo previo tuo consenso esplicito."
      : "This site uses Google Analytics 4 for anonymous aggregate statistics. Analytics cookies are <strong>disabled by default</strong> and only load if you explicitly consent.";
    
    var privacyText = it ? "Informativa Privacy" : "Privacy Policy";
    var declineText = it ? "Rifiuta" : "Decline";
    var acceptText = it ? "Accetta" : "Accept";
    var closeAria = it ? "Chiudi e rifiuta cookie" : "Close and decline cookies";

    // Determine path to privacy page
    var privacyPath = window.location.pathname.includes('/projects/') ? '../privacy.html' : './privacy.html';

    return (
      '<div id="cookie-consent-banner" role="dialog" aria-live="polite" aria-label="Cookie Consent" ' +
      'style="position:fixed;bottom:20px;left:50%;transform:translateX(-50%);max-width:680px;width:calc(100% - 32px);' +
      'background:#ffffff;color:#2c3e50;padding:20px 24px;border-radius:12px;box-shadow:0 12px 36px rgba(0,0,0,0.22);' +
      'border:1px solid #e2e8f0;z-index:99999;font-family:Inter,system-ui,sans-serif;font-size:0.92rem;line-height:1.5;">' +
        '<button id="btn-cookie-close" type="button" aria-label="' + closeAria + '" style="position:absolute;top:10px;right:14px;background:none;border:none;font-size:1.4rem;line-height:1;color:#718096;cursor:pointer;padding:4px 8px;">&times;</button>' +
        '<div style="display:flex;flex-direction:column;gap:14px;padding-right:20px;">' +
          '<div style="color:#4a5568;">' + text + ' <a href="' + privacyPath + '" style="color:#005377;text-decoration:underline;font-weight:600;">' + privacyText + '</a>.</div>' +
          '<div style="display:flex;justify-content:flex-end;gap:12px;flex-wrap:wrap;">' +
            '<button id="btn-cookie-decline" type="button" class="btn btn-secondary btn-sm" aria-label="' + declineText + ' cookies" style="padding:8px 20px;border-radius:6px;font-weight:600;font-size:0.88rem;background:#4a5568;color:#ffffff;border:1px solid #4a5568;">' + declineText + '</button>' +
            '<button id="btn-cookie-accept" type="button" class="btn btn-primary btn-sm" aria-label="' + acceptText + ' cookies" style="padding:8px 20px;border-radius:6px;font-weight:600;font-size:0.88rem;background:#005377;color:#ffffff;border:1px solid #005377;">' + acceptText + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );
  }

  function showBanner() {
    if (document.getElementById('cookie-consent-banner')) return;
    var div = document.createElement('div');
    div.innerHTML = getBannerHTML(isItalian());
    document.body.appendChild(div);

    var btnAccept = document.getElementById('btn-cookie-accept');
    var btnDecline = document.getElementById('btn-cookie-decline');
    var btnClose = document.getElementById('btn-cookie-close');

    if (btnAccept) {
      btnAccept.addEventListener('click', function() {
        try { localStorage.setItem(STORAGE_KEY, 'granted'); } catch(e){}
        removeBanner();
        loadGoogleAnalytics();
      });
    }

    if (btnDecline) {
      btnDecline.addEventListener('click', function() {
        try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch(e){}
        removeBanner();
      });
    }

    if (btnClose) {
      btnClose.addEventListener('click', function() {
        // Closing banner without choosing counts as refusal (denied)
        try { localStorage.setItem(STORAGE_KEY, 'denied'); } catch(e){}
        removeBanner();
      });
    }
  }

  function removeBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner && banner.parentNode) {
      banner.parentNode.removeChild(banner);
    }
  }

  // Public reset method for Privacy Policy page
  window.resetCookieConsent = function() {
    try { localStorage.removeItem(STORAGE_KEY); } catch(e){}
    showBanner();
  };

  // Execution flow
  var consent = null;
  try {
    consent = localStorage.getItem(STORAGE_KEY);
  } catch(e){}

  if (consent === 'granted') {
    // User previously consented: load GA4
    loadGoogleAnalytics();
  } else if (consent === 'denied') {
    // User previously rejected: do nothing
  } else {
    // First visit: NO script loaded by default. Show prior-consent banner.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
