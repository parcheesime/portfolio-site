.PHONY: serve check

serve:
	@echo "Starting local server at http://localhost:8000"
	explorer.exe "http://localhost:8000" || true
	python3 -m http.server 8000

check:
	@echo "Running CSS health audit..."
	@python3 scripts/css_health.py

	@echo ""
	@echo "Running HTML validation..."
	@python3 scripts/html_audit.py

	@echo ""
	@echo "Running Stylelint..."
	@npx stylelint@16.8.2 "style.css"

	@echo ""
	@echo "Running ESLint..."
	@python3 scripts/js_audit.py