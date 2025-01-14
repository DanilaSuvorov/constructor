// Control dropdown menu visibility based on user preference and purchased modules
async function initializeDropdownVisibility() {
    const token = localStorage.getItem('token');
    if (!token) {
        hideAllDropdowns();
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/user-modules', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            hideAllDropdowns();
            return;
        }

        const data = await response.json();
        const purchasedModules = data.modules || [];
        console.log('Purchased modules:', purchasedModules); // Debug log

        // Hide all dropdowns first
        hideAllDropdowns();

        // Show only purchased modules
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            const href = toggle.getAttribute('href');
            // Extract module name from href (e.g., "finance.html" -> "finance")
            const module = href.split('/').pop().split('.')[0];
            console.log('Checking module:', module); // Debug log

            if (purchasedModules.includes(module)) {
                const menu = toggle.nextElementSibling;
                if (menu && menu.classList.contains('dropdown-menu')) {
                    menu.style.display = 'block';
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user modules:', error);
        hideAllDropdowns();
    }
}

function hideAllDropdowns() {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    dropdownMenus.forEach(menu => {
        menu.style.display = 'none';
    });
}

// Handle dropdown toggle hover events
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.addEventListener('mouseenter', async (e) => {
        const href = toggle.getAttribute('href');
        // Extract module name from href (e.g., "finance.html" -> "finance")
        const module = href.split('/').pop().split('.')[0];
        const token = localStorage.getItem('token');
        
        if (!token) {
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/user-modules', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            const purchasedModules = data.modules || [];

            const menu = toggle.nextElementSibling;
            if (menu && menu.classList.contains('dropdown-menu')) {
                menu.style.display = purchasedModules.includes(module) ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Error checking module access:', error);
        }
    });
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeDropdownVisibility();
});
