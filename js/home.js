document.addEventListener('DOMContentLoaded', function() {
    const products = {
        newArrivals: [
            {
                id: 'na1',
                name: 'Tailored Wool Blazer',
                category: 'men',
                type: 'outerwear',
                price: 249.99,
                salePrice: null,
                image: 'images/4-removebg-preview.png',
                rating: 4.8,
                isNew: true,
                isBestseller: false
            },
            {
                id: 'na2',
                name: 'men',
                category: 'men',
                type: 'dresses',
                price: 189.99,
                salePrice: null,
                image: 'images/11-removebg-preview.png',
                rating: 4.7,
                isNew: true,
                isBestseller: true
            },
            {
                id: 'na3',
                name: 'men',
                category: 'men',
                type: 'Suits',
                price: 159.99,
                salePrice: null,
                image: 'images/pts2.jpg',
                rating: 4.9,
                isNew: true,
                isBestseller: false
            },
            {
                id: 'na4',
                name: 'Corporate shirt',
                category: 'men',
                type: 'Corporate shirt',
                price: 89.99,
                salePrice: null,
                image: 'images/M4.jpg',
                rating: 4.6,
                isNew: true,
                isBestseller: true
            }
        ],
        bestsellers: [
            {
                id: 'bs1',
                name: 'Dinner Wear',
                category: 'women',
                type: 'tops',
                price: 119.99,
                salePrice: 89.99,
                image: 'images/nt1.jpg',
                rating: 4.9,
                isNew: false,
                isBestseller: true
            },
            {
                id: 'bs2',
                name: 'Slit and Kaba',
                category: 'women',
                type: 'dress',
                price: 79.99,
                salePrice: null,
                image: 'images/Sk.jpg',
                rating: 4.8,
                isNew: false,
                isBestseller: true
            },
            {
                id: 'bs3',
                name: 'Women',
                category: 'women',
                type: 'dress',
                price: 59.99,
                salePrice: null,
                image: 'images/W7.jpg',
                rating: 4.7,
                isNew: false,
                isBestseller: true
            },
            {
                id: 'bs4',
                name: 'outwear',
                category: 'women',
                type: 'dress',
                price: 129.99,
                salePrice: 99.99,
                image: 'images/dress1.jpg',
                rating: 4.8,
                isNew: false,
                isBestseller: true
            }
        ]
    };

    // Function to render product cards
    function renderProductCard(product) {
        const discountBadge = product.salePrice ? `<span class="discount-badge">-${Math.round((1 - product.salePrice / product.price) * 100)}%</span>` : '';
        const newBadge = product.isNew ? '<span class="new-badge">New</span>' : '';
        const bestsellerBadge = product.isBestseller ? '<span class="bestseller-badge">Bestseller</span>' : '';
        
        const priceDisplay = product.salePrice ? 
            `<span class="price-sale">$${product.salePrice.toFixed(2)}</span>
             <span class="price-original">$${product.price.toFixed(2)}</span>` : 
            `<span class="price">$${product.price.toFixed(2)}</span>`;
        
        // Generate HTML for star rating
        let starsHtml = '';
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                starsHtml += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                starsHtml += '<i class="fas fa-star-half-alt"></i>';
            } else {
                starsHtml += '<i class="far fa-star"></i>';
            }
        }

        return `
            <div class="product-card" data-id="${product.id}">
                <div class="product-badges">
                    ${discountBadge}
                    ${newBadge}
                    ${bestsellerBadge}
                </div>
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-details">
                    <h3 class="product-title">
                        <a href="product.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-category">${capitalizeFirstLetter(product.category)} / ${capitalizeFirstLetter(product.type)}</div>
                    <div class="product-price">
                        ${priceDisplay}
                    </div>
                </div>
            </div>
        `;
    }

    // Helper function to capitalize the first letter of each word
    function capitalizeFirstLetter(string) {
        return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // Function to display products in the "New Arrivals" section
    function displayNewArrivals() {
        const container = document.getElementById('new-arrivals-grid');
        if (!container) return;
        
        // Clear loading spinner
        container.innerHTML = '';
        
        // Add product cards
        products.newArrivals.forEach(product => {
            container.innerHTML += renderProductCard(product);
        });
        
        // Initialize product action buttons
        initProductActions();
    }

    // Function to display products in the "Bestsellers" section
    function displayBestsellers() {
        const container = document.getElementById('bestsellers-grid');
        if (!container) return;
        
        // Clear loading spinner
        container.innerHTML = '';
        
        // Add product cards
        products.bestsellers.forEach(product => {
            container.innerHTML += renderProductCard(product);
        });
        
        // Initialize product action buttons
        initProductActions();
    }

    // Function to initialize product action buttons
    function initProductActions() {
        // Quick view buttons
        document.querySelectorAll('.btn-quick-view').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-id');
                openQuickView(productId);
            });
        });
        
        // Wishlist buttons
        document.querySelectorAll('.btn-wishlist').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-id');
                toggleWishlist(productId, this);
            });
        });
        
        // Add to cart buttons
        document.querySelectorAll('.btn-add-to-cart').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-id');
                addToCart(productId);
            });
        });
    }

    // Function to open quick view modal
    function openQuickView(productId) {
        // Find the product
        let product = findProductById(productId);
        if (!product) return;
        
        // Create modal HTML (simplified version)
        const modalHTML = `
            <div class="quick-view-modal">
                <div class="quick-view-content">
                    <button class="close-modal">&times;</button>
                    <div class="quick-view-grid">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                        </div>
                        <div class="product-info">
                            <h2>${product.name}</h2>
                            <div class="product-price">
                                ${product.salePrice ? 
                                    `<span class="price-sale">$${product.salePrice.toFixed(2)}</span>
                                     <span class="price-original">$${product.price.toFixed(2)}</span>` : 
                                    `<span class="price">$${product.price.toFixed(2)}</span>`}
                            </div>
                            <div class="product-description">
                                <p>This premium ${product.name.toLowerCase()} features exceptional quality and craftsmanship, designed to elevate your style with its timeless appeal.</p>
                            </div>
                            <div class="product-actions">
                                <button class="btn-primary add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
                                <button class="btn-secondary add-to-wishlist-modal" data-id="${product.id}">
                                    <i class="far fa-heart"></i> Add to Wishlist
                                </button>
                            </div>
                            <div class="product-meta">
                                <div class="meta-item">
                                    <span class="meta-label">Category:</span>
                                    <span class="meta-value">${capitalizeFirstLetter(product.category)}</span>
                                </div>
                                <div class="meta-item">
                                    <span class="meta-label">Type:</span>
                                    <span class="meta-value">${capitalizeFirstLetter(product.type)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Create modal element
        const modalElement = document.createElement('div');
        modalElement.className = 'modal-container';
        modalElement.innerHTML = modalHTML;
        document.body.appendChild(modalElement);
        
        // Show modal
        setTimeout(() => {
            modalElement.classList.add('active');
        }, 10);
        
        // Close modal when clicking the close button
        modalElement.querySelector('.close-modal').addEventListener('click', () => {
            modalElement.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(modalElement);
            }, 300);
        });
        
        // Close modal when clicking outside the content
        modalElement.addEventListener('click', function(e) {
            if (e.target === modalElement) {
                modalElement.classList.remove('active');
                setTimeout(() => {
                    document.body.removeChild(modalElement);
                }, 300);
            }
        });
        
        // Add to cart functionality within modal
        modalElement.querySelector('.add-to-cart-modal').addEventListener('click', function() {
            addToCart(productId);
        });
        
        // Add to wishlist functionality within modal
        modalElement.querySelector('.add-to-wishlist-modal').addEventListener('click', function() {
            toggleWishlist(productId, this);
        });
    }

    // Find product by ID
    function findProductById(productId) {
        // Search in new arrivals
        let product = products.newArrivals.find(p => p.id === productId);
        
        // If not found, search in bestsellers
        if (!product) {
            product = products.bestsellers.find(p => p.id === productId);
        }
        
        return product;
    }

    // Function to toggle wishlist
    function toggleWishlist(productId, button) {
        // Get wishlist from localStorage
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        // Check if product is already in wishlist
        const index = wishlist.indexOf(productId);
        
        if (index === -1) {
            // Add to wishlist
            wishlist.push(productId);
            button.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('Product added to wishlist');
        } else {
            // Remove from wishlist
            wishlist.splice(index, 1);
            button.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('Product removed from wishlist');
        }
        
        // Update localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist count badge
        updateWishlistCount();
    }

    // Function to add product to cart
    // function addToCart(productId) {
    //     // Get cart from localStorage
    //     let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
    //     // Check if product is already in cart
    //     const existingItem = cart.find(item => item.id === productId);
        
    //     if (existingItem) {
    //         // Increase quantity
    //         existingItem.quantity += 1;
    //     } else {
    //         // Add new item
    //         cart.push({
    //             id: productId,
    //             quantity: 1,
    //             dateAdded: new Date().toISOString()
    //         });
    //     }
        
    //     // Update localStorage
    //     localStorage.setItem('cart', JSON.stringify(cart));
        
    //     // Show notification
    //     showNotification('Product added to cart');
        
    //     // Update cart count badge
    //     updateCartCount();
    // }

    // Function to update cart count badge
    // function updateCartCount() {
    //     const cart = JSON.parse(localStorage.getItem('cart')) || [];
    //     const count = cart.reduce((total, item) => total + item.quantity, 0);
        
    //     document.querySelector('.cart-count').textContent = count;
    // }

    // Function to update wishlist count badge
    // function updateWishlistCount() {
    //     const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    //     document.querySelector('.wishlist-count').textContent = wishlist.length;
    // }

    // Function to show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('active');
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Hero slider functionality
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const dots = document.querySelectorAll('.hero-dot');
        const prevBtn = document.querySelector('.hero-prev');
        const nextBtn = document.querySelector('.hero-next');
        
        if (!slides.length) return;
        
        let currentSlide = 0;
        
        function showSlide(index) {
            // Hide all slides
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show current slide
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Previous slide
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        });
        
        // Next slide
        nextBtn.addEventListener('click', () => {
            currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        });
        
        // Click on dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // Automatic slide change
        setInterval(() => {
            currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        }, 5000);
    }

    // Newsletter form handling
    // function initNewsletterForm() {
    //     const form = document.getElementById('newsletter-form');
    //     const response = document.getElementById('newsletter-response');
        
    //     if (!form) return;
        
    //     form.addEventListener('submit', function(e) {
    //         e.preventDefault();
            
    //         const email = form.querySelector('input').value;
            
    //         // Simple validation
    //         if (!email || !email.includes('@')) {
    //             response.textContent = 'Please enter a valid email address.';
    //             response.className = 'newsletter-response error';
    //             return;
    //         }
            
    //         // Simulate successful subscription
    //         form.reset();
    //         response.textContent = 'Thank you for subscribing to our newsletter!';
    //         response.className = 'newsletter-response success';
            
    //         // Clear success message after 3 seconds
    //         setTimeout(() => {
    //             response.textContent = '';
    //             response.className = 'newsletter-response';
    //         }, 3000);
    //     });
    // }

    // Mobile menu toggle
    function initMobileMenu() {
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        const mainNav = document.querySelector('.main-nav');
        
        if (!menuToggle || !mainNav) return;
        
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });
    }

    // Check if product is in wishlist and update UI
    function updateWishlistUI() {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        document.querySelectorAll('.btn-wishlist').forEach(button => {
            const productId = button.getAttribute('data-id');
            
            if (wishlist.includes(productId)) {
                button.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                button.innerHTML = '<i class="far fa-heart"></i>';
            }
        });
    }

    // Initialize all functions
    function init() {
        displayNewArrivals();
        displayBestsellers();
        initHeroSlider();
        initNewsletterForm();
        initMobileMenu();
        updateCartCount();
        updateWishlistCount();
        updateWishlistUI();
    }

    // Run initialization
    init();
});

/* <div class="product-actions">
                        <button class="btn-quick-view" data-id="${product.id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-wishlist" data-id="${product.id}">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="btn-add-to-cart" data-id="${product.id}">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                    </div> */