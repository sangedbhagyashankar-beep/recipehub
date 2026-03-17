import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useAllRecipes } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";

export default function Favorites() {
  const { favorites } = useFavorites();
  const { data: recipes = [] } = useAllRecipes();

  const favorited = useMemo(
    () => recipes.filter((r) => favorites.some((f) => f === r.recipeId)),
    [recipes, favorites],
  );

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <Heart className="w-7 h-7 text-primary fill-primary" />
          <h1 className="font-display text-4xl font-bold">My Favorites</h1>
        </div>
        <p className="text-muted-foreground mb-8">
          {favorited.length} saved recipe{favorited.length !== 1 ? "s" : ""}
        </p>

        {favorited.length === 0 ? (
          <div className="text-center py-20" data-ocid="favorites.empty_state">
            <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold mb-2">
              No favorites yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Tap the heart on any recipe to save it here.
            </p>
            <Link to="/recipes">
              <Button
                className="bg-primary text-primary-foreground"
                data-ocid="favorites.browse_button"
              >
                Browse Recipes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorited.map((recipe, i) => (
              <RecipeCard
                key={recipe.recipeId.toString()}
                recipe={recipe}
                index={i}
              />
            ))}
          </div>
        )}
      </motion.div>
    </main>
  );
}
