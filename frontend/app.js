// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// App State
let currentView = 'home';
let allCriminals = [];
let filteredCriminals = [];
let filters = {
    country: 'all',
    year: 'all',
    crimeType: 'all',
    search: ''
};
let ageConfirmed = false;
let audioStarted = false;
let audioContext = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    render();
    attachAgeButton();
    loadInitialData();
});

function attachAgeButton() {
    const ageConfirmButton = document.getElementById('ageConfirmButton');
    const ageModal = document.getElementById('ageModal');

    if (!ageConfirmButton || !ageModal) return;

    ageConfirmButton.addEventListener('click', () => {
        ageConfirmed = true;
        ageModal.classList.remove('active');
        startBackgroundAmbience();
        render();
    });
}

function startBackgroundAmbience() {
    if (audioStarted) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioContext = new AudioContext();
    const gain = audioContext.createGain();
    gain.gain.value = 0.065;
    gain.connect(audioContext.destination);

    const oscillator = audioContext.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 55;

    const lfo = audioContext.createOscillator();
    lfo.type = 'triangle';
    lfo.frequency.value = 0.08;

    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 7;
    lfo.connect(lfoGain);
    lfoGain.connect(oscillator.frequency);

    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 3, audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i += 1) {
        output[i] = (Math.random() * 2 - 1) * 0.02;
    }

    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseGain = audioContext.createGain();
    noiseGain.gain.value = 0.03;
    noiseSource.connect(noiseGain).connect(gain);
    oscillator.connect(gain);
    oscillator.start();
    lfo.start();
    noiseSource.start();
    audioStarted = true;
}

// Load data from backend
async function loadInitialData() {
    try {
        // Загружаем всех преступников
        const response = await fetch(`${API_BASE_URL}/criminals`);
        allCriminals = await response.json();
        filteredCriminals = allCriminals;
        render();
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
        // Fallback: используем локальные данные если нет подключения
        if (typeof criminals !== 'undefined') {
            allCriminals = criminals;
            filteredCriminals = allCriminals;
            render();
        } else {
            document.getElementById('app').innerHTML = `
                <div class="container">
                    <div class="header" style="color: red;">
                        <h1>⚠️ Ошибка подключения</h1>
                        <p>Не удается подключиться к серверу. Пожалуйста, запустите backend:</p>
                        <code style="background: #f0f0f0; padding: 10px; display: block; margin-top: 20px;">
                            cd backend<br>
                            pip install -r requirements.txt<br>
                            python init_db.py<br>
                            python app.py
                        </code>
                    </div>
                </div>
            `;
        }
    }
}

// Get unique values for filters from API
async function getFilters() {
    try {
        const response = await fetch(`${API_BASE_URL}/filters`);
        return await response.json();
    } catch (error) {
        console.error('Ошибка при загрузке фильтров:', error);
        // Fallback: генерируем фильтры из локальных данных
        return generateFilters();
    }
}

// Generate filters from current criminals data
function generateFilters() {
    const countries = ['all', ...new Set(allCriminals.map(c => c.country))].sort();
    const years = ['all', ...Array.from(new Set(allCriminals.map(c => c.year))).sort((a, b) => b - a)];
    const crimeTypes = ['all', ...new Set(allCriminals.map(c => c.crimeType))].sort();
    
    return { countries, years, crimeTypes };
}

// Main render function
async function render() {
    const app = document.getElementById('app');
    if (currentView === 'home') {
        app.innerHTML = renderHome();
        // Загружаем фильтры и привязываем слушателей
        const filtersData = await getFilters();
        attachEventListeners(filtersData);
    }
}

