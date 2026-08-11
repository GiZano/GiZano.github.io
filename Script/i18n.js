/* GiZano — site-wide EN/IT language switch.
 * Each page provides its dictionary BEFORE this script via:
 *   <script>window.I18N_DATA = { en: {...}, it: {...} }</script>
 * Priority: URL ?lang=en|it  ->  localStorage 'gizano-site-lang'  ->  browser language.
 * Applies [data-i18n] (innerHTML, or textContent with data-i18n-raw),
 * [data-i18n-attr] (placeholder), syncs <html lang> and the [data-i18n-toggle] button.
 * Exposes window.QuakeGuardI18n so interactive demos can translate strings.
 */
(function () {
    'use strict';

    var STORAGE_KEY = 'gizano-site-lang';
    var DICT = window.I18N_DATA || { en: {}, it: {} };
    var current = 'en';

    function readURLParam() {
        try {
            var q = new URLSearchParams(window.location.search).get('lang');
            if (q === 'en' || q === 'it') return q;
        } catch (e) {}
        return null;
    }

    function readStored() {
        try {
            var s = localStorage.getItem(STORAGE_KEY);
            if (s === 'en' || s === 'it') return s;
        } catch (e) {}
        return null;
    }

    function pickLang() {
        var p = readURLParam();
        if (p) return p;
        var s = readStored();
        if (s) return s;
        return ((navigator.language || 'en').slice(0, 2).toLowerCase() === 'it') ? 'it' : 'en';
    }

    function dict() {
        return DICT[current] || DICT.en || {};
    }

    function applyAll() {
        var d = dict();
        document.documentElement.setAttribute('lang', current);
        if (d.__title) document.title = d.__title;

        var nodes = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < nodes.length; i++) {
            var el = nodes[i];
            var key = el.getAttribute('data-i18n');
            if (d[key] == null) continue;
            if (el.hasAttribute('data-i18n-raw')) el.textContent = d[key];
            else el.innerHTML = d[key];
        }
        var attrs = document.querySelectorAll('[data-i18n-attr]');
        for (var j = 0; j < attrs.length; j++) {
            var a = attrs[j];
            var ak = a.getAttribute('data-i18n-attr');
            if (d[ak] != null) a.setAttribute('placeholder', d[ak]);
        }
    }

    function setLang(lang, persist) {
        if (lang !== 'en' && lang !== 'it') return;
        current = lang;
        if (persist) { try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {} }
        try {
            var u = new URL(window.location.href);
            u.searchParams.set('lang', lang);
            window.history.replaceState(null, '', u.toString());
        } catch (e) {}
        applyAll();
        paintButton();
    }

    function paintButton() {
        var btn = document.querySelector('[data-i18n-toggle]');
        if (!btn) return;
        var en = current === 'en';
        btn.textContent = en ? 'IT' : 'EN';
        btn.setAttribute('aria-label', en ? 'Passa all\u2019italiano' : 'Switch to English');
        btn.setAttribute('title', en ? 'Italiano' : 'English');
    }

    function boot() {
        current = pickLang();
        applyAll();
        var btn = document.querySelector('[data-i18n-toggle]');
        if (btn) {
            paintButton();
            btn.addEventListener('click', function () {
                setLang(current === 'en' ? 'it' : 'en', true);
            });
        }
    }

    // Same API the QuakeGuard interactive demo relies on.
    window.QuakeGuardI18n = {
        get lang() { return current; },
        t: function (key) {
            var d = dict();
            return d[key] != null ? d[key] : key;
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();