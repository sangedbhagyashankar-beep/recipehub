import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { usePlaceOrder, useRecipe } from "@/hooks/useQueries";
import { SAMPLE_RECIPES } from "@/services/api";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  Clock,
  Loader2,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop";

export default function RecipeDetails() {
  const { id } = useParams({ strict: false }) as { id: string };
  const recipeId = id ? BigInt(id) : null;
  const sampleRecipe = SAMPLE_RECIPES.find((r) => r.recipeId.toString() === id);
  const { data: recipe, isLoading } = useRecipe(recipeId);
  const displayRecipe = recipe || sampleRecipe || null;

  const { identity } = useInternetIdentity();
  const placeOrder = usePlaceOrder();

  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("10");
  const [orderSuccess, setOrderSuccess] = useState(false);

  const toggleIngredient = (i: number) =>
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const handleOrder = async () => {
    if (!identity) {
      toast.error("Please sign in to place an order");
      return;
    }
    if (!displayRecipe) return;
    try {
      await placeOrder.mutateAsync({
        recipeId: displayRecipe.recipeId,
        quantity: BigInt(quantity),
        price: BigInt(price),
      });
      setOrderSuccess(true);
      toast.success("Order placed successfully! 🎉");
      setTimeout(() => {
        setOrderDialogOpen(false);
        setOrderSuccess(false);
      }, 2000);
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  if (isLoading && !displayRecipe) {
    return (
      <main
        className="container mx-auto px-4 py-10 max-w-4xl"
        data-ocid="recipe.loading_state"
      >
        <Skeleton className="h-80 w-full rounded-xl mb-6" />
        <Skeleton className="h-8 w-2/3 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </main>
    );
  }

  if (!displayRecipe) {
    return (
      <main
        className="container mx-auto px-4 py-20 text-center"
        data-ocid="recipe.error_state"
      >
        <p className="text-muted-foreground text-lg">Recipe not found.</p>
        <Link to="/recipes">
          <Button className="mt-4" data-ocid="recipe.back_button">
            Back to Recipes
          </Button>
        </Link>
      </main>
    );
  }

  const stars = Math.min(5, Math.max(0, Number(displayRecipe.rating)));

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          to="/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
          data-ocid="recipe.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recipes
        </Link>

        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-card">
          <img
            src={displayRecipe.imageUrl || PLACEHOLDER_IMAGE}
            alt={displayRecipe.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Badge className="bg-primary text-primary-foreground mb-2">
              {displayRecipe.category}
            </Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
              {displayRecipe.title}
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {displayRecipe.cookTime.toString()} minutes
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {displayRecipe.servings.toString()} servings
            </span>
          </div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={`star-${n}`}
                className={`w-5 h-5 ${n <= stars ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
              />
            ))}
            <span className="ml-1 text-sm text-muted-foreground">
              ({stars}/5)
            </span>
          </div>
          <Button
            onClick={() => setOrderDialogOpen(true)}
            className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
            data-ocid="recipe.order_button"
          >
            <ShoppingCart className="w-4 h-4" /> Order Ingredient Kit
          </Button>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          {displayRecipe.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">Ingredients</h2>
            <ul className="space-y-3">
              {displayRecipe.ingredients.map((ing, i) => (
                <li
                  key={`ing-${i}-${ing.slice(0, 8)}`}
                  className="flex items-center gap-3"
                >
                  <Checkbox
                    id={`ing-${i}`}
                    checked={checkedIngredients.has(i)}
                    onCheckedChange={() => toggleIngredient(i)}
                    data-ocid={`recipe.ingredient_checkbox.${i + 1}`}
                  />
                  <label
                    htmlFor={`ing-${i}`}
                    className={`text-sm cursor-pointer select-none ${checkedIngredients.has(i) ? "line-through text-muted-foreground" : ""}`}
                  >
                    {ing}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-xl font-bold mb-4">
              Instructions
            </h2>
            <ol className="space-y-4">
              {displayRecipe.instructions.map((step, i) => (
                <li
                  key={`step-${i}-${step.slice(0, 8)}`}
                  className="flex gap-3"
                >
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </motion.div>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent data-ocid="recipe.order_dialog">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              Order Ingredient Kit
            </DialogTitle>
          </DialogHeader>
          {orderSuccess ? (
            <div
              className="flex flex-col items-center py-6"
              data-ocid="recipe.order_success_state"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-foreground">
                Order Placed!
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                Your ingredient kit is being prepared.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Order fresh ingredients for{" "}
                <strong>{displayRecipe.title}</strong> delivered to your door.
              </p>
              <div className="grid grid-cols-2 gap-4 my-4">
                <div className="space-y-1.5">
                  <Label>Quantity (kits)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    data-ocid="recipe.order_quantity_input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Price per kit ($)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    data-ocid="recipe.order_price_input"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setOrderDialogOpen(false)}
                  data-ocid="recipe.order_cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleOrder}
                  disabled={placeOrder.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="recipe.order_confirm_button"
                >
                  {placeOrder.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing
                      Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
