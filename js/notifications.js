// Load notification preferences
function loadNotificationPreferences() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const preferences = JSON.parse(localStorage.getItem(`notifications_${user.email}`) || '{}');
        
        // Set default values if not set
        document.getElementById('emailNotifications').checked = 
            preferences.emailNotifications !== undefined ? preferences.emailNotifications : true;
        document.getElementById('consultationReminders').checked = 
            preferences.consultationReminders !== undefined ? preferences.consultationReminders : true;
        document.getElementById('marketingUpdates').checked = 
            preferences.marketingUpdates !== undefined ? preferences.marketingUpdates : true;
        document.getElementById('newsAndPromotions').checked = 
            preferences.newsAndPromotions !== undefined ? preferences.newsAndPromotions : true;
    }
}

// Handle notification preferences update
function handleNotificationPreferences(event) {
    event.preventDefault();
    
    const emailNotifications = document.getElementById('emailNotifications').checked;
    const consultationReminders = document.getElementById('consultationReminders').checked;
    const marketingUpdates = document.getElementById('marketingUpdates').checked;
    const newsAndPromotions = document.getElementById('newsAndPromotions').checked;
    
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please log in again');
            window.location.href = 'login.html';
            return false;
        }
        
        const user = JSON.parse(userStr);
        
        // Save preferences
        const preferences = {
            emailNotifications,
            consultationReminders,
            marketingUpdates,
            newsAndPromotions
        };
        
        localStorage.setItem(`notifications_${user.email}`, JSON.stringify(preferences));
        
        alert('Notification preferences updated successfully');
    } catch (error) {
        console.error('Notification preferences update error:', error);
        alert('An error occurred while updating your notification preferences');
    }
    
    return false;
}

// Load notifications
function loadNotifications() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        const notifications = JSON.parse(localStorage.getItem(`notifications_list_${user.email}`) || '[]');
        
        const notificationsList = document.getElementById('notificationsList');
        
        if (notifications.length === 0) {
            notificationsList.innerHTML = '<p class="no-notifications">No notifications yet</p>';
            return;
        }
        
        // Sort notifications by date (newest first)
        notifications.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Display notifications
        notificationsList.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}">
                <div class="notification-icon">
                    <i class="fas ${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <p>${notification.message}</p>
                    <small>${formatDate(notification.date)}</small>
                </div>
            </div>
        `).join('');
    }
}

// Helper function to get notification icon
function getNotificationIcon(type) {
    switch (type) {
        case 'reminder':
            return 'fa-clock';
        case 'update':
            return 'fa-info-circle';
        case 'alert':
            return 'fa-exclamation-circle';
        default:
            return 'fa-bell';
    }
}

// Helper function to format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize notifications page
document.addEventListener('DOMContentLoaded', () => {
    loadNotificationPreferences();
    loadNotifications();
});
