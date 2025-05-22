

/**
 * main.js - Core functionality for eG COLLECTIONS website
 * Handles navigation, UI interactions, and global site features
 */

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    initMobileMenu();
    
    // Header scroll effect
    initHeaderScroll();
    
    // Newsletter form submission
    initNewsletterForm();
    
    // Hero slider functionality
    initHeroSlider();
    
    // Initialize cart and wishlist counters
    updateCartCount();
    updateWishlistCount();
});

/**
 * Initialize mobile menu toggle functionality
 */
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.main-navigation') && mainNav.classList.contains('active')) {
                mobileMenuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Handle submenu toggle on mobile
    const hasSubmenuItems = document.querySelectorAll('.has-submenu');
    
    hasSubmenuItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        
        // Create mobile dropdown toggle
        const dropdownToggle = document.createElement('button');
        dropdownToggle.className = 'submenu-toggle';
        dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
        
        if (window.innerWidth < 992) {
            link.parentNode.insertBefore(dropdownToggle, link.nextSibling);
        }
        
        // Handle submenu toggle click
        dropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle current submenu
            this.classList.toggle('active');
            const submenu = this.parentNode.querySelector('.submenu');
            submenu.classList.toggle('active');
            
            // Close other submenus
            hasSubmenuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherSubmenu = otherItem.querySelector('.submenu');
                    const otherToggle = otherItem.querySelector('.submenu-toggle');
                    if (otherSubmenu && otherSubmenu.classList.contains('active')) {
                        otherSubmenu.classList.remove('active');
                        otherToggle.classList.remove('active');
                    }
                }
            });
        });
    });
    
    // Adjust submenu position
    window.addEventListener('resize', function() {
        const hasSubmenuItems = document.querySelectorAll('.has-submenu');
        
        hasSubmenuItems.forEach(item => {
            const submenu = item.querySelector('.submenu');
            const link = item.querySelector('.nav-link');
            
            if (window.innerWidth >= 992) {
                // Desktop: Position submenu centered under nav item
                if (submenu) {
                    const navItemRect = item.getBoundingClientRect();
                    submenu.style.left = `${navItemRect.left}px`;
                    const subMenuWidth = submenu.offsetWidth;
                    const navItemCenter = navItemRect.left + (navItemRect.width / 2);
                    const leftOffset = navItemCenter - (subMenuWidth / 2);
                    
                    // Ensure submenu doesn't go off-screen
                    const rightEdge = leftOffset + subMenuWidth;
                    const viewportWidth = window.innerWidth;
                    
                    if (leftOffset < 0) {
                        submenu.style.left = '0';
                    } else if (rightEdge > viewportWidth) {
                        submenu.style.left = 'auto';
                        submenu.style.right = '0';
                    } else {
                        submenu.style.left = `${leftOffset}px`;
                    }
                }
                
                // Remove mobile dropdown toggles
                const dropdownToggles = document.querySelectorAll('.submenu-toggle');
                dropdownToggles.forEach(toggle => toggle.remove());
            } else {
                // Mobile: Reset positioning
                if (submenu) {
                    submenu.style.left = '';
                    submenu.style.right = '';
                }
                
                // Add mobile dropdown toggles if needed
                if (!item.querySelector('.submenu-toggle')) {
                    const dropdownToggle = document.createElement('button');
                    dropdownToggle.className = 'submenu-toggle';
                    dropdownToggle.innerHTML = '<i class="fas fa-chevron-down"></i>';
                    link.parentNode.insertBefore(dropdownToggle, link.nextSibling);
                    
                    dropdownToggle.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        this.classList.toggle('active');
                        item.querySelector('.submenu').classList.toggle('active');
                    });
                }
            }
        });
    });
}

/**
 * Initialize header scroll effect
 */
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (header) {
        // Add scroll class on page load if not at top
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        }
        
        // Add/remove scroll class on scroll
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
}

/**
 * Initialize newsletter form submission
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterResponse = document.getElementById('newsletter-response');
    
    if (newsletterForm && newsletterResponse) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNewsletterResponse('Please enter your email address.', 'error');
                return;
            }
            
            // Simulate form submission
            newsletterForm.classList.add('submitting');
            
            // In a real application, you would send this to your backend
            setTimeout(function() {
                newsletterForm.classList.remove('submitting');
                showNewsletterResponse('Thank you for subscribing!', 'success');
                emailInput.value = '';
            }, 1000);
        });
    }
}

/**
 * Show newsletter response message
 * @param {string} message - The response message
 * @param {string} type - The response type (success/error)
 */
