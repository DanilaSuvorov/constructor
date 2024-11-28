// User authentication state
let currentUser = null;

// Check authentication state
function checkAuth() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return false;
        
        const user = JSON.parse(userStr);
        return user && user.email; // Check if user object has required fields
    } catch (error) {
        console.error('Auth check error:', error);
        return false;
    }
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return false;
    }
    
    try {
        // Get users from localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Find user with matching email and password
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Store user session
            const sessionUser = {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAuthenticated: true
            };
            
            localStorage.setItem('user', JSON.stringify(sessionUser));
            window.location.href = 'dashboard.html';
        } else {
            alert('Invalid email or password');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('An error occurred during login');
    }
    
    return false;
}

// Handle registration form submission
function handleRegister(event) {
    event.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Basic validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Password match validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    // Password strength validation
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return false;
    }
    
    try {
        // Get existing users or initialize empty array
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            alert('Email already registered');
            return false;
        }
        
        // Create new user
        const newUser = {
            firstName,
            lastName,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        // Store user in users array
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Create session
        const sessionUser = {
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            isAuthenticated: true
        };
        
        localStorage.setItem('user', JSON.stringify(sessionUser));
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Registration error:', error);
        alert('An error occurred during registration');
    }
    
    return false;
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const isProtectedPage = currentPath.includes('/account/') && 
                          !currentPath.includes('/login.html') && 
                          !currentPath.includes('/register.html');
    
    if (isProtectedPage && !checkAuth()) {
        window.location.href = 'login.html';
    }
    
    // Initialize user info if on dashboard
    if (currentPath.includes('/dashboard.html')) {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const user = JSON.parse(userStr);
            const userNameElement = document.getElementById('userName');
            if (userNameElement && user.firstName) {
                userNameElement.textContent = `${user.firstName} ${user.lastName}`;
            }
        }
    }
});
