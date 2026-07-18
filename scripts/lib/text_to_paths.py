#!/usr/bin/env python3
"""Render a single line of text to SVG <path> data from a (variable) TTF.

Deterministic glyph-outline extraction — no system font matching, so output is
identical on any machine. Used by scripts/generate-og-and-favicons.mjs to place
brand typography (Cormorant Garamond / Montserrat) onto the OG card.

Usage (all output as one JSON object on stdout):
  python3 text_to_paths.py --font <path.ttf> --wght 500 --size 64 \
      --letter-spacing 0 --text "Some line" [--uppercase]

Requires: fonttools  (pip install fonttools)
"""
import argparse, json, sys
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--font", required=True)
    ap.add_argument("--wght", type=float, default=None)
    ap.add_argument("--size", type=float, required=True)
    ap.add_argument("--letter-spacing", type=float, default=0.0)  # px added per glyph
    ap.add_argument("--text", required=True)
    ap.add_argument("--uppercase", action="store_true")
    args = ap.parse_args()

    text = args.text.upper() if args.uppercase else args.text

    f = TTFont(args.font)
    if args.wght is not None and "fvar" in f:
        instantiateVariableFont(f, {"wght": args.wght}, inplace=True)

    upem = f["head"].unitsPerEm
    scale = args.size / upem
    cmap = f.getBestCmap()
    gset = f.getGlyphSet()
    hmtx = f["hmtx"]

    x = 0.0
    parts = []
    for ch in text:
        gname = cmap.get(ord(ch)) or ".notdef"
        pen = SVGPathPen(gset)
        gset[gname].draw(pen)
        d = pen.getCommands()
        if d:
            # y is flipped (font up = svg down); baseline at y=0
            parts.append(
                f'<path transform="translate({x*scale:.3f} 0) '
                f'scale({scale:.5f} {-scale:.5f})" d="{d}"/>'
            )
        x += hmtx[gname][0] + (args.letter_spacing / scale)

    asc = f["hhea"].ascender * scale
    desc = f["hhea"].descender * scale
    capHeight = None
    if "OS/2" in f and getattr(f["OS/2"], "sCapHeight", 0):
        capHeight = f["OS/2"].sCapHeight * scale

    json.dump(
        {
            "paths": "".join(parts),
            "width": x * scale,
            "ascent": asc,
            "descent": desc,
            "capHeight": capHeight,
        },
        sys.stdout,
    )


if __name__ == "__main__":
    main()
