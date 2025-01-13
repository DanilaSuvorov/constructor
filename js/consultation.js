// Add consultation button and modal to the page
function addConsultationButton() {
    // Add button
    const button = document.createElement('div');
    button.className = 'fixed-consultation';
    button.innerHTML = `
        <button class="consultation-btn" onclick="openFeedbackModal()" title="Получить консультацию">
            <i class="fas fa-comments"></i>
        </button>
    `;
    
    // Add modal
    const modal = document.createElement('div');
    modal.id = 'feedbackModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal" onclick="closeFeedbackModal()">&times;</span>
            <h2>Получить консультацию</h2>
            <form id="feedbackForm" onsubmit="submitFeedbackForm(event)">
                <div class="form-group">
                    <label for="name">Наименование компании</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="name">Ваше имя</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="phone">Ваша должность</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-group">
                    <label for="email">Ваш контакт на выбор(почта, мессенджер)</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="message">Сообщение</label>
                    <textarea id="message" name="message" rows="4"></textarea>
                </div>
                <button type="submit" class="submit-btn">Отправить</button>
            </form>
        </div>
    `;

    // Add elements to page
    document.body.appendChild(button);
    document.body.appendChild(modal);

    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .fixed-consultation {
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999;
        }

        .consultation-btn {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #0066cc;
            color: white;
            border: none;
            display: grid;
            place-items: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .consultation-btn i {
            font-size: 24px;
        }

        .consultation-btn:hover {
            transform: translateY(-5px);
            background: #0052a3;
            box-shadow: 0 6px 12px rgba(0, 102, 204, 0.2);
        }

        @media (max-width: 768px) {
            .fixed-consultation {
                bottom: 20px;
                right: 20px;
            }
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1000;
            overflow-y: auto;
        }

        .modal-content {
            position: relative;
            background: #fff;
            max-width: 500px;
            margin: 50px auto;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .close-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            transition: color 0.3s;
        }

        .close-modal:hover {
            color: #333;
        }

        .modal-content h2 {
            margin-bottom: 1.5rem;
            color: #0066cc;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1.5rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #333;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1rem;
            transition: border-color 0.3s;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            border-color: #0066cc;
            outline: none;
        }

        .submit-btn {
            width: 100%;
            padding: 1rem;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1.1rem;
            cursor: pointer;
            transition: background 0.3s;
        }

        .submit-btn:hover {
            background: #0052a3;
        }
    `;
    document.head.appendChild(styles);
}

// Modal functions
function openFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'block';
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').style.display = 'none';
}

function submitFeedbackForm(event) {
    event.preventDefault();
    // Add form submission logic here
    closeFeedbackModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('feedbackModal');
    if (event.target == modal) {
        closeFeedbackModal();
    }
}

// Add consultation button when the page loads
document.addEventListener('DOMContentLoaded', addConsultationButton);
