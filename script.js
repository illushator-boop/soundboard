let sounds = [];

const urlInput = document.getElementById('sound-url');
const keyInput = document.getElementById('sound-key');
const addBtn = document.getElementById('add-btn');
const board = document.getElementById('board');

// Загрузка сохраненных звуков при запуске
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('soundboard_data');
    if (saved) {
        const parsed = JSON.parse(saved);
        parsed.forEach(item => createSound(item.url, item.key, false));
    }
});

// Добавление звука по кнопке
addBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    const key = keyInput.value.trim().toLowerCase();

    if (!url || !key) {
        alert('Заполните все поля!');
        return;
    }

    createSound(url, key, true);

    urlInput.value = '';
    keyInput.value = '';
});

// Функция создания карточки и аудио
function createSound(url, key, shouldSave = true) {
    const audio = new Audio(url);
    const soundData = { key, url, audio };
    
    sounds.push(soundData);

    const card = document.createElement('div');
    card.className = 'sound-card';
    card.innerHTML = `<span class="key-badge">${key}</span>Звук`;
    card.dataset.key = key;

    card.addEventListener('click', () => playSound(soundData, card));
    board.appendChild(card);

    if (shouldSave) {
        saveToLocalStorage();
    }
}

// Воспроизведение
function playSound(soundData, cardElement) {
    soundData.audio.currentTime = 0;
    soundData.audio.play().catch(() => alert('Ошибка загрузки звука по этой ссылке'));

    if (cardElement) {
        cardElement.classList.add('active');
        setTimeout(() => cardElement.classList.remove('active'), 200);
    }
}

// Сохранение в браузер
function saveToLocalStorage() {
    const dataToSave = sounds.map(item => ({ key: item.key, url: item.url }));
    localStorage.setItem('soundboard_data', JSON.stringify(dataToSave));
}

// Слушатель клавиш
window.addEventListener('keydown', (event) => {
    if (event.target.tagName === 'INPUT') return;

    const pressedKey = event.key.toLowerCase();
    const soundData = sounds.find(item => item.key === pressedKey);

    if (soundData) {
        const card = document.querySelector(`.sound-card[data-key="${pressedKey}"]`);
        playSound(soundData, card);
    }
});
