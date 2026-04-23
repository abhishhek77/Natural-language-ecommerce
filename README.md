# Abhishek Smart Store CLI

A menu-driven e-commerce command-line application with a Flask backend and JSON persistence.

This project is designed as a complete end-to-end mini store system where:
- the CLI (`main.py`) is the user-facing frontend,
- the Flask app (`app.py`) is the backend API,
- and `data.json` is the database.

The current UI is customized as **ABHISHEK SMART STORE** with a structured menu + hybrid NLP command support.

## 1. What This Project Does

The system allows a user to:
- browse available products,
- view product details,
- add products to cart (with stock validation),
- view cart totals,
- checkout orders,
- view user profile,
- use both numbered menu choices and natural commands (for example: `show products`, `cart`, `checkout`).

## 2. Tech Stack

- Python 3.8+
- Flask (REST API server)
- Requests (CLI to backend HTTP calls)
- JSON file storage (`data.json`)

## 2.1 Frontend Demo
- Browser UI served from `templates/index.html`
- Styles in `static/css/style.css`
- Frontend logic in `static/js/app.js`
- Demo documentation: `FRONTEND_INSTRUCTIONS.md`

## 3. Project Structure

```text
Ecommerce/
|-- app.py                 # Flask backend API
|-- main.py                # CLI frontend (Abhishek Smart Store)
|-- data.json              # Persistent data store (products + cart)
|-- TEST_INSTRUCTIONS.md   # Manual run/test guide
|-- ecom_env/              # Local virtual environment (optional)
```

## 4. End-to-End Architecture and Flow

### 4.1 High-level flow

1. User runs `python app.py` to start backend server on `http://127.0.0.1:5000`.
2. User runs `python main.py` to start CLI.
3. CLI displays menu and accepts either:
   - numeric action (`1` to `6`), or
   - command aliases (`show products`, `list`, `cart`, `checkout`, etc.).
4. CLI sends HTTP requests to backend endpoints:
   - `GET /products`
   - `GET /cart`
   - `POST /add`
   - `GET /checkout`
5. Backend reads/writes `data.json` using helper functions `load()` and `save()`.
6. Backend returns JSON response.
7. CLI formats output in table/section style and loops back to menu.

### 4.2 Data lifecycle

- Source of truth is `data.json`.
- Product stock decreases when add-to-cart succeeds.
- Cart resets to empty on successful checkout.
- No external database is required.

## 5. File-by-File Deep Analysis

## 5.1 `app.py` (Backend API)

Purpose: Serve product/cart data and mutate state safely.

### Core components

- `app = Flask(__name__)`: initializes server.
- `DATA_FILE`: resolves `data.json` path from script location to avoid CWD issues.
- `load()`: reads JSON data from disk.
- `save(data)`: writes updated data to disk with indentation.

### Endpoints

1. `GET /products`
- Returns full product list.
- Response: array of product objects.

2. `GET /cart`
- Returns current cart items.
- Response: array of `{product, qty}`.

3. `POST /add`
- Body: `{"product": "Laptop", "qty": 1}`
- Validations:
  - request must be JSON,
  - both `product` and `qty` must exist,
  - `qty` must be a positive integer,
  - product must exist,
  - stock must be sufficient.
- On success:
  - decrements stock,
  - appends cart item,
  - persists data.

4. `GET /checkout`
- Fails gracefully if cart is empty.
- On success, clears cart and saves changes.

### Typical backend responses

- `{"msg": "added to cart"}`
- `{"msg": "not enough stock"}`
- `{"msg": "product not found"}`
- `{"msg": "qty must be a positive integer"}`
- `{"msg": "order placed"}`
- `{"msg": "cart is empty"}`

## 5.2 `main.py` (CLI Frontend)

Purpose: Present a strong CLI UX and orchestrate user actions through backend APIs.

### Main UX behavior

- Brand header: `ABHISHEK SMART STORE`
- Menu-driven main actions:
  1. Browse Products
  2. View Cart
  3. Checkout
  4. Profile
  5. Help
  6. Exit
- Hybrid NLP parser accepts textual command aliases.

### Important functions

- `print_main_menu()`: renders top-level menu.
- `get_input()`: blocks empty input.
- `parse_main_action()`: maps number/keywords to internal actions.
- `product_flow()`: product table -> selection -> details -> add flow.
- `get_valid_quantity()`: validates numeric quantity and stock limits.
- `cart_flow()`: displays formatted cart summary.
- `checkout_flow()`: structured confirm/cancel checkout.
- `profile_flow()`: displays Abhishek profile details.
- `help_flow()`: displays accepted aliases.
- `main()`: event loop and action routing.

### CLI command aliases

- Products: `1`, `show products`, `list`, `browse`, `view items`
- Cart: `2`, `cart`, `basket`
- Checkout: `3`, `checkout`, `order`, `buy`
- Profile: `4`, `profile`, `account`, `me`
- Help: `5`, `help`, `commands`, `guide`
- Exit: `6`, `exit`, `quit`, `close`

## 5.3 `data.json` (Persistent storage)

Schema:

