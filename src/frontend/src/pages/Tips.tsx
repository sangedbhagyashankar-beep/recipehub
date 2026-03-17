import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Archive,
  BookOpen,
  Cake,
  Clock,
  Flame,
  Scissors,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

const CATEGORIES = [
  "All",
  "Knife Skills",
  "Pantry",
  "Techniques",
  "Baking",
  "Quick Meals",
];

const CAT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Knife Skills": Scissors,
  Pantry: Archive,
  Techniques: Flame,
  Baking: Cake,
  "Quick Meals": Clock,
};

const TIPS = [
  {
    id: 1,
    category: "Knife Skills",
    title: "The Claw Grip",
    desc: "Curl your fingers inward like a claw to protect fingertips while chopping. Knuckles guide the blade.",
  },
  {
    id: 2,
    category: "Knife Skills",
    title: "Keep Your Knife Sharp",
    desc: "A sharp knife is safer than a dull one. Hone your knife before every use and sharpen monthly.",
  },
  {
    id: 3,
    category: "Knife Skills",
    title: "Let the Knife Do the Work",
    desc: "Use a rocking motion and minimal downward pressure. Speed comes from relaxed wrists.",
  },
  {
    id: 4,
    category: "Pantry",
    title: "Stock Umami Boosters",
    desc: "Keep soy sauce, fish sauce, miso, and Parmesan rinds on hand to add depth to any dish.",
  },
  {
    id: 5,
    category: "Pantry",
    title: "Toast Your Spices",
    desc: "Dry-toast whole spices in a pan for 30 seconds before grinding. It doubles the flavor.",
  },
  {
    id: 6,
    category: "Pantry",
    title: "Salt Your Pasta Water",
    desc: "It should taste like the sea — about 1 tablespoon per quart. This is your only chance to season pasta from within.",
  },
  {
    id: 7,
    category: "Techniques",
    title: "Rest Your Meat",
    desc: "Let cooked meat rest for 5-10 minutes off heat. Juices redistribute and every slice stays moist.",
  },
  {
    id: 8,
    category: "Techniques",
    title: "Mise en Place",
    desc: "Prep all ingredients before cooking. Pros call it mise en place — it prevents burnt garlic and missing steps.",
  },
  {
    id: 9,
    category: "Techniques",
    title: "Deglaze for Flavor",
    desc: "After searing, add wine or stock to the hot pan and scrape up the browned bits — that's pure flavor gold.",
  },
  {
    id: 10,
    category: "Baking",
    title: "Measure by Weight",
    desc: "Flour especially: one cup can vary by 30g depending on how you scoop. A scale makes baking reproducible.",
  },
  {
    id: 11,
    category: "Baking",
    title: "Room-Temperature Butter",
    desc: "Cold butter won't cream properly. Leave it out 30 minutes for perfect cookie and cake texture.",
  },
  {
    id: 12,
    category: "Quick Meals",
    title: "Batch Cook Grains",
    desc: "Cook a big pot of rice, farro, or quinoa on Sundays. Mix into bowls, soups, and salads all week.",
  },
  {
    id: 13,
    category: "Quick Meals",
    title: "The 5-Ingredient Rule",
    desc: "Most fast weeknight meals need only 5 great ingredients. Focus on quality, not quantity.",
  },
  {
    id: 14,
    category: "Techniques",
    title: "Use a Thermometer",
    desc: "Guessing doneness by touch takes years to learn. An instant-read thermometer gives perfect results every time.",
  },
];

const CAT_COLORS: Record<string, string> = {
  "Knife Skills":
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Pantry:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Techniques: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Baking: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  "Quick Meals":
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

export default function Tips() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    return TIPS.filter((t) => {
      const matchesCat =
        activeCategory === "All" || t.category === activeCategory;
      const matchesSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [search, activeCategory]);

  return (
    <main className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-4xl font-bold text-foreground mb-2">
          Cooking Tips & Tricks
        </h1>
        <p className="text-muted-foreground mb-8">
          Level up your kitchen skills with expert advice from professional
          chefs.
        </p>

        <div className="relative max-w-lg mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tips..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            data-ocid="tips.search_input"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => {
            const Icon = cat !== "All" ? CAT_ICONS[cat] : BookOpen;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
                data-ocid="tips.filter.tab"
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {cat}
              </button>
            );
          })}
        </div>
      </motion.div>

      {filtered.length === 0 ? (
        <div className="text-center py-16" data-ocid="tips.empty_state">
          <p className="text-muted-foreground">
            No tips found. Try a different search.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tip, i) => {
            const Icon = CAT_ICONS[tip.category] ?? BookOpen;
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-card-hover transition-shadow"
                data-ocid={`tips.item.${i + 1}`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <Badge
                      className={`text-xs font-medium ${CAT_COLORS[tip.category] ?? ""}`}
                    >
                      {tip.category}
                    </Badge>
                  </div>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {tip.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {tip.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
