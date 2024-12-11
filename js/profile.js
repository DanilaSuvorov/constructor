// Load user profile data
function loadProfileData() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);
        
        // Populate form fields
        document.getElementById('firstName').value = user.firstName || '';
        document.getElementById('lastName').value = user.lastName || '';
        document.getElementById('email').value = user.email || '';
    }
}

// Handle profile update
function handleProfileUpdate(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (!firstName || !lastName || !email) {
        alert('Please fill in all fields');
        return false;
    }
    
    try {
        // Get current user
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please log in again');
            window.location.href = 'login.html';
            return false;
        }
        
        const currentUser = JSON.parse(userStr);
        
        // Update user in users array
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        
        if (userIndex >= 0) {
            users[userIndex] = {
                ...users[userIndex],
                firstName,
                lastName,
                email
            };
            
            // Update users array
            localStorage.setItem('users', JSON.stringify(users));
            
            // Update current session
            const sessionUser = {
                ...currentUser,
                firstName,
                lastName,
                email
            };
            
            localStorage.setItem('user', JSON.stringify(sessionUser));
            
            alert('Profile updated successfully');
            window.location.reload();
        } else {
            alert('User not found. Please log in again');
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Profile update error:', error);
        alert('An error occurred while updating your profile');
    }
    
    return false;
}

// Handle password update
function handlePasswordUpdate(event) {
    event.preventDefault();
    
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        alert('Please fill in all password fields');
        return false;
    }
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match');
        return false;
    }
    
    if (newPassword.length < 8) {
        alert('New password must be at least 8 characters long');
        return false;
    }
    
    try {
        // Get current user
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            alert('Please log in again');
            window.location.href = 'login.html';
            return false;
        }
        
        const currentUser = JSON.parse(userStr);
        
        // Verify current password
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === currentUser.email && u.password === currentPassword);
        
        if (!user) {
            alert('Current password is incorrect');
            return false;
        }
        
        // Update password
        const userIndex = users.findIndex(u => u.email === currentUser.email);
        users[userIndex].password = newPassword;
        
        // Save updated users array
        localStorage.setItem('users', JSON.stringify(users));
        
        alert('Password updated successfully');
        
        // Clear password fields
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    } catch (error) {
        console.error('Password update error:', error);
        alert('An error occurred while updating your password');
    }
    
    return false;
}

// Initialize profile page
document.addEventListener('DOMContentLoaded', loadProfileData);
