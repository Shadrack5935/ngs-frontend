// Apply filters to products
function applyFiltersToProducts(filters) {
    const params = getUrlParams();
    const products = getProducts(params.category, params.type);
    const filteredProducts = filterProducts(products, filters);
    const sortedProducts = sortProducts(filteredProducts, params.sort);
    
    // Reset to first page when filters change
    displayProducts(sortedProducts, 1);
}

// Handle sorting
function handleSorting() {
    const sortSelect = document.getElementById('sort-by');
    
    sortSelect.addEventListener('change', function() {
        const params = getUrlParams();
        const products = getProducts(params.category, params.type);
        const filters = getActiveFilters();
        const filteredProducts = filterProducts(products, filters);
        const sortedProducts = sortProducts(filteredProducts, this.value);
        
        // Update URL to reflect sort option
        const url = new URL(window.location.href);
        url.searchParams.set('sort', this.value);
        window.history.replaceState({}, '', url);
        
        displayProducts(sortedProducts, params.page);
    });
    
    // Set initial sort value from URL
    sortSelect.value = getUrlParams().sort || 'featured';
}

// Add event listeners for product cards
function handleProductInteractions() {
    const productsGrid = document.getElementById('category-products-grid');
    
    productsGrid.addEventListener('click', function(event) {
        // Quick view button
        if (event.target.closest('.quick-view')) {
            const productId = event.target.closest('.quick-view').dataset.productId;
            openQuickView(productId);
        }
        
        // Add to wishlist button
        if (event.target.closest('.add-to-wishlist')) {
            const button = event.target.closest('.add-to-wishlist');
            const productId = button.dataset.productId;
            addToWishlist(productId);
            
            // Toggle heart icon
            const heartIcon = button.querySelector('i');
            heartIcon.classList.toggle('far');
            heartIcon.classList.toggle('fas');
        }
        
        // Add to cart button
        if (event.target.closest('.btn-add-to-cart')) {
            const productId = event.target.closest('.btn-add-to-cart').dataset.productId;
            addToCart(productId);
        }
        
        // Record product view when clicking product link
        if (event.target.closest('.product-card')) {
            const productId = event.target.closest('.product-card').dataset.productId;
            
            // Only record if clicking on product link or image
            if (event.target.closest('.product-name a') || event.target.closest('.product-image a')) {
                recordProductView(productId);
            }
        }
    });
}

