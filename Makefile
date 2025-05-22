.PHONY: serve

# Simple script to run a local server using Python 3
serve:
	@echo "Starting local server at http://localhost:8000"
	explorer.exe "http://localhost:8000" || true
	python3 -m http.server 8000
