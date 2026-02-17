# FarmPick - Complete Project Flow Documentation

## 📋 Project Overview
FarmPick is an e-commerce platform connecting organic farmers directly with customers, eliminating middlemen and ensuring fair prices.

---

## 👥 User Roles & Capabilities

### 1️⃣ **CUSTOMER (Regular User)**

#### Registration & Login
- **Register**: Create account with Name, Email, Password
  - All new registrations are automatically set as "Customer" role
  - No approval needed - instant access
- **Login**: Access with email and password

#### What Customers Can Do:
✅ **Browse & Shop**
- View all products on Shop page
- Search products by name
- Filter products by category
- View product details (price, quantity, description, farmer info)

✅ **Shopping Cart**
- Add products to cart
- Update quantities
- Remove items
- View cart total

✅ **Orders**
- Place orders (Buy Now or Checkout from Cart)
- Provide delivery address
- View order history on "My Orders" page
- Track order status (Pending → Shipped → Delivered)

✅ **Account Management**
- View profile
- Logout

✅ **Contact & Support**
- Submit contact form queries
- Access Help Center

#### What Customers CANNOT Do:
❌ Access Farmer Dashboard
❌ Add/Edit products
❌ View farmer-specific orders
❌ Access Admin panel

---

### 2️⃣ **FARMER (Seller)**

#### How to Become a Farmer:
1. **Register** as a regular customer first
2. Click **"Become a Seller"** link in navbar
3. Fill **Farmer Application Form** with:
   - Full Name
   - Phone Number
   - Location
   - Aadhar Number (for verification)
   - Farm Image URL (optional)
4. **Submit** application
5. **Wait for Admin Approval**
6. Once approved, role changes to "Farmer" and `farmer_id` is assigned

#### What Farmers Can Do:
✅ **Product Management**
- **Add Products**: 
  - Product Name
  - Description
  - Price
  - Quantity
  - Category
  - Image URL
  - Organic Certification status
- **Edit Products**: Update existing product details
- **Delete Products**: Remove products from listing
- **View All Products**: See all their listed products

✅ **Order Management**
- View orders for their products
- Update order status:
  - Pending
  - Shipped
  - Delivered
  - Cancelled
- View order details (customer info, delivery address, total amount)

✅ **Dashboard Analytics**
- Total Products count
- Today's Orders count
- Total Earnings
- Pending Orders alert
- Recent orders list
- Low stock alerts

✅ **Farmer Profile**
- View earnings
- Manage account settings

#### What Farmers CANNOT Do:
❌ Buy products (they are sellers, not buyers)
❌ Access Admin panel
❌ Approve other farmers
❌ Delete other farmers' products

---

### 3️⃣ **ADMIN (Administrator)**

#### Admin Access:
- Pre-configured admin account
- Login with admin credentials
- Access Admin Dashboard

#### What Admins Can Do:
✅ **Farmer Approval Management**
- View all pending farmer applications
- See farmer details:
  - Name
  - Phone
  - Location
  - Aadhar Number
  - Farm Image
  - Application Date
- **Approve** farmer applications
  - Changes user role from "customer" to "farmer"
  - Assigns `farmer_id`
  - Farmer can now access Farmer Dashboard
- **Reject** farmer applications
  - Deletes the farmer application
  - User remains as "customer"

✅ **User Management**
- View all registered users
- View user details (name, email, role)
- Monitor user activity

✅ **Order Monitoring**
- View all orders across the platform
- Monitor order statuses
- Track platform revenue

✅ **Product Oversight**
- View all products from all farmers
- Monitor product quality
- Remove inappropriate listings (if needed)

✅ **Platform Analytics**
- Total users count
- Total farmers count
- Total orders
- Platform revenue
- Active products

#### What Admins CANNOT Do:
❌ Place orders as customers
❌ Add products (they are not sellers)
❌ Directly edit farmer products

---

## 🔄 Complete User Journey Flows

### Flow 1: Customer Shopping Journey
```
1. Visit Homepage (index.html)
2. Click "Shop Now"
3. Browse products on Shop page
4. Click product → View details
5. Click "Add to Cart" OR "Buy Now"
   - Add to Cart: Continue shopping → View Cart → Checkout
   - Buy Now: Direct to Checkout
6. Enter delivery address
7. Confirm order
8. Order placed (Status: Pending)
9. View order in "My Orders" page
10. Track status updates from farmer
11. Receive product (Status: Delivered)
```

