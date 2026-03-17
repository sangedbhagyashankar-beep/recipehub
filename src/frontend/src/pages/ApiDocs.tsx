import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, ChevronDown, ChevronRight, Code2, Lock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface Endpoint {
  method: HttpMethod;
  path: string;
  description: string;
  authRequired?: boolean;
  requestBody?: string;
  responseExample?: string;
  queryParams?: string;
}

interface ServiceSection {
  id: string;
  name: string;
  baseUrl: string;
  color: string;
  colorBg: string;
  colorText: string;
  endpoints: Endpoint[];
}

const SERVICES: ServiceSection[] = [
  {
    id: "user",
    name: "User Service",
    baseUrl: "http://localhost:5001",
    color: "bg-cyan-500",
    colorBg: "bg-cyan-500/10",
    colorText: "text-cyan-600",
    endpoints: [
      {
        method: "POST",
        path: "/api/users/register",
        description: "Register a new user account",
        requestBody: JSON.stringify(
          {
            name: "Jane Doe",
            email: "jane@example.com",
            password: "secret123",
          },
          null,
          2,
        ),
        responseExample: JSON.stringify(
          { success: true, message: "User registered", userId: "abc123" },
          null,
          2,
        ),
      },
      {
        method: "POST",
        path: "/api/users/login",
        description: "Authenticate user and receive JWT token",
        requestBody: JSON.stringify(
          { email: "jane@example.com", password: "secret123" },
          null,
          2,
        ),
        responseExample: JSON.stringify(
          {
            token: "eyJhbGciOiJIUzI1NiIs...",
            user: { id: "abc123", name: "Jane Doe", email: "jane@example.com" },
          },
          null,
          2,
        ),
      },
      {
        method: "GET",
        path: "/api/users/profile",
        description: "Get the authenticated user's profile",
        authRequired: true,
        responseExample: JSON.stringify(
          {
            id: "abc123",
            name: "Jane Doe",
            email: "jane@example.com",
            bio: "I love cooking!",
            createdAt: "2026-01-01T00:00:00Z",
          },
          null,
          2,
        ),
      },
      {
        method: "PUT",
        path: "/api/users/profile",
        description: "Update the authenticated user's profile",
        authRequired: true,
        requestBody: JSON.stringify(
          { name: "Jane Smith", bio: "Passionate home cook" },
          null,
          2,
        ),
        responseExample: JSON.stringify(
          { success: true, message: "Profile updated" },
          null,
          2,
        ),
      },
    ],
  },
  {
    id: "recipe",
    name: "Recipe Service",
    baseUrl: "http://localhost:5002",
    color: "bg-emerald-500",
    colorBg: "bg-emerald-500/10",
    colorText: "text-emerald-600",
    endpoints: [
      {
        method: "GET",
        path: "/api/recipes",
        description: "List all recipes with optional search and filtering",
        queryParams: "?search=pasta&category=Italian&limit=20&offset=0",
        responseExample: JSON.stringify(
          [
            {
              id: "r1",
              title: "Spaghetti Carbonara",
              category: "Italian",
              cookTime: 30,
              rating: 4.7,
            },
          ],
          null,
          2,
        ),
      },
      {
        method: "POST",
        path: "/api/recipes",
        description: "Create a new recipe",
        authRequired: true,
        requestBody: JSON.stringify(
          {
            title: "My Recipe",
            description: "Delicious",
            ingredients: ["pasta", "eggs"],
            steps: ["Boil pasta", "Mix eggs"],
            category: "Italian",
            cookTime: 30,
          },
          null,
          2,
        ),
        responseExample: JSON.stringify(
          { success: true, id: "r2", title: "My Recipe" },
          null,
          2,
        ),
      },
      {
        method: "GET",
        path: "/api/recipes/:id",
        description: "Get full details of a specific recipe",
        responseExample: JSON.stringify(
          {
            id: "r1",
            title: "Spaghetti Carbonara",
            ingredients: ["200g pasta", "2 eggs"],
            steps: ["Boil pasta", "Fry guanciale"],
            rating: 4.7,
            ratings: [{ user: "abc", score: 5 }],
          },
          null,
          2,
        ),
      },
      {
        method: "PUT",
        path: "/api/recipes/:id",
        description: "Update an existing recipe",
        authRequired: true,
        requestBody: JSON.stringify(
          { title: "Updated Title", cookTime: 25 },
          null,
          2,
        ),
        responseExample: JSON.stringify(
          { success: true, message: "Recipe updated" },
          null,
          2,
        ),
      },
      {
        method: "DELETE",
        path: "/api/recipes/:id",
        description: "Delete a recipe by ID",
        authRequired: true,
        responseExample: JSON.stringify(
          { success: true, message: "Recipe deleted" },
          null,
          2,
        ),
      },
      {
        method: "POST",
        path: "/api/recipes/:id/rate",
        description: "Submit a star rating for a recipe",
        authRequired: true,
        requestBody: JSON.stringify({ rating: 5 }, null, 2),
        responseExample: JSON.stringify(
          { success: true, newRating: 4.8 },
          null,
          2,
        ),
      },
    ],
  },
  {
    id: "order",
    name: "Order Service",
    baseUrl: "http://localhost:5003",
    color: "bg-amber-500",
    colorBg: "bg-amber-500/10",
    colorText: "text-amber-600",
    endpoints: [
      {
        method: "POST",
        path: "/api/orders",
        description: "Place a new order for a recipe kit",
        authRequired: true,
        requestBody: JSON.stringify(
          { recipeId: "r1", quantity: 2, notes: "Extra spicy please" },
          null,
          2,
        ),
        responseExample: JSON.stringify(
          { success: true, orderId: "o1", status: "pending" },
          null,
          2,
        ),
      },
      {
        method: "GET",
        path: "/api/orders",
        description: "Get all orders for the authenticated user",
        authRequired: true,
        responseExample: JSON.stringify(
          [
            {
              id: "o1",
              recipeId: "r1",
              status: "preparing",
              createdAt: "2026-01-01T00:00:00Z",
            },
          ],
          null,
          2,
        ),
      },
      {
        method: "GET",
        path: "/api/orders/:id",
        description: "Get details of a specific order",
        authRequired: true,
        responseExample: JSON.stringify(
          {
            id: "o1",
            recipeId: "r1",
            quantity: 2,
            notes: "Extra spicy",
            status: "preparing",
            updatedAt: "2026-01-01T01:00:00Z",
          },
          null,
          2,
        ),
      },
      {
        method: "PUT",
        path: "/api/orders/:id/status",
        description: "Update the status of an order",
        requestBody: JSON.stringify({ status: "delivered" }, null, 2),
        responseExample: JSON.stringify(
          { success: true, message: "Status updated" },
          null,
          2,
        ),
      },
    ],
  },
  {
    id: "notification",
    name: "Notification Service",
    baseUrl: "http://localhost:5004",
    color: "bg-red-500",
    colorBg: "bg-red-500/10",
    colorText: "text-red-600",
    endpoints: [
      {
        method: "GET",
        path: "/api/notifications",
        description: "Get all notifications for the authenticated user",
        authRequired: true,
        responseExample: JSON.stringify(
          [
            {
              id: "n1",
              message: "Your order is ready!",
              isRead: false,
              createdAt: "2026-01-01T00:00:00Z",
            },
          ],
          null,
          2,
        ),
      },
      {
        method: "POST",
        path: "/api/notifications",
        description: "Create a new notification for a user",
        requestBody: JSON.stringify(
          {
            userId: "abc123",
            message: "Your order is being prepared",
            type: "order_update",
          },
          null,
          2,
        ),
        responseExample: JSON.stringify({ success: true, id: "n2" }, null, 2),
      },
      {
        method: "PUT",
        path: "/api/notifications/:id/read",
        description: "Mark a notification as read",
        authRequired: true,
        responseExample: JSON.stringify(
          { success: true, message: "Notification marked as read" },
          null,
          2,
        ),
      },
      {
        method: "DELETE",
        path: "/api/notifications/:id",
        description: "Delete a notification",
        authRequired: true,
        responseExample: JSON.stringify(
          { success: true, message: "Notification deleted" },
          null,
          2,
        ),
      },
    ],
  },
];

