# SMSystem - Complete Documentation

---

## Table of Contents
1. Executive Summary
2. Technical Stack
3. Project Architecture
4. Core Features
5. System Requirements
6. Installation & Setup
7. Database Models
8. API Reference
9. Getting Started Guide
10. Development Workflow
11. Deployment
12. Security & Performance
13. Support & Maintenance

---

# SECTION 1: EXECUTIVE SUMMARY

## What is SMSystem?

**SMSystem** is a comprehensive Sales & Stock Management System designed to streamline inventory, order, and supply chain operations. It features a modern web interface coupled with terminal/POS integration capabilities, enabling businesses to manage products, customers, orders, expenses, and supplier relationships through a centralized platform.

## Key Highlights

| Aspect | Details |
|--------|---------|
| **Status** | Complete, Production-Ready |
| **Backend** | Go + Gin (REST API) with JWT Authentication |
| **Frontend** | React 19 + TypeScript, Tauri Desktop App |
| **Database** | MySQL 8.0 with GORM ORM |
| **Architecture** | Modular, scalable microservice-ready |
| **Deployment** | Docker-ready with docker-compose |

## Core Capabilities

✅ **User Management** - Registration, login, JWT authentication
✅ **Inventory Control** - Products, categories, brands, suppliers
✅ **Order Management** - Create, track, manage customer orders
✅ **POS Terminal** - Point-of-sale system with receipt printing
✅ **Business Analytics** - Real-time dashboard with KPIs
✅ **Audit Trail** - Complete activity logging
✅ **Data Import** - Bulk data import capabilities
✅ **Expense Tracking** - Monitor business expenses

---

# SECTION 2: TECHNICAL STACK

## Backend
- **Language**: Go 1.21
- **Framework**: Gin Web Framework
- **Database**: MySQL 8.0
- **ORM**: GORM
- **Authentication**: JWT (golang-jwt/jwt/v5)
- **Encryption**: bcrypt (golang.org/x/crypto)
- **Configuration**: godotenv

## Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Desktop App**: Tauri 2.x
- **HTTP Client**: Axios
- **UI Components**: Lucide React, Recharts
- **Styling**: Tailwind CSS
- **Routing**: React Router v7

## Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: MySQL 8.0
- **Port Configuration**: API (8080) | MySQL (3307)

## Technology Stack Summary

```
Frontend:  React 19 + TypeScript + Vite + Tauri (Desktop)
Backend:   Go 1.21 + Gin Web Framework + GORM ORM
Database:  MySQL 8.0
Auth:      JWT with bcrypt encryption
DevOps:    Docker & Docker Compose
```

---

# SECTION 3: PROJECT ARCHITECTURE

## High-Level Architecture
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

## Directory Organization

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

# SECTION 4: CORE FEATURES

## User & Authentication
- User registration and login with JWT authentication
- Role-based access control (auth middleware)
- User management dashboard
- Session management

## Inventory Management
- **Products**: Create, read, update product catalog with categories/brands
- **Categories & Brands**: Organize products hierarchically
- **Suppliers**: Manage supplier information and relationships
- **Purchase Orders**: Track supplier orders and inventory replenishment

## Sales Operations
- **Orders**: Create and manage customer orders with detailed tracking
- **Customers**: Maintain customer database and profiles
- **POS/Terminal Integration**: Point-of-sale terminal support (simulation mode)
- **Receipt Generation**: Print receipts for transactions

## Business Analytics
- **Dashboard**: Real-time statistics and KPI insights
- **Activity Logs**: Comprehensive audit trail for all operations
- **Expense Tracking**: Monitor and categorize business expenses

## Data Management
- **Data Import**: Bulk import functionality for inventory/orders
- **Activity Logging**: Automatic logging of all user actions
- **Database Migrations**: Version-controlled schema changes

---

# SECTION 5: SYSTEM REQUIREMENTS

## Development Environment
- **Go**: 1.21 or higher
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Docker**: Latest version (optional, for containerized setup)
- **MySQL**: 8.0 (via Docker or local installation)

## Runtime Requirements
- **Memory**: Minimum 2GB RAM (development), 4GB recommended (production)
- **Storage**: 10GB minimum for database + logs
- **OS**: Windows, macOS, or Linux for desktop; any OS for web server

---

# SECTION 6: INSTALLATION & SETUP

## Quick Start

### Option 1: Docker (Recommended)
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

### Option 2: Manual Setup
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

## Environment Configuration

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

