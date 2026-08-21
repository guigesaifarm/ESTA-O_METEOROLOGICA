const MOCK_MODE = true; 
let timeLeft = 5 * 60; // 5 minutos em segundos
let irrigacaoAtiva = false;

async function fetchWeatherData() {
    try {
        let data;
        if (MOCK_MODE) {
            data = {
                windSpeed: (Math.random() * 25 + 2).toFixed(1),
                windDirection: ['N', 'NE', 'L', 'SE', 'S', 'SO', 'O', 'NO'][Math.floor(Math.random() * 8)],
                airTemp: (Math.random() * 15 + 18).toFixed(1),
                airHumidity: (Math.random() * 40 + 40).toFixed(1),
                soilTemp: (Math.random() * 10 + 20).toFixed(1),
                soilHumidity: (Math.random() * 30 + 50).toFixed(1),
                gasLevel: Math.random() > 0.85 ? 450 : Math.floor(Math.random() * 150)
            };
        } else {
            const response = await fetch('https://seu-backend-java.com/api/weather/latest');
            if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
            data = await response.json();
        }
        
        updateUI(data);
        timeLeft = 5 * 60; 
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

// Funções para alteração dinâmica de Fazenda e Talhão (Simulação GIS)
function loadTalhoes() {
    const unidade = document.getElementById('unit-select').value;
    const talhaoSelect = document.getElementById('talhao-select');
    talhaoSelect.innerHTML = "";

    if (unidade === 'fazenda_norte') {
        talhaoSelect.innerHTML = `
            <option value="talhao_01">Talhão 01 - Setor Café</option>
            <option value="talhao_02">Talhão 02 - Irrigação Grãos</option>
            <option value="talhao_03">Talhão 03 - Área de Preservação</option>
        `;
    } else {
        talhaoSelect.innerHTML = `
            <option value="talhao_sul_1">Talhão Sul A - Cana de Açúcar</option>
            <option value="talhao_sul_2">Talhão Sul B - Pastagem</option>
        `;
    }
    changeTalhaoData();
}

function changeTalhaoData() {
    const unidadeText = document.getElementById('unit-select').selectedOptions[0].text;
    const talhaoText = document.getElementById('talhao-select').selectedOptions[0].text;
    
    // Atualiza o subtítulo do painel GIS à direita
    document.getElementById('map-subtitle').innerText = `Visualizando: ${unidadeText} - ${talhaoText}`;
    fetchWeatherData(); // Atualiza dados fictícios do talhão selecionado
}

// Controles manuais / automáticos de Irrigação e Incêndio
function toggleIrrigacao() {
    irrigacaoAtiva = !irrigacaoAtiva;
    const btn = document.getElementById('btn-irrigacao');
    if (irrigacaoAtiva) {
        btn.innerText = "Desligar Irrigação";
        btn.classList.remove('btn-success');
        btn.classList.add('btn-warning');
        alert("Comando enviado: Bomba hidráulica ligada para os aspersores do talhão!");
    } else {
        btn.innerText = "Ligar Irrigação";
        btn.classList.remove('btn-warning');
        btn.classList.add('btn-success');
        alert("Comando enviado: Bomba hidráulica desligada.");
    }
}

function ativarCombateIncendio() {
    const talhaoText = document.getElementById('talhao-select').selectedOptions[0].text;
    alert(`⚠️ SISTEMA ACIONADO: Supressão de incêndio ativada via IoT no ${talhaoText}! Valvulas de segurança e aspersores de emergência abertos.`);
    document.getElementById('fire-alert').classList.add('hidden');
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

setInterval(fetchWeatherData, 5 * 60 * 1000);
fetchWeatherData();
