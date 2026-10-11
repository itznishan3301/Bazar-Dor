# 🛒 BazarDor (বাজার দর) — Daily Commodity Market Price Tracker

A modern, high-performance, and responsive web application designed to track and analyze daily wholesale and retail commodity prices across major markets in Bangladesh. **BazarDor** empowers everyday consumers and shoppers with real-time price updates, price fluctuations, and division-wise market comparisons to make informed purchasing decisions and avoid artificial price inflation.

---

## 🚀 Live Demo & Repository

- **Repository Link:** [https://github.com/itznishan3301/Bazar-Dor](https://github.com/itznishan3301/Bazar-Dor)
- **Live Deployment:** [https://bazardor123.netlify.app/](https://bazardor123.netlify.app/)]

---

## 🌟 Key Features (5+ Core Highlights)

1. **Continuous Real-Time Price Ticker Marquee:**
   - Positioned directly beneath the navigation bar, featuring an infinite-scroll marquee strip displaying real-time price indicators, units, and fluctuation badges (`▲ / ▼ %`) across all essential commodities.
   - Interactive hover-to-pause capability for effortless scanning.

2. **Market Risers & Fallers Tracker (Home Page Sections):**
   - **Section A (“আজ দাম বেড়েছে ▲”):** Highlights top 6 commodities with price surges compared to the previous day with distinct green indicators.
   - **Section B (“আজ দাম কমেছে ▼”):** Highlights top 6 commodities experiencing price drops with distinct red indicators.
   - **Section C (“সব পণ্য”):** Comprehensive responsive product grid with instant category filter chips and smooth skeleton loading placeholders.

3. **Numeric Price Sorting (Challenge C1):**
   - Category pages feature a multi-criteria sort dropdown: `Default (ডিফল্ট)`, `Price: Low to High (দাম: কম থেকে বেশি)`, and `Price: High to Low (দাম: বেশি থেকে কম)`.
   - Engineered to sort by genuine numeric values rather than string representations, ensuring mathematically accurate price order.

4. **Division-wise Market Breakdown & Analytics:**
   - Dedicated product detail pages (`/product/[slug]`) provide comprehensive pricing statistics: **Minimum Price**, **Maximum Price**, and **National Average Price**.
   - Interactive division filter tabs (Dhaka, Chittagong, Rajshahi, Khulna, Sylhet, etc.) allowing users to examine specific market rates across prominent wholesale and retail hubs.
   - Historical comparative strip reviewing prices from today, yesterday, last week, and last month.

5. **Secure Authentication & Profile Information Update (Challenge C3):**
   - Complete authentication flow supporting Email/Password, one-click Google OAuth, and GitHub OAuth powered by **BetterAuth** and **MongoDB Atlas**.
   - Protected route guards ensuring single product analysis pages are securely accessed by authenticated users with intelligent redirect preservation.
   - Profile management dashboard (`/profile`) paired with a dedicated information update workflow (`/profile/update`) allowing users to seamlessly edit their profile name synchronized across cloud database collections.

6. **Responsive Design & UX Polish:**
   - Fluid responsiveness optimized across mobile, tablet, and desktop viewports.
   - Graceful 404 page handling with instant return navigation.
   - Smooth skeleton animations during asynchronous data fetches and custom toast notifications powered by `react-hot-toast`.

---

## 🛠️ Technologies & Libraries Used

| Technology | Purpose |
|---|---|
| **Next.js 16 (App Router)** | Modern full-stack React framework with server and client components |
| **React 19** | Component-driven UI library |
| **Tailwind CSS v4** | Utility-first responsive styling engine |
| **DaisyUI v5** | Accessible, pre-styled semantic component primitives |
| **BetterAuth** | Comprehensive authentication engine with OAuth (Google & GitHub) and Session handling |
| **MongoDB Atlas** | Cloud NoSQL database for persistent user accounts and profile synchronization |
| **React Hot Toast** | Lightweight, animated toast notifications for user actions |
| **React Icons** | Feather & FontAwesome icon set |
| **Google Fonts (Hind Siliguri)** | Polished Bengali typography support |
| **Programming Hero OpenAPI** | RESTful endpoint delivering real-time commodity data with multi-URL fallback |

---

## 📁 Project Architecture & Folder Structure

```text
assignment/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...all]/
│   │       │   └── route.js     # BetterAuth route handler (OAuth endpoints)
│   │       ├── login/
│   │       │   └── route.js     # Credentials login endpoint with bcrypt verification
│   │       ├── register/
│   │       │   └── route.js     # User registration endpoint with MongoDB storage
│   │       └── update/
│   │           └── route.js     # Profile name update endpoint with MongoDB sync (C3)
│   ├── category/
│   │   └── [slug]/
│   │       └── page.js          # Dynamic category view with numeric sorting (C1)
│   ├── components/
│   │   ├── Footer.js            # Footer with tagline & market disclaimer
│   │   ├── Hero.js              # Responsive banner with smooth-scroll CTA
│   │   ├── HomeProducts.js      # Sections A, B, and C with category chips
│   │   ├── Navbar.js            # Sticky navbar with Bengali date & category links
│   │   ├── PriceTicker.js       # Infinite scrolling price marquee
│   │   ├── PrivateRoute.js      # Protected route client wrapper with redirect memory
│   │   ├── ProductCard.js       # Reusable commodity card with badge indicators
│   │   └── ProductSkeleton.js   # Animated skeleton loading grid
│   ├── context/
│   │   └── AuthContext.js       # Authentication state context provider (BetterAuth + Custom)
│   ├── lib/
│   │   ├── api.js               # Data fetcher utilities with multi-endpoint fallback
│   │   ├── auth.js              # BetterAuth server-side instance & MongoDB adapter
│   │   ├── auth-client.js       # BetterAuth client instance
│   │   ├── mongodb.js           # MongoDB connection client helper
│   │   └── utils.js             # Bengali numeral, date, unit, & badge formatters
│   ├── product/
│   │   └── [slug]/
│   │       └── page.js          # Protected product details & market matrix
│   ├── profile/
│   │   ├── page.js              # User profile overview
│   │   └── update/
│   │       └── page.js          # Profile name update route (C3)
│   ├── signin/
│   │   └── page.js              # Sign In page with email, Google & GitHub OAuth
│   ├── signup/
│   │   └── page.js              # Sign Up registration page with validation
│   ├── globals.css              # Design tokens, keyframe animations, & utilities
│   ├── layout.js                # Root layout with font imports & global toaster
│   ├── not-found.js             # Custom 404 page with home redirect
│   └── page.js                  # Primary Home landing page
├── public/
│   ├── bazar-hero.png           # Hero banner asset
│   └── logo-icon.png            # Official brand logo
├── next.config.mjs              # Next.js configuration
├── package.json                 # Project dependencies & scripts
└── README.md                    # Project documentation
```

---

## ⚡ Getting Started (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/itznishan3301/Bazar-Dor.git
cd Bazar-Dor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

### 4. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 🌐 API Endpoints & Resilience

The application connects to the primary endpoint with automated multi-URL fallback redundancy:
- **Primary Endpoint:** `https://openapi.programming-hero.com/api/bazardor`
- **Fallback Endpoint 1:** `https://api.api-store.workers.dev/api/bazardor`
- **Fallback Endpoint 2:** `https://api.abcz.workers.dev/api/bazardor`

- **All Commodities:** `/products`
- **Category Filter:** `/products?category={category_slug}`
- **Single Product Details:** `/products/{id}`
- **All Categories:** `/categories`
- **Single Category:** `/categories/{slug}`

---
