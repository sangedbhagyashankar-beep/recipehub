import { useFavorites } from "@/hooks/useFavorites";
import { Link } from "@tanstack/react-router";
import { Clock, Heart, Star, Users } from "lucide-react";
import { motion } from "motion/react";
import type { Recipe } from "../backend";

const CATEGORY_COLORS: Record<string, string> = {
  Breakfast: "bg-yellow-100 text-yellow-800",
  Lunch: "bg-green-100 text-green-800",
  Dinner: "bg-blue-100 text-blue-800",
  Dessert: "bg-pink-100 text-pink-800",
  Snack: "bg-purple-100 text-purple-800",
};

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&auto=format&fit=crop";

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
}

export default function RecipeCard({ recipe, index = 0 }: RecipeCardProps) {
  const categoryColor =
    CATEGORY_COLORS[recipe.category] ?? "bg-gray-100 text-gray-800";
  const stars = Math.min(5, Math.max(0, Number(recipe.rating)));
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(recipe.recipeId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link
        to="/recipes/$id"
        params={{ id: recipe.recipeId.toString() }}
        data-ocid={`recipe.item.${index + 1}`}
      >
        <div className="bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 h-full flex flex-col">
          <div className="relative h-48 overflow-hidden">
            <img
              src={recipe.imageUrl || PLACEHOLDER_IMAGE}
              alt={recipe.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
              }}
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColor}`}
              >
                {recipe.category}
              </span>
            </div>
            {/* Cook time badge */}
            <div className="absolute bottom-3 left-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-foreground/70 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">
                <Clock className="w-3 h-3" />
                {recipe.cookTime.toString()}m
              </span>
            </div>
            {/* Favorite button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleFavorite(recipe.recipeId);
              }}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all ${
                fav
                  ? "bg-primary/90 text-primary-foreground shadow-md scale-110"
                  : "bg-background/80 text-muted-foreground hover:bg-primary/20 hover:text-primary"
              }`}
              aria-label={fav ? "Remove from favorites" : "Add to favorites"}
              data-ocid={`recipe.toggle.${index + 1}`}
            >
              <Heart className={`w-4 h-4 ${fav ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="font-display font-semibold text-lg text-foreground leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {recipe.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
              {recipe.description}
            </p>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {recipe.servings.toString()}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={`star-${n}`}
                    className={`w-3.5 h-3.5 ${
                      n <= stars
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
