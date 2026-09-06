#!/usr/bin/env python3
"""One-shot: finish the she/her correction across the octocam blocks.

The lab settled the pronoun on 2026-08-10. I updated ONE copy (switchNote) and
left six more live for two days -- including a line that INSTRUCTED the reader
to use "they". Facts wait to be contradicted; instructions just get followed.
"""
import io
import re

P = "src/cameras.ts"
s = io.open(P, encoding="utf-8").read()
orig = s

# apostrophes in this file are a mix of ' and U+2019, so normalise the pattern
APOS = "['’]"
SUBS = [
    (r"where he usually IS", "where she usually IS"),
    (r"if he isn" + APOS + r"t here, try", "if she isn’t here, try"),
    (r"you can nearly always find him", "you can nearly always find her"),
    (r"good for catching him at home, bad for seeing him whole",
     "good for catching her at home, bad for seeing her whole"),
    (r"He" + APOS + r"s a guest, not a prisoner", "She’s a guest, not a prisoner"),
    (r"in a jar for him to solve", "in a jar for her to solve"),
    (r"\*\*He changes colour when he" + APOS + r"s excited",
     "**She changes colour when she’s excited"),
    (r"best chance to see him", "best chance to see her"),
    (r"His tankmates are \*\*sea anemones\*\*, which he leaves alone",
     "Her tankmates are **sea anemones**, which she leaves alone"),
    (r"exactly one angle can see him", "exactly one angle can see her"),
    (r"is he out\?", "is she out?"),
    (r"before concluding he" + APOS + r"s hiding", "before concluding she’s hiding"),
    (r"half the time he" + APOS + r"s simply", "half the time she’s simply"),
]

total = 0
for pat, rep in SUBS:
    s, n = re.subn(pat, rep, s)
    total += n
    print(f"  {n}x  {pat[:60]}")

io.open(P, "w", encoding="utf-8").write(s)
print(f"\n{total} replacements, {len(orig)} -> {len(s)} chars")

# Report anything left, so a partial fix can't look like a complete one --
# which is the exact failure this script exists to clean up.
left = [(i + 1, l.strip()[:100])
        for i, l in enumerate(s.split("\n"))
        if re.search(r"\b(he|him|his)\b", l, re.I)
        and re.search(r"octo|den|tank|anemone|glass", l, re.I)]
print(f"\nremaining he/him/his near octocam text: {len(left)}")
for ln, txt in left:
    print(f"  {ln}: {txt}")
