# 🖼️ Ferma NFT Gallery - Official Collection

**Live Demo:** [https://RuCryptoWhale.github.io/Ferma-nft-gallery](https://RuCryptoWhale.github.io/Ferma-nft-gallery)  
**Collection:** [Ferma on Getgems](https://getgems.io/ferma)  
**Collection Address:** `EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol`

## Overview
Professional NFT gallery for the Ferma collection on TON Blockchain. Features:

✅ Real-time updates  
✅ Daily auto-refresh at 12:00 PM  
✅ Responsive design (Grid/List views)  
✅ Search functionality  
✅ Caching for faster loading  
✅ Collection stats tracking  
✅ Secure API access via proxy

## Technical Features
- **Secure API Access**: All requests go through a secure Cloudflare Worker proxy
- **Smart Caching**: 1-hour cache to reduce API calls and improve performance
- **Modern UI**: Professional design with Montserrat/Roboto fonts and elegant cards
- **Optimized Performance**: Lazy loading, efficient rendering, and error handling
- **Daily Auto-Refresh**: Automatically updates collection daily at 12:00 PM

## Setup
1. Add Cloudflare Worker with TON API authorization
2. Deploy to GitHub Pages
3. Add `FERMA_API_KEY` to repository secrets

## Architecture
```mermaid
graph TD
    A[User Browser] --> B[GitHub Pages]
    B --> C[Cloudflare Worker]
    C --> D[TON API]
    C --> E[Cache Storage]
