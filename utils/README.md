# ⚙️ Utilities

This folder contains utility scripts and tools for development and deployment.

## Scripts

- **deploy.sh** - Automated deployment script for GitHub Pages
- **fix-hero-responsive.sh** - Quick fix for Hero section responsive issues
- **fix-responsive.sh** - General responsive design fixes
- **fix-responsive-final.sh** - Final responsive design patches

## Usage

### Deployment
```bash
# Run deployment script
./utils/deploy.sh

# Using NPM script
npm run deploy

# Using Makefile
make deploy
```

### Responsive Fixes
```bash
# Fix Hero section
./utils/fix-hero-responsive.sh

# General responsive fixes
./utils/fix-responsive.sh
```

## Prerequisites

- Node.js for npm scripts
- Git for deployment
- Bash shell for script execution