const METHOD_STYLE: Record<HttpMethod, string> = {
  GET: "bg-emerald-500 text-white",
  POST: "bg-blue-500 text-white",
  PUT: "bg-amber-500 text-white",
  DELETE: "bg-red-500 text-white",
};

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border border-border rounded-xl overflow-hidden"
      data-ocid="apidocs.card"
    >
      <button
        type="button"
        className="w-full flex items-center gap-3 p-4 hover:bg-accent transition-colors text-left"
        onClick={() => setOpen(!open)}
        data-ocid="apidocs.toggle"
      >
        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md min-w-[60px] text-center ${METHOD_STYLE[ep.method]}`}
        >
          {ep.method}
        </span>
        <code className="text-sm text-foreground font-mono flex-1">
          {ep.path}
        </code>
        <div className="flex items-center gap-2">
          {ep.authRequired && (
            <span className="flex items-center gap-1 bg-orange-500/10 text-orange-600 text-xs px-2 py-0.5 rounded-full">
              <Lock className="w-3 h-3" /> Auth Required
            </span>
          )}
          {open ? (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div
              className="border-t border-border bg-secondary/20 p-4 space-y-4"
              data-ocid="apidocs.panel"
            >
              <p className="text-sm text-muted-foreground">{ep.description}</p>

              {ep.queryParams && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    Query Parameters
                  </p>
                  <code className="text-xs bg-secondary px-2 py-1 rounded text-muted-foreground">
                    {ep.queryParams}
                  </code>
                </div>
              )}

              {ep.authRequired && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    Request Headers
                  </p>
                  <pre className="text-xs bg-secondary rounded-lg p-3 overflow-x-auto text-muted-foreground font-mono">
                    {
                      "Authorization: Bearer <JWT_TOKEN>\nContent-Type: application/json"
                    }
                  </pre>
                </div>
              )}

              {ep.requestBody && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    Request Body
                  </p>
                  <pre className="text-xs bg-secondary rounded-lg p-3 overflow-x-auto text-muted-foreground font-mono">
                    {ep.requestBody}
                  </pre>
                </div>
              )}

              {ep.responseExample && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">
                    Response Example
                  </p>
                  <pre className="text-xs bg-secondary rounded-lg p-3 overflow-x-auto text-muted-foreground font-mono">
                    {ep.responseExample}
                  </pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ApiDocs() {
  const [activeTab, setActiveTab] = useState("all");

  const visibleServices =
    activeTab === "all" ? SERVICES : SERVICES.filter((s) => s.id === activeTab);

  return (
    <main className="min-h-screen bg-background" data-ocid="apidocs.page">
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-500/10 via-background to-background py-16 text-center border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-full px-4 py-1 text-sm font-medium mb-4">
            <Code2 className="w-3.5 h-3.5" />
            Developer Reference
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            API Documentation
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Explore all available endpoints across RecipeHub's microservices
          </p>
        </motion.div>
      </section>

      <div className="container mx-auto px-4 py-10">
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="flex-wrap h-auto gap-1" data-ocid="apidocs.tab">
            <TabsTrigger value="all">All Services</TabsTrigger>
            {SERVICES.map((s) => (
              <TabsTrigger key={s.id} value={s.id}>
                {s.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Service Sections */}
        <div className="space-y-10">
          {visibleServices.map((svc, si) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.07 }}
            >
              {/* Service header */}
              <div
                className={`rounded-2xl border border-border p-5 mb-4 flex items-center justify-between ${svc.colorBg}`}
              >
                <div>
                  <h2
                    className={`font-display text-xl font-bold ${svc.colorText}`}
                  >
                    {svc.name}
                  </h2>
                  <code className="text-xs text-muted-foreground font-mono">
                    {svc.baseUrl}
                  </code>
                </div>
                <Badge className={`${svc.color} text-white border-0`}>
                  {svc.endpoints.length} endpoints
                </Badge>
              </div>

              {/* Endpoint cards */}
              <div className="space-y-2">
                {svc.endpoints.map((ep, i) => (
                  <motion.div
                    key={`${ep.method}-${ep.path}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: si * 0.07 + i * 0.04 }}
                  >
                    <EndpointCard ep={ep} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-12 bg-secondary/40 border border-border rounded-2xl p-6 flex items-start gap-4">
          <BookOpen className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Using This API
            </h3>
            <p className="text-sm text-muted-foreground">
              All requests should go through the{" "}
              <strong>API Gateway at port 5000</strong>. The gateway forwards
              requests to the appropriate microservice. Authenticated endpoints
              require a JWT token obtained from{" "}
              <code className="bg-secondary px-1 rounded">
                POST /api/users/login
              </code>
              .
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
