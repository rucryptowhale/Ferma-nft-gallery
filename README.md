# 🖼️ Ferma NFT Gallery - Official Collection

**Live Demo:** [https://RuCryptoWhale.github.io/Ferma-nft-gallery](https://RuCryptoWhale.github.io/Ferma-nft-gallery)  
**Collection:** [Ferma on Getgems](https://getgems.io/ferma)  
**Collection Address:** `EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol`

## Security Setup
1. Add your TON API key to GitHub Secrets:
   - Go to Repository Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `TONAPI_KEY`
   - Value: Your API key from TON Console
   
2. Add build script to `package.json`:
```json
"scripts": {
  "build": "sed -i '' 's|%%TONAPI_KEY%%|'\"$TONAPI_KEY\"'|g' script.js"
}
