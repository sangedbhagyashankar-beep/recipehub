import { Link } from "@tanstack/react-router";
import { ChefHat, Heart } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                Recipe<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed">
              Discover, share, and order ingredients for amazing recipes from
              home cooks and professional chefs around the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-background/50">
              Explore
            </h4>
            <ul className="space-y-2">
              {[
                { label: "Home", to: "/" },
                { label: "All Recipes", to: "/recipes" },
                { label: "Add Recipe", to: "/add-recipe" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-background/70 hover:text-primary transition-colors"
                    data-ocid="footer.link"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-background/50">
              Categories
            </h4>
            <ul className="space-y-2">
              {["Breakfast", "Lunch", "Dinner", "Dessert", "Snack"].map(
                (cat) => (
                  <li key={cat}>
                    <span className="text-sm text-background/70">{cat}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © {year}. Built with{" "}
            <Heart className="inline w-3 h-3 text-primary fill-current" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${hostname}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-sm text-background/50">
            Your culinary journey starts here.
          </p>
        </div>
      </div>
    </footer>
  );
}
