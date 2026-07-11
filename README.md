# 🛍️ Styllin — Modern Fashion E-Commerce Store

  A responsive full-stack fashion e-commerce application built with React, Express, PostgreSQL, Prisma, and Stripe.

  🌐 **Live Website:** [https://styllin.onrender.com](https://styllin.onrender.com/)

  ---

  ## ✨ Features

  - 🛒 Shopping cart with quantity management
  - 👕 Responsive product catalogue
  - 🔍 Product search, filtering, and sorting
  - 👤 User registration and login
  - ✉️ Email verification
  - 📦 Order history and order tracking
  - 💳 Secure Stripe checkout
  - 💵 Cash on Delivery support
  - 🎟️ Coupon and discount support
  - ❌ Order cancellation and Stripe refunds
  - 🏠 Saved delivery addresses
  - 📱 Mobile-responsive navigation, hero, and product cards
  - 🛠️ Product and order administration dashboard
  - 🔔 Interactive notifications and loading states

  ---

  ## 🧰 Tech Stack

  ### Frontend

  - ⚛️ React 19
  - 🎨 Tailwind CSS
  - 🧭 React Router
  - 🎞️ Framer Motion
  - ✨ GSAP
  - 🖼️ Lucide React
  - 🌐 Fetch API / Axios

  ### Backend

  - 🟢 Node.js
  - 🚂 Express.js
  - 🗄️ PostgreSQL
  - 🔷 Prisma ORM
  - 💳 Stripe
  - 🔐 JSON Web Tokens
  - 📧 Nodemailer
  - 🌍 CORS

  ---

  ## 📁 Project Structure

  ```text
  E-commerce/
  ├── frontend-store/       # React storefront
  │   ├── public/
  │   └── src/
  │       ├── assets/
  │       ├── components/
  │       ├── lib/
  │       └── pages/
  │
  ├── backend-store/        # Express API
  │   ├── prisma/
  │   ├── routes/
  │   ├── tests/
  │   └── utils/
  │
  └── README.md

  ———

  ## 🚀 Run Locally

  ### 1. Clone the repository

  git clone <your-github-repository-url>
  cd E-commerce

  ### 2. Start the backend

  cd backend-store
  npm install
  npm run prisma:generate
  npm run prisma:push
  npm run dev

  The backend runs at:

  http://localhost:5000

  ### 3. Start the frontend

  Open another terminal:

  cd frontend-store
  npm install
  npm start

  The frontend runs at:

  http://localhost:3001

  ———

  ## ⚙️ Frontend Environment Variables

  Create frontend-store/.env:

  PORT=3001
  REACT_APP_API_URL=http://127.0.0.1:5000

  ———

  ## 🔐 Backend Environment Variables

  Create backend-store/.env:

  PORT=5000
  DATABASE_URL=your_postgresql_database_url
  JWT_SECRET=your_jwt_secret
  STRIPE_SECRET_KEY=your_stripe_secret_key
  STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
  CLIENT_URL=http://localhost:3001

  EMAIL_USER=your_email_address
  EMAIL_PASS=your_email_password

  > ⚠️ Never commit .env files or expose private credentials.

  ———

  ## 🧪 Testing

  ### Backend tests

  cd backend-store
  npm test

  ### Frontend tests

  cd frontend-store
  npm test -- --watchAll=false

  ### Frontend production build

  cd frontend-store
  npm run build

  ———

  ## 🌐 Allowed Frontend Origins

  The backend supports requests from:

  https://styllin.onrender.com
  http://localhost:3000
  http://localhost:3001
  http://localhost:3002

  ———

  ## 💳 Payments

  Styllin supports:

  - 💳 Stripe Checkout
  - 💵 Cash on Delivery
  - 🎟️ Coupon discounts
  - ↩️ Stripe refunds for eligible cancellations
  - 🧾 Server-authoritative order totals

  ———

  ## 📱 Responsive Design

  The storefront is optimized for:

  - 📱 Mobile phones
  - 📲 Tablets
  - 💻 Laptops
  - 🖥️ Desktop displays

  Mobile devices display a compact hero section, accessible navigation menu, and two product cards per row.

  ———

  ## 🔗 Live Demo

  ### 👉 Visit Styllin (https://styllin.onrender.com/)

  ———

  ## 🤝 Contributing

  Contributions are welcome!

  1. Fork the repository
  2. Create a feature branch
  3. Make your changes
  4. Test the application
  5. Open a pull request

  ———

  ## 👨‍💻 Author

  Developed with ❤️ for a modern and responsive shopping experience.

  ———

  ⭐ If you like this project, consider giving the repository a star!
