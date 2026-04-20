import requests

BASE = "http://127.0.0.1:5000"

BORDER = "=" * 40
SUB_BORDER = "-" * 40


# ============================================================
# UI HELPERS
# ============================================================
def print_main_header():
    print(f"\n{BORDER}")
    print("         ABHISHEK SMART STORE")
    print(BORDER)


def print_section(title):
    print(f"\n{SUB_BORDER}")
    print(f"{title}")
    print(SUB_BORDER)


def print_main_menu():
    print_main_header()
    print("1. Browse Products")
    print("2. View Cart")
    print("3. Checkout")
    print("4. Profile")
    print("5. Help")
    print("6. Exit")
    print("\nSelect action [1-6]:")
    print("> Type number or command (e.g. 'show products')")


# ============================================================
# API HELPERS
# ============================================================
def api_get(path):
    try:
        res = requests.get(BASE + path, timeout=5)
        res.raise_for_status()
        return res.json()
    except Exception:
        print("\n[ERROR] Server not reachable.")
        return None


def api_post(path, payload):
    try:
        res = requests.post(BASE + path, json=payload, timeout=5)
        res.raise_for_status()
        return res.json()
    except Exception:
        print("\n[ERROR] Server not reachable.")
        return None

# ============================================================
# INPUT + NLP HELPERS
# ============================================================
def get_input(prompt="Input: "):
    while True:
        value = input(prompt).strip().lower()
        if value == "":
            print("[ERROR] Input cannot be empty.")
            continue
        return value


def has_any(text, keywords):
    return any(word in text for word in keywords)


def parse_main_action(user_text):
    text = user_text.strip().lower()

    if text == "1" or has_any(text, ["product", "products", "browse", "show", "list", "items", "view items"]):
        return "products"

    if text == "2" or has_any(text, ["cart", "basket"]):
        return "cart"

    if text == "3" or has_any(text, ["checkout", "order", "buy", "confirm order"]):
        return "checkout"

    if text == "4" or has_any(text, ["profile", "user", "account", "me"]):
        return "profile"

    if text == "5" or has_any(text, ["help", "commands", "guide"]):
        return "help"

    if text == "6" or has_any(text, ["exit", "quit", "close"]):
        return "exit"

    return None


def next_action_menu():
    print("\nChoose next step:")
    print("1. Return to Main Menu")
    print("2. Exit")

    while True:
        choice = get_input("Select action [1-2]: ")
        if choice in ["1", "menu", "main", "back"]:
            return "menu"
        if choice in ["2", "exit", "quit"]:
            return "exit"
        print("[ERROR] Invalid action.")


# ============================================================
# PRODUCT FLOW
# ============================================================
def show_products_table(products):
    print_section("PRODUCT LIST")
    print(f"{'ID':<4}{'Name':<15}{'Price':<10}{'Stock':<8}")
    for i, p in enumerate(products, 1):
        print(f"{i:<4}{p['name']:<15}{('Rs.' + str(p['price'])):<10}{p['stock']:<8}")
    print(SUB_BORDER)


def select_product(products):
    while True:
        choice = get_input("Select product (ID/name) or 'back': ")

        if choice in ["back", "menu"]:
            return None

        if choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(products):
                return products[idx]
            print("[ERROR] Invalid product ID.")
            continue

        matches = [p for p in products if choice in p["name"].lower()]

        if not matches:
            print("[ERROR] No product found.")
            continue

        if len(matches) > 1:
            print("[ERROR] Multiple matches. Enter a clearer name.")
            continue

        return matches[0]


def show_product_details(product):
    print_section("PRODUCT DETAILS")
    print(f"Name     : {product['name']}")
    print(f"Price    : Rs.{product['price']}")
    print(f"Stock    : {product['stock']}")
    print(f"Delivery : {product.get('delivery', 'N/A')}")
    print(f"Specs    : {product.get('specs', 'N/A')}")
    print(SUB_BORDER)


def get_valid_quantity(max_stock):
    while True:
        qty_text = get_input("Enter quantity: ")
        if not qty_text.isdigit():
            print("[ERROR] Enter a valid number.")
            continue

        qty = int(qty_text)
        if qty <= 0:
            print("[ERROR] Quantity must be greater than 0.")
            continue

        if qty > max_stock:
            print(f"[ERROR] Only {max_stock} units available.")
            continue

        return qty


