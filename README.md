# Sweet Shop - Full Stack E-Commerce Platform

A modern, full-stack e-commerce application for managing a sweet shop with real-time inventory management, user authentication, and a beautiful, responsive interface.

Built with **MERN Stack** (MongoDB, Express, React, Node.js) and **TypeScript** following test-driven development principles.

## 🚀 Features

### Customer Features
- **User Authentication** - Secure registration and login with JWT tokens
- **Product Browsing** - View all available sweets with high-quality images
- **Smart Search** - Real-time debounced search by name, category, and price range
- **Shopping Cart** - Add items to cart with quantity management
- **Cart Persistence** - Cart data stored in MongoDB for security and persistence
- **Secure Checkout** - Complete purchases with inventory validation
- **Responsive Design** - Seamless experience across desktop, tablet, and mobile devices
- **Image Upload** - Product images hosted on Cloudinary CDN

### Admin Features
- **Admin Dashboard** - Dedicated panel for inventory management
- **Product Management** - Create, update, and delete sweets
- **Image Management** - Upload and manage product images via Cloudinary
- **Inventory Control** - Restock products and track quantities
- **Real-time Updates** - Instant inventory updates across all users
- **Role-based Access** - Secure admin-only routes and operations

### Technical Features
- **Real-time Search** - 500ms debounced search for optimal performance
- **Stock Management** - Automatic inventory tracking and validation
- **Category Filtering** - Dynamic category dropdown populated from database
- **Secure Backend** - JWT authentication with protected routes
- **Form Validation** - Client and server-side validation
- **Error Handling** - Comprehensive error messages and user feedback
- **Test Coverage** - 30+ tests with ~78% code coverage

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **TypeScript** - Type-safe development
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password encryption
- **Cloudinary** - Image hosting and CDN
- **Multer** - File upload handling
- **Jest** & **Supertest** - Testing framework

### Frontend
- **React 18** with **TypeScript** - UI framework
- **Vite** - Fast build tool and dev server
- **React Router v6** - Client-side routing
- **Context API** - State management (Auth & Cart)
- **Axios** - HTTP client
- **React Icons** - Icon library
- **CSS3** - Modern styling with gradients and animations

## 📋 Prerequisites

- **Node.js** v16 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **Cloudinary Account** (for image uploads)
- **npm** or **yarn**

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/sarman03/sweet_shop.git
cd sweet-shop
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory with the following content:

```env
PORT=5000
MONGODB_URI=mongodb+srv://sarman:sarman@cluster0.zcxujkp.mongodb.net/
JWT_SECRET=sweet_shop_jwt_secret_key_2024
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=pfi
CLOUDINARY_API_KEY=426396619318821
CLOUDINARY_API_SECRET=SJbP1tMxT5s2pq6DsU-i02F4rwM
```

**Note**: The MongoDB database and Cloudinary account are already configured and ready to use!

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

Server will run on `http://localhost:5000`

### Start Frontend Development Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Access the Application

Open your browser and navigate to `http://localhost:5173`

## 👤 Creating Admin User

To access admin features, you need to manually set a user's role to `admin` in MongoDB:

### Using MongoDB Shell:
```javascript
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

### Using MongoDB Compass:
1. Connect to your database
2. Navigate to `sweet-shop` → `users` collection
3. Find your user and edit the document
4. Change `role` field to `"admin"`
5. Save changes

## 🧪 Testing

Run the comprehensive test suite:

```bash
cd backend
npm test
```

### Test Coverage
- **30 passing tests**
- **~78% code coverage**
- Tests include:
  - Authentication (registration, login)
  - CRUD operations (create, read, update, delete sweets)
  - Search and filter functionality
  - Inventory management (purchase, restock)
  - Authorization checks
  - Cart operations

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |

### Sweets
| Method | Endpoint | Description | Auth Required | Admin Only |
|--------|----------|-------------|---------------|------------|
| GET | `/api/sweets` | Get all sweets | Yes | No |
| GET | `/api/sweets/search` | Search sweets | Yes | No |
| POST | `/api/sweets` | Create sweet | Yes | Yes |
| PUT | `/api/sweets/:id` | Update sweet | Yes | Yes |
| DELETE | `/api/sweets/:id` | Delete sweet | Yes | Yes |
| POST | `/api/sweets/:id/restock` | Restock sweet | Yes | Yes |

### Cart
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart/add` | Add item to cart | Yes |
| PUT | `/api/cart/update/:sweetId` | Update cart item | Yes |
| DELETE | `/api/cart/remove/:sweetId` | Remove from cart | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |
| POST | `/api/cart/checkout` | Complete purchase | Yes |

## 📸 Screenshots

### Authentication
![Login Page](screenshots/login.png)
*Modern login interface with brown chocolate theme and tab-based navigation*

### Dashboard & Browse
![Main Dashboard](screenshots/main-dashboard.png)
*Product catalog with beautiful card layout, search bar, and category filtering*

### Search & Filter
![Search Interface](screenshots/search-filter.png)
*Smart search bar with name, category, and price range filters*

![Filter Working](screenshots/filter-working.png)
*Real-time filtering in action with debounced search*

### Shopping Cart
![Shopping Cart](screenshots/cart.png)
*Cart page with item management, quantity controls, and checkout*

### Admin Panel
![Admin Sweet List](screenshots/admin-sweetList.png)
*Admin dashboard showing inventory management with edit, delete, and restock options*

