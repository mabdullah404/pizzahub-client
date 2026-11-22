# 🍕 PizzaHub — Frontend Client

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.2.0-orange?style=for-the-badge)](https://www.better-auth.com/)
[![Stripe](https://img.shields.io/badge/Stripe-Checkout-6772E5?style=for-the-badge&logo=stripe)](https://stripe.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/)

**PizzaHub** is a production-ready, full-stack, role-based Italian artisan pizza ordering and restaurant management platform. Built with the **Next.js 16 App Router**, **React 19**, and **Tailwind CSS**, it delivers a seamless culinary marketplace experience for Customers, Pizzeria Vendors, and Platform Administrators.

---

## 🌐 Live Deployments & Repositories

| Component | URL / Repository |
|---|---|
| **Live Client Application** | [https://pizzahub-client-tan.vercel.app](https://pizzahub-client-tan.vercel.app) |
| **Live Backend API** | [https://pizzahub-server-mu.vercel.app](https://pizzahub-server-mu.vercel.app) |
| **Client GitHub Repository** | [https://github.com/mabdullah404/pizzahub-client](https://github.com/mabdullah404/pizzahub-client) |
| **Server GitHub Repository** | [https://github.com/mabdullah404/pizzahub-server](https://github.com/mabdullah404/pizzahub-server) |

---

## 🎨 Italian Premium Design System

The platform's user interface is inspired by traditional Italian trattorias and artisanal woodfired pizzerias:

- **Primary Rustic Red (`#A92E24`)**: Signature Italian pizza crust and marinara tone.
- **Dark Wine Red (`#78231E`)**: Hover and active accent states.
- **Warm Olive Green (`#596B45`)**: Fresh basil and Mediterranean ingredient accents.
- **Warm Cream & Soft Beige (`#FAF5EB`, `#F2E9D9`)**: Gentle, appetizing backgrounds.
- **Typography**: `Playfair Display` for elegant headlines paired with `Inter` for crisp readability.
- **Dual Theme Support**: System-aware Dark and Light modes powered by `next-themes` with custom CSS variables.

---

## 👥 Role-Based Capabilities

```
┌────────────────────────────────────────────────────────┐
│                        PIZZAHUB                        │
├───────────────────┬──────────────────┬─────────────────┤
│     CUSTOMER      │      VENDOR      │      ADMIN      │
├───────────────────┼──────────────────┼─────────────────┤
│ • Browse & Search │ • Menu Catalog   │ • User Control  │
│ • Filter & Sort   │ • Add New Pizzas │ • Block/Unblock │
│ • Multi-image View│ • ImgBB Uploads  │ • Menu Review   │
│ • Custom Orders   │ • Order Dispatch │ • Approve/Reject│
│ • Live Timeline   │ • Free Plan Cap  │ • Financials    │
│ • Order History   │ • Stripe Premium │ • System Health │
└───────────────────┴──────────────────┴─────────────────┘
```

### 1. 🍕 Customer Experience
- **Interactive Menu Exploration**: Advanced live search by pizza name, category filter, city/location filter, and dynamic price sorting (`Low to High` / `High to Low`).
- **Item Details & Gallery**: High-resolution multi-image showcase with interactive thumbnail previews.
- **Order Placement**: Simple ordering modal capturing delivery date, address, and special preparation instructions. Prevents accidental duplicate orders for the same day.
- **Order Status Tracking**: Visual multi-stage tracking timeline (`Pending` ➔ `Accepted` ➔ `Delivered` / `Cancelled`).
- **Order Cancellation**: Real-time cancellation capability for pending orders.

### 2. 👨‍🍳 Vendor (Pizzeria) Portal
- **Culinary Operations Overview**: Metric cards showing active menu items, pending orders, completed deliveries, and subscription tier status.
- **Menu Management**: Full CRUD capabilities for pizzas, ingredients, pricing, and category assignments.
- **Image Hosting with ImgBB**: Multi-image file selection with client-side preview, validation, and automated cloud upload.
- **Tier Enforcement**: Free Plan automatically enforces a maximum of 3 active items.
- **Stripe Monetization**: One-click subscription upgrade to **Premium Pizzeria** ($29/month) unlocking unlimited menu items and homepage featured placement.
- **Order Dispatch**: Accept or Reject incoming customer orders with immutable state decisions.

### 3. 🛡️ Admin Moderation Suite
- **System Metrics**: Real-time counts of total users, active vendors, customers, catalog items, and gross platform revenue.
- **User Management**: Search users by name/email, filter by role, and securely suspend/block abusive accounts.
- **Menu Moderation**: Review pending pizza submissions from vendors with instant Approve or Reject actions.
- **Transaction Ledger**: Read-only audit log tracking all Stripe subscription payments and session IDs.

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16.4.6 (App Router) | Server-rendered pages, API routes, Turbopack builds |
| **UI Library** | React 19 | Component hierarchy and state management |
| **Styling** | Tailwind CSS v4 | Utility-first styling and responsive layouts |
| **Icons** | Lucide React | Clean, scalable vector icons |
| **Authentication** | Better Auth + MongoDB Adapter | Email/password, Google OAuth, and secure session management |
| **Theming** | `next-themes` | Persistent dark and light mode toggle |
| **Notifications** | `sonner` | Lightweight, customizable toast notifications |
| **Payments** | `@stripe/stripe-js` | Secure vendor subscription checkout redirect |
| **Data Fetching** | Native Fetch API | Resilient HTTP requests with bearer authorization |

---

## 📁 Project Directory Structure

```text
pizzahub-client/
├── app/
│   ├── (auth)/
│   │   ├── sign-in/page.jsx           # Email & Google Sign In with role redirection
│   │   ├── sign-up/page.jsx           # Public registration (Customer / Vendor)
│   │   └── layout.jsx                 # Authentication layout wrapper
│   ├── api/
│   │   └── auth/[...all]/route.js     # Better Auth catch-all route handler
│   ├── browse-menu/page.jsx           # Advanced search, category & location filters
│   ├── menu/[id]/page.jsx             # Detailed pizza page, gallery & order form
│   ├── dashboard/
│   │   ├── customer/                  # Customer overview, orders & profile
│   │   ├── vendor/                    # Vendor overview, menu CRUD, orders & subscription
│   │   └── admin/                     # Admin platform stats, users & menu moderation
│   ├── checkout/
│   │   ├── success/page.jsx           # Stripe success redirection handler
│   │   └── cancel/page.jsx            # Stripe cancellation handler
│   ├── layout.js                      # Root application layout with fonts & ThemeProvider
│   ├── page.js                        # Italian Premium landing page
│   ├── loading.jsx                    # Custom pizza preparation loading state
│   ├── not-found.jsx                  # Custom 404 error page
│   └── globals.css                    # Tailwind CSS v4 design tokens
├── components/
│   ├── Navbar.jsx                     # Dynamic navigation with live session state
│   ├── Footer.jsx                     # Footer with business links and branding
│   ├── MenuCard.jsx                   # Standardized pizza card component
│   ├── HeroSection.jsx                # Landing page hero with quick search
│   ├── CategorySection.jsx            # Category carousel and filter triggers
│   ├── FeaturedMenu.jsx               # Featured pizzas grid for approved items
│   ├── DashboardSidebar.jsx           # Role-adaptive sidebar navigation
│   └── ThemeToggle.jsx                # Dark / Light mode switcher
├── lib/
│   ├── api/                           # Modular API clients (menu, orders, payments, users)
│   ├── auth.js                        # Better Auth server configuration
│   ├── auth-client.js                 # Better Auth React client hooks
│   └── utils/                         # Helper functions and API URL resolver
├── public/                            # Static assets and culinary photography
├── .env.example                       # Environment template with dummy placeholders
├── package.json
└── README.md
```

---

## ⚙️ Environment Configuration

To configure the application locally, duplicate the provided `.env.example` file to create `.env.local`:

```bash
cp .env.example .env.local
```

### Required Variables (Template)

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_DB_URL=your_mongodb_connection_string_here

# Google OAuth Credentials (Optional for local dev)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Express REST API Server URL
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SERVER_URL=http://localhost:5000
```

> **Security Note:** Never commit `.env` or `.env.local` files to version control. The repository `.gitignore` ensures all environment files containing secrets remain strictly local.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18.17.0 or higher recommended)
- npm or pnpm or yarn
- Running instance of the `pizzahub-server` REST API

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/mabdullah404/pizzahub-client.git
cd pizzahub-client
npm install
```

### 2. Configure Environment
Create `.env.local` following the template above.

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
```bash
npm run build
npm run start
```

---

## 🔒 Security Best Practices Implemented

1. **Strict Client-Side Validation**: All forms (Sign Up, Item Creation, Order Placement) enforce strict validation schemas.
2. **Server-Side Route Protection**: Protected routes check session tokens and user roles on every request; untrusted client data is never assumed valid.
3. **Safe Storage**: No sensitive secrets or credentials exist in the client repository.
4. **CORS & Credentials**: API calls seamlessly transmit credentials (`include`) and Bearer headers to the verified Express backend origin.

---

## 📄 License

This project is licensed under the **MIT License**.
