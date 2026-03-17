# RecipeHub - Microservices Recipe Platform

A full-stack recipe sharing platform built with a microservices architecture.

## Architecture

```
┌─────────────┐     ┌──────────────────────────────────────────────┐
│   Frontend  │────▶│                 API Gateway                  │
│  (React)    │     │              (Port 5000)                     │
└─────────────┘     └──────┬────────────┬──────────┬──────────────┘
                           │            │          │          │
                    ┌──────▼──┐  ┌──────▼──┐ ┌────▼────┐ ┌──▼──────────┐
                    │  User   │  │ Recipe  │ │  Order  │ │Notification │
                    │Service  │  │ Service │ │ Service │ │  Service    │
                    │ :5001   │  │  :5002  │ │  :5003  │ │   :5004     │
                    └────┬────┘  └────┬────┘ └────┬────┘ └─────────────┘
                         │            │            │
                    ┌────▼────────────▼────────────▼────┐
                    │           MongoDB                  │
                    └───────────────────────────────────┘
```

## Services

| Service              | Port | Description                              |
|----------------------|------|------------------------------------------|
| API Gateway          | 5000 | Routes all requests to appropriate services |
| User Service         | 5001 | Auth, registration, profile management   |
| Recipe Service       | 5002 | Recipe CRUD, categories, search          |
| Order Service        | 5003 | Order placement, tracking, status        |
| Notification Service | 5004 | Email notifications, alerts              |
| Frontend             | 3000 | React + Vite frontend                    |

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB
- Docker & Docker Compose (optional)

### With Docker Compose
```bash
docker-compose up --build
```

### Without Docker (Manual)

1. Start MongoDB locally
2. Install and run each service:
```bash
# Terminal 1 - User Service
cd user-service && npm install && npm start

# Terminal 2 - Recipe Service
cd recipe-service && npm install && npm start

# Terminal 3 - Order Service
cd order-service && npm install && npm start

# Terminal 4 - Notification Service
cd notification-service && npm install && npm start

# Terminal 5 - API Gateway
cd api-gateway && npm install && npm start

# Terminal 6 - Frontend
cd frontend && npm install && npm run dev
```

## API Endpoints (via Gateway)

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get current user profile (auth required)
- `PUT /api/users/profile` - Update profile (auth required)

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:id` - Get recipe by ID
- `POST /api/recipes` - Create recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required)
- `DELETE /api/recipes/:id` - Delete recipe (auth required)

### Orders
- `POST /api/orders` - Place order (auth required)
- `GET /api/orders/my` - Get user's orders (auth required)
- `GET /api/orders/:id` - Get order by ID (auth required)
- `PUT /api/orders/:id/status` - Update order status (admin)

### Notifications
- `GET /api/notifications` - Get user notifications (auth required)
- `PUT /api/notifications/:id/read` - Mark as read (auth required)
