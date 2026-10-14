document.addEventListener('DOMContentLoaded', () => {
    const itemsContainer = document.querySelector('#cart-items');
    const emptyState = document.querySelector('#cart-empty');
    const summary = document.querySelector('#cart-summary');
    const errorMessage = document.querySelector('#cart-error');
    let cart = [];

    const formatPrice = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;
    const parsePrice = (price) => {
        const amount = Number(String(price).replace(/[^\d.]/g, ''));
        if (!Number.isFinite(amount)) throw new Error(`Invalid product price: ${price}`);
        return amount;
    };

    const showError = (message, error) => {
        console.error(message, error);
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    };

    const saveCart = (nextCart) => {
        try {
            window.emartCart.saveItems(nextCart);
            cart = nextCart;
            renderCart();
        } catch (error) {
            showError('Your cart could not be updated. Please check your browser storage settings.', error);
        }
    };

    const createCartItem = (item, index) => {
        const article = document.createElement('article');
        article.className = 'cart-item';

        const image = document.createElement('img');
        image.className = 'cart-item-image';
        image.src = item.image;
        image.alt = item.imageAlt || item.name;

        const details = document.createElement('div');
        details.className = 'cart-item-details';

        const category = document.createElement('p');
        category.className = 'cart-item-category';
        category.textContent = item.category;

        const name = document.createElement('h3');
        name.textContent = item.name;

        const meta = document.createElement('p');
        meta.className = 'cart-item-meta';
        meta.textContent = item.meta || 'Easy returns available';

        const delivery = document.createElement('p');
        delivery.className = 'cart-item-delivery';
        delivery.innerHTML = '<span aria-hidden="true">✓</span> Free delivery';

        const controls = document.createElement('div');
        controls.className = 'cart-item-controls';

        const quantityControl = document.createElement('div');
        quantityControl.className = 'quantity-control';
        quantityControl.setAttribute('aria-label', `Quantity for ${item.name}`);

        const decrease = document.createElement('button');
        decrease.type = 'button';
        decrease.textContent = '−';
        decrease.setAttribute('aria-label', `Decrease ${item.name} quantity`);
        decrease.disabled = item.quantity <= 1;
        decrease.addEventListener('click', () => updateQuantity(index, -1));

        const quantity = document.createElement('span');
        quantity.textContent = String(item.quantity);
        quantity.setAttribute('aria-live', 'polite');

        const increase = document.createElement('button');
        increase.type = 'button';
        increase.textContent = '+';
        increase.setAttribute('aria-label', `Increase ${item.name} quantity`);
        increase.addEventListener('click', () => updateQuantity(index, 1));

        quantityControl.append(decrease, quantity, increase);

        const remove = document.createElement('button');
        remove.className = 'cart-remove-button';
        remove.type = 'button';
        remove.textContent = 'Remove';
        remove.addEventListener('click', () => removeItem(index));

        controls.append(quantityControl, remove);
        details.append(category, name, meta, delivery, controls);

        const priceBlock = document.createElement('div');
        priceBlock.className = 'cart-item-price';
        const price = parsePrice(item.price);
        const linePrice = price * item.quantity;
        const discount = Number.parseFloat(item.discount);
        const oldPrice = Number.isFinite(discount) && discount > 0 && discount < 100
            ? Math.round(price / (1 - discount / 100))
            : null;

        const currentPrice = document.createElement('strong');
        currentPrice.textContent = formatPrice(linePrice);
        priceBlock.append(currentPrice);
        if (item.quantity > 1) {
            const unitPrice = document.createElement('span');
            unitPrice.className = 'cart-item-unit-price';
            unitPrice.textContent = `${formatPrice(price)} each`;
            priceBlock.append(unitPrice);
        }
        if (oldPrice !== null) {
            const crossedPrice = document.createElement('del');
            crossedPrice.textContent = formatPrice(oldPrice * item.quantity);
            priceBlock.append(crossedPrice);
        }

        article.append(image, details, priceBlock);
        return article;
    };

    const renderCart = () => {
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        const itemCountText = document.querySelector('#cart-item-count');
        const itemLabel = document.querySelector('#cart-item-label');
        const isEmpty = cart.length === 0;

        itemCountText.textContent = itemCount ? `(${itemCount})` : '';
        itemLabel.textContent = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;
        itemsContainer.replaceChildren(...cart.map(createCartItem));
        emptyState.hidden = !isEmpty;
        itemsContainer.hidden = isEmpty;
        summary.hidden = isEmpty;
        document.querySelector('#cart-delivery-note').hidden = isEmpty;

        const subtotal = cart.reduce((total, item) => total + parsePrice(item.price) * item.quantity, 0);
        const savings = cart.reduce((total, item) => {
            const discount = Number.parseFloat(item.discount);
            if (!Number.isFinite(discount) || discount <= 0 || discount >= 100) return total;
            const currentPrice = parsePrice(item.price);
            return total + (currentPrice / (1 - discount / 100) - currentPrice) * item.quantity;
        }, 0);

        document.querySelector('#cart-subtotal').textContent = formatPrice(subtotal);
        document.querySelector('#cart-discount').textContent = savings ? `−${formatPrice(savings)}` : '—';
        document.querySelector('#cart-total').textContent = formatPrice(subtotal);
        document.querySelector('.cart-label').textContent = itemCount ? `Cart (${itemCount})` : 'Cart';
        document.querySelector('.cart-btn').setAttribute('aria-label', `${itemCount} item${itemCount === 1 ? '' : 's'} in cart`);
    };

    const updateQuantity = (index, change) => {
        const nextCart = cart.map((item) => ({ ...item }));
        nextCart[index].quantity += change;
        saveCart(nextCart);
    };

    const removeItem = (index) => {
        saveCart(cart.filter((_, itemIndex) => itemIndex !== index));
    };

    try {
        cart = window.emartCart.getItems();
        cart.forEach((item) => {
            if (typeof item.name !== 'string' || typeof item.price !== 'string' || !Number.isInteger(item.quantity) || item.quantity < 1) {
                throw new Error('Saved cart item is incomplete or invalid.');
            }
        });
        renderCart();
    } catch (error) {
        cart = [];
        renderCart();
        showError('Your saved cart could not be loaded. Please check your browser storage settings.', error);
    }
});