def product_flow():
    while True:
        products = api_get("/products")
        if not products:
            return

        show_products_table(products)
        selected = select_product(products)

        if selected is None:
            return

        show_product_details(selected)

        if selected["stock"] == 0:
            print("[INFO] This item is out of stock.")
            continue

        print("1. Add to Cart")
        print("2. Back to Product List")
        action = get_input("Select action [1-2]: ")

        if action in ["2", "back"]:
            continue

        if action not in ["1", "add", "add to cart"]:
            print("[ERROR] Invalid action.")
            continue

        qty = get_valid_quantity(selected["stock"])

        print("\nConfirm add to cart:")
        print(f"Item     : {selected['name']}")
        print(f"Quantity : {qty}")
        print("1. Confirm")
        print("2. Cancel")

        confirm = get_input("Select action [1-2]: ")
        if confirm not in ["1", "confirm", "yes", "y"]:
            print("[INFO] Add to cart cancelled.")
            continue

        result = api_post("/add", {"product": selected["name"], "qty": qty})
        if result:
            print(f"[OK] {result['msg']}")

        nav = next_action_menu()
        if nav == "exit":
            raise SystemExit
        return


# ============================================================
# CART + CHECKOUT FLOW
# ============================================================
def fetch_cart_with_prices():
    cart = api_get("/cart")
    if cart is None:
        return None, None, None

    products = api_get("/products")
    if products is None:
        return None, None, None

    price_map = {p["name"]: p["price"] for p in products}

    total = 0
    lines = []
    for item in cart:
        price = price_map.get(item["product"], 0)
        subtotal = price * item["qty"]
        total += subtotal
        lines.append((item["product"], item["qty"], subtotal))

    return cart, lines, total


def print_cart(lines, total):
    print_section("YOUR CART")
    if not lines:
        print("Cart is empty")
        print(SUB_BORDER)
        return

    print(f"{'Item':<16}{'Qty':<8}{'Subtotal':<12}")
    for name, qty, subtotal in lines:
        print(f"{name:<16}{('x' + str(qty)):<8}{('Rs.' + str(subtotal)):<12}")
    print(SUB_BORDER)
    print(f"TOTAL: Rs.{total}")


def cart_flow():
    cart, lines, total = fetch_cart_with_prices()
    if cart is None:
        return

    print_cart(lines, total)
    if not cart:
        return

    nav = next_action_menu()
    if nav == "exit":
        raise SystemExit


def checkout_flow():
    cart, lines, total = fetch_cart_with_prices()
    if cart is None:
        return

    if not cart:
        print_section("CHECKOUT")
        print("Cart is empty")
        print(SUB_BORDER)
        return

    print_section("CONFIRM ORDER")
    print(f"Items: {len(cart)}")
    print(f"Total: Rs.{total}")
    print("\n1. Confirm")
    print("2. Cancel")

    choice = get_input("Select action [1-2]: ")
    if choice not in ["1", "confirm", "yes", "y"]:
        print("[INFO] Checkout cancelled.")
        return

    result = api_get("/checkout")
    if result:
        print(f"[OK] {result['msg']}")

    nav = next_action_menu()
    if nav == "exit":
        raise SystemExit


# ============================================================
# PROFILE + HELP
# ============================================================
def profile_flow():
    profile = {
        "name": "Abhishek",
        "status": "Active",
        "orders": 3,
        "email": "abhishek@example.com",
    }

    print_section("USER PROFILE")
    print(f"Name   : {profile['name']}")
    print(f"Status : {profile['status']}")
    print(f"Orders : {profile['orders']}")
    print(f"Email  : {profile['email']}")
    print(SUB_BORDER)

    nav = next_action_menu()
    if nav == "exit":
        raise SystemExit


def help_flow():
    print_section("HELP")
    print("Actions:")
    print("- show products / list / view items / 1")
    print("- cart / 2")
    print("- checkout / 3")
    print("- profile / 4")
    print("- help / 5")
    print("- exit / 6")
    print(SUB_BORDER)

    nav = next_action_menu()
    if nav == "exit":
        raise SystemExit


# ============================================================
# MAIN
# ============================================================
def main():
    print_main_header()

    while True:
        print_main_menu()
        user = get_input("> ")
        action = parse_main_action(user)

        if action == "products":
            product_flow()
        elif action == "cart":
            cart_flow()
        elif action == "checkout":
            checkout_flow()
        elif action == "profile":
            profile_flow()
        elif action == "help":
            help_flow()
        elif action == "exit":
            print("Exiting Abhishek Smart Store.")
            break
        else:
            print("[ERROR] Invalid action. Try 1-6 or a command.")


if __name__ == "__main__":
    main()
