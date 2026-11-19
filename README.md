# 🍕 PizzaHub — Next.js 16 Client Frontend

PizzaHub is a modern, responsive, role-based Italian pizza ordering and restaurant management platform built with Next.js 16 App Router and Tailwind CSS v4.

---

## 🎨 Design System: Italian Premium

The application follows an authentic, warm, and elegant Italian Premium visual identity:

- **Primary Red**: `#A92E24`
- **Dark Red**: `#78231E`
- **Warm Cream**: `#FAF5EB`
- **Soft Cream**: `#F2E9D9`
- **Olive Green**: `#596B45`
- **Charcoal**: `#29251F`
- **Muted Text**: `#777168`
- **Typography**: `Playfair Display` for headings and `Inter` for body copy.
- **Dark/Light Mode**: Full theme toggle support with customized dark mode tokens preserving the Italian culinary ambiance.

---

## 🛠️ Technology Stack & npm Packages

- **Framework**: Next.js 16.4.6 (App Router)
- **UI & Library**: React 19, Tailwind CSS v4, Lucide React
- **Authentication**: Better Auth with MongoDB Adapter & Google OAuth
- **Theme Management**: `next-themes` (Dark / Light mode toggle)
- **Feedback & Notifications**: `sonner` toast notifications
- **Utilities**: `clsx`, `tailwind-merge`, `zod`
- **Payments**: `@stripe/stripe-js`

---

## 📁 Client Folder Structure

```text
PizzaHub-Client/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── sign-in/page.jsx       # Email & Google Sign In with role redirect
│   │   │   ├── sign-up/page.jsx       # Role selection (Customer / Vendor)
│   │   │   └── layout.jsx             # Dedicated authentication layout
│   │   │
│   │   ├── api/auth/[...all]/route.js # Better Auth Next.js catch-all API handler
│   │   │
│   │   ├── browse-menu/page.jsx       # Challenge 1: Advanced Search & Filter
│   │   ├── menu/[id]/page.jsx         # Item Details, multi-image gallery & order form
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.jsx             # Dashboard root layout
│   │   │   ├── vendor/                # Vendor portal (My items, Add, Orders, Subscription)
│   │   │   ├── customer/              # Customer portal (Overview, My Orders, Timeline)
│   │   │   └── admin/                 # Admin panel (Users, Menus, Transactions)
│   │   │
│   │   ├── checkout/
│   │   │   ├── success/page.jsx       # Subscription success confirmation
│   │   │   └── cancel/page.jsx        # Subscription cancelled notice
│   │   │
│   │   ├── layout.js                  # Root layout with fonts, ThemeProvider & Sonner
│   │   ├── page.js                    # Italian Premium Homepage
│   │   ├── loading.jsx                # Pizza preparation loader
│   │   ├── error.jsx                  # Global error boundary
│   │   ├── not-found.jsx              # Custom Italian 404 screen
│   │   └── globals.css                # Tailwind CSS v4 Italian Premium variables
│   │
│   ├── components/
│   │   ├── Navbar.jsx                 # Dynamic responsive navigation & role links
│   │   ├── Footer.jsx                 # Italian footer with modern X logo
│   │   ├── MenuCard.jsx               # Reusable equal-sized pizza card
│   │   ├── DashboardSidebar.jsx       # Role-adaptive sidebar navigation
│   │   ├── ThemeToggle.jsx            # Dark / Light mode toggle
│   │   └── theme-provider.jsx         # Next-themes client provider
│   │
│   └── lib/
│       ├── api/                       # Modular API clients (menu, orders, users, etc.)
│       ├── core/server.js             # Server-side auth, token extraction & requireRole
│       ├── constants/images.js        # Local Unsplash images & category mapping
│       ├── auth.js                    # Better Auth server configuration & JWT plugin
│       ├── auth-client.js             # Better Auth browser client utilities
│       └── utils.js                   # Utility functions & currency formatters
│
├── public/
│   └── images/                        # High-resolution Unsplash food photography
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables (`.env`)

Create `.env` in `pizzahub-client/`:

```env
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=your_mongodb_atlas_connection_string

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Express REST API Server URL
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
```

---

## 🌟 Key Features & Requirements Implemented

1. **Role-Based Authentication (Better Auth)**:
   - Email/password and Google OAuth authentication.
   - Public role selection during sign up: Customer or Vendor (Restaurant).
   - Admin accounts are strictly protected from public signups.
   - Immediate navbar updates on login/logout state changes.
   - Server-side role protection in dashboard layouts (`requireRole`).
   - Blocked user rejection with appropriate alerts.

2. **Homepage**:
   - Italian Premium Hero Banner with local food imagery.
   - Database-driven Featured Pizzas section (approved items only).
   - Category exploration (Classic, Vegetarian, Meat Lovers, Gourmet, Sides, Desserts).
   - "Why Choose PizzaHub?" custom benefits section.
   - "How PizzaHub Works" 3-step order process.
   - Restaurant call-to-action banner.

3. **Browse Menu (Challenge Requirement 1)**:
   - Live search by pizza title or description.
   - Filter by pizza category.
   - Filter by restaurant location (Area/City).
   - Sort by price ascending (`$ → $$$`) or descending (`$$$ → $`).
   - One-click reset filters.

4. **Item Details & Ordering**:
   - Multiple images gallery with thumbnail selector.
   - Real-time customer order modal with delivery date, address, and special instructions.
   - Duplicate active order prevention on the same date.
   - Strict authorization: only customers can order.

5. **Vendor Dashboard**:
   - Overview metrics: Total items, active items, pending orders, accepted orders.
   - Menu Management: Create, update, toggle active status, and delete.
   - **Free Plan Limit**: Automatically enforces maximum 3 active menu items.
   - **ImgBB Image Upload**: File selection, preview, size validation, and hosted image retrieval.
   - Order Dispatch: Accept or Reject customer orders once only.
   - Stripe Subscription: Upgrade to Premium ($29/month) for unlimited items and featured homepage placement.

6. **Customer Dashboard**:
   - Order history with delivery schedules and pizzerias.
   - **Order Status Timeline** (Optional Requirement 3): Live visual tracking (Order Placed → Reviewing → Woodfired Baking & Delivery).
   - Cancellation of pending orders.

7. **Admin Dashboard**:
   - Platform metrics: Total users, vendors, customers, items, pending items, and total revenue.
   - User Management: Search users, filter by role, Block / Unblock accounts.
   - Menu Moderation: Review pending pizzas, Approve, Reject, or Delete.
   - Read-only Stripe subscription transaction ledger.

8. **Optional Features Included**:
   - Dark / Light Mode Toggle (`next-themes`) with custom Italian tokens.
   - Order Status Timeline on order details.
   - Customer Wishlist / Favorites button.

---

## 👤 Default Testing Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@pizzahub.com` | `AdminPassword123` |
| **Vendor** | `vendor@pizzahub.com` | `VendorPassword123` |
| **Customer** | `customer@pizzahub.com` | `CustomerPassword123` |

---

## 🚀 Running Locally

```bash
cd pizzahub-client
npm install
npm run dev
```

Client runs on: `http://localhost:3000`
