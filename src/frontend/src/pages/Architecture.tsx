import { Badge } from "@/components/ui/badge";
import {
  ArrowDown,
  Bell,
  ChefHat,
  Database,
  Globe,
  Lock,
  Server,
  ShoppingCart,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const SERVICES = [
  {
    id: "gateway",
    name: "API Gateway",
    port: 5000,
    color: "#8b5cf6",
    colorClass: "bg-violet-500",
    borderClass: "border-violet-500",
    bgClass: "bg-violet-500/10",
    textClass: "text-violet-500",
    icon: Globe,
    description: "Central routing hub for all client requests",
    responsibilities: [
      "Routes all incoming requests to appropriate services",
      "Enforces CORS, rate limiting, and security headers",
      "Single entry point for the entire backend",
    ],
    stack: ["Node.js", "Express", "http-proxy-middleware"],
    routes: [
      { method: "ALL", path: "/api/users/*  →  User Service" },
      { method: "ALL", path: "/api/recipes/*  →  Recipe Service" },
      { method: "ALL", path: "/api/orders/*  →  Order Service" },
      { method: "ALL", path: "/api/notifications/*  →  Notification Service" },
    ],
  },
  {
    id: "user",
    name: "User Service",
    port: 5001,
    color: "#06b6d4",
    colorClass: "bg-cyan-500",
    borderClass: "border-cyan-500",
    bgClass: "bg-cyan-500/10",
    textClass: "text-cyan-500",
    icon: Lock,
    description: "Authentication and user management",
    responsibilities: [
      "User registration and login with JWT tokens",
      "Profile management and password handling",
      "Role-based access control",
    ],
    stack: ["Node.js", "Express", "MongoDB", "JWT", "bcrypt"],
    routes: [
      { method: "POST", path: "/api/users/register" },
      { method: "POST", path: "/api/users/login" },
      { method: "GET", path: "/api/users/profile" },
      { method: "PUT", path: "/api/users/profile" },
    ],
  },
  {
    id: "recipe",
    name: "Recipe Service",
    port: 5002,
    color: "#10b981",
    colorClass: "bg-emerald-500",
    borderClass: "border-emerald-500",
    bgClass: "bg-emerald-500/10",
    textClass: "text-emerald-500",
    icon: ChefHat,
    description: "Recipe CRUD, search, and ratings",
    responsibilities: [
      "Full CRUD operations for recipes",
      "Full-text search and category filtering",
      "Star ratings and community feedback",
    ],
    stack: ["Node.js", "Express", "MongoDB"],
    routes: [
      { method: "GET", path: "/api/recipes" },
      { method: "POST", path: "/api/recipes" },
      { method: "PUT", path: "/api/recipes/:id" },
      { method: "POST", path: "/api/recipes/:id/rate" },
    ],
  },
  {
    id: "order",
    name: "Order Service",
    port: 5003,
    color: "#f59e0b",
    colorClass: "bg-amber-500",
    borderClass: "border-amber-500",
    bgClass: "bg-amber-500/10",
    textClass: "text-amber-500",
    icon: ShoppingCart,
    description: "Order placement and status tracking",
    responsibilities: [
      "Processes and stores customer orders",
      "Tracks order status from Pending to Delivered",
      "Triggers notifications to Notification Service",
    ],
    stack: ["Node.js", "Express", "MongoDB"],
    routes: [
      { method: "POST", path: "/api/orders" },
      { method: "GET", path: "/api/orders" },
      { method: "GET", path: "/api/orders/:id" },
      { method: "PUT", path: "/api/orders/:id/status" },
    ],
  },
  {
    id: "notification",
    name: "Notification Service",
    port: 5004,
    color: "#ef4444",
    colorClass: "bg-red-500",
    borderClass: "border-red-500",
    bgClass: "bg-red-500/10",
    textClass: "text-red-500",
    icon: Bell,
    description: "Email notifications and user alerts",
    responsibilities: [
      "Sends transactional email via Nodemailer",
      "In-memory notification store for UI alerts",
      "Marks notifications as read",
    ],
    stack: ["Node.js", "Express", "Nodemailer"],
    routes: [
      { method: "GET", path: "/api/notifications" },
      { method: "POST", path: "/api/notifications" },
      { method: "PUT", path: "/api/notifications/:id/read" },
      { method: "DELETE", path: "/api/notifications/:id" },
    ],
  },
];

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-emerald-500/15 text-emerald-600",
  POST: "bg-blue-500/15 text-blue-600",
  PUT: "bg-amber-500/15 text-amber-600",
  DELETE: "bg-red-500/15 text-red-600",
  ALL: "bg-violet-500/15 text-violet-600",
};

