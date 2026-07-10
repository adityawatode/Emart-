# Flipkart Clone

A responsive front-end shopping website inspired by Flipkart. The project demonstrates a modern e-commerce homepage with product discovery, search, category filtering, product-detail dialogs, and a simple in-browser cart.

## Features

- Flipkart-style header, search bar, category navigation, offers, product grids, and footer
- Responsive layout for desktop, tablet, and mobile screens
- Live product search and category filtering
- Product detail pop-up with **Add to Cart** action
- Cart counter and cart preview dialog
- Login and "More" interaction dialogs

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Inter)

## Project Structure

```text
.
├── index.html          # Main storefront page
├── css/
│   ├── style.css       # Main visual styles
│   ├── responsive.css  # Responsive breakpoints
│   └── utilis.css      # Small utility classes
├── js/
│   └── index.js        # Search, cart, dialogs, and UI interactions
├── flipkart logo.png   # Brand image
└── logo.svg            # Logo asset
```

## Run Locally

1. Clone or download this project.
2. Open `index.html` in a web browser.

No build step or package installation is required.

## Notes

- Product images are loaded from external image URLs, so an internet connection is needed for them to display.
- The cart is stored only while the current page is open; it is not connected to a backend or database.

## Future Improvements

- Add dedicated product, login, and cart pages
- Store cart data in `localStorage`
- Add product data from a JSON file or API
- Add authentication and checkout integration

## License

This project is for educational and portfolio purposes.
