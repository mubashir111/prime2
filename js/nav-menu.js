/**
 * PRIM & Associates - Clean, Dependency-Free Responsive Navigation Menu
 */
document.addEventListener('DOMContentLoaded', () => {
    const navMenus = document.querySelectorAll('.guten-nav-menu');
    
    navMenus.forEach(menu => {
        const openToggle = menu.querySelector('.gutenverse-hamburger-menu');
        const closeToggle = menu.querySelector('.gutenverse-close-menu');
        const container = menu.querySelector('.gutenverse-menu-wrapper');
        const overlay = menu.querySelector('.guten-nav-overlay');
        const menuDropdowns = menu.querySelectorAll('li.menu-item-has-children > a');
        const singleMenus = menu.querySelectorAll('li.menu-item:not(.menu-item-has-children) > a');
        
        // Open Navigation Drawer
        if (openToggle && container && overlay) {
            openToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.add('active');
                overlay.classList.add('active');
                overlay.classList.remove('exiting');
            });
        }
        
        // Close Navigation Drawer (Close button click)
        if (closeToggle && container && overlay) {
            closeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove('active');
                overlay.classList.remove('active');
                overlay.classList.add('exiting');
            });
        }
        
        // Close Navigation Drawer (Overlay click)
        if (overlay && container) {
            overlay.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove('active');
                overlay.classList.remove('active');
                overlay.classList.add('exiting');
            });
        }
        
        // Handle dropdown clicks for viewports where mobile toggle applies
        menuDropdowns.forEach(dropdown => {
            const submenu = dropdown.nextElementSibling;
            if (submenu && submenu.classList.contains('sub-menu')) {
                dropdown.addEventListener('click', (e) => {
                    if (window.innerWidth <= 1024) {
                        e.preventDefault();
                        e.stopPropagation();
                        submenu.classList.toggle('dropdown-open');
                        dropdown.parentElement.classList.toggle('dropdown-open');
                    }
                });
            }
        });
        
        // Auto-close navigation drawer on clicking single link items
        singleMenus.forEach(item => {
            item.addEventListener('click', () => {
                if (container && overlay) {
                    container.classList.remove('active');
                    overlay.classList.remove('active');
                    overlay.classList.add('exiting');
                }
            });
        });
    });

    // Uniformly synchronize current menu active state across all pages
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.gutenverse-menu a');
    
    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        const parentLi = link.closest('li');
        if (parentLi) {
            if (currentPath === linkPath || (currentPath === 'index.html' && linkPath === '')) {
                parentLi.classList.add('current-menu-item');
            } else {
                parentLi.classList.remove('current-menu-item');
            }
        }
    });
});
