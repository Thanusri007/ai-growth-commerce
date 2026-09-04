# AI Growth & Commerce

> **AI-native ecommerce and agentic commerce platform for the Razorpay AI Buildathon 2026**

AI Growth & Commerce is an AI-powered commerce platform designed to help merchants increase revenue while enabling customers to discover products, receive intelligent recommendations, manage their cart, and complete payments through a secure conversational commerce experience.

The platform combines **AI shopping assistance, product recommendations, upselling, cross-selling, conversational checkout, merchant revenue intelligence, and Razorpay Test Mode payments** into one end-to-end system.

---

## 🚀 Key Features

### 🛍️ Customer Experience

* AI-powered shopping assistant
* Natural-language product discovery
* Product catalog and product details
* AI product recommendations
* Upselling and cross-selling
* Shopping cart management
* Conversational shopping flow
* Conversational checkout
* Explicit payment confirmation
* Razorpay Test Mode payment flow
* Payment verification
* Order confirmation
* Failed-payment handling
* Cart preservation after payment failure

### 📊 Merchant Experience

* Merchant revenue dashboard
* Revenue and sales metrics
* AI-generated revenue opportunities
* Upsell opportunities
* Cross-sell opportunities
* Campaign management
* Approval center
* Policy controls
* Audit trail
* AI-driven merchant insights

### 🤖 Agentic Commerce

The AI assistant can:

1. Understand a customer's natural-language request
2. Search the available product catalog
3. Recommend relevant products
4. Explain recommendations
5. Suggest upsells and cross-sells
6. Add products to the cart
7. Maintain shopping context
8. Start the checkout process
9. Request explicit payment confirmation
10. Create a payment/order flow
11. Verify payment on the server
12. Return an order confirmation

The agent does **not** autonomously charge a customer.

---

## 🔐 Safety & Payment Controls

Money actions are designed to be **explainable, bounded, and gated**.

The system follows these principles:

* Payment requires explicit customer confirmation.
* Product and cart information are validated by the backend.
* Payment amounts are validated server-side.
* Orders are not marked as paid without successful payment verification.
* Failed payments do not automatically clear the customer's cart.
* Sensitive API keys are stored through environment variables.
* API secrets are never committed to the repository.
* Important commerce actions can be recorded through the audit trail.

---

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│       Customer Website       │
│        React + Vite          │
└──────────────┬───────────────┘
               │
               │ /api
               ▼
┌──────────────────────────────┐
│         API Server           │
│        Node.js + TS          │
└──────────────┬───────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐   ┌──────────────┐
│ Product /   │   │ AI Services  │
│ Commerce    │   │ Gemini API   │
│ APIs        │   │              │
└─────────────┘   └──────────────┘
       │
       ▼
