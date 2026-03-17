import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { ChefHat, Heart, Instagram, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "";
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email.trim()) return;
    toast.success("Subscribed! Welcome to RecipeHub.");
    setEmail("");
  };

  return (
    <footer className="bg-foreground text-background mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Brand + Newsletter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <ChefHat className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-lg">
                Recipe<span className="text-primary">Hub</span>
              </span>
            </div>
            <p className="text-sm text-background/70 leading-relaxed mb-5">
              Discover, share, and order ingredients for amazing recipes from
              home cooks and chefs worldwide.
            </p>
            <p className="text-sm font-medium text-background/80 mb-2">
              Get weekly recipes in your inbox
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="you@example.com"
                className="bg-background/10 border-background/20 text-background placeholder:text-background/40 h-9 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                data-ocid="footer.newsletter_input"
              />
              <Button
                size="sm"
                onClick={handleSubscribe}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex-shrink-0"
                data-ocid="footer.subscribe_button"
              >
                Subscribe
              </Button>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-background/50">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Home", to: "/" },
                { label: "All Recipes", to: "/recipes" },
                { label: "Cooking Tips", to: "/tips" },
                { label: "About Us", to: "/about" },
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

          {/* Col 3: Social */}
          <div>
            <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-background/50">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5 text-background" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-background" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary/20 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5 text-background" />
              </a>
            </div>
            <div className="mt-6">
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
        </div>

        <div className="mt-10 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
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
