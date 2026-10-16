document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#login-form');
    const message = document.querySelector('#login-message');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!form.reportValidity()) return;

        message.textContent = 'Your details are ready. Login is not connected to authentication yet.';
        message.classList.add('is-visible');
    });
});
