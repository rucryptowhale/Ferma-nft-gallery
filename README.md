# 🖼️ Ferma NFT Gallery - Official Collection

**Live Demo:** [https://RuCryptoWhale.github.io/Ferma-nft-gallery](https://RuCryptoWhale.github.io/Ferma-nft-gallery)  
**Collection:** [Ferma on Getgems](https://getgems.io/ferma)  
**Collection Address:** `EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol`

## What's New
- Added collection cover image support
- Dynamic loading of collection metadata (name, description, logo)
- Improved social links in footer
- Better error handling for images
- Enhanced mobile responsiveness

## Technical Updates
1. **Collection Metadata**:
   - Loads collection name, description, logo and cover image
   - Fallback to default values if metadata unavailable

2. **Cover Image**:
   - Added as header background with dark overlay
   - Smooth transition effect

3. **Security**:
   - API key remains protected via Cloudflare Worker
   - All sensitive data stored in environment variables

4. **Social Links**:
   - Added Telegram and Twitter links to footer
   - Responsive grid layout

## Setup
1. Ensure Cloudflare Worker is configured with your API key
2. Deploy updated files to GitHub Pages
3. Verify collection metadata loads correctly
