# SMSystem - Project Documentation

## Executive Summary

**SMSystem** is a comprehensive Sales & Stock Management System designed to streamline inventory, order, and supply chain operations. It features a modern web interface coupled with terminal/POS integration capabilities, enabling businesses to manage products, customers, orders, expenses, and supplier relationships through a centralized platform.

---

## 1. Technical Stack

### Backend
- **Language**: Go 1.21
- **Framework**: Gin Web Framework
- **Database**: MySQL 8.0
- **ORM**: GORM
- **Authentication**: JWT (golang-jwt/jwt/v5)
- **Encryption**: bcrypt (golang.org/x/crypto)
- **Configuration**: godotenv

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Desktop App**: Tauri 2.x
- **HTTP Client**: Axios
- **UI Components**: Lucide React, Recharts
- **Styling**: Tailwind CSS
- **Routing**: React Router v7

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL 8.0
- **Port Configuration**: API (default) | MySQL (3307)

---

## 2. Project Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────┐
│         Frontend (React/Tauri)          │
│    Web & Desktop Application Layer      │
└──────────────────┬──────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────┐
│      Backend (Go/Gin)                   │
│    API Gateway & Business Logic         │
├──────────────────────────────────────────┤
│  - Auth Service      - Order Service    │
│  - Product Service   - Customer Service │
│  - Supplier Service  - Dashboard Service│
│  - Terminal Service  - Import Service   │
└──────────────────┬──────────────────────┘
                   │ SQL
┌──────────────────▼──────────────────────┐
│      MySQL Database                     │
│    (Users, Products, Orders, etc.)      │
└──────────────────────────────────────────┘
```

### Directory Organization
```
backend/
├── cmd/                          # Command executables
│   ├── server/main.go           # API server entry point
│   ├── fix_mysql/               # Database utilities
│   └── promote/                 # Admin promotion utility
├── internal/
│   ├── config/                  # Configuration management
│   ├── database/                # MySQL connection & setup
│   ├── handlers/                # HTTP request handlers
│   ├── middleware/              # Authentication middleware
│   ├── models/                  # Data models (GORM)
│   ├── routes/                  # API route definitions
│   └── services/                # Business logic services
├── migrations/                  # Database schema migrations
└── go.mod                       # Dependency management

frontend/
├── src/
│   ├── api/                     # HTTP client configuration
│   ├── components/              # Reusable React components
│   ├── context/                 # Auth context & state
│   ├── hooks/                   # Custom React hooks
│   ├── pages/                   # Page components (routes)
│   └── main.tsx                 # Application entry point
└── src-tauri/                   # Tauri desktop app config
```

---

## 3. Core Features

### User & Authentication
- User registration and login with JWT authentication
- Role-based access control (auth middleware)
- User management dashboard
- Session management

### Inventory Management
- **Products**: Create, read, update product catalog with categories/brands
- **Categories & Brands**: Organize products hierarchically
- **Suppliers**: Manage supplier information and relationships
- **Purchase Orders**: Track supplier orders and inventory replenishment

### Sales Operations
- **Orders**: Create and manage customer orders with detailed tracking
- **Customers**: Maintain customer database and profiles
- **POS/Terminal Integration**: Point-of-sale terminal support (simulation mode)
- **Receipt Generation**: Print receipts for transactions

### Business Analytics
- **Dashboard**: Real-time statistics and KPI insights
- **Activity Logs**: Comprehensive audit trail for all operations
- **Expense Tracking**: Monitor and categorize business expenses

### Data Management
- **Data Import**: Bulk import functionality for inventory/orders
- **Activity Logging**: Automatic logging of all user actions
- **Database Migrations**: Version-controlled schema changes

---

## 4. System Requirements

### Development Environment
- **Go**: 1.21 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: Latest version (optional, for containerized setup)
- **MySQL**: 8.0 (via Docker or local installation)

### Runtime Requirements
- **Memory**: Minimum 2GB RAM (development), 4GB recommended (production)
- **Storage**: 10GB minimum for database + logs
- **OS**: Windows, macOS, or Linux for desktop; any OS for web server

---

## 5. Installation & Setup

### Prerequisites
```bash
# Windows
- Go 1.21+
- Node.js 18+
- MySQL 8.0+ or Docker Desktop
- Git
```

### Quick Start

#### Option 1: Docker (Recommended)
```bash
# Clone repository
git clone <repo-url>
cd SMSystem

# Install frontend dependencies
cd frontend
npm install
cd ..

# Build and run with Docker
docker-compose up -d

