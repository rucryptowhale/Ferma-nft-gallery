// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    COLLECTION_ADDRESS: "EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol",
    MAX_ITEMS: 1000,
    CACHE_DURATION: 60 * 60 * 1000, // 1 час кэширования
    DAILY_UPDATE_HOUR: 12, // Обновлять в 12:00
    COLLECTION_METADATA_URL: "https://tonapi.io/v1/nft/getCollection"
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
const COLLECTION_HEADER = document.getElementById('collection-header');
const COLLECTION_LOGO = document.getElementById('collection-logo');
const COLLECTION_NAME = document.getElementById('collection-name');
const COLLECTION_DESC = document.getElementById('collection-description');

// ===== СОСТОЯНИЕ =====
let nftItems = [];
let lastUpdateTime = null;
let collectionMetadata = null;

// ===== ОСНОВНЫЕ ФУНКЦИИ =====

// Основная функция загрузки
async function loadNFTs() {
    try {
        showLoader();
        
        // Загружаем метаданные коллекции
        await loadCollectionMetadata();
        
        // Проверяем кэш NFT
        const cachedData = getCachedNFTData();
        if (cachedData) {
            nftItems = cachedData.items;
            lastUpdateTime = cachedData.timestamp;
            updateUI();
            showNotification("Loaded from cache", "info");
        } else {
            // Загружаем новые данные NFT
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

// Загрузка метаданных коллекции
async function loadCollectionMetadata() {
    try {
        const response = await fetch(
            `${CONFIG.COLLECTION_METADATA_URL}?collection_address=${CONFIG.COLLECTION_ADDRESS}`
        );
        
        if (!response.ok) {
            throw new Error(`Metadata error: ${response.status}`);
        }
        
        const data = await response.json();
        collectionMetadata = data;
        applyCollectionMetadata();
        
    } catch (error) {
        console.error("Ошибка загрузки метаданных:", error);
        // Используем значения по умолчанию
        COLLECTION_NAME.textContent = "Ferma NFT Collection";
        COLLECTION_DESC.textContent = "Official TON Blockchain Gallery";
    }
}

// Применение метаданных коллекции
function applyCollectionMetadata() {
    if (!collectionMetadata || !collectionMetadata.metadata) return;
    
    const meta = collectionMetadata.metadata;
    
    // Обновляем название
    if (meta.name) {
        COLLECTION_NAME.textContent = meta.name;
    }
    
    // Обновляем описание
    if (meta.description) {
        COLLECTION_DESC.textContent = meta.description;
    }
    
    // Устанавливаем обложку
    if (meta.cover_image) {
        COLLECTION_HEADER.style.setProperty(
            '--header-image', 
            `url('${meta.cover_image}')`
        );
    }
    
    // Обновляем логотип
    if (meta.image) {
        COLLECTION_LOGO.src = meta.image;
        // Добавляем обработчик на случай ошибки загрузки
        COLLECTION_LOGO.onerror = () => {
            COLLECTION_LOGO.src = 'https://getgems.io/favicon.ico';
        };
    }
}

// Функция для получения данных через Cloudflare Worker
async function fetchNFTData() {
    try {
        // Используем относительный путь к собственному endpoint
        const response = await fetch(
            `/api/nfts?collection=${CONFIG.COLLECTION_ADDRESS}&limit=${CONFIG.MAX_ITEMS}`
        );
        
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

// ... остальные функции остаются без изменений (displayNFTs, getBestImageUrl, etc) ...

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
    
    // Инициализация обложки
    COLLECTION_HEADER.style.setProperty(
        '--header-image', 
        'linear-gradient(135deg, var(--secondary), var(--dark))'
    );
});