// Quick view modal
function openQuickView(productId) {
    // Find product
    let product = null;
    
    Object.keys(productsData).forEach(category => {
        Object.keys(productsData[category]).forEach(type => {
            const found = productsData[category][type].find(p => p.id === productId);
            if (found) product = found;
        });
    });
    
    if (!product) return;
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'quick-view-modal';
        modal.className = 'modal';
        document.body.appendChild(modal);
    }
    
    const hasDiscount = product.salePrice !== null;
    const price = hasDiscount ? product.salePrice : product.price;
    const originalPrice = hasDiscount ? product.price : null;
    
    // Populate modal content
    modal.innerHTML = `
        <div class="modal-content quick-view-content">
            <span class="close-modal">&times;</span>
            <div class="quick-view-layout">
                <div class="quick-view-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="quick-view-details">
                    <h2 class="product-name">${product.name}</h2>
                    <div class="product-price">
                        ${hasDiscount ? `<span class="sale-price">${price.toFixed(2)}</span>
                                        <span class="original-price">${originalPrice.toFixed(2)}</span>` 
                                     : `<span class="regular-price">${price.toFixed(2)}</span>`}
                    </div>
                    <div class="product-rating">
                        ${createStarRating(product.rating)}
                        <span class="rating-count">(${Math.floor(product.rating * 10)})</span>
                    </div>
                    <p class="product-description">${getProductDescription(product)}</p>
                    
                    <div class="product-options">
                        <div class="color-options">
                            <label>Color:</label>
                            <div class="option-values">
                                ${product.colors.map(color => `
                                    <div class="color-option">
                                        <input type="radio" name="color" id="color-${color}" value="${color}">
                                        <label for="color-${color}">
                                            <span class="color-swatch" style="background-color: ${getColorCode(color)}"></span>
                                            <span class="color-name">${color}</span>
                                        </label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="size-options">
                            <label>Size:</label>
                            <div class="option-values">
                                ${product.sizes.map(size => `
                                    <div class="size-option">
                                        <input type="radio" name="size" id="size-${size}" value="${size}">
                                        <label for="size-${size}">${size}</label>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="quantity-selector">
                            <label>Quantity:</label>
                            <div class="quantity-control">
                                <button class="quantity-btn minus">-</button>
                                <input type="number" class="quantity-input" value="1" min="1" max="10">
                                <button class="quantity-btn plus">+</button>
                            </div>
                        </div>
                    </div>
                    
                    <div class="product-actions">
                        <button class="btn-primary add-to-cart-modal" data-product-id="${product.id}">Add to Cart</button>
                        <button class="btn-secondary add-to-wishlist-modal" data-product-id="${product.id}">
                            <i class="far fa-heart"></i> Add to Wishlist
                        </button>
                    </div>
                    
                    <div class="product-meta">
                        <div class="meta-item">
                            <span class="meta-label">Category:</span>
                            <a href="category.html?category=${product.category}">${formatText(product.category)}</a>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Type:</span>
                            <a href="category.html?category=${product.category}&type=${product.type}">${formatText(product.type)}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'block';
    
    // Close modal when clicking X or outside modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle quantity buttons
    const minusBtn = modal.querySelector('.quantity-btn.minus');
    const plusBtn = modal.querySelector('.quantity-btn.plus');
    const quantityInput = modal.querySelector('.quantity-input');
    
    minusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    });
    
    plusBtn.addEventListener('click', () => {
        const currentValue = parseInt(quantityInput.value);
        if (currentValue < 10) {
            quantityInput.value = currentValue + 1;
        }
    });
    
    // Handle add to cart from modal
    const addToCartBtn = modal.querySelector('.add-to-cart-modal');
    addToCartBtn.addEventListener('click', () => {
        const color = modal.querySelector('input[name="color"]:checked')?.value;
        const size = modal.querySelector('input[name="size"]:checked')?.value;
        const quantity = parseInt(modal.querySelector('.quantity-input').value);
        
        if (!color || !size) {
            alert('Please select color and size');
            return;
        }
        
        addToCart(product.id, {
            color,
            size,
            quantity
        });
        
        modal.style.display = 'none';
    });
    
    // Handle add to wishlist from modal
    const addToWishlistBtn = modal.querySelector('.add-to-wishlist-modal');
    addToWishlistBtn.addEventListener('click', () => {
        addToWishlist(product.id);
        
        // Toggle heart icon
        const heartIcon = addToWishlistBtn.querySelector('i');
        heartIcon.classList.toggle('far');
        heartIcon.classList.toggle('fas');
    });
}

// Add to cart functionality
function addToCart(productId, options = {}) {
    // Find the product
    let product = null;
    
    Object.keys(productsData).forEach(category => {
        Object.keys(productsData[category]).forEach(type => {
            const found = productsData[category][type].find(p => p.id === productId);
            if (found) product = found;
        });
    });
    
    if (!product) return;
    
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Create cart item
    const cartItem = {
        id: productId,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.image,
        color: options.color || product.colors[0],
        size: options.size || product.sizes[0],
        quantity: options.quantity || 1
    };
    
    // Check if product is already in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.color === cartItem.color && 
        item.size === cartItem.size
    );
    
    if (existingItemIndex !== -1) {
        // Update quantity
        cart[existingItemIndex].quantity += cartItem.quantity;
    } else {
        // Add new item
        cart.push(cartItem);
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Show success message
    showNotification('Product added to cart successfully!');
}

// Add to wishlist functionality
function addToWishlist(productId) {
    // Get wishlist from localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Check if product is already in wishlist
    const existingItem = wishlist.find(id => id === productId);
    
    if (!existingItem) {
        // Add to wishlist
        wishlist.push(productId);
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        
        // Update wishlist count
        updateWishlistCount();
        
        // Show success message
        showNotification('Product added to wishlist!');
    } else {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter(id => id !== productId);
        
        // Save to localStorage
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        
        // Update wishlist count
        updateWishlistCount();
        
        // Show success message
        showNotification('Product removed from wishlist!');
    }
}

// Record product view
function recordProductView(productId) {
    // Get recently viewed from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    
    // Remove if already in the list
    const updatedRecentlyViewed = recentlyViewed.filter(id => id !== productId);
    
    // Add to the beginning of the list
    updatedRecentlyViewed.unshift(productId);
    
    // Keep only the last 10 items
    const limitedRecentlyViewed = updatedRecentlyViewed.slice(0, 10);
    
    // Save to localStorage
    localStorage.setItem('recentlyViewed', JSON.stringify(limitedRecentlyViewed));
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    let totalItems = 0;
    cart.forEach(item => {
        totalItems += item.quantity;
    });
    
    cartCount.textContent = totalItems;
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const wishlistCount = document.querySelector('.wishlist-count');
    
    wishlistCount.textContent = wishlist.length;
}

// Show notification
function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }
    
    // Set message
    notification.textContent = message;
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Initialize the page
function initCategoryPage() {
    const params = getUrlParams();
    
    // Update page header
    updatePageHeader(params.category, params.type);
    
    // Update category banner
    updateCategoryBanner(params.category);
    
    // Create filter options
    createFilterOptions();
    
    // Get products
    const products = getProducts(params.category, params.type);
    const sortedProducts = sortProducts(products, params.sort);
    
    // Display products
    displayProducts(sortedProducts, params.page);
    
    // Initialize view switcher
    initViewSwitcher();
    
    // Load recently viewed products
    loadRecentlyViewed();
    
    // Initialize filters
    handleFilters();
    
    // Initialize sorting
    handleSorting();
    
    // Initialize product interactions
    handleProductInteractions();
    
    // Update cart and wishlist counts
    updateCartCount();
    updateWishlistCount();
}

// Load everything when DOM is ready
document.addEventListener('DOMContentLoaded', initCategoryPage);

// Handle mobile menu toggle
document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
    document.querySelector('.main-nav').classList.toggle('active');
    this.classList.toggle('active');
});

// Handle submenu on mobile
if (window.innerWidth < 768) {
    document.querySelectorAll('.has-submenu > .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('submenu-open');
        });
    });
}// Static data for products
const productsData = {
    women: {
        dresses: [
            {
                id: 'w-dress-1',
                name: 'Floral Summer Dress',
                price: 89.99,
                salePrice: null,
                rating: 4.5,
                colors: ['Blue', 'Red', 'White'],
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                image: 'images/1-removebg-preview.png',
                category: 'women',
                type: 'dresses',
                isNew: true,
                isFeatured: true,
                dateAdded: '2025-04-15'
            },
            {
                id: 'w-dress-2',
                name: 'Evening Gown',
                price: 149.99,
                salePrice: 119.99,
                rating: 4.8,
                colors: ['Black', 'Navy', 'Burgundy'],
                sizes: ['S', 'M', 'L'],
                image: 'images/2-removebg-preview.png',
                category: 'women',
                type: 'dresses',
                isNew: false,
                isFeatured: true,
                dateAdded: '2025-03-20'
            },
            {
                id: 'w-dress-3',
                name: 'Casual Maxi Dress',
                price: 69.99,
                salePrice: null,
                rating: 4.2,
                colors: ['Green', 'Yellow', 'Pink'],
                sizes: ['XS', 'S', 'M', 'L'],
                image: 'images/11-removebg-preview.png',
                category: 'women',
                type: 'dresses',
                isNew: true,
                isFeatured: false,
                dateAdded: '2025-05-01'
            },
            {
                id: 'w-dress-4',
                name: 'Cocktail Dress',
                price: 119.99,
                salePrice: null,
                rating: 4.7,
                colors: ['Red', 'Black'],
                sizes: ['S', 'M', 'L'],
                image: 'images/3-removebg-preview.png',
                category: 'women',
                type: 'dresses',
                isNew: false,
                isFeatured: true,
                dateAdded: '2025-02-10'
            }
        ],
        tops: [
            {
                id: 'w-top-1',
                name: 'V-Neck Blouse',
                price: 49.99,
                salePrice: 39.99,
                rating: 4.3,
                colors: ['White', 'Black', 'Blue'],
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                image: 'images/4-removebg-preview.png',
                category: 'women',
                type: 'tops',
                isNew: true,
                isFeatured: false,
                dateAdded: '2025-04-25'
            },
            {
                id: 'w-top-2',
                name: 'Casual T-Shirt',
                price: 29.99,
                salePrice: null,
                rating: 3.9,
                colors: ['White', 'Gray', 'Pink', 'Blue'],
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                image: 'images/8-removebg-preview.png',
                category: 'women',
                type: 'tops',
                isNew: false,
                isFeatured: false,
                dateAdded: '2025-03-15'
            }
        ],
        bottoms: [
            {
                id: 'w-bottom-1',
                name: 'Slim Fit Jeans',
                price: 79.99,
                salePrice: null,
                rating: 4.6,
                colors: ['Blue', 'Black', 'Gray'],
                sizes: ['24', '26', '28', '30', '32'],
                image: 'images/w7.jpg',
                category: 'women',
                type: 'bottoms',
                isNew: false,
                isFeatured: true,
                dateAdded: '2025-04-10'
            },
            {
                id: 'w-bottom-2',
                name: 'Pleated Skirt',
                price: 59.99,
                salePrice: 49.99,
                rating: 4.1,
                colors: ['Black', 'Navy', 'Beige'],
                sizes: ['XS', 'S', 'M', 'L'],
                image: 'images/9.jpg',
                category: 'women',
                type: 'bottoms',
                isNew: true,
                isFeatured: false,
                dateAdded: '2025-05-05'
            }
        ]
    },
    men: {
        shirts: [
            {
                id: 'm-shirt-1',
                name: 'Oxford Button-Down',
                price: 69.99,
                salePrice: null,
                rating: 4.4,
                colors: ['White', 'Blue', 'Pink'],
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                image: 'images/11-removebg-preview.png',
                category: 'men',
                type: 'shirts',
                isNew: true,
                isFeatured: true,
                dateAdded: '2025-04-20'
            },
            {
                id: 'm-shirt-2',
                name: 'Casual Polo',
                price: 49.99,
                salePrice: 39.99,
                rating: 4.2,
                colors: ['Black', 'Navy', 'Gray', 'Red'],
                sizes: ['S', 'M', 'L', 'XL'],
                image: 'images/8-removebg-preview.png',
                category: 'men',
                type: 'shirts',
                isNew: false,
                isFeatured: false,
                dateAdded: '2025-03-25'
            }
        ],
        pants: [
            {
                id: 'm-pant-1',
                name: 'Chino Pants',
                price: 89.99,
                salePrice: null,
                rating: 4.5,
                colors: ['Khaki', 'Navy', 'Olive'],
                sizes: ['30', '32', '34', '36', '38'],
                image: 'images/1-removebg-preview.png',
                category: 'men',
                type: 'pants',
                isNew: false,
                isFeatured: true,
                dateAdded: '2025-04-12'
            },
            {
                id: 'm-pant-2',
                name: 'Slim Fit Dress Pants',
                price: 99.99,
                salePrice: 79.99,
                rating: 4.3,
                colors: ['Black', 'Navy', 'Gray'],
                sizes: ['30', '32', '34', '36'],
                image: 'images/2-removebg-preview.png',
                category: 'men',
                type: 'pants',
                isNew: true,
                isFeatured: false,
                dateAdded: '2025-05-02'
            }
        ]
    },
};

// Category banners data
const categoryBanners = {
    women: {
        image: 'images/W3.jpg',
        title: "Women's Collection",
        subtitle: "Elegant designs for the modern woman",
        cta: "Explore Now"
    },
    men: {
        image: 'images/3-removebg-preview.png',
        title: "Men's Collection",
        subtitle: "Sophisticated styles for every occasion",
        cta: "Shop Collection"
    },
};

// Parse URL parameters
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        category: params.get('category') || 'women',
        type: params.get('type') || null,
        page: parseInt(params.get('page')) || 1,
        sort: params.get('sort') || 'featured'
    };
}

// Get all products for a category or category+type
function getProducts(category, type = null) {
    if (!productsData[category]) {
        return [];
    }
    
    if (type && productsData[category][type]) {
        return productsData[category][type];
    }
    
    // If no type specified, return all products from the category
    return Object.values(productsData[category]).flat();
}

// Sort products based on sort criteria
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'newest':
            sortedProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
            break;
        case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
        case 'featured':
        default:
            sortedProducts.sort((a, b) => {
                // Featured items first, then new items, then by date added
                if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
                if (a.isNew !== b.isNew) return a.isNew ? -1 : 1;
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            });
    }
    
    return sortedProducts;
}

// Filter products based on criteria
function filterProducts(products, filters) {
    if (!filters || Object.keys(filters).length === 0) {
        return products;
    }
    
    return products.filter(product => {
        // Price filter
        if (filters.minPrice !== undefined && (product.salePrice || product.price) < filters.minPrice) {
            return false;
        }
        if (filters.maxPrice !== undefined && (product.salePrice || product.price) > filters.maxPrice) {
            return false;
        }
        
        // Color filter
        if (filters.colors && filters.colors.length > 0) {
            if (!product.colors.some(color => filters.colors.includes(color))) {
                return false;
            }
        }
        
        // Size filter
        if (filters.sizes && filters.sizes.length > 0) {
            if (!product.sizes.some(size => filters.sizes.includes(size))) {
                return false;
            }
        }
        
        // Rating filter
        if (filters.minRating !== undefined && product.rating < filters.minRating) {
            return false;
        }
        
        return true;
    });
}

// Update page title and breadcrumbs
function updatePageHeader(category, type) {
    const pageTitle = document.querySelector('.page-title h1');
    const breadcrumbsContainer = document.querySelector('.breadcrumbs');
    
    // Update title
    if (type) {
        pageTitle.textContent = formatText(`${type} ${category}`);
    } else {
        pageTitle.textContent = formatText(category);
    }
    
    // Update breadcrumbs
    breadcrumbsContainer.innerHTML = `
        <a href="index.html">Home</a>
        <span class="breadcrumb-separator">/</span>
        <a href="category.html?category=${category}">${formatText(category)}</a>
        ${type ? `<span class="breadcrumb-separator">/</span>
                <span class="current">${formatText(type)}</span>` : ''}
    `;
}

// Update category banner
function updateCategoryBanner(category) {
    const banner = document.getElementById('category-banner');
    const bannerData = categoryBanners[category] || categoryBanners.women;
    
    banner.innerHTML = `
        <div class="banner-image">
            <img src="${bannerData.image}" alt="${bannerData.title}">
        </div>
        <div class="banner-content">
            <h2>${bannerData.title}</h2>
            <p>${bannerData.subtitle}</p>
            <a href="#" class="btn-primary">${bannerData.cta}</a>
        </div>
    `;
}

// Create filter UI for colors and sizes
function createFilterOptions() {
    const params = getUrlParams();
    const products = getProducts(params.category, params.type);
    
    // Get unique colors
    const allColors = new Set();
    products.forEach(product => {
        product.colors.forEach(color => allColors.add(color));
    });
    
    // Populate color filters
    const colorFiltersContainer = document.querySelector('.color-filters');
    colorFiltersContainer.innerHTML = '';
    
    Array.from(allColors).sort().forEach(color => {
        const colorElement = document.createElement('label');
        colorElement.className = 'color-option';
        colorElement.innerHTML = `
            <input type="checkbox" value="${color}" class="color-checkbox">
            <span class="color-name">${color}</span>
        `;
        colorFiltersContainer.appendChild(colorElement);
    });
    
    // Get unique sizes
    const allSizes = new Set();
    products.forEach(product => {
        product.sizes.forEach(size => allSizes.add(size));
    });
    
    // Populate size filters
    const sizeFiltersContainer = document.querySelector('.size-filters');
    sizeFiltersContainer.innerHTML = '';
    
    Array.from(allSizes).sort((a, b) => {
        // Sort sizes properly (XS, S, M, L, XL, etc.)
        const sizeOrder = { 'XS': 1, 'S': 2, 'M': 3, 'L': 4, 'XL': 5, 'XXL': 6 };
        if (sizeOrder[a] && sizeOrder[b]) {
            return sizeOrder[a] - sizeOrder[b];
        }
        // For numeric sizes
        if (!isNaN(a) && !isNaN(b)) {
            return parseInt(a) - parseInt(b);
        }
        // Default to string comparison
        return a.localeCompare(b);
    }).forEach(size => {
        const sizeElement = document.createElement('label');
        sizeElement.className = 'size-option';
        sizeElement.innerHTML = `
            <input type="checkbox" value="${size}" class="size-checkbox">
            <span class="size-label">${size}</span>
        `;
        sizeFiltersContainer.appendChild(sizeElement);
    });
}

// Create product card
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.dataset.productId = product.id;
    
    const hasDiscount = product.salePrice !== null;
    const price = hasDiscount ? product.salePrice : product.price;
    const originalPrice = hasDiscount ? product.price : null;
    
    productCard.innerHTML = `
        <div class="product-image">
            <a href="product.html?id=${product.id}">
                <img src="${product.image}" alt="${product.name}">
            </a>
            ${product.isNew ? '<span class="product-badge new">New</span>' : ''}
            ${hasDiscount ? `<span class="product-badge sale">Sale</span>` : ''}
            <div class="product-actions">
                <button class="action-btn quick-view" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i>
                    <span class="tooltip">Quick View</span>
                </button>
                <button class="action-btn add-to-wishlist" data-product-id="${product.id}">
                    <i class="far fa-heart"></i>
                    <span class="tooltip">Add to Wishlist</span>
                </button>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">
                <a href="product.html?id=${product.id}">${product.name}</a>
            </h3>
            <div class="product-price">
                ${hasDiscount ? `<span class="sale-price">$${price.toFixed(2)}</span>
                                <span class="original-price">$${originalPrice.toFixed(2)}</span>` 
                             : `<span class="regular-price">$${price.toFixed(2)}</span>`}
            </div>
            <div class="product-rating">
                ${createStarRating(product.rating)}
                <span class="rating-count">(${Math.floor(product.rating * 10)})</span>
            </div>
            <div class="product-colors">
                ${product.colors.slice(0, 4).map(color => `
                    <span class="color-dot" style="background-color: ${getColorCode(color)};" title="${color}"></span>
                `).join('')}
                ${product.colors.length > 4 ? `<span class="color-more">+${product.colors.length - 4}</span>` : ''}
            </div>
            <button class="btn-add-to-cart" data-product-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    // For list view additional elements
    const listViewInfo = document.createElement('div');
    listViewInfo.className = 'list-view-info';
    listViewInfo.innerHTML = `
        <p class="product-description">
            ${getProductDescription(product)}
        </p>
        <div class="product-sizes">
            <span class="sizes-label">Available Sizes:</span>
            <div class="sizes-list">
                ${product.sizes.map(size => `<span class="size-item">${size}</span>`).join('')}
            </div>
        </div>
    `;
    
    productCard.appendChild(listViewInfo);
    
    return productCard;
}

// Generate product description based on type
function getProductDescription(product) {
    const descriptions = {
        dresses: "Elegant and versatile dress perfect for any occasion. Made with high-quality fabric for comfort and durability.",
        tops: "Stylish and comfortable top that pairs well with any bottom. Great for casual or semi-formal settings.",
        bottoms: "Well-fitted and comfortable bottom wear designed with premium materials for everyday elegance.",
        shirts: "Classic and refined shirt made with premium cotton. Perfect for business or casual settings.",
        pants: "Sophisticated pants crafted with attention to detail. Offers both comfort and style for the modern man.",
        bags: "Spacious and elegantly designed bag made with premium materials. Perfect for everyday use or special occasions.",
        jewelry: "Exquisite piece that adds elegance to any outfit. Crafted with attention to detail for a timeless look.",
        watches: "Precision timepiece with elegant design. Combines functionality with sophisticated style."
    };
    
    return descriptions[product.type] || "Premium quality item from our exclusive collection, designed for style and comfort.";
}

// Create star rating HTML
function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Get color code from color name
function getColorCode(colorName) {
    const colorMap = {
        'Black': '#000000',
        'White': '#FFFFFF',
        'Red': '#FF0000',
        'Blue': '#0000FF',
        'Green': '#008000',
        'Yellow': '#FFFF00',
        'Pink': '#FFC0CB',
        'Purple': '#800080',
        'Orange': '#FFA500',
        'Gray': '#808080',
        'Navy': '#000080',
        'Brown': '#A52A2A',
        'Gold': '#FFD700',
        'Silver': '#C0C0C0',
        'Beige': '#F5F5DC',
        'Burgundy': '#800020',
        'Tan': '#D2B48C',
        'Olive': '#808000',
        'Rose Gold': '#B76E79',
        'Khaki': '#C3B091'
    };
    
    return colorMap[colorName] || '#CCCCCC';
}

// Format text for display (capitalize, etc.)
function formatText(text) {
    if (!text) return '';
    
    // Convert to title case and handle special formatting
    return text.split('-').join(' ')
        .split('_').join(' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Generate pagination links
function createPagination(totalProducts, currentPage, itemsPerPage) {
    const paginationContainer = document.getElementById('products-pagination');
    paginationContainer.innerHTML = '';
    
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    if (totalPages <= 1) return;
    
    const params = getUrlParams();
    
    // Create pagination elements
    const pagination = document.createElement('ul');
    pagination.className = 'pagination-list';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = 'pagination-item prev';
    if (currentPage === 1) {
        prevLi.classList.add('disabled');
    }
    prevLi.innerHTML = `
        <a href="${currentPage > 1 ? createPaginationUrl(params, currentPage - 1) : '#'}">
            <i class="fas fa-chevron-left"></i>
        </a>
    `;
    pagination.appendChild(prevLi);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `pagination-item ${i === currentPage ? 'active' : ''}`;
        pageLi.innerHTML = `
            <a href="${createPaginationUrl(params, i)}">${i}</a>
        `;
        pagination.appendChild(pageLi);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = 'pagination-item next';
    if (currentPage === totalPages) {
        nextLi.classList.add('disabled');
    }
    nextLi.innerHTML = `
        <a href="${currentPage < totalPages ? createPaginationUrl(params, currentPage + 1) : '#'}">
            <i class="fas fa-chevron-right"></i>
        </a>
    `;
    pagination.appendChild(nextLi);
    
    paginationContainer.appendChild(pagination);
}

// Create URL for pagination links
function createPaginationUrl(params, page) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page);
    return url.toString();
}

// Display products on the page
function displayProducts(products, page = 1, itemsPerPage = 12) {
    const productsGrid = document.getElementById('category-products-grid');
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = products.slice(startIndex, endIndex);
    
    // Remove loading spinner if it exists
    const spinner = productsGrid.querySelector('.loading-spinner');
    if (spinner) {
        spinner.remove();
    }
    
    // Clear existing products
    productsGrid.innerHTML = '';
    
    // Display products
    if (paginatedProducts.length > 0) {
        paginatedProducts.forEach(product => {
            productsGrid.appendChild(createProductCard(product));
        });
    } else {
        productsGrid.innerHTML = `
            <div class="no-products-message">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or browse our other categories.</p>
            </div>
        `;
    }
    
    // Update product count
    document.getElementById('products-total').textContent = products.length;
    
    // Create pagination
    createPagination(products.length, page, itemsPerPage);
}

// Handle view switching (grid vs list)
function initViewSwitcher() {
    const viewButtons = document.querySelectorAll('.view-option');
    const productsContainer = document.querySelector('.products-container');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const view = this.dataset.view;
            
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update view class
            productsContainer.className = `products-container ${view}-view`;
        });
    });
}

