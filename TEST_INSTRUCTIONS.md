# ABHISHEK SMART STORE CLI - Test & Run Instructions
## 0. Create and activate virtual environment
### 0.1. Create  virtual environment
```bash
Python -m venv venv

```
### 0.2. Activate virtual environment
```bash
./venv/bin/Activate      

```

## 1. Prerequisites
```bash
Python 3.8+
pip install flask requests
```

## 2. Start the Backend (Terminal 1)
```bash
python app.py
# Running on http://127.0.0.1:5000
```

## 3. Start the CLI (Terminal 2)
```bash
python main.py
```

---

## 4. Manual Test Checklist

| # | Test | Input | Expected |
|---|------|-------|----------|
| 1 | Browse products (menu) | `1` | Product table displayed |
| 2 | Browse products (NLP) | `show products` / `list` | Product table displayed |
| 3 | Select by ID | product ID | Product details shown |
| 4 | Select by name | `laptop` | Laptop details shown |
| 5 | Invalid selection | `99` | Error, no crash |
| 6 | Add to cart | `1` (add) -> qty `1` -> confirm | Added to cart |
| 7 | Invalid qty input | `abc` as quantity | Re-prompted, no crash |
| 8 | Exceed stock | qty > stock | Error: only N units |
| 9 | View cart | `2` or `cart` | Styled cart + total displayed |
| 10 | Checkout flow | `3` or `checkout` | Confirm/Cancel menu shown |
| 11 | Checkout confirm | select `1` | Order placed |
| 12 | Checkout empty cart | `checkout` on empty cart | "cart is empty" |
| 13 | Profile | `4` or `profile` | Abhishek profile shown |
| 14 | Help | `5` or `help` | Command aliases shown |
| 15 | Exit | `6` or `exit` | CLI exits cleanly |
| 16 | Server resilience | stop `app.py`, use CLI | Error message, no crash |

---

## 5. API Quick Test (curl)
```bash
# Get all products
curl http://127.0.0.1:5000/products

# Get cart
curl http://127.0.0.1:5000/cart

# Add to cart
curl -X POST http://127.0.0.1:5000/add \
     -H "Content-Type: application/json" \
     -d '{"product":"Laptop","qty":1}'

# Checkout
curl http://127.0.0.1:5000/checkout
```
