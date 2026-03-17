# RecipeHub

## Current State
RecipeHub is a full-stack microservices recipe platform with React frontend and 5 Node.js backend services (API Gateway, User, Recipe, Order, Notification). It has pages for browsing recipes, adding recipes, orders, favorites, tips, about, and profile.

## Requested Changes (Diff)

### Add
- `/architecture` page: Interactive visual diagram of all 5 microservices showing their names, ports, roles, and connections through the API Gateway. Arrows animate from frontend → API Gateway → each service. Includes a legend and description panel that explains each service's responsibilities when clicked.
- `/api-docs` page: API Explorer listing all endpoints grouped by service (User, Recipe, Order, Notification). Each endpoint shows method (GET/POST/PUT/DELETE), path, description, example request body (JSON), and example response. Collapsible sections per service.
- `/health` page: Service Health Dashboard showing real-time status cards for each microservice. Each card displays: service name, port, role description, and a simulated status indicator (Online/Checking). Includes a "Check All Services" button that animates through checking states and resolves to Online. Auto-refreshes every 30 seconds.

### Modify
- Navbar: Add links to Architecture, API Docs, and Health Dashboard pages
- Footer: List the new pages in the sitemap section

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/Architecture.tsx` with SVG/CSS-based service diagram and click-to-expand service info panels
2. Create `src/frontend/src/pages/ApiDocs.tsx` with collapsible endpoint cards grouped by service
3. Create `src/frontend/src/pages/Health.tsx` with service status cards and animated check flow
4. Update router in `App.tsx` to add the 3 new routes
5. Update `Navbar.tsx` to add navigation links for the new pages
