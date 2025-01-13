// Save field data functionality
function saveSingleField(fieldId) {
    const inputElement = document.getElementById(fieldId);
    const value = inputElement.value;

    if (value) {
        localStorage.setItem(fieldId, value);
        showSaveAnimation(inputElement);
    } else {
        alert(`Please enter a value for ${fieldId} before saving.`);
    }
}

// Show save animation
function showSaveAnimation(element) {
    element.classList.add('save-success');
    setTimeout(() => {
        element.classList.remove('save-success');
    }, 1000);
}

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, {
    threshold: 0.1
});

// Load saved data and initialize animations
window.onload = function() {
    // Load saved form data
    const fields = ["goal", "budget", "investment", "timeframe", "notes"];
    fields.forEach(fieldId => {
        const savedValue = localStorage.getItem(fieldId);
        if (savedValue) {
            const inputElement = document.getElementById(fieldId);
            if (inputElement) inputElement.value = savedValue;
        }
    });

    // Initialize animations
    document.querySelectorAll('.service-card, .testimonial, .about-content, .hero-content').forEach((el) => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseover', () => {
            card.classList.add('hover');
        });
        card.addEventListener('mouseout', () => {
            card.classList.remove('hover');
        });
    });
}

// Animate statistics numbers
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = target / 50; // Adjust speed here
        const timer = setInterval(() => {
            current += increment;
            stat.textContent = Math.round(current);
            if (current >= target) {
                stat.textContent = target;
                clearInterval(timer);
            }
        }, 20);
    });
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Counter functionality
let visitCount = parseInt(localStorage.getItem('visitCount')) || 0;

function updateCounter() {
    visitCount++;
    localStorage.setItem('visitCount', visitCount);
    const counterElement = document.getElementById('visitCounter');
    if (counterElement) {
        counterElement.textContent = visitCount;
    }
}

// Функция для обновления дашборда Superset
function refreshSupersetDashboard() {
    const frame = document.querySelector('.superset-frame');
    if (frame) {
        frame.src = frame.src;
    }
}

// Добавляем обработчик для кнопки обновления
document.addEventListener('DOMContentLoaded', function() {
    const refreshBtn = document.getElementById('refreshDashboard');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', refreshSupersetDashboard);
    }
});

// Обработка ошибок загрузки iframe
document.querySelector('.superset-frame')?.addEventListener('error', function() {
    this.style.display = 'none';
    this.parentElement.innerHTML = '<div class="error-message">Ошибка загрузки дашборда. Пожалуйста, проверьте подключение или обратитесь к администратору.</div>';
});

// Функция для загрузки дашборда Superset
function loadSupersetDashboard() {
    const containerElement = document.getElementById('superset-container');
    const dashboardId = '2'; // Ваш ID дашборда
    
    const iframe = document.createElement('iframe');
    iframe.src = `http://localhost:3000/superset/dashboard/${dashboardId}/?standalone=true&show_filters=0&show_title=0&embed=true`;
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.setAttribute('allow', 'same-origin');
    
    containerElement.innerHTML = '';
    containerElement.appendChild(iframe);
}

// Загружаем дашборд при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSupersetDashboard);

// Обработчик для кнопки обновления
document.getElementById('refreshDashboard')?.addEventListener('click', loadSupersetDashboard);

// Функция обработки загрузки файла
async function handleFileUpload(input) {
    const file = input.files[0];
    const uploadStatus = document.getElementById('uploadStatus');
    
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
        uploadStatus.innerHTML = '<div class="loading">Загрузка файла...</div>';
        
        // Отправляем файл на сервер
        const response = await fetch('http://localhost:8088/api/v1/excel/upload', {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Ошибка загрузки');

        const result = await response.json();
        uploadStatus.innerHTML = '<div class="success">Файл успешно агружен</div>';
        
        // Обновляем дашборд
        loadSupersetDashboard();
    } catch (error) {
        console.error('Upload error:', error);
        uploadStatus.innerHTML = '<div class="error">Ошибка загрузки файла</div>';
    }
}
