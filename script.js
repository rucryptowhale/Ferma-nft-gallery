// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    API_KEY: "Bearer AH5EY3FNRHUEXMIAAAAJA4OXKW3B5NJLO2OMXAECDALMPD7FUINPLPGEXIQWLNWDDO5SEEQ",
    COLLECTION_ADDRESS: "EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol",
    ITEMS_PER_LOAD: 50,
    MAX_ITEMS: 1000
};

// ===== ЭЛЕМЕНТЫ ДОМ =====
const GALLERY = document.getElementById('gallery');
const COUNTER = document.getElementById('counter');
const LOADER = document.getElementById('loader');

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

async function loadNFTs() {
    try {
        LOADER.style.display = 'block';
        COUNTER.textContent = "Загружаем данные...";
        GALLERY.innerHTML = '';

        const response = await fetch(
            `https://tonapi.io/v1/nft/searchItems?collection=${CONFIG.COLLECTION_ADDRESS}&limit=${CONFIG.MAX_ITEMS}`,
            {
                headers: {
                    "Authorization": CONFIG.API_KEY,
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Ошибка API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.nft_items || data.nft_items.length === 0) {
            throw new Error("Коллекция пуста или не найдена");
        }

        COUNTER.textContent = `Найдено NFT: ${data.nft_items.length}`;
        displayNFTs(data.nft_items);
        
    } catch (error) {
        console.error("Ошибка загрузки NFT:", error);
        COUNTER.textContent = "Ошибка загрузки";
        GALLERY.innerHTML = `
            <div class="error-message">
                <h3>Ошибка загрузки коллекции</h3>
                <p>${error.message}</p>
                <button onclick="loadNFTs()">Повторить попытку</button>
            </div>
        `;
    } finally {
        LOADER.style.display = 'none';
    }
}

function displayNFTs(items) {
    items.sort((a, b) => (a.index || 0) - (b.index || 0));
    
    let html = '';
    
    items.forEach(item => {
        const imageUrl = getBestImageUrl(item);
        const name = item.metadata?.name || `NFT #${item.index || '?'}`;
        const index = item.index ? `#${item.index}` : '';
        const address = item.address || '';
        
        html += `
        <div class="nft-card">
            <img src="${imageUrl}" alt="${name}" class="nft-image" loading="lazy">
            <div class="nft-info">
                <div class="nft-name">${name}</div>
                <div class="nft-index">${index}</div>
                <a href="https://getgems.io/collection/${CONFIG.COLLECTION_ADDRESS}/${address}" 
                   target="_blank" 
                   class="nft-link">
                    <i class="fas fa-external-link-alt"></i> Открыть в Getgems
                </a>
            </div>
        </div>
        `;
    });
    
    GALLERY.innerHTML = html;
}

function getBestImageUrl(item) {
    // 1. Пытаемся получить превью 500x500
    if (item.previews) {
        const preview = item.previews.find(p => p.resolution === '500x500');
        if (preview) return preview.url;
    }
    
    // 2. Пытаемся получить оригинальное изображение
    if (item.metadata?.image) {
        // Конвертируем IPFS ссылки
        if (item.metadata.image.startsWith('ipfs://')) {
            return `https://ipfs.io/ipfs/${item.metadata.image.slice(7)}`;
        }
        return item.metadata.image;
    }
    
    // 3. Заглушка, если изображение не найдено
    return 'https://via.placeholder.com/500?text=Image+Not+Found';
}

function copyAddress() {
    const el = document.createElement('textarea');
    el.value = CONFIG.COLLECTION_ADDRESS;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    alert('Адрес коллекции скопирован!');
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    loadNFTs();
    setInterval(loadNFTs, 30 * 60 * 1000); // Обновление каждые 30 минут
});