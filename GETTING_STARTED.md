# SMSystem - Getting Started Guide

## What is SMSystem?

A complete Sales & Stock Management System with web and desktop interfaces for managing inventory, orders, customers, and business operations.

---

## Quickest Start (5 minutes)

### Step 1: Prerequisites
- Docker Desktop installed
- Git installed
- Text editor or IDE

### Step 2: Clone & Run
```bash
# Clone repository
git clone <repository-url>
cd SMSystem

# Start everything with Docker
docker-compose up -d

# Wait 30 seconds for MySQL to start
```

### Step 3: Access Application
- **Web App**: http://localhost:5173 (frontend dev server)
- **API**: http://localhost:8080/api
- **Health Check**: http://localhost:8080/api/health

### Step 4: Create Account & Login
1. Visit http://localhost:5173
2. Click "Register"
3. Create account with email and password
4. Login with your credentials
5. Start using the system!

---

## Manual Setup (Without Docker)

### Prerequisites on Windows
```bash
# Check versions
go version          # Should be 1.21+
node --version      # Should be 18+
npm --version       # Should be 9+

# Download MySQL 8.0
# OR use: choco install mysql
```

### Backend Setup
```bash
cd backend

# Create .env file
echo. > .env
# Edit .env with your database credentials:
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

### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Serves on http://localhost:5173
```

---

## Project Structure at a Glance

```
SMSystem/
├── backend/              Go REST API
│   ├── cmd/             Entry points (server, utilities)
│   ├── internal/        Business logic & handlers
│   └── migrations/      Database schemas
├── frontend/            React web app
│   ├── src/            React components & pages
│   └── src-tauri/      Desktop app configuration
├── docker-compose.yml  Container orchestration
└── Documentation files
```

---

## Using SMSystem

### Main Features in Frontend

#### 1. **Dashboard**
- Overview of business metrics
- Quick stats on orders, products, customers
- Navigate from sidebar

#### 2. **Products**
- View all products
- Add new products with categories & brands
- Edit product details
- Track inventory

#### 3. **Orders**
- Create new customer orders
- View order history
- Track order status
- Generate receipts

#### 4. **Customers**
- Manage customer database
- View customer purchase history
- Track customer info

#### 5. **Suppliers & Purchase Orders**
- Manage supplier relationships
- Create purchase orders for inventory replenishment

#### 6. **Staff (Users)**
- User management
- Create additional user accounts
- Admin functions

#### 7. **Activity Logs**
- View all system activity
- Audit trail for compliance
- User action tracking

#### 8. **Expenses**
- Track business expenses
- Categorize expenses
- Monitor spending

---

## API Basics

### Getting a Token
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Returns:
# {"token":"eyJhbGciOiJIUzI1NiIs..."}
```

### Using the Token
```bash
curl -H "Authorization: Bearer <token>" \
  http://localhost:8080/api/products
```

### Common Endpoints
```
GET  /api/dashboard          - Get stats
GET  /api/products           - List products
GET  /api/orders             - List orders
GET  /api/customers          - List customers
GET  /api/logs               - View activity logs
POST /api/products           - Create product
POST /api/orders             - Create order
```

See `API_REFERENCE.md` for complete endpoint list.

---

## Configuration

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

---

## Development Commands

### Backend
```bash
cd backend

# Build
go build -o main cmd/server/main.go

# Run
go run cmd/server/main.go

# Run tests
go test ./...

# Format code
go fmt ./...
```

### Frontend
```bash
cd frontend

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

---

## Database Migrations

The system includes database migrations that run automatically on startup.

### Manual Migration Run
```bash
cd backend
go run cmd/fix_mysql/main.go
```

### Database Location
- **Host**: localhost
- **Port**: 3307 (if using Docker)
- **Database**: smsystem
- **Username**: smsystem_user (configurable)

### View Database
```bash
# Using MySQL CLI
mysql -h localhost -P 3307 -u smsystem_user -p smsystem

# Or use MySQL Workbench / DBeaver with same credentials
```

---

## Troubleshooting

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

---

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

### With Docker
```bash
docker-compose up -d
# Everything runs in containers
```

---

## Next Steps

1. ✅ **Setup Complete** - Application is running
2. **Create User Account** - Use register page
3. **Add Products** - Populate your inventory
4. **Create Orders** - Start using the system
5. **Monitor Dashboard** - Check business metrics
6. **Customize** - Extend features as needed

---

## Important Directories

| Directory | Purpose |
|-----------|---------|
| `backend/cmd/` | Executable entry points |
| `backend/internal/handlers/` | API endpoint handlers |
| `backend/internal/models/` | Database schemas |
| `backend/internal/services/` | Business logic |
| `frontend/src/pages/` | Page components |
| `frontend/src/components/` | Reusable components |
| `frontend/src/api/` | API client setup |

---

## Support & Resources

- **Full Documentation**: See `PROJECT_DOCUMENTATION.md`
- **API Reference**: See `API_REFERENCE.md`
- **Executive Summary**: See `EXECUTIVE_SUMMARY.md`
- **Backend Code**: `backend/` directory
- **Frontend Code**: `frontend/src/` directory

---

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

**Everything you need to get started is included!**  
Questions? Check the documentation or API reference.

---

**Last Updated**: March 2026  
**Version**: 1.0
