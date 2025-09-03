# 🚀 Sweet Frozen E-commerce Makefile

.PHONY: deploy quick-deploy dev clean status

# Default target
deploy:
	@echo "🚀 Starting full deployment..."
	@./deploy.sh "📦 Deploy via Makefile"

# Quick deployment without production check
quick-deploy:
	@echo "⚡ Quick deployment..."
	@git add .
	@git commit -m "⚡ Quick deploy $$(date '+%Y-%m-%d %H:%M:%S')" || echo "No changes to commit"
	@git push origin main
	@echo "✅ Quick deploy completed!"

# Development server
dev:
	@echo "🔧 Starting development server..."
	@npm run dev

# Clean git cache and reset
clean:
	@echo "🧹 Cleaning git cache..."
	@git rm -r --cached . || true
	@git add .
	@echo "✅ Clean completed!"

# Show git status
status:
	@echo "📊 Git Status:"
	@git status --short
	@echo ""
	@echo "📋 Recent commits:"
	@git log --oneline -5

# Show help
help:
	@echo "🚀 Sweet Frozen E-commerce Commands:"
	@echo ""
	@echo "  make deploy      - Full deployment with production check"
	@echo "  make quick-deploy - Quick deployment without checks"
	@echo "  make dev         - Start development server"
	@echo "  make status      - Show git status and recent commits"
	@echo "  make clean       - Clean git cache"
	@echo "  make help        - Show this help"
