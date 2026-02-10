# NOUN CRM - API ENDPOINT LIST
*Backend Routes for Website, Admin Dashboard, and Mobile App*

## 🔐 AUTH API
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| POST | `/api/login` | Authenticate user and return token |
| POST | `/api/logout` | Invalidate current session/token |
| POST | `/api/register` | Register a new user (optional/admin only) |
| GET | `/api/profile` | Get current logged-in user details |

## 👥 USERS (Admin / Staff)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/users` | List all users |
| POST | `/api/users` | Create a new user |
| GET | `/api/users/{id}` | Get specific user details |
| PUT | `/api/users/{id}` | Update user details |
| DELETE | `/api/users/{id}` | Delete a user |

## 🧑‍💼 CUSTOMERS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/customers` | List all customers |
| POST | `/api/customers` | Create a new customer |
| GET | `/api/customers/{id}` | Get specific customer details |
| PUT | `/api/customers/{id}` | Update customer details |
| DELETE | `/api/customers/{id}` | Delete a customer |

## 🗂 CATEGORIES
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/categories` | List all categories |
| POST | `/api/categories` | Create a new category |
| GET | `/api/categories/{id}` | Get specific category |
| PUT | `/api/categories/{id}` | Update category |
| DELETE | `/api/categories/{id}` | Delete category |

## 🍔 PRODUCTS (MENU)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/products` | List all products. Support filters: `?type=restaurant`, `?type=coffee`, `?type=minimart` |
| POST | `/api/products` | Create a new product |
| GET | `/api/products/{id}` | Get specific product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

## 🧾 ORDERS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/orders` | List all orders. Supports `?country=ID`, etc. |
| POST | `/api/orders` | Create a new order |
| GET | `/api/orders/{id}` | Get specific order details |
| PUT | `/api/orders/{id}` | Update order details |
| DELETE | `/api/orders/{id}` | Delete an order |
| PUT | `/api/orders/{id}/status` | Update only the status of an order |

## 📦 ORDER ITEMS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/order-items/{order_id}` | Get items for a specific order |
| POST | `/api/order-items` | Add item to order |
| PUT | `/api/order-items/{id}` | Update item quantity/details |
| DELETE | `/api/order-items/{id}` | Remove item from order |

## 📅 BOOKINGS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/bookings` | List all bookings |
| POST | `/api/bookings` | Create a new booking |
| GET | `/api/bookings/{id}` | Get specific booking |
| PUT | `/api/bookings/{id}` | Update booking |
| DELETE | `/api/bookings/{id}` | Delete booking |
| PUT | `/api/bookings/{id}/confirm` | Confirm a booking |

## 💳 PAYMENTS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/payments` | List payments |
| POST | `/api/payments` | Record a new payment |
| GET | `/api/payments/{id}` | Get payment details |
| PUT | `/api/payments/{id}` | Update payment status |

## 🔗 SOCIAL LINKS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/social-links` | List configured social links |
| POST | `/api/social-links` | Add a new social link |
| PUT | `/api/social-links/{id}` | Update social link |
| DELETE | `/api/social-links/{id}` | Remove social link |

## ⚙ SETTINGS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/settings` | Get site settings |
| PUT | `/api/settings` | Update site settings |

## 📊 REPORTS
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | `/api/reports/daily` | Get daily sales reports |
| GET | `/api/reports/monthly` | Get monthly sales reports |
| GET | `/api/reports/top-products` | Get top performing products |

## 🌍 FILTERS & NOTES
- **Country Filter**: Resources like Customers and Orders support `?country=TH` query parameter.
- **Security**: Admin routes protected. Validate all inputs.
- **Uploads**: `POST /api/upload` for images.

---

# 📝 API EXAMPLES

## 1. Authentication (Login)
**POST** `/api/login`

**Request:**
```json
{
  "email": "admin@nouns.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "name": "Admin",
    "role": "admin"
  }
}
```

## 2. Products (Create)
**POST** `/api/products`

**Request:**
```json
{
  "name": "Matcha Green Tea Latte",
  "price": 4.50,
  "category": "coffee",
  "subCategory": "ICED COFFEE",
  "description": "Premium Japanese Matcha with fresh milk.",
  "image": "https://images.unsplash.com/photo-1515825838458-f2a94b20105a",
  "stock": 50
}
```

**Response:**
```json
{
  "id": "p1698234234",
  "name": "Matcha Green Tea Latte",
  "price": 4.50,
  "category": "coffee",
  "subCategory": "ICED COFFEE",
  "description": "Premium Japanese Matcha with fresh milk.",
  "image": "https://images.unsplash.com/photo-1515825838458-f2a94b20105a",
  "stock": 50
}
```

## 3. Orders (Create)
**POST** `/api/orders`

**Request:**
```json
{
  "customer_id": 10,
  "order_type": "pickup",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 3.50
    },
    {
      "product_id": 2,
      "quantity": 1,
      "price": 4.00
    }
  ],
  "total_amount": 11.00
}
```

**Response:**
```json
{
  "status": "success",
  "order_number": "ORD-2026-0012",
  "message": "Order placed successfully"
}
```

## 4. Image Upload
**POST** `/api/upload`

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (Binary Image Data)

**Response:**
```json
{
  "url": "https://nouncrm-storage.s3.region.amazonaws.com/uploads/image-123.jpg"
}
```

## 5. Customers (Create)
**POST** `/api/customers`

**Request:**
```json
{
  "name": "Sok Dara",
  "phone": "+85512345678",
  "email": "sok@example.com",
  "country": "KH"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Customer created",
  "data": {
    "id": 10,
    "name": "Sok Dara",
    "phone": "+85512345678",
    "country": "KH"
  }
}
```

## 6. Products (List Restaurant Menu)
**GET** `/api/products?type=restaurant`

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Fried Rice",
      "price": 3.50,
      "status": "available"
    },
    {
      "id": 2,
      "name": "Noodle Soup",
      "price": 4.00,
      "status": "available"
    }
  ]
}
```

## 7. Bookings (Create)
**POST** `/api/bookings`

**Request:**
```json
{
  "customer_id": 10,
  "date": "2026-02-15",
  "time": "18:30",
  "people_count": 4,
  "message": "Window seat please"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Booking received",
  "booking_id": 5
}
```

## 8. Payments (Create)
**POST** `/api/payments`

**Request:**
```json
{
  "order_id": 12,
  "payment_method": "qr",
  "amount": 11.00
}
```

**Response:**
```json
{
  "status": "success",
  "payment_status": "paid"
}
```

## 9. Reports (Daily Sales)
**GET** `/api/reports/daily`

**Response:**
```json
{
  "date": "2026-02-09",
  "total_orders": 25,
  "total_sales": 350.00
}
```