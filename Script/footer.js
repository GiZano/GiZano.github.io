/* GiZano — Shared footer component for project pages & privacy.
 * Usage: add <div id="site-footer"></div> before the closing </body>.
 * This script MUST be loaded WITHOUT defer so the footer DOM exists
 * before i18n.js runs on DOMContentLoaded.
 *
 * The privacy-policy link is resolved relative to the page location:
 *   /privacy.html          → ./privacy.html
 *   /projects/bench.html   → ../privacy.html
 */
(function () {
    'use strict';

    /* ── helpers ────────────────────────────────────────────── */
    var currentYear = new Date().getFullYear();

    /** Return relative path to privacy.html from the current page. */
    function privacyHref() {
        var path = window.location.pathname;
        // Pages inside /projects/ need to go up one level
        if (path.indexOf('/projects/') !== -1) return '../privacy.html';
        return './privacy.html';
    }

    /* ── social links (single source of truth) ─────────────── */
    var socials = [
        { id: 'ORCID',    href: 'https://orcid.org/0009-0000-8900-9586',                       icon: 'fa-orcid',    label: 'ORCID Researcher Profile', rel: 'me noopener noreferrer' },
        { id: 'LINKEDIN', href: 'https://www.linkedin.com/in/giovanni-zanotti-it/',             icon: 'fa-linkedin', label: 'LinkedIn Profile' },
        { id: 'GITHUB',   href: 'https://github.com/GiZano',                                   icon: 'fa-github',   label: 'GitHub Profile' },
        { id: 'HASHNODE', href: 'https://gizano.hashnode.dev/',                                icon: 'fa-hashnode', label: 'Hashnode Blog' },
        { id: 'YOUTUBE',  href: 'https://www.youtube.com/channel/UCgjix1Xt4O97c2sFsFN6_fQ',    icon: 'fa-youtube',  label: 'YouTube Channel' },
        { id: 'MASTODON', href: 'https://hachyderm.io/@gizano',                                icon: 'fa-mastodon', label: 'Mastodon Profile', rel: 'me noopener noreferrer' }
    ];

    /* ── build social icons markup ─────────────────────────── */
    function socialLinksHTML() {
        var html = '';
        for (var i = 0; i < socials.length; i++) {
            var s = socials[i];
            var rel = s.rel || 'noopener noreferrer';
            html +=
                '<a target="_blank" href="' + s.href + '" class="text-light social-icon-footer" aria-label="' + s.label + '" rel="' + rel + '">' +
                    '<i class="fab ' + s.icon + ' fa-lg"></i>' +
                '</a>\n';
        }
        return html;
    }

    /* ── full footer HTML ──────────────────────────────────── */
    var footerHTML =
        '<footer class="py-5 bg-dark text-white">' +
            '<div class="container">' +
                '<div class="row align-items-center">' +
                    /* Column 1 — Brand & tagline */
                    '<div class="col-md-4 text-center text-md-start mb-4 mb-md-0">' +
                        '<p class="h5 mb-3 fw-bold">GiZano</p>' +
                        '<p class="text-white-50 small mb-0" data-i18n="footer_tagline">BSc Computer Science Student at UniPi | Specialized in Edge Computing, Cloud Architecture, and IoT.</p>' +
                    '</div>' +
                    /* Column 2 — Email CTA */
                    '<div class="col-md-4 text-center mb-4 mb-md-0">' +
                        '<p class="mb-3 small text-uppercase fw-bold ls-1" data-i18n="footer_ttl">Get in touch</p>' +
                        '<a href="mailto:gizano&#46;dev&#64;gmail&#46;com" class="btn btn-outline-light btn-sm px-4" data-i18n="footer_email">' +
                            '<i class="fas fa-envelope me-2"></i>Email Me' +
                        '</a>' +
                    '</div>' +
                    /* Column 3 — Social icons */
                    '<div class="col-md-4 text-center text-md-end">' +
                        '<div class="social-links d-flex justify-content-center justify-content-md-end align-items-center gap-3 flex-wrap">' +
                            socialLinksHTML() +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<hr class="my-4 border-secondary opacity-25">' +
                /* Copyright bar */
                '<div class="row">' +
                    '<div class="col-12 text-center text-white-50 small">' +
                        '<p class="mb-0">&copy; ' + currentYear + ' Giovanni Zanotti. All rights reserved. ' +
                            '<a href="' + privacyHref() + '" class="text-white-50 text-decoration-underline" rel="noopener noreferrer">Privacy Policy</a>' +
                        '</p>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</footer>';

    /* ── inject ─────────────────────────────────────────────── */
    var target = document.getElementById('site-footer');
    if (target) {
        target.outerHTML = footerHTML;
    }
})();
