
        document.addEventListener('DOMContentLoaded', function() {
            const categoryFilter = document.getElementById('category-filter');
            const seasonFilter = document.getElementById('season-filter');
            const sortFilter = document.getElementById('sort-filter');
            const collectionsGrid = document.getElementById('collections-grid');
            const collectionCards = collectionsGrid.querySelectorAll('.collection-card');
            const viewButtons = document.querySelectorAll('.view-btn');

            // Filter collections
            function filterCollections() {
                const categoryValue = categoryFilter.value;
                const seasonValue = seasonFilter.value;
                
                collectionCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    const cardSeason = card.getAttribute('data-season');
                    
                    const categoryMatch = categoryValue === 'all' || cardCategory === categoryValue;
                    const seasonMatch = seasonValue === 'all' || cardSeason === seasonValue;
                    
                    if (categoryMatch && seasonMatch) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // Sort collections
            function sortCollections() {
                const sortValue = sortFilter.value;
                const cardsArray = Array.from(collectionCards);
                
                cardsArray.sort((a, b) => {
                    switch(sortValue) {
                        case 'newest':
                            // Sort by order in HTML (newest first)
                            return 0;
                        case 'popular':
                            // Sort by badge (Popular, New, Premium, etc.)
                            const aBadge = a.querySelector('.collection-badge');
                            const bBadge = b.querySelector('.collection-badge');
                            if (aBadge && aBadge.textContent === 'Popular') return -1;
                            if (bBadge && bBadge.textContent === 'Popular') return 1;
                            return 0;
                        case 'price-low':
                            // Sort by price (low to high)
                            const aPrice = parseInt(a.querySelector('.collection-price').textContent.match(/\d+/)[0]);
                            const bPrice = parseInt(b.querySelector('.collection-price').textContent.match(/\d+/)[0]);
                            return aPrice - bPrice;
                        case 'price-high':
                            // Sort by price (high to low)
                            const aPriceHigh = parseInt(a.querySelector('.collection-price').textContent.match(/\d+/)[0]);
                            const bPriceHigh = parseInt(b.querySelector('.collection-price').textContent.match(/\d+/)[0]);
                            return bPriceHigh - aPriceHigh;
                        default:
                            return 0;
                    }
                });
                
                // Reorder cards in DOM
                cardsArray.forEach(card => {
                    collectionsGrid.appendChild(card);
                });
            }

            // View toggle functionality
            viewButtons.forEach(button => {
                button.addEventListener('click', function() {
                    viewButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    const viewType = this.getAttribute('data-view');
                    if (viewType === 'list') {
                        collectionsGrid.style.gridTemplateColumns = '1fr';
                        collectionCards.forEach(card => {
                            card.style.display = card.style.display === 'none' ? 'none' : 'flex';
                            card.style.flexDirection = 'row';
                            card.style.height = '200px';
                            
                            const image = card.querySelector('.collection-image');
                            const content = card.querySelector('.collection-content');
                            if (image && content) {
                                image.style.width = '300px';
                                image.style.flexShrink = '0';
                                content.style.flex = '1';
                                content.style.display = 'flex';
                                content.style.flexDirection = 'column';
                                content.style.justifyContent = 'space-between';
                            }
                        });
                    } else {
                        collectionsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(350px, 1fr))';
                        collectionCards.forEach(card => {
                            card.style.display = card.style.display === 'none' ? 'none' : 'block';
                            card.style.flexDirection = 'column';
                            card.style.height = 'auto';
                            
                            const image = card.querySelector('.collection-image');
                            const content = card.querySelector('.collection-content');
                            if (image && content) {
                                image.style.width = '100%';
                                image.style.flexShrink = 'initial';
                                content.style.flex = 'initial';
                                content.style.display = 'block';
                                content.style.flexDirection = 'initial';
                                content.style.justifyContent = 'initial';
                            }
                        });
                    }
                });
            });

            // Search functionality
            const searchInput = document.querySelector('.search-input');
            const searchBtn = document.querySelector('.search-btn');

            function searchCollections() {
                const searchTerm = searchInput.value.toLowerCase();
                
                collectionCards.forEach(card => {
                    const title = card.querySelector('.collection-title').textContent.toLowerCase();
                    const description = card.querySelector('.collection-description').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || description.includes(searchTerm)) {
                        card.style.display = card.style.display === 'none' ? card.style.display : 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // Event listeners
            categoryFilter.addEventListener('change', filterCollections);
            seasonFilter.addEventListener('change', filterCollections);
            sortFilter.addEventListener('change', sortCollections);
            searchBtn.addEventListener('click', searchCollections);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    searchCollections();
                }
            });

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Add loading animation for collection cards
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Initially hide cards for animation
            collectionCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
                observer.observe(card);
            });

            // Header scroll effect
            let lastScrollTop = 0;
            const header = document.getElementById('header');
            
            window.addEventListener('scroll', function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down
                    header.style.transform = 'translateY(-100%)';
                } else {
                    // Scrolling up
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            });

            // Add transition to header
            header.style.transition = 'transform 0.3s ease-in-out';

            // Update cart and wishlist counts (placeholder functionality)
            function updateCounts() {
                const cartCount = localStorage.getItem('cartCount') || '0';
                const wishlistCount = localStorage.getItem('wishlistCount') || '0';
                
                document.querySelector('.cart-count').textContent = cartCount;
                document.querySelector('.wishlist-count').textContent = wishlistCount;
            }

            updateCounts();

            // Add to cart/wishlist functionality (placeholder)
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('btn-primary') && e.target.textContent.includes('Shop')) {
                    // Simulate adding to cart
                    let cartCount = parseInt(localStorage.getItem('cartCount') || '0');
                    cartCount += 1;
                    localStorage.setItem('cartCount', cartCount.toString());
                    updateCounts();
                    
                    // Show feedback
                    const originalText = e.target.textContent;
                    e.target.textContent = 'Added to Cart!';
                    e.target.style.background = '#27ae60';
                    
                    setTimeout(() => {
                        e.target.textContent = originalText;
                        e.target.style.background = '#333';
                    }, 2000);
                }
            });

            // Mobile menu toggle (if needed)
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const mainNav = document.querySelector('.main-nav');
            
            if (mobileMenuToggle) {
                mobileMenuToggle.addEventListener('click', function() {
                    mainNav.classList.toggle('active');
                });
            }

            // Lazy loading for images
            const images = document.querySelectorAll('img[src*="placeholder"]');
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Here you would typically load the actual image
                        // For now, we'll just add a loaded class for styling
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        });

        // Additional utility functions
        function showNotification(message, type = 'info') {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // Add CSS for notifications
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);