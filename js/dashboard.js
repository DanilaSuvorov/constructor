// Dashboard functionality

// Schedule consultation
function scheduleConsultation() {
    // In a real application, this would open a modal or redirect to a scheduling page
    alert('Scheduling functionality coming soon!');
}

// Upload document
function uploadDocument() {
    // In a real application, this would open a file upload dialog
    alert('Document upload functionality coming soon!');
}

// Contact support
function contactSupport() {
    // In a real application, this would open a support chat or contact form
    alert('Support chat functionality coming soon!');
}

// Load dashboard data
function loadDashboardData() {
    // In a real application, this would fetch data from a backend server
    // For demo purposes, we'll use mock data
    
    const mockConsultations = [
        {
            date: '2024-02-01',
            time: '10:00 AM',
            consultant: 'John Smith',
            topic: 'Financial Planning'
        }
    ];
    
    const mockDocuments = [
        {
            name: 'Business Plan.pdf',
            uploadedAt: '2024-01-15',
            size: '2.5 MB'
        }
    ];
    
    const mockNotifications = [
        {
            message: 'Your next consultation is tomorrow at 10:00 AM',
            type: 'reminder',
            timestamp: '2024-01-31'
        }
    ];
    
    // Update consultations list
    const consultationsList = document.getElementById('consultationsList');
    if (mockConsultations.length > 0) {
        consultationsList.innerHTML = mockConsultations.map(consultation => `
            <div class="consultation-item">
                <p><strong>${consultation.date} at ${consultation.time}</strong></p>
                <p>With: ${consultation.consultant}</p>
                <p>Topic: ${consultation.topic}</p>
            </div>
        `).join('');
    }
    
    // Update documents list
    const documentsList = document.getElementById('documentsList');
    if (mockDocuments.length > 0) {
        documentsList.innerHTML = mockDocuments.map(document => `
            <div class="document-item">
                <p><strong>${document.name}</strong></p>
                <p>Uploaded: ${document.uploadedAt}</p>
                <p>Size: ${document.size}</p>
            </div>
        `).join('');
    }
    
    // Update notifications list
    const notificationsList = document.getElementById('notificationsList');
    if (mockNotifications.length > 0) {
        notificationsList.innerHTML = mockNotifications.map(notification => `
            <div class="notification-item ${notification.type}">
                <p>${notification.message}</p>
                <small>${notification.timestamp}</small>
            </div>
        `).join('');
    }
}

// Initialize dashboard
function initDashboard() {
    // Check if user is logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Parse user data
        const user = JSON.parse(userStr);
        
        // Update user name in the header
        const userFullName = document.querySelector('.user-fullname');
        if (userFullName) {
            userFullName.textContent = `${user.firstName} ${user.lastName}`;
        }
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
    
    loadDashboardData();
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = '/account/login.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initDashboard);
