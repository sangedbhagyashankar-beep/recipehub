import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useUserOrders } from "@/hooks/useQueries";
import { SAMPLE_RECIPES } from "@/services/api";
import { Link } from "@tanstack/react-router";
import { CheckCircle, Clock, ShoppingBag } from "lucide-react";
import { motion } from "motion/react";

const STATUS_STEPS = ["Pending", "Confirmed", "Preparing", "Delivered"];

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Preparing: "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
};

function getRecipeTitle(recipeId: bigint): string {
  const r = SAMPLE_RECIPES.find((s) => s.recipeId === recipeId);
  return r ? r.title : `Recipe #${recipeId.toString()}`;
}

export default function Orders() {
  const { identity } = useInternetIdentity();
  const { data: orders = [], isLoading } = useUserOrders();

  if (!identity) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-semibold mb-2">
          Sign in to see your orders
        </h2>
        <p className="text-muted-foreground mb-6">
          Track your ingredient kit deliveries after signing in.
        </p>
        <Link to="/login">
          <Button
            className="bg-primary text-primary-foreground"
            data-ocid="orders.login_button"
          >
            Sign In
          </Button>
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main
        className="container mx-auto px-4 py-12"
        data-ocid="orders.loading_state"
      >
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((k) => (
            <div
              key={k}
              className="bg-card border border-border rounded-xl h-32"
            />
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-7 h-7 text-primary" />
          <h1 className="font-display text-4xl font-bold">My Orders</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          {orders.length} order{orders.length !== 1 ? "s" : ""}
        </p>

        {orders.length === 0 ? (
          <div className="text-center py-20" data-ocid="orders.empty_state">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold mb-2">
              No orders yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Browse recipes and order ingredient kits.
            </p>
            <Link to="/recipes">
              <Button
                className="bg-primary text-primary-foreground"
                data-ocid="orders.browse_button"
              >
                Browse Recipes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const statusStr =
                typeof order.status === "string"
                  ? order.status
                  : (Object.keys(order.status as object)[0] ?? "Pending");
              const currentStep = STATUS_STEPS.indexOf(statusStr);
              return (
                <motion.div
                  key={order.orderId.toString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-card border border-border rounded-xl p-6"
                  data-ocid={`orders.item.${i + 1}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {getRecipeTitle(order.recipeId)}
                      </h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          Qty: {order.quantity.toString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />$
                          {(Number(order.price) / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={
                        STATUS_COLORS[statusStr] ?? "bg-gray-100 text-gray-800"
                      }
                    >
                      {statusStr}
                    </Badge>
                  </div>

                  {/* Status Stepper */}
                  <div className="flex items-center gap-0">
                    {STATUS_STEPS.map((step, si) => (
                      <div
                        key={step}
                        className="flex items-center flex-1 last:flex-none"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors ${
                            si <= currentStep
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {si < currentStep ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            si + 1
                          )}
                        </div>
                        {si < STATUS_STEPS.length - 1 && (
                          <div
                            className={`h-1 flex-1 mx-1 rounded-full transition-colors ${
                              si < currentStep ? "bg-primary" : "bg-secondary"
                            }`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    {STATUS_STEPS.map((step, si) => (
                      <span
                        key={step}
                        className={`text-xs ${
                          si <= currentStep
                            ? "text-primary font-medium"
                            : "text-muted-foreground"
                        } ${si === STATUS_STEPS.length - 1 ? "text-right" : ""}`}
                      >
                        {step}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </main>
  );
}
