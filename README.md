# 🎾 AMA Tennis Academy Booking System

A modern, full-stack web application for managing coach scheduling and payment tracking at a local tennis academy. Built with cutting-edge technologies and best practices.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🚀 Screenshot Demos

Insert Later

## ✨ Features

### 🎯 Admin Dashboard
- **Comprehensive Overview**: Real-time statistics and analytics dashboard
- **Session Management**: Create, edit, and delete coaching sessions with calendar integration
- **Coach Management**: Add, update, and manage coach profiles with hourly rate tracking
- **Payment Tracking**: Monitor and process coach payments with status management
- **Financial Reports**: Earnings analysis and payment history with detailed breakdowns
- **Role-based Access Control**: Secure admin-only access to sensitive operations

### 🏆 Coach Dashboard
- **Personal Overview**: Individual session and earnings dashboard with real-time updates
- **Session Calendar**: Visual representation of upcoming sessions with drag-and-drop functionality
- **Earnings Tracker**: Real-time payment status and earnings calculation based on hourly rates
- **Profile Management**: Update personal information and hourly rates with secure authentication
- **Performance Analytics**: Session history and earnings breakdown with monthly/yearly views

### 🔐 Security & Authentication
- **JWT-based Authentication**: Secure token-based authentication with role-based access control
- **Password Hashing**: bcrypt encryption for user passwords with salt rounds
- **Input Validation**: Comprehensive form validation and sanitization for all user inputs
- **CORS Protection**: Cross-origin resource sharing security with proper headers
- **Rate Limiting**: API protection against abuse with configurable limits
- **Environment Variables**: Secure configuration management for sensitive data

## 🛠 Tech Stack

### Frontend
- **Next.js 13+** - React framework with App Router and server-side rendering
- **TypeScript** - Type-safe JavaScript development with strict type checking
- **TailwindCSS** - Utility-first CSS framework for responsive design
- **React Big Calendar** - Professional calendar component for scheduling
- **React Hook Form** - Performant form handling with validation

### Backend
- **Node.js** - JavaScript runtime environment with event-driven architecture
- **Express.js** - Fast, unopinionated web framework with middleware support
- **MongoDB** - NoSQL database for flexible data storage and scalability
- **Mongoose** - MongoDB object modeling for Node.js with schema validation
- **JWT** - JSON Web Tokens for stateless authentication
- **bcryptjs** - Password hashing library with salt generation

### Development Tools
- **ESLint** - Code linting and formatting for code quality
- **Prettier** - Code formatter for consistent styling
- **nodemon** - Development server with auto-reload functionality
- **TypeScript** - Static type checking and modern JavaScript features

## 🗄 Database Schema

### User Model
```typescript
{
  name: string;           // User's full name
  email: string;          // Unique email address for authentication
  password: string;       // Hashed password using bcrypt
  role: 'admin' | 'coach'; // User role for access control
  hourlyRate: number;     // Coach's hourly rate for payment calculation
  createdAt: Date;        // Account creation timestamp
  updatedAt: Date;        // Last update timestamp
}
```

### Session Model
```typescript
{
  name: string;           // Session name/description
  start: Date;           // Session start time and date
  end: Date;             // Session end time and date
  coaches: User[];       // Array of assigned coaches for the session
  paid: boolean;         // Payment status indicator
  recurring: boolean;    // Flag for recurring session patterns
  createdAt: Date;       // Session creation timestamp
  updatedAt: Date;       // Last modification timestamp
}
```

### Payment Model
```typescript
{
  session: Session;      // Reference to associated session
  coach: User;          // Reference to coach receiving payment
  amount: number;       // Payment amount calculated from session duration
  status: 'pending' | 'paid' | 'cancelled'; // Payment status tracking
  paidAt?: Date;        // Payment completion timestamp
  createdAt: Date;      // Payment creation timestamp
  updatedAt: Date;      // Last payment update timestamp
}
``` 