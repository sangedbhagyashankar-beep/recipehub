import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllRecipes } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import { ChevronRight, Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { data: recipes = [], isLoading } = useAllRecipes();

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesCategory =
        activeCategory === "All" || r.category === activeCategory;
      const matchesSearch =
        !search ||
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [recipes, activeCategory, search]);

  return (
    <main>
      <section
        className="relative min-h-[540px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-food.dim_1920x800.jpg')",
        }}
        data-ocid="home.section"
      >
        <div className="absolute inset-0 bg-foreground/55" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary-foreground border border-primary/40 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Discover amazing recipes
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Cook with
              <br />
              <span className="text-primary">Passion</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Explore thousands of recipes from home cooks and chefs. Order
              fresh ingredient kits delivered to your door.
            </p>
            <div className="flex max-w-lg mx-auto gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  className="pl-10 h-12 bg-card/95 border-0 shadow-lg text-foreground"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-ocid="home.search_input"
                />
              </div>
              <Button
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
                data-ocid="home.search_button"
              >
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center gap-2 flex-wrap mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
              data-ocid="home.filter.tab"
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold text-foreground">
            {activeCategory === "All"
              ? "Featured Recipes"
              : `${activeCategory} Recipes`}
          </h2>
          <Link
            to="/recipes"
            className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            data-ocid="home.view_all_link"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="home.loading_state"
          >
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="bg-card rounded-xl overflow-hidden shadow-card"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16" data-ocid="home.empty_state">
            <p className="text-muted-foreground text-lg">
              No recipes found. Try a different search or category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(0, 6).map((recipe, i) => (
              <RecipeCard
                key={recipe.recipeId.toString()}
                recipe={recipe}
                index={i}
              />
            ))}
          </div>
        )}
      </section>

      <section className="bg-primary/10 border-t border-b border-primary/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground mb-4">
            Share Your Favorite Recipe
          </h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Join our community of food lovers and share your culinary creations
            with the world.
          </p>
          <Link to="/add-recipe">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12"
              data-ocid="home.cta_button"
            >
              Add Your Recipe
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