## Backend Setup Instructions
```bash
cd backend

# Create .env file with database credentials
echo. > .env

# Edit .env with:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=smsystem
# JWT_SECRET=random_secret_key

# Install dependencies
go mod download

# Run server
go run cmd/server/main.go
# Server starts on http://localhost:8080
```

## Frontend Setup Instructions
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Serves on http://localhost:5173
```

---

# SECTION 7: DATABASE MODELS

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

## Database Design

10 normalized tables supporting:
- User management & authentication
- Product catalog with categories/brands
- Customer profiles & order history
- Supplier relationships & purchase orders
- Expense tracking & activity logging

---

# SECTION 8: API REFERENCE

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except login/register require JWT authentication.

**Header Format:**
```
Authorization: Bearer <jwt_token>
```

## Getting a Token
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "token": "eyJhbGci..."
}
```

## Public Endpoints

### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token_here" }
```

### Health Check
```
GET /api/health

Response: { "status": "ok", "message": "SMSystem API is running" }
```

## Protected Endpoints (All Require JWT)

### User Management
```
GET    /api/auth/me                 - Get current user info
GET    /api/users                   - List all users
POST   /api/users                   - Create user
GET    /api/users/:id               - Get user details
PUT    /api/users/:id               - Update user
DELETE /api/users/:id               - Delete user
```

### Products
```
GET    /api/products                - List products
POST   /api/products                - Create product
GET    /api/products/:id            - Get product details
PUT    /api/products/:id            - Update product
DELETE /api/products/:id            - Delete product
```

### Categories
```
GET    /api/categories              - List categories
POST   /api/categories              - Create category
GET    /api/categories/:id          - Get category details
PUT    /api/categories/:id          - Update category
DELETE /api/categories/:id          - Delete category
```

### Brands
```
GET    /api/brands                  - List brands
POST   /api/brands                  - Create brand
GET    /api/brands/:id              - Get brand details
PUT    /api/brands/:id              - Update brand
DELETE /api/brands/:id              - Delete brand
```

### Customers
```
GET    /api/customers               - List customers
POST   /api/customers               - Create customer
GET    /api/customers/:id           - Get customer details
PUT    /api/customers/:id           - Update customer
DELETE /api/customers/:id           - Delete customer
```

### Suppliers
```
GET    /api/suppliers               - List suppliers
POST   /api/suppliers               - Create supplier
GET    /api/suppliers/:id           - Get supplier details
PUT    /api/suppliers/:id           - Update supplier
DELETE /api/suppliers/:id           - Delete supplier
```

### Orders
```
GET    /api/orders                  - List orders
POST   /api/orders                  - Create order
GET    /api/orders/:id              - Get order details
PUT    /api/orders/:id              - Update order
DELETE /api/orders/:id              - Delete order
```

### Purchase Orders
```
GET    /api/purchase-orders         - List purchase orders
POST   /api/purchase-orders         - Create purchase order
GET    /api/purchase-orders/:id     - Get PO details
PUT    /api/purchase-orders/:id     - Update PO
DELETE /api/purchase-orders/:id     - Delete PO
```

### Expenses
```
GET    /api/expenses                - List expenses
POST   /api/expenses                - Create expense
GET    /api/expenses/:id            - Get expense details
PUT    /api/expenses/:id            - Update expense
DELETE /api/expenses/:id            - Delete expense
```

### Dashboard
```
GET    /api/dashboard               - Get statistics & KPIs
```

### Activity Logs
```
GET    /api/logs                    - List activity logs
GET    /api/logs/:id                - Get log details
```

### Data Import
```
POST   /api/import                  - Import data (CSV/Excel)
```

### Terminal/POS
```
GET    /api/terminal/status         - Get terminal status
POST   /api/terminal/transaction    - Process transaction
GET    /api/terminal/receipt/:id    - Get receipt
```

## Response Format

### Success Response (200 OK)
```json
{
  "data": { /* resource data */ },
  "message": "Operation successful",
  "status": "success"
}
```

### Error Response (4xx/5xx)
```json
{
  "error": "Error message",
  "status": "error",
  "code": "ERROR_CODE"
}
```

### List Response with Pagination
```json
{
  "data": [ /* array of items */ ],
  "total": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error |

## Example Requests

### Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGci..." \
  -d '{
    "name": "Laptop",
    "sku": "LAPTOP-001",
    "price": 999.99,
    "category_id": 1,
    "brand_id": 1,
    "quantity": 50
  }'
```

### Get Orders
```bash
curl -X GET "http://localhost:8080/api/orders?page=1&pageSize=20" \
  -H "Authorization: Bearer eyJhbGci..."
