import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDarkMode } from "@/hooks/useDarkMode";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { useUserNotifications } from "@/hooks/useQueries";
import { Link, useLocation } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  ChefHat,
  Code2,
  Cpu,
  Heart,
  LogOut,
  Menu,
  Moon,
  Plus,
  ShoppingBag,
  Sun,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";
  const { isDark, toggle: toggleDark } = useDarkMode();

  const { data: notifications = [] } = useUserNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Recipes", to: "/recipes" },
    { label: "Tips", to: "/tips" },
    { label: "About", to: "/about" },
  ];

  const authLinks = [
    { label: "Favorites", to: "/favorites" },
    { label: "Orders", to: "/orders" },
  ];

  const devLinks = [
    { label: "Architecture", to: "/architecture", icon: Cpu },
    { label: "API Docs", to: "/api-docs", icon: Code2 },
    { label: "Health", to: "/health", icon: Activity },
  ];

  const navLinks = isAuthenticated
    ? [...publicLinks, ...authLinks]
    : publicLinks;

  const isActive = (path: string) => location.pathname === path;
  const isDevActive = devLinks.some((l) => l.to === location.pathname);

  return (
    <header className="sticky top-0 z-50 w-full bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <ChefHat className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">
            Recipe<span className="text-primary">Hub</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              }`}
              data-ocid="nav.link"
            >
              {link.label}
            </Link>
          ))}

          {/* Dev Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 px-3 ${
                  isDevActive
                    ? "bg-violet-500/10 text-violet-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="nav.dropdown_menu"
              >
                <Cpu className="w-3.5 h-3.5" />
                Dev Tools
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {devLinks.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2"
                    data-ocid="nav.link"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            data-ocid="nav.toggle"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {isAuthenticated && (
            <>
              <Link to="/favorites">
                <Button
                  variant="ghost"
                  size="icon"
                  data-ocid="nav.favorites_button"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                    data-ocid="nav.bell_button"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72"
                  data-ocid="nav.dropdown_menu"
                >
                  {notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((n) => (
                      <DropdownMenuItem
                        key={n.notificationId.toString()}
                        className={`text-sm ${!n.isRead ? "font-medium" : "text-muted-foreground"}`}
                      >
                        {n.message}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  data-ocid="nav.user_menu"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" data-ocid="nav.dropdown_menu">
                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2"
                    data-ocid="nav.profile_link"
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/orders"
                    className="flex items-center gap-2"
                    data-ocid="nav.orders_link"
                  >
                    <ShoppingBag className="w-4 h-4" /> My Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    to="/add-recipe"
                    className="flex items-center gap-2"
                    data-ocid="nav.add_recipe_link"
                  >
                    <Plus className="w-4 h-4" /> Add Recipe
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={clear}
                  className="text-destructive flex items-center gap-2"
                  data-ocid="nav.logout_button"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login_button"
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </Button>
              <Link to="/register">
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  data-ocid="nav.register_button"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-ocid="nav.mobile_menu_button"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-card px-4 pb-4"
          >
            <nav className="flex flex-col gap-1 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                  data-ocid="nav.link"
                >
                  {link.label}
                </Link>
              ))}
              {/* Dev links in mobile */}
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs font-semibold text-muted-foreground px-4 py-1 uppercase tracking-wider">
                  Dev Tools
                </p>
                {devLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? "bg-violet-500/10 text-violet-600"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    data-ocid="nav.link"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
