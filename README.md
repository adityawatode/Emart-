# Flipkart Clone

A responsive front-end shopping website with a fresh, editorial marketplace design. The project demonstrates product discovery, search, category filtering, product-detail dialogs, and a simple in-browser cart.

## Features

- Responsive marketplace header, search bar, category navigation, offers, product grids, and footer
- Warm neutral palette, rounded surfaces, and a forest-green accent system
- Responsive layout for desktop, tablet, and mobile screens
- Live product search and category filtering
- Product detail pop-up with **Add to Cart** action
- Persistent cart with quantity controls, item removal, and an order summary
- Checkout page with delivery details, payment selection, and a demo-only order confirmation
- Login and "More" interaction dialogs
- Responsive signup page with required-field, email, password-length, and password-match validation

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Inter)

## Project Structure

```text
.
├── index.html          # Main storefront page
├── signup.html         # Account signup form (front-end demo)
├── cart.html           # Persistent shopping cart
├── checkout.html       # Delivery and payment selection
├── css/
│   ├── style.css       # Main visual styles and responsive breakpoints
│   ├── responsive.css  # Compatibility stylesheet
│   └── utilis.css      # Small utility classes
├── js/
│   ├── index.js        # Search, product dialogs, and storefront interactions
│   ├── cart.js         # Cart page rendering and controls
│   ├── checkout.js     # Checkout validation and demo confirmation
│   ├── signup.js       # Signup form validation
│   └── cart-storage.js # Shared browser storage for cart items
├── EKART.png           # Brand image
└── logo.svg            # Logo asset
```

## Run Locally

1. Clone or download this project.
2. Open `index.html` in a web browser.

No build step or package installation is required.

## Notes

- Product images are loaded from external image URLs, so an internet connection is needed for them to display.
- Cart items are stored in browser local storage and are not connected to a backend or database.
- Checkout is a front-end demo; no payment is collected or processed.
- Signup is a front-end demo; account details are not saved or sent to a server.

## Future Improvements

- Add product data from a JSON file or API
- Add authentication and payment-provider integration

## License

This project is for educational and portfolio purposes.
