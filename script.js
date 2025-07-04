// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    API_KEY: "Bearer AH5EY3FNRHUEXMIAAAAJA4OXKW3B5NJLO2OMXAECDALMPD7FUINPLPGEXIQWLNWDDO5SEEQ",
    // Используем raw-адрес для API
    COLLECTION_RAW_ADDRESS: "0:0fadfef1925b55dc6440dbe12113e753613bbb274177ecf3596dcf232d728638bf4a25",
    // Оригинальный адрес для отображения
    COLLECTION_FRIENDLY_ADDRESS: "EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol",
    ITEMS_PER_LOAD: 50,
    MAX_ITEMS: 1000
};

async function loadNFTs() {
    try {
        // ... остальной код без изменений ...
        const response = await fetch(
            // Используем RAW-адрес
            `https://tonapi.io/v1/nft/searchItems?collection=${CONFIG.COLLECTION_RAW_ADDRESS}&limit=${CONFIG.MAX_ITEMS}`,
            {
                headers: {
                    "Authorization": CONFIG.API_KEY,
                    "Accept": "application/json"
                }
            }
        );
        // ... остальной код без изменений ...
    }
    // ... обработка ошибок ...
}

function displayNFTs(items) {
    // ... сортировка ...
    items.forEach(item => {
        // ... получение данных ...
        html += `
        <div class="nft-card">
            <img src="${imageUrl}" alt="${name}" class="nft-image" loading="lazy">
            <div class="nft-info">
                <div class="nft-name">${name}</div>
                <div class="nft-index">${index}</div>
                <!-- Используем FRIENDLY-адрес для ссылки -->
                <a href="https://getgems.io/collection/${CONFIG.COLLECTION_FRIENDLY_ADDRESS}/${address}" 
                   target="_blank" 
                   class="nft-link">
                    <i class="fas fa-external-link-alt"></i> Открыть в Getgems
                </a>
            </div>
        </div>
        `;
    });
    // ... отрисовка ...
}

function copyAddress() {
    // Копируем FRIENDLY-адрес
    const el = document.createElement('textarea');
    el.value = CONFIG.COLLECTION_FRIENDLY_ADDRESS;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Адрес коллекции скопирован!');
}
