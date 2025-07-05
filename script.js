// ===== КОНФИГУРАЦИЯ =====
const CONFIG = {
    API_KEY: "Bearer AH5EY3FNRHUEXMIAAAAJA4OXKW3B5NJLO2OMXAECDALMPD7FUINPLPGEXIQWLNWDDO5SEEQ",
    COLLECTION_RAW_ADDRESS: "0:bdbff1925b55dc6440dbe12113e753613bbb274177ecf3596dcf232d728638bf",
    COLLECTION_FRIENDLY_ADDRESS: "EQC9v_GSW1XcZEDb4SET51NhO7snQXfs81ltzyMtcoY4v0ol",
    MAX_ITEMS: 200
};

const GALLERY = document.getElementById('gallery');
const COUNTER = document.getElementById('counter');
const LOADER = document.getElementById('loader');

async function loadNFTs() {
    try {
        LOADER.style.display = 'block';
        COUNTER.textContent = "Загружаем данные...";
        GALLERY.innerHTML = '';

        const encodedAddress = encodeURIComponent(CONFIG.COLLECTION_RAW_ADDRESS);
        const response = await fetch(
            `https://tonapi.io/v1/nft/searchItems?collection=${encodedAddress}&limit=${CONFIG.MAX_ITEMS}`,
            {
                headers: {
                    "Authorization": CONFIG.API_KEY,
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Ошибка API: ${response.status} - ${errorData.error || response.statusText}`);
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
