# SmartStore Frontend Demo Guide

## Overview
This project includes a complete browser-based frontend demo for the SmartStore e-commerce experience.
The UI is served from `templates/index.html`, styled by `static/css/style.css`, and powered by `static/js/app.js`.

## How to run the frontend demo
1. Open a terminal in the project root:
   `c:\Users\sathi\OneDrive\Desktop\abhip\Natural-language-ecommerce`
2. Activate Python if needed:
   - `python -m venv venv`
   - `.venv\Scripts\Activate`
3. Install Flask if not already installed:
   `pip install flask`
4. Start the backend server:
   `python app.py`
5. Open the browser at:
   `http://127.0.0.1:5000`

## Demo credentials
Use the built-in demo login option or manually enter:
- Email: `demo@smartstore.com`
- Password: `demo123`

## Frontend features
- Login page with demo login and form validation
- Signup flow with OTP verification for demo purposes
- Forgot password flow with reset OTP and new password entry
- Product store page with:
  - search
  - category filter
  - sort options
  - stock status
  - add to cart
  - wishlist toggling
- Cart drawer with quantity controls and checkout button
- Checkout page with order summary, address form, and confirmation
- Profile page with order history, wishlist count, and profile editing
- Toast notifications for user feedback

## What to test
- Open the page and verify the theme loads correctly
- Log in using the demo account
- Sign up as a new user and verify account creation
- Use the search input and category tabs on the store page
- Add products to the cart, then open the cart drawer
- Increase/decrease product quantities in the cart
- Complete checkout and confirm order success
- Navigate to the profile page and view saved order history
- Log out and verify the login screen returns

## Notes
- The frontend requires the Flask server to be running because it fetches products from `/products`.
- The static assets are served from Flask using `url_for('static', filename=...)`.
- Local application state is stored in `localStorage` for cart, user session, wishlist, and orders.
