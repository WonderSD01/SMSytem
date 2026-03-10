# SMSystem - API Reference Guide

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

**Getting a Token:**
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

---

## Endpoints

### Public Endpoints

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "secure_password",
  "name": "John Doe"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: { "token": "jwt_token_here" }
```

#### Health Check
```
GET /api/health

Response: { "status": "ok", "message": "SMSystem API is running" }
```

---

### Protected Endpoints (Require JWT)

#### User
```
GET    /api/auth/me                 - Get current user info
GET    /api/users                   - List all users
POST   /api/users                   - Create user
GET    /api/users/:id               - Get user details
PUT    /api/users/:id               - Update user
DELETE /api/users/:id               - Delete user
```

#### Products
```
GET    /api/products                - List products
POST   /api/products                - Create product
GET    /api/products/:id            - Get product details
PUT    /api/products/:id            - Update product
DELETE /api/products/:id            - Delete product
```

#### Categories
```
GET    /api/categories              - List categories
POST   /api/categories              - Create category
GET    /api/categories/:id          - Get category details
PUT    /api/categories/:id          - Update category
DELETE /api/categories/:id          - Delete category
```

#### Brands
```
GET    /api/brands                  - List brands
POST   /api/brands                  - Create brand
GET    /api/brands/:id              - Get brand details
PUT    /api/brands/:id              - Update brand
DELETE /api/brands/:id              - Delete brand
```

#### Customers
```
GET    /api/customers               - List customers
POST   /api/customers               - Create customer
GET    /api/customers/:id           - Get customer details
PUT    /api/customers/:id           - Update customer
DELETE /api/customers/:id           - Delete customer
```

#### Suppliers
```
GET    /api/suppliers               - List suppliers
POST   /api/suppliers               - Create supplier
GET    /api/suppliers/:id           - Get supplier details
PUT    /api/suppliers/:id           - Update supplier
DELETE /api/suppliers/:id           - Delete supplier
```

#### Orders
```
GET    /api/orders                  - List orders
POST   /api/orders                  - Create order
GET    /api/orders/:id              - Get order details
PUT    /api/orders/:id              - Update order
DELETE /api/orders/:id              - Delete order
```

#### Purchase Orders
```
GET    /api/purchase-orders         - List purchase orders
POST   /api/purchase-orders         - Create purchase order
GET    /api/purchase-orders/:id     - Get PO details
PUT    /api/purchase-orders/:id     - Update PO
DELETE /api/purchase-orders/:id     - Delete PO
```

#### Expenses
```
GET    /api/expenses                - List expenses
POST   /api/expenses                - Create expense
GET    /api/expenses/:id            - Get expense details
PUT    /api/expenses/:id            - Update expense
DELETE /api/expenses/:id            - Delete expense
```

#### Dashboard
```
GET    /api/dashboard               - Get statistics & KPIs
```

#### Activity Logs
```
GET    /api/logs                    - List activity logs
GET    /api/logs/:id                - Get log details
```

#### Data Import
```
POST   /api/import                  - Import data (CSV/Excel)
```

#### Terminal/POS
```
GET    /api/terminal/status         - Get terminal status
POST   /api/terminal/transaction    - Process transaction
GET    /api/terminal/receipt/:id    - Get receipt
```

---

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

---

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

---

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

---

## Rate Limiting

Currently no rate limiting implemented. Add for production deployment.

---

## Pagination

Query parameters:
- `page` (default: 1)
- `pageSize` (default: 20, max: 100)

Example:
```
GET /api/products?page=2&pageSize=50
```

---

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

## Testing Tools

### Using REST Client Extension (VS Code)
```http
### Login
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

### Get Products (after getting token)
@token = <paste_token_here>
GET http://localhost:8080/api/products
Authorization: Bearer @token
```

### Using cURL
```bash
# Login
TOKEN=$(curl -s -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' | jq -r '.token')

# Use token in subsequent requests
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/products
```

### Using Postman
1. Create new HTTP request
2. Set method (GET, POST, etc.)
3. In Headers, add: `Authorization: Bearer <token>`
4. Send request

---

## Common Status Codes by Endpoint

### Authentication Errors
- 401: Invalid credentials / token expired
- 403: Insufficient permissions

### Validation Errors
- 400: Missing required fields / Invalid data format

### Resource Errors
- 404: Resource not found
- 409: Conflict (e.g., duplicate email)

### Server Errors
- 500: Database error / Server error

---

## Environment Configuration

The API behavior depends on environment variables:

```
GIN_MODE=release          # Set to 'debug' for development
JWT_SECRET=your_secret    # Secret for JWT signing
DB_HOST=localhost         # Database host
DB_PORT=3306             # Database port
DB_NAME=smsystem         # Database name
```

---

## Documentation

- **Full Documentation**: See `PROJECT_DOCUMENTATION.md`
- **Quick Start Guide**: See setup instructions in README
- **Database Schema**: See migrations in `backend/migrations/`

---

**Last Updated**: March 2026  
**Version**: 1.0
