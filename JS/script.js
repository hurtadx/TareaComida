document.addEventListener('DOMContentLoaded', function() {
    
    
    const cartBtn = document.getElementById('cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');
    const addToCartBtn = document.getElementById('add-to-cart');
    const priceTotal = document.getElementById('precio-total');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartCount = document.querySelector('.cart-count');
    const selectedItemsContainer = document.getElementById('selected-items');
    const addPopularBtns = document.querySelectorAll('.add-popular');
    const burgerPreviewImg = document.getElementById('burger-preview-img');
    
    
    const burgerImages = [
        'IMG/hamburguesa.png', 
        'IMG/buger-ovi.png',
        '/Pngtree—hamburger_6722039.png',
        'IMG/Pngtree—chicken cheesy burger_6851610.png',
        'IMG/MArtxel_Dic_2024-14-removebg-preview.png',
        'IMG/ANGEL-2048x1013.png',
        'IMG/BODI-2048x1196.png'
    ];
    
    
    const ingredientTypes = [
        { name: 'bread', isRequired: true, label: 'Pan', type: 'radio' },
        { name: 'meat', isRequired: true, label: 'Carne', type: 'radio' },
        { name: 'cheese', isRequired: false, label: 'Quesos', type: 'checkbox' },
        { name: 'veggies', isRequired: false, label: 'Vegetales', type: 'checkbox' },
        { name: 'premium', isRequired: false, label: 'Extras Premium', type: 'checkbox' },
        { name: 'sauces', isRequired: false, label: 'Salsas', type: 'checkbox' }
    ];
    
    
    let cart = [];
    
    
    init();
    
    
    function init() {
        
        loadCart();
        
        
        setupEventListeners();
        
        
        updateSelectedItems();
        
        
        calculateTotal();
        
        
        setRandomBurgerPreview();
        
        
        setRandomCardImages();
        
        enableMobileFeatures();
    }
    
    
    function setupEventListeners() {
        
        cartBtn.addEventListener('click', toggleCart);
        closeCartBtn.addEventListener('click', toggleCart);
        
        
        window.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                toggleCart();
            }
        });
        
        
        addToCartBtn.addEventListener('click', addBurgerToCart);
        
        
        addPopularBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                addPopularBurger(btn.dataset.id, btn.dataset.price);
            });
        });
        
        
        ingredientTypes.forEach(type => {
            const inputs = document.querySelectorAll(`input[name="${type.name}"]`);
            inputs.forEach(input => {
                input.addEventListener('change', function() {
                    updateSelectedItems();
                    calculateTotal();
                    
                    setRandomBurgerPreview();
                });
            });
        });
        
        
        checkoutBtn.addEventListener('click', processCheckout);
        
        
        window.addEventListener('orientationchange', function() {
            
            setTimeout(() => {
                setRandomCardImages();
            }, 300);
        });

        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                const isMobile = window.innerWidth <= 768;
                document.body.classList.toggle('is-mobile', isMobile);
            }, 250);
        });

        
        document.body.classList.toggle('is-mobile', window.innerWidth <= 768);
    }
    
    
    function setRandomBurgerPreview() {
        const randomIndex = Math.floor(Math.random() * burgerImages.length);
        burgerPreviewImg.src = burgerImages[randomIndex];
        
        
        burgerPreviewImg.classList.add('image-change');
        setTimeout(() => {
            burgerPreviewImg.classList.remove('image-change');
        }, 500);
    }
    
    
    function setRandomCardImages() {
        const burgerCards = document.querySelectorAll('.burger-card .burger-img img');
        
        burgerCards.forEach(img => {
            
            if (img.src.includes('clasica.jpg') || 
                img.src.includes('bacon.jpg') || 
                img.src.includes('veggie.jpg')) {
                return;
            }
            
            const randomIndex = Math.floor(Math.random() * burgerImages.length);
            img.src = burgerImages[randomIndex];
        });
    }
    
    
    function toggleCart() {
        cartModal.classList.toggle('open');
        document.body.style.overflow = cartModal.classList.contains('open') ? 'hidden' : '';
        
        if (cartModal.classList.contains('open')) {
            renderCartItems();
        }
    }
    
    
    function updateSelectedItems() {
        const selectedItems = [];
        
        ingredientTypes.forEach(type => {
            let selectedElements = [];
            
            if (type.type === 'radio') {
                const selected = document.querySelector(`input[name="${type.name}"]:checked`);
                if (selected) {
                    selectedElements.push({
                        name: selected.value,
                        price: parseInt(selected.dataset.price)
                    });
                }
            } else {
                const checked = document.querySelectorAll(`input[name="${type.name}"]:checked`);
                if (checked.length > 0) {
                    checked.forEach(item => {
                        selectedElements.push({
                            name: item.value,
                            price: parseInt(item.dataset.price)
                        });
                    });
                }
            }
            
            if (selectedElements.length > 0) {
                selectedItems.push({
                    type: type.label,
                    items: selectedElements
                });
            }
        });
        
        
        if (selectedItems.length > 0) {
            let html = '<ul>';
            selectedItems.forEach(category => {
                if (category.items.length > 0) {
                    html += `<li><strong>${category.type}:</strong> `;
                    if (category.items.length === 1) {
                        html += `${category.items[0].name}`;
                    } else {
                        html += category.items.map(item => item.name).join(', ');
                    }
                    html += '</li>';
                }
            });
            html += '</ul>';
            selectedItemsContainer.innerHTML = html;
        } else {
            selectedItemsContainer.innerHTML = '<p>Personaliza tu hamburguesa</p>';
        }
    }
    
    
    function calculateTotal() {
        let total = 0;
        
        ingredientTypes.forEach(type => {
            if (type.type === 'radio') {
                const selected = document.querySelector(`input[name="${type.name}"]:checked`);
                if (selected) {
                    total += parseInt(selected.dataset.price);
                }
            } else {
                const checked = document.querySelectorAll(`input[name="${type.name}"]:checked`);
                checked.forEach(item => {
                    total += parseInt(item.dataset.price);
                });
            }
        });
        
        
        priceTotal.textContent = formatCurrency(total);
        return total;
    }
    
    function formatCurrency(value) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(value).replace('COP', '').trim();
    }
    
    function addBurgerToCart() {
        
        const breadSelected = document.querySelector('input[name="bread"]:checked');
        const meatSelected = document.querySelector('input[name="meat"]:checked');
        
        if (!breadSelected || !meatSelected) {
            alert('Debes seleccionar un tipo de pan y un tipo de carne');
            return;
        }
        
        
        const selectedIngredients = [];
        const total = calculateTotal();
        
        
        const breadName = breadSelected.value;
        const meatName = meatSelected.value;
        let burgerName = `Hamburguesa de ${meatName} en pan ${breadName}`;
        
        
        ingredientTypes.forEach(type => {
            if (type.type === 'radio') {
                const selected = document.querySelector(`input[name="${type.name}"]:checked`);
                if (selected) {
                    const label = selected.nextElementSibling.textContent;
                    selectedIngredients.push({
                        category: type.label,
                        item: label
                    });
                }
            } else {
                const checked = document.querySelectorAll(`input[name="${type.name}"]:checked`);
                if (checked.length > 0) {
                    checked.forEach(item => {
                        const label = item.nextElementSibling.textContent;
                        selectedIngredients.push({
                            category: type.label,
                            item: label
                        });
                    });
                }
            }
        });
        
        
        const newBurger = {
            id: 'custom-' + Date.now(),
            name: 'Hamburguesa Personalizada',
            description: burgerName,
            ingredients: selectedIngredients,
            price: total,
            quantity: 1,
            image: burgerPreviewImg.src, 
            isCustom: true
        };
        
        
        addToCart(newBurger);
        
        
        showNotification('¡Hamburguesa añadida al carrito!');
        
        
        setRandomBurgerPreview();
    }
    
    function addPopularBurger(burgerId, price) {
        
        let burgerName, burgerDescription, burgerIngredients, burgerImg;
        
        switch (burgerId) {
            case 'clasica':
                burgerName = 'La Clásica';
                burgerDescription = 'Hamburguesa de vacuno con queso cheddar, lechuga, tomate y nuestra salsa especial.';
                burgerIngredients = [
                    { category: 'Pan', item: 'Pan Normal' },
                    { category: 'Carne', item: 'Vacuno' },
                    { category: 'Quesos', item: 'Queso Cheddar' },
                    { category: 'Vegetales', item: 'Lechuga y Tomate' }
                ];
                burgerImg = document.querySelector(`.burger-card [data-id="${burgerId}"]`).closest('.burger-card').querySelector('img').src;
                break;
            case 'bacon':
                burgerName = 'La Bacon';
                burgerDescription = 'Hamburguesa de vacuno con queso, tocineta crujiente y salsa BBQ.';
                burgerIngredients = [
                    { category: 'Pan', item: 'Pan Brioche' },
                    { category: 'Carne', item: 'Vacuno' },
                    { category: 'Quesos', item: 'Queso Cheddar' },
                    { category: 'Extras Premium', item: 'Tocineta' },
                    { category: 'Salsas', item: 'BBQ' }
                ];
                burgerImg = document.querySelector(`.burger-card [data-id="${burgerId}"]`).closest('.burger-card').querySelector('img').src;
                break;
            case 'veggie':
                burgerName = 'La Veggie';
                burgerDescription = 'Hamburguesa vegana con aguacate, lechuga y tomate en pan integral.';
                burgerIngredients = [
                    { category: 'Pan', item: 'Pan Integral' },
                    { category: 'Carne', item: 'Vegana' },
                    { category: 'Vegetales', item: 'Aguacate, Lechuga y Tomate' }
                ];
                burgerImg = document.querySelector(`.burger-card [data-id="${burgerId}"]`).closest('.burger-card').querySelector('img').src;
                break;
            default:
                burgerName = 'Hamburguesa Popular';
                burgerDescription = 'Hamburguesa deliciosa';
                burgerIngredients = [];
                burgerImg = getRandomBurgerImage();
        }
        
        
        const popularBurger = {
            id: burgerId,
            name: burgerName,
            description: burgerDescription,
            ingredients: burgerIngredients,
            price: parseInt(price),
            quantity: 1,
            image: burgerImg,
            isCustom: false
        };
        
        
        addToCart(popularBurger);
        
        
        showNotification('¡Hamburguesa añadida al carrito!');
    }
    
    function getRandomBurgerImage() {
        const randomIndex = Math.floor(Math.random() * burgerImages.length);
        return burgerImages[randomIndex];
    }
    
    function addToCart(burger) {
        
        const existingItemIndex = cart.findIndex(item => {
            if (burger.isCustom) {
                
                return false;
            } else {
                
                return item.id === burger.id;
            }
        });
        
        if (existingItemIndex !== -1) {
            
            cart[existingItemIndex].quantity++;
        } else {
            
            cart.push(burger);
        }
        
        
        saveCart();
        updateCartCount();
    }
    
    function renderCartItems() {
        if (cart.length === 0) {
            cartItems.innerHTML = '<div class="cart-empty"><i class="fas fa-shopping-basket"></i><p>Tu carrito está vacío</p></div>';
            cartTotal.textContent = '$0';
            return;
        }
        
        
        let html = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="cart-item">
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <p class="cart-item-desc">${item.description}</p>
                        <div class="cart-item-price">${formatCurrency(item.price)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                            <span class="item-quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                        </div>
                    </div>
                    <button class="cart-item-remove" onclick="removeItem(${index})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
        });
        
        cartItems.innerHTML = html;
        cartTotal.textContent = formatCurrency(total);
    }
    
    function updateCartCount() {
        
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        
        cartCount.classList.add('animate');
        setTimeout(() => {
            cartCount.classList.remove('animate');
        }, 300);
    }
    
    function loadCart() {
        
        const savedCart = localStorage.getItem('gonzaloBurgerCart');
        if (savedCart) {
            try {
                cart = JSON.parse(savedCart);
                updateCartCount();
            } catch (e) {
                console.error('Error al cargar el carrito:', e);
                cart = [];
            }
        }
    }
    
    function saveCart() {
        
        localStorage.setItem('gonzaloBurgerCart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function processCheckout() {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        
        alert('¡Gracias por tu compra! Tu pedido ha sido procesado.');
        
        
        cart = [];
        saveCart();
        renderCartItems();
        toggleCart(); 
        
        
        showNotification('¡Compra realizada con éxito!', 'success');
    }
    
    function showNotification(message, type = 'info') {
        
        const notification = document.createElement('div');
        notification.classList.add('notification', type);
        
        
        let icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'success') icon = 'check-double';
        
        notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
        document.body.appendChild(notification);
        
        
        setTimeout(() => {
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
        }, 100);
    }
    
    function enableMobileFeatures() {
        
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            
            function animateCartButton() {
                const cartContainer = document.querySelector('.cart-container');
                cartContainer.classList.add('added');
                
                setTimeout(() => {
                    cartContainer.classList.remove('added');
                }, 500);
            }
            
            
            window.originalShowNotification = showNotification;
            showNotification = function(message, type = 'info') {
                
                const notification = document.createElement('div');
                notification.classList.add('notification', type, 'mobile');
                
                let icon = 'check-circle';
                if (type === 'error') icon = 'exclamation-circle';
                if (type === 'success') icon = 'check-double';
                
                notification.innerHTML = `<i class="fas fa-${icon}"></i> ${message}`;
                document.body.appendChild(notification);
                
                
                animateCartButton();
                
                setTimeout(() => {
                    notification.classList.add('show');
                    setTimeout(() => {
                        notification.classList.remove('show');
                        setTimeout(() => {
                            document.body.removeChild(notification);
                        }, 300);
                    }, 2000); 
                }, 100);
            };
            
            
            const originalAddToCart = addToCart;
            addToCart = function(burger) {
                originalAddToCart(burger);
                
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            };
        }
    }
    
    
    window.increaseQuantity = function(index) {
        cart[index].quantity++;
        saveCart();
        renderCartItems();
    };
    
    window.decreaseQuantity = function(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            saveCart();
            renderCartItems();
        } else {
            removeItem(index);
        }
    };
    
    window.removeItem = function(index) {
        
        const cartItemEl = document.querySelectorAll('.cart-item')[index];
        cartItemEl.classList.add('removing');
        
        setTimeout(() => {
            cart.splice(index, 1);
            saveCart();
            renderCartItems();
        }, 300);
    };
});