#!/usr/bin/env python3
"""Generate a QR code PNG for the linktree page and embed it in README.md.

Reads the custom domain from CNAME, generates a QR code pointing to
https://{domain}/links, saves it to assets/home/linktree-qr.png,
and updates the README with the image.

Requires: pip install qrcode[pil]
"""
import re
from pathlib import Path

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer

CNAME_FILE = "CNAME"
OUTPUT_PNG = "assets/home/linktree-qr.png"
README_FILE = "README.md"

# ── Marker comments used inside the README ──────────────────────
QR_START = "<!-- QR-LINKTREE-START -->"
QR_END = "<!-- QR-LINKTREE-END -->"


def read_domain() -> str:
    """Return the custom domain from the CNAME file."""
    return Path(CNAME_FILE).read_text().strip()


def generate_qr(url: str, path: str) -> None:
    """Generate a styled QR code PNG and write it to *path*."""
    qr = qrcode.QRCode(
        version=None,          # auto-size
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=20,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        fill_color="#2c3e50",
        back_color="#ffffff",
    )

    Path(path).parent.mkdir(parents=True, exist_ok=True)
    img.save(path)
    print(f"OK: QR code saved to {path}  ({url})")


def patch_readme(url: str) -> None:
    """Insert or update the QR code block between the marker comments."""
    readme = Path(README_FILE).read_text(encoding="utf-8")

    qr_block = (
        f"{QR_START}\n"
        f"### 📱 Linktree QR Code\n\n"
        f"Scan to view all my links:\n\n"
        f"<img src=\"{OUTPUT_PNG}\" alt=\"Linktree QR Code\" width=\"200\">\n\n"
        f"**🔗 [{url}]({url})**\n"
        f"{QR_END}"
    )

    pattern = re.compile(
        re.escape(QR_START) + r".*?" + re.escape(QR_END),
        re.DOTALL,
    )

    if pattern.search(readme):
        updated = pattern.sub(qr_block, readme)
    else:
        # Insert before the closing footer div
        anchor = "</div>\n"
        idx = readme.rfind(anchor)
        if idx == -1:
            readme += "\n" + qr_block + "\n"
            updated = readme
        else:
            updated = readme[:idx] + qr_block + "\n\n" + readme[idx:]

    if updated != readme:
        Path(README_FILE).write_text(updated, encoding="utf-8")
        print(f"OK: README.md updated with QR block")
    else:
        print("INFO: README.md already up to date")


def main() -> None:
    domain = read_domain()
    linktree_url = f"https://{domain}/links"
    generate_qr(linktree_url, OUTPUT_PNG)
    patch_readme(linktree_url)


if __name__ == "__main__":
    main()