export default function Architecture() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedService = SERVICES.find((s) => s.id === selected);

  return (
    <main className="min-h-screen bg-background" data-ocid="architecture.page">
      {/* Header */}
      <section className="bg-gradient-to-br from-violet-500/10 via-background to-background py-16 text-center border-b border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 bg-violet-500/10 text-violet-600 border border-violet-500/20 rounded-full px-4 py-1 text-sm font-medium mb-4">
            <Server className="w-3.5 h-3.5" />
            Microservices Architecture
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            System Architecture
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            How RecipeHub's microservices work together
          </p>
        </motion.div>
      </section>

      {/* Architecture Diagram */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center gap-0">
          {/* Frontend Box */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border-2 border-primary rounded-2xl px-8 py-4 shadow-lg flex items-center gap-3 min-w-[220px] justify-center"
          >
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <p className="font-display font-bold text-foreground text-sm">
                Frontend (React)
              </p>
              <p className="text-xs text-muted-foreground">
                Port 3000 · Vite + TypeScript
              </p>
            </div>
          </motion.div>

          {/* Arrow down */}
          <div className="flex flex-col items-center py-3">
            <div className="w-px h-8 border-l-2 border-dashed border-violet-400 animate-pulse" />
            <ArrowDown className="w-4 h-4 text-violet-400 -mt-1" />
          </div>

          {/* API Gateway */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-violet-500 text-white rounded-2xl px-10 py-5 shadow-xl flex items-center gap-3 min-w-[260px] justify-center ring-4 ring-violet-500/20"
          >
            <Globe className="w-7 h-7" />
            <div>
              <p className="font-display font-bold text-lg">API Gateway</p>
              <p className="text-violet-100 text-xs">
                Port 5000 · All requests route here
              </p>
            </div>
          </motion.div>

          {/* Fan-out arrows */}
          <div className="relative w-full max-w-4xl flex justify-center mt-6">
            {/* Horizontal line */}
            <div className="absolute top-0 left-[12%] right-[12%] h-px border-t-2 border-dashed border-muted-foreground/40" />

            {/* Service nodes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full px-4">
              {SERVICES.slice(1).map((svc, i) => (
                <motion.div
                  key={svc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Vertical dashed line */}
                  <div
                    className="w-px h-8 border-l-2 border-dashed animate-pulse"
                    style={{ borderColor: svc.color }}
                  />
                  {/* Service card */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelected(selected === svc.id ? null : svc.id)
                    }
                    className={`w-full rounded-xl border-2 p-3 text-center cursor-pointer transition-all hover:scale-105 ${
                      selected === svc.id
                        ? `${svc.borderClass} ${svc.bgClass} shadow-lg`
                        : "border-border bg-card hover:border-muted-foreground/40"
                    }`}
                    data-ocid="architecture.card"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2 ${svc.bgClass}`}
                    >
                      <svc.icon className={`w-4 h-4 ${svc.textClass}`} />
                    </div>
                    <p className="font-semibold text-xs text-foreground leading-tight">
                      {svc.name}
                    </p>
                    <p
                      className={`text-xs font-mono font-bold ${svc.textClass} mt-0.5`}
                    >
                      :{svc.port}
                    </p>
                  </button>
                  {/* MongoDB */}
                  <div className="w-px h-5 border-l-2 border-dashed border-muted-foreground/30" />
                  <div className="flex items-center gap-1.5 bg-secondary/60 border border-border rounded-lg px-3 py-1.5">
                    <Database className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">
                      MongoDB
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Cards Grid */}
      <section className="container mx-auto px-4 pb-8">
        <h2 className="font-display text-2xl font-bold mb-6 text-center">
          Explore Each Service
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-8">
          {SERVICES.map((svc) => (
            <button
              type="button"
              key={svc.id}
              onClick={() => setSelected(selected === svc.id ? null : svc.id)}
              className={`rounded-xl border-2 p-4 text-left cursor-pointer transition-all hover:scale-[1.02] ${
                selected === svc.id
                  ? `${svc.borderClass} ${svc.bgClass}`
                  : "border-border bg-card"
              }`}
              data-ocid="architecture.card"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${svc.bgClass}`}
              >
                <svc.icon className={`w-5 h-5 ${svc.textClass}`} />
              </div>
              <p className="font-display font-bold text-sm text-foreground">
                {svc.name}
              </p>
              <p className={`text-xs font-mono font-semibold ${svc.textClass}`}>
                :{svc.port}
              </p>
            </button>
          ))}
        </div>

        {/* Details Panel */}
        <AnimatePresence mode="wait">
          {selectedService && (
            <motion.div
              key={selectedService.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border-2 ${selectedService.borderClass} ${selectedService.bgClass} p-6 md:p-8`}
              data-ocid="architecture.panel"
            >
              <div className="grid md:grid-cols-3 gap-8">
                {/* Info */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedService.bgClass} border ${selectedService.borderClass}`}
                    >
                      <selectedService.icon
                        className={`w-6 h-6 ${selectedService.textClass}`}
                      />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl text-foreground">
                        {selectedService.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${selectedService.textClass} ${selectedService.borderClass}`}
                      >
                        :{selectedService.port}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedService.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedService.stack.map((t) => (
                      <span
                        key={t}
                        className="bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-3">
                    Responsibilities
                  </h4>
                  <ul className="space-y-2">
                    {selectedService.responsibilities.map((r) => (
                      <li
                        key={r}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${selectedService.colorClass}`}
                        />
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Routes */}
                <div>
                  <h4 className="font-semibold text-sm text-foreground mb-3">
                    Key Routes
                  </h4>
                  <ul className="space-y-2">
                    {selectedService.routes.map((r) => (
                      <li key={r.path} className="flex items-center gap-2">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded font-mono font-semibold ${METHOD_COLORS[r.method]}`}
                        >
                          {r.method}
                        </span>
                        <code className="text-xs text-muted-foreground font-mono">
                          {r.path}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Architecture principle note */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-secondary/40 border border-border rounded-2xl p-6 flex items-start gap-4 max-w-3xl mx-auto">
          <Server className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Why Microservices?
            </h3>
            <p className="text-sm text-muted-foreground">
              Each service is independently deployable. If the Order Service
              goes down, users can still browse recipes. Teams can work on
              services in parallel, using different tech stacks and scaling each
              service separately. The API Gateway is the only public-facing
              entry point.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
