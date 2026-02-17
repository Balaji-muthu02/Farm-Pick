# 🌿 Product Requirement Document (PRD) - FarmPick

## 1. Project Vision (Why FarmPick?)
Currently, customers face difficulties in buying fresh vegetables directly from farmers because middlemen control the supply chain. Due to these middlemen, farmers receive lower profits for their hard work, while buyers end up paying higher prices. Additionally, this system often results in customers not getting fresh produce.

**Our goal is to build a platform where customers can buy directly from farmers, eliminating middlemen. This will ensure farmers get fair profits and buyers receive fresh vegetables at reasonable prices.**

---

## 2. Target Audience (Who will use it?)
*   **Farmers:** Who want to sell directly and earn fair profit.
*   **Customers:** Who want fresh, affordable vegetables.
*   **Restaurants & Small Businesses:** Needing fresh produce in bulk.

---

## 3. User Flow (How will it work?)

### 🏠 Home Page
*   **Hero Banner:** “Freshly Picked. Direct from farm”.
*   **Quick Links:** Shop Now, Become a Seller buttons.
*   **Value Points:** Fresh Guarantee, Healthy Living, Direct from Farmers, Transparency.
*   **Featured Products:** Daily picks and best sellers section.

### 🛒 Shop Page
*   **Categories:** Dynamic filtering (Vegetables, Fruits, etc.).
*   **Product Listings:** Image, Price, Harvest Date, Farmer Name.
*   **Filters:** Sort by freshness or price.
*   **Product Detail:** Deep dive into harvest info, farmer details, and 'Add to Cart'.

### 👨‍🌾 Become a Seller (Farmer Onboarding)
*   **Application Form:** Farm name, location, contact, and Aadhaar proof.
*   **Approval Process:** Admin verification -> Activation of Farmer Dashboard.

### 📖 About Us & Contact
*   **Story:** “Connecting farmers & buyers”.
*   **Mission:** Freshness, Trust, Transparency.
*   **Contact:** Form for inquiries, support email, and location info.

### 👑 Admin Flow (Management)
1.  **Login:** Secure admin-only access.
2.  **Seller Verification:** 
    *   Review pending farmer applications.
    *   Check Aadhaar/Identity proofs.
    *   **Approve/Reject** sellers (Approved sellers get dashboard access).
3.  **Platform Oversight:** 
    *   Monitor total sales and active users.
    *   View all platform orders.
4.  **Customer Support:** Manage inquiries from the "Contact Us" section.

---

## 4. Brand Story (Why "FarmPick"?)
I named it **FarmPick** because it represents the core idea – fresh, chemical-free produce hand-picked directly from farmers and delivered straight to buyers. It’s about **Freshness**, **Trust**, and **Transparency**.

---

## 5. Feature Prioritization

### ✅ Must Have (MVP)
*   **User/Farmer Auth:** Signup, Login, Profile.
*   **Farmer Onboarding:** Application form + Admin Approval toggle.
*   **Product CRUD:** Farmers adding/editing products.
*   **Shopping Cart:** Add, remove, and update quantities.
*   **Order System:** Placing orders and viewing history.
*   **Order Status Management:** Farmer updating status (Pending -> Packed -> Completed).
*   **Basic Search:** Finding products by name.

### ✨ Good to Have (Future)
*   **Reviews & Ratings:** Customers giving feedback on product quality.
*   **Live Chat:** Direct communication between Farmer and Customer.
*   **Advanced search & Filters:** Sort by "Hours since Harvest".
*   **Push Notifications:** Alerts for new orders or status updates.
*   **Multi-language Support:** Tamil and English options.

---

## 6. Core Features

### 🛡️ For Farmers
*   **Authentication:** Secure Login/Signup.
*   **Management Dashboard:**
    *   Add/Edit products (Price, Qty, Photo, Description).
    *   Manage incoming orders & update status.
    *   Track daily/monthly earnings.
    *   Wallet balance & withdrawal requests.

### 👥 For Customers
*   **Shopping Experience:**
    *   Browse and search for specific organic products.
    *   Persistent Shopping Cart.
    *   Detailed Order Summary during Checkout.
*   **Order Tracking:** View order history and status (Packed, Ready, etc.).

### 💳 Payment Methods
*   **Digital:** UPI (GPay, PhonePe, Paytm).
*   **Cards:** Credit and Debit Cards.
*   **Offline:** Cash on Delivery (COD) for local trust.

---

## 7. Design System (Aesthetics)

### 🎨 Color Palette
| Color | Purpose |
| :--- | :--- |
| **Light Green** | Primary accents, buttons, success states |
| **Dark Green** | Logos, primary text, brand identity |
| **White** | Backgrounds, clean card elements |
| **Black** | Headings and readability |
| **Dark Navy Blue**| Sidebars, headers, and professional accents |

### 🛠️ Technology Stack
*   **Backend:** FastAPI (Python)
*   **Frontend:** HTML5, CSS3, JavaScript (ES6+)
*   **Icons:** FontAwesome
*   **Database:** PostgreSQL / SQLite