// Load recently viewed products
function loadRecentlyViewed() {
    // Try to get from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
    const container = document.getElementById('recently-viewed-products');
    
    if (recentlyViewed.length === 0) {
        container.innerHTML = `<p class="no-recent">No recently viewed products</p>`;
        return;
    }
    
    // Find products based on IDs
    const recentProducts = [];
    recentlyViewed.forEach(productId => {
        // Search for the product in our data
        Object.keys(productsData).forEach(category => {
            Object.keys(productsData[category]).forEach(type => {
                const found = productsData[category][type].find(p => p.id === productId);
                if (found) recentProducts.push(found);
            });
        });
    });
    
    // Display products
    container.innerHTML = '';
    recentProducts.slice(0, 8).forEach(product => {
        container.appendChild(createProductCard(product));
    });
}

// Handle filter application
function handleFilters() {
    const applyFiltersBtn = document.getElementById('apply-filters');
    const clearFiltersBtn = document.getElementById('clear-filters');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const applyPriceBtn = document.getElementById('apply-price');
    
    // Apply all filters
    applyFiltersBtn.addEventListener('click', () => {
        const filters = getActiveFilters();
        applyFiltersToProducts(filters);
    });
    
    // Apply price filter only
    applyPriceBtn.addEventListener('click', () => {
        const filters = getActiveFilters();
        applyFiltersToProducts(filters);
    });
    
    // Clear all filters
    clearFiltersBtn.addEventListener('click', () => {
        // Reset all checkboxes
        document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price inputs
        priceMinInput.value = '';
        priceMaxInput.value = '';
        
        // Reload products without filters
        const params = getUrlParams();
        const products = getProducts(params.category, params.type);
        const sortedProducts = sortProducts(products, params.sort);
        displayProducts(sortedProducts, params.page);
    });
}

