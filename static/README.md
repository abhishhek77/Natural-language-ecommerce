# SmartStore 🛒

A full e-commerce web frontend built with pure HTML, CSS and JavaScript. Connects to a Flask backend (`app.py`).

## Project Structure

```
smartstore/
├── index.html    ← All pages (login, signup, store, checkout, profile)
├── style.css     ← All styles and design system
├── app.js        ← All JavaScript logic
├── app.py        ← Flask backend (API server)
├── data.json     ← Product & cart data
└── main.py       ← Original CLI client
```

## Features

- 🔐 Login, Sign Up, Forgot Password (with OTP verification)
- 🛍️ Product browsing with search, sort, category filter
- 🛒 Cart drawer with quantity controls
- 💳 Checkout with delivery + payment form
- 👤 Profile with order history, wishlist, addresses
- ❌ Cancel orders (with confirmation modal)
- 📱 Responsive design

## How to Run

### 1. Start the Flask backend
```bash
pip install flask flask-cors
python app.py
```

### 2. Open the frontend
Double-click `index.html` in your browser — or serve with:
```bash
python -m http.server 8000
# then open http://localhost:8000
```

> If Flask is not running, the app uses demo product data automatically.

---

## Git Setup Instructions

### First time — initialize and push to GitHub

```bash
# 1. Go into your project folder
cd path/to/smartstore

# 2. Initialize git
git init

# 3. Add all files
git add .

# 4. Make your first commit
git commit -m "Initial commit: SmartStore e-commerce frontend"

# 5. Create a new repo on GitHub (github.com → New repository)
#    Copy the repo URL, then:
git remote add origin https://github.com/YOUR_USERNAME/smartstore.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

### After making changes

```bash
git add .
git commit -m "describe what you changed"
git push
```

### Useful git commands

```bash
git status          # see what files changed
git log --oneline   # see commit history
git diff            # see exact changes
```

---

Built by Abhishek · 2025
