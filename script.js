// Ative como 'true' para testar direto no GitHub Pages sem precisar do Java rodando
const MOCK_MODE = true; 
let timeLeft = 5 * 60; // 20 minutos em segundos

async function fetchWeatherData() {
    try {
        let data;
        
        if (MOCK_MODE) {
            // Simula dados gerados por um ESP32 / LoRaWAN
            data = {
                windSpeed: (Math.random() * 25 + 2).toFixed(1),
                windDirection: ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'][Math.floor(Math.random() * 8)],
                airTemp: (Math.random() * 15 + 18).toFixed(1),
                airHumidity: (Math.random() * 40 + 40).toFixed(1),
                soilTemp: (Math.random() * 10 + 20).toFixed(1),
                soilHumidity: (Math.random() * 30 + 50).toFixed(1),
                gasLevel: Math.random() > 0.8 ? 450 : Math.floor(Math.random() * 150) // Simula risco ocasional
            };
        } else {
            // Chamada real para o seu back-end Java hospedado em nuvem (ex: Render, Railway)
            const response = await fetch('https://seu-backend-java.com/api/weather/latest');
            if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
            data = await response.json();
        }
        
        updateUI(data);
        timeLeft = 20 * 60; // Reseta o cronômetro
        document.getElementById('last-update').innerText = new Date().toLocaleTimeString();
    } catch (error) {
        console.error('Falha na comunicação:', error);
    }
}

function updateUI(data) {
    document.getElementById('wind-speed').innerHTML = `${data.windSpeed} <span class="unit">km/h</span>`;
    document.getElementById('wind-dir').innerText = data.windDirection;
    document.getElementById('air-temp').innerHTML = `${data.airTemp} <span class="unit">°C</span>`;
    document.getElementById('air-humidity').innerHTML = `${data.airHumidity} <span class="unit">%</span>`;
    document.getElementById('soil-temp').innerHTML = `${data.soilTemp} <span class="unit">°C</span>`;
    document.getElementById('soil-humidity').innerHTML = `${data.soilHumidity} <span class="unit">%</span>`;
    document.getElementById('gas-level').innerHTML = `${data.gasLevel} <span class="unit">PPM</span>`;

    // Alerta de Incêndio (Gás > 400 PPM)
    const fireAlertBanner = document.getElementById('fire-alert');
    const gasCard = document.getElementById('gas-card');

    if (data.gasLevel > 400) {
        fireAlertBanner.classList.remove('hidden');
        gasCard.classList.add('danger-card');
    } else {
        fireAlertBanner.classList.add('hidden');
        gasCard.classList.remove('danger-card');
    }
}

// Cronômetro visual regressivo
setInterval(() => {
    if (timeLeft > 0) {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('countdown').innerText = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}, 1000);

// Atualização automática simulada a cada 20 minutos
setInterval(fetchWeatherData, 5 * 60 * 1000);

// Executa ao carregar
fetchWeatherData();
