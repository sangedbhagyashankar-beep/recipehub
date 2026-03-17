import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useFavorites } from "@/hooks/useFavorites";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAllRecipes, useUserOrders } from "@/hooks/useQueries";
import { useShoppingList } from "@/hooks/useShoppingList";
import { SAMPLE_RECIPES } from "@/services/api";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle,
  Clock,
  ShoppingBag,
  ShoppingCart,
  Star,
  Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

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

interface ProfileData {
  name: string;
  bio: string;
}

function loadProfile(): ProfileData {
  try {
    const stored = localStorage.getItem("recipehub_profile");
    if (stored) return JSON.parse(stored) as ProfileData;
  } catch {
    /* empty */
  }
  return {
    name: "Food Lover",
    bio: "Passionate home cook exploring global cuisines.",
  };
}

export default function Profile() {
  const { identity } = useInternetIdentity();
  const { favorites } = useFavorites();
  const { data: recipes = [] } = useAllRecipes();
  const { data: orders = [] } = useUserOrders();
  const { items: shoppingItems, removeItem, clearList } = useShoppingList();

  const [profile, setProfile] = useState<ProfileData>(loadProfile);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);

  const initials = profile.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const saveProfile = () => {
    setProfile(draft);
    localStorage.setItem("recipehub_profile", JSON.stringify(draft));
    setEditing(false);
    toast.success("Profile saved!");
  };

  const principal = identity?.getPrincipal().toString();
  const principalShort = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
    : null;

  return (
    <main className="container mx-auto px-4 py-12 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Avatar & Info */}
        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="font-display text-2xl font-bold text-primary-foreground">
              {initials}
            </span>
          </div>
          <div className="flex-1">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={draft.name}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, name: e.target.value }))
                    }
                    data-ocid="profile.name_input"
                  />
                </div>
                <div>
                  <Label>Bio</Label>
                  <Textarea
                    value={draft.bio}
                    onChange={(e) =>
                      setDraft((p) => ({ ...p, bio: e.target.value }))
                    }
                    rows={2}
                    data-ocid="profile.bio_textarea"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={saveProfile}
                    data-ocid="profile.save_button"
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      setDraft(profile);
                    }}
                    data-ocid="profile.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="font-display text-3xl font-bold">
                  {profile.name}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {profile.bio}
                </p>
                {principalShort && (
                  <p className="text-xs text-muted-foreground mt-1 font-mono">
                    {principalShort}
                  </p>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    setEditing(true);
                    setDraft(profile);
                  }}
                  data-ocid="profile.edit_button"
                >
                  Edit Profile
                </Button>
              </>
            )}
          </div>
        </div>

        <Tabs defaultValue="stats">
          <TabsList className="mb-6" data-ocid="profile.tab">
            <TabsTrigger value="stats">My Stats</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
            <TabsTrigger value="shopping">Shopping List</TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Favorites", value: favorites.length, icon: Star },
                { label: "Orders", value: orders.length, icon: ShoppingBag },
                {
                  label: "Recipes",
                  value: recipes.length > 0 ? recipes.length : "—",
                  icon: CheckCircle,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border rounded-xl p-6 text-center"
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="font-display text-3xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            {orders.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="profile.orders.empty_state"
              >
                <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">No orders yet.</p>
                <Link to="/recipes">
                  <Button
                    size="sm"
                    className="mt-4 bg-primary text-primary-foreground"
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
                    <div
                      key={order.orderId.toString()}
                      className="bg-card border border-border rounded-xl p-5"
                      data-ocid={`profile.orders.item.${i + 1}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">
                            {getRecipeTitle(order.recipeId)}
                          </h3>
                          <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3" /> Qty:{" "}
                              {order.quantity.toString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> $
                              {(Number(order.price) / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={
                            STATUS_COLORS[statusStr] ??
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {statusStr}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-0">
                        {STATUS_STEPS.map((step, si) => (
                          <div
                            key={step}
                            className="flex items-center flex-1 last:flex-none"
                          >
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                si <= currentStep
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {si < currentStep ? (
                                <CheckCircle className="w-3.5 h-3.5" />
                              ) : (
                                si + 1
                              )}
                            </div>
                            {si < STATUS_STEPS.length - 1 && (
                              <div
                                className={`h-0.5 flex-1 mx-1 ${si < currentStep ? "bg-primary" : "bg-secondary"}`}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="shopping">
            {shoppingItems.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="profile.shopping.empty_state"
              >
                <ShoppingCart className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Your shopping list is empty.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add ingredients from any recipe page.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-muted-foreground">
                    {shoppingItems.length} item
                    {shoppingItems.length !== 1 ? "s" : ""}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearList}
                    data-ocid="profile.shopping.clear_button"
                  >
                    Clear All
                  </Button>
                </div>
                <ul className="space-y-2">
                  {shoppingItems.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-center justify-between bg-card border border-border rounded-lg px-4 py-3"
                      data-ocid={`profile.shopping.item.${i + 1}`}
                    >
                      <span className="text-sm">{item}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item)}
                        data-ocid={`profile.shopping.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </main>
  );
}