// Get current active filters
function getActiveFilters() {
    const filters = {};
    
    // Price range
    const minPrice = parseFloat(document.getElementById('price-min').value);
    const maxPrice = parseFloat(document.getElementById('price-max').value);
    
    if (!isNaN(minPrice)) filters.minPrice = minPrice;
    if (!isNaN(maxPrice)) filters.maxPrice = maxPrice;
    
    // Colors
    const selectedColors = [];
    document.querySelectorAll('.color-checkbox:checked').forEach(checkbox => {
        selectedColors.push(checkbox.value);
    });
    
    if (selectedColors.length > 0) {
        filters.colors = selectedColors;
    }
    
    // Sizes
    const selectedSizes = [];
    document.querySelectorAll('.size-checkbox:checked').forEach(checkbox => {
        selectedSizes.push(checkbox.value);
    });
    
    if (selectedSizes.length > 0) {
        filters.sizes = selectedSizes;
    }
    
    // Rating
    const ratingCheckboxes = document.querySelectorAll('.rating-option input:checked');
    if (ratingCheckboxes.length > 0) {
        // Get the highest minimum rating
        let minRating = 0;
        ratingCheckboxes.forEach(checkbox => {
            const rating = parseInt(checkbox.value);
            if (rating > minRating) {
                minRating = rating;
            }
        });
        
        filters.minRating = minRating;
    }
    
    return filters;
}