// Render home page with everything
function renderHome() {
    const stats = {
        total: allCriminals.length,
        countries: new Set(allCriminals.map(c => c.country)).size,
        crimeTypes: new Set(allCriminals.map(c => c.crimeType)).size,
        years: new Set(allCriminals.map(c => c.year)).size
    };

    return `
        <div class="container">
            <!-- Header with description -->
            <div class="header">
                <div class="header-warning">18+ только</div>
                <h1>Wanted-Caught</h1>
                <p>
                    Обучающий архивный ресурс с вырезками, делами и кровавыми заметками. Здесь собраны исторические досье, фотографии,
                    показания и документы, которые выглядят как настоящие архивные папки.
                </p>
                <p class="header-note">
                    <strong>Внимание:</strong> материал содержит сцены насилия, архивные описания арестов и кровавые детали. Сайт предназначен
                    только для взрослых и служит исследовательским целям.
                </p>
            </div>

            <!-- Statistics -->
            <div class="stats-panel">
                <div class="stat-card">
                    <strong>${stats.total}</strong>
                    <span>Всего людей в базе</span>
                </div>
                <div class="stat-card">
                    <strong>${stats.countries}</strong>
                    <span>Стран</span>
                </div>
                <div class="stat-card">
                    <strong>${stats.years}</strong>
                    <span>Лет охвачено</span>
                </div>
                <div class="stat-card">
                    <strong>${stats.crimeTypes}</strong>
                    <span>Типов преступлений</span>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="filters-panel">
                <h2>🔍 Поиск и фильтр</h2>
                
                <!-- Search box -->
                <div>
                    <label class="filter-label">Поиск по имени или обвинениям:</label>
                    <input 
                        type="text" 
                        id="searchInput" 
                        placeholder="Введите имя или описание обвинений..."
                    >
                </div>

                <!-- Filter Row 1: Country -->
                <div>
                    <label class="filter-label">Страна:</label>
                    <select id="countryFilter">
                        <option value="all">✓ Все страны</option>
                    </select>
                </div>

                <!-- Filter Row 2: Year -->
                <div>
                    <label class="filter-label">Год задержания:</label>
                    <select id="yearFilter">
                        <option value="all">✓ Любой год</option>
                    </select>
                </div>

                <!-- Filter Row 3: Crime Type -->
                <div>
                    <label class="filter-label">Тип преступления:</label>
                    <select id="crimeTypeFilter">
                        <option value="all">✓ Все типы</option>
                    </select>
                </div>

                <!-- Reset button -->
                <button id="resetButton">↻ Сбросить все фильтры</button>
            </div>

            <!-- Results section -->
            <div id="resultsSection">
                ${renderResults()}
            </div>
        </div>
    `;
}

// Attach event listeners
async function attachEventListeners(filtersData) {
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const yearFilter = document.getElementById('yearFilter');
    const crimeTypeFilter = document.getElementById('crimeTypeFilter');
    const resetButton = document.getElementById('resetButton');
    
    // Fill select options
    filtersData.countries.forEach(country => {
        if (country !== 'all') {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = '🌍 ' + country;
            countryFilter.appendChild(option);
        }
    });
    
    filtersData.years.forEach(year => {
        if (year !== 'all') {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year + ' год';
            yearFilter.appendChild(option);
        }
    });
    
    filtersData.crimeTypes.forEach(type => {
        if (type !== 'all') {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            crimeTypeFilter.appendChild(option);
        }
    });
    
    // Add event listeners
    searchInput.addEventListener('keyup', applyFilters);
    countryFilter.addEventListener('change', applyFilters);
    yearFilter.addEventListener('change', applyFilters);
    crimeTypeFilter.addEventListener('change', applyFilters);
    resetButton.addEventListener('click', resetFilters);
}

// Apply filters
function applyFilters() {
    const searchInput = document.getElementById('searchInput');
    const countryFilter = document.getElementById('countryFilter');
    const yearFilter = document.getElementById('yearFilter');
    const crimeTypeFilter = document.getElementById('crimeTypeFilter');
    
    filters.search = searchInput.value.toLowerCase();
    filters.country = countryFilter.value;
    filters.year = yearFilter.value;
    filters.crimeType = crimeTypeFilter.value;

    let result = allCriminals;

    // Apply search filter
    if (filters.search) {
        result = result.filter(c =>
            c.name.toLowerCase().includes(filters.search) ||
            c.charges.toLowerCase().includes(filters.search) ||
            c.biography.toLowerCase().includes(filters.search)
        );
    }

    // Apply country filter
    if (filters.country !== 'all') {
        result = result.filter(c => c.country === filters.country);
    }

    // Apply year filter
    if (filters.year !== 'all') {
        result = result.filter(c => c.year === parseInt(filters.year));
    }

    // Apply crime type filter
    if (filters.crimeType !== 'all') {
        result = result.filter(c => c.crimeType === filters.crimeType);
    }

    filteredCriminals = result;

    // Update results
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.innerHTML = renderResults();
    }
}

