import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChefHat, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const { identity, login, loginStatus } = useInternetIdentity();
  const { actor } = useActor();
  const isLoggingIn = loginStatus === "logging-in";

  const [form, setForm] = useState({ name: "", email: "" });
  const [isRegistering, setIsRegistering] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const validate = () => {
    const errs: typeof errors = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
      errs.email = "Invalid email address";
    return errs;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    if (!identity) {
      await login();
      return;
    }
    if (!actor) return;
    setIsRegistering(true);
    try {
      await actor.registerUser(form.name, form.email, "");
      toast.success("Account created successfully!");
      navigate({ to: "/" });
    } catch (_err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-card border border-border rounded-2xl shadow-card p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-md">
              <ChefHat className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              Join RecipeHub
            </h1>
            <p className="text-muted-foreground mt-2">
              Create your account to start sharing recipes
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="space-y-4"
            data-ocid="register.modal"
          >
            {!identity && (
              <div className="bg-accent rounded-xl p-4 text-sm text-muted-foreground">
                First, sign in with Internet Identity, then complete your
                profile below.
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Gordon Ramsay"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                data-ocid="register.name_input"
              />
              {errors.name && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.name_error"
                >
                  {errors.name}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@recipehub.com"
                value={form.email}
                onChange={(e) =>
                  setForm((p) => ({ ...p, email: e.target.value }))
                }
                data-ocid="register.email_input"
              />
              {errors.email && (
                <p
                  className="text-xs text-destructive"
                  data-ocid="register.email_error"
                >
                  {errors.email}
                </p>
              )}
            </div>
            {!identity ? (
              <Button
                type="button"
                onClick={login}
                disabled={isLoggingIn}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="register.login_button"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing
                    in...
                  </>
                ) : (
                  "Connect with Internet Identity"
                )}
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isRegistering}
                className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
                data-ocid="register.submit_button"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            )}
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
              data-ocid="register.login_link"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
