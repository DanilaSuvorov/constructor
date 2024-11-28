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
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Animate numbers in statistics
    animateNumbers();
};

// Animate statistics numbers
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;

        const updateNumber = () => {
            current += step;
            if (current < target) {
                stat.textContent = Math.round(current);
                requestAnimationFrame(updateNumber);
            } else {
                stat.textContent = target;
            }
        };
        updateNumber();
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

// Smooth scroll for finance services navigation
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.services-nav .nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerOffset = 100; // Adjust this value based on your header height
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Animate statistics
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 200;
        
        function updateCounter() {
            const value = parseInt(stat.textContent);
            if (value < target) {
                stat.textContent = Math.ceil(value + increment);
                setTimeout(updateCounter, 1);
            } else {
                stat.textContent = target;
            }
        }
        
        updateCounter();
    });
});
