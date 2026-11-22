/**
 * Dynamic GitHub Contributors fetcher with client-side caching & static fallback.
 * Updates contributor counts and avatar stacks for maintained repositories:
 * - ClimbStack/climbstack-app
 * - GiZano/leetcode-journey-template
 */
(function() {
    'use strict';

    var REPOS = [
        {
            owner: 'ClimbStack',
            repo: 'climbstack-app',
            countElId: 'climbstack-count',
            avatarsElId: 'climbstack-avatars',
            cacheKey: 'gh_contrib_climbstack_v1'
        },
        {
            owner: 'GiZano',
            repo: 'leetcode-journey-template',
            countElId: 'leetcode-count',
            avatarsElId: 'leetcode-avatars',
            cacheKey: 'gh_contrib_leetcode_v1'
        }
    ];

    var CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

    function getCachedData(key) {
        try {
            var raw = sessionStorage.getItem(key);
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
                return parsed.data;
            }
        } catch (e) {
            // sessionStorage disabled or unavailable
        }
        return null;
    }

    function setCachedData(key, data) {
        try {
            sessionStorage.setItem(key, JSON.stringify({
                timestamp: Date.now(),
                data: data
            }));
        } catch (e) {
            // Quota exceeded or private browsing restriction
        }
    }

    function renderContributors(repoConfig, contributors) {
        var countEl = document.getElementById(repoConfig.countElId);
        var avatarsEl = document.getElementById(repoConfig.avatarsElId);
        if (!countEl || !avatarsEl || !Array.isArray(contributors) || contributors.length === 0) return;

        // Filter out bots
        var humanContributors = contributors.filter(function(u) {
            return u && u.login && !u.login.includes('[bot]') && u.type !== 'Bot';
        });

        if (humanContributors.length === 0) return;

        // Update count text
        countEl.textContent = humanContributors.length + ' contributors';

        // Update avatar links
        var html = '';
        humanContributors.forEach(function(u) {
            var isMaintainer = (u.login && u.login.toLowerCase() === 'gizano');
            var title = isMaintainer ? u.login + ' (Maintainer)' : u.login;
            var avatarUrl = u.avatar_url
                ? (u.avatar_url + (u.avatar_url.indexOf('?') >= 0 ? '&' : '?') + 'size=48')
                : 'https://github.com/' + u.login + '.png?size=48';

            html += '<a href="' + (u.html_url || ('https://github.com/' + u.login)) + '" target="_blank" rel="noopener noreferrer" class="contributor-avatar-link" title="' + title + '" aria-label="' + title + '">' +
                    '<img src="' + avatarUrl + '" alt="' + u.login + '" class="contributor-avatar" width="28" height="28" loading="lazy">' +
                    '</a>';
        });

        avatarsEl.innerHTML = html;
    }

    function fetchRepoContributors(repoConfig) {
        var cached = getCachedData(repoConfig.cacheKey);
        if (cached) {
            renderContributors(repoConfig, cached);
            return;
        }

        var url = 'https://api.github.com/repos/' + repoConfig.owner + '/' + repoConfig.repo + '/contributors?per_page=30';
        fetch(url, { headers: { 'Accept': 'application/vnd.github.v3+json' } })
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function(data) {
                if (Array.isArray(data)) {
                    setCachedData(repoConfig.cacheKey, data);
                    renderContributors(repoConfig, data);
                }
            })
            .catch(function() {
                // Silently fallback to static pre-rendered HTML on rate limit or offline
            });
    }

    function init() {
        REPOS.forEach(fetchRepoContributors);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