```

### Update Customer
```bash
curl -X PUT http://localhost:8080/api/customers/5 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGci..." \
  -d '{
    "name": "John Smith",
    "email": "john@example.com",
    "phone": "+1234567890"
  }'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:8080/api/dashboard \
  -H "Authorization: Bearer eyJhbGci..."
```

## Pagination

Query parameters:
- `page` (default: 1)
- `pageSize` (default: 20, max: 100)

Example:
```
GET /api/products?page=2&pageSize=50
```

## Filtering & Sorting

Support varies by endpoint. Common parameters:
- `search` - Search by name/description
- `sort` - Sort field (e.g., `created_at`)
- `order` - ASC or DESC

Example:
```
GET /api/products?search=laptop&sort=price&order=ASC
```

---

# SECTION 9: GETTING STARTED GUIDE

## Quickest Start (5 minutes)

### Prerequisites
- Docker Desktop installed
- Git installed
- Text editor or IDE

### Clone & Run
```bash
# Clone repository
git clone <repository-url>
cd SMSystem

# Start everything with Docker
docker-compose up -d

# Wait 30 seconds for MySQL to start
```

### Access Application
- **Web App**: http://localhost:5173 (frontend dev server)
- **API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

### Create Account & Login
1. Visit http://localhost:5173
2. Click "Register"
3. Create account with email and password
4. Login with your credentials
5. Start using the system!

## Main Features in Frontend

### 1. Dashboard
- Overview of business metrics
- Quick stats on orders, products, customers
- Navigate from sidebar

### 2. Products
- View all products
- Add new products with categories & brands
- Edit product details
- Track inventory

### 3. Orders
- Create new customer orders
- View order history
- Track order status
- Generate receipts

### 4. Customers
- Manage customer database
- View customer purchase history
- Track customer info

### 5. Suppliers & Purchase Orders
- Manage supplier relationships
- Create purchase orders for inventory replenishment

### 6. Staff (Users)
- User management
- Create additional user accounts
- Admin functions

### 7. Activity Logs
- View all system activity
- Audit trail for compliance
- User action tracking

### 8. Expenses
- Track business expenses
- Categorize expenses
- Monitor spending

## Configuration Guide

### Environment Variables (.env)

**Database**
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=smsystem_user
DB_PASSWORD=secure_password_here
DB_NAME=smsystem
```

**Application**
```
JWT_SECRET=generate_random_secret_here
GIN_MODE=debug              # or 'release' for production
PORT=8080                   # API port
```

### Docker Compose Variables
Edit `docker-compose.yml`:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: root_password
  MYSQL_DATABASE: smsystem
  MYSQL_USER: smsystem_user
  MYSQL_PASSWORD: user_password
```

## Database Access

### View Database
```bash
# Using MySQL CLI
mysql -h localhost -P 3307 -u smsystem_user -p smsystem

# Or use MySQL Workbench / DBeaver with same credentials
```

---

# SECTION 10: DEVELOPMENT WORKFLOW

## Running the Application

### Backend Server
```bash
cd backend
go run cmd/server/main.go
# Server runs on http://localhost:8080 (default)
```

### Frontend Development
```bash
cd frontend
npm run dev
# Vite dev server on http://localhost:5173
```

### Database
```bash
docker-compose up -d mysql
# MySQL on localhost:3307
```

## Code Quality
```bash
# Frontend linting
cd frontend
npm run lint

# Frontend building
npm run build

# Backend tests
cd ../backend
go test ./...
```

## Backend Development Commands
```bash
# Build
go build -o main cmd/server/main.go

# Run
go run cmd/server/main.go

# Run tests
go test ./...

# Format code
go fmt ./...
```

## Frontend Development Commands
```bash
# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Linting
npm run lint

# Build desktop app
npm run tauri build
```

## Database Migrations

The system includes database migrations that run automatically on startup.

### Manual Migration Run
```bash
cd backend
go run cmd/fix_mysql/main.go
```

---

# SECTION 11: DEPLOYMENT

## Docker Deployment
```bash
docker-compose up -d
```

## Environment Setup for Production
1. Update `.env` with production credentials
2. Set `GIN_MODE=release`
3. Use strong `JWT_SECRET`
4. Configure MySQL with proper backups
5. Set up HTTPS/TLS for frontend
6. Configure CORS appropriately

## Build Frontend for Distribution
```bash
cd frontend
npm run build
# Output in dist/ directory

