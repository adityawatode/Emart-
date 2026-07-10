document.addEventListener('DOMContentLoaded', () => {
    const interactionStyles = document.createElement('style');
    interactionStyles.textContent = `
        [hidden] { display: none !important; }
        .product-card, .category-card { cursor: pointer; }
        .product-card:focus-visible, .category-card:focus-visible { outline: 3px solid #2874f0; outline-offset: 3px; }
        .site-toast { position: fixed; right: 24px; bottom: 24px; z-index: 20; max-width: min(360px, calc(100vw - 48px)); padding: 14px 18px; border-radius: 8px; background: #212121; color: #fff; box-shadow: 0 12px 30px rgba(0,0,0,.2); opacity: 0; transform: translateY(12px); pointer-events: none; transition: opacity .2s, transform .2s; }
        .site-toast.is-visible { opacity: 1; transform: translateY(0); }
        .interactive-panel { position: fixed; z-index: 30; top: 50%; left: 50%; width: min(430px, calc(100vw - 32px)); max-height: min(80vh, 600px); overflow: auto; transform: translate(-50%, -50%); padding: 30px; border: 0; border-radius: 16px; background: #fff; box-shadow: 0 20px 70px rgba(15,23,42,.3); }
        .interactive-panel::before { content: ''; position: fixed; z-index: -1; inset: 0; background: rgba(15,23,42,.45); }
        .interactive-panel h2 { margin-bottom: 12px; }
        .interactive-panel p { color: #6b7280; line-height: 1.5; }
        .panel-close { position: absolute; top: 12px; right: 14px; border: 0; background: transparent; color: #4b5563; font-size: 1.8rem; cursor: pointer; }
        .interactive-panel ul { display: grid; gap: 12px; margin-top: 20px; list-style: none; }
        .interactive-panel li { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid #e5e7eb; }
        .login-form { display: grid; gap: 16px; margin-top: 20px; }
        .login-form label { display: grid; gap: 8px; font-weight: 600; }
        .login-form input { padding: 12px; border: 1px solid #d1d5db; border-radius: 6px; font: inherit; }
        .login-form button { border: 0; cursor: pointer; }
        .search-empty-state { padding: 24px; text-align: center; color: #6b7280; background: #fff; border-radius: 12px; }
        .product-detail { width: min(760px, calc(100vw - 32px)); display: grid; grid-template-columns: minmax(180px, .85fr) 1.15fr; gap: 28px; }
        .product-detail-image { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; background: #f3f4f6; }
        .product-detail-category { margin-bottom: 8px; color: #2874f0 !important; font-weight: 700; }
        .product-detail-price { margin: 14px 0 8px; font-size: 1.6rem; color: #212121; }
        .product-detail-discount { color: #10b981 !important; font-weight: 700; }
        .product-detail-meta { margin-top: 14px; padding-top: 14px; border-top: 1px solid #e5e7eb; }
        .detail-add-button { width: 100%; margin-top: 22px; border: 0; cursor: pointer; }
        @media (max-width: 560px) { .product-detail { grid-template-columns: 1fr; gap: 18px; } }
    `;
    document.head.append(interactionStyles);

    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const navChips = [...document.querySelectorAll('.nav-chip')];
    const categoryCards = [...document.querySelectorAll('.category-card')];
    const productCards = [...document.querySelectorAll('.product-card')];
    const cartButton = document.querySelector('.cart-btn');
    const loginButton = document.querySelector('.text-btn');
    const moreButton = document.querySelectorAll('.text-btn')[1];
    let cart = [];

    const getProduct = (card) => ({
        name: card.querySelector('h3').textContent.trim(),
        price: card.querySelector('.price').textContent.trim(),
        category: card.querySelector('.card-category').textContent.trim(),
        discount: card.querySelector('.discount').textContent.trim(),
        meta: card.querySelector('.card-meta').textContent.trim(),
        image: card.querySelector('img').src,
        imageAlt: card.querySelector('img').alt,
    });

    const showToast = (message) => {
        let toast = document.querySelector('.site-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'site-toast';
            toast.setAttribute('role', 'status');
            document.body.append(toast);
        }

        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 2600);
    };

    const filterProducts = (query = '') => {
        const term = query.trim().toLowerCase();
        let visible = 0;

        productCards.forEach((card) => {
            const product = getProduct(card);
            const matches = !term || [product.name, product.category, card.textContent]
                .join(' ')
                .toLowerCase()
                .includes(term);
            card.hidden = !matches;
            if (matches) visible += 1;
        });

        const emptyState = document.querySelector('.search-empty-state');
        if (emptyState) emptyState.hidden = visible !== 0;
        return visible;
    };

    const setActiveChip = (label) => {
        navChips.forEach((chip) => {
            const active = chip.textContent.trim().toLowerCase() === label.toLowerCase();
            chip.classList.toggle('active', active);
            chip.setAttribute('aria-pressed', String(active));
        });
    };

    const updateCart = () => {
        const count = cart.length;
        cartButton.textContent = count ? `Cart (${count})` : 'Cart';
        cartButton.setAttribute('aria-label', `${count} item${count === 1 ? '' : 's'} in cart`);
    };

    const closePanels = () => document.querySelectorAll('.interactive-panel').forEach((panel) => panel.remove());

    const openPanel = (type) => {
        closePanels();
        const panel = document.createElement('section');
        panel.className = 'interactive-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.tabIndex = -1;

        if (type === 'cart') {
            const items = cart.length
                ? `<ul>${cart.map((item) => `<li><span>${item.name}</span><strong>${item.price}</strong></li>`).join('')}</ul>`
                : '<p>Your cart is empty. Click a product to add it.</p>';
            panel.innerHTML = `<button class="panel-close" aria-label="Close">×</button><h2>Your Cart</h2>${items}`;
        } else if (type === 'login') {
            panel.innerHTML = `<button class="panel-close" aria-label="Close">×</button><h2>Welcome back</h2><p>Sign in to save your items and track orders.</p><form class="login-form"><label>Email or mobile number<input required type="text" autocomplete="username"></label><button class="btn btn-primary" type="submit">Continue</button></form>`;
        } else {
            panel.innerHTML = '<button class="panel-close" aria-label="Close">×</button><h2>More on Flipkart</h2><p>Explore orders, wishlists, customer care, and seller services.</p>';
        }

        document.body.append(panel);
        panel.focus();
        const closeButton = panel.querySelector('.panel-close');
        closeButton.textContent = String.fromCharCode(215);
        closeButton.addEventListener('click', closePanels);
        panel.querySelector('.login-form')?.addEventListener('submit', (event) => {
            event.preventDefault();
            closePanels();
            showToast('Login is ready to connect to your backend.');
        });
    };

    const openProductDetails = (card) => {
        closePanels();
        const product = getProduct(card);
        const panel = document.createElement('section');
        panel.className = 'interactive-panel product-detail';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-modal', 'true');
        panel.setAttribute('aria-label', `${product.name} details`);
        panel.tabIndex = -1;
        panel.innerHTML = `
            <button class="panel-close" aria-label="Close"></button>
            <img class="product-detail-image" src="${product.image}" alt="${product.imageAlt}">
            <div>
                <p class="product-detail-category">${product.category}</p>
                <h2>${product.name}</h2>
                <p class="product-detail-price">${product.price}</p>
                <p class="product-detail-discount">${product.discount}</p>
                <p class="product-detail-meta">${product.meta}</p>
                <p>Eligible for secure payments, easy returns, and delivery updates at checkout.</p>
                <button class="btn btn-primary detail-add-button" type="button">Add to Cart</button>
            </div>
        `;

        document.body.append(panel);
        panel.focus();
        const closeButton = panel.querySelector('.panel-close');
        closeButton.textContent = String.fromCharCode(215);
        closeButton.addEventListener('click', closePanels);
        panel.querySelector('.detail-add-button').addEventListener('click', () => {
            cart.push(product);
            updateCart();
            closePanels();
            showToast(`${product.name} added to cart`);
        });
    };

    const emptyState = document.createElement('p');
    emptyState.className = 'search-empty-state';
    emptyState.textContent = 'No products found. Try another search term.';
    emptyState.hidden = true;
    document.querySelector('.product-section .grid-cards').after(emptyState);

    searchButton.addEventListener('click', () => {
        const matches = filterProducts(searchInput.value);
        if (searchInput.value.trim()) showToast(`${matches} product${matches === 1 ? '' : 's'} found`);
    });
    searchInput.addEventListener('input', () => filterProducts(searchInput.value));
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') searchButton.click();
    });

    navChips.forEach((chip) => {
        chip.setAttribute('aria-pressed', String(chip.classList.contains('active')));
        chip.addEventListener('click', () => {
            const label = chip.textContent.trim();
            setActiveChip(label);
            searchInput.value = label === 'Top Offers' ? '' : label;
            filterProducts(searchInput.value);
            document.querySelector('#deals').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    categoryCards.forEach((card) => {
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        const browseCategory = () => {
            const category = card.querySelector('span').textContent.trim();
            searchInput.value = category;
            filterProducts(category);
            document.querySelector('#deals').scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        card.addEventListener('click', browseCategory);
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                browseCategory();
            }
        });
    });

    productCards.forEach((card) => {
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `View details for ${getProduct(card).name}`);
        card.addEventListener('click', () => openProductDetails(card));
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProductDetails(card);
            }
        });
    });

    cartButton.addEventListener('click', () => openPanel('cart'));
    loginButton.addEventListener('click', () => openPanel('login'));
    moreButton.addEventListener('click', () => openPanel('more'));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closePanels();
    });

    document.querySelectorAll('a[href="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            showToast('This link is ready to connect to its destination.');
        });
    });
});
