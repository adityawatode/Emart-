document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#checkout-form');
    const layout = document.querySelector('#checkout-layout');
    const emptyState = document.querySelector('#checkout-empty');
    const errorMessage = document.querySelector('#checkout-error');
    const confirmation = document.querySelector('#order-confirmation');
    let cart = [];

    const formatPrice = (amount) => `₹${Math.round(amount).toLocaleString('en-IN')}`;

    const parsePrice = (price) => {
        const digits = String(price).replace(/[^\d.]/g, '');
        const amount = Number(digits);
        if (!digits || !Number.isFinite(amount) || amount <= 0) throw new Error(`Invalid product price: ${price}`);
        return amount;
    };

    const showError = (message, error) => {
        console.error(message, error);
        errorMessage.textContent = message;
        errorMessage.hidden = false;
    };

    const validateField = (field) => {
        const message = field.validity.valueMissing
            ? 'This field is required.'
            : field.validity.patternMismatch
                ? field.name === 'phone'
                    ? 'Enter a valid 10-digit Indian mobile number.'
                    : 'Enter a valid 6-digit PIN code.'
                : field.validity.tooShort
                    ? `Enter at least ${field.minLength} characters.`
                    : '';
        const error = form.querySelector(`[data-error-for="${field.name}"]`);
        error.textContent = message;
        field.setAttribute('aria-invalid', String(Boolean(message)));
        return !message;
    };

    const renderItems = () => {
        const container = document.querySelector('#checkout-items');
        let subtotal = 0;
        let savings = 0;
        const rows = cart.map((item) => {
            const price = parsePrice(item.price);
            const quantity = Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1;
            const discount = Number.parseFloat(item.discount);
            subtotal += price * quantity;
            if (Number.isFinite(discount) && discount > 0 && discount < 100) {
                savings += (price / (1 - discount / 100) - price) * quantity;
            }

            const row = document.createElement('div');
            row.className = 'checkout-item';

            const image = document.createElement('img');
            image.src = item.image;
            image.alt = item.imageAlt || item.name;

            const details = document.createElement('div');
            const name = document.createElement('strong');
            name.textContent = item.name;
            const quantityLabel = document.createElement('span');
            quantityLabel.textContent = `Qty ${quantity}`;
            details.append(name, quantityLabel);

            const lineTotal = document.createElement('strong');
            lineTotal.textContent = formatPrice(price * quantity);
            row.append(image, details, lineTotal);
            return row;
        });

        container.replaceChildren(...rows);
        document.querySelector('#checkout-subtotal').textContent = formatPrice(subtotal);
        document.querySelector('#checkout-discount').textContent = savings ? `−${formatPrice(savings)}` : '—';
        document.querySelector('#checkout-total').textContent = formatPrice(subtotal);

        const count = cart.reduce((total, item) => total + (Number.isInteger(item.quantity) && item.quantity > 0 ? item.quantity : 1), 0);
        document.querySelector('.cart-label').textContent = count ? `Cart (${count})` : 'Cart';
        document.querySelector('.cart-btn').setAttribute('aria-label', `${count} item${count === 1 ? '' : 's'} in cart`);
    };

    const showConfirmation = (formData) => {
        const address = `${formData.get('address')}, ${formData.get('city')}, ${formData.get('state')} ${formData.get('pincode')} · ${formData.get('addressType')}`;
        document.querySelector('#confirmation-order-id').textContent = `EK-${Date.now().toString().slice(-8)}`;
        document.querySelector('#confirmation-address').textContent = address;
        document.querySelector('#confirmation-payment').textContent = formData.get('paymentMethod');
        document.querySelector('#confirmation-total').textContent = document.querySelector('#checkout-total').textContent;
        document.querySelector('.cart-label').textContent = 'Cart';
        document.querySelector('.cart-btn').setAttribute('aria-label', '0 items in cart');
        layout.hidden = true;
        document.querySelector('.checkout-heading').hidden = true;
        confirmation.hidden = false;

        const progress = document.querySelectorAll('.checkout-progress li');
        progress[1].classList.remove('is-current');
        progress[1].classList.add('is-complete');
        progress[1].removeAttribute('aria-current');
        progress[2].classList.add('is-current');
        progress[2].setAttribute('aria-current', 'step');
    };

    form.querySelectorAll('.checkout-field input').forEach((field) => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.hasAttribute('aria-invalid')) validateField(field);
        });
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        errorMessage.hidden = true;
        const fields = [...form.querySelectorAll('.checkout-field input')];
        const invalidFields = fields.filter((field) => !validateField(field));
        if (invalidFields.length) {
            invalidFields[0].focus();
            return;
        }

        try {
            window.emartCart.saveItems([]);
        } catch (error) {
            showError('Your demo order could not be completed because the cart could not be updated. Please check your browser storage settings.', error);
            return;
        }

        showConfirmation(new FormData(form));
    });

    try {
        cart = window.emartCart.getItems();
        cart.forEach((item) => {
            if (typeof item.name !== 'string' || typeof item.price !== 'string' || !Number.isFinite(parsePrice(item.price))) {
                throw new Error('Saved cart item is incomplete or invalid.');
            }
        });
        if (cart.length === 0) {
            layout.hidden = true;
            emptyState.hidden = false;
            document.querySelector('.checkout-heading').hidden = true;
            document.querySelector('.checkout-progress').hidden = true;
        } else {
            renderItems();
        }
    } catch (error) {
        cart = [];
        layout.hidden = true;
        emptyState.hidden = false;
        document.querySelector('.checkout-heading').hidden = true;
        document.querySelector('.checkout-progress').hidden = true;
        showError('Your saved cart could not be loaded. Please check your browser storage settings.', error);
    }
});