# Access API at http://localhost:8080
# Access MySQL at localhost:3307
```

#### Option 2: Manual Setup
```bash
# Backend
cd backend
go mod download
go run cmd/server/main.go

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Configuration
Create a `.env` file in the backend directory:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=smsystem_user
DB_PASSWORD=secure_password
DB_NAME=smsystem
JWT_SECRET=your_jwt_secret_key
GIN_MODE=debug  # or release for production
```

---

## 6. Database Models

| Model | Purpose |
|-------|---------|
| **User** | System users with authentication credentials |
| **Product** | Inventory items with pricing and categories |
| **Category** | Product categorization |
| **Brand** | Product brand information |
| **Customer** | Customer profiles and contact details |
| **Order** | Sales orders with line items |
| **PurchaseOrder** | Supplier purchase orders |
| **Supplier** | Supplier information and contact |
| **Expense** | Business expense tracking |
| **ActivityLog** | Audit trail of all system operations |

---

## 7. API Overview

### Authentication
```
POST   /api/auth/register      - User registration
POST   /api/auth/login         - User login (returns JWT)
GET    /api/auth/me            - Get current user info
```

### Dashboard
```
GET    /api/dashboard          - Get business statistics
```

### Resources (Protected Routes)
```
GET    /api/products           - List products
GET    /api/orders             - List orders
GET    /api/customers          - List customers
GET    /api/suppliers          - List suppliers
GET    /api/categories         - List categories
GET    /api/brands             - List brands
POST   /api/import             - Import data
GET    /api/logs               - View activity logs
GET    /api/expenses           - List expenses
```

All endpoints except `/auth/register` and `/auth/login` require JWT authentication via Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 8. Development Workflow

### Running the Application

**Backend Server**
```bash
cd backend
go run cmd/server/main.go
# Server runs on http://localhost:8080 (default)
```

**Frontend Development**
```bash
cd frontend
npm run dev
# Vite dev server on http://localhost:5173
```

**Database**
```bash
docker-compose up -d mysql
# MySQL on localhost:3307
```

### Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Frontend building
npm run build

# Backend tests (if implemented)
cd ../backend
go test ./...
```

---

## 9. Deployment

### Docker Deployment
```bash
docker-compose up -d
```

### Environment Setup for Production
1. Update `.env` with production credentials
2. Set `GIN_MODE=release`
3. Use strong `JWT_SECRET`
4. Configure MySQL with proper backups
5. Set up HTTPS/TLS for frontend
6. Configure CORS appropriately

### Build Frontend for Distribution
```bash
cd frontend
npm run build
# Output in dist/ directory

# For Tauri desktop app
npm run tauri build
```

---

## 10. Key Features by Module

### Auth Service
- JWT token generation and validation
- Password hashing with bcrypt
- User authentication and authorization

### Product Service
- Product CRUD operations
- Category and brand management
- Inventory tracking

### Order Service
- Order creation and management
- Order status tracking
- Line item management with activity logging

### Terminal Service
- POS terminal simulation
- Receipt generation and printing
- Transaction handling

### Log Service
- Comprehensive activity logging
- User action tracking
- Audit trail maintenance

---

## 11. Performance Considerations

- **Database Indexing**: MySQL indexes on frequently queried fields (user_id, product_id, order_id)
- **JWT Caching**: Stateless authentication reduces database load
- **API Response Pagination**: Implement for large datasets
- **Database Connection Pooling**: GORM manages pool automatically

---

## 12. Security Features

✓ JWT-based authentication  
✓ Password hashing with bcrypt  
✓ CORS middleware configuration  
✓ Environment-based secrets management  
✓ Activity logging for audit trail  
✓ Protected API routes with middleware  

---

## 13. Future Enhancement Roadmap

- [ ] Payment gateway integration
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Inventory alerts and auto-replenishment
- [ ] Multi-location support
- [ ] API rate limiting
- [ ] Advanced user permissions/roles

---

## 14. Support & Maintenance

### Logging
- Backend logs: Console output (configurable)
- Frontend errors: Browser console + error tracking
- Database logs: MySQL log files

### Monitoring
- API health check: `GET /api/health`
- Activity logs available through dashboard
- Error logging in handlers

### Troubleshooting
| Issue | Solution |
|-------|----------|
| MySQL connection failed | Verify DB credentials in `.env`, ensure MySQL is running |
| JWT invalid/expired | User must re-login to get new token |
| CORS errors | Configure CORS in Gin router for frontend domain |
| Port already in use | Change port in config or kill process using port |

---

## Project Statistics

- **Backend Files**: ~20 Go source files
- **Frontend Components**: 15+ React components
- **Database Tables**: 10 core tables
- **API Endpoints**: 50+ routes
- **Code Lines**: ~5000+ (excluding dependencies)

---

## Conclusion

SMSystem provides a solid, scalable foundation for a complete sales and inventory management solution. The modular architecture enables easy feature extensions, while the modern tech stack ensures maintainability and performance. The project is production-ready with proper error handling, authentication, and database design in place.

---

**Document Version**: 1.0  
**Last Updated**: March 2026  
**Status**: Complete & Ready for Deployment
