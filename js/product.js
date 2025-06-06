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
                    name: 'Classic Dress Shirt',
                    category: 'men',
                    type: 'shirts',
                    price: 189.99,
                    salePrice: null,
                    image: 'images/11-removebg-preview.png',
                    rating: 4.7,
                    isNew: true,
                    isBestseller: true
                },
                {
                    id: 'na3',
                    name: 'Business Suit',
                    category: 'men',
                    type: 'suits',
                    price: 159.99,
                    salePrice: null,
                    image: 'images/pts2.jpg',
                    rating: 4.9,
                    isNew: true,
                    isBestseller: false
                },
                {
                    id: 'na4',
                    name: 'Corporate Shirt',
                    category: 'men',
                    type: 'shirts',
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
                    name: 'Slit and Kaba',
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
                    name: 'Elegant Dress',
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
                    name: 'Evening Gown',
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

        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            initProductPage();
            loadRelatedProducts();
            updateCartCount();
            updateWishlistCount();
        });

        function initProductPage() {
            // Thumbnail image switching
            document.querySelectorAll('.thumbnail').forEach(thumb => {
                thumb.addEventListener('click', function() {
                    // Remove active class from all thumbnails
                    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    // Add active class to clicked thumbnail
                    this.classList.add('active');
                    // Update main image
                    const newSrc = this.querySelector('img').src;
                    document.getElementById('main-product-image').src = newSrc;
                });
            });

            // Size selection
            document.querySelectorAll('.size-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.size-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Color selection
            document.querySelectorAll('.color-option').forEach(option => {
                option.addEventListener('click', function() {
                    document.querySelectorAll('.color-option').forEach(o => o.classList.remove('active'));
                    this.classList.add('active');
                });
            });

            // Quantity controls
            document.getElementById('decrease-qty').addEventListener('click', function() {
                const input = document.getElementById('quantity');
                if (input.value > 1) {
                    input.value = parseInt(input.value) - 1;
                }
            });

            document.getElementById('increase-qty').addEventListener('click', function() {
                const input = document.getElementById('quantity');
                if (input.value < 10) {
                    input.value = parseInt(input.value) + 1;
                }
            });

            // Add to cart
            document.getElementById('add-to-cart').addEventListener('click', function() {
                const size = document.querySelector('.size-option.active').dataset.size;
                const color = document.querySelector('.color-option.active').dataset.color;
                const quantity = parseInt(document.getElementById('quantity').value);
                
                addToCart('na1', { size, color, quantity });
            });

            // Add to wishlist
            document.getElementById('add-to-wishlist').addEventListener('click', function() {
                toggleWishlist('na1', this);
            });
        }

        function loadRelatedProducts() {
            const container = document.getElementById('related-products-grid');
            const relatedProducts = [...products.newArrivals.slice(1), ...products.bestsellers.slice(0, 3)];
            
            container.innerHTML = '';
            
            relatedProducts.forEach(product => {
                container.innerHTML += renderProductCard(product);
            });

            // Initialize product actions for related products
            initProductActions();
        }

        function renderProductCard(product) {
            const discountBadge = product.salePrice ? `<span class="badge discount-badge">-${Math.round((1 - product.salePrice / product.price) * 100)}%</span>` : '';
            const newBadge = product.isNew ? '<span class="badge new-badge">New</span>' : '';
            const bestsellerBadge = product.isBestseller ? '<span class="badge bestseller-badge">Bestseller</span>' : '';
            
            const priceDisplay = product.salePrice ? 
                `<span class="price-sale">${product.salePrice.toFixed(2)}</span>
                 <span class="price-original">${product.price.toFixed(2)}</span>` : 
                `<span class="price">${product.price.toFixed(2)}</span>`;
            
            // Generate HTML for star rating
            // let starsHtml = '';
            // const fullStars = Math.floor(product.rating);
            // const hasHalfStar = product.rating % 1 >= 0.5;
            
            // for (let i = 0; i < 5; i++) {
            //     if (i < fullStars) {
            //         starsHtml += '<i class="fas fa-star"></i>';
            //     } else if (i === fullStars && hasHalfStar) {
            //         starsHtml += '<i class="fas fa-star-half-alt"></i>';
            //     } else {
            //         starsHtml += '<i class="far fa-star"></i>';
            //     }
            // }

            return `
                <div class="product-card" data-id="${product.id}">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-badges">
                            ${discountBadge}
                            ${newBadge}
                            ${bestsellerBadge}
                        </div>
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
            // <div class="product-actions">
            //                 <button class="action-btn btn-quick-view" data-id="${product.id}" title="Quick View">
            //                     <i class="fas fa-eye"></i>
            //                 </button>
            //                 <button class="action-btn btn-wishlist" data-id="${product.id}" title="Add to Wishlist">
            //                     <i class="far fa-heart"></i>
            //                 </button>
            //                 <button class="action-btn btn-add-to-cart" data-id="${product.id}" title="Add to Cart">
            //                     <i class="fas fa-shopping-bag"></i>
            //                 </button>
            //             </div>
        }

        function capitalizeFirstLetter(string) {
            return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

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

        function openQuickView(productId) {
            // Find the product
            let product = findProductById(productId);
            if (!product) return;
            
            // Show quick view notification
            showNotification(`Quick view for ${product.name} - Feature coming soon!`);
        }

        function findProductById(productId) {
            // Search in new arrivals
            let product = products.newArrivals.find(p => p.id === productId);
            
            // If not found, search in bestsellers
            if (!product) {
                product = products.bestsellers.find(p => p.id === productId);
            }
            
            return product;
        }

        function toggleWishlist(productId, button) {
            // Get wishlist from memory (since localStorage is not available)
            let wishlist = JSON.parse(sessionStorage.getItem('wishlist')) || [];
            
            // Check if product is already in wishlist
            const index = wishlist.indexOf(productId);
            
            if (index === -1) {
                // Add to wishlist
                wishlist.push(productId);
                if (button) {
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-heart';
                    }
                }
                showNotification('Product added to wishlist');
            } else {
                // Remove from wishlist
                wishlist.splice(index, 1);
                if (button) {
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = 'far fa-heart';
                    }
                }
                showNotification('Product removed from wishlist');
            }
            
            // Update sessionStorage
            sessionStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Update wishlist count badge
            updateWishlistCount();
        }

        function addToCart(productId, options = {}) {
            // Get cart from memory (since localStorage is not available)
            let cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            
            // Check if product is already in cart
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                // Increase quantity
                existingItem.quantity += options.quantity || 1;
            } else {
                // Add new item
                cart.push({
                    id: productId,
                    quantity: options.quantity || 1,
                    size: options.size || 'M',
                    color: options.color || 'black',
                    dateAdded: new Date().toISOString()
                });
            }
            
            // Update sessionStorage
            sessionStorage.setItem('cart', JSON.stringify(cart));
            
            // Show notification
            const product = findProductById(productId);
            showNotification(`${product ? product.name : 'Product'} added to cart`);
            
            // Update cart count badge
            updateCartCount();
        }

        function updateCartCount() {
            const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
            const count = cart.reduce((total, item) => total + item.quantity, 0);
            
            const cartCountElement = document.querySelector('.cart-count');
            if (cartCountElement) {
                cartCountElement.textContent = count;
            }
        }

        function updateWishlistCount() {
            const wishlist = JSON.parse(sessionStorage.getItem('wishlist')) || [];
            const wishlistCountElement = document.querySelector('.wishlist-count');
            if (wishlistCountElement) {
                wishlistCountElement.textContent = wishlist.length;
            }
        }

        function showNotification(message) {
            // Remove existing notification if any
            const existingNotification = document.querySelector('.notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
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
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, 3000);
        }