function showNewsletterResponse(message, type) {
    const newsletterResponse = document.getElementById('newsletter-response');
    
    if (newsletterResponse) {
        newsletterResponse.textContent = message;
        newsletterResponse.className = 'newsletter-response';
        newsletterResponse.classList.add(type);
        
        // Hide message after 5 seconds
        setTimeout(function() {
            newsletterResponse.textContent = '';
            newsletterResponse.className = 'newsletter-response';
        }, 5000);
    }
}

/**
 * Initialize hero slider functionality
 */
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.querySelector('.hero-prev');
    const nextBtn = document.querySelector('.hero-next');
    
    if (!slides.length) return;
    
    let currentSlide = 0;
    const slideCount = slides.length;
    let slideInterval;
    
    // Show specific slide
    function showSlide(index) {
        // Remove active class from all slides
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Add active class to current slide
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        currentSlide = index;
    }
    
    // Move to next slide
    function nextSlide() {
        let newIndex = currentSlide + 1;
        if (newIndex >= slideCount) newIndex = 0;
        showSlide(newIndex);
    }
    
    // Move to previous slide
    function prevSlide() {
        let newIndex = currentSlide - 1;
        if (newIndex < 0) newIndex = slideCount - 1;
        showSlide(newIndex);
    }
    
    // Add event listeners to controls
    if (nextBtn) nextBtn.addEventListener('click', function() {
        nextSlide();
        resetSlideInterval();
    });
    
    if (prevBtn) prevBtn.addEventListener('click', function() {
        prevSlide();
        resetSlideInterval();
    });
    
    // Add event listeners to dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', function() {
            showSlide(index);
            resetSlideInterval();
        });
    });
    
    // Automatic slide rotation
    function startSlideInterval() {
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    function resetSlideInterval() {
        clearInterval(slideInterval);
        startSlideInterval();
    }
    
    // Start automatic rotation
    startSlideInterval();
    
    // Pause rotation on hover
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        heroSlider.addEventListener('mouseleave', startSlideInterval);
    }
}

/**
 * Update cart item count display
 */
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    if (!cartCountElements.length) return;
    
    // Get cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('egCart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update all cart count elements
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
        if (cartCount > 0) {
            element.classList.add('has-items');
        } else {
            element.classList.remove('has-items');
        }
    });
}

/**
 * Update wishlist item count display 
 */
function updateWishlistCount() {
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    if (!wishlistCountElements.length) return;
    
    // Get wishlist data from localStorage
    const wishlist = JSON.parse(localStorage.getItem('egWishlist')) || [];
    const wishlistCount = wishlist.length;
    
    // Update all wishlist count elements
    wishlistCountElements.forEach(element => {
        element.textContent = wishlistCount;
        if (wishlistCount > 0) {
            element.classList.add('has-items');
        } else {
            element.classList.remove('has-items');
        }
    });
}

/**
 * Add item to cart
 * @param {Object} product - Product object
 * @param {number} quantity - Quantity to add
 */
function addToCart(product, quantity = 1) {
    // Get current cart
    let cart = JSON.parse(localStorage.getItem('egCart')) || [];
    
    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex > -1) {
        // Update quantity of existing item
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save updated cart
    localStorage.setItem('egCart', JSON.stringify(cart));
    
    // Update cart count display
    updateCartCount();
    
    // Show notification
    showNotification(`Added ${product.name} to your cart`);
}

/**
 * Toggle item in wishlist
 * @param {Object} product - Product object
 * @returns {boolean} - true if added, false if removed
 */
function toggleWishlist(product) {
    // Get current wishlist
    let wishlist = JSON.parse(localStorage.getItem('egWishlist')) || [];
    
    // Check if product already exists in wishlist
    const existingItemIndex = wishlist.findIndex(item => item.id === product.id);
    
    let added = false;
    
    if (existingItemIndex > -1) {
        // Remove item from wishlist
        wishlist.splice(existingItemIndex, 1);
    } else {
        // Add new item to wishlist
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
        });
        added = true;
    }
    
    // Save updated wishlist
    localStorage.setItem('egWishlist', JSON.stringify(wishlist));
    
    // Update wishlist count display
    updateWishlistCount();
    
    // Show notification
    if (added) {
        showNotification(`Added ${product.name} to your wishlist`);
    } else {
        showNotification(`Removed ${product.name} from your wishlist`);
    }
    
    return added;
}

/**
 * Check if a product is in the wishlist
 * @param {string|number} productId - Product ID to check
 * @returns {boolean} - true if in wishlist
 */
function isInWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('egWishlist')) || [];
    return wishlist.some(item => item.id === productId);
}

/**
 * Show notification message
 * @param {string} message - Notification message
 */
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @returns {string} - Formatted price
 */
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}