┌──────────────────────────────┐
│      Razorpay Test Mode      │
│       Payment Processing      │
└──────────────────────────────┘
```

---

## 🧰 Technology Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Query

### Backend

* Node.js
* TypeScript
* API server
* REST APIs

### AI

* Google Gemini API
* AI shopping assistant
* AI recommendations
* AI upselling/cross-selling
* AI revenue intelligence

### Payments

* Razorpay Test Mode

### Package Management

* pnpm
* pnpm workspaces

---

## 📁 Project Structure

```text
ai-growth-commerce/
│
├── artifacts/
│   │
│   ├── ai-growth-commerce/
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── api-server/
│   │   ├── src/
│   │   ├── package.json
│   │   └── build.mjs
│   │
│   └── mockup-sandbox/
│
├── lib/
│   ├── api-client-react/
│   ├── api-spec/
│   ├── api-zod/
│   └── db/
│
├── scripts/
│
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── tsconfig.json
└── README.md
```

---

# ⚙️ Local Setup

## 1. Clone the repository

```bash
git clone https://github.com/Thanusri007/ai-growth-commerce.git
cd ai-growth-commerce
```

## 2. Install dependencies

Make sure Node.js and pnpm are installed.

```bash
pnpm install
```

---

# 🔑 Environment Variables

The application may require API credentials for AI and payment functionality.

Create the required environment variables locally.

**Never commit API keys or secrets to GitHub.**

Example:

```text
GEMINI_API_KEY=your_gemini_api_key
```

For Razorpay Test Mode, configure the required test credentials according to the backend configuration.

Use **test/sandbox credentials only** during development.

---

# ▶️ Running the Application

The project uses separate frontend and backend services.

## Terminal 1 — Start the Backend

Open a terminal in:

```text
artifacts/api-server
```

Run:

```bash
export NODE_ENV=development
pnpm run build
PORT=5000 pnpm run start
```

The API server will run on:

```text
http://localhost:5000
```

---

## Terminal 2 — Start the Frontend

Open another terminal in:

```text
artifacts/ai-growth-commerce
```

Run:

```bash
MSYS_NO_PATHCONV=1 BASE_PATH=/ PORT=5173 pnpm dev
```

The frontend will run on:

```text
http://localhost:5173
```

Open the frontend in your browser:

```text
http://localhost:5173
```

---

# 🔄 API Communication

During development, the Vite development server proxies API requests from:

```text
/api/*
```

to:

```text
http://localhost:5000
```

For example:

```text
Frontend
   │
   │ GET /api/products
   ▼
Vite development server
   │
   │ proxy
   ▼
Backend
   │
   ▼
http://localhost:5000/api/products
```

---

# 💳 Razorpay Test Mode

The project is designed to demonstrate payment functionality using Razorpay's test/sandbox environment.

No real money should be used during testing.

The payment flow is designed around:

```text
Customer
   ↓
Cart
   ↓
Checkout
   ↓
Explicit confirmation
   ↓
Create payment
   ↓
Razorpay Test Mode
   ↓
Server-side verification
   ↓
Order confirmation
```

A failed payment should preserve the customer's cart and should not mark the order as successfully paid.

---

# 🤖 AI Commerce Flow

Example customer interaction:

```text
Customer:
"I need a laptop for development under my budget."

        ↓

AI Shopping Assistant

        ↓

Search Product Catalog

        ↓

Find Relevant Products

        ↓

Explain Recommendations

        ↓

Suggest Upsell / Cross-sell

        ↓

Customer Adds Product

        ↓

Cart

        ↓

Conversational Checkout

        ↓

Explicit Payment Confirmation

        ↓

Razorpay Test Mode

        ↓

Server-side Verification

        ↓

Order Confirmation
```

---

# 📈 Merchant Revenue Intelligence

The merchant experience provides AI-assisted revenue opportunities such as:

* Products frequently purchased together
* Upsell opportunities
* Cross-sell opportunities
* Revenue insights
* Campaign opportunities
* Approval workflows
* Policy controls
* Auditability

The goal is to help merchants **grow revenue through AI-assisted commerce rather than simply providing a traditional ecommerce dashboard.**

---

# 🧾 Auditability

Important commerce actions can be represented in the audit trail, including:

* AI recommendations
* Revenue opportunities
* Merchant approvals
* Campaign actions
* Checkout actions
* Payment-related actions
* Order-related actions

This provides visibility into how AI-driven commerce decisions are made.

---

# 🛡️ Security Principles

This project follows basic security practices for a hackathon implementation:

* API keys are stored outside source control.
* Secrets should be provided through environment variables.
* Payment credentials should use test-mode keys.
* Payment verification is performed server-side.
* The client is not treated as the source of truth for payment amounts.
* Failed payments should not result in false successful orders.

---

# 🧪 Development

Frontend build:

```bash
cd artifacts/ai-growth-commerce
pnpm build
```

Frontend type checking:

```bash
pnpm typecheck
```

Backend build:

```bash
cd artifacts/api-server
pnpm run build
```

---

# 🎯 Razorpay AI Buildathon

This project targets the **AI Growth & Agentic Commerce** track.

The core idea is to demonstrate how AI can participate in commerce while keeping money movement controlled and auditable.

### Core demonstration

```text
AI discovers
      ↓
AI recommends
      ↓
AI assists
      ↓
AI upsells / cross-sells
      ↓
Customer confirms
      ↓
Payment is processed
      ↓
Payment is verified
      ↓
Order is completed
      ↓
Action is auditable
```

---

# 🌟 Why AI Growth & Commerce?

Traditional ecommerce primarily focuses on:

```text
Browse → Cart → Checkout
```

AI Growth & Commerce extends this into:

```text
Understand → Discover → Recommend → Personalize
       ↓
Upsell → Cross-sell → Assist
       ↓
Confirm → Pay → Verify → Complete
```

For merchants, AI can additionally identify opportunities to increase revenue and help execute approved actions.

---

# 👩‍💻 Project

**AI Growth & Commerce**

Built for:

**Razorpay AI Buildathon 2026**

Repository:

https://github.com/Thanusri007/ai-growth-commerce

---

## ⚠️ Disclaimer

This is a hackathon project and uses test/sandbox payment functionality for demonstration purposes.

Do not use production payment credentials or real customer payment information in local development.
