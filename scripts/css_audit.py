# scripts/css_audit.py
from pathlib import Path
import re
from collections import Counter, defaultdict

CSS_FILE = Path("style.css")

css = CSS_FILE.read_text(encoding="utf-8")

# remove comments
css_no_comments = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

blocks = re.findall(r"([^{}]+)\{([^{}]+)\}", css_no_comments)

selector_counts = Counter()
property_map = defaultdict(list)

for selector, body in blocks:
    selector = selector.strip()
    selector_counts[selector] += 1

    props = re.findall(r"([\w-]+)\s*:\s*([^;]+);", body)
    for prop, value in props:
        property_map[selector].append((prop.strip(), value.strip()))

print("\nDuplicate selectors:")
for selector, count in selector_counts.items():
    if count > 1:
        print(f"  {selector} appears {count} times")

print("\nRepeated properties inside same selector:")
for selector, props in property_map.items():
    prop_counts = Counter(prop for prop, _ in props)
    repeated = [p for p, c in prop_counts.items() if c > 1]
    if repeated:
        print(f"  {selector}: {', '.join(repeated)}")