![Add New Sweet](screenshots/admin-addNewSweet.png)
*Admin form for adding new products with image upload via Cloudinary*

## 🎨 UI Features

### Modern Design
- **Brown Chocolate Theme** - Consistent color scheme throughout
- **Gradient Navbar** - Attractive brown gradient header
- **Icon-based Navigation** - Clean SVG icons for actions
- **Card-based Layout** - Modern product cards with hover effects
- **Stock Badges** - Visual indicators for product availability
- **Category Pills** - Color-coded category tags

### User Experience
- **Debounced Search** - Real-time search with 500ms delay for performance
- **Category Dropdown** - Easy filtering with actual categories from database
- **Responsive Grid** - Adapts to different screen sizes
- **User Dropdown** - Clean dropdown menu for logout
- **Cart Badge** - Real-time cart item count display
- **Loading States** - Visual feedback during data fetching
- **Error Messages** - Clear, user-friendly error notifications

## 📁 Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── __tests__/           # Jest test files
│   │   ├── config/              # Database & Cloudinary config
│   │   ├── controllers/         # Route handlers
│   │   ├── middleware/          # Auth & upload middleware
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # Express routes
│   │   ├── utils/               # Helper functions
│   │   ├── app.ts               # Express setup
│   │   └── server.ts            # Entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── AdminPanel.tsx   # Admin dashboard
│   │   │   ├── SearchBar.tsx    # Search component
│   │   │   └── SweetCard.tsx    # Product card
│   │   ├── contexts/            # React contexts
│   │   │   ├── AuthContext.tsx  # Authentication state
│   │   │   └── CartContext.tsx  # Shopping cart state
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx    # Main page
│   │   │   ├── Login.tsx        # Auth page
│   │   │   └── Cart.tsx         # Cart page
│   │   ├── services/            # API layer
│   │   │   └── api.ts           # Axios instances
│   │   ├── types/               # TypeScript types
│   │   └── App.tsx              # Root component
│   └── package.json
│
└── README.md
```

## 🔐 Security Features

- **Password Hashing** - bcrypt with salt rounds
- **JWT Tokens** - Secure authentication
- **Protected Routes** - Backend middleware for auth
- **Role-based Access** - Admin-only operations
- **Input Validation** - Server-side validation
- **CORS Configuration** - Controlled cross-origin requests
- **Environment Variables** - Sensitive data protection

## 🎯 Future Enhancements

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Order history and tracking
- [ ] User profile management
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Dark mode toggle

## 🤖 My AI Usage

I used **Claude Code** by Anthropic as an AI assistant during the development of this project. Here's how I leveraged AI while maintaining full ownership and understanding of the codebase:

### How I Used AI

**1. Initial Project Setup & Boilerplate**
- I designed the overall architecture and folder structure myself
- Used Claude to generate initial boilerplate code for Express routes and React components
- Reviewed and modified all generated code to match my specific requirements
- Made all technology choices (MERN stack, TypeScript, Jest, Cloudinary)

**2. Test-Driven Development**
- I wrote test specifications and requirements
- Claude helped generate test cases following TDD principles
- I reviewed each test to ensure it matched my business logic
- Debugged and fixed failing tests myself
- Achieved 30 tests with ~78% coverage through iterative development

**3. Feature Implementation**
- **Authentication System**: I designed the JWT flow; AI helped with bcrypt implementation
- **Cart System**: I architected the MongoDB cart schema; AI assisted with controller logic
- **Search Functionality**: I implemented debouncing strategy; AI helped with optimization
- **Image Upload**: I chose Cloudinary and configured it; AI helped with Multer integration
- **UI/UX Design**: I designed the brown chocolate theme and layout; AI helped with CSS styling

**4. Debugging & Problem Solving**
- When I encountered TypeScript errors, I used AI to identify type issues
- I made final decisions on all fixes and implementations
- Debugged complex state management issues in React contexts myself

**5. Code Quality**
- I established coding standards and naming conventions
- Used AI to suggest improvements for cleaner code
- Refactored all code to match my preferred patterns

### My Reflection

**Benefits:**
- **Faster Development**: AI helped speed up repetitive tasks like writing boilerplate and test cases, allowing me to focus on architecture and business logic
- **Learning Tool**: Exposed me to different approaches and best practices that I evaluated and adopted
- **Debugging Partner**: Helpful for identifying issues, but I validated all solutions

**My Approach:**
- Never blindly accepted AI suggestions - always reviewed and understood the code
- Made all architectural decisions independently
- Wrote custom logic for cart management, search optimization, and UI features
- I can explain and modify any part of this codebase confidently

**Transparency:**
All commits where AI assisted include co-authorship attribution (`Co-Authored-By: Claude <noreply@anthropic.com>`), maintaining full transparency about AI usage while ensuring I understand and own every line of code.

## 📝 Development Notes

This project was built with a focus on:
- **Clean Code** - Consistent naming and organization
- **Type Safety** - Full TypeScript implementation
- **Testing** - TDD approach with comprehensive coverage
- **Performance** - Optimized with debouncing and memoization
- **UX Design** - Intuitive and responsive interface
- **Security** - Following best practices for authentication

## 📄 License

This project is available for educational and portfolio purposes.

## 🙏 Acknowledgments

- Built with modern web development best practices
- Inspired by real-world e-commerce platforms
- Development assisted by Claude Code

---

**Author**: Sarmanpreet Singh
**Repository**: [github.com/sarman03/sweet_shop](https://github.com/sarman03/sweet_shop)
