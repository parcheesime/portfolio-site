.PHONY: serve

# Simple script to run a local server using Python 3
serve:
	@echo "Starting local server at http://localhost:8000"
	explorer.exe "http://localhost:8000" || true
	python3 -m http.server 8000

check:
	@echo "Running CSS audit..."
	@python3 scripts/css_audit.py

	@echo ""
	@echo "Running HTML validation..."
	@npx html-validate@9 "*.html"

	@echo ""
	@echo "Running Stylelint..."
	@npx stylelint "style.css"

	@echo ""
	@echo "Running ESLint..."
	@npx eslint .