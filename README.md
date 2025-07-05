# 🖼️ Ferma NFT Gallery - Official Collection

**Live Demo:** [https://RuCryptoWhale.github.io/Ferma-nft-gallery](https://RuCryptoWhale.github.io/Ferma-nft-gallery)  
**Collection:** [Ferma on Getgems](https://getgems.io/ferma)  
**Collection Address:** `EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol`

## Features
- Daily auto-update at 12:00 UTC
- Local caching for faster loading
- Collection cover image
- Secure API key handling via GitHub Secrets
- Responsive design with grid/list views
- Search functionality
- Social links in footer

## Setup Instructions
1. Add your TON API key to GitHub Secrets:
   - Go to Repository Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `TONAPI_KEY`
   - Value: Your API key from TON Console (format: `Bearer YOUR_KEY_HERE`)

2. The GitHub Actions workflow will:
   - Replace `%%TONAPI_KEY%%` in script.js with your secret
   - Deploy to GitHub Pages on every push to `main`
   - Daily refresh at 12:00 UTC

## Technical Notes
- API key is securely injected during build process
- Collection data is cached for 1 hour
- Images are lazy-loaded for performance
- Responsive design works on all devices
