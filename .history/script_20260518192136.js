// База данных игр (имитация бэкенда)
const gamesData = [
    { id: 1, title: "Cyberpunk 2077", price: 59.99, tag: "rpg", icon: "🤖" },
    { id: 2, title: "Hades II", price: 29.99, tag: "action", icon: "🔥" },
    { id: 3, title: "Starfield", price: 69.99, tag: "sci-fi", icon: "🚀" },
    { id: 4, title: "Resident Evil Village", price: 39.99, tag: "horror", icon: "🏰" },
    { id: 5, title: "Elden Ring", price: 59.99, tag: "rpg", icon: "⚔️" },
    { id: 6, title: "Doom Eternal", price: 19.99, tag: "action", icon: "🌋" },
];

let cart = [];

// Элементы DOM
const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const tagButtons = document.querySelectorAll('.tag-btn');
const cartToggle = document.getElementById('cartToggle');
const sidebarCart = document.getElementById('sidebarCart');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// 1. Рендер карточек игр
function displayGames(games) {
    gamesGrid.innerHTML = '';
    if(games.length === 0) {
        gamesGrid.innerHTML = '<p class="empty-msg">No games found.</p>';
        return;
    }
    games.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <div class="game-thumb">${game.icon}</div>
            <div class="game-info">
                <div class="game-title">${game.title}</div>
                <div class="game-tags">${game.tag}</div>
                <div class="game-footer">
                    <div class="game-price">$${game.price}</div>
                    <button class="buy-btn" onclick="addToCart(${game.id})">Buy</button>
                </div>
            </div>
        `;
        gamesGrid.appendChild(card);
    });
}

// 2. Поиск и Фильтрация
function filterGames() {
    const searchText = searchInput.value.toLowerCase();
    const activeTag = document.querySelector('.tag-btn.active').dataset.filter;

    const filtered = gamesData.filter(game => {
        const matchesSearch = game.title.toLowerCase().includes(searchText);
        const matchesTag = activeTag === 'all' || game.tag === activeTag;
        return matchesSearch && matchesTag;
    });

    displayGames(filtered);
}

// Слушатель поиска
searchInput.addEventListener('input', filterGames);

// Слушатели кликов по тегам
tagButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        tagButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        filterGames();
    });
});

// 3. Логика корзины
function addToCart(gameId) {
    const game = gamesData.find(g => g.id === gameId);
    if (game && !cart.some(item => item.id === gameId)) {
        cart.push(game);
        updateCart();
    }
}

window.removeFromCart = function(gameId) {
    cart = cart.filter(item => item.id !== gameId);
    updateCart();
}

function updateCart() {
    cartCount.innerText = cart.length;
    cartItemsContainer.innerHTML = '';

    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
        cartTotal.innerText = '0.00';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <span>${item.title}</span>
            <div>
                <span style="margin-right: 10px;">$${item.price}</span>
                <button class="remove-item" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotal.innerText = total.toFixed(2);
}

// Открытие / Закрытие корзины
cartToggle.addEventListener('click', () => sidebarCart.classList.add('open'));
closeCart.addEventListener('click', () => sidebarCart.classList.remove('open'));

// Инициализация при загрузке
displayGames(gamesData);
