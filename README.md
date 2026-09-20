# 🌾 Namma Santhai

### Rural Digital Marketplace | Buy • Sell • Connect • Grow

Namma Santhai is a rural digital marketplace designed to connect farmers, local sellers, customers, and small businesses through a simple and accessible web application.

The platform enables users to discover, buy, and sell agricultural products, local goods, services, and business opportunities while supporting rural entrepreneurship and digital commerce.

---

## 🚀 Features

* 👤 User Registration & Login
* 🌾 Farmer and Seller Profiles
* 🛒 Product Buying & Selling
* 🥕 Agricultural Product Listings
* 🔍 Product Search & Filtering
* 📍 Local Market Discovery
* 💰 Product Price & Quantity Management
* 📷 Product Image Upload
* 🛍️ Shopping Cart
* 📦 Order Management
* 💳 Online Payment Integration
* ❤️ Wishlist / Favorites
* 💬 Seller–Customer Communication
* 🏪 Local Business Listings
* 📊 Admin Dashboard
* 🔄 CRUD Operations
* 🗄️ MySQL Database Integration

---

## 🎯 Problem Statement

Rural farmers and local sellers often face difficulties in reaching customers directly and promoting their products beyond traditional local markets. Customers may also find it difficult to discover nearby agricultural products, local goods, and services through a single platform.

Namma Santhai addresses this gap by providing a digital marketplace specifically designed to connect rural buyers and sellers.

---

## 💡 Proposed Solution

Namma Santhai provides a centralized marketplace where farmers, sellers, customers, and small businesses can connect digitally.

Sellers can list products with prices, quantities, images, and descriptions, while customers can search for products, add items to their cart, place orders, and make payments through an integrated payment API.

---

## 🛠️ Technology Stack

| Technology       | Purpose                                    |
| ---------------- | ------------------------------------------ |
| **React.js**     | Frontend user interface                    |
| **Node.js**      | Backend runtime                            |
| **Express.js**   | REST API and server-side application       |
| **MySQL**        | Database management                        |
| **Payment API**  | Secure online payment processing           |
| **HTML5 & CSS3** | Web structure and styling                  |
| **JavaScript**   | Application logic                          |
| **Git & GitHub** | Version control and source-code management |

---

## 🏗️ System Architecture

```text
                    Namma Santhai
                         │
                         ▼
                  React.js Frontend
                         │
                         ▼
                 Node.js + Express.js
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
          MySQL Database        Payment API
              │                     │
              ▼                     ▼
       Users / Products /       Online Payment
       Orders / Sellers
```

---

## 📱 Application Modules

### 👤 User Module

* Registration
* Login
* Profile management
* Product browsing
* Search and filtering
* Cart management
* Order placement
* Online payment

### 🌾 Seller Module

* Seller registration
* Add products
* Update products
* Delete products
* Manage stock
* Manage orders
* View sales information

### 🛒 Customer Module

* Browse products
* Search products
* View product details
* Add products to cart
* Place orders
* Make online payments
* View order history

### 🔐 Admin Module

* Manage users
* Manage sellers
* Manage products
* Manage categories
* Manage orders
* Monitor marketplace activity

---

## 💳 Payment Integration

The application can integrate a suitable payment gateway/API to support online payments.

The payment flow is:

```text
Customer
   ↓
Select Product
   ↓
Add to Cart
   ↓
Checkout
   ↓
Payment API
   ↓
Payment Verification
   ↓
Order Confirmation
   ↓
MySQL Database
```

---

## 🗄️ Database

MySQL is used to store application data such as:

* Users
* Sellers
* Products
* Categories
* Cart Items
* Orders
* Order Items
* Payments
* Locations

---

## 📸 Screenshots

Add application screenshots here:

* Home Page
* Login Page
* Product Listing
* Product Details
* Shopping Cart
* Checkout
* Payment Page
* Seller Dashboard
* Admin Dashboard

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/namma-santhai.git
cd namma-santhai
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
```

### 3. Install backend dependencies

```bash
cd ../backend
npm install
```

### 4. Configure MySQL

Create the Namma Santhai database and import the SQL database script.

### 5. Configure environment variables

Create a `.env` file for:

```text
DATABASE_HOST=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

PAYMENT_API_KEY=
PAYMENT_SECRET_KEY=
```

**Do not upload your `.env` file or real API keys to GitHub.**

### 6. Start the backend

```bash
npm run dev
```

### 7. Start the React application

```bash
cd ../frontend
npm start
```

---

## 🔮 Future Enhancements

* Tamil language support
* GPS-based local product discovery
* AI-based product recommendations
* Voice-based product search
* Farmer market price information
* Delivery tracking
* Push notifications
* Business analytics
* Mobile application
* Digital agricultural marketplace analytics

---

## 🌱 Project Vision

Namma Santhai aims to make rural commerce more accessible by connecting local producers, sellers, businesses, and customers through digital technology.

### **Buy Local • Sell Local • Grow Together**

---

## 👨‍💻 Developer

**Sakthi Ganesh**

GitHub: `https://github.com/sakthiganesh456`

---

## 📄 License

This project is developed for educational and portfolio purposes.
