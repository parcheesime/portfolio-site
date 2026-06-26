from collections import Counter, defaultdict
from datetime import datetime
from pathlib import Path
import re

TOOL = "css_health.py"
COMMAND = "python3 scripts/css_health.py"
CSS_FILE = Path("style.css")
REPORT_DIR = Path("reports")
REPORT_FILE = REPORT_DIR / "css_health.txt"

PROJECT = Path.cwd().name
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
EXIT_CODE = 0

REPORT_DIR.mkdir(exist_ok=True)

css = CSS_FILE.read_text(encoding="utf-8")
css_no_comments = re.sub(r"/\*.*?\*/", "", css, flags=re.S)

blocks = re.findall(r"([^{}]+)\{([^{}]+)\}", css_no_comments)

selector_counts = Counter()
property_map = defaultdict(list)
important_lines = []
media_queries = []
colors = Counter()
fixed_values = []
overflow_risks = []

for line_num, line in enumerate(css.splitlines(), start=1):
    if "!important" in line:
        important_lines.append((line_num, line.strip()))

    if "@media" in line:
        media_queries.append(line.strip())

    for color in re.findall(r"#[0-9a-fA-F]{3,8}|rgba?\([^)]+\)", line):
        colors[color] += 1

    if re.search(r"\b(width|height|min-width|max-width|left|right|top|bottom|padding|margin)\s*:\s*\d+px", line):
        fixed_values.append((line_num, line.strip()))

    if any(x in line for x in ("100vw", "max-content", "white-space: nowrap", "overflow-x")):
        overflow_risks.append((line_num, line.strip()))

for selector, body in blocks:
    selector = selector.strip()
    selector_counts[selector] += 1

    props = re.findall(r"([\w-]+)\s*:\s*([^;]+);", body)

    for prop, value in props:
        property_map[selector].append((prop.strip(), value.strip()))

with REPORT_FILE.open("w", encoding="utf-8") as f:
    f.write("=====================================\n")
    f.write("CSS HEALTH REPORT\n")
    f.write("=====================================\n\n")

    f.write(f"Generated : {TIMESTAMP}\n")
    f.write(f"Project   : {PROJECT}\n")
    f.write(f"Tool      : {TOOL}\n")
    f.write(f"Command   : {COMMAND}\n")
    f.write(f"Exit Code : {EXIT_CODE}\n")
    f.write(f"Result    : {'PASS' if EXIT_CODE == 0 else 'FAIL'}\n")
    f.write("\n=====================================\n\n")

    f.write(f"CSS File: {CSS_FILE}\n")
    f.write(f"Rule Blocks: {len(blocks)}\n")
    f.write(f"Unique Selectors: {len(selector_counts)}\n")
    f.write(f"Duplicate Selectors: {sum(c > 1 for c in selector_counts.values())}\n")
    f.write(f"!important Uses: {len(important_lines)}\n")
    f.write(f"Media Queries: {len(media_queries)}\n")
    f.write(f"Repeated Media Queries: {sum(c > 1 for c in Counter(media_queries).values())}\n")
    f.write(f"Hard-Coded Colors: {sum(colors.values())}\n")
    f.write(f"Fixed Pixel Layout Values: {len(fixed_values)}\n")
    f.write(f"Potential Overflow Risks: {len(overflow_risks)}\n\n")

    f.write("=== Duplicate Selectors ===\n")
    for selector, count in selector_counts.items():
        if count > 1:
            f.write(f"{selector} ({count})\n")

    f.write("\n=== Conflicting Properties ===\n")
    for selector, props in property_map.items():
        values = defaultdict(set)

        for prop, value in props:
            values[prop].add(value)

        for prop, vals in values.items():
            if len(vals) > 1:
                f.write(f"{selector}\n")
                f.write(f"  {prop}: {', '.join(sorted(vals))}\n")

    f.write("\n=== !important Usage ===\n")
    for line, text in important_lines:
        f.write(f"{line}: {text}\n")

    f.write("\n=== Repeated Media Queries ===\n")
    for query, count in Counter(media_queries).items():
        if count > 1:
            f.write(f"{query} ({count})\n")

    f.write("\n=== Most Repeated Colors ===\n")
    for color, count in colors.most_common(15):
        if count > 1:
            f.write(f"{color}: {count}\n")

    f.write("\n=== Potential Overflow Risks ===\n")
    for line, text in overflow_risks:
        f.write(f"{line}: {text}\n")

    f.write("\n=== Fixed Pixel Layout Values ===\n")
    for line, text in fixed_values:
        f.write(f"{line}: {text}\n")

print("CSS health audit complete.")
print(f"Report written to: {REPORT_FILE}")
raise SystemExit(EXIT_CODE)