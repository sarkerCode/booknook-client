# 📚 BookNook — Curated Library & Book Borrowing Platform

> An editorial, modern book sanctuary and library management web application designed for passionate readers, curious minds, and literary communities.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-BookNook%20Live-C87555?style=for-the-badge&logo=vercel&logoColor=white)](https://booknook-client.vercel.app)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4-243447?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-8C9B88?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better--Auth-MongoDB-202A35?style=for-the-badge&logo=mongodb&logoColor=white)](https://better-auth.com/)

---

## 🌐 Live Website

- **Client Live URL:** [https://booknook-client.vercel.app](https://booknook-client.vercel.app)
- **Client Repository:** [https://github.com/sarkerCode/booknook-client](https://github.com/sarkerCode/booknook-client)
- **API Server Repository:** [https://github.com/sarkerCode/booknook-server](https://github.com/sarkerCode/booknook-server)

---

## ✨ Key Features

- **📖 Curated Catalog & Dynamic Filtering**: Explore a rich library of books with category filtering (Fiction, Non-Fiction, Sci-Fi, History, Biography, etc.), real-time stock counters, book ratings, and detailed book profile pages with editorial reviews.
- **⚡ Smart Inventory & Borrowing Engine**: Integrated one-click borrow modal that automatically decrements book stock using atomic MongoDB `$inc` operations. Prevents negative inventory, disables unavailable books with an informative "Not Available" state, and enforces **No Double Borrow** rules so users cannot borrow duplicate active copies.
- **📋 Personalized "My Borrows" Dashboard**: A dedicated reader hub displaying all books currently borrowed by the authenticated user, complete with book cover, title, borrow date, expected return date, and a seamless "Return Book" action that safely increments inventory back into general circulation.
- **✨ Dynamic New Arrivals & Editorial Hero Showcase**: Interactive hero carousel paired with a dynamic "New Arrivals" feed querying the newest 6 books in real-time with Next.js 16 Partial Prerendering (PPR) and Suspense streaming for optimal performance and SEO.
- **🔐 Secure Dual Authentication**: Powered by **Better-Auth** and MongoDB Atlas, featuring both 1-click **Google OAuth** social login and email/password authentication with real-time password strength validation rules (uppercase, lowercase, and 6+ minimum characters).
- **➕ Community Catalog Management (Add Book)**: Authenticated readers and librarians can contribute books to the collection with comprehensive metadata, image covers, descriptions, and initial inventory counts.
- **🎨 Bespoke Literary Design System**: Crafted with a warm paper-and-ink aesthetic (`#F4EFE6` paper cream, `#243447` ink navy, `#8C9B88` sage, and `#C87555` terracotta) built on Tailwind CSS v4, Base UI (shadcn base-nova), and Playfair Display serif typography.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Rendering & Cache:** Partial Prerendering (PPR), React Server Components, Suspense Streaming
- **UI Components:** [Base UI](https://base-ui.com/) (`@base-ui/react`) + shadcn `base-nova` primitives
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with custom `@theme inline` design tokens
- **Typography:** Playfair Display (Serif Headings) & DM Sans (Body)
- **Icons & Carousel:** Lucide Icons, Swiper, Embla Carousel

### Backend & Database
- **Auth Engine:** [Better-Auth](https://better-auth.com/) (`@better-auth/mongo-adapter`)
- **API Server:** Node.js, Express 5 REST API (`../booknook-server`)
- **Database:** MongoDB Atlas (Collections: `books`, `borrows`, `user`, `session`, `account`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- MongoDB Atlas cluster URI
- Google Cloud OAuth Credentials

### 1. Clone the Repository

```bash
git clone https://github.com/sarkerCode/booknook-client.git
cd booknook-client
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables Configuration

Create a `.env` file in the root directory and add the following credentials:

```env
# Backend REST API
NEXT_PUBLIC_API_URL=http://localhost:5000

# MongoDB Database Connection
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority

# Better-Auth Configuration
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_super_secret_key_here

# Google OAuth Provider Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Note for Google OAuth:** In [Google Cloud Console](https://console.cloud.google.com/), add `http://localhost:3000/api/auth/callback/google` (and your production domain equivalent) under **Authorized redirect URIs**.

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Build & Production

To create an optimized production build:

```bash
# Type check and build Next.js application
npm run build

# Start the production server
npm start
```

---

## 📂 Project Architecture

```plaintext
booknook-client/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/ # Better-Auth dynamic API route handler
│   │   ├── books/             # All books catalog page & [id] details
│   │   ├── my-borrows/        # User borrowed books management table
│   │   ├── add-book/          # Add new book catalog form
│   │   ├── login/             # Editorial sign-in page (Email + Google)
│   │   ├── register/          # User registration with password validator
│   │   ├── not-found.tsx      # Custom editorial 404 page
│   │   ├── layout.tsx         # Root layout with Navbar, Footer & Fonts
│   │   └── page.tsx           # Home landing page (Hero + New Arrivals)
│   ├── components/
│   │   ├── shared/            # Reusable Navbar, Footer, Skeletons
│   │   └── ui/                # Base UI & shadcn design primitives
│   └── lib/
│       ├── auth.ts            # Better-Auth server configuration
│       └── auth-client.ts     # Better-Auth client hooks (signIn, useSession)
├── AGENTS.md                  # Project architecture guidelines
└── package.json
```

---


