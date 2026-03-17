# RecipeHub - Microservices Recipe Platform

## Current State
New project. No existing application files.

## Requested Changes (Diff)

### Add
- Full React frontend with: Home, Login, Register, AddRecipe, RecipeDetails pages
- Navbar, Footer, RecipeCard components
- API service layer (api.js) communicating with backend
- Motoko backend handling: users, recipes, orders, notifications
- Node.js microservice reference files matching the exact folder structure:
  - api-gateway/ (server.js, routes/gatewayRoutes.js, config/gatewayConfig.js)
  - user-service/ (server.js, routes, controller, models, config/db.js)
  - recipe-service/ (server.js, routes, controller, models, config/db.js)
  - order-service/ (server.js, routes, controller, models, config/db.js)
  - notification-service/ (server.js, services/emailService.js, config)
  - docker-compose.yml, README.md

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Select authorization component for user login/register
2. Generate Motoko backend: user management, recipe CRUD, order management, notifications
3. Build React frontend with all pages and components
4. Write all Node.js microservice reference files with complete working code
5. Deploy
