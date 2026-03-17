import RecipeCard from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllRecipes } from "@/hooks/useQueries";
import { Link } from "@tanstack/react-router";
import {
  BookOpen,
  ChefHat,
  ChevronRight,
  Coffee,
  Croissant,
  IceCream,
  Salad,
  Search,
  ShoppingCart,
  Sparkles,
  Star,
  Utensils,
  UtensilsCrossed,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack"];
const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const CATEGORY_ICONS: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Breakfast: Croissant,
  Lunch: Salad,
  Dinner: UtensilsCrossed,
  Dessert: IceCream,
  Snack: Coffee,
};

const STEPS = [
  {
    icon: Search,
    title: "Browse Recipes",
    desc: "Explore thousands of recipes from pro chefs and home cooks.",
  },
  {
    icon: ShoppingCart,
    title: "Order Ingredients",
    desc: "Get fresh ingredient kits delivered to your door same day.",
  },
  {
    icon: Utensils,
    title: "Cook & Enjoy",
    desc: "Follow easy step-by-step instructions and serve a great meal.",
  },
];

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
      {/* Hero */}
      <section
        className="relative min-h-[560px] flex items-center justify-center bg-cover bg-center"
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

      {/* Stats Banner */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { icon: BookOpen, value: "10K+", label: "Recipes" },
              { icon: ChefHat, value: "50K+", label: "Chefs" },
              { icon: ShoppingCart, value: "100K+", label: "Orders Delivered" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <stat.icon className="w-7 h-7 text-primary-foreground/70" />
                <div>
                  <p className="font-display text-2xl font-bold">
                    {stat.value}
                  </p>
                  <p className="text-primary-foreground/70 text-xs">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="font-display text-3xl font-bold text-center mb-10">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="bg-secondary/40 py-12">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-8">
            Popular Categories
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 max-w-2xl mx-auto">
            {CATEGORIES.filter((c) => c !== "All").map((cat) => {
              const Icon = CATEGORY_ICONS[cat] ?? Utensils;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    document
                      .getElementById("recipes-grid")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground border-primary shadow-md"
                      : "bg-card border-border hover:border-primary/40 hover:shadow-card"
                  }`}
                  data-ocid="home.filter.tab"
                >
                  <Icon className="w-7 h-7" />
                  <span className="text-xs font-medium">{cat}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Chef Spotlight */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="font-display text-2xl font-bold text-primary-foreground">
              SA
            </span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-primary" /> Chef Spotlight
            </div>
            <h3 className="font-display text-2xl font-bold mb-1">
              Sofia Alvarez
            </h3>
            <p className="text-muted-foreground text-sm mb-3">
              Michelin-starred chef specializing in modern Mediterranean
              cuisine. 15 years at top restaurants across Europe.
            </p>
            <Link to="/recipes">
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5"
                data-ocid="home.chef_spotlight_button"
              >
                View Her Recipes <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section id="recipes-grid" className="container mx-auto px-4 pb-16">
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

      {/* CTA */}
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
