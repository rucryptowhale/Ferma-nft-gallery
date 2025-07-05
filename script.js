// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    COLLECTION_ADDRESS: "EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol",
    MAX_ITEMS: 1000,
    CACHE_DURATION: 60 * 60 * 1000, // 1 час кэширования
    DAILY_UPDATE_HOUR: 12, // Обновлять в 12:00
    API_KEY: "%%TONAPI_KEY%%" // Заполнится при сборке
};

// ===== ЭЛЕМЕНТЫ ДОМ =====
const GALLERY = document.getElementById('gallery');
const LOADER = document.getElementById('loader');
const TOTAL_NFTS = document.getElementById('total-nfts');
const LAST_UPDATE = document.getElementById('last-update');
const NEXT_UPDATE = document.getElementById('next-update');
const REFRESH_BTN = document.getElementById('refresh-btn');
const SEARCH_INPUT = document.getElementById('search-input');
const GRID_VIEW_BTN = document.getElementById('grid-view');
const LIST_VIEW_BTN = document.getElementById('list-view');
const NOTIFICATION = document.getElementById('notification');

// ===== СОСТОЯНИЕ =====
let nftItems = [];
let lastUpdateTime = null;

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

async function loadNFTs() {
    try {
        showLoader();
        
        // Проверяем кэш
        const cachedData = getCachedNFTData();
        if (cachedData) {
            nftItems = cachedData.items;
            lastUpdateTime = cachedData.timestamp;
            updateUI();
            showNotification("Loaded from cache", "info");
        } else {
            // Загружаем новые данные
            nftItems = await fetchNFTData();
            lastUpdateTime = Date.now();
            cacheNFTData();
            updateUI();
            showNotification("Data updated successfully", "success");
        }
        
        updateStats();
        scheduleDailyUpdate();
        
    } catch (error) {
        console.error("Ошибка загрузки NFT:", error);
        showError(error.message);
    } finally {
        hideLoader();
    }
}

async function fetchNFTData() {
    try {
        const response = await fetch(
            `https://tonapi.io/v1/nft/searchItems?collection=${CONFIG.COLLECTION_ADDRESS}&limit=${CONFIG.MAX_ITEMS}`,
            {
                headers: {
                    "Authorization": CONFIG.API_KEY,
                    "Accept": "application/json"
                }
            }
        );

        if (response.status === 429) {
            throw new Error("Too many requests. Please try again later.");
        }
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.nft_items || data.nft_items.length === 0) {
            throw new Error("Collection is empty or not found");
        }

        return data.nft_items;
    } catch (error) {
        console.error("NFT load error:", error);
        throw error;
    }
}

function displayNFTs(items) {
    let html = '';
    const searchTerm = SEARCH_INPUT.value.toLowerCase();
    
    // Фильтрация по поисковому запросу
    const filteredItems = items.filter(item => {
        const name = (item.metadata?.name || '').toLowerCase();
        const index = item.index ? item.index.toString() : '';
        return name.includes(searchTerm) || index.includes(searchTerm);
    });
    
    // Обновление счетчика
    TOTAL_NFTS.textContent = filteredItems.length;
    
    // Сортировка
    filteredItems.sort((a, b) => (a.index || 0) - (b.index || 0));
    
    // Генерация HTML
    filteredItems.forEach(item => {
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
                    <i class="fas fa-external-link-alt"></i> View on Getgems
                </a>
            </div>
        </div>
        `;
    });
    
    GALLERY.innerHTML = html || `<div class="no-results">No NFTs found matching your search</div>`;
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
    return 'https://via.placeholder.com/500?text=Image+Not+Available';
}

// Кэширование данных
function cacheNFTData() {
    const data = {
        items: nftItems,
        timestamp: lastUpdateTime
    };
    localStorage.setItem('nftCache', JSON.stringify(data));
}

// Получение кэшированных данных
function getCachedNFTData() {
    const cachedData = localStorage.getItem('nftCache');
    if (!cachedData) return null;
    
    const data = JSON.parse(cachedData);
    
    // Проверяем актуальность кэша
    const cacheAge = Date.now() - data.timestamp;
    if (cacheAge > CONFIG.CACHE_DURATION) return null;
    
    return data;
}

// Обновление статистики
function updateStats() {
    TOTAL_NFTS.textContent = nftItems.length;
    
    if (lastUpdateTime) {
        const date = new Date(lastUpdateTime);
        LAST_UPDATE.textContent = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
}

// Планирование ежедневного обновления
function scheduleDailyUpdate() {
    const now = new Date();
    const nextUpdate = new Date();
    
    // Устанавливаем время обновления на 12:00
    nextUpdate.setHours(CONFIG.DAILY_UPDATE_HOUR, 0, 0, 0);
    
    // Если сейчас уже прошло 12:00, планируем на следующий день
    if (now > nextUpdate) {
        nextUpdate.setDate(nextUpdate.getDate() + 1);
    }
    
    const timeUntilUpdate = nextUpdate - now;
    
    // Обновляем отображение следующего обновления
    NEXT_UPDATE.textContent = nextUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Устанавливаем таймер
    setTimeout(() => {
        loadNFTs();
        // Регулярно перепланируем
        scheduleDailyUpdate();
    }, timeUntilUpdate);
}

// Уведомления
function showNotification(message, type = "success") {
    NOTIFICATION.textContent = message;
    NOTIFICATION.className = `notification ${type}`;
    NOTIFICATION.classList.add('show');
    
    setTimeout(() => {
        NOTIFICATION.classList.remove('show');
    }, 2500);
}

// Обработчики ошибок
function showError(message) {
    GALLERY.innerHTML = `
        <div class="error-message">
            <h3>Ошибка загрузки коллекции</h3>
            <p>${message}</p>
            <button onclick="loadNFTs()">Попробовать снова</button>
        </div>
    `;
}

// Загрузчик
function showLoader() {
    LOADER.style.display = 'flex';
}

function hideLoader() {
    LOADER.style.display = 'none';
}

// Обновление UI
function updateUI() {
    displayNFTs(nftItems);
    updateStats();
}

// Копирование адреса
function copyAddress() {
    navigator.clipboard.writeText(CONFIG.COLLECTION_ADDRESS)
        .then(() => {
            showNotification("Address copied to clipboard!");
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification("Failed to copy address", "error");
        });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener('DOMContentLoaded', () => {
    // Загрузка данных
    loadNFTs();
    
    // Обработчики событий
    REFRESH_BTN.addEventListener('click', loadNFTs);
    SEARCH_INPUT.addEventListener('input', () => displayNFTs(nftItems));
    GRID_VIEW_BTN.addEventListener('click', () => {
        GALLERY.className = 'gallery-container grid-view';
        GRID_VIEW_BTN.classList.add('active');
        LIST_VIEW_BTN.classList.remove('active');
    });
    LIST_VIEW_BTN.addEventListener('click', () => {
        GALLERY.className = 'gallery-container list-view';
        LIST_VIEW_BTN.classList.add('active');
        GRID_VIEW_BTN.classList.remove('active');
    });
});