### Flow 2: Becoming a Farmer
```
1. Register as Customer
2. Login
3. Click "Become a Seller" in navbar
4. Fill Farmer Application Form
5. Submit application
6. Wait for admin approval
7. Admin reviews application
8. Admin approves
9. User role changes to "Farmer"
10. "Farmer Dashboard" link appears in navbar
11. Access Farmer Dashboard
12. Start adding products
```

### Flow 3: Farmer Selling Journey
```
1. Login as Farmer
2. Access Farmer Dashboard
3. Click "Products" → "Add Product"
4. Fill product details
5. Submit product
6. Product appears on Shop page for customers
7. Customer places order
8. Order appears in Farmer's "Orders" page
9. Farmer updates order status (Pending → Shipped → Delivered)
10. Customer sees status update in "My Orders"
11. Farmer views earnings in Dashboard
```

### Flow 4: Admin Approval Process
```
1. Customer submits "Become a Seller" form
2. Application stored in database (is_approved = False)
3. Admin logs into Admin Dashboard
4. Admin sees pending applications
5. Admin reviews farmer details
6. Admin clicks "Approve"
7. Backend updates:
   - User role: "customer" → "farmer"
   - User farmer_id: assigned
   - Farmer is_approved: True
8. Farmer can now login and access Farmer Dashboard
```

---

## 📁 Key Pages & Their Purpose

### Public Pages (No Login Required)
- **index.html**: Homepage with hero section, features
- **pages/Shop.html**: Product listing page
- **pages/About.html**: About the platform
- **pages/Contact.html**: Contact form
- **pages/login.html**: User login
- **pages/register.html**: New user registration

### Customer Pages (Login Required)
- **pages/Add-to-card.html**: Shopping cart
- **pages/Checkout.html**: Order checkout
- **pages/My-orders.html**: Order history & tracking

### Farmer Pages (Farmer Role Required)
- **Farmer-Page/Farmer-dashboard.html**: Analytics & overview
- **Farmer-Page/Farmer-product-page.html**: Product listing
- **Farmer-Page/Add-product.html**: Add/Edit product form
- **Farmer-Page/Farmer-order-page.html**: Order management
- **Farmer-Page/Farmer-earning-page.html**: Earnings tracker

### Admin Pages (Admin Role Required)
- **pages/Admin.html**: Admin dashboard with farmer approvals

### Application Pages
- **pages/Become-a-seller.html**: Farmer application form

---

## 🔐 Access Control Summary

| Feature | Customer | Farmer | Admin |
|---------|----------|--------|-------|
| Browse Products | ✅ | ✅ | ✅ |
| Buy Products | ✅ | ❌ | ❌ |
| Add to Cart | ✅ | ❌ | ❌ |
| Place Orders | ✅ | ❌ | ❌ |
| View My Orders | ✅ | ❌ | ❌ |
| Apply to Become Farmer | ✅ | ❌ | ❌ |
| Add Products | ❌ | ✅ | ❌ |
| Edit Products | ❌ | ✅ (own) | ❌ |
| Delete Products | ❌ | ✅ (own) | ❌ |
| View Farmer Orders | ❌ | ✅ (own) | ✅ (all) |
| Update Order Status | ❌ | ✅ | ❌ |
| View Dashboard | ❌ | ✅ | ✅ |
| Approve Farmers | ❌ | ❌ | ✅ |
| View All Users | ❌ | ❌ | ✅ |
| Platform Analytics | ❌ | ❌ | ✅ |

---

## 🎯 Key Business Rules

1. **All new registrations are Customers by default**
2. **Farmers must be approved by Admin before they can sell**
3. **Customers cannot access Farmer Dashboard**
4. **Farmers cannot buy products (they are sellers)**
5. **Orders are linked to specific farmers via products**
6. **Order status can only be updated by the farmer who owns the product**
7. **Admin approval is mandatory for farmer accounts**
8. **"Become a Seller" link is hidden for approved farmers**

---

## 📊 Database Relationships

```
Users (id, name, email, password, role, farmer_id)
  ↓
Farmers (id, name, phone, location, user_id, is_approved)
  ↓
Products (id, farmer_id, category_id, name, price, quantity, image_url)
  ↓
Orders (id, user_id, total_amount, status, delivery_address)
  ↓
OrderItems (id, order_id, product_id, quantity, price)
```

---

## 🚀 Quick Start Guide

### For Customers:
1. Register → Login → Shop → Add to Cart → Checkout → Track Orders

### For Farmers:
1. Register → Login → Become a Seller → Wait for Approval → Add Products → Manage Orders

### For Admin:
1. Login → View Pending Applications → Approve Farmers → Monitor Platform

---

**Last Updated**: January 17, 2026  
**Version**: 1.0  
**Project**: FarmPick E-Commerce Platform
