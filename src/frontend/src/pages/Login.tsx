import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChefHat, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";

  useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-md">
              <ChefHat className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Welcome back
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to your RecipeHub account
            </p>
          </div>

          {/* Internet Identity Login */}
          <div className="space-y-4">
            <div className="bg-accent rounded-xl p-4 text-sm text-muted-foreground text-center">
              RecipeHub uses{" "}
              <strong className="text-foreground">Internet Identity</strong> for
              secure, passwordless authentication — no email or password
              required.
            </div>

            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 text-base font-medium"
              data-ocid="login.submit_button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in with Internet Identity"
              )}
            </Button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            New here?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
              data-ocid="login.register_link"
            >
              Create an account
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
