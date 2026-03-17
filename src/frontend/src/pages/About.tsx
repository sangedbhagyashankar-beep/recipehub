import {
  BookOpen,
  ChefHat,
  Leaf,
  Search,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { label: "Recipes", value: "10K+" },
  { label: "Food Lovers", value: "50K+" },
  { label: "Orders", value: "100K+" },
];

const STEPS = [
  {
    num: 1,
    icon: Search,
    title: "Search Recipes",
    desc: "Browse thousands of recipes by category, cuisine, or ingredient.",
  },
  {
    num: 2,
    icon: ShoppingCart,
    title: "Order Ingredients",
    desc: "Get fresh ingredient kits delivered right to your door, same day.",
  },
  {
    num: 3,
    icon: ChefHat,
    title: "Cook & Enjoy",
    desc: "Follow step-by-step instructions and serve an amazing meal.",
  },
];

const FEATURES = [
  {
    icon: Leaf,
    title: "Fresh Ingredients",
    desc: "Every ingredient kit is sourced from local farms and delivered within 24 hours.",
  },
  {
    icon: BookOpen,
    title: "Expert Recipes",
    desc: "Recipes crafted by professional chefs and home cooking enthusiasts worldwide.",
  },
  {
    icon: Zap,
    title: "Fast Delivery",
    desc: "Same-day delivery available in most cities. Your meal kit in under 2 hours.",
  },
  {
    icon: Users,
    title: "Community",
    desc: "Join 50,000+ food lovers sharing recipes, tips, and culinary inspiration.",
  },
];

const TEAM = [
  {
    initials: "SA",
    name: "Sofia Alvarez",
    role: "Founder & Head Chef",
    bio: "Michelin-starred chef turned food-tech entrepreneur.",
  },
  {
    initials: "LK",
    name: "Liam Kovacs",
    role: "CTO",
    bio: "Passionate about tech and authentic Hungarian recipes.",
  },
  {
    initials: "MN",
    name: "Maya Nair",
    role: "Head of Community",
    bio: "Food blogger with 10+ years connecting home cooks.",
  },
];

export default function About() {
  return (
    <main>
      {/* Hero */}
      <section
        className="bg-gradient-to-br from-primary/10 via-background to-background py-24 text-center"
        data-ocid="about.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6 max-w-3xl mx-auto leading-tight">
            Bringing the World's Best Recipes to Your Kitchen
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We connect passionate cooks with fresh ingredients and expert
            recipes — making every meal a celebration.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            {STATS.map((s) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
              >
                <p className="font-display text-4xl font-bold">{s.value}</p>
                <p className="text-primary-foreground/70 text-sm mt-1">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="w-7 h-7 text-primary" />
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why RecipeHub */}
      <section className="bg-secondary/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="font-display text-3xl font-bold text-center mb-12">
            Why RecipeHub?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="font-display text-3xl font-bold text-center mb-12">
          Meet the Team
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {TEAM.map((t) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold text-lg">
                  {t.initials}
                </span>
              </div>
              <h3 className="font-display text-lg font-semibold">{t.name}</h3>
              <p className="text-sm text-primary font-medium mb-2">{t.role}</p>
              <p className="text-xs text-muted-foreground">{t.bio}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