```json
{
  "products": [
    {
      "name": "Laptop",
      "price": 50000,
      "stock": 10,
      "delivery": "3 days",
      "specs": "i5, 8GB RAM"
    }
  ],
  "cart": [
    {
      "product": "Laptop",
      "qty": 1
    }
  ]
}
```

Notes:
- `products` defines catalog and mutable stock.
- `cart` stores pending items until checkout.
- Any successful `/add` or `/checkout` call modifies this file.

## 5.4 `TEST_INSTRUCTIONS.md`

Contains quick run commands and manual test checklist covering:
- product browse and NLP input,
- quantity validation,
- cart rendering,
- checkout behavior,
- profile/help/exit,
- backend-down resilience.

## 6. Input/Output Behavior (User Perspective)

### 6.1 Example startup output

```text
========================================
         ABHISHEK SMART STORE
========================================
1. Browse Products
2. View Cart
3. Checkout
4. Profile
5. Help
6. Exit

Select action [1-6]:
> Type number or command (e.g. 'show products')
```

### 6.2 Example add-to-cart flow

Input:
```text
> 1
Select product (ID/name) or 'back': 1
Select action [1-2]: 1
Enter quantity: 2
Select action [1-2]: 1
```

Output (sample):
```text
[OK] added to cart
```

### 6.3 Example checkout flow

Input:
```text
> checkout
Select action [1-2]: 1
```

Output (sample):
```text
[OK] order placed
```

## 7. Setup and Run

## 7.1 Prerequisites

- Python 3.8 or newer
- `pip`

## 7.2 Create virtual environment (recommended)

### Windows PowerShell

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

## 7.3 Install dependencies

```bash
pip install flask requests
```

## 7.4 Run the project

Open 2 terminals in project root:

Terminal 1 (backend):
```bash
python app.py
```

Terminal 2 (frontend CLI):
```bash
python main.py
```

## 8. API Reference

### 8.1 `GET /products`

Request:
```bash
curl http://127.0.0.1:5000/products
```

Success response:
```json
[
  {
    "name": "Laptop",
    "price": 50000,
    "stock": 10,
    "delivery": "3 days",
    "specs": "i5, 8GB RAM"
  }
]
```

### 8.2 `GET /cart`

Request:
```bash
curl http://127.0.0.1:5000/cart
```

Success response:
```json
[]
```

### 8.3 `POST /add`

Request:
```bash
curl -X POST http://127.0.0.1:5000/add \
  -H "Content-Type: application/json" \
  -d '{"product":"Laptop","qty":1}'
```

Possible responses:
- `{"msg":"added to cart"}`
- `{"msg":"not enough stock"}`
- `{"msg":"product not found"}`
- `{"msg":"qty must be a positive integer"}`
- `{"msg":"invalid request"}`

### 8.4 `GET /checkout`

Request:
```bash
curl http://127.0.0.1:5000/checkout
```

Possible responses:
- `{"msg":"order placed"}`
- `{"msg":"cart is empty"}`

## 9. Testing Guide

## 9.1 Manual CLI testing checklist

1. Browse products from menu and via `show products`.
2. Select product by ID and name.
3. Try invalid product input.
4. Add valid quantity.
5. Add invalid quantity (`abc`, `0`, large value).
6. View cart and verify total.
7. Checkout and verify cart clears.
8. Checkout with empty cart and verify graceful message.
9. Run profile/help actions.
10. Stop backend and confirm CLI handles server errors.

## 9.2 Quick API smoke tests

```bash
curl http://127.0.0.1:5000/products
curl http://127.0.0.1:5000/cart
curl -X POST http://127.0.0.1:5000/add -H "Content-Type: application/json" -d '{"product":"Laptop","qty":1}'
curl http://127.0.0.1:5000/checkout
```

## 10. Common Issues and Fixes

1. `ModuleNotFoundError: No module named flask/requests`
- Fix: `pip install flask requests`

2. `Server not reachable` in CLI
- Fix: ensure `app.py` is running on `127.0.0.1:5000`.

3. `data.json` errors
- Fix: verify valid JSON format and required keys (`products`, `cart`).

4. PowerShell activation blocked
- Fix: run PowerShell as user and allow script execution if needed:
  `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

## 11. Current Limitations

- No authentication/login.
- Single-user cart model.
- No remove-from-cart endpoint.
- No order history persistence beyond static profile `orders` value.
- Uses file-based storage (not suitable for concurrent production use).

## 12. How This Project Can Be Used

- Academic mini-project for demonstrating frontend-backend separation.
- CLI UX practice (menu systems + command alias parsing).
- Flask REST API learning project.
- Base template for extending into web UI/mobile client later.

## 13. Suggested Next Enhancements

1. Add `DELETE /cart/item` and quantity update endpoints.
2. Add persistent user profile and order history in storage.
3. Add automated tests using `pytest` and Flask test client.
4. Add logging and structured error codes.
5. Upgrade storage from JSON file to SQLite/PostgreSQL.

## 14. License / Ownership

No explicit license file is currently included in this repository.
If this is being shared externally, add a `LICENSE` file and author/project metadata.
