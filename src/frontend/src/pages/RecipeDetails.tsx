import RecipeCard from "@/components/RecipeCard";
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
import { useFavorites } from "@/hooks/useFavorites";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useAllRecipes, usePlaceOrder, useRecipe } from "@/hooks/useQueries";
import { useShoppingList } from "@/hooks/useShoppingList";
import { SAMPLE_RECIPES } from "@/services/api";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Clock,
  Heart,
  Loader2,
  Printer,
  Share2,
  ShoppingCart,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&auto=format&fit=crop";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function RecipeDetails() {
  const { id } = useParams({ strict: false }) as { id: string };
  const recipeId = id ? BigInt(id) : null;
  const sampleRecipe = SAMPLE_RECIPES.find((r) => r.recipeId.toString() === id);
  const { data: recipe, isLoading } = useRecipe(recipeId);
  const displayRecipe = recipe || sampleRecipe || null;
  const { data: allRecipes = [] } = useAllRecipes();

  const { identity } = useInternetIdentity();
  const placeOrder = usePlaceOrder();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addItems } = useShoppingList();

  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("10");
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Timer state
  const cookMinutes = displayRecipe ? Number(displayRecipe.cookTime) : 30;
  const [timerSeconds, setTimerSeconds] = useState(cookMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setTimerRunning(false);
            toast.success("Timer done! Your dish is ready 🍽️");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning]);

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(cookMinutes * 60);
  };

  const toggleIngredient = (i: number) =>
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  const handleSaveShoppingList = () => {
    if (!displayRecipe) return;
    addItems(displayRecipe.ingredients);
    toast.success("Ingredients added to shopping list!");
  };

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

  const relatedRecipes = displayRecipe
    ? allRecipes
        .filter(
          (r) =>
            r.category === displayRecipe.category &&
            r.recipeId !== displayRecipe.recipeId,
        )
        .slice(0, 3)
    : [];

  const servings = displayRecipe ? Number(displayRecipe.servings) : 1;
  const nutrition = {
    calories: Math.round(400 * servings),
    protein: Math.round(25 * servings),
    carbs: Math.round(45 * servings),
    fat: Math.round(15 * servings),
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
  const fav = isFavorite(displayRecipe.recipeId);
  const timerMins = Math.floor(timerSeconds / 60);
  const timerSecs = timerSeconds % 60;

  return (
    <main className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Breadcrumb */}
        <nav
          className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/recipes" className="hover:text-foreground">
            Recipes
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground line-clamp-1 max-w-48">
            {displayRecipe.title}
          </span>
        </nav>

        <Link
          to="/recipes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4"
          data-ocid="recipe.back_button"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Recipes
        </Link>

        <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden mb-6 shadow-card">
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

        {/* Action Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-5 h-5 text-primary" />
            <span className="font-medium">
              {displayRecipe.cookTime.toString()} min
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
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => toggleFavorite(displayRecipe.recipeId)}
              data-ocid="recipe.favorite_button"
            >
              <Heart
                className={`w-4 h-4 ${fav ? "fill-primary text-primary" : ""}`}
              />
              {fav ? "Saved" : "Save"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={handleShare}
              data-ocid="recipe.share_button"
            >
              <Share2 className="w-4 h-4" /> Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => window.print()}
              data-ocid="recipe.print_button"
            >
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button
              onClick={() => setOrderDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
              data-ocid="recipe.order_button"
            >
              <ShoppingCart className="w-4 h-4" /> Order Kit
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed mb-8">
          {displayRecipe.description}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-bold">Ingredients</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveShoppingList}
                className="gap-1.5"
                data-ocid="recipe.shopping_list_button"
              >
                <ShoppingCart className="w-3.5 h-3.5" /> Save to List
              </Button>
            </div>
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
                    data-ocid={`recipe.checkbox.${i + 1}`}
                  />
                  <label
                    htmlFor={`ing-${i}`}
                    className={`text-sm cursor-pointer select-none ${
                      checkedIngredients.has(i)
                        ? "line-through text-muted-foreground"
                        : ""
                    }`}
                  >
                    {ing}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Instructions */}
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

        {/* Cooking Timer */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h2 className="font-display text-xl font-bold mb-4">Cooking Timer</h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full border-4 border-primary flex items-center justify-center bg-primary/5">
              <span className="font-display text-3xl font-bold text-foreground">
                {pad(timerMins)}:{pad(timerSecs)}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                Set for {cookMinutes} minute{cookMinutes !== 1 ? "s" : ""} cook
                time
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setTimerRunning((r) => !r)}
                  disabled={timerSeconds === 0}
                  className="bg-primary text-primary-foreground"
                  data-ocid="recipe.timer_toggle"
                >
                  {timerRunning ? "Pause" : "Start"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetTimer}
                  data-ocid="recipe.timer_reset"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition */}
        <div className="mt-8 bg-card border border-border rounded-xl p-6">
          <h2 className="font-display text-xl font-bold mb-4">
            Nutrition Estimates
          </h2>
          <p className="text-xs text-muted-foreground mb-4">
            Per serving (estimated values)
          </p>
          <div className="grid grid-cols-4 gap-4">
            {[
              {
                label: "Calories",
                value: `${Math.round(nutrition.calories / servings)}`,
                unit: "kcal",
              },
              {
                label: "Protein",
                value: `${Math.round(nutrition.protein / servings)}`,
                unit: "g",
              },
              {
                label: "Carbs",
                value: `${Math.round(nutrition.carbs / servings)}`,
                unit: "g",
              },
              {
                label: "Fat",
                value: `${Math.round(nutrition.fat / servings)}`,
                unit: "g",
              },
            ].map((n) => (
              <div
                key={n.label}
                className="text-center p-3 rounded-lg bg-secondary/50"
              >
                <p className="font-display text-2xl font-bold text-primary">
                  {n.value}
                  <span className="text-sm font-normal text-muted-foreground">
                    {n.unit}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">{n.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Recipes */}
        {relatedRecipes.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-2xl font-bold mb-6">
              Related Recipes
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {relatedRecipes.map((r, i) => (
                <RecipeCard key={r.recipeId.toString()} recipe={r} index={i} />
              ))}
            </div>
          </div>
        )}
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
              <p className="text-lg font-semibold">Order Placed!</p>
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
