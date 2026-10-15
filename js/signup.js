document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#signup-form');
    const password = document.querySelector('#signup-password');
    const confirmation = document.querySelector('#signup-confirm-password');
    const message = document.querySelector('#signup-message');

    const validatePasswordMatch = () => {
        confirmation.setCustomValidity(
            confirmation.value && confirmation.value !== password.value
                ? 'Passwords do not match.'
                : '',
        );
    };

    password.addEventListener('input', validatePasswordMatch);
    confirmation.addEventListener('input', validatePasswordMatch);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        validatePasswordMatch();

        if (!form.reportValidity()) return;

        message.textContent = 'Your details are ready. Account creation is not connected to a backend yet.';
        message.classList.add('is-visible');
    });
});
