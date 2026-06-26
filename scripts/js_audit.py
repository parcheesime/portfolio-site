from datetime import datetime
from pathlib import Path
import subprocess

TOOL = "js_audit.py"
COMMAND = "npx eslint ."

PROJECT = Path.cwd().name
TIMESTAMP = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

REPORT_DIR = Path("reports")
REPORT_DIR.mkdir(exist_ok=True)

REPORT_FILE = REPORT_DIR / "eslint.txt"

cmd = ["npx", "eslint", "."]

result = subprocess.run(
    cmd,
    text=True,
    capture_output=True,
    shell=False,
)

EXIT_CODE = result.returncode

with REPORT_FILE.open("w", encoding="utf-8") as f:
    f.write("=====================================\n")
    f.write("ESLINT REPORT\n")
    f.write("=====================================\n\n")

    f.write(f"Generated : {TIMESTAMP}\n")
    f.write(f"Project   : {PROJECT}\n")
    f.write(f"Tool      : {TOOL}\n")
    f.write(f"Command   : {COMMAND}\n")
    f.write(f"Exit Code : {EXIT_CODE}\n")
    f.write(f"Result    : {'PASS' if EXIT_CODE == 0 else 'FAIL'}\n")
    f.write("\n=====================================\n\n")

    if result.stdout:
        f.write("=== STDOUT ===\n")
        f.write(result.stdout)
        f.write("\n")

    if result.stderr:
        f.write("=== STDERR ===\n")
        f.write(result.stderr)
        f.write("\n")

    if not result.stdout and not result.stderr:
        f.write("No ESLint issues were reported.\n")

print("ESLint audit complete.")
print(f"Report written to: {REPORT_FILE}")

raise SystemExit(EXIT_CODE)