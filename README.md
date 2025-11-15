# Sweet Shop Management System

A full-stack web application for managing a sweet shop, built with the MERN stack (MongoDB, Express, React, Node.js) following Test-Driven Development (TDD) principles.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [My AI Usage](#my-ai-usage)

## Features

### User Features
- User registration and authentication with JWT
- Browse all available sweets
- Search and filter sweets by name, category, and price range
- Purchase sweets (with quantity validation)
- Responsive, modern UI design

### Admin Features
- All user features
- Add new sweets to the inventory
- Update existing sweet details
- Delete sweets from inventory
- Restock sweets with additional quantity

## Tech Stack

### Backend
- **Node.js** with **TypeScript**
- **Express.js** - Web framework
- **MongoDB** with **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Jest** & **Supertest** - Testing framework
- **express-validator** - Input validation

### Frontend
- **React** with **TypeScript**
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **CSS3** - Styling

## Project Structure

```
sweet-shop/
├── backend/
│   ├── src/
│   │   ├── __tests__/          # Test files
│   │   │   ├── auth.test.ts
│   │   │   └── sweets.test.ts
│   │   ├── config/              # Configuration files
│   │   │   └── database.ts
│   │   ├── controllers/         # Route controllers
│   │   │   ├── authController.ts
│   │   │   └── sweetController.ts
│   │   ├── middleware/          # Custom middleware
│   │   │   └── auth.ts
│   │   ├── models/              # Database models
│   │   │   ├── User.ts
│   │   │   └── Sweet.ts
│   │   ├── routes/              # API routes
│   │   │   ├── authRoutes.ts
│   │   │   └── sweetRoutes.ts
│   │   ├── utils/               # Utility functions
│   │   │   └── jwt.ts
│   │   ├── app.ts              # Express app setup
│   │   └── server.ts           # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── AdminPanel.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   └── SweetCard.tsx
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.tsx
│   │   ├── pages/              # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sweet-shop
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Make sure MongoDB is running locally, or update `MONGODB_URI` with your MongoDB Atlas connection string.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Start the Backend

1. From the backend directory:
```bash
# Development mode with auto-reload
npm run dev

# Or build and run production
npm run build
npm start
```

The backend server will start on `http://localhost:5000`

### Start the Frontend

1. From the frontend directory:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (default Vite port)

### Access the Application

Open your browser and navigate to `http://localhost:5173`

- Register a new account or login
- To test admin features, you'll need to manually update a user's role in the database:

```javascript
// In MongoDB shell or Compass
db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

## Testing

### Backend Tests

The backend includes comprehensive test coverage using Jest and Supertest.

Run tests:
```bash
cd backend
npm test
```

This will run all tests and generate a coverage report showing:
- 30 passing tests
- ~78% code coverage
- Tests for authentication, CRUD operations, search, and inventory management

### Test Coverage Summary
- Authentication (Register & Login): 9 tests
- Sweets CRUD operations: 12 tests
- Search functionality: 4 tests
- Inventory management (Purchase & Restock): 5 tests

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sweets (All routes require authentication)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/search` - Search sweets with filters (name, category, minPrice, maxPrice)
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Authentication required)
- `POST /api/sweets/:id/purchase` - Purchase a sweet
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only)

## Screenshots

### Login Page
![Login Page - Shows the authentication interface with email and password fields]

### Dashboard
![Dashboard - Displays all available sweets in a responsive grid layout with search functionality]

### Search & Filter
![Search Interface - Demonstrates filtering sweets by name, category, and price range]

### Admin Panel
![Admin Panel - Shows administrative features including add, edit, delete, and restock functionality]

## My AI Usage

### AI Tools Used

I used **Claude Code** (Anthropic's official CLI for Claude) as my primary AI assistant throughout this project development.

### How I Used AI

#### 1. Project Architecture and Planning
- **What I did**: Asked Claude to help plan the overall project structure and tech stack
- **AI's role**: Claude suggested organizing the code into clear MVC patterns, recommended using TypeScript for type safety, and helped structure the folder organization for both backend and frontend
- **My contribution**: Made final decisions on the specific libraries and frameworks based on my familiarity and the project requirements

#### 2. Test-Driven Development (TDD)
- **What I did**: Followed TDD principles by writing tests first for all major features
- **AI's role**: Claude helped generate comprehensive test suites for:
  - Authentication endpoints (registration, login)
  - CRUD operations for sweets
  - Search and filter functionality
  - Inventory management (purchase, restock)
  - Authorization checks for admin operations
- **My contribution**: Reviewed all generated tests, adjusted test cases to match business requirements, and ensured proper test coverage

#### 3. Backend Implementation
- **What I did**: Implemented RESTful API with Express and TypeScript
- **AI's role**:
  - Generated boilerplate code for models, controllers, and routes
  - Helped implement JWT authentication and middleware
  - Suggested proper error handling patterns
  - Assisted with MongoDB schema design and validation
- **My contribution**: Refined the implementation, added business logic, configured database connections, and integrated all components

#### 4. Frontend Development
- **What I did**: Built a responsive React SPA with modern UI/UX
- **AI's role**:
  - Generated initial component structure for Login, Register, Dashboard, etc.
  - Created context for authentication state management
  - Helped design the API service layer with Axios
  - Generated CSS styles for responsive design
- **My contribution**: Customized the UI design, adjusted component logic, implemented proper state management, and ensured smooth user experience

#### 5. Debugging and Problem Solving
- **What I did**: Encountered TypeScript compilation errors
- **AI's role**: Identified type issues with Mongoose `_id` fields and suggested type assertions
- **My contribution**: Applied fixes and verified they worked across the codebase

#### 6. Documentation
- **What I did**: Created this comprehensive README
- **AI's role**: Helped structure the README and suggested sections to include
- **My contribution**: Wrote the AI usage section, added project-specific details, and customized setup instructions

### Reflection on AI Impact

#### Positive Impacts:

1. **Accelerated Development**: What might have taken several days was completed much faster with AI assistance. Claude helped generate boilerplate code quickly, allowing me to focus on business logic and architecture decisions.

2. **Better Code Quality**: AI suggestions led to:
   - More comprehensive test coverage (30 tests, 78% coverage)
   - Consistent code patterns and naming conventions
   - Proper error handling throughout the application
   - Type-safe TypeScript implementation

3. **Learning Opportunity**: Working with AI exposed me to:
   - Best practices for structuring MERN applications
   - Modern testing patterns with Jest and Supertest
   - Proper authentication flow with JWT
   - Clean separation of concerns

4. **TDD Discipline**: Having AI generate test cases first helped maintain strict TDD discipline throughout development, ensuring features were properly tested before implementation.

#### Challenges:

1. **Context Understanding**: Sometimes Claude generated code that needed adjustment to fit the specific project requirements. I had to carefully review and modify suggestions.

2. **Over-reliance Risk**: I had to be mindful not to blindly accept AI suggestions and ensure I understood every piece of code being added to the project.

3. **Integration Work**: While AI could generate individual components well, integrating them and ensuring they worked together required manual effort and debugging.

### Transparency Statement

Throughout this project, I've been transparent about AI usage:
- AI-generated code was always reviewed and understood before integration
- I made architectural decisions and business logic implementations
- All commits involving AI assistance include co-authorship attribution
- This README clearly documents where and how AI was used

The final application represents a collaboration between human decision-making and AI code generation, resulting in a well-tested, functional, and maintainable full-stack application.

## License

This project was created as a technical assessment and is available for educational purposes.

## Author

Developed with AI assistance from Claude Code by Anthropic.
