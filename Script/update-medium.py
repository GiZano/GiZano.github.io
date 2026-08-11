#!/usr/bin/env python3
"""Build-time updater for the Medium widget on the homepage.

Fetches the latest article from the Medium RSS feed and inlines its title+link
into index.html so the content is present in the static HTML at page load
(no client-side fetch required).

Idempotent: if the feed is unreachable or a change is not needed, index.html
is left untouched and the script returns success.
"""
import re
import urllib.request
import xml.etree.ElementTree as ET

FEED_URL = "https://medium.com/feed/@gizano"
BLOG_URL = "https://medium.com/@gizano"
FILE = "index.html"


def local(tag):
    return tag.split("}", 1)[-1]


def main():
    try:
        with urllib.request.urlopen(FEED_URL, timeout=30) as resp:
            root = ET.fromstring(resp.read())
    except Exception as exc:  # noqa: BLE001 - keep current content on failure
        print(f"INFO: could not fetch feed ({exc}); keeping current content")
        return

    items = [e for e in root.iter() if local(e.tag) == "item"]
    if not items:
        print("INFO: no items in feed; keeping current content")
        return

    first = items[0]
    title_el = next((c for c in first if local(c.tag) == "title"), None)
    link_el = next((c for c in first if local(c.tag) == "link"), None)
    if title_el is None or not title_el.text or link_el is None or not link_el.text:
        print("INFO: latest item missing title/link; keeping current content")
        return

    title = " ".join(title_el.text.split())
    link = link_el.text.strip() or BLOG_URL

    html = open(FILE, encoding="utf-8").read()
    new_anchor = (
        '<a id="medium-link" href="%s" target="_blank" rel="noopener noreferrer" '
        'class="text-decoration-none fw-bold text-primary fs-5 d-block text-truncate">%s</a>'
        % (link, title.replace("<", "&lt;").replace(">", "&gt;"))
    )

    pattern = re.compile(r'<a id="medium-link"[^>]*>.*?</a>', re.DOTALL)
    if not pattern.search(html):
        print("INFO: medium-link anchor not found; index.html left unchanged")
        return

    updated, n = pattern.subn(new_anchor, html)
    if n == 0:
        print("INFO: nothing to update")
        return

    open(FILE, "w", encoding="utf-8").write(updated)
    print(f"OK: wrote latest article to {FILE}: {title}")


if __name__ == "__main__":
    main()