// Reset filters
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('countryFilter').value = 'all';
    document.getElementById('yearFilter').value = 'all';
    document.getElementById('crimeTypeFilter').value = 'all';
    filters = {
        country: 'all',
        year: 'all',
        crimeType: 'all',
        search: ''
    };
    filteredCriminals = allCriminals;
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.innerHTML = renderResults();
    }
}

// Render results
function renderResults() {
    if (filteredCriminals.length === 0) {
        return `
            <div class="no-results">
                <h3>😔 Преступников не найдено</h3>
                <p>Попробуйте изменить условия поиска или фильтры</p>
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 30px;">
            <h2 style="color: #3b2919; margin-bottom: 20px;">
                📋 Результаты поиска: <span style="color: #7b1414; font-weight: bold;">${filteredCriminals.length}</span>
            </h2>
        </div>

        <div class="criminals-grid">
            ${filteredCriminals.map(criminal => {
                const bloodClass = criminal.id % 3 === 0 ? ' blood-card' : '';
                const bloodMark = criminal.id % 5 === 0 ? '<span class="blood-drop"></span>' : '';
                return `
                    <div class="criminal-card${bloodClass}" onclick="openProfile(${criminal.id})">
                        <img src="${criminal.image}" alt="${criminal.name}" class="criminal-image">
                        <div class="criminal-info">
                            <h3>${criminal.name} ${bloodMark}</h3>
                            <div class="criminal-category">${criminal.category}</div>
                            <p><strong>📍 Страна:</strong> ${criminal.country}</p>
                            <p><strong>📅 Год:</strong> ${criminal.year}</p>
                            <p><strong>⚖️ Обвинения:</strong> ${criminal.crimeType}</p>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Render criminal profile modal
function renderProfileModal(criminal) {
    return `
        <div class="modal active" id="profileModal">
            <div class="modal-content">
                <span class="modal-close" onclick="closeProfile()">&times;</span>
                
                <div class="profile">
                    <img src="${criminal.image}" alt="${criminal.name}" class="profile-image">
                    
                    <div class="profile-details">
                        <h2>${criminal.name}</h2>
                        <span class="criminal-category">${criminal.category}</span>

                        <div class="profile-section">
                            <h3>⚖️ Основные обвинения</h3>
                            <p>${criminal.charges}</p>
                        </div>

                        <div class="profile-section">
                            <h3>📊 Информация</h3>
                            <p><span class="label">Страна:</span> ${criminal.country}</p>
                            <p><span class="label">Год задержания:</span> ${criminal.year}</p>
                            <p><span class="label">Тип преступления:</span> ${criminal.crimeType}</p>
                        </div>

                        <div class="profile-section${criminal.id % 2 === 0 ? ' blood' : ''}">
                            <h3>📝 Биография</h3>
                            <p>${criminal.biography}</p>
                        </div>

                        <div class="profile-section${criminal.id % 3 === 0 ? ' blood' : ''}">
                            <h3>🔍 Как был схвачен</h3>
                            <p><span class="label">Место:</span> ${criminal.captured}</p>
                            <p><span class="label">Метод задержания:</span> ${criminal.captureMethod}</p>
                        </div>

                        <div class="profile-section${criminal.id % 5 === 0 ? ' blood' : ''}">
                            <h3>🚨 Жертвы</h3>
                            <ul class="victims-list">
                                ${Array.isArray(criminal.victims) ? 
                                    criminal.victims.map(victim => `<li>${victim}</li>`).join('') : 
                                    '<li>Информация недоступна</li>'
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Open profile modal
function openProfile(criminalId) {
    const criminal = allCriminals.find(c => c.id === criminalId);
    if (!criminal) return;
    
    const modal = document.createElement('div');
    modal.innerHTML = renderProfileModal(criminal);
    document.body.appendChild(modal);

    // Close modal on background click
    document.getElementById('profileModal').addEventListener('click', (e) => {
        if (e.target.id === 'profileModal') {
            closeProfile();
        }
    });
}

// Close profile modal
function closeProfile() {
    const modal = document.getElementById('profileModal');
    if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal);
    }
}