# For Tauri desktop app
npm run tauri build
```

## Building for Production

### Backend
```bash
cd backend
go build -o main cmd/server/main.go
# Run with: ./main
```

### Frontend
```bash
cd frontend
npm run build
# Output in dist/ directory - serve these files
```

---

# SECTION 12: SECURITY & PERFORMANCE

## Security Features

✓ JWT-based authentication
✓ Password hashing with bcrypt
✓ CORS middleware configuration
✓ Environment-based secrets management
✓ Activity logging for audit trail
✓ Protected API routes with middleware

## Performance Considerations

- **Database Indexing**: MySQL indexes on frequently queried fields (user_id, product_id, order_id)
- **JWT Caching**: Stateless authentication reduces database load
- **API Response Pagination**: Implement for large datasets
- **Database Connection Pooling**: GORM manages pool automatically

## Scalability

- **Stateless API Design** - Horizontal scaling ready
- **Database Connection Pooling** - GORM optimized
- **Efficient Query Design** - GORM ORM with indexes
- **Containerized** - Easy deployment across environments

---

# SECTION 13: SUPPORT & MAINTENANCE

## Troubleshooting Common Issues

### Issue: "Connection refused" on localhost:8080
**Solution**:
- Ensure backend is running: `go run cmd/server/main.go`
- Check if port 8080 is already in use: `netstat -ano | findstr :8080`
- Change port in environment or config

### Issue: "Cannot connect to database"
**Solution**:
- Verify MySQL is running: `docker-compose ps`
- Check .env credentials match docker-compose.yml
- Allow 30 seconds for MySQL to start after docker-compose up

### Issue: "unauthorized" errors on API calls
**Solution**:
- Ensure token is included in Authorization header
- Token may be expired, try logging in again
- Check GUI shows you're logged in

### Issue: "Port already in use"
**Solution**: Windows PowerShell
```bash
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process
```

### Issue: npm modules not installing
**Solution**:
```bash
cd frontend
rm -r node_modules package-lock.json
npm install
```

## Logging

- **Backend logs**: Console output (configurable)
- **Frontend errors**: Browser console + error tracking
- **Database logs**: MySQL log files

## Monitoring

- **API health check**: `GET /api/health`
- **Activity logs** available through dashboard
- **Error logging** in handlers

## Status Pages

| Issue | Solution |
|-------|----------|
| MySQL connection failed | Verify DB credentials in `.env`, ensure MySQL is running |
| JWT invalid/expired | User must re-login to get new token |
| CORS errors | Configure CORS in Gin router for frontend domain |
| Port already in use | Change port in config or kill process using port |

## Quick Reference Commands

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Backend logs only
docker-compose logs -f backend

# Database logs only
docker-compose logs -f mysql

# Reset database
docker-compose down -v
docker-compose up -d

# Run backend without Docker
cd backend && go run cmd/server/main.go

# Run frontend without Docker
cd frontend && npm run dev

# Check health
curl http://localhost:8080/api/health
```

---

# PROJECT STATISTICS

- **Backend Files**: ~20 Go source files
- **Frontend Components**: 15+ React components
- **Database Tables**: 10 core tables
- **API Endpoints**: 50+ routes
- **Code Lines**: ~5000+ (excluding dependencies)

---

# CONCLUSION

SMSystem provides a solid, scalable foundation for a complete sales and inventory management solution. The modular architecture enables easy feature extensions, while the modern tech stack ensures maintainability and performance. The project is production-ready with proper error handling, authentication, and database design in place.

## Business Value

✨ **Efficiency** - Centralized inventory and order management
✨ **Scalability** - Modular architecture grows with business
✨ **Visibility** - Real-time dashboards and analytics
✨ **Reliability** - Audit trail for compliance
✨ **Flexibility** - Easy to extend with new features

## Future Enhancement Roadmap

- [ ] Payment gateway integration
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSockets)
- [ ] Inventory alerts and auto-replenishment
- [ ] Multi-location support
- [ ] API rate limiting
- [ ] Advanced user permissions/roles

## Development Readiness

| Check | Status |
|-------|--------|
| Code Foundation | ✅ Complete |
| API Routes | ✅ Fully Defined |
| Database Schema | ✅ Migrations Ready |
| Frontend Components | ✅ Core UI Complete |
| Docker Setup | ✅ Configured |
| Documentation | ✅ Comprehensive |
| Error Handling | ✅ Implemented |

---

**Document Version**: 1.0
**Last Updated**: March 2026
**Status**: Complete & Ready for Deployment

---

For questions or support: Contact